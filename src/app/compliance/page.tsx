// ============================================
// AAROGYA AI — REGULATORY & COMPLIANCE PAGE
//
// Static server-rendered page describing Aarogya AI's
// regulatory posture under Indian law (CDSCO Medical
// Devices Rules 2017, IT Act 2000, DPDP Act 2023) and
// the international clinical/interoperability standards
// the platform adheres to.
//
// No client interactivity — pure SSR, no 'use client'.
// ============================================

import type { Metadata } from 'next';
import {
  ShieldCheck,
  FileText,
  Stethoscope,
  Database,
  Pill,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  Mail,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Regulatory & Compliance — Aarogya AI',
  description:
    'Aarogya AI regulatory framework: CDSCO Medical Devices Rules 2017, IT Act 2000, SaMD classification, clinical guidelines, data standards, and adverse event reporting.',
};

// --------------------------------------------
// SaMD classification table data
// (Class A = low risk, Class B = moderate risk
// per CDSCO Medical Devices Rules 2017, Fourth Schedule)
// --------------------------------------------
const samdModules = [
  {
    name: 'Symptom Checker',
    module: 'Symptom Triage',
    riskClass: 'A',
    status: 'Pending',
    statusColor: 'amber',
  },
  {
    name: 'Disease Predictor',
    module: 'Predictive Analytics',
    riskClass: 'B',
    status: 'Pre-submission',
    statusColor: 'sky',
  },
  {
    name: 'Lab Report Analyzer',
    module: 'Lab Insights',
    riskClass: 'A',
    status: 'Pending',
    statusColor: 'amber',
  },
  {
    name: 'X-Ray Reader',
    module: 'Radiology AI',
    riskClass: 'B',
    status: 'Pre-submission',
    statusColor: 'sky',
  },
  {
    name: 'DermAI Scan',
    module: 'Dermatology AI',
    riskClass: 'B',
    status: 'Pre-submission',
    statusColor: 'sky',
  },
  {
    name: 'Health Brain',
    module: 'Cross-Module Intelligence',
    riskClass: 'B',
    status: 'Pre-submission',
    statusColor: 'sky',
  },
];

const clinicalGuidelines = [
  {
    name: 'ADA 2024',
    body: 'American Diabetes Association',
    scope: 'Standards of Care in Diabetes — used by Diet Planner, Diabetes module, CGM integration.',
  },
  {
    name: 'ICMR 2023',
    body: 'Indian Council of Medical Research',
    scope: 'Clinical Guidelines for Management of Type 2 Diabetes, Hypertension, Dyslipidemia — India-specific cutoffs.',
  },
  {
    name: 'AHA 2017',
    body: 'American Heart Association',
    scope: 'Hypertension clinical practice guidelines — blood pressure staging and CV risk.',
  },
  {
    name: 'WHO 2011',
    body: 'World Health Organization',
    scope: 'Use of Glycated Haemoglobin (HbA1c) in Diagnosis of Diabetes Mellitus.',
  },
  {
    name: 'NICE NG181',
    body: 'UK National Institute for Health and Care Excellence',
    scope: 'Type 1 Diabetes in Adults: Diagnosis and Management — insulin titration guidance.',
  },
  {
    name: 'KDIGO 2024',
    body: 'Kidney Disease: Improving Global Outcomes',
    scope: 'Clinical Practice Guideline for CKD Evaluation and Management — eGFR / ACR staging.',
  },
];

const dataStandards = [
  {
    code: 'FHIR R4',
    name: 'Fast Healthcare Interoperability Resources',
    use: 'Resource model for Patient, Observation, DiagnosticReport, Encounter — exposed via /api/fhir/*.',
  },
  {
    code: 'ICD-10',
    name: 'International Classification of Diseases, 10th Revision',
    use: 'Condition/diagnosis coding across symptom triage, disease predictor, lab insights.',
  },
  {
    code: 'SNOMED CT',
    name: 'Systematized Nomenclature of Medicine — Clinical Terms',
    use: 'Clinical terminology for findings, procedures, body structures, and pharmaceutical/biologic products.',
  },
  {
    code: 'LOINC',
    name: 'Logical Observation Identifiers Names and Codes',
    use: 'Lab test identification in Lab Report Analyzer — maps free-text biomarker names to universal codes.',
  },
];

const drugDatabases = [
  {
    name: 'FDA Orange Book',
    region: 'United States',
    use: 'Approved drug products with therapeutic equivalence evaluations — reference for generic substitution.',
  },
  {
    name: 'CDSCO Drug Database',
    region: 'India',
    use: 'Central Drugs Standard Control Organization approved drugs — India-market availability and labeling.',
  },
  {
    name: 'EMA',
    region: 'European Union',
    use: 'European Medicines Agency — reference for EU-approved indications and safety signals.',
  },
];

const statusColorMap: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  sky: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
};

