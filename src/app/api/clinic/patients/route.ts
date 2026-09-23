// GET /api/clinic/patients — Mock patient roster for the clinic dashboard.
//
// Returns a list of patients with ABHA IDs, last visit, clinical
// health score (0-100), and risk-level classification. In production
// this would be backed by a Prisma query against the clinic's patient
// table scoped to the authenticated clinician's tenant.
import { NextResponse } from 'next/server';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

interface ClinicPatient {
  id: string;
  name: string;
  abhaId: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  phone: string;
  lastVisit: string;
  healthScore: number;
  riskLevel: RiskLevel;
  conditions: string[];
}

const PATIENTS: ClinicPatient[] = [
  {
    id: 'p1',
    name: 'Ananya Sharma',
    abhaId: '98-7654-3210-1234',
    age: 54,
    gender: 'F',
    phone: '+91 98765 43210',
    lastVisit: '2025-01-12',
    healthScore: 62,
    riskLevel: 'high',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
  },
  {
    id: 'p2',
    name: 'Rajesh Kumar',
    abhaId: '76-5432-1098-2345',
    age: 47,
    gender: 'M',
    phone: '+91 98123 45678',
    lastVisit: '2025-01-15',
    healthScore: 78,
    riskLevel: 'moderate',
    conditions: ['Hypothyroidism'],
  },
  {
    id: 'p3',
    name: 'Priya Iyer',
    abhaId: '54-3210-9876-3456',
    age: 31,
    gender: 'F',
    phone: '+91 99887 76655',
    lastVisit: '2025-01-18',
    healthScore: 91,
    riskLevel: 'low',
    conditions: ['Migraine'],
  },
  {
    id: 'p4',
    name: 'Mohammed Ali',
    abhaId: '32-1098-7654-4567',
    age: 68,
    gender: 'M',
    phone: '+91 90011 22334',
    lastVisit: '2025-01-10',
    healthScore: 41,
    riskLevel: 'critical',
    conditions: ['CKD Stage 3', 'Coronary Artery Disease', 'Diabetes'],
  },
  {
    id: 'p5',
    name: 'Sneha Reddy',
    abhaId: '10-9876-5432-5678',
    age: 39,
    gender: 'F',
    phone: '+91 91234 56789',
    lastVisit: '2025-01-19',
    healthScore: 84,
    riskLevel: 'low',
    conditions: ['PCOS'],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: PATIENTS.length,
    patients: PATIENTS,
    // Mock endpoint — flag in the response so consumers know not to
    // treat the data as real clinical records.
    mock: true,
    generatedAt: new Date().toISOString(),
  });
}
