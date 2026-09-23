'use client';

// ============================================
// AAROGYA AI — CLINICAL TRUST & EXPLAINABILITY ENGINE (CTEE)
// UI Component — 8-panel trust layer for every AI output
// ============================================

import { useState, useMemo, useEffect } from 'react';
import {
  Shield, ShieldCheck, ShieldAlert, Brain, Activity, FileText, Stethoscope,
  AlertTriangle, CheckCircle2, XCircle, ChevronRight, Link2, FlaskConical,
  Database, GitBranch, TrendingUp, Clock, BookOpen, Lock, Eye, Sparkles,
  ArrowRight, Layers, Scale, AlertCircle, CircleDot, Network, ClipboardList,
} from 'lucide-react';
import {
  buildCTEEReport, loadAuditLog, resolveAuditEntry, CLINICAL_KG, GUIDELINES,
  type CTEEReport, type AuditEntry, type AuditOutcome, type ModuleSource,
} from '@/lib/ctee';

// --- Pre-built demo scenarios to showcase the engine ---
interface DemoScenario {
  id: string;
  label: string;
  module: ModuleSource;
  targetCondition: string;
  findings: { name: string; value?: string; severity: string }[];
  requiredFields: { name: string; provided: boolean; whyItMatters: string; severity: 'low' | 'moderate' | 'high' }[];
  modelCertainty: number;
  dataCompleteness: number;
  recommendedAction: string;
}

