'use client';

import React, { useState, useMemo } from 'react';
import {
  Brain, GitBranch, Target, Zap, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, Sparkles, ChevronRight, Plus, Minus,
  Clock, ShieldQuestion, Network
} from 'lucide-react';
import { analyzeRootCauses, simulateIntervention, getAbnormalNodes, getNodeById, type CausalAnalysis, type InterventionResult } from '@/lib/causalEngine';

const ABNORMAL_TARGETS = getAbnormalNodes();

export const CausalInferenceEngine: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState(ABNORMAL_TARGETS[0]?.id || 'bp_systolic');
  const [simNodeId, setSimNodeId] = useState('sleep_hours');
  const [simChange, setSimChange] = useState(2);
  const [simResult, setSimResult] = useState<InterventionResult | null>(null);

  const analysis: CausalAnalysis = useMemo(() => analyzeRootCauses(selectedTarget), [selectedTarget]);
  const simNode = getNodeById(simNodeId);

  const runSimulation = () => {
    const vals: Record<string, number> = {};
    getAbnormalNodes().forEach(n => { if (n.currentValue !== undefined) vals[n.id] = n.currentValue; });
    setSimResult(simulateIntervention(simNodeId, simChange, vals));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Network className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Health Causality<span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">CIE</span></h1>
            <p className="text-violet-50/90 text-sm mt-1">Why is this happening? — Causal Intelligence Engine</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Brain className="w-3 h-3" /> True causal reasoning</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><GitBranch className="w-3 h-3" /> Graph traversal</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> What-if simulation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Selector */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Analyze Root Cause For:</label>
        <div className="flex flex-wrap gap-2">
          {ABNORMAL_TARGETS.map(node => (
            <button key={node.id} onClick={() => setSelectedTarget(node.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedTarget === node.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
              <AlertTriangle className="w-3 h-3 text-red-500" />{node.label}<span className="text-[10px] text-slate-400">{node.currentValue}{node.unit}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel 1: Primary Insight */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-violet-950 rounded-3xl p-6 shadow-xl border border-violet-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500 opacity-15 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-violet-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-violet-400" /></div>
            <h2 className="text-sm font-bold text-violet-300 uppercase tracking-wider">Primary Insight</h2>
          </div>
          <p className="text-lg font-bold text-white leading-relaxed">{analysis.primaryInsight}</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
              <ShieldQuestion className="w-3.5 h-3.5 text-violet-400" /><span className="text-xs font-bold text-violet-300">{analysis.confidence}% confidence</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs font-bold text-amber-300">{analysis.rootCauses.length} root causes found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: Causal Chain Visualization */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><GitBranch className="w-5 h-5 text-violet-600" /> Causal Chain Visualization</h2>
        <div className="space-y-4">
          {analysis.rootCauses.slice(0, 4).map((cause, i) => (
            <div key={i} className="relative">
              <div className="flex items-stretch gap-2">
                <div className={`flex-shrink-0 p-3 rounded-2xl border-2 ${cause.modifiable ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Root Cause</div>
                  <div className="font-bold text-sm text-slate-900">{cause.nodeLabel}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{cause.contribution}% impact</div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-full">
                    {cause.causalPath.edges.map((edge, j) => {
                      const pathNode = getNodeById(cause.causalPath.nodes[j + 1]);
                      return (
                        <div key={j} className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${edge.direction === 'positive' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {edge.direction === 'positive' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                            {edge.weight > 0.7 ? 'Strong' : edge.weight > 0.5 ? 'Moderate' : 'Weak'}
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                          <div className="text-xs font-bold text-slate-700">{pathNode?.label}</div>
                          <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Clock className="w-2 h-2" />{edge.timeDelay === 'immediate' ? 'hrs' : edge.timeDelay === 'medium' ? 'days' : 'wks'}</span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-2 mt-1">
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <div className="p-2 rounded-lg bg-violet-100 border border-violet-200">
                        <div className="text-[9px] font-bold uppercase text-violet-500">Effect</div>
                        <div className="text-xs font-bold text-violet-900">{analysis.targetLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {cause.modifiable && (
                <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span className="text-[10px] font-bold text-emerald-700 uppercase">Modifiable — Fix This</span></div>
                  <p className="text-xs text-slate-700">{cause.recommendation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Contribution Analysis */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-violet-600" /> Contribution Analysis</h2>
        <div className="space-y-3">
          {analysis.rootCauses.map((cause, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{cause.nodeLabel}</span>
                  {cause.modifiable && <span className="text-[8px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">MODIFIABLE</span>}
                </div>
                <span className="text-lg font-extrabold text-violet-600">{cause.contribution}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${cause.modifiable ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-slate-400 to-slate-500'}`} style={{ width: `${cause.contribution}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-400">{cause.confidence}% confidence</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{cause.timeToEffect === 'immediate' ? 'Hours' : cause.timeToEffect === 'medium' ? 'Days' : 'Weeks'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: What-If Simulator */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> What-If Simulator<span className="text-xs font-normal text-slate-400 ml-1">do(variable = change) → predict outcomes</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Variable to change:</label>
            <select value={simNodeId} onChange={e => setSimNodeId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['sleep_hours', 'salt_intake', 'steps', 'sugar_intake', 'bmi'].map(id => { const n = getNodeById(id); return <option key={id} value={id}>{n?.label} ({n?.currentValue}{n?.unit})</option>; })}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Change: {simChange > 0 ? '+' : ''}{simChange} {simNode?.unit}</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setSimChange(simChange - 1)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200"><Minus className="w-4 h-4" /></button>
              <input type="range" min={-10} max={10} step={1} value={simChange} onChange={e => setSimChange(parseInt(e.target.value))} className="flex-1 accent-violet-600" />
              <button onClick={() => setSimChange(simChange + 1)} className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <button onClick={runSimulation} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-lg shadow-violet-600/20">
          <Zap className="w-4 h-4" /> Simulate Intervention
        </button>
        {simResult && (
          <div className="mt-4 space-y-3 animate-fadeIn">
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-xs text-slate-700">{simResult.summary}</p>
              <div className="flex items-center gap-1.5 mt-2"><ShieldQuestion className="w-3 h-3 text-violet-500" /><span className="text-[10px] font-bold text-violet-600">{simResult.confidence}% confidence</span></div>
            </div>
            <div className="space-y-2">
              {simResult.affectedVariables.slice(0, 6).map((v, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <div className={`p-1.5 rounded-lg ${v.changePercent > 0 ? 'bg-red-50 text-red-600' : v.changePercent < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {v.changePercent > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0"><div className="font-bold text-sm text-slate-900">{v.nodeLabel}</div><div className="text-xs text-slate-500">{v.oldValue} → {v.predictedValue}</div></div>
                  <div className="text-right"><div className={`text-sm font-extrabold ${v.changePercent > 0 ? 'text-red-500' : v.changePercent < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>{v.changePercent > 0 ? '+' : ''}{v.changePercent}%</div><div className="text-[8px] text-slate-400 flex items-center gap-0.5 justify-end"><Clock className="w-2 h-2" />{v.timeToEffect === 'immediate' ? 'hrs' : v.timeToEffect === 'medium' ? 'days' : 'wks'}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel 5: Confidence & Uncertainty */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><ShieldQuestion className="w-5 h-5 text-violet-600" /> Confidence & Uncertainty</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={analysis.confidence > 75 ? '#10b981' : analysis.confidence > 50 ? '#f59e0b' : '#ef4444'} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - analysis.confidence / 100)}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-extrabold text-slate-900">{analysis.confidence}%</span></div>
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">Overall Confidence</div>
            <p className="text-xs text-slate-500">{analysis.confidence > 75 ? 'High confidence — multiple strong causal paths identified' : analysis.confidence > 50 ? 'Moderate confidence — some causal evidence available' : 'Low confidence — limited data'}</p>
          </div>
        </div>
        {analysis.latentInferences.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Brain className="w-3 h-3" /> Latent State Inferences</div>
            <div className="space-y-2">
              {analysis.latentInferences.map((inf, i) => (
                <div key={i} className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="flex items-center justify-between mb-1"><span className="font-bold text-sm text-slate-900">{inf.label}</span><span className="text-xs font-extrabold text-violet-600">{inf.inferredValue.toFixed(1)}</span></div>
                  <div className="text-[10px] text-slate-500 mb-1">Evidence:</div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5">{inf.evidence.map((e, j) => <li key={j} className="flex items-start gap-1"><span className="text-violet-400 mt-0.5">•</span>{e}</li>)}</ul>
                  <div className="text-[10px] text-violet-500 font-bold mt-1">{inf.confidence}% confidence</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {analysis.alternativeHypotheses.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alternative Hypotheses</div>
            <div className="space-y-1.5">{analysis.alternativeHypotheses.map((hyp, i) => (<div key={i} className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg"><span className="text-amber-500 font-bold text-xs mt-0.5">{i + 1}.</span><span className="text-xs text-slate-700">{hyp}</span></div>))}</div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Causal analysis is based on statistical causal models and medical literature. It represents probable causes, not definitive diagnoses. Always consult a healthcare professional. Confidence scores reflect data quality and model certainty, not medical certainty.</p>
      </div>
    </div>
  );
};

export default CausalInferenceEngine;
