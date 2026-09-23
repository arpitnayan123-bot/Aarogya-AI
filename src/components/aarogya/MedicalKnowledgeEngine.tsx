'use client';

// ============================================
// AAROGYA AI — MEDICAL KNOWLEDGE ENGINE (Module 7 UI)
// Background intelligence tracking latest research, guidelines & drug safety
// ============================================

import { useState, useMemo } from 'react';
import {
  BookOpen, FlaskConical, AlertTriangle, TrendingUp, Globe, Shield,
  CheckCircle2, Clock, Search, FileText, Pill, Sparkles, Database,
  ArrowUpRight, Activity, Layers,
} from 'lucide-react';
import {
  KNOWLEDGE_ENTRIES, DRUG_SAFETY_ALERTS, GUIDELINE_UPDATES, RESEARCH_TRENDS,
  getKnowledgeStats, searchKnowledge,
  type KnowledgeEntry, type EvidenceLevel, type KnowledgeSourceType,
} from '@/lib/medicalKnowledge';
import { publish } from '@/lib/intelligenceBus';

const SOURCE_TYPE_ICON: Record<KnowledgeSourceType, typeof BookOpen> = {
  guideline: Shield,
  research_paper: FileText,
  drug_safety: AlertTriangle,
  epidemiological: Activity,
  systematic_review: Layers,
};

const EVIDENCE_LEVEL_COLOR: Record<EvidenceLevel, string> = {
  meta_analysis: 'emerald',
  rct: 'cyan',
  cohort: 'violet',
  case_control: 'amber',
  case_series: 'orange',
  expert_opinion: 'slate',
};

const EVIDENCE_LEVEL_RANK: Record<EvidenceLevel, number> = {
  meta_analysis: 6, rct: 5, cohort: 4, case_control: 3, case_series: 2, expert_opinion: 1,
};