const SCENARIOS: DemoScenario[] = [
  {
    id: 'lab-diabetes',
    label: 'Lab Report → Diabetes',
    module: 'lab_report',
    targetCondition: 'Type 2 Diabetes Mellitus (newly suspected)',
    findings: [
      { name: 'Fasting Glucose', value: '142 mg/dL', severity: 'abnormal' },
      { name: 'HbA1c', value: '6.8%', severity: 'abnormal' },
      { name: 'BMI', value: '28.4', severity: 'borderline' },
      { name: 'Total Cholesterol', value: '198 mg/dL', severity: 'normal' },
    ],
    requiredFields: [
      { name: 'Fasting Glucose', provided: true, whyItMatters: 'Primary ADA diagnostic threshold', severity: 'high' },
      { name: 'HbA1c', provided: true, whyItMatters: '3-month glycemic average; confirms chronicity', severity: 'high' },
      { name: 'Fasting Insulin / C-peptide', provided: false, whyItMatters: 'Differentiates T1DM vs T2DM', severity: 'moderate' },
      { name: 'Family History', provided: false, whyItMatters: 'Strong T2DM heritability in Asian Indians', severity: 'moderate' },
    ],
    modelCertainty: 84,
    dataCompleteness: 72,
    recommendedAction: 'Confirm with endocrinologist; initiate metformin + lifestyle per ADA/ICMR',
  },
  {
    id: 'xray-pneumonia',
    label: 'X-ray → Pneumonia',
    module: 'xray',
    targetCondition: 'Community-Acquired Pneumonia (right lower lobe)',
    findings: [
      { name: 'Chest X-ray', value: 'RLL consolidation', severity: 'abnormal' },
      { name: 'Clinical: Fever', value: '39.1°C', severity: 'abnormal' },
      { name: 'Clinical: Cough', value: 'Productive', severity: 'abnormal' },
      { name: 'SpO₂', value: '94%', severity: 'borderline' },
    ],
    requiredFields: [
      { name: 'Chest X-ray', provided: true, whyItMatters: 'Primary imaging evidence', severity: 'high' },
      { name: 'Vital signs', provided: true, whyItMatters: 'CURB-65 severity scoring', severity: 'high' },
      { name: 'Sputum culture', provided: false, whyItMatters: 'Pathogen identification for targeted therapy', severity: 'moderate' },
      { name: 'WBC count', provided: false, whyItMatters: 'Bacterial vs viral differentiation', severity: 'moderate' },
    ],
    modelCertainty: 88,
    dataCompleteness: 65,
    recommendedAction: 'Empiric antibiotic therapy (amoxicillin ± macrolide); consider admission if CURB-65 ≥ 2',
  },
  {
    id: 'twin-hba1c',
    label: 'Digital Twin → Trajectory',
    module: 'digital_twin',
    targetCondition: 'HbA1c projected to reach 7.4% in 90 days (diabetes threshold)',
    findings: [
      { name: 'Current HbA1c', value: '6.8%', severity: 'borderline' },
      { name: '90-day trend', value: '↑ rising', severity: 'abnormal' },
      { name: 'Adherence signal', value: 'irregular', severity: 'borderline' },
    ],
    requiredFields: [
      { name: 'HbA1c history (≥3 readings)', provided: true, whyItMatters: 'Trend reliability', severity: 'high' },
      { name: 'Glucose logs', provided: false, whyItMatters: 'Day-to-day variability capture', severity: 'moderate' },
      { name: 'Medication adherence', provided: true, whyItMatters: 'Major trajectory determinant', severity: 'high' },
    ],
    modelCertainty: 64,
    dataCompleteness: 58,
    recommendedAction: 'Reinforce adherence; add SMBG; nutritionist referral; reassess in 4 weeks',
  },
  {
    id: 'decision-sglt2',
    label: 'Decision → SGLT2i',
    module: 'decision_engine',
    targetCondition: 'Add SGLT2 inhibitor to T2DM regimen (cardiorenal benefit)',
    findings: [
      { name: 'HbA1c', value: '7.6%', severity: 'abnormal' },
      { name: 'eGFR', value: '78 mL/min', severity: 'normal' },
      { name: 'ASCVD risk', value: '14% (10-yr)', severity: 'abnormal' },
      { name: 'Current meds', value: 'Metformin only', severity: 'borderline' },
    ],
    requiredFields: [
      { name: 'HbA1c', provided: true, whyItMatters: 'Glycemic target assessment', severity: 'high' },
      { name: 'eGFR', provided: true, whyItMatters: 'SGLT2i renal eligibility (≥20)', severity: 'high' },
      { name: 'Urine albumin', provided: false, whyItMatters: 'CKD progression risk stratification', severity: 'moderate' },
      { name: 'Genitourinary history', provided: false, whyItMatters: 'SGLT2i infection risk', severity: 'low' },
    ],
    modelCertainty: 76,
    dataCompleteness: 70,
    recommendedAction: 'Initiate empagliflozin 10mg daily; recheck HbA1c in 12 weeks',
  },
  {
    id: 'disease-cardiac',
    label: 'Disease Predict → Cardiac',
    module: 'disease_prediction',
    targetCondition: '10-year ASCVD risk: 14% (intermediate)',
    findings: [
      { name: 'Age/Sex', value: 'Male 52', severity: 'borderline' },
      { name: 'Blood Pressure', value: '138/88 mmHg', severity: 'abnormal' },
      { name: 'LDL Cholesterol', value: '142 mg/dL', severity: 'abnormal' },
      { name: 'Smoker', value: 'No', severity: 'normal' },
      { name: 'HDL', value: '38 mg/dL', severity: 'borderline' },
    ],
    requiredFields: [
      { name: 'Lipid panel', provided: true, whyItMatters: 'Core ASCVD input', severity: 'high' },
      { name: 'BP readings', provided: true, whyItMatters: 'Hypertension contribution', severity: 'high' },
      { name: 'Family history of premature CAD', provided: false, whyItMatters: 'Risk amplification factor', severity: 'moderate' },
      { name: 'Coronary calcium score', provided: false, whyItMatters: 'Refines intermediate risk', severity: 'moderate' },
    ],
    modelCertainty: 71,
    dataCompleteness: 68,
    recommendedAction: 'Consider statin therapy per ACC/AHA; discuss CAC scoring to refine risk',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function ClinicalTrustEngine() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [report, setReport] = useState<CTEEReport | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('d_dm2');
  const [doctorModeOn, setDoctorModeOn] = useState(false);

  // Build report when scenario changes
  useEffect(() => {
    const scenario = SCENARIOS.find(s => s.id === activeScenarioId)!;
    const r = buildCTEEReport({
      module: scenario.module,
      targetCondition: scenario.targetCondition,
      findings: scenario.findings,
      requiredFields: scenario.requiredFields,
      modelCertainty: scenario.modelCertainty,
      dataCompleteness: scenario.dataCompleteness,
      recommendedAction: scenario.recommendedAction,
    });
    setReport(r);
    setAuditLog(loadAuditLog());
  }, [activeScenarioId]);

  const resolveOutcome = (id: string, outcome: AuditOutcome, actual: string) => {
    setAuditLog(resolveAuditEntry(id, outcome, actual));
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-sm">Building trust report…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <Header report={report} />

      {/* ====== SCENARIO SELECTOR ====== */}
      <ScenarioSelector
        activeId={activeScenarioId}
        onSelect={setActiveScenarioId}
      />

      {/* ====== DOCTOR MODE TOGGLE ====== */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Doctor Mode</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle clinical SOAP / ICD-10 / red-flag formatting</p>
          </div>
        </div>
        <button
          onClick={() => setDoctorModeOn(v => !v)}
          className={`relative h-7 w-12 rounded-full transition-colors ${doctorModeOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          aria-label="Toggle doctor mode"
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${doctorModeOn ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      {/* ====== PANEL 1: WHY THIS RESULT ====== */}
      <WhyThisResultPanel report={report} />

      {/* ====== PANEL 2: CONFIDENCE SCORE ====== */}
      <ConfidenceScorePanel report={report} />

      {/* ====== PANEL 3: CLINICAL BACKING ====== */}
      <ClinicalBackingPanel report={report} />

      {/* ====== PANEL 4: TRACEABLE PIPELINE ====== */}
      <TraceablePipelinePanel report={report} />

      {/* ====== PANEL 5: MODEL CONSENSUS ====== */}
      <ModelConsensusPanel report={report} />

      {/* ====== PANEL 6: AUDIT TRAIL ====== */}
      <AuditTrailPanel auditLog={auditLog} onResolve={resolveOutcome} currentAuditId={report.auditId} />

      {/* ====== PANEL 7: DOCTOR MODE ====== */}
      {doctorModeOn && <DoctorModePanel report={report} />}

      {/* ====== PANEL 8: UNCERTAINTY DISPLAY ====== */}
      <UncertaintyPanel report={report} />

      {/* ====== CLINICAL KNOWLEDGE GRAPH ====== */}
      <KnowledgeGraphPanel selectedId={selectedDiseaseId} onSelect={setSelectedDiseaseId} />

      {/* ====== SAFETY FOOTER ====== */}
      <SafetyFooter report={report} />
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function Header({ report }: { report: CTEEReport }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
      {/* Ambient orbs */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">TRUST ENGINE ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">ISO 13485-aligned</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs text-slate-300">Audit-logged</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          Clinical Trust &amp; Explainability Engine
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          Every AI output is explainable, confidence-scored, clinically backed, traceable,
          consensus-driven, and auditable. No black boxes — only verifiable decisions.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            Module: <span className="text-slate-200 font-medium">{report.module.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            {new Date(report.timestamp).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="h-3.5 w-3.5 text-teal-400" />
            Audit ID: <span className="text-slate-200 font-mono text-[11px]">{report.auditId.slice(0, 16)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCENARIO SELECTOR
// ============================================

function ScenarioSelector({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Live Explainability Demos — Pick a Module Output</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
              activeId === s.id
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${activeId === s.id ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
              <span className={`text-xs font-semibold ${activeId === s.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {s.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{s.targetCondition}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PANEL 1: WHY THIS RESULT
// ============================================

const LAYER_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  causal: { bg: 'bg-violet-100 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-300 dark:border-violet-800' },
  predictive: { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-800' },
  rule_based: { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' },
};

function WhyThisResultPanel({ report }: { report: CTEEReport }) {
  const { reasoningChain } = report;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Brain className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Why This Result</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Full reasoning chain — step-by-step cause → effect</p>
        </div>
      </div>

      {/* Conclusion banner */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{reasoningChain.conclusion}</p>
      </div>

      {/* Steps */}
      <div className="mt-5 space-y-3">
        {reasoningChain.steps.map((step, i) => {
          const c = LAYER_COLOR[step.layer] || LAYER_COLOR.rule_based;
          return (
            <div key={step.id} className="relative pl-10">
              {/* vertical line */}
              {i < reasoningChain.steps.length - 1 && (
                <div className="absolute left-[14px] top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
              )}
              {/* node */}
              <div className={`absolute left-0 top-1.5 h-7 w-7 rounded-full ${c.bg} ${c.border} border-2 flex items-center justify-center text-[10px] font-bold ${c.text}`}>
                {i + 1}
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{step.label}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.text} font-medium uppercase tracking-wide`}>{step.layer.replace('_', '-')}</span>
                </div>
                <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Input</p>
                    <p className="text-slate-700 dark:text-slate-300">{step.input}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Mechanism</p>
                    <p className="text-slate-700 dark:text-slate-300">{step.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Output</p>
                    <p className="text-slate-700 dark:text-slate-300">{step.output}</p>
                  </div>
                </div>
                {step.evidence && (
                  <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <BookOpen className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{step.evidence}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${step.weight * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-500">{Math.round(step.weight * 100)}% weight</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cause-effect pairs */}
      {reasoningChain.causeEffect.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Cause → Effect Relationships</h4>
          <div className="flex flex-wrap gap-2">
            {reasoningChain.causeEffect.map((ce, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                <span className="text-slate-600 dark:text-slate-300">{ce.cause}</span>
                <ArrowRight className="h-3 w-3 text-emerald-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">{ce.effect}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================
// PANEL 2: CONFIDENCE SCORE
// ============================================

function ConfidenceScorePanel({ report }: { report: CTEEReport }) {
  const { confidence } = report;
  const riskColor: Record<string, string> = {
    low: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40',
    moderate: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40',
    high: 'text-orange-600 bg-orange-100 dark:bg-orange-950/40',
    critical: 'text-rose-600 bg-rose-100 dark:bg-rose-950/40',
  };
  // SVG arc
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence.overall / 100) * circumference;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <GaugeIcon />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Confidence Score</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Weighted: model certainty × data completeness × historical accuracy</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="-rotate-90">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
              <defs>
                <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle
                cx="80" cy="80" r={radius} fill="none"
                stroke="url(#confGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{confidence.overall}%</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">confidence</span>
            </div>
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${riskColor[confidence.riskLevel]}`}>
            {confidence.riskLevel.toUpperCase()} RISK
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          {confidence.breakdown.map(b => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300">{b.label}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{b.value}% <span className="text-slate-400 font-normal">× {b.weight}</span></span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${b.value}%`, transition: 'width 0.8s ease-out' }}
                />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Historical accuracy (from audit log)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{confidence.historicalAccuracy}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function GaugeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
      <path d="M12 14l3-3" strokeLinecap="round" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" strokeLinecap="round" />
    </svg>
  );
}

// ============================================
// PANEL 3: CLINICAL BACKING
// ============================================

function ClinicalBackingPanel({ report }: { report: CTEEReport }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Clinical Backing</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Outputs mapped to established medical guidelines &amp; frameworks</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {report.guidelines.map(g => (
          <div key={g.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{g.name}</h4>
                <p className="text-[11px] text-slate-500">{g.source} • {g.year}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{g.recommendation}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Link2 className="h-3 w-3" />
              <span className="font-mono">{g.reference}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {g.appliesTo.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// PANEL 4: TRACEABLE PIPELINE
// ============================================

function TraceablePipelinePanel({ report }: { report: CTEEReport }) {
  const { pipeline } = report;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Traceable Pipeline</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Every output is traceable: Input → Model → Output</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 relative">
        {/* connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-[33%] right-[33%] h-px bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        <PipelineNode
          icon={<Database className="h-4 w-4" />}
          step="INPUT"
          color="emerald"
          title={pipeline.input.source.replace(/_/g, ' ')}
          body={pipeline.input.summary}
        />
        <PipelineNode
          icon={<CpuIcon />}
          step="MODEL"
          color="teal"
          title={pipeline.model.name}
          body={`Layers: ${pipeline.model.layers.map(l => l.replace('_', '-')).join(' + ')}`}
        />
        <PipelineNode
          icon={<CheckCircle2 className="h-4 w-4" />}
          step="OUTPUT"
          color="cyan"
          title={pipeline.output.summary.slice(0, 60) + (pipeline.output.summary.length > 60 ? '…' : '')}
          body={`Confidence: ${pipeline.output.confidence}%`}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <CircleDot className="h-3 w-3 text-emerald-500" />
          Version: <span className="font-mono text-slate-700 dark:text-slate-300">{pipeline.model.version}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3 w-3 text-cyan-500" />
          All steps audit-logged
        </div>
      </div>
    </section>
  );
}

function PipelineNode({ icon, step, color, title, body }: {
  icon: React.ReactNode; step: string; color: string; title: string; body: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
    teal: 'border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300',
    cyan: 'border-cyan-300 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
  };
  return (
    <div className={`relative rounded-xl border-2 p-4 ${colorMap[color]} z-10`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-7 w-7 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center ${colorMap[color].split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{step}</span>
      </div>
      <p className="text-xs font-semibold capitalize">{title}</p>
      <p className="text-[11px] mt-1 opacity-80">{body}</p>
    </div>
  );
}

function CpuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" strokeLinecap="round" />
    </svg>
  );
}

// ============================================
// PANEL 5: MODEL CONSENSUS
// ============================================

function ModelConsensusPanel({ report }: { report: CTEEReport }) {
  const { consensus } = report;
  const layerIcon: Record<string, React.ReactNode> = {
    causal: <Network className="h-4 w-4" />,
    predictive: <TrendingUp className="h-4 w-4" />,
    rule_based: <Scale className="h-4 w-4" />,
  };
  const layerColor: Record<string, string> = {
    causal: 'violet',
    predictive: 'cyan',
    rule_based: 'amber',
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Layers className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Model Consensus</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">3 reasoning layers vote — agreement &amp; dissent surfaced</p>
        </div>
      </div>

      {/* Agreement score banner */}
      <div className={`p-4 rounded-xl border mb-4 ${
        consensus.agreementScore >= 67
          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30'
          : consensus.agreementScore >= 34
          ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
          : 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30'
      }`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {consensus.agreementScore >= 67 ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{consensus.agreementScore}% agreement across models</p>
              <p className="text-xs text-slate-500">{consensus.majorityVerdict}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {consensus.votes.map(v => (
              <div key={v.layer} className={`h-2.5 w-12 rounded-full ${v.agrees ? 'bg-emerald-500' : 'bg-rose-400'}`} title={`${v.label}: ${v.agrees ? 'agrees' : 'disagrees'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Vote cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {consensus.votes.map(v => {
          const c = layerColor[v.layer];
          return (
            <div key={v.layer} className={`rounded-xl border p-4 ${v.agrees ? 'border-slate-200 dark:border-slate-800' : 'border-rose-300 dark:border-rose-800'} bg-slate-50 dark:bg-slate-900`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center gap-1.5 text-${c}-600`}>
                  {layerIcon[v.layer]}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{v.label}</span>
                </div>
                {v.agrees
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <XCircle className="h-4 w-4 text-rose-500" />}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[48px]">{v.verdict}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full bg-${c}-500`} style={{ width: `${v.confidence}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{v.confidence}%</span>
              </div>
              {v.notes && <p className="mt-2 text-[10px] text-slate-400 italic">{v.notes}</p>}
            </div>
          );
        })}
      </div>

      {/* Dissent */}
      {consensus.dissent.length > 0 && (
        <div className="mt-4 p-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Dissent surfaced ({consensus.dissent.length})</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {consensus.dissent.map((d, i) => <li key={i} className="flex gap-1.5"><ChevronRight className="h-3 w-3 mt-0.5 text-rose-400 shrink-0" />{d}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

// ============================================
// PANEL 6: AUDIT TRAIL
// ============================================

function AuditTrailPanel({ auditLog, onResolve, currentAuditId }: {
  auditLog: AuditEntry[];
  onResolve: (id: string, outcome: AuditOutcome, actual: string) => void;
  currentAuditId: string;
}) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [actualText, setActualText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const filtered = auditLog.filter(a => {
    if (filter === 'pending') return a.outcome === 'pending';
    if (filter === 'resolved') return a.outcome !== 'pending';
    return true;
  }).reverse();

  const stats = {
    total: auditLog.length,
    confirmed: auditLog.filter(a => a.outcome === 'confirmed').length,
    partial: auditLog.filter(a => a.outcome === 'partially_confirmed').length,
    disproved: auditLog.filter(a => a.outcome === 'disproved').length,
    pending: auditLog.filter(a => a.outcome === 'pending').length,
  };
  const accuracy = stats.total > 0 && (stats.confirmed + stats.partial + stats.disproved) > 0
    ? Math.round(((stats.confirmed + stats.partial) / (stats.confirmed + stats.partial + stats.disproved)) * 100)
    : 0;

  const outcomeIcon: Record<AuditOutcome, React.ReactNode> = {
    confirmed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    partially_confirmed: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
    disproved: <XCircle className="h-3.5 w-3.5 text-rose-500" />,
    pending: <Clock className="h-3.5 w-3.5 text-slate-400" />,
    expired: <Clock className="h-3.5 w-3.5 text-slate-400" />,
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Audit Trail</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Predictions vs outcomes — track every decision</p>
          </div>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
          {(['all', 'pending', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md transition-colors ${filter === f ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Accuracy stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        <StatChip label="Total" value={stats.total} color="slate" />
        <StatChip label="Confirmed" value={stats.confirmed} color="emerald" />
        <StatChip label="Partial" value={stats.partial} color="amber" />
        <StatChip label="Disproved" value={stats.disproved} color="rose" />
        <StatChip label="Accuracy" value={`${accuracy}%`} color="cyan" />
      </div>

      {/* Log */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1 ctee-scroll">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-400">No entries match this filter.</div>
        )}
        {filtered.map(a => (
          <div key={a.id} className={`rounded-xl border p-3 ${
            a.id === currentAuditId
              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
          }`}>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-start gap-2">
                {outcomeIcon[a.outcome]}
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.prediction}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {a.module.replace(/_/g, ' ')} • {new Date(a.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {a.confidence}% conf
                  </p>
                </div>
              </div>
              {a.id === currentAuditId && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">CURRENT</span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-400 italic">Context: {a.context}</p>
            {a.actualResult && (
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-700 dark:text-slate-200">Actual: </span>{a.actualResult}
              </p>
            )}
            {a.outcome === 'pending' && (
              <div className="mt-2">
                {resolvingId === a.id ? (
                  <div className="space-y-2 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <input
                      value={actualText}
                      onChange={e => setActualText(e.target.value)}
                      placeholder="What actually happened?"
                      className="w-full px-2 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => { onResolve(a.id, 'confirmed', actualText || 'Confirmed by clinician'); setResolvingId(null); setActualText(''); }} className="px-2 py-1 text-[11px] rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200">Confirm</button>
                      <button onClick={() => { onResolve(a.id, 'partially_confirmed', actualText || 'Partially confirmed'); setResolvingId(null); setActualText(''); }} className="px-2 py-1 text-[11px] rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200">Partial</button>
                      <button onClick={() => { onResolve(a.id, 'disproved', actualText || 'Disproved by outcome'); setResolvingId(null); setActualText(''); }} className="px-2 py-1 text-[11px] rounded-md bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200">Disprove</button>
                      <button onClick={() => { setResolvingId(null); setActualText(''); }} className="px-2 py-1 text-[11px] rounded-md text-slate-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setResolvingId(a.id)}
                    className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    + Log Outcome
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function StatChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    slate: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40',
    rose: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/40',
    cyan: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/40',
  };
  return (
    <div className={`rounded-lg px-2.5 py-1.5 ${colorMap[color]}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}

// ============================================
// PANEL 7: DOCTOR MODE
// ============================================

function DoctorModePanel({ report }: { report: CTEEReport }) {
  const { doctorMode: dm } = report;
  return (
    <section className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Stethoscope className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Doctor Mode — Clinical Format</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">SOAP note + ICD-10 + red flags + differentials</p>
        </div>
      </div>

      {/* SOAP */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-4 mb-3">
        <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-3">SOAP Note</h4>
        <div className="space-y-2.5 text-xs">
          <SoapRow letter="S" label="Subjective" text={dm.soap.subjective} />
          <SoapRow letter="O" label="Objective" text={dm.soap.objective} />
          <SoapRow letter="A" label="Assessment" text={dm.soap.assessment} />
          <SoapRow letter="P" label="Plan" text={dm.soap.plan} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {/* ICD-10 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> ICD-10 Codes
          </h4>
          <ul className="space-y-1">
            {dm.icd10.map(code => (
              <li key={code} className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{code}</li>
            ))}
          </ul>
        </div>

        {/* Red flags */}
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 p-4">
          <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Red Flags
          </h4>
          <ul className="space-y-1">
            {dm.redFlags.map((f, i) => (
              <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex gap-1.5">
                <span className="text-rose-500">•</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Differentials */}
      <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">Differential Considerations</h4>
        <div className="flex flex-wrap gap-1.5">
          {dm.differential.map((d, i) => (
            <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300">{d}</span>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-500"><span className="font-semibold">Follow-up:</span> {dm.followUp}</p>
        </div>
      </div>
    </section>
  );
}

function SoapRow({ letter, label, text }: { letter: string; label: string; text: string }) {
  return (
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{letter}</div>
      <div className="flex-1">
        <span className="text-[10px] uppercase tracking-wide text-slate-400">{label}</span>
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ============================================
// PANEL 8: UNCERTAINTY DISPLAY
// ============================================

function UncertaintyPanel({ report }: { report: CTEEReport }) {
  const { uncertainty } = report;
  return (
    <section className={`rounded-2xl border-2 p-5 sm:p-6 ${
      uncertainty.weakPrediction
        ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
        : 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${uncertainty.weakPrediction ? 'bg-rose-500' : 'bg-amber-500'}`}>
          {uncertainty.weakPrediction
            ? <ShieldAlert className="h-4 w-4 text-white" />
            : <AlertCircle className="h-4 w-4 text-white" />}
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Uncertainty Display</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Weak predictions &amp; missing data — never overstate confidence</p>
        </div>
      </div>

      {/* Disclosure banner */}
      <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${
        uncertainty.weakPrediction ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
      }`}>
        {uncertainty.disclosure}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Uncertainty factors */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Confidence-Reducing Factors</h4>
          {uncertainty.factors.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-4 w-4" /> No uncertainty factors — fully supported
            </div>
          ) : (
            <div className="space-y-2">
              {uncertainty.factors.map((f, i) => (
                <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{f.factor}</span>
                    <span className="text-[10px] font-bold text-rose-600">−{f.impact}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{f.detail}</p>
                  {f.mitigatable && (
                    <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">Mitigatable</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing data */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Missing Data</h4>
          {uncertainty.missingData.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-4 w-4" /> All required fields provided
            </div>
          ) : (
            <div className="space-y-2">
              {uncertainty.missingData.map((m, i) => {
                const sevColor = m.severity === 'high' ? 'rose' : m.severity === 'moderate' ? 'amber' : 'slate';
                return (
                  <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{m.field}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${sevColor}-100 dark:bg-${sevColor}-950/40 text-${sevColor}-700 dark:text-${sevColor}-300 uppercase`}>{m.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{m.whyItMatters}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CLINICAL KNOWLEDGE GRAPH
// ============================================

function KnowledgeGraphPanel({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const diseases = CLINICAL_KG.nodes.filter(n => n.type === 'disease');
  const selected = CLINICAL_KG.nodes.find(n => n.id === selectedId)!;

  // Related nodes via edges
  const relatedEdges = CLINICAL_KG.edges.filter(e => e.from === selectedId || e.to === selectedId);
  const relatedIds = new Set<string>();
  relatedEdges.forEach(e => { relatedIds.add(e.from); relatedIds.add(e.to); });
  const related = CLINICAL_KG.nodes.filter(n => relatedIds.has(n.id) && n.id !== selectedId);

  const typeColor: Record<string, string> = {
    disease: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    symptom: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    treatment: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    guideline: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-800',
    lab: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    risk_factor: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
  };

  const typeIcon: Record<string, React.ReactNode> = {
    disease: <AlertCircle className="h-3 w-3" />,
    symptom: <Activity className="h-3 w-3" />,
    treatment: <FlaskConical className="h-3 w-3" />,
    guideline: <BookOpen className="h-3 w-3" />,
    lab: <Database className="h-3 w-3" />,
    risk_factor: <AlertTriangle className="h-3 w-3" />,
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Network className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Clinical Knowledge Graph</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Diseases ↔ symptoms ↔ labs ↔ treatments ↔ guidelines</p>
        </div>
      </div>

      {/* Disease selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {diseases.map(d => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              selectedId === d.id
                ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-medium'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-rose-300'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Graph viz */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6 min-h-[280px] overflow-x-auto">
        <div className="flex flex-col items-center gap-4">
          {/* Central node */}
          <div className={`px-4 py-2.5 rounded-xl border-2 ${typeColor.disease} shadow-lg`}>
            <div className="flex items-center gap-2">
              {typeIcon.disease}
              <div>
                <p className="text-[10px] uppercase tracking-wide opacity-70">Disease</p>
                <p className="text-sm font-bold">{selected.label}</p>
              </div>
            </div>
            {selected.description && <p className="text-[10px] mt-1 opacity-70 max-w-[200px]">{selected.description}</p>}
          </div>

          {/* Connection lines */}
          <div className="text-slate-300 text-2xl">↕</div>

          {/* Related nodes grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-3xl">
            {related.map(n => {
              const edge = relatedEdges.find(e => (e.from === selectedId && e.to === n.id) || (e.to === selectedId && e.from === n.id));
              return (
                <div key={n.id} className={`px-2.5 py-2 rounded-lg border ${typeColor[n.type]} text-xs`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {typeIcon[n.type]}
                    <span className="font-semibold">{n.label}</span>
                  </div>
                  <span className="text-[9px] uppercase opacity-60">{edge?.relation.replace('_', ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
        {Object.entries(typeColor).map(([type, cls]) => (
          <span key={type} className={`px-2 py-0.5 rounded ${cls}`}>{type.replace('_', ' ')}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">{CLINICAL_KG.nodes.length}</p>
          <p className="text-[10px] text-slate-500">Nodes</p>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">{CLINICAL_KG.edges.length}</p>
          <p className="text-[10px] text-slate-500">Edges</p>
        </div>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">{GUIDELINES.length}</p>
          <p className="text-[10px] text-slate-500">Guidelines</p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SAFETY FOOTER
// ============================================

function SafetyFooter({ report }: { report: CTEEReport }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="h-4 w-4 text-rose-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Safety Rules &amp; Flags</h3>
      </div>
      <ul className="space-y-1.5">
        {report.safetyFlags.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[11px] text-slate-400 italic">
          Aarogya AI outputs are advisory and not a substitute for professional medical judgment.
          Every prediction is logged for audit and may be reviewed against actual outcomes to
          continuously improve model trust.
        </p>
      </div>
    </section>
  );
}
