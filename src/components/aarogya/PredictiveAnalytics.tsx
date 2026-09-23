'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Heart, Droplets, Brain,
  Sparkles, AlertCircle, Shield, Calendar, Zap, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import {
  generateHistoricalData, predictHealthRisks, generateTimeline,
  generatePreventionPlans, compareTwoFutures,
  type BiomarkerTrend, type RiskPrediction, type TimelineProjection, type PreventionPlan
} from '@/data/predictiveModels';

export const PredictiveAnalytics: React.FC = () => {
  const [vitals, setVitals] = useState({
    bloodPressure: 125,
    cholesterol: 195,
    bloodSugar: 105,
    bmi: 24.5,
    heartRate: 72,
    hemoglobin: 13.5,
  });
  const [activeMonth, setActiveMonth] = useState<'6' | '12' | '24'>('12');

  const trends = useMemo<BiomarkerTrend[]>(() => generateHistoricalData(vitals), [vitals]);
  const predictions = useMemo<RiskPrediction[]>(() => predictHealthRisks(trends), [trends]);
  const timeline = useMemo<TimelineProjection[]>(() => generateTimeline(trends), [trends]);
  const preventionPlans = useMemo<PreventionPlan[]>(() => generatePreventionPlans(predictions), [predictions]);
  const twoFutures = useMemo(() => compareTwoFutures(predictions), [predictions]);

  const overallRisk = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length)
    : 0;

  const chartData = trends.map(t => ({
    name: t.biomarker,
    current: t.currentValue,
    projected6: t.projectedValue6m,
    projected12: t.projectedValue12m,
    projected24: t.projectedValue24m,
  }));

  const activeTimelineData = timeline.find(t => t.month === parseInt(activeMonth)) || timeline[1];

  const iconForBiomarker = (name: string) => {
    if (name.toLowerCase().includes('blood pressure') || name.toLowerCase().includes('heart')) return Heart;
    if (name.toLowerCase().includes('sugar') || name.toLowerCase().includes('glucose')) return Droplets;
    if (name.toLowerCase().includes('cholesterol')) return Activity;
    if (name.toLowerCase().includes('bmi')) return Zap;
    return Brain;
  };

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-red-600 bg-red-50';
    if (level === 'moderate') return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Predictive Health Analytics</h1>
            <p className="text-cyan-50/90 text-sm mt-1">AI health trajectory · 6/12/24 month projections</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> ICMR-INDIAB</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" /> NFHS-5 Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Input */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">Current Health Vitals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(vitals).map(([key, value]) => (
            <div key={key}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type="number"
                value={value}
                onChange={e => setVitals({ ...vitals, [key]: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overall Risk Gauge + Two Futures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm lg:col-span-1">
          <h3 className="font-extrabold text-slate-900 mb-2 text-sm">Projected Risk Score</h3>
          <div className="relative h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: 'risk', value: overallRisk, fill: overallRisk > 60 ? '#ef4444' : overallRisk > 40 ? '#f59e0b' : '#10b981' }]} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-extrabold ${overallRisk > 60 ? 'text-red-600' : overallRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>{overallRisk}</div>
              <div className="text-xs text-slate-400 font-bold">/ 100</div>
            </div>
          </div>
          <div className={`text-center text-sm font-bold ${overallRisk > 60 ? 'text-red-600' : overallRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {overallRisk > 60 ? 'High Risk' : overallRisk > 40 ? 'Moderate Risk' : 'Low Risk'}
          </div>
        </div>

        {/* Two Futures Comparison */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm lg:col-span-2">
          <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-500" /> Two Futures: With vs Without Intervention</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-rose-700 uppercase">Without Action</span>
              </div>
              <div className="text-3xl font-extrabold text-rose-600">{twoFutures.withoutAction.riskScore24m}<span className="text-sm">%</span></div>
              <div className="text-[10px] text-rose-400 mt-1">risk in 24 months</div>
              {twoFutures.withoutAction.developedConditions.slice(0, 3).map((c, i) => (
                <div key={i} className="text-[10px] text-rose-500 mt-1">• {c}</div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 uppercase">With Intervention</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600">{twoFutures.withAction.riskScore24m}<span className="text-sm">%</span></div>
              <div className="text-[10px] text-emerald-400 mt-1">risk in 24 months</div>
              {twoFutures.withAction.preventedConditions.slice(0, 3).map((c, i) => (
                <div key={i} className="text-[10px] text-emerald-500 mt-1">• {c}</div>
              ))}
            </div>
          </div>
          <div className="mt-3 p-3 bg-cyan-50 rounded-xl text-center">
            <span className="text-sm font-bold text-cyan-700">Risk reduction: <span className="text-emerald-600">{twoFutures.withoutAction.riskScore24m - twoFutures.withAction.riskScore24m}%</span> with timely intervention</span>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-600" /> Biomarker Trends & Projections</h2>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="current" stroke="#06b6d4" strokeWidth={2} fill="url(#currentGrad)" name="Current" />
            <Area type="monotone" dataKey="projected24" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="url(#projectedGrad)" name="24mo Projected" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Projection */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-600" /> Health Timeline Projection</h2>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['6', '12', '24'].map(m => (
              <button
                key={m}
                onClick={() => setActiveMonth(m as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${activeMonth === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                {m}mo
              </button>
            ))}
          </div>
        </div>
        {activeTimelineData && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl ${activeTimelineData.status === 'critical' ? 'bg-red-50' : activeTimelineData.status === 'warning' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{activeTimelineData.label}</div>
                  <div className={`text-2xl font-extrabold capitalize ${activeTimelineData.status === 'critical' ? 'text-red-600' : activeTimelineData.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {activeTimelineData.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk Score</div>
                  <div className={`text-2xl font-extrabold ${activeTimelineData.status === 'critical' ? 'text-red-600' : activeTimelineData.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {activeTimelineData.riskScore}/100
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(activeTimelineData.biomarkers).map(([key, value]) => {
                const Icon = iconForBiomarker(key);
                return (
                  <div key={key} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-500 uppercase truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-sm font-extrabold text-slate-800">{value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Risk Predictions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500" /> Condition Risk Predictions</h2>
        <div className="space-y-3">
          {predictions.map((pred, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-bold text-slate-800">{pred.condition}</span>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskColor(pred.currentRisk)}`}>Now: {pred.currentRisk}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskColor(pred.futureRisk24m)}`}>24mo: {pred.futureRisk24m}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pred.probability > 60 ? 'bg-red-500' : pred.probability > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pred.probability}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-600">{pred.probability}%</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{pred.reasoning}</p>
              {pred.indicators.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {pred.indicators.map((ind, j) => (
                    <span key={j} className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{ind}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Plans */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Personalized Prevention Plans</h2>
        <div className="space-y-3">
          {preventionPlans.map((plan, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800">{plan.condition}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.impact === 'high' ? 'bg-emerald-200 text-emerald-800' : plan.impact === 'moderate' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                  {plan.impact} impact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">🍎 Diet</div>
                  {plan.diet.slice(0, 2).map((d, j) => <div key={j} className="text-xs text-slate-600">• {d}</div>)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">🏃 Exercise</div>
                  {plan.exercise.slice(0, 2).map((e, j) => <div key={j} className="text-xs text-slate-600">• {e}</div>)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">📊 Monitoring</div>
                  {plan.monitoring.slice(0, 2).map((m, j) => <div key={j} className="text-xs text-slate-600">• {m}</div>)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1">💚 Lifestyle</div>
                  {plan.lifestyle.slice(0, 2).map((l, j) => <div key={j} className="text-xs text-slate-600">• {l}</div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Improvements with Intervention */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-emerald-600" /> Health Improvements with Intervention</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {twoFutures.withAction.healthImprovements.map((imp, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">{imp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Predictions are based on statistical models using ICMR-INDIAB, PURE India, and NFHS-5 epidemiological data. They represent population-level risk trends, NOT individual diagnoses. Regular checkups and consultation with healthcare professionals are essential for personalized medical guidance.</p>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
