// GET /api/fhir/Patient/[id] — FHIR R4 Patient resource
//
// Returns a single Patient resource as application/fhir+json.
// Per FHIR spec, a single resource is returned directly (not a Bundle)
// when the client requests /Patient/{id}.
//
// NOTE: This endpoint uses a MOCK user lookup (in-memory) because the
// Prisma schema at build time does not yet include a User model with
// the required FHIR fields. When the DB model is added, replace
// `getMockPatient` with a `db.user.findUnique()` call.
import { NextRequest, NextResponse } from 'next/server';
import { buildFHIRPatient, type FHIRPatient } from '@/lib/fhir/fhir-utils';

interface MockUser {
  id: string;
  name: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  abhaNumber?: string;
}

// In-memory mock patient registry — replace with a DB lookup.
const MOCK_USERS: Record<string, MockUser> = {
  'aarogya-demo-001': {
    id: 'aarogya-demo-001',
    name: 'Aarav Sharma',
    birthDate: '1991-04-12',
    gender: 'male',
    abhaNumber: '91-1234-5678-9012',
  },
  'aarogya-demo-002': {
    id: 'aarogya-demo-002',
    name: 'Priya Iyer',
    birthDate: '1996-11-23',
    gender: 'female',
  },
  'aarogya-demo-003': {
    id: 'aarogya-demo-003',
    name: 'Rohan Mehta',
    birthDate: '1988-07-01',
    gender: 'male',
  },
};

function getMockPatient(id: string): FHIRPatient | null {
  // Default the unknown IDs to a sample patient so the endpoint is
  // demo-friendly (callers see a real FHIR resource, not a 404).
  const user = MOCK_USERS[id] ?? {
    id,
    name: 'Anonymous Aarogya Patient',
    gender: 'unknown' as const,
  };
  return buildFHIRPatient(user);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const patient = getMockPatient(id);

  if (!patient) {
    return new NextResponse(
      JSON.stringify({
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'not-found',
            diagnostics: `Patient with id "${id}" was not found.`,
          },
        ],
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/fhir+json' },
      },
    );
  }

  return new NextResponse(JSON.stringify(patient), {
    status: 200,
    headers: {
      'Content-Type': 'application/fhir+json',
      'Cache-Control': 'no-store',
    },
  });
}
