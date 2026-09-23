'use client';

// ============================================
// AAROGYA AI — MULTI-MODAL DIAGNOSTIC FUSION (Module 4 UI)
// "Unified Diagnostic Intelligence" — combines Labs + Imaging + Notes + Wearables
// ============================================

import { useState, useMemo } from 'react';
import {
  FlaskConical, ScanLine, FileText, Watch, Activity, Layers, Target,
  CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Shield, Zap,
  TrendingUp, Brain, Database,
} from 'lucide-react';
import {
  FUSION_SCENARIOS, fuseDiagnosis, analyzeModalityContributions,
  type ModalityType, type FusionScenario,
} from '@/lib/diagnosticFusion';
import { publish } from '@/lib/intelligenceBus';

const MODALITY_ICON: Record<ModalityType, typeof FlaskConical> = {
  lab: FlaskConical,
  imaging: ScanLine,
  clinical_notes: FileText,
  wearable: Watch,
  symptom: Activity,
};

const MODALITY_COLOR: Record<ModalityType, string> = {
  lab: 'cyan',
  imaging: 'violet',
  clinical_notes: 'amber',
  wearable: 'emerald',
  symptom: 'rose',
};

export default function MultiModalDiagnosticFusion() {
  const [activeId, setActiveId] = useState(FUSION_SCENARIOS[0].id);

  const scenario = useMemo<FusionScenario>(
    () => FUSION_SCENARIOS.find(s => s.id === activeId)!,
    [activeId],
  );
  const fusion = useMemo(() => fuseDiagnosis(scenario), [scenario]);
  const contributions = useMemo(
    () => analyzeModalityContributions(scenario.modalities, fusion),
    [scenario, fusion],
  );

  const handleFuse = (sc: FusionScenario) => {
    setActiveId(sc.id);
    // Publish fusion result to the intelligence bus
    publish({
      type: 'fusion_result',
      source: 'diagnostic_fusion',
      targets: ['trust_layer', 'disease_predictor', 'learning_engine'],
      headline: `Multi-modal fusion: ${fusion.primaryDiagnosis} — ${fusion.confidence}% confidence`,
      payload: { diagnosis: fusion.primaryDiagnosis, confidence: fusion.confidence, modalities: fusion.contributingModalities },
      priority: fusion.riskLevel === 'critical' ? 'critical' : fusion.riskLevel === 'high' ? 'high' : 'medium',
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
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
              <span className="text-xs font-semibold text-emerald-300 tracking-wide">FUSION ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300">Multi-modal</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Brain className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs text-slate-300">{scenario.modalities.length} modalities</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Unified Diagnostic Intelligence
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Fuses Labs + Imaging + Clinical Notes + Wearables into a single diagnosis
            with confidence score. Cross-modal correlations strengthen findings;
            conflicts are surfaced, not hidden.
          </p>
        </div>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Clinical Scenarios</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {FUSION_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => handleFuse(s)}
              className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                activeId === s.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 bg-white dark:bg-slate-900'
              }`}
            >
              <span className={`text-xs font-semibold ${activeId === s.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {s.label}
              </span>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* PRIMARY DIAGNOSIS CARD */}
      <DiagnosisCard fusion={fusion} />

      {/* MODALITY CONTRIBUTIONS */}
      <ModalityContributionsPanel contributions={contributions} modalities={scenario.modalities} />

      {/* EVIDENCE GRID */}
      <EvidencePanel fusion={fusion} />

      {/* CROSS-MODAL CORRELATIONS */}
      {fusion.crossModalCorrelations.length > 0 && (
        <CorrelationsPanel fusion={fusion} />
      )}

      {/* DIFFERENTIALS */}
      <DifferentialsPanel fusion={fusion} />

      {/* DATA COMPLETENESS + RECOMMENDATION */}
      <RecommendationPanel fusion={fusion} />
    </div>
  );
}

// ============================================
// PRIMARY DIAGNOSIS CARD
// ============================================

function DiagnosisCard({ fusion }: { fusion: ReturnType<typeof fuseDiagnosis> }) {
  const riskColor: Record<string, string> = {
    low: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40',
    moderate: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40',
    high: 'text-orange-600 bg-orange-100 dark:bg-orange-950/40',
    critical: 'text-rose-600 bg-rose-100 dark:bg-rose-950/40',
  };
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fusion.confidence / 100) * circumference;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Target className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Fused Diagnosis</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Primary output of multi-modal fusion</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        {/* Confidence gauge */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="-rotate-90">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
              <defs>
                <linearGradient id="fusedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#fusedGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{fusion.confidence}%</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">confidence</span>
            </div>
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${riskColor[fusion.riskLevel]}`}>
            {fusion.riskLevel.toUpperCase()} RISK
          </div>
        </div>

        {/* Diagnosis + contributing modalities */}
        <div className="lg:col-span-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Primary Diagnosis</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{fusion.primaryDiagnosis}</h3>

          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">Contributing Modalities</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {fusion.contributingModalities.map(m => {
              const Icon = MODALITY_ICON[m];
              const c = MODALITY_COLOR[m];
              return (
                <span key={m} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-${c}-100 dark:bg-${c}-950/40 text-${c}-700 dark:text-${c}-300 text-xs font-medium capitalize`}>
                  <Icon className="h-3 w-3" />
                  {m.replace(/_/g, ' ')}
                </span>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Evidence Count</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{fusion.evidence.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Cross-Modal Links</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{fusion.crossModalCorrelations.length}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MODALITY CONTRIBUTIONS
// ============================================

function ModalityContributionsPanel({
  contributions, modalities,
}: {
  contributions: ReturnType<typeof analyzeModalityContributions>;
  modalities: FusionScenario['modalities'];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Layers className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Modality Contributions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">How much each modality contributed to the fused diagnosis</p>
        </div>
      </div>
      <div className="space-y-3">
        {contributions.map(c => {
          const Icon = MODALITY_ICON[c.modality];
          const color = MODALITY_COLOR[c.modality];
          return (
            <div key={c.modality} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg bg-${color}-100 dark:bg-${color}-950/40 flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 text-${color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-100">{c.modality.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] text-slate-500">Source: {c.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{c.contribution}%</p>
                  <p className="text-[10px] text-slate-400">contribution</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                <span>{c.findingCount} findings</span>
                <span>·</span>
                <span>{c.abnormalCount} abnormal</span>
                <span>·</span>
                <span>Reliability: {c.reliability}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${c.contribution}%`, transition: 'width 0.8s ease-out' }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// EVIDENCE PANEL
// ============================================

function EvidencePanel({ fusion }: { fusion: ReturnType<typeof fuseDiagnosis> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Database className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Evidence Trail</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Every finding that contributed to the diagnosis</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {fusion.evidence.map((e, i) => {
          const color = MODALITY_COLOR[e.modality];
          return (
            <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${color}-100 dark:bg-${color}-950/40 text-${color}-700 dark:text-${color}-300 capitalize`}>
                  {e.modality.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">strength: {e.strength}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200">{e.finding}</p>
              <div className="mt-1.5 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${e.strength}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// CROSS-MODAL CORRELATIONS
// ============================================

function CorrelationsPanel({ fusion }: { fusion: ReturnType<typeof fuseDiagnosis> }) {
  return (
    <section className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-cyan-50/30 dark:from-emerald-950/20 dark:to-cyan-950/10 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Cross-Modal Correlations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Findings from different modalities that confirm each other</p>
        </div>
      </div>
      <div className="space-y-2">
        {fusion.crossModalCorrelations.map((c, i) => (
          <div key={i} className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-3">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{c.findingA}</span>
              <ArrowRight className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{c.findingB}</span>
              <span className="text-[10px] text-slate-400 capitalize">({c.modalityA} ↔ {c.modalityB})</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                {c.strength}%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{c.correlation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// DIFFERENTIALS
// ============================================

function DifferentialsPanel({ fusion }: { fusion: ReturnType<typeof fuseDiagnosis> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Differential Diagnoses</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Alternative explanations ranked by probability</p>
        </div>
      </div>
      <div className="space-y-2">
        {fusion.differentialDiagnoses.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{d.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className={`h-full rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} style={{ width: `${d.probability}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-10 text-right">{d.probability}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// RECOMMENDATION PANEL
// ============================================

function RecommendationPanel({ fusion }: { fusion: ReturnType<typeof fuseDiagnosis> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Data completeness */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Data Completeness</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{fusion.dataCompleteness}%</span>
            <span className="text-xs text-slate-500 mb-1">of 5 modalities</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
            <div className={`h-full rounded-full ${fusion.dataCompleteness >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${fusion.dataCompleteness}%` }} />
          </div>
          {fusion.dataCompleteness < 60 && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Incomplete data — additional modalities would strengthen confidence
            </p>
          )}
        </div>

        {/* Recommendation */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recommendation</h3>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{fusion.recommendation}</p>
          {fusion.conflictingSignals.length > 0 ? (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-600">
              <AlertTriangle className="h-3 w-3" /> {fusion.conflictingSignals.length} conflicting signal(s) detected
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600">
              <CheckCircle2 className="h-3 w-3" /> No conflicting signals across modalities
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
