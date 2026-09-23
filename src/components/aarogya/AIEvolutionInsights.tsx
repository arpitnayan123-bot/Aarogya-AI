'use client';

/**
 * AIEvolutionInsights — "AI Evolution Insights" panel for ALEE.
 *
 * Shows how the system is learning, adapting, and evolving.
 *
 * Panels:
 * 1. Learning Feed — recent learning events
 * 2. Personal Memory — user-specific patterns + intervention responses
 * 3. Global Memory — cross-user insights + population patterns
 * 4. Model Evolution — accuracy growth + version changes
 * 5. Self-Correction Log — incorrect predictions + fixes
 * 6. Performance Tracking — accuracy/success/improvement metrics
 * 7. Digital Intuition — emergent pattern discoveries
 * 8. Safety & Governance — model update validation
 */

import React, { useState, useMemo } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Activity, Zap, AlertTriangle,
  CheckCircle2, Clock, Target, Sparkles, ShieldQuestion,
  GitBranch, Eye, ShieldCheck, Network, X
} from 'lucide-react';
import { analyzeEvolution, type ALEEAnalysis } from '@/lib/evolutionEngine';

export const AIEvolutionInsights: React.FC = () => {
  const analysis: ALEEAnalysis = useMemo(() => analyzeEvolution(), []);
  const [activeTab, setActiveTab] = useState<'learning' | 'memory' | 'models' | 'intuition'>('learning');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-800 via-purple-800 to-fuchsia-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-400 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><Brain className="w-7 h-7 text-fuchsia-300" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              AI Evolution Insights
              <span className="text-[9px] font-bold bg-fuchsia-400 text-fuchsia-900 px-2 py-0.5 rounded-full">ALEE</span>
            </h1>
            <p className="text-fuchsia-100/80 text-sm mt-1">Watch the system learn, adapt, and evolve — every day smarter</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3 text-emerald-400" /> +{analysis.systemStats.avgAccuracyGain}% accuracy gain</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3 text-amber-400" /> {analysis.systemStats.totalLearningEvents} learning events</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><Brain className="w-3 h-3 text-fuchsia-300" /> Intelligence: {analysis.systemStats.intelligenceLevel}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Summary */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-violet-950 rounded-3xl p-6 shadow-xl border border-violet-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500 opacity-10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-violet-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-violet-400" /></div>
            <h2 className="text-sm font-bold text-violet-300 uppercase tracking-wider">Evolution Summary</h2>
          </div>
          <p className="text-base font-bold text-white leading-relaxed">{analysis.evolutionSummary}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-lg font-extrabold text-emerald-400">+{analysis.systemStats.avgAccuracyGain}%</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">Accuracy Gain</div>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-lg font-extrabold text-amber-400">{analysis.systemStats.selfCorrectionsApplied}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">Self-Corrections</div>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-lg font-extrabold text-violet-400">{analysis.systemStats.patternsLearned}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">Patterns Learned</div>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <div className="text-lg font-extrabold text-cyan-400">{analysis.systemStats.systemAge}d</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase">System Age</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
        {[
          { id: 'learning', label: 'Learning Feed', icon: Zap },
          { id: 'memory', label: 'Memory', icon: Brain },
          { id: 'models', label: 'Model Evolution', icon: TrendingUp },
          { id: 'intuition', label: 'Digital Intuition', icon: Eye },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'learning' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Learning Feed */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Learning Feed
              <span className="text-xs font-normal text-slate-400 ml-1">Prediction → Outcome → Error → Learning → Update</span>
            </h2>
            <div className="space-y-3">
              {analysis.learningEvents.map(event => (
                <div key={event.id} className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${event.type === 'correction' ? 'bg-red-100 text-red-600' : event.type === 'intervention' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{event.type}</span>
                      <span className="font-bold text-sm text-slate-900 ml-2">{event.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(event.timestamp).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <div className="p-2 bg-white rounded-lg"><span className="text-[10px] font-bold text-slate-400">Predicted:</span> <span className="text-xs text-slate-700">{event.prediction}</span></div>
                    <div className="p-2 bg-white rounded-lg"><span className="text-[10px] font-bold text-slate-400">Outcome:</span> <span className="text-xs text-slate-700">{event.outcome}</span></div>
                  </div>
                  <div className="p-2 bg-violet-50 rounded-lg border border-violet-100 mb-2">
                    <span className="text-[10px] font-bold text-violet-600">Learned:</span> <span className="text-xs text-slate-700">{event.learned}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-400">Error: <span className={`font-bold ${event.error < 0.2 ? 'text-emerald-600' : event.error < 0.4 ? 'text-amber-600' : 'text-red-600'}`}>{Math.round(event.error * 100)}%</span></span>
                    <span className="text-slate-400">Model: <span className="font-bold text-violet-600">{event.modelUpdated}</span></span>
                    <span className="text-slate-400 ml-auto">Confidence: {event.confidenceBefore}% → <span className="font-bold text-emerald-600">{event.confidenceAfter}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Correction Log */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Self-Correction Log
              <span className="text-xs font-normal text-slate-400 ml-1">When AI was wrong and how it fixed itself</span>
            </h2>
            <div className="space-y-3">
              {analysis.selfCorrections.map(sc => (
                <div key={sc.id} className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{sc.incorrectPrediction}</span>
                    {sc.validated ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div><span className="font-bold text-red-600">What went wrong:</span> <span className="text-slate-700">{sc.whatWentWrong}</span></div>
                    <div><span className="font-bold text-amber-600">Root cause:</span> <span className="text-slate-700">{sc.rootCause}</span></div>
                    <div><span className="font-bold text-emerald-600">Correction:</span> <span className="text-slate-700">{sc.correctionApplied}</span></div>
                    <div><span className="font-bold text-violet-600">Pathway adjusted:</span> <span className="text-slate-700">{sc.reasoningPathwayAdjusted}</span></div>
                    <div><span className="font-bold text-blue-600">Expected improvement:</span> <span className="text-slate-700">{sc.expectedImprovement}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'memory' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Personal Memory */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" /> Personal Memory
              <span className="text-xs font-normal text-slate-400 ml-1">User-specific patterns + intervention responses</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="p-2 bg-slate-50 rounded-xl text-center"><div className="text-lg font-extrabold text-violet-600">{analysis.personalMemory.totalDataPoints}</div><div className="text-[9px] text-slate-400 uppercase">Data Points</div></div>
              <div className="p-2 bg-slate-50 rounded-xl text-center"><div className="text-lg font-extrabold text-violet-600">{analysis.personalMemory.patterns.length}</div><div className="text-[9px] text-slate-400 uppercase">Patterns</div></div>
              <div className="p-2 bg-slate-50 rounded-xl text-center"><div className="text-lg font-extrabold text-violet-600">{analysis.personalMemory.behavioralProfile.adherenceScore}%</div><div className="text-[9px] text-slate-400 uppercase">Adherence</div></div>
              <div className="p-2 bg-slate-50 rounded-xl text-center"><div className="text-lg font-extrabold text-violet-600">v{analysis.personalMemory.modelVersion}</div><div className="text-[9px] text-slate-400 uppercase">Model Version</div></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Learned Patterns</div>
              {analysis.personalMemory.patterns.map(p => (
                <div key={p.id} className="p-2 bg-slate-50 rounded-xl flex items-center gap-2">
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${p.category === 'trigger' ? 'bg-red-100 text-red-600' : p.category === 'behavior' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>{p.category}</span>
                  <span className="text-xs text-slate-700 flex-1">{p.pattern}</span>
                  <span className="text-[10px] text-slate-400">{p.frequency}x · {p.confidence}%</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Intervention Responses</div>
              {analysis.personalMemory.interventionResponses.map((ir, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{ir.intervention}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{ir.successful}/{ir.attempted} success ({Math.round(ir.successful / ir.attempted * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>Avg improvement: {ir.avgImprovement}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{ir.learningNote}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Global Memory */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-600" /> Global Memory
              <span className="text-xs font-normal text-slate-400 ml-1">Cross-user insights ({analysis.globalMemory.totalUsers} users)</span>
            </h2>
            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Population Patterns</div>
              {analysis.globalMemory.patterns.map(p => (
                <div key={p.id} className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{p.pattern}</span>
                    <span className="text-[10px] font-bold text-cyan-600">{p.populationFreq}% of users</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{p.clinicalSignificance}</p>
                  <span className="text-[9px] text-slate-400">Discovered: {new Date(p.discoveredAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {p.confidence}% confidence</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Cross-User Insights</div>
              {analysis.globalMemory.crossUserInsights.map((ins, i) => (
                <div key={i} className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <p className="text-xs text-slate-700 mb-1">{ins.insight}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{ins.evidenceCount} evidence cases</span>
                    <span>·</span>
                    <span className="font-bold text-violet-600">{ins.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Model Evolution */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Model Evolution
              <span className="text-xs font-normal text-slate-400 ml-1">Accuracy growth over time</span>
            </h2>
            <div className="space-y-3">
              {analysis.modelEvolutions.map(model => (
                <div key={model.modelId} className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{model.modelName}</span>
                      <span className="text-[10px] font-bold text-violet-600 ml-2">{model.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">was {model.previousAccuracy}%</span>
                      <span className="text-[9px] text-slate-300">→</span>
                      <span className="text-sm font-extrabold text-emerald-600">{model.currentAccuracy}%</span>
                      <span className="text-[10px] font-bold text-emerald-500">+{model.improvement}%</span>
                    </div>
                  </div>
                  {/* Mini chart */}
                  <div className="flex items-end gap-2 h-12 mb-2">
                    {model.accuracyHistory.map((h, i) => {
                      const max = Math.max(...model.accuracyHistory.map(x => x.accuracy));
                      const min = Math.min(...model.accuracyHistory.map(x => x.accuracy)) - 5;
                      const range = max - min || 1;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="w-full rounded-t bg-gradient-to-t from-violet-500 to-fuchsia-400" style={{ height: `${((h.accuracy - min) / range) * 100}%`, minHeight: '4px' }} />
                          <div className="text-[8px] text-slate-400 mt-1">{h.date}</div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Recent changes */}
                  <div className="space-y-1">
                    {model.changes.slice(0, 2).map((c, i) => (
                      <div key={i} className="flex items-start gap-1 text-[11px]">
                        <span className="text-violet-400 mt-0.5">•</span>
                        <div><span className="text-slate-700">{c.description}</span> <span className="text-slate-400">→ {c.impact}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600" /> Performance Tracking
            </h2>
            <div className="space-y-3">
              {analysis.performanceMetrics.map((m, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">{m.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{m.previousValue}{m.unit}</span>
                      <span className="text-[9px] text-slate-300">→</span>
                      <span className={`text-sm font-extrabold ${m.trend === 'improving' ? 'text-emerald-600' : 'text-red-600'}`}>{m.currentValue}{m.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-4 mb-1">
                    {m.history.map((v, j) => {
                      const max = Math.max(...m.history);
                      const min = Math.min(...m.history) - 2;
                      const range = max - min || 1;
                      return <div key={j} className="flex-1 rounded-sm" style={{ height: `${((v - min) / range) * 100}%`, background: m.trend === 'improving' ? '#10b981' : '#ef4444', opacity: j === m.history.length - 1 ? 1 : 0.4, minHeight: '2px' }} />;
                    })}
                  </div>
                  <div className="text-[9px] text-slate-400">Target: {m.target}{m.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Governance */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Safety & Governance
              <span className="text-xs font-normal text-slate-400 ml-1">Every model update is validated</span>
            </h2>
            <div className="space-y-2">
              {analysis.safetyChecks.map(sc => (
                <div key={sc.id} className={`p-3 rounded-xl border ${sc.decision === 'approved' ? 'border-emerald-100 bg-emerald-50/50' : sc.decision === 'rejected' ? 'border-red-100 bg-red-50/50' : 'border-amber-100 bg-amber-50/50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{sc.proposedChange}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${sc.decision === 'approved' ? 'bg-emerald-100 text-emerald-600' : sc.decision === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{sc.decision}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-slate-500">
                    <span>Clinical: {sc.clinicalAlignment ? '✓' : '✗'}</span>
                    <span>Bias: {sc.biasCheck}</span>
                    <span>Drift: {sc.driftCheck}</span>
                    <span>Risk: {sc.riskAssessment}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{sc.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'intuition' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Digital Intuition */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-fuchsia-600" /> Digital Intuition
              <span className="text-xs font-normal text-slate-400 ml-1">Emergent patterns discovered by the system</span>
            </h2>
            <div className="space-y-3">
              {analysis.digitalIntuitions.map(di => (
                <div key={di.id} className="p-4 bg-gradient-to-br from-fuchsia-50 to-violet-50 rounded-2xl border border-fuchsia-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{di.pattern}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${di.novelty === 'novel' ? 'bg-fuchsia-100 text-fuchsia-600' : di.novelty === 'emerging' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{di.novelty}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{di.description}</p>
                  <div className="p-2 bg-white/60 rounded-lg mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Detected from:</span>
                    <p className="text-[11px] text-slate-600">{di.detectedFrom}</p>
                  </div>
                  <div className="p-2 bg-white/60 rounded-lg mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Clinical relevance:</span>
                    <p className="text-[11px] text-slate-600">{di.clinicalRelevance}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {di.actionable && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">ACTIONABLE</span>}
                    <span className="text-[9px] font-bold text-fuchsia-600 ml-auto">{di.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          The Autonomous Learning & Evolution Engine continuously improves prediction accuracy, personalizes recommendations,
          and discovers new health patterns. All model updates are validated for clinical safety, bias, and drift before deployment.
          The system never degrades performance and always maintains explainability after updates.
          Learning is based on your personal data + anonymized cross-user insights (700+ users).
        </p>
      </div>
    </div>
  );
};

export default AIEvolutionInsights;
