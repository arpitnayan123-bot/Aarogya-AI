// ============================================
// AAROGYA AI — CLINICAL RESEARCH LANDING PAGE
//
// Server component (no 'use client'). Static SSR.
// Sections:
//   1. Centered header — Clinical Research label,
//      Aarogya AI Research Program heading, India-first
//      studies description.
//   2. 3 principle cards — India-First, Peer-Reviewed,
//      ICMR-Aligned.
//   3. 3 planned studies (AAROGYA-DM1, AAROGYA-CV1,
//      AAROGYA-MH1) with status badges.
//   4. 2 publications in preparation.
//   5. CTA for hospital partnerships.
// ============================================

import type { Metadata } from 'next';
import {
  FlaskConical,
  Globe2,
  BookOpenCheck,
  HeartPulse,
  Brain,
  Activity,
  Mail,
  ArrowRight,
  Microscope,
  Stethoscope,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clinical Research — Aarogya AI',
  description:
    'Aarogya AI Research Program: India-first, peer-reviewed, ICMR-aligned clinical studies on AI-driven diabetes, cardiovascular, and vernacular mental-health risk prediction.',
};

// --------------------------------------------
// Principle cards
// --------------------------------------------
const principles = [
  {
    icon: Globe2,
    title: 'India-First',
    body:
      'Every study is designed around Indian genotype, phenotype, diet, and care-pathway realities — not retrofitted from Western cohorts.',
  },
  {
    icon: BookOpenCheck,
    title: 'Peer-Reviewed',
    body:
      'Pre-registered protocols, open methodology, and submission to Q1 medical AI journals. Datasets released under FAIR principles wherever consent allows.',
  },
  {
    icon: HeartPulse,
    title: 'ICMR-Aligned',
    body:
      'Study designs follow ICMR National Ethical Guidelines for Biomedical & Health Research on Human Participants and the New Drugs and Clinical Trials Rules 2019.',
  },
];

// --------------------------------------------
// Planned studies
// --------------------------------------------
type StudyStatus = 'Recruiting' | 'Planned';

interface Study {
  id: string;
  title: string;
  focus: string;
  participants: string;
  sites: string[];
  status: StudyStatus;
  endpoint?: string;
  window: string;
  icon: typeof FlaskConical;
}

const studies: Study[] = [
  {
    id: 'AAROGYA-DM1',
    title: 'Diabetes Risk Prediction in Indian Adults',
    focus:
      'Prospective validation of a multi-modal AI model for predicting 5-year incident Type 2 Diabetes using HbA1c trajectory, lifestyle, and genetic risk score.',
    participants: '5,000 participants',
    sites: ['AIIMS Delhi', 'CMC Vellore', 'PGIMER Chandigarh'],
    status: 'Recruiting',
    endpoint: 'AUC-ROC ≥ 0.85 (derivation + validation cohorts)',
    window: 'Q3 2026 – Q2 2027',
    icon: Activity,
  },
  {
    id: 'AAROGYA-CV1',
    title: 'Cardiovascular Risk Stratification',
    focus:
      '10-year ASCVD risk re-calibration for Indian populations using lipid profile, BP trajectory, CAC score, and polygenic risk score, benchmarked against the SCORE2-Asia model.',
    participants: '3,000 participants',
    sites: ['Apollo Hospitals', 'Narayana Health', 'Medanta'],
    status: 'Planned',
    window: 'Q1 2027 – Q4 2027',
    icon: HeartPulse,
  },
  {
    id: 'AAROGYA-MH1',
    title: 'Vernacular Mental-Health Screening',
    focus:
      'Multi-language PHQ-9 + GAD-7 administration and AI-assisted scoring in 8 Indian languages, validated against clinician-administered MINI.',
    participants: '2,000 participants',
    sites: ['NIMHANS Bangalore', 'IHBAS Delhi'],
    status: 'Planned',
    endpoint: 'Screening-clinic agreement (Cohen’s κ) ≥ 0.6 in each language',
    window: 'Q2 2027 – Q4 2027',
    icon: Brain,
  },
];

