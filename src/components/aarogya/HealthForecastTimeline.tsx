'use client';
import React, { useState } from 'react';
import { TrendingUp, Calendar, ArrowRight, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

const FORECAST = [
  { year: '1 Year', risk: 25, color: 'bg-emerald-500', riskLevel: 'Low' },
  { year: '3 Years', risk: 38, color: 'bg-amber-500', riskLevel: 'Moderate' },
  { year: '5 Years', risk: 52, color: 'bg-red-500', riskLevel: 'High' },
];

const INTERVENTIONS = [
  { name: 'Daily 30-min walk', riskReduction: 15, newRisk: [23, 33, 45] },
  { name: 'Quit smoking', riskReduction: 12, newRisk: [22, 32, 44] },
  { name: 'Mediterranean diet', riskReduction: 18, newRisk: [20, 30, 42] },
  { name: 'All three combined', riskReduction: 35, newRisk: [16, 25, 35] },
];

export const HealthForecastTimeline: React.FC = () => {
  const [selectedIntervention, setSelectedIntervention] = useState(0);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><TrendingUp className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Health Forecast Timeline <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-blue-50/90 text-sm mt-1">See your health 1, 3, and 5 years ahead — and how to change it</p>
          </div>
        </div>
      </div>

      {/* Current forecast */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> Cardiac Risk Forecast</h2>
        <div className="grid grid-cols-3 gap-3">
          {FORECAST.map((f, i) => (
            <div key={i} className="text-center p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">{f.year}</div>
              <div className={`text-3xl font-extrabold ${f.color.replace('bg-', 'text-')}`}>{f.risk}%</div>
              <div className={`text-[10px] font-bold mt-1 ${f.color.replace('bg-', 'text-')}`}>{f.riskLevel}</div>
              <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${f.color} rounded-full transition-all duration-1000`} style={{ width: `${f.risk}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intervention comparison */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">What If You Make Changes?</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {INTERVENTIONS.map((int, i) => (
            <button key={i} onClick={() => setSelectedIntervention(i)}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${selectedIntervention === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {int.name} (-{int.riskReduction}%)
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FORECAST.map((f, i) => {
            const newRisk = INTERVENTIONS[selectedIntervention].newRisk[i];
            const reduction = f.risk - newRisk;
            return (
              <div key={i} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">{f.year}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-emerald-600">{newRisk}%</span>
                  <span className="text-xs text-slate-400 line-through">{f.risk}%</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <ArrowRight className="w-2.5 h-2.5" /> -{reduction}% risk
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Forecasts are based on statistical models (ICMR-INDIAB, PURE India). They represent population trends, not individual predictions. Consult your doctor for personalized advice.</p>
      </div>
    </div>
  );
};
export default HealthForecastTimeline;
