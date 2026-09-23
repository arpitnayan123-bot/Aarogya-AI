// POST /api/consent/record — Record a user's consent decisions
//
// Accepts a JSON body of consent decisions and echoes them back as
// a ConsentRecord. The response includes a `note` field explaining
// that full DB persistence requires a Prisma migration.
//
// Why echo + note (not silent persistence)?
//   • The Prisma schema in this branch does not yet include a
//     ConsentRecord model — adding it is a separate migration step.
//   • Until the migration lands, the client caches the record in
//     localStorage (see @/lib/consent/consent-types.ts → CONSENT_STORAGE_KEY)
//     AND the server validates the payload + stamps an audit timestamp
//     so the architecture is correct end-to-end and only the DB write
//     is left to wire up.
//
// Headers we capture for audit:
//   • x-forwarded-for   (real client IP behind Caddy)
//   • user-agent
//
// All consent is granular and revocable. The two required consents
// (HEALTH_DATA_PROCESSING + AI_ANALYSIS) MUST be granted for the
// response to be `success: true`; otherwise we return 400.
import { NextRequest, NextResponse } from 'next/server';
import {
  CONSENT_METADATA,
  CURRENT_POLICY_VERSION,
  buildConsentRecord,
  type ConsentRecord,
  type ConsentType,
} from '@/lib/consent/consent-types';

interface ConsentRequestBody {
  userId?: string;
  decisions?: Partial<Record<ConsentType, boolean>>;
}

// In-memory log of consent records (resets on server restart).
// In production this is replaced by `db.consentRecord.create()`.
const inMemoryLog: ConsentRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ConsentRequestBody;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Request body must be a JSON object.' },
        { status: 400 },
      );
    }

    const userId =
      typeof body.userId === 'string' && body.userId.trim().length > 0
        ? body.userId.trim()
        : `anon-${Date.now()}`;

    const decisions = body.decisions ?? {};

    // Validate: every known consent type must be a boolean (or omitted).
    const knownTypes = new Set<ConsentType>(
      CONSENT_METADATA.map((m) => m.type),
    );
    for (const key of Object.keys(decisions)) {
      if (!knownTypes.has(key as ConsentType)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unknown consent type: ${key}`,
          },
          { status: 400 },
        );
      }
      const v = decisions[key as ConsentType];
      if (typeof v !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            error: `Consent value for ${key} must be a boolean.`,
          },
          { status: 400 },
        );
      }
    }

    // Required consents gate
    const missingRequired = CONSENT_METADATA.filter(
      (m) => m.required && decisions[m.type] !== true,
    );
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Required consents not granted: ${missingRequired.map((m) => m.type).join(', ')}`,
          missing: missingRequired.map((m) => m.type),
        },
        { status: 400 },
      );
    }

    // Build the full record (defaults optional types to false if omitted).
    const granted = {} as Record<ConsentType, boolean>;
    for (const m of CONSENT_METADATA) {
      granted[m.type] = decisions[m.type] === true;
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : undefined;
    const userAgent = req.headers.get('user-agent') ?? undefined;

    const record = buildConsentRecord(userId, granted, {
      ipAddress,
      userAgent,
    });

    // Append to the in-memory log (replaceable with Prisma in production).
    inMemoryLog.push(record);
    // Keep the log bounded — only retain the latest 1000 records.
    if (inMemoryLog.length > 1000) inMemoryLog.shift();

    return NextResponse.json({
      success: true,
      record,
      policyVersion: CURRENT_POLICY_VERSION,
      note:
        'Consent record validated and stored in-memory. DB persistence requires a Prisma migration adding a ConsentRecord model.',
      persisted: false,
    });
  } catch (error) {
    console.error('Consent record error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to record consent';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// GET — introspection endpoint (admin/debug): returns the count of
// in-memory consent records, not the records themselves (privacy).
export async function GET() {
  return NextResponse.json({
    success: true,
    count: inMemoryLog.length,
    policyVersion: CURRENT_POLICY_VERSION,
    note:
      'In-memory log only. Full audit trail requires DB persistence (Prisma).',
  });
}
