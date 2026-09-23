'use client';

import React, { useState, useMemo } from 'react';
import { Zap, Target, TrendingUp, AlertTriangle, CheckCircle2, Clock, Activity, Brain, ChevronRight, Sparkles, ShieldQuestion, Calendar, ArrowRight, Stethoscope } from 'lucide-react';
import { analyzeDecisions, generateWeeklyPlan, type HealthAction, type DecisionAnalysis, type DayPlan } from '@/lib/decisionEngine';

const TYPE_CFG = { lifestyle: { label: 'Lifestyle', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }, behavioral: { label: 'Behavioral', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }, clinical: { label: 'Clinical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' } };
const TIME_CFG = { immediate: { label: 'Hours', icon: '⚡' }, short: { label: 'Days', icon: '📅' }, medium: { label: 'Weeks', icon: '🗓️' }, long: { label: 'Months', icon: '📈' } };

export const DecisionIntelligenceEngine: React.FC = () => {
  const analysis: DecisionAnalysis = useMemo(() => analyzeDecisions(), []);
  const [selAction, setSelAction] = useState<HealthAction | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const weeklyPlan: DayPlan[] = useMemo(() => generateWeeklyPlan(analysis.rankedActions.length > 0 ? [analysis.primaryAction, ...analysis.rankedActions] : [analysis.primaryAction]), [analysis]);
  const allActions = [analysis.primaryAction, ...analysis.rankedActions];
  const active = selAction || analysis.primaryAction;
  const cfg = TYPE_CFG[active.type];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Zap className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Smart Actions<span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">DIE</span></h1>
            <p className="text-emerald-50/90 text-sm mt-1">What is the best action for you right now? — AI Health Strategist</p>
            <div className="flex items-center gap-3 mt-2 text-xs"><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Brain className="w-3 h-3" /> Causal validated</span><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Activity className="w-3 h-3" /> Twin simulated</span><span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldQuestion className="w-3 h-3" /> {analysis.overallConfidence}% confidence</span></div>
          </div>
        </div>
      </div>

      {/* Panel 1: Primary Decision */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 opacity-15 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3"><div className="p-2 bg-emerald-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-400" /></div><h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Best Action Right Now</h2></div>
          <h3 className="text-xl font-black text-white mb-2">{analysis.primaryAction.title}</h3>
          <p className="text-sm text-slate-300 mb-4">{analysis.primaryAction.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><div className="text-[9px] font-bold text-slate-400 uppercase">Utility</div><div className="text-lg font-extrabold text-emerald-400">{analysis.primaryAction.utility}<span className="text-xs text-slate-500">/100</span></div></div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><div className="text-[9px] font-bold text-slate-400 uppercase">Benefit</div><div className="text-lg font-extrabold text-cyan-400">{analysis.primaryAction.expectedBenefit}%</div></div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><div className="text-[9px] font-bold text-slate-400 uppercase">Effort</div><div className="text-lg font-extrabold text-amber-400">{analysis.primaryAction.effort}%</div></div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10"><div className="text-[9px] font-bold text-slate-400 uppercase">Time</div><div className="text-lg font-extrabold text-violet-400">{TIME_CFG[analysis.primaryAction.timeToEffect].label}</div></div>
          </div>
          {analysis.primaryAction.dailyPlan && (<div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><div className="flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span className="text-[10px] font-bold text-emerald-400 uppercase">Daily Plan</span></div><p className="text-xs text-slate-300">{analysis.primaryAction.dailyPlan}</p></div>)}
        </div>
      </div>

      {/* Panel 2: Ranked Actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-600" /> Ranked Actions<span className="text-xs font-normal text-slate-400 ml-1">Sorted by utility</span></h2>
        <div className="space-y-2">
          {allActions.map((action, i) => {
            const c = TYPE_CFG[action.type]; const isSel = (selAction?.id || analysis.primaryAction.id) === action.id;
            return (<button key={action.id} onClick={() => setSelAction(action)} className={`w-full p-3 rounded-2xl border-2 text-left transition-all ${isSel ? `${c.border} ${c.bg}` : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
              <div className="flex items-start gap-3"><div className={`flex-shrink-0 w-7 h-7 rounded-lg ${c.bg} ${c.color} flex items-center justify-center text-xs font-extrabold`}>{i + 1}</div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><span className="font-bold text-sm text-slate-900">{action.title}</span><span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${c.bg} ${c.color}`}>{c.label}</span>{action.requiresDoctor && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600">DOCTOR</span>}</div>
                  <p className="text-xs text-slate-500 line-clamp-1">{action.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px]"><span className="font-bold text-emerald-600">Utility: {action.utility}</span><span className="text-slate-400">Benefit: {action.expectedBenefit}%</span><span className="text-slate-400">Effort: {action.effort}%</span><span className="text-slate-400">{TIME_CFG[action.timeToEffect].icon} {TIME_CFG[action.timeToEffect].label}</span></div>
                </div><ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isSel ? 'rotate-90' : ''}`} /></div>
            </button>);
          })}
        </div>
      </div>

      {/* Panel 3: Decision Score */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-600" /> Decision Score<span className="text-xs font-normal text-slate-400 ml-1">Impact vs Effort</span></h2>
        <div className="space-y-3">
          {allActions.map(action => (<div key={action.id} className="p-3 bg-slate-50 rounded-2xl"><div className="flex items-center justify-between mb-2"><span className="font-bold text-xs text-slate-900">{action.title}</span><span className="text-xs font-extrabold text-violet-600">{action.utility}/100</span></div>
            <div className="grid grid-cols-3 gap-2"><div><div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Benefit</div><div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${action.expectedBenefit}%` }} /></div><div className="text-[9px] text-emerald-600 font-bold mt-0.5">{action.expectedBenefit}%</div></div>
            <div><div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Effort</div><div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${action.effort}%` }} /></div><div className="text-[9px] text-amber-600 font-bold mt-0.5">{action.effort}%</div></div>
            <div><div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Risk</div><div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${action.risk}%` }} /></div><div className="text-[9px] text-red-600 font-bold mt-0.5">{action.risk}%</div></div></div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400"><span>Sustainability: {action.sustainability}%</span><span>Confidence: {action.confidence}%</span></div></div>))}
        </div>
      </div>

      {/* Panel 4: Outcome Simulation */}
      {active.projectedOutcome && (<div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"><h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-600" /> Outcome Simulation<span className="text-xs font-normal text-slate-400 ml-1">For: {active.title}</span></h2>
        <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100"><div className="text-center mb-3"><div className="text-xs font-bold text-cyan-600 uppercase">Projected Impact on {active.projectedOutcome.variableLabel}</div></div>
          <div className="grid grid-cols-4 gap-2"><div className="p-2 bg-white rounded-lg text-center"><div className="text-[8px] font-bold text-slate-400 uppercase">Now</div><div className="text-base font-extrabold text-slate-700">{active.projectedOutcome.currentValue}</div></div>
          <div className="p-2 bg-emerald-50 rounded-lg text-center border border-emerald-100"><div className="text-[8px] font-bold text-emerald-500 uppercase">3 mo</div><div className="text-base font-extrabold text-emerald-700">{active.projectedOutcome.projected3Month}</div></div>
          <div className="p-2 bg-emerald-50 rounded-lg text-center border border-emerald-100"><div className="text-[8px] font-bold text-emerald-500 uppercase">6 mo</div><div className="text-base font-extrabold text-emerald-700">{active.projectedOutcome.projected6Month}</div></div>
          <div className="p-2 bg-emerald-50 rounded-lg text-center border border-emerald-100"><div className="text-[8px] font-bold text-emerald-500 uppercase">12 mo</div><div className="text-base font-extrabold text-emerald-700">{active.projectedOutcome.projected12Month}</div></div></div>
          <div className="mt-3 p-2 bg-white rounded-lg flex items-center justify-center gap-2"><span className="text-xs font-bold text-slate-500">Risk Reduction:</span><span className="text-lg font-extrabold text-emerald-600">{active.projectedOutcome.improvementPercent}%</span></div></div></div>)}

      {/* Panel 5: Trade-off Analysis */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"><h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Trade-off Analysis<span className="text-xs font-normal text-slate-400 ml-1">For: {active.title}</span></h2>
        {active.tradeoffs.length > 0 ? (<div className="space-y-2">{active.tradeoffs.map((t, i) => (<div key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${t.severity === 'significant' ? 'border-red-200 bg-red-50' : t.severity === 'moderate' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}><span className={`text-sm font-bold ${t.severity === 'significant' ? 'text-red-500' : t.severity === 'moderate' ? 'text-amber-500' : 'text-slate-400'}`}>{t.severity === 'significant' ? '⚠️' : t.severity === 'moderate' ? '⚡' : '•'}</span><div><span className={`text-[8px] font-bold uppercase ${t.severity === 'significant' ? 'text-red-600' : t.severity === 'moderate' ? 'text-amber-600' : 'text-slate-400'}`}>{t.severity}</span><p className="text-xs text-slate-700">{t.description}</p></div></div>))}</div>) : (<div className="text-center py-4"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" /><p className="text-sm text-slate-500">No significant trade-offs</p></div>)}</div>

      {/* Panel 6: Adaptive Plan */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"><div className="flex items-center justify-between mb-4"><h2 className="font-extrabold text-slate-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-violet-600" /> Adaptive Plan Generator</h2><button onClick={() => setShowPlan(!showPlan)} className="text-xs font-bold text-violet-600 hover:text-violet-700">{showPlan ? 'Hide' : 'Show'} 7-Day Plan</button></div>
        {showPlan ? (<div className="space-y-2 max-h-80 overflow-y-auto scrollbar-slim">{weeklyPlan.map((day, i) => (<div key={i} className="p-3 bg-slate-50 rounded-2xl"><div className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-2"><span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-[10px]">{i + 1}</span>{day.day}</div><div className="space-y-1.5 ml-8">{day.actions.map((act, j) => (<div key={j} className="flex items-start gap-2"><span className="text-[10px] font-bold text-slate-400 w-12 flex-shrink-0">{act.time}</span><div><span className="text-xs font-bold text-slate-700">{act.action}</span><p className="text-[10px] text-slate-500">{act.description}</p></div></div>))}</div></div>))}</div>) : (<div className="text-center py-4"><Calendar className="w-8 h-8 mx-auto mb-2 text-violet-300" /><p className="text-sm text-slate-500">Click to generate your personalized schedule</p></div>)}</div>

      {/* Panel 7: Safety */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm"><h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-red-500" /> Safety Panel</h2>
        {analysis.safetyAlerts.length > 0 ? (<div className="space-y-2">{analysis.safetyAlerts.map((alert, i) => (<div key={i} className={`p-3 rounded-xl border ${alert.level === 'high' ? 'border-red-300 bg-red-50' : alert.level === 'moderate' ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}><div className="flex items-start gap-2"><Stethoscope className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.level === 'high' ? 'text-red-600' : alert.level === 'moderate' ? 'text-amber-600' : 'text-emerald-600'}`} /><div><span className={`text-[8px] font-bold uppercase ${alert.level === 'high' ? 'text-red-600' : alert.level === 'moderate' ? 'text-amber-600' : 'text-emerald-600'}`}>{alert.level} priority</span><p className="text-xs text-slate-700 mt-0.5">{alert.message}</p></div></div></div>))}</div>) : (<div className="text-center py-4"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" /><p className="text-sm text-slate-500">No safety alerts. All actions are safe.</p></div>)}</div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">Decision recommendations are AI-generated based on your personal health data, causal analysis, and digital twin simulations. They represent optimized suggestions, not medical prescriptions. Always consult a healthcare professional.</p></div>
    </div>
  );
};

export default DecisionIntelligenceEngine;
