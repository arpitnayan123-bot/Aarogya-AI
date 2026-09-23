'use client';

// ============================================
// AAROGYA AI — AUTONOMOUS LEARNING & EVOLUTION ENGINE (ALEE)
// UI: "AI Evolution Insights" panel
//
// Shows how Aarogya continuously learns, adapts, and evolves across
// Causal / Decision / Digital Twin / Continuous / Trust / Latent engines.
// ============================================

import { useState, useMemo, useEffect } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Activity, Sparkles, Zap, RotateCw,
  CheckCircle2, XCircle, AlertTriangle, Clock, Target, Award, Database,
  Network, GitBranch, Layers, Shield, ShieldCheck, ShieldAlert,
  Cpu, Eye, ArrowUpRight, ArrowDownRight, RefreshCw, Users, User,
  Lightbulb, FlaskConical, Scale, BarChart3, LineChart, Lock,
} from 'lucide-react';
import {
  getALEEStats, getPredictions, getEpisodes, getPersonalMemory, getGlobalMemory,
  getSafetyChecks, getIntuitionSignalsList, getJEPAPredictions,
  getModelVersions, getPerformanceMetrics, getReasoningPathways,
  getEngineLearningSummaries, resolvePrediction, recordPrediction,
  type EngineTarget, type OutcomeQuality, type LearningMethod,
} from '@/lib/alee';

// ============================================
// MAIN COMPONENT
// ============================================