// --------------------------------------------
// Publications in preparation
// --------------------------------------------
const publications = [
  {
    title:
      'Aarogya AI: A Modular, Consent-First Architecture for Multi-Modal Health AI in Low- and Middle-Income Settings',
    target: 'JMIR Medical Informatics',
    status: 'Manuscript in preparation',
  },
  {
    title:
      'Pharmacogenomic Decision Support for the Indian Population: A Clinical Knowledge Synthesis of CYP2C19, CYP2D6, SLCO1B1, G6PD, HLA-B*57:01 and TPMT',
    target: 'Indian Journal of Medical Research (IJMR)',
    status: 'Manuscript in preparation',
  },
];

// --------------------------------------------
// Page
// --------------------------------------------
export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              Aarogya AI Research
            </h1>
            <p className="text-xs text-slate-500">
              India-first clinical evidence
            </p>
          </div>
          <a
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
          >
            ← Back to app
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-20">
        {/* Section 1 — Centered header */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Microscope className="h-3.5 w-3.5" />
            Clinical Research
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Aarogya AI Research Program
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            India-first, peer-reviewed, ICMR-aligned clinical studies that
            ground every Aarogya AI module in evidence generated on Indian
            patients — not extrapolated from Western cohorts. We partner with
            India&apos;s leading public and private academic medical centres to
            design, recruit, and publish open methodologies.
          </p>
        </section>

        {/* Section 2 — Principle cards */}
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3 — Planned studies */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Planned &amp; recruiting studies
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Three multi-site studies, all pre-registered with the Clinical
              Trials Registry - India (CTRI).
            </p>
          </div>
          <div className="space-y-5">
            {studies.map((s) => {
              const Icon = s.icon;
              const isRecruiting = s.status === 'Recruiting';
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/90 to-teal-600 text-white shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-mono font-bold text-white">
                          {s.id}
                        </span>
                        <span
                          className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold ${
                            isRecruiting
                              ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
                              : 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
                          }`}
                        >
                          {isRecruiting ? (
                            <>
                              <span className="mr-1 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                              Recruiting
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              Planned
                            </>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">
                          {s.window}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {s.focus}
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                            Sample
                          </p>
                          <p className="mt-0.5 text-sm text-slate-700">
                            {s.participants}
                          </p>
                        </div>
                        {s.endpoint && (
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                              Primary endpoint
                            </p>
                            <p className="mt-0.5 text-sm text-slate-700">
                              {s.endpoint}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                          Sites
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {s.sites.map((site) => (
                            <span
                              key={site}
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                            >
                              <Stethoscope className="h-3 w-3" />
                              {site}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4 — Publications in preparation */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Publications in preparation
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Two manuscripts are being drafted for submission to peer-reviewed
              journals in 2026.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {publications.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <BookOpenCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200">
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500">
                  Target journal: <span className="font-medium">{p.target}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Hospital partnership CTA */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 md:p-12 text-white shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Partner with us
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Building India&apos;s first evidence base for clinical AI.
              </h2>
              <p className="mt-3 text-white/90 leading-relaxed">
                We are actively inviting Indian hospitals, medical colleges, and
                research institutes to join as recruitment sites, co-investigators,
                and co-authors. IRB-ready protocols and CTRI templates are
                available on request.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:research@aarogyaai.in?subject=Hospital%20partnership%20enquiry%20—%20Aarogya%20AI%20Research%20Program"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 transition"
                >
                  <Mail className="h-4 w-4" />
                  research@aarogyaai.in
                </a>
                <a
                  href="mailto:research@aarogyaai.in?subject=CTRI%20protocol%20request"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
                >
                  Request CTRI protocol
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 right-12 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-100 pt-6 text-xs text-slate-500 text-center">
          <p>
            Aarogya AI Research Program · Ethics: ICMR National Guidelines 2017 ·
            Pre-registration: Clinical Trials Registry - India (CTRI) ·
            Data governance: DPDP Act 2023.
          </p>
        </footer>
      </div>
    </main>
  );
}