export default async function CompliancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              Aarogya AI Compliance
            </h1>
            <p className="text-xs text-slate-500">
              Regulatory & safety framework
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

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-14">
        {/* Hero */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Regulatory & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Regulatory &amp; Compliance Information
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Aarogya AI is a healthcare technology platform whose AI modules
            qualify as <strong>Software as a Medical Device (SaMD)</strong>{' '}
            under the <strong>CDSCO Medical Devices Rules 2017</strong> and
            process sensitive personal health data governed by the{' '}
            <strong>Information Technology Act 2000</strong> (and the IT
            Reasonable Security Practices Rules 2011) and the{' '}
            <strong>Digital Personal Data Protection Act 2023</strong>.
          </p>
          <p className="text-slate-600 max-w-3xl leading-relaxed">
            This page documents our classification, clinical guideline
            references, data interoperability standards, drug safety sources,
            and adverse event reporting procedure. It is reviewed quarterly by
            our compliance team and updated whenever a module&apos;s regulatory
            status changes.
          </p>
        </section>

        {/* SaMD classification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              SaMD Classification
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Each AI module is classified per CDSCO Medical Devices Rules 2017,
            Fourth Schedule (which mirrors IMDRF SaMD risk categorization).
            Class A = low risk (informational, no diagnostic claim); Class B =
            moderate risk (informs clinical management, requires pre-market
            submission).
          </p>
          <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-emerald-50/60 text-left text-xs uppercase tracking-wide text-emerald-800">
                  <th className="px-4 py-3 font-semibold">Module</th>
                  <th className="px-4 py-3 font-semibold">Function</th>
                  <th className="px-4 py-3 font-semibold">Risk Class</th>
                  <th className="px-4 py-3 font-semibold">Regulatory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {samdModules.map((m) => (
                  <tr key={m.name} className="hover:bg-emerald-50/40 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{m.module}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 items-center rounded-md bg-slate-100 px-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Class {m.riskClass}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold ${statusColorMap[m.statusColor]}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 italic">
            Class A devices require CDSCO registration but no pre-market
            approval. Class B devices require a pre-market submission including
            clinical evaluation data. Aarogya AI&apos;s Class B modules are
            currently in pre-submission preparation.
          </p>
        </section>

        {/* Clinical guidelines */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Clinical Guidelines Referenced
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Our clinical reasoning layer (CTEE — Clinical Trust &amp;
            Explainability Engine) grounds every AI recommendation in
            evidence-based, regularly-updated clinical guidelines. Each
            recommendation surfaced to the user includes a citation back to the
            source guideline.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clinicalGuidelines.map((g) => (
              <div
                key={g.name}
                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-emerald-700">{g.name}</h3>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  {g.body}
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {g.scope}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Data standards */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Data &amp; Interoperability Standards
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            All health data inside Aarogya AI is modeled against international
            interoperability standards so it can be exchanged with ABDM, EHRs,
            and laboratory information systems without lossy translation.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {dataStandards.map((s) => (
              <div
                key={s.code}
                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 px-2.5 py-1 text-xs font-bold text-white">
                    {s.code}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {s.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {s.use}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Drug safety databases */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Drug Safety Databases
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            The Medications module and Drug Interaction Checker consult the
            following authoritative drug safety sources. Interaction and
            contraindication data is refreshed monthly.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {drugDatabases.map((d) => (
              <div
                key={d.name}
                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{d.name}</h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                    {d.region}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {d.use}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Adverse event reporting */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Adverse Event Reporting
            </h2>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <p className="text-slate-700 leading-relaxed">
              Healthcare professionals and patients are encouraged to report
              any adverse event, incorrect AI output, or safety concern
              associated with Aarogya AI modules. Reports should be sent to our
              pharmacovigilance team at{' '}
              <a
                href="mailto:safety@aarogyaai.in"
                className="font-semibold text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500"
              >
                safety@aarogyaai.in
              </a>{' '}
              within <strong>30 days</strong> of the event. All reports are
              triaged and reviewed within{' '}
              <strong>48 hours</strong> of receipt by a qualified clinical
              reviewer, and serious events trigger immediate module-level risk
              mitigation up to and including temporary suspension of the
              affected module.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg bg-white/70 p-3 ring-1 ring-amber-100">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Report within 30 days
                  </p>
                  <p className="text-xs text-slate-600">
                    Of becoming aware of the event.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white/70 p-3 ring-1 ring-amber-100">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Reviewed within 48 hours
                  </p>
                  <p className="text-xs text-slate-600">
                    By a qualified clinical reviewer on receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-100 pt-6 text-xs text-slate-500">
          <p>
            This page is informational and does not constitute legal advice.
            Regulatory status is current as of the last quarterly review.
            Questions:{' '}
            <a
              href="mailto:compliance@aarogyaai.in"
              className="text-emerald-700 underline"
            >
              compliance@aarogyaai.in
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
