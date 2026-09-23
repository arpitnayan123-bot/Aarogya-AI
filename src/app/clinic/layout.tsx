// ============================================
// AAROGYA AI — CLINIC MODE LAYOUT
//
// Server component. Provides a dedicated header for
// clinic users (doctors / clinic admins) and a persistent
// "Clinic Mode" banner so it is always visually clear
// that the user is in the B2B clinical interface, not
// the consumer app.
// ============================================

import type { Metadata } from 'next';
import { Stethoscope, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aarogya for Clinics — B2B Dashboard',
  description:
    'Clinic workspace for Aarogya AI: patient panel, appointments, critical alerts.',
};

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clinic Mode banner — always visible */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-1.5 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          You are in Clinic Mode — patient data is governed by ABDM, DPDP Act 2023 &amp; CDSCO MDR 2017.
        </div>
      </div>

      {/* Clinic header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              Aarogya for Clinics
            </h1>
            <p className="text-xs text-slate-500">
              B2B clinical workspace
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              HIPAA / ABDM Compliant
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit Clinic Mode
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
