// ============================================
// AAROGYA AI — CLINIC B2B DASHBOARD
//
// 'use client' page composed of three panels:
//   1. Patient list (table with ABHA ID, last visit, health
//      score, color-coded risk badge, Open button)
//   2. Today's appointments
//   3. Critical alerts from the last 24h
//
// Premium emerald/teal styling, mock data, fetches
// /api/clinic/patients for the patient list.
// ============================================

'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  CalendarDays,
  AlertTriangle,
  Activity,
  ChevronRight,
  Phone,
  Clock,
  RefreshCw,
  Stethoscope,
  HeartPulse,
  Droplet,
  Brain,
} from 'lucide-react';

// --------------------------------------------
// Types
// --------------------------------------------
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

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'no-show';
  mode: 'in-person' | 'teleconsult';
}

interface ClinicAlert {
  id: string;
  patientName: string;
  type: 'critical-lab' | 'vitals' | 'missed-medication' | 'ai-flag';
  message: string;
  timestamp: string;
  severity: 'high' | 'critical';
}

// --------------------------------------------
// Mock data (fallback if API is unavailable)
// --------------------------------------------
const FALLBACK_PATIENTS: ClinicPatient[] = [
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

const TODAY_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    time: '09:00',
    patientName: 'Ananya Sharma',
    reason: 'Diabetes follow-up + HbA1c review',
    status: 'completed',
    mode: 'in-person',
  },
  {
    id: 'a2',
    time: '10:30',
    patientName: 'Mohammed Ali',
    reason: 'CKD progression review, eGFR trending down',
    status: 'in-progress',
    mode: 'in-person',
  },
  {
    id: 'a3',
    time: '12:00',
    patientName: 'Rajesh Kumar',
    reason: 'Thyroid dose adjustment',
    status: 'scheduled',
    mode: 'teleconsult',
  },
  {
    id: 'a4',
    time: '14:30',
    patientName: 'Sneha Reddy',
    reason: 'PCOS lifestyle counselling',
    status: 'scheduled',
    mode: 'teleconsult',
  },
  {
    id: 'a5',
    time: '16:00',
    patientName: 'Priya Iyer',
    reason: 'Migraine prophylaxis check-in',
    status: 'scheduled',
    mode: 'in-person',
  },
];

const RECENT_ALERTS: ClinicAlert[] = [
  {
    id: 'al1',
    patientName: 'Mohammed Ali',
    type: 'critical-lab',
    message: 'eGFR dropped from 42 → 36 mL/min/1.73m² in 14 days. K+ = 5.4 mmol/L.',
    timestamp: '2h ago',
    severity: 'critical',
  },
  {
    id: 'al2',
    patientName: 'Ananya Sharma',
    type: 'vitals',
    message: 'Home BP average 162/98 mmHg over 7 days despite 3 antihypertensives.',
    timestamp: '5h ago',
    severity: 'high',
  },
  {
    id: 'al3',
    patientName: 'Rajesh Kumar',
    type: 'missed-medication',
    message: 'Missed Levothyroxine 4 of last 7 days (smart-pack data).',
    timestamp: '8h ago',
    severity: 'high',
  },
  {
    id: 'al4',
    patientName: 'Mohammed Ali',
    type: 'ai-flag',
    message:
      'Aarogya AI:troponin trend rising,chest X-ray shows pulmonary congestion. Consider urgent cardiology consult.',
    timestamp: '11h ago',
    severity: 'critical',
  },
];

