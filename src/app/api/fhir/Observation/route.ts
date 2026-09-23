// GET /api/fhir/Observation?patient={id} — FHIR R4 Observation search
//
// Returns a FHIR Bundle (searchset) of Observations for the given
// patient ID. Uses mock vital-signs data for demonstration.
//
// Resources returned:
//   • Heart rate        (LOINC 8867-4)   ~72 bpm
//   • BP systolic       (LOINC 8480-6)   ~118 mmHg
//   • BP diastolic      (LOINC 8462-4)   ~76 mmHg
//   • Fasting glucose   (LOINC 2339-0)   ~92 mg/dL
//
// Content-Type is `application/fhir+json` per the FHIR spec.
//
// NOTE: Replace `getMockObservations` with a DB query when the
// Prisma HealthMetric model is wired up.
import { NextRequest, NextResponse } from 'next/server';
import {
  buildFHIRObservation,
  LOINC_CODES,
  UCUM_UNITS,
  type FHIRObservation,
} from '@/lib/fhir/fhir-utils';

interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset';
  total: number;
  entry: Array<{ fullUrl: string; resource: FHIRObservation }>;
}

function isoDaysAgo(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function getMockObservations(patientId: string): FHIRObservation[] {
  // If patientId is unknown we still return the demo set so the
  // endpoint is useful for exploration.
  const observations: FHIRObservation[] = [];
  const now = Date.now();

  // 3 days of heart-rate readings
  for (let i = 3; i >= 1; i--) {
    const ts = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    observations.push(
      buildFHIRObservation(
        patientId,
        LOINC_CODES.HEART_RATE,
        'Heart rate',
        70 + ((i * 7) % 11), // 70–80 bpm deterministic
        UCUM_UNITS.HEART_RATE,
        ts,
      ),
    );
  }

  // 2 BP readings
  observations.push(
    buildFHIRObservation(
      patientId,
      LOINC_CODES.BP_SYSTOLIC,
      'Systolic blood pressure',
      118,
      UCUM_UNITS.BP,
      isoDaysAgo(2, 8, 30),
    ),
  );
  observations.push(
    buildFHIRObservation(
      patientId,
      LOINC_CODES.BP_DIASTOLIC,
      'Diastolic blood pressure',
      76,
      UCUM_UNITS.BP,
      isoDaysAgo(2, 8, 30),
    ),
  );

  // 1 fasting glucose
  observations.push(
    buildFHIRObservation(
      patientId,
      LOINC_CODES.FASTING_GLUCOSE,
      'Glucose [Mass/volume] in Blood --12 hours fasting',
      92,
      UCUM_UNITS.GLUCOSE,
      isoDaysAgo(1, 7, 15),
    ),
  );

  // Assign ids so fullUrl is stable.
  observations.forEach((o, i) => {
    o.id = `${patientId}-obs-${i + 1}`;
  });

  return observations;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patient = searchParams.get('patient') || 'aarogya-demo-001';
  const code = searchParams.get('code'); // optional LOINC filter

  let observations = getMockObservations(patient);

  // Optional LOINC code filter (comma-separated).
  if (code) {
    const codes = code.split(',').map((c) => c.trim()).filter(Boolean);
    observations = observations.filter((o) =>
      o.code.coding.some((c) => codes.includes(c.code)),
    );
  }

  const bundle: FHIRBundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: observations.length,
    entry: observations.map((o) => ({
      fullUrl: `https://aarogya.ai/fhir/Observation/${o.id}`,
      resource: o,
    })),
  };

  return new NextResponse(JSON.stringify(bundle), {
    status: 200,
    headers: {
      'Content-Type': 'application/fhir+json',
      'Cache-Control': 'no-store',
    },
  });
}
