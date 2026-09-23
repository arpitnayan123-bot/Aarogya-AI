// ============================================
// AAROGYA AI — PMJAY & INSURANCE NAVIGATOR
//
// 'use client' page with 5 sections:
//   1. PMJAY eligibility checker (14-digit ABHA input)
//   2. AI Insurance Assistant (free-text Q&A)
//   3. PMJAY coverage table (8 package categories)
//   4. Indian insurer helplines (5 insurers)
//   5. How-to-claim guide (5 numbered steps)
//
// Emerald/teal premium styling.
// ============================================

'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Globe,
  ListChecks,
  HelpCircle,
  Loader2,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Send,
  HeartPulse,
} from 'lucide-react';

// --------------------------------------------
// PMJAY coverage package categories
// Source: NHA PMJAY Health Benefit Package list
// (illustrative ranges, kept generic to avoid
// drifting from the live benefit-package matrix).
// --------------------------------------------
const pmjayPackages = [
  {
    category: 'Cardiovascular',
    procedures: 'CABG, angioplasty (PCI), valve replacement, pacemaker implant',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Cancer',
    procedures: 'Medical oncology cycles, surgical oncology, radiation therapy',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Orthopaedics',
    procedures: 'Joint replacement, spine surgery, fracture fixation',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Neurosurgery',
    procedures: 'Brain tumour, head injury, spinal cord decompression',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Maternal Health',
    procedures: 'C-section, post-partum complications, neonatal ICU care',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Renal',
    procedures: 'Dialysis sessions, kidney transplant, urological surgery',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Ophthalmology',
    procedures: 'Cataract surgery, retinal procedures, glaucoma surgery',
    amount: 'Up to ₹5,00,000 / family / year',
  },
  {
    category: 'Paediatrics',
    procedures: 'Congenital heart defect repair, neonatal jaundice, paediatric ICU',
    amount: 'Up to ₹5,00,000 / family / year',
  },
];

const insurerHelplines = [
  {
    name: 'Star Health Insurance',
    phone: '044-4900 7900',
    website: 'https://www.starhealth.in',
  },
  {
    name: 'HDFC ERGO Health',
    phone: '1800-2700-700',
    website: 'https://www.hdfcergo.com',
  },
  {
    name: 'Niva Bupa Health Insurance',
    phone: '1800-3010-3333',
    website: 'https://www.nivabupa.com',
  },
  {
    name: 'Care Health Insurance',
    phone: '1800-102-4499',
    website: 'https://www.careinsurance.com',
  },
  {
    name: 'New India Assurance',
    phone: '1800-209-1415',
    website: 'https://www.newindia.co.in',
  },
];

const claimSteps = [
  {
    title: 'Confirm your coverage',
    body:
      'Verify your policy is active and the proposed treatment is covered. For PMJAY, confirm your family is on the SECC-2011 eligible list or visit the nearest CSC / empanelled hospital. For private insurance, check your policy schedule and waiting periods.',
  },
  {
    title: 'Collect pre-authorisation',
    body:
      'For cashless treatment, the hospital TPA desk submits a pre-authorisation request with your diagnosis, estimated cost, and doctor prescription. Keep the pre-auth number — you will need it at every step.',
  },
  {
    title: 'Submit documents',
    body:
      'Provide PMJAY card / ABHA / insurer e-card, government photo ID (Aadhaar / Voter ID), policy document, and doctor prescription. For reimbursement claims, also keep original bills, discharge summary, lab reports, and pharmacy invoices.',
  },
  {
    title: 'Track your claim',
    body:
      'Cashless: final bill is settled directly between insurer and hospital (you sign the discharge). Reimbursement: file the claim within the policy time limit (usually 15–30 days post-discharge) and track via insurer portal / helpline using your claim number.',
  },
  {
    title: 'Escalate if denied',
    body:
      'If a claim is denied or partially settled, ask for the written reason. Escalate to the insurer grievance officer, then to IRDAI via the Integrated Grievance Management System (igms.irda.gov.in) or call 155255. PMJAY denials can be raised at the State Health Authority.',
  },
];

