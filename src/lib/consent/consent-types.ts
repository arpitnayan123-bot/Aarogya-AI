// ============================================
// AAROGYA AI — PRIVACY & CONSENT FRAMEWORK (TYPES)
//
// Defines the consent types Aarogya tracks + the ConsentRecord
// structure stored both client-side (localStorage) and server-side
// (eventually persisted via Prisma once a Consent model is added).
//
// Consent is granular and purpose-specific — never blanket. The
// two required consents (HEALTH_DATA_PROCESSING + AI_ANALYSIS) are
// the baseline required to use Aarogya at all. The two optional
// consents (RESEARCH_PARTICIPATION + MARKETING_COMMUNICATIONS)
// are off-by-default and revocable at any time.
//
// Aligned with:
//   • DPDP Act 2023 (India) — purpose limitation, consent, withdrawal
//   • ABDM Consent Manager spec — data-sharing consent artefacts
//   • GDPR Article 7 — conditions for consent (where applicable)
// ============================================

/**
 * The five consent purposes Aarogya tracks.
 * String-union (not enum) so the values serialise cleanly to JSON.
 */
export type ConsentType =
  | 'HEALTH_DATA_PROCESSING'
  | 'AI_ANALYSIS'
  | 'RESEARCH_PARTICIPATION'
  | 'MARKETING_COMMUNICATIONS'
  | 'THIRD_PARTY_SHARING';

/**
 * Human-readable metadata for each consent type — used by the UI.
 */
export interface ConsentMetadata {
  type: ConsentType;
  title: string;
  description: string;
  required: boolean;
  defaultChecked: boolean;
}

export const CONSENT_METADATA: ConsentMetadata[] = [
  {
    type: 'HEALTH_DATA_PROCESSING',
    title: 'Health Data Processing',
    description:
      'I authorise Aarogya AI to collect, store, and process my health information (symptoms, vitals, lab reports, device readings) for the purpose of providing personalised health insights. Data is encrypted at rest and in transit.',
    required: true,
    defaultChecked: true,
  },
  {
    type: 'AI_ANALYSIS',
    title: 'AI Analysis of Health Data',
    description:
      'I consent to my health data being analysed by Aarogya\'s AI models (symptom checker, lab report analyser, diet planner, image analysis) to generate clinical insights. All AI outputs include a medical disclaimer and are not a substitute for professional medical advice.',
    required: true,
    defaultChecked: true,
  },
  {
    type: 'RESEARCH_PARTICIPATION',
    title: 'Anonymous Research Participation',
    description:
      'I consent to my de-identified, anonymised data being used for public-health research and model improvement. Data is stripped of name, contact, ABHA, and direct identifiers before research use. I can opt out at any time without affecting my care.',
    required: false,
    defaultChecked: false,
  },
  {
    type: 'MARKETING_COMMUNICATIONS',
    title: 'Marketing & Health Tips Communications',
    description:
      'I consent to receiving occasional emails/SMS about new Aarogya features, preventive health campaigns, and wellness tips. I can unsubscribe at any time.',
    required: false,
    defaultChecked: false,
  },
  {
    type: 'THIRD_PARTY_SHARING',
    title: 'Third-Party Data Sharing',
    description:
      'I consent to my health data being shared with specific third parties I authorise (e.g. my doctor, a lab, a wearable app). Sharing happens only via explicit, per-request ABDM consent artefacts — Aarogya never sells data.',
    required: false,
    defaultChecked: false,
  },
];

/**
 * Status of a single consent decision.
 *   • GRANTED  → user has opted in
 *   • DENIED   → user has explicitly opted out
 *   • PENDING  → user has not yet decided (only valid for optional types)
 */
export type ConsentStatus = 'GRANTED' | 'DENIED' | 'PENDING';

/**
 * A single consent decision for a single purpose.
 */
export interface ConsentDecision {
  type: ConsentType;
  status: ConsentStatus;
  /** RFC 3339 timestamp of the decision. */
  timestamp: string;
  /** Free-text version of the consent text shown (for audit trail). */
  consentTextVersion?: string;
}

/**
 * Full consent record — the unit of persistence.
 */
export interface ConsentRecord {
  /** Stable identifier (user id or anonymous session id). */
  userId: string;
  /** ISO timestamp of the most recent update. */
  recordedAt: string;
  /** IP address of the consent event (server-captured). */
  ipAddress?: string;
  /** User agent string at the time of consent. */
  userAgent?: string;
  /** Version of the privacy policy in effect. */
  policyVersion: string;
  /** Per-purpose decisions. */
  decisions: ConsentDecision[];
}

/** Current privacy-policy version — bump when the policy changes. */
export const CURRENT_POLICY_VERSION = '1.0.0';

/** localStorage key under which the client caches the consent record. */
export const CONSENT_STORAGE_KEY = 'aarogya_consent_record_v1';

/**
 * Helper: was consent for a given purpose granted in this record?
 */
export function hasConsent(
  record: ConsentRecord | null | undefined,
  type: ConsentType,
): boolean {
  if (!record) return false;
  const d = record.decisions.find((x) => x.type === type);
  return d?.status === 'GRANTED';
}

/**
 * Helper: do all required consents exist and are they granted?
 */
export function hasRequiredConsents(
  record: ConsentRecord | null | undefined,
): boolean {
  if (!record) return false;
  const required = CONSENT_METADATA.filter((m) => m.required);
  return required.every((m) => hasConsent(record, m.type));
}

/**
 * Build a fresh ConsentRecord from a checkbox-state map.
 */
export function buildConsentRecord(
  userId: string,
  granted: Record<ConsentType, boolean>,
  ctx?: { ipAddress?: string; userAgent?: string },
): ConsentRecord {
  const now = new Date().toISOString();
  return {
    userId,
    recordedAt: now,
    ipAddress: ctx?.ipAddress,
    userAgent: ctx?.userAgent,
    policyVersion: CURRENT_POLICY_VERSION,
    decisions: CONSENT_METADATA.map((m) => ({
      type: m.type,
      status: granted[m.type]
        ? 'GRANTED'
        : m.required
          ? 'DENIED'
          : 'DENIED',
      timestamp: now,
      consentTextVersion: CURRENT_POLICY_VERSION,
    })),
  };
}
