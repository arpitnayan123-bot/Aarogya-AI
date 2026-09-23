'use client';

import React, { useState, useMemo } from 'react';
import { Clock, TrendingUp, TrendingDown, Activity, Brain, Zap, AlertTriangle, Target, GitBranch, Sparkles, ShieldQuestion, CheckCircle2, ArrowRight } from 'lucide-react';
import { computeBaselines, predictTrajectories, detectEvents, runTwinSimulation, getVariableHistories, getInterventionTypes } from '@/lib/temporalEngine';

export const DigitalTwinLab: React.FC = () => {
  const [selVar, setSelVar] = useState('bp_systolic');
  const [selInt, setSelInt] = useState('exercise');
  const [simResult, setSimResult] = useState<ReturnType<typeof runTwinSimulation> | null>(null);

  const histories = useMemo(() => getVariableHistories(), []);
  const baselines = useMemo(() => computeBaselines(), []);
  const trajectories = useMemo(() => predictTrajectories(), []);
  const events = useMemo(() => detectEvents(), []);
  const interventions = useMemo(() => getInterventionTypes(), []);

  const selHistory = histories.find(h => h.variableId === selVar);
  const sparkData = selHistory?.data.slice(-30).map(d => d.value) || [];
  const sparkMax = Math.max(...sparkData); const sparkMin = Math.min(...sparkData); const sparkRange = sparkMax - sparkMin || 1;

  const runSim = () => setSimResult(runTwinSimulation(selInt as any));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Brain className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Digital Twin Lab<span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-cyan-50/90 text-sm mt-1">Your living digital representation — evolving, predicting, simulating</p>
            <div className="flex items-center gap-3 mt-2 text-xs"><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> 90-day history</span><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> Trajectory model</span><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> Intervention sim</span></div>
          </div>
        </div>
      </div>

      {/* Panel 1: Multi-Variable Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-600" /> Multi-Variable Timeline</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {histories.map(h => (<button key={h.variableId} onClick={() => setSelVar(h.variableId)} className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-all ${selVar === h.variableId ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>{h.label}</button>))}
        </div>
        {selHistory && (
          <div>
            <div className="flex items-center justify-between mb-2"><div><span className="text-sm font-bold text-slate-900">{selHistory.label}</span><span className="text-xs text-slate-400 ml-2">Last 30 days</span></div><div className="text-right"><span className="text-lg font-extrabold text-cyan-600">{selHistory.data[selHistory.data.length - 1].value}</span><span className="text-xs text-slate-400 ml-1">{selHistory.unit}</span></div></div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-end gap-1 h-32">
                {sparkData.map((v, i) => { const h = ((v - sparkMin) / sparkRange) * 100; const [lo, hi] = selHistory.normalRange; const isN = v >= lo && v <= hi; return (<div key={i} className="flex-1 flex flex-col items-center"><div className={`w-full rounded-t transition-all ${isN ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ height: `${h}%`, minHeight: '4px', opacity: i === sparkData.length - 1 ? 1 : 0.5 }} /></div>); })}
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400"><span>30 days ago</span><span className="flex items-center gap-2"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Abnormal</span></span><span>Today</span></div>
            </div>
            <div className="mt-2 text-xs text-slate-500">Normal range: {selHistory.normalRange[0]}–{selHistory.normalRange[1]} {selHistory.unit}</div>
          </div>
        )}
      </div>

      {/* Panel 2: Personal Baseline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-violet-600" /> Personal Baseline<span className="text-xs font-normal text-slate-400 ml-1">Your normal vs population normal</span></h2>
        <div className="space-y-3">
          {baselines.map(b => (
            <div key={b.variableId} className="p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2"><span className="font-bold text-sm text-slate-900">{b.label}</span><div className="flex items-center gap-1"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.trend === 'increasing' ? 'bg-red-50 text-red-600' : b.trend === 'decreasing' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{b.trend === 'increasing' ? '↑' : b.trend === 'decreasing' ? '↓' : '→'} {b.trend}</span><span className="text-[10px] font-bold text-slate-400">{b.confidence}%</span></div></div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg"><div className="text-[9px] font-bold text-slate-400 uppercase">Your Baseline</div><div className="font-bold text-slate-700">{b.mean} ± {b.stdDev}</div><div className="text-[10px] text-slate-400">Range: {b.personalNormalRange[0]}–{b.personalNormalRange[1]}</div></div>
                <div className="p-2 bg-white rounded-lg"><div className="text-[9px] font-bold text-slate-400 uppercase">Population Normal</div><div className="font-bold text-slate-700">{b.populationNormalRange[0]}–{b.populationNormalRange[1]}</div><div className="text-[10px] text-slate-400">{b.mean < b.populationNormalRange[0] ? 'Below normal' : b.mean > b.populationNormalRange[1] ? 'Above normal' : 'Within normal'}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Future Trajectory */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Future Trajectory<span className="text-xs font-normal text-slate-400 ml-1">3 / 6 / 12 month predictions</span></h2>
        <div className="space-y-3">
          {trajectories.map(t => (
            <div key={t.variableId} className="p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="font-bold text-sm text-slate-900">{t.label}</span><span className="text-xs text-slate-400">Now: {t.currentValue}</span></div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.trendDirection === 'improving' ? 'bg-emerald-50 text-emerald-600' : t.trendDirection === 'worsening' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{t.trendDirection}</span></div>
              <div className="grid grid-cols-3 gap-2">
                {t.predictions.map(p => (<div key={p.timeframe} className={`p-2 rounded-lg border ${p.riskLevel === 'high' ? 'border-red-200 bg-red-50' : p.riskLevel === 'moderate' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}><div className="text-[9px] font-bold text-slate-400 uppercase">{p.timeframe}</div><div className={`text-base font-extrabold ${p.riskLevel === 'high' ? 'text-red-600' : p.riskLevel === 'moderate' ? 'text-amber-600' : 'text-emerald-600'}`}>{p.predictedValue}</div><div className="text-[9px] text-slate-400">{p.changePercent > 0 ? '+' : ''}{p.changePercent}%</div><div className="text-[8px] text-slate-400">CI: {p.confidenceLower}–{p.confidenceUpper}</div></div>))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: Event Detection */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Event Detection<span className="text-xs font-normal text-slate-400 ml-1">Anomalies, shifts, phase transitions</span></h2>
        {events.length > 0 ? (<div className="space-y-2">{events.slice(0, 6).map(ev => (<div key={ev.id} className={`p-3 rounded-xl border ${ev.severity === 'critical' ? 'border-red-200 bg-red-50' : ev.severity === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${ev.type === 'sudden_change' ? 'bg-orange-100 text-orange-600' : 'bg-violet-100 text-violet-600'}`}>{ev.type.replace(/_/g, ' ')}</span><span className="font-bold text-sm text-slate-900">{ev.variableLabel}</span></div><span className="text-[10px] text-slate-400">{new Date(ev.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span></div><p className="text-xs text-slate-600">{ev.description}</p><div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400"><span>{ev.valueBefore} → {ev.valueAfter}</span><span className={`font-bold ${ev.changePercent > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{ev.changePercent > 0 ? '+' : ''}{ev.changePercent}%</span></div></div>))}</div>) : (<div className="text-center py-6"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" /><p className="text-sm text-slate-500">No anomalies detected</p></div>)}
      </div>

      {/* Panel 5: Digital Twin Lab */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Digital Twin Lab<span className="text-xs font-normal text-slate-400 ml-1">Simulate interventions → project future</span></h2>
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-500 mb-2 block">Choose intervention:</label>
          <div className="grid grid-cols-2 gap-2">{interventions.map(int => (<button key={int.id} onClick={() => setSelInt(int.id)} className={`p-3 rounded-xl text-xs font-bold border-2 transition-all ${selInt === int.id ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>{int.label}</button>))}</div>
        </div>
        <button onClick={runSim} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-lg shadow-amber-500/20"><Zap className="w-4 h-4" /> Run Twin Simulation</button>
        {simResult && (<div className="mt-4 space-y-3 animate-fadeIn"><div className="p-3 bg-amber-50 rounded-xl border border-amber-100"><p className="text-xs text-slate-700">{simResult.summary}</p><div className="flex items-center gap-1.5 mt-2"><ShieldQuestion className="w-3 h-3 text-amber-500" /><span className="text-[10px] font-bold text-amber-600">{simResult.confidence}% confidence</span></div></div><div className="space-y-2">{simResult.projectedOutcomes.filter(o => o.riskReduction > 0).map((o, i) => (<div key={i} className="p-3 bg-slate-50 rounded-xl"><div className="flex items-center justify-between mb-2"><span className="font-bold text-sm text-slate-900">{o.variableLabel}</span><span className="text-sm font-extrabold text-emerald-600">-{o.riskReduction}% risk</span></div><div className="grid grid-cols-4 gap-2 text-center"><div className="p-1.5 bg-white rounded-lg"><div className="text-[8px] font-bold text-slate-400 uppercase">Now</div><div className="text-sm font-bold text-slate-700">{o.currentValue}</div></div><div className="p-1.5 bg-emerald-50 rounded-lg"><div className="text-[8px] font-bold text-emerald-500 uppercase">3 mo</div><div className="text-sm font-bold text-emerald-700">{o.projectedValue3Month}</div></div><div className="p-1.5 bg-emerald-50 rounded-lg"><div className="text-[8px] font-bold text-emerald-500 uppercase">6 mo</div><div className="text-sm font-bold text-emerald-700">{o.projectedValue6Month}</div></div><div className="p-1.5 bg-emerald-50 rounded-lg"><div className="text-[8px] font-bold text-emerald-500 uppercase">12 mo</div><div className="text-sm font-bold text-emerald-700">{o.projectedValue12Month}</div></div></div></div>))}</div></div>)}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">Digital twin simulations are based on your personal 90-day health data trends and causal models. Projections represent probable outcomes, not guarantees. Always consult your doctor before making health changes.</p></div>
    </div>
  );
};

export default DigitalTwinLab;