// --------------------------------------------
// Page component
// --------------------------------------------
export default function InsurancePage() {
  const [abha, setAbha] = useState('');
  const [eligibility, setEligibility] = useState<{
    loading: boolean;
    result: string | null;
    error: string | null;
  }>({ loading: false, result: null, error: null });

  const [question, setQuestion] = useState('');
  const [ask, setAsk] = useState<{
    loading: boolean;
    result: string | null;
    error: string | null;
  }>({ loading: false, result: null, error: null });

  function isAbhaFormatValid(value: string): boolean {
    // ABHA / Health ID is a 14-digit number (optionally with hyphens).
    const digits = value.replace(/[^0-9]/g, '');
    return digits.length === 14;
  }

  async function checkEligibility() {
    if (!isAbhaFormatValid(abha)) {
      setEligibility({
        loading: false,
        result: null,
        error: 'Please enter a valid 14-digit ABHA / Health ID.',
      });
      return;
    }
    setEligibility({ loading: true, result: null, error: null });
    try {
      const res = await fetch('/api/insurance/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abha }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setEligibility({
        loading: false,
        result: data.message ?? 'Eligibility check completed.',
        error: null,
      });
    } catch (e) {
      setEligibility({
        loading: false,
        result: null,
        error: e instanceof Error ? e.message : 'Failed to check eligibility',
      });
    }
  }

  async function askAssistant() {
    if (question.trim().length < 5) {
      setAsk({
        loading: false,
        result: null,
        error: 'Please enter a longer question.',
      });
      return;
    }
    setAsk({ loading: true, result: null, error: null });
    try {
      const res = await fetch('/api/insurance/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        response?: string;
        error?: string;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setAsk({
        loading: false,
        result: data.response ?? '',
        error: null,
      });
    } catch (e) {
      setAsk({
        loading: false,
        result: null,
        error: e instanceof Error ? e.message : 'Failed to get answer',
      });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              PMJAY &amp; Insurance Navigator
            </h1>
            <p className="text-xs text-slate-500">
              Know your coverage · file smarter claims
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
            Insurance Navigator · India
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Decode your health coverage in minutes.
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Check your PMJAY eligibility, ask an AI assistant anything about
            Indian health insurance (PMJAY, ESIC, CGHS, private insurers),
            browse covered procedures, find your insurer&apos;s helpline, and
            follow a 5-step claim guide.
          </p>
        </section>

        {/* Section 1 — PMJAY eligibility checker */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              1 · PMJAY eligibility checker
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Enter your 14-digit ABHA / Health ID to begin. We do not store your
            ABHA — the check redirects to the official PMJAY beneficiary portal.
          </p>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9-]*"
                value={abha}
                onChange={(e) =>
                  setAbha(e.target.value.replace(/[^0-9-]/g, ''))
                }
                placeholder="e.g. 91-1234-5678-9012"
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                aria-label="14-digit ABHA / Health ID"
                maxLength={18}
              />
              <button
                type="button"
                onClick={checkEligibility}
                disabled={eligibility.loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {eligibility.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="h-4 w-4" />
                    Check eligibility
                  </>
                )}
              </button>
            </div>
            {eligibility.error && (
              <p className="flex items-center gap-2 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {eligibility.error}
              </p>
            )}
            {eligibility.result && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-900 leading-relaxed">
                <p className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Eligibility check
                </p>
                <p className="mt-2 whitespace-pre-line">
                  {eligibility.result}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2 — AI Insurance Assistant */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              2 · AI Insurance Assistant
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Ask about PMJAY, ESIC, CGHS, private insurers, claim denials,
            waiting periods, pre-existing disease clauses, cashless network,
            or coverage in your language.
          </p>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g. मेरे पिता की PMJAY कार्ड पर हार्ट बाईपास सर्जरी कवर होती है? कैशलेस के लिए क्या करना होगा?"
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              aria-label="Ask the insurance assistant"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={askAssistant}
                disabled={ask.loading}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {ask.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Ask
                  </>
                )}
              </button>
              <span className="text-xs text-slate-500">
                Educational guidance, not a policy document.
              </span>
            </div>
            {ask.error && (
              <p className="flex items-center gap-2 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {ask.error}
              </p>
            )}
            {ask.result && (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <FileText className="h-4 w-4" />
                  Assistant reply
                </p>
                <div className="mt-2 max-h-80 overflow-y-auto whitespace-pre-line text-sm text-slate-700 leading-relaxed">
                  {ask.result}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 — Coverage table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              3 · PMJAY coverage at a glance
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            PMJAY (Ayushman Bharat) provides ₹5 lakh per family per year for
            secondary and tertiary care across 8 broad package categories. The
            list below is illustrative — always confirm specific procedure
            codes on the{' '}
            <a
              href="https://beneficiary.nha.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline"
            >
              official PMJAY portal
            </a>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-emerald-50/60 text-left text-xs uppercase tracking-wide text-emerald-800">
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">
                    Representative procedures
                  </th>
                  <th className="px-4 py-3 font-semibold">Covered amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pmjayPackages.map((p) => (
                  <tr key={p.category} className="hover:bg-emerald-50/40">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.procedures}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">
                      {p.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 — Insurer helplines */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              4 · Insurer helplines
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Save your insurer&apos;s helpline in your phone today — you will
            need it during any admission.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insurerHelplines.map((h) => (
              <div
                key={h.name}
                className="rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <h3 className="font-semibold text-slate-900">{h.name}</h3>
                <a
                  href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-2 flex items-center gap-2 text-sm text-emerald-700 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {h.phone}
                </a>
                <a
                  href={h.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {h.website.replace(/^https?:\/\//, '')}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-semibold">
              <Phone className="h-4 w-4" />
              PMJAY helpline: 14555
            </p>
            <p className="mt-1 text-emerald-800">
              24×7 toll-free support for PMJAY / Ayushman Bharat queries in
              Hindi, English, and 9 regional languages.
            </p>
          </div>
        </section>

        {/* Section 5 — How-to-claim guide */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              5 · How to file a claim — 5 steps
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {claimSteps.map((s, idx) => (
              <li
                key={s.title}
                className="rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-sm">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              Educational guidance only
            </p>
            <p className="mt-2 text-sm text-amber-800 leading-relaxed">
              Insurance policies, PMJAY packages, and helpline numbers change
              over time. Always confirm with the official PMJAY portal
              (beneficiary.nha.gov.in), your insurer&apos;s customer care, or
              IRDAI (igms.irda.gov.in / 155255) before relying on this
              information. Aarogya AI is not an insurance intermediary.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
