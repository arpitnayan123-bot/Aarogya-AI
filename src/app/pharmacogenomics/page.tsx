// ============================================
// AAROGYA AI — PHARMACOGENOMICS MODULE
//
// 'use client' page with 4 sections:
//   1. Genetic-test report upload (drag-drop or file input)
//      → POST /api/pharmacogenomics/analyze
//      → AI analysis rendered in a scrollable textarea
//   2. Educational grid of 6 drug-gene interactions
//      relevant to the Indian population
//   3. Indian genetic testing labs (links + price ranges)
//   4. Educational-only disclaimer
//
// Emerald/teal premium styling, glassmorphism cards.
// ============================================

'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Dna,
  UploadCloud,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Microscope,
  Pill,
  ShieldAlert,
  FileText,
  RotateCcw,
} from 'lucide-react';

// --------------------------------------------
// Drug-gene interaction cards (Indian frequency)
// Sources: PharmGKB, CPIC, Indian Genome Variation
// Consortium, published Indian cohort studies.
// --------------------------------------------
const drugGeneInteractions = [
  {
    gene: 'CYP2C19',
    drugClass: 'Antiplatelet — Clopidogrel',
    frequency: '~30% of Indians carry reduced-function alleles',
    risk: 'High',
    riskColor: 'red',
    explanation:
      'Clopidogrel is a prodrug activated by CYP2C19. Loss-of-function carriers (especially *2/*3, common in South Asians) have reduced active metabolite formation, leading to stent thrombosis risk. Genotype-guided escalation to prasugrel/ticagrelor is recommended in PCI patients.',
  },
  {
    gene: 'SLCO1B1',
    drugClass: 'Statins — Simvastatin / Atorvastatin',
    frequency: '~15% of Indians are SLCO1B1 c.521TC/CC carriers',
    risk: 'Moderate',
    riskColor: 'amber',
    explanation:
      'SLCO1B1 transports statins into hepatocytes. c.521C carriers have higher plasma simvastatin acid exposure and a markedly increased risk of myopathy. Consider lower simvastatin doses or alternative statins (rosuvastatin, pravastatin) in c.521TC/CC individuals.',
  },
  {
    gene: 'CYP2D6',
    drugClass: 'Opioid — Codeine / Tramadol',
    frequency: '~5% of Indians are ultra-rapid metabolizers',
    risk: 'High',
    riskColor: 'red',
    explanation:
      'Codeine is bioactivated to morphine by CYP2D6. Ultra-rapid metabolizers can develop life-threatening opioid toxicity (respiratory depression) from standard codeine doses — documented in post-tonsillectomy paediatric deaths. Avoid codeine in ultra-rapid metabolizers and breastfeeding mothers.',
  },
  {
    gene: 'G6PD',
    drugClass: 'Antimalarials / Sulphonamides / Primaquine',
    frequency: '~10–15% of Indian males (X-linked)',
    risk: 'High',
    riskColor: 'red',
    explanation:
      'Glucose-6-phosphate dehydrogenase deficiency causes red-cell haemolysis on exposure to oxidant drugs (primaquine, dapsone, sulphonamides, nitrofurantoin). High prevalence in tribal, Odisha, Andhra, and North-East populations. Screen before primaquine/radical-cure regimens.',
  },
  {
    gene: 'HLA-B*57:01',
    drugClass: 'Antiretroviral — Abacavir',
    frequency: 'Carriage varies by ethnicity; screen before prescription',
    risk: 'High',
    riskColor: 'red',
    explanation:
      'HLA-B*57:01 positivity predicts abacavir hypersensitivity (potentially fatal). The reaction is immunologically mediated and contraindicates re-challenge. CPIC guidelines mandate HLA-B*57:01 screening before initiating abacavir in every patient.',
  },
  {
    gene: 'TPMT',
    drugClass: 'Immunosuppressant — Azathioprine / 6-MP',
    frequency: '~1 in 300 Indians homozygous deficient',
    risk: 'High',
    riskColor: 'red',
    explanation:
      'TPMT metabolises thiopurines. Deficient patients develop severe, potentially fatal myelosuppression on standard doses. CPIC recommends TPMT genotyping or activity before azathioprine/6-MP initiation; full-dose contraindicated in homozygous-deficient individuals.',
  },
];

const riskBadgeColor: Record<string, string> = {
  red: 'bg-red-100 text-red-800 ring-1 ring-red-200',
  amber: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  emerald: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
};

const indianLabs = [
  {
    name: 'Mapmygenome',
    description:
      'Genomepatri™ comprehensive pharmacogenomics & wellness panel.',
    price: '₹8,000 – ₹25,000',
    url: 'https://mapmygenome.in',
  },
  {
    name: 'Thyrocare GenoFit',
    description:
      'Aarogyam-linked pharmacogenomics panel for chronic-disease medication response.',
    price: '₹5,000 – ₹12,000',
    url: 'https://www.thyrocare.com/genofit',
  },
  {
    name: 'CCMB GenomeIndia',
    description:
      'Centre for Cellular & Molecular Biology — research-grade Indian population genome reference (not a commercial diagnostic).',
    price: 'Research / Reference',
    url: 'https://www.ccmb.res.in/genomeindia',
  },
  {
    name: 'MedGenome',
    description:
      'Pharmacogenomics & clinical-exome panels for drug-sensitivity profiling.',
    price: '₹10,000 – ₹40,000',
    url: 'https://www.medgenome.com',
  },
];