export default function MedicalKnowledgeEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'applied' | 'pending' | 'india'>('all');

  const stats = useMemo(() => getKnowledgeStats(), []);
  const entries = useMemo(() => {
    let result = searchQuery.trim() ? searchKnowledge(searchQuery) : KNOWLEDGE_ENTRIES;
    if (filter === 'applied') result = result.filter(e => e.applied);
    else if (filter === 'pending') result = result.filter(e => !e.applied);
    else if (filter === 'india') result = result.filter(e => e.region === 'india' || e.region === 'south_asia');
    return result;
  }, [searchQuery, filter]);

  const handlePublishUpdate = (entry: KnowledgeEntry) => {
    publish({
      type: 'knowledge_update',
      source: 'medical_knowledge',
      targets: entry.appliesTo.map(a => a as never) as never,
      headline: `New ${entry.sourceType.replace(/_/g, ' ')}: ${entry.title}`,
      payload: { id: entry.id, source: entry.source, appliesTo: entry.appliesTo },
      priority: entry.impactScore > 80 ? 'high' : 'medium',
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
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
              <span className="text-xs font-semibold text-emerald-300 tracking-wide">KNOWLEDGE SYNCED</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300">{stats.totalEntries} entries</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-slate-300">{stats.indiaSpecific} India-specific</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Medical Knowledge Engine
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Background intelligence that keeps Aarogya aligned with the latest medical research,
            guidelines, and drug safety signals from ICMR, WHO, ADA, AHA, NICE, and more.
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} label="Total Entries" value={stats.totalEntries} color="emerald" />
        <StatCard icon={CheckCircle2} label="Applied to Engines" value={stats.appliedCount} color="cyan" sub={`${stats.pendingCount} pending`} />
        <StatCard icon={Shield} label="Guideline Updates" value={stats.guidelineUpdates} color="violet" />
        <StatCard icon={AlertTriangle} label="Drug Safety Alerts" value={stats.drugAlerts} color="rose" />
        <StatCard icon={TrendingUp} label="Research Trends" value={stats.researchTrends} color="amber" />
        <StatCard icon={Activity} label="Avg Impact Score" value={stats.avgImpact} color="teal" />
        <StatCard icon={Globe} label="India / South Asia" value={stats.indiaSpecific} color="orange" />
        <StatCard icon={FlaskConical} label="Meta-Analyses" value={stats.byEvidenceLevel.meta_analysis} color="indigo" />
      </div>

      {/* SEARCH + FILTER */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base — diabetes, SGLT2i, anemia..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            {(['all', 'applied', 'pending', 'india'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md transition-colors capitalize ${filter === f ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500'}`}
              >
                {f === 'india' ? 'India/SA' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KNOWLEDGE ENTRIES */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Knowledge Base</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{entries.length} entries — research papers, guidelines, epidemiological data</p>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto space-y-2 mke-scroll pr-1">
          {entries.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-400">No entries match your search.</div>
          )}
          {entries.map(entry => {
            const Icon = SOURCE_TYPE_ICON[entry.sourceType];
            const evColor = EVIDENCE_LEVEL_COLOR[entry.evidenceLevel];
            return (
              <div key={entry.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className={`h-7 w-7 rounded-lg bg-${evColor}-100 dark:bg-${evColor}-950/40 flex items-center justify-center shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 text-${evColor}-600`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{entry.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {entry.source} · {new Date(entry.publishedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} · {entry.region.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {entry.applied ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Applied
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{entry.summary}</p>
                <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-2 mb-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Key Finding</p>
                  <p className="text-xs text-slate-700 dark:text-slate-200">{entry.keyFinding}</p>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex flex-wrap gap-1">
                    {entry.appliesTo.map(a => (
                      <span key={a} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">→ {a.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-400">Impact:</span>
                      <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full ${entry.impactScore >= 80 ? 'bg-emerald-500' : entry.impactScore >= 60 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: `${entry.impactScore}%` }} />
                      </div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{entry.impactScore}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded bg-${evColor}-100 dark:bg-${evColor}-950/40 text-${evColor}-700 dark:text-${evColor}-300 uppercase font-medium`}>
                      {entry.evidenceLevel.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-slate-400 font-mono">{entry.citation}</p>
                {!entry.applied && (
                  <button
                    onClick={() => handlePublishUpdate(entry)}
                    className="mt-2 text-[11px] px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Broadcast to engines
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* DRUG SAFETY ALERTS */}
      <section className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Drug Safety Alerts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time safety signals from FDA, CDSCO India, EMA</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {DRUG_SAFETY_ALERTS.map(alert => {
            const sevColor = alert.severity === 'danger' ? 'rose' : alert.severity === 'warning' ? 'amber' : 'cyan';
            return (
              <div key={alert.id} className={`rounded-xl border border-${sevColor}-200 dark:border-${sevColor}-800 bg-white dark:bg-slate-900 p-3`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Pill className={`h-4 w-4 text-${sevColor}-600`} />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{alert.drug}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${sevColor}-100 dark:bg-${sevColor}-950/40 text-${sevColor}-700 dark:text-${sevColor}-300 uppercase font-medium`}>
                    {alert.alertType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Source: {alert.source}</span>
                  <span>{new Date(alert.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GUIDELINE UPDATES */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Guideline Updates</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Practice-changing updates from major medical organizations</p>
          </div>
        </div>
        <div className="space-y-3">
          {GUIDELINE_UPDATES.map(update => (
            <div key={update.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{update.guideline}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">{update.organization}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(update.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mb-2">{update.change}</p>
              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <div className="rounded-md bg-rose-50 dark:bg-rose-950/20 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-rose-500 mb-0.5">Previous</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-200">{update.previousRecommendation}</p>
                </div>
                <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/20 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-500 mb-0.5">New</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-200">{update.newRecommendation}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">Rationale: {update.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH TRENDS */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Research Trends</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Momentum in active research areas — where the field is heading</p>
          </div>
        </div>
        <div className="space-y-2">
          {RESEARCH_TRENDS.map(trend => {
            const dirColor = trend.direction === 'emerging' ? 'emerald' : trend.direction === 'established' ? 'cyan' : 'slate';
            const dirIcon = trend.direction === 'emerging' ? ArrowUpRight : trend.direction === 'established' ? CheckCircle2 : Clock;
            const DIcon = dirIcon;
            return (
              <div key={trend.topic} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{trend.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{trend.recentFindings} findings</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${dirColor}-100 dark:bg-${dirColor}-950/40 text-${dirColor}-700 dark:text-${dirColor}-300 flex items-center gap-0.5 capitalize`}>
                      <DIcon className="h-2.5 w-2.5" /> {trend.direction}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{trend.summary}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-16">Momentum</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full bg-${dirColor}-500`} style={{ width: `${trend.momentum}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 w-8 text-right">{trend.momentum}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, sub }: { icon: typeof BookOpen; label: string; value: number; color: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
      <div className={`h-8 w-8 rounded-lg bg-${color}-500/15 flex items-center justify-center mb-2`}>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