export default function AutonomousLearningEngine() {
  const [tick, setTick] = useState(0); // refresh trigger
  const [resolveTarget, setResolveTarget] = useState<string | null>(null);
  const [outcomeText, setOutcomeText] = useState('');
  const [outcomeQuality, setOutcomeQuality] = useState<OutcomeQuality>('success');

  // Force re-read after mutations
  const refresh = () => setTick(t => t + 1);

  const stats = useMemo(() => getALEEStats(), [tick]);
  const predictions = useMemo(() => getPredictions(), [tick]);
  const episodes = useMemo(() => getEpisodes(), [tick]);
  const personal = useMemo(() => getPersonalMemory(), [tick]);
  const global = useMemo(() => getGlobalMemory(), [tick]);
  const safety = useMemo(() => getSafetyChecks(), [tick]);
  const intuition = useMemo(() => getIntuitionSignalsList(), [tick]);
  const jepa = useMemo(() => getJEPAPredictions(), [tick]);
  const versions = useMemo(() => getModelVersions(), [tick]);
  const perf = useMemo(() => getPerformanceMetrics(), [tick]);
  const pathways = useMemo(() => getReasoningPathways(), [tick]);
  const summaries = useMemo(() => getEngineLearningSummaries(), [tick]);

  const handleResolve = (predId: string) => {
    if (!outcomeText.trim()) return;
    resolvePrediction(predId, outcomeQuality, outcomeText);
    setResolveTarget(null);
    setOutcomeText('');
    setOutcomeQuality('success');
    refresh();
  };

  const handleSimulatePrediction = () => {
    const engines: EngineTarget[] = ['causal', 'decision', 'digital_twin', 'continuous'];
    const randomEngine = engines[Math.floor(Math.random() * engines.length)];
    const samples: Record<EngineTarget, { pred: string; conf: number }> = {
      causal: { pred: 'Stress + sleep deficit → BP elevation risk', conf: 74 },
      decision: { pred: 'Recommend lifestyle intervention over medication', conf: 81 },
      digital_twin: { pred: 'HbA1c projected to stabilize at 6.6% in 60 days', conf: 68 },
      continuous: { pred: 'HRV pattern suggests recovery improvement', conf: 76 },
      trust: { pred: 'Confidence calibration within range', conf: 85 },
      latent: { pred: 'Latent stress score declining', conf: 72 },
    };
    const s = samples[randomEngine];
    recordPrediction(randomEngine, s.pred, s.conf, { sample: Math.random() });
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Header stats={stats} onSimulate={handleSimulatePrediction} />

      {/* LEARNING LOOP DIAGRAM */}
      <LearningLoopDiagram />

      {/* STATS GRID */}
      <StatsGrid stats={stats} />

      {/* PERFORMANCE GROWTH CHART */}
      <PerformanceChart metrics={perf} />

      {/* TWO-COLUMN: Personal + Global Memory */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PersonalMemoryPanel memory={personal} />
        <GlobalMemoryPanel memory={global} />
      </div>

      {/* ENGINE LEARNING SUMMARIES (Integration table) */}
      <EngineIntegrationPanel summaries={summaries} />

      {/* MODEL VERSIONS / EVOLUTION TIMELINE */}
      <ModelEvolutionPanel versions={versions} />

      {/* LEARNING EPISODES */}
      <LearningEpisodesPanel episodes={episodes} />

      {/* PREDICTIONS + OUTCOMES (audit-style with resolve flow) */}
      <PredictionsPanel
        predictions={predictions}
        resolveTarget={resolveTarget}
        setResolveTarget={setResolveTarget}
        outcomeText={outcomeText}
        setOutcomeText={setOutcomeText}
        outcomeQuality={outcomeQuality}
        setOutcomeQuality={setOutcomeQuality}
        onResolve={handleResolve}
      />

      {/* ADAPTIVE REASONING PATHWAYS */}
      <ReasoningPathwaysPanel pathways={pathways} />

      {/* DIGITAL INTUITION */}
      <DigitalIntuitionPanel signals={intuition} />

      {/* JEPA LATENT PREDICTOR */}
      <JEPAPanel jepa={jepa} avgError={stats.avgJEPAError} />

      {/* SAFETY & GOVERNANCE */}
      <SafetyGovernancePanel checks={safety} />
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function Header({ stats, onSimulate }: { stats: ReturnType<typeof getALEEStats>; onSimulate: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
      {/* Ambient orbs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
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
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">LEARNING ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <RotateCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs text-slate-300">Self-improving</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Lock className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs text-slate-300">Safety-gated</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Brain className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">{stats.totalEpisodes} episodes learned</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          AI Evolution Insights
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          Aarogya continuously learns from every prediction, decision, and outcome —
          evolving into a long-term intelligent healthcare entity. No black box: every
          update is validated, explainable, and reversible.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={onSimulate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/25"
          >
            <Sparkles className="h-4 w-4" />
            Simulate New Prediction
          </button>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> +{stats.accuracyGrowth30d}% accuracy growth (30d)</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-cyan-400" /> {stats.totalCasesLearned.toLocaleString()} cases learned</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-violet-400" /> {stats.approvedUpdates} approved updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LEARNING LOOP DIAGRAM
// ============================================

function LearningLoopDiagram() {
  const stages = [
    { id: 'prediction', label: 'Prediction', icon: Target, color: 'emerald', desc: 'Engine makes a forecast' },
    { id: 'outcome', label: 'Outcome', icon: Activity, color: 'cyan', desc: 'Real-world result observed' },
    { id: 'error', label: 'Error', icon: AlertTriangle, color: 'amber', desc: 'Gap between prediction & reality' },
    { id: 'learning', label: 'Learning', icon: Brain, color: 'violet', desc: 'Insight extracted from error' },
    { id: 'update', label: 'Update', icon: RefreshCw, color: 'rose', desc: 'Model refined (safety-gated)' },
  ];
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    cyan: 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
    amber: 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    violet: 'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
    rose: 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <RotateCw className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">The Learning Loop</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Prediction → Outcome → Error → Learning → Update — runs continuously</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div className={`rounded-xl border-2 p-3 min-w-[120px] ${colorMap[s.color]}`}>
                <Icon className="h-4 w-4 mb-1.5" />
                <p className="text-xs font-bold">{s.label}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{s.desc}</p>
              </div>
              {i < stages.length - 1 && (
                <ArrowUpRight className="h-4 w-4 text-slate-300 rotate-45" />
              )}
            </div>
          );
        })}
        <div className="shrink-0 ml-2">
          <RefreshCw className="h-5 w-5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>
    </section>
  );
}

// ============================================
// STATS GRID
// ============================================

function StatsGrid({ stats }: { stats: ReturnType<typeof getALEEStats> }) {
  const cards = [
    { label: 'Current Accuracy', value: `${stats.currentAccuracy}%`, icon: Target, color: 'emerald', trend: `+${stats.accuracyGrowth30d}%` },
    { label: 'Predictions Logged', value: stats.totalPredictions, icon: Activity, color: 'cyan', sub: `${stats.resolvedPredictions} resolved` },
    { label: 'Episodes Learned', value: stats.totalEpisodes, icon: Brain, color: 'violet', sub: 'validated updates' },
    { label: 'Approved Updates', value: stats.approvedUpdates, icon: CheckCircle2, color: 'teal', sub: `${stats.rejectedUpdates} rejected` },
    { label: 'Pending Review', value: stats.pendingUpdates, icon: Clock, color: 'amber', sub: 'awaiting sign-off' },
    { label: 'Active Pathways', value: stats.activePathways, icon: GitBranch, color: 'rose', sub: `${stats.refinedPathways} under refinement` },
    { label: 'Intuition Signals', value: stats.intuitionSignals, icon: Lightbulb, color: 'orange', sub: 'early-detected' },
    { label: 'JEPA Avg Error', value: stats.avgJEPAError.toFixed(3), icon: Network, color: 'indigo', sub: `${stats.jepaPredictions} latent preds` },
  ];
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-600',
    cyan: 'bg-cyan-500/15 text-cyan-600',
    violet: 'bg-violet-500/15 text-violet-600',
    teal: 'bg-teal-500/15 text-teal-600',
    amber: 'bg-amber-500/15 text-amber-600',
    rose: 'bg-rose-500/15 text-rose-600',
    orange: 'bg-orange-500/15 text-orange-600',
    indigo: 'bg-indigo-500/15 text-indigo-600',
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colorMap[c.color]}`}>
                <Icon className="h-4 w-4" />
              </div>
              {'trend' in c && c.trend && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                  <ArrowUpRight className="h-2.5 w-2.5" /> {c.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{c.label}</p>
            {'sub' in c && c.sub && <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// PERFORMANCE GROWTH CHART
// ============================================

function PerformanceChart({ metrics }: { metrics: ReturnType<typeof getPerformanceMetrics> }) {
  const max = 100;
  const w = 720, h = 200, pad = 30;
  const stepX = (w - pad * 2) / Math.max(1, metrics.length - 1);
  const y = (v: number) => h - pad - ((v / max) * (h - pad * 2));
  const x = (i: number) => pad + i * stepX;
  const lineFor = (key: 'accuracy' | 'decisionSuccessRate' | 'userOutcomeImprovement') =>
    metrics.map((m, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(m[key])}`).join(' ');
  const areaFor = (key: 'accuracy' | 'decisionSuccessRate' | 'userOutcomeImprovement') =>
    `${lineFor(key)} L ${x(metrics.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <LineChart className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Performance Growth</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy, decision success &amp; user outcome improvement over 8 weeks</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Accuracy</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-500" /> Decision Success</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Outcome Improvement</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={w} height={h} className="min-w-full">
          <defs>
            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* grid lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line x1={pad} y1={y(v)} x2={w - pad} y2={y(v)} stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" />
              <text x={pad - 6} y={y(v) + 3} textAnchor="end" className="fill-slate-400 text-[9px]">{v}</text>
            </g>
          ))}
          {/* area + lines */}
          <path d={areaFor('accuracy')} fill="url(#accGrad)" />
          <path d={lineFor('accuracy')} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={lineFor('decisionSuccessRate')} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
          <path d={lineFor('userOutcomeImprovement')} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" />
          {/* data points */}
          {metrics.map((m, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(m.accuracy)} r="3.5" fill="#10b981" />
              <text x={x(i)} y={h - pad + 14} textAnchor="middle" className="fill-slate-400 text-[9px]">W{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

// ============================================
// PERSONAL MEMORY PANEL
// ============================================

function PersonalMemoryPanel({ memory }: { memory: ReturnType<typeof getPersonalMemory> }) {
  const trendColor: Record<string, string> = {
    improving: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40',
    stable: 'text-slate-600 bg-slate-100 dark:bg-slate-800',
    declining: 'text-rose-600 bg-rose-100 dark:bg-rose-950/40',
  };
  const trendIcon: Record<string, typeof TrendingUp> = {
    improving: TrendingUp, stable: Activity, declining: TrendingDown,
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <User className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Personal Memory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">User-specific patterns &amp; intervention responses</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">{memory.totalEpisodes} episodes</span>
      </div>

      {/* Patterns */}
      <div className="space-y-2 mb-4">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Learned Patterns</h4>
        {memory.patterns.map(p => {
          const TIcon = trendIcon[p.trend];
          return (
            <div key={p.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 capitalize">{p.feature.replace(/_/g, ' ')}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${trendColor[p.trend]} flex items-center gap-0.5`}>
                  <TIcon className="h-2.5 w-2.5" /> {p.trend}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span>Baseline: <span className="font-mono text-slate-700 dark:text-slate-300">{p.baseline}</span></span>
                <span>±{p.variance}</span>
                <span>Confidence: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.confidence}%</span></span>
              </div>
              {p.interventionResponses.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.interventionResponses.map((ir, i) => (
                    <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${ir.effect > 0 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : ir.effect < 0 ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                      {ir.intervention}: {ir.effect > 0 ? '+' : ''}{ir.effect}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Behavior history */}
      <h4 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Recent Behavior</h4>
      <div className="max-h-40 overflow-y-auto space-y-1.5 alee-scroll pr-1">
        {memory.behaviorHistory.map(b => (
          <div key={b.id} className="flex items-center gap-2 text-[11px] p-2 rounded-md bg-slate-50 dark:bg-slate-900">
            <div className="flex-1">
              <span className="text-slate-700 dark:text-slate-200">{b.action}</span>
              <span className="text-slate-400 ml-1.5">· {b.category}</span>
            </div>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${b.adherence}%` }} />
            </div>
            <span className="text-slate-500 w-8 text-right">{b.adherence}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// GLOBAL MEMORY PANEL
// ============================================

function GlobalMemoryPanel({ memory }: { memory: ReturnType<typeof getGlobalMemory> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Users className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Global Memory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cross-user insights &amp; population patterns</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-medium">{memory.totalCasesLearned.toLocaleString()} cases</span>
      </div>

      {/* Insights */}
      <div className="space-y-2 mb-4">
        <h4 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Learned Population Insights</h4>
        {memory.insights.map(gi => (
          <div key={gi.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs text-slate-700 dark:text-slate-200 flex-1">{gi.pattern}</p>
              {gi.biasChecked && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" /> bias-checked
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" /> {gi.population}</span>
              <span className="flex items-center gap-0.5"><Database className="h-2.5 w-2.5" /> {gi.evidence} cases</span>
              <span className="flex items-center gap-0.5"><Target className="h-2.5 w-2.5" /> {gi.confidence}% conf</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {gi.applicableEngines.map(e => (
                <span key={e} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">→ {e}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Population patterns */}
      <h4 className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Population Distributions</h4>
      <div className="space-y-2">
        {memory.populationPatterns.map(pp => (
          <div key={pp.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">{pp.cohort.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-slate-400">n={pp.sampleSize}</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-1">{pp.feature.replace(/_/g, ' ')}</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300">
              <span>p25: <span className="font-mono">{pp.distribution.p25}</span></span>
              <span>·</span>
              <span>median: <span className="font-mono font-semibold">{pp.distribution.median}</span></span>
              <span>·</span>
              <span>p75: <span className="font-mono">{pp.distribution.p75}</span></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// ENGINE INTEGRATION PANEL
// ============================================

const ENGINE_COLORS: Record<EngineTarget, string> = {
  causal: 'violet',
  decision: 'emerald',
  digital_twin: 'cyan',
  continuous: 'teal',
  trust: 'amber',
  latent: 'rose',
};

function EngineIntegrationPanel({ summaries }: { summaries: ReturnType<typeof getEngineLearningSummaries> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Layers className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Engine Integration</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">What ALEE has learned &amp; applied to each engine</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-3 font-semibold">Engine</th>
              <th className="py-2 px-3 font-semibold">Version</th>
              <th className="py-2 px-3 font-semibold">Episodes</th>
              <th className="py-2 px-3 font-semibold">Δ Accuracy</th>
              <th className="py-2 px-3 font-semibold">Pathways</th>
              <th className="py-2 px-3 font-semibold">Pending</th>
              <th className="py-2 pl-3 font-semibold">Top Insight</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map(s => {
              const c = ENGINE_COLORS[s.engine];
              return (
                <tr key={s.engine} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-2.5 pr-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-${c}-100 dark:bg-${c}-950/40 text-${c}-700 dark:text-${c}-300 font-medium capitalize`}>
                      {s.engine.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{s.currentVersion}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200">{s.episodesLearned}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
                      <ArrowUpRight className="h-3 w-3" /> +{s.accuracyDelta}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {s.activePathways} active
                    {s.refinedPathways > 0 && <span className="text-amber-500 ml-1">· {s.refinedPathways} refined</span>}
                  </td>
                  <td className="py-2.5 px-3">
                    {s.pendingChanges > 0
                      ? <span className="text-amber-600 font-medium">{s.pendingChanges}</span>
                      : <span className="text-slate-400">0</span>}
                  </td>
                  <td className="py-2.5 pl-3 text-slate-600 dark:text-slate-300 italic">{s.topInsight}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================
// MODEL EVOLUTION TIMELINE
// ============================================

function ModelEvolutionPanel({ versions }: { versions: ReturnType<typeof getModelVersions> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Model Evolution Timeline</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Versioned updates per engine — all validated &amp; rollback-ready</p>
        </div>
      </div>
      <div className="space-y-3">
        {versions.map(v => {
          const c = ENGINE_COLORS[v.engine];
          return (
            <div key={v.engine} className="relative pl-8">
              <div className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-${c}-100 dark:bg-${c}-950/40 border-2 border-${c}-400 flex items-center justify-center`}>
                <Cpu className={`h-3 w-3 text-${c}-600`} />
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold capitalize text-${c}-700 dark:text-${c}-300`}>{v.engine.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{v.version}</span>
                    {v.validated && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    {v.rollbackAvailable && <RotateCw className="h-3 w-3 text-slate-400" title="Rollback available" />}
                  </div>
                  <span className="text-[11px] text-slate-500">{new Date(v.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5 font-medium`}>
                    <ArrowUpRight className="h-2.5 w-2.5" /> +{v.accuracyDelta}%
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {v.changes.map((ch, i) => (
                    <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex gap-1.5">
                      <span className={`text-${c}-500`}>•</span>{ch}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// LEARNING EPISODES PANEL
// ============================================

const METHOD_COLOR: Record<LearningMethod, string> = {
  reinforcement: 'emerald',
  continual: 'cyan',
  self_supervised: 'violet',
  rule_refinement: 'amber',
};

function LearningEpisodesPanel({ episodes }: { episodes: ReturnType<typeof getEpisodes> }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Brain className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Learning Episodes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Each episode = one error turned into an improvement</p>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2 alee-scroll pr-1">
        {episodes.slice().reverse().map(ep => {
          const c = METHOD_COLOR[ep.method];
          const positive = ep.reward >= 0;
          return (
            <div key={ep.id} className={`rounded-xl border p-3 ${ep.validated ? 'border-slate-200 dark:border-slate-800' : 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10'}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${c}-100 dark:bg-${c}-950/40 text-${c}-700 dark:text-${c}-300 font-medium uppercase`}>
                    {ep.method.replace('_', '-')}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">{ep.engine.replace(/_/g, ' ')}</span>
                  {ep.validated ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Clock className="h-3 w-3 text-amber-500" />}
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`flex items-center gap-0.5 ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {positive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    reward {ep.reward > 0 ? '+' : ''}{ep.reward}
                  </span>
                  <span className="text-slate-400">error: {ep.errorDetected}</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mb-1.5">{ep.insightLearned}</p>
              <p className="text-[10px] text-slate-500 mb-2">Applied to: <span className="font-medium text-slate-600 dark:text-slate-300">{ep.appliedTo}</span></p>
              {Object.keys(ep.weightDelta).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(ep.weightDelta).map(([k, v]) => (
                    <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${v > 0 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'}`}>
                      {k}: {v > 0 ? '+' : ''}{v}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                <span>Rollback risk:</span>
                <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-[80px]">
                  <div className={`h-full rounded-full ${ep.rollbackRisk > 50 ? 'bg-rose-500' : ep.rollbackRisk > 25 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${ep.rollbackRisk}%` }} />
                </div>
                <span>{ep.rollbackRisk}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// PREDICTIONS + OUTCOMES PANEL
// ============================================

function PredictionsPanel({
  predictions, resolveTarget, setResolveTarget, outcomeText, setOutcomeText,
  outcomeQuality, setOutcomeQuality, onResolve,
}: {
  predictions: ReturnType<typeof getPredictions>;
  resolveTarget: string | null;
  setResolveTarget: (id: string | null) => void;
  outcomeText: string;
  setOutcomeText: (s: string) => void;
  outcomeQuality: OutcomeQuality;
  setOutcomeQuality: (q: OutcomeQuality) => void;
  onResolve: (id: string) => void;
}) {
  const outcomeIcon: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    partial: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
    failure: <XCircle className="h-3.5 w-3.5 text-rose-500" />,
    pending: <Clock className="h-3.5 w-3.5 text-slate-400" />,
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Target className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Predictions → Outcomes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Log real outcomes to trigger learning episodes</p>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-2 alee-scroll pr-1">
        {predictions.slice().reverse().map(p => {
          const c = ENGINE_COLORS[p.engine];
          return (
            <div key={p.id} className={`rounded-xl border p-3 ${p.outcome === 'pending' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {outcomeIcon[p.outcome || 'pending']}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{p.prediction}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      <span className={`text-${c}-600`}>{p.engine.replace(/_/g, ' ')}</span>
                      {' · '}{new Date(p.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {' · '}{p.confidence}% conf
                    </p>
                    {p.outcomeDetail && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-medium">Actual:</span> {p.outcomeDetail}
                      </p>
                    )}
                    {p.errorMagnitude !== undefined && p.outcome !== 'pending' && (
                      <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                        <span className="text-slate-400">Error magnitude:</span>
                        <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-[100px]">
                          <div className={`h-full rounded-full ${p.errorMagnitude > 50 ? 'bg-rose-500' : p.errorMagnitude > 25 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.errorMagnitude}%` }} />
                        </div>
                        <span>{p.errorMagnitude}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {p.outcome === 'pending' && (
                <div className="mt-2">
                  {resolveTarget === p.id ? (
                    <div className="space-y-2 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <input
                        value={outcomeText}
                        onChange={e => setOutcomeText(e.target.value)}
                        placeholder="What was the actual outcome?"
                        className="w-full px-2 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200"
                      />
                      <div className="flex gap-1">
                        {(['success', 'partial', 'failure'] as OutcomeQuality[]).map(q => (
                          <button
                            key={q}
                            onClick={() => setOutcomeQuality(q)}
                            className={`px-2 py-1 text-[11px] rounded-md ${outcomeQuality === q ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                          >
                            {q}
                          </button>
                        ))}
                        <button
                          onClick={() => onResolve(p.id)}
                          className="ml-auto px-2 py-1 text-[11px] rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          Log &amp; Learn
                        </button>
                        <button onClick={() => setResolveTarget(null)} className="px-2 py-1 text-[11px] rounded-md text-slate-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResolveTarget(p.id)}
                      className="text-[11px] px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                    >
                      + Log Outcome &amp; Trigger Learning
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// REASONING PATHWAYS PANEL
// ============================================

function ReasoningPathwaysPanel({ pathways }: { pathways: ReturnType<typeof getReasoningPathways> }) {
  const statusColor: Record<string, string> = {
    active: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    refined: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
    under_review: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    deprecated: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    replaced: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
  };
  const statusIcon: Record<string, typeof CheckCircle2> = {
    active: CheckCircle2, refined: Sparkles, under_review: AlertTriangle, deprecated: XCircle, replaced: RefreshCw,
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Adaptive Reasoning Pathways</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">If a reasoning pattern fails, it&apos;s refined or replaced</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {pathways.map(p => {
          const c = ENGINE_COLORS[p.engine];
          const SIcon = statusIcon[p.status];
          return (
            <div key={p.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded bg-${c}-100 dark:bg-${c}-950/40 text-${c}-700 dark:text-${c}-300 font-medium capitalize`}>
                  {p.engine.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${statusColor[p.status]}`}>
                  <SIcon className="h-2.5 w-2.5" /> {p.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mb-2">{p.pattern}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                <span>{p.successCount}✓ / {p.failureCount}✗</span>
                <span className="font-semibold">{p.successRate}% success</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
                <div className={`h-full rounded-full ${p.successRate >= 80 ? 'bg-emerald-500' : p.successRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${p.successRate}%` }} />
              </div>
              {p.refinement && (
                <p className="text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/30 p-1.5 rounded">
                  <Sparkles className="h-2.5 w-2.5 inline mr-1" />{p.refinement}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// DIGITAL INTUITION PANEL
// ============================================

function DigitalIntuitionPanel({ signals }: { signals: ReturnType<typeof getIntuitionSignalsList> }) {
  return (
    <section className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 dark:from-violet-950/20 dark:to-fuchsia-950/10 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Digital Intuition</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Patterns recognized beyond explicit rules — early anomaly detection</p>
        </div>
      </div>
      <div className="space-y-2">
        {signals.map(s => (
          <div key={s.id} className="rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 flex-1">{s.signal}</p>
              {s.detectedEarly && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 flex items-center gap-0.5 whitespace-nowrap">
                  <Eye className="h-2.5 w-2.5" /> EARLY
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mb-2">{s.evidence}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400">Confidence:</span>
                <div className="w-16 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                </div>
                <span className="font-semibold text-slate-600 dark:text-slate-300">{s.confidence}%</span>
              </div>
              {s.actionTaken && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                  <Zap className="h-2.5 w-2.5" /> {s.actionTaken}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// JEPA LATENT PREDICTOR PANEL
// ============================================

function JEPAPanel({ jepa, avgError }: { jepa: ReturnType<typeof getJEPAPredictions>; avgError: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Network className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">JEPA Self-Supervised Predictor</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Joint-Embedding Predictive Architecture — predicts latent state transitions</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Avg Prediction Error</p>
          <p className="text-lg font-bold text-emerald-600">{avgError.toFixed(3)}</p>
        </div>
      </div>
      <div className="space-y-3">
        {jepa.map(j => {
          const error = j.predictionError || 0;
          const errorPct = Math.min(100, error * 1000);
          return (
            <div key={j.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span>{new Date(j.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-2">
                  {j.learned && <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> refined predictor</span>}
                </div>
              </div>
              {/* Embedding visualization */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">Input Embedding (16-dim)</p>
                  <div className="flex items-end gap-0.5 h-8">
                    {j.inputEmbedding.map((v, i) => (
                      <div key={i} className="flex-1 bg-cyan-500 rounded-sm" style={{ height: `${v * 100}%` }} title={`dim ${i}: ${v.toFixed(2)}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">Predicted Next State</p>
                  <div className="flex items-end gap-0.5 h-8">
                    {j.predictedEmbedding.map((v, i) => (
                      <div key={i} className={`flex-1 ${error > 0.05 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-sm`} style={{ height: `${v * 100}%` }} title={`pred ${i}: ${v.toFixed(2)}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400">Prediction error:</span>
                <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full ${error > 0.05 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${errorPct}%` }} />
                </div>
                <span className={`font-semibold ${error > 0.05 ? 'text-amber-600' : 'text-emerald-600'}`}>{error.toFixed(3)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================
// SAFETY & GOVERNANCE PANEL
// ============================================

function SafetyGovernancePanel({ checks }: { checks: ReturnType<typeof getSafetyChecks> }) {
  const statusColor: Record<string, string> = {
    approved: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    rejected: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    pending: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  };
  const statusIcon: Record<string, typeof CheckCircle2> = {
    approved: ShieldCheck, rejected: ShieldAlert, pending: Shield,
  };
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Shield className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Safety &amp; Governance</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Every proposed change is validated before applying — no unsafe updates</p>
        </div>
      </div>
      <div className="space-y-2">
        {checks.slice().reverse().map(c => {
          const SIcon = statusIcon[c.validationStatus];
          return (
            <div key={c.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 flex-1">{c.proposedChange}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${statusColor[c.validationStatus]}`}>
                  <SIcon className="h-2.5 w-2.5" /> {c.validationStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">{c.reason}</p>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <SafetyMetric label="Clinical Alignment" value={c.clinicalAlignmentScore} good={c.clinicalAlignmentScore >= 70} />
                <SafetyMetric label="Bias Score" value={c.biasScore} good={c.biasScore <= 20} inverse />
                <SafetyMetric label="Drift Score" value={c.driftScore} good={c.driftScore <= 30} inverse />
              </div>
            </div>
          );
        })}
      </div>
      {/* Safety rules footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="grid sm:grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Scale className="h-3 w-3 text-emerald-500" /> Never degrade performance
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="h-3 w-3 text-cyan-500" /> Validate before updating
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Eye className="h-3 w-3 text-violet-500" /> Maintain explainability
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetyMetric({ label, value, good, inverse }: { label: string; value: number; good: boolean; inverse?: boolean }) {
  return (
    <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-1.5">
      <p className="text-[9px] uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className={`h-full rounded-full ${good ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${value}%` }} />
        </div>
        <span className={`font-semibold ${good ? 'text-emerald-600' : 'text-rose-600'}`}>{value}</span>
      </div>
      {inverse && <p className="text-[8px] text-slate-400 mt-0.5">lower = better</p>}
    </div>
  );
}