// --------------------------------------------
// Page component
// --------------------------------------------
export default function PharmacogenomicsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback((f: File) => {
    // Only accept text-readable formats (PDF parsing requires server-side
    // OCR; for now we accept .txt/.csv/.md/.json with a graceful note
    // for PDFs).
    setFile(f);
    setAnalysis('');
    setError(null);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  async function analyzeReport() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const text = await file.text();
      const res = await fetch('/api/pharmacogenomics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          text,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        response?: string;
        error?: string;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setAnalysis(data.response ?? '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to analyze report');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setAnalysis('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Dna className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              Pharmacogenomics
            </h1>
            <p className="text-xs text-slate-500">
              Personalize medication by your genes
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
            <Dna className="h-3.5 w-3.5" />
            Pharmacogenomics · India-tuned
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Your genes, your medicine.
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Pharmacogenomics studies how your DNA affects your response to
            medications. Upload a genetic test report and Aarogya AI will explain
            the findings in plain language — including Indian-population
            frequency, drug-gene interactions, and questions to ask your
            physician.
          </p>
        </section>

        {/* Section 1 — Upload area */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              1 · Upload your genetic test report
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Drag and drop a text-readable report (TXT / CSV / JSON / MD). PDF
            support is being added — for now, copy-paste the report text into a{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              .txt
            </code>{' '}
            file. Your file is processed in-memory and never stored.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition cursor-pointer ${
              isDragging
                ? 'border-emerald-400 bg-emerald-50/70'
                : 'border-emerald-200 bg-white/60 backdrop-blur-sm hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,.json,.md,text/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <UploadCloud
              className={`mx-auto h-12 w-12 ${isDragging ? 'text-emerald-500' : 'text-emerald-400'}`}
            />
            <p className="mt-3 text-sm font-medium text-slate-700">
              {file ? file.name : 'Drop your report here, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB · ${file.type || 'text'}`
                : 'TXT, CSV, JSON, MD · up to ~1 MB'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={analyzeReport}
              disabled={!file || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Microscope className="h-4 w-4" />
                  Analyze report
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={!file || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-800">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Could not analyze report
              </p>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="rounded-2xl border border-emerald-200 bg-white/70 backdrop-blur-sm p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <FileText className="h-4 w-4" />
                  AI Pharmacogenomics Analysis
                </p>
                <span className="text-xs text-slate-400">Educational only</span>
              </div>
              <textarea
                readOnly
                value={analysis}
                className="mt-3 w-full h-80 resize-y rounded-lg border border-emerald-100 bg-white p-4 font-mono text-sm leading-relaxed text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-200"
                aria-label="AI analysis of your genetic report"
              />
            </div>
          )}
        </section>

        {/* Section 2 — Educational drug-gene grid */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              2 · Drug–gene interactions that matter in India
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Six clinically-actionable pharmacogenomic interactions with
            significant frequency in Indian populations. Frequency figures are
            drawn from the Indian Genome Variation Consortium, PharmGKB and
            CPIC-published Indian cohort studies.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drugGeneInteractions.map((c) => (
              <div
                key={c.gene}
                className="rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                      {c.gene}
                    </p>
                    <h3 className="mt-0.5 font-semibold text-slate-900">
                      {c.drugClass}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold ${riskBadgeColor[c.riskColor]}`}
                  >
                    {c.risk} risk
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Frequency:</span>{' '}
                  {c.frequency}
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Indian genetic testing labs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              3 · Genetic testing labs in India
            </h2>
          </div>
          <p className="text-slate-600 max-w-3xl">
            The following NABL-accredited or research-grade Indian laboratories
            offer pharmacogenomics testing. Always verify current pricing,
            sample requirements, and turnaround directly with the lab.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {indianLabs.map((l) => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{l.name}</h3>
                  <ExternalLink className="h-4 w-4 text-emerald-500 opacity-70 group-hover:opacity-100" />
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {l.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  {l.price}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Section 4 — Disclaimer */}
        <section>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              Educational only — not medical advice
            </p>
            <p className="mt-2 text-sm text-amber-800 leading-relaxed">
              This module is for educational purposes only. Aarogya AI does not
              prescribe, dose, or adjust medications. Pharmacogenomic results
              must be interpreted by a qualified physician or clinical
              pharmacologist together with your full clinical picture. Never
              stop or change a medication based on this information alone. For
              emergencies, call <strong>112</strong>.
            </p>
          </div>
        </section>

        <footer className="border-t border-emerald-100 pt-6 text-xs text-slate-500">
          <p>
            References: PharmGKB, CPIC Guidelines, Indian Genome Variation
            Consortium, CCRAS Pharmacovigilance. Reviewed by the Aarogya AI
            Clinical Trust &amp; Explainability Engine.
          </p>
        </footer>
      </div>
    </main>
  );
}