// --------------------------------------------
// Helpers
// --------------------------------------------
const riskBadge: Record<RiskLevel, string> = {
  low: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  moderate: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  high: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
  critical: 'bg-red-100 text-red-800 ring-1 ring-red-200',
};

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function scoreBar(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

const apptStatusStyles: Record<Appointment['status'], string> = {
  scheduled: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
  'in-progress': 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  completed: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  'no-show': 'bg-red-100 text-red-800 ring-1 ring-red-200',
};

const alertTypeIcons = {
  'critical-lab': Droplet,
  vitals: HeartPulse,
  'missed-medication': Clock,
  'ai-flag': Brain,
} as const;

// --------------------------------------------
// Page component
// --------------------------------------------
export default function ClinicDashboardPage() {
  const [patients, setPatients] = useState<ClinicPatient[]>(FALLBACK_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPatients() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clinic/patients', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { patients?: ClinicPatient[] };
      if (data.patients && data.patients.length > 0) {
        setPatients(data.patients);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load patients');
      // Keep fallback data
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const criticalCount = RECENT_ALERTS.filter((a) => a.severity === 'critical').length;
  const avgScore = Math.round(
    patients.reduce((s, p) => s + p.healthScore, 0) / patients.length,
  );

  return (
    <div className="space-y-6">
      {/* Top KPI row */}
      <section className="grid gap-4 md:grid-cols-4">
        <KpiCard
          icon={<Users className="h-4 w-4" />}
          label="Active Patients"
          value={patients.length.toString()}
          accent="emerald"
        />
        <KpiCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Today's Appointments"
          value={TODAY_APPOINTMENTS.length.toString()}
          accent="sky"
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Critical Alerts (24h)"
          value={RECENT_ALERTS.length.toString()}
          subValue={`${criticalCount} critical`}
          accent="red"
        />
        <KpiCard
          icon={<Activity className="h-4 w-4" />}
          label="Avg Health Score"
          value={avgScore.toString()}
          accent="teal"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient list panel — spans 2 cols */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Patient Panel
              </h2>
            </div>
            <button
              type="button"
              onClick={loadPatients}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          {error && (
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-700">
              Showing cached patients — API: {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">Patient Name</th>
                  <th className="px-5 py-3 font-semibold">ABHA ID</th>
                  <th className="px-5 py-3 font-semibold">Last Visit</th>
                  <th className="px-5 py-3 font-semibold">Health Score</th>
                  <th className="px-5 py-3 font-semibold">Risk Level</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/40 transition">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.age}y · {p.gender} · {p.conditions.join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-slate-700">
                        {p.abhaId}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.lastVisit}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${scoreColor(p.healthScore)}`}>
                          {p.healthScore}
                        </span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full ${scoreBar(p.healthScore)}`}
                            style={{ width: `${p.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold capitalize ${riskBadge[p.riskLevel]}`}
                      >
                        {p.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition"
                      >
                        Open
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Today's appointments + alerts stack — 1 col */}
        <div className="space-y-6">
          {/* Today's appointments */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Today&apos;s Appointments
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {TODAY_APPOINTMENTS.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-12 flex-col items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <span className="text-xs font-bold leading-none">
                        {a.time}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide">
                        IST
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-slate-900">
                          {a.patientName}
                        </p>
                        <span
                          className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold capitalize ${apptStatusStyles[a.status]}`}
                        >
                          {a.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">{a.reason}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Stethoscope className="h-3 w-3" />
                        {a.mode === 'teleconsult' ? 'Teleconsult' : 'In-person'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Critical alerts */}
          <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-red-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Critical Alerts (24h)
                </h2>
              </div>
              <span className="inline-flex h-6 items-center rounded-full bg-red-100 px-2 text-xs font-semibold text-red-700">
                {RECENT_ALERTS.length}
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {RECENT_ALERTS.map((alert) => {
                const Icon = alertTypeIcons[alert.type];
                return (
                  <li key={alert.id} className="px-5 py-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          alert.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {alert.patientName}
                          </p>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------
// KPI card sub-component (file-local)
// --------------------------------------------
function KpiCard({
  icon,
  label,
  value,
  subValue,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  accent: 'emerald' | 'sky' | 'red' | 'teal';
}) {
  const accentMap = {
    emerald: 'from-emerald-500 to-teal-600',
    sky: 'from-sky-500 to-blue-600',
    red: 'from-red-500 to-rose-600',
    teal: 'from-teal-500 to-cyan-600',
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accentMap[accent]} text-white shadow-sm`}
        >
          {icon}
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {subValue && (
          <span className="text-xs font-medium text-slate-500">{subValue}</span>
        )}
      </div>
    </div>
  );
}
