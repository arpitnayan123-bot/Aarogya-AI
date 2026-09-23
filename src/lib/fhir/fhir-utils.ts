// ============================================
// AAROGYA AI — FHIR R4 RESOURCE BUILDERS
//
// Helpers to construct valid FHIR R4 resources from internal
// Aarogya data structures. Output is compliant with:
//   • HL7 FHIR R4 (4.0.1)
//   • US Core / India FHIR profiles where applicable
//
// Resources produced:
//   • buildFHIRPatient()      → Patient resource
//   • buildFHIRObservation()  → Observation resource (LOINC-coded)
//
// These are used by the /api/fhir/* endpoints to expose a
// FHIR-conformant API layer for EHR/ABDM interoperability.
// ============================================

/**
 * Minimal FHIR R4 Patient resource (subset of fields Aarogya uses).
 * Spec: https://hl7.org/fhir/R4/patient.html
 */
export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: Array<{
    use: 'official' | 'usual' | 'nickname';
    text?: string;
    family?: string;
    given?: string[];
  }>;
  birthDate?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | 'unknown';
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
  identifier?: Array<{
    system: string;
    value: string;
  }>;
  active?: boolean;
}

/**
 * Minimal FHIR R4 Observation resource (Quantity-value type).
 * Spec: https://hl7.org/fhir/R4/observation.html
 */
export interface FHIRObservation {
  resourceType: 'Observation';
  id?: string;
  status: 'final' | 'preliminary' | 'registered' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category: Array<{
    coding: Array<{ system: string; code: string; display: string }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
}

export interface FHIRPatientInput {
  id: string;
  name: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  abhaNumber?: string;
}

/**
 * Build a FHIR R4 Patient resource from a Aarogya user record.
 *
 *   • `name` is split into given/family on first space (best-effort).
 *   • If `abhaNumber` is supplied it is added as an identifier under
 *     the official ABDM system URI.
 *   • `meta.lastUpdated` is set to "now" so consumers can sort.
 */
export function buildFHIRPatient(user: FHIRPatientInput): FHIRPatient {
  const trimmedName = (user.name || '').trim();
  const firstSpace = trimmedName.indexOf(' ');
  const given =
    firstSpace >= 0 ? [trimmedName.slice(0, firstSpace)] : [trimmedName];
  const family = firstSpace >= 0 ? trimmedName.slice(firstSpace + 1) : '';

  const patient: FHIRPatient = {
    resourceType: 'Patient',
    id: user.id,
    name: [
      {
        use: 'official',
        text: trimmedName,
        given,
        ...(family ? { family } : {}),
      },
    ],
    active: true,
    meta: {
      versionId: '1',
      lastUpdated: new Date().toISOString(),
      profile: ['https://nexus.ayushman.gov.in/fhir/r4/StructureDefinition/Patient'],
    },
  };

  if (user.birthDate) {
    patient.birthDate = user.birthDate;
  }
  if (user.gender) {
    patient.gender = user.gender;
  }
  if (user.abhaNumber) {
    patient.identifier = [
      {
        system: 'https://healthid.abdm.gov.in/abha-number',
        value: user.abhaNumber,
      },
    ];
  }

  return patient;
}

/**
 * Build a FHIR R4 Observation resource for a numeric vital.
 *
 *   • `status` defaults to 'final'.
 *   • `code.coding[0]` is the LOINC code (system: http://loinc.org).
 *   • `subject.reference` = `Patient/{userId}`.
 *   • `effectiveDateTime` defaults to "now".
 *   • `valueQuantity` uses the UCUM unit system (http://unitsofmeasure.org).
 *
 * @param userId    Patient subject ID
 * @param loincCode LOINC code (e.g. "8867-4" for heart rate)
 * @param displayName Human-readable display (e.g. "Heart rate")
 * @param value     Numeric value
 * @param unit      UCUM unit (e.g. "{beats}/min", "mm[Hg]", "mg/dL")
 * @param timestamp ISO datetime string (defaults to now)
 */
export function buildFHIRObservation(
  userId: string,
  loincCode: string,
  displayName: string,
  value: number,
  unit: string,
  timestamp?: string,
): FHIRObservation {
  return {
    resourceType: 'Observation',
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: loincCode,
          display: displayName,
        },
      ],
      text: displayName,
    },
    subject: {
      reference: `Patient/${userId}`,
    },
    effectiveDateTime: timestamp ?? new Date().toISOString(),
    valueQuantity: {
      value: typeof value === 'number' ? value : Number(value),
      unit,
      system: 'http://unitsofmeasure.org',
      code: unit,
    },
  };
}

/**
 * LOINC codes used across Aarogya's FHIR layer.
 * Exported so callers don't need to hard-code magic strings.
 */
export const LOINC_CODES = {
  HEART_RATE: '8867-4',
  BP_SYSTOLIC: '8480-6',
  BP_DIASTOLIC: '8462-4',
  FASTING_GLUCOSE: '2339-0',
  BMI: '39156-5',
  SLEEP_DURATION: '93832-4',
  STEPS: '41950-7',
} as const;

/**
 * Standard UCUM units used across Aarogya's FHIR layer.
 */
export const UCUM_UNITS = {
  HEART_RATE: '{beats}/min',
  BP: 'mm[Hg]',
  GLUCOSE: 'mg/dL',
  BMI: 'kg/m2',
  SLEEP: 'h',
  STEPS: '{steps}',
} as const;
