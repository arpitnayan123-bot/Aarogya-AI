'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert, Heart, Activity, Droplets, Brain, Cigarette,
  Wine, AlertTriangle, CheckCircle2, TrendingUp, Info, Zap
} from 'lucide-react';
import type { UserMetrics } from '@/types/aarogya';

interface RiskAssessmentProps {
  metrics: UserMetrics;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ metrics }) => {
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [exercise, setExercise] = useState<'none' | 'light' | 'moderate' | 'high'>('moderate');
  const [diet, setDiet] = useState<'poor' | 'average' | 'good'>('average');
  const [stress, setStress] = useState<'low' | 'medium' | 'high'>('medium');

  const bmi = +(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);

  // Cardiac Risk Score (simplified based on WHO/ICMR risk factors)
  const cardiacRisk = useMemo(() => {
    let score = 0;
    const reasons: string[] = [];
    // Age
    if (metrics.age > 55) { score += 20; reasons.push('Age > 55'); }
    else if (metrics.age > 45) { score += 10; reasons.push('Age 45-55'); }
    // Gender
    if (metrics.gender === 'Male') { score += 10; reasons.push('Male gender'); }
    // BP
    if (metrics.systolicBP >= 140 || metrics.diastolicBP >= 90) { score += 20; reasons.push('High BP (≥140/90)'); }
    else if (metrics.systolicBP >= 130 || metrics.diastolicBP >= 85) { score += 10; reasons.push('Elevated BP'); }
    // BMI
    if (bmi >= 30) { score += 15; reasons.push('Obese (BMI ≥30)'); }
    else if (bmi >= 25) { score += 8; reasons.push('Overweight (BMI 25-30)'); }
    // Smoking
    if (smoking) { score += 20; reasons.push('Smoking'); }
    // Family history
    if (familyHistory) { score += 15; reasons.push('Family history'); }
    // Exercise (protective)
    if (exercise === 'none') { score += 10; reasons.push('No exercise'); }
    else if (exercise === 'high') { score -= 5; }
    // Diet
    if (diet === 'poor') { score += 10; reasons.push('Poor diet'); }
    else if (diet === 'good') { score -= 5; }
    return { score: Math.max(0, Math.min(100, score)), reasons };
  }, [metrics, bmi, smoking, familyHistory, exercise, diet]);

  // Diabetes Risk (based on ICMR-INDIAB)
  const diabetesRisk = useMemo(() => {
    let score = 0;
    const reasons: string[] = [];
    if (metrics.age > 45) { score += 15; reasons.push('Age > 45'); }
    if (bmi >= 25) { score += 20; reasons.push(`BMI ${bmi} (≥25)`); }
    if (metrics.systolicBP >= 130) { score += 15; reasons.push('High BP'); }
    if (familyHistory) { score += 20; reasons.push('Family history of diabetes'); }
    if (exercise === 'none') { score += 10; reasons.push('Sedentary lifestyle'); }
    if (diet === 'poor') { score += 10; reasons.push('Poor diet (high sugar/refined carbs)'); }
    if (metrics.gender === 'Male' && bmi >= 25) { score += 5; }
    return { score: Math.max(0, Math.min(100, score)), reasons };
  }, [metrics, bmi, familyHistory, exercise, diet]);

  // Hypertension Risk
  const hypertensionRisk = useMemo(() => {
    let score = 0;
    const reasons: string[] = [];
    if (metrics.systolicBP >= 140) { score += 30; reasons.push(`Systolic ${metrics.systolicBP} (≥140)`); }
    else if (metrics.systolicBP >= 130) { score += 20; reasons.push(`Systolic ${metrics.systolicBP} (130-139)`); }
    if (metrics.diastolicBP >= 90) { score += 20; reasons.push(`Diastolic ${metrics.diastolicBP} (≥90)`); }
    if (bmi >= 27) { score += 15; reasons.push('High BMI'); }
    if (smoking) { score += 15; reasons.push('Smoking'); }
    if (alcohol) { score += 10; reasons.push('Alcohol consumption'); }
    if (stress === 'high') { score += 10; reasons.push('High stress'); }
    if (exercise === 'none') { score += 5; }
    return { score: Math.max(0, Math.min(100, score)), reasons };
  }, [metrics, bmi, smoking, alcohol, stress, exercise]);

  const getRiskLevel = (score: number) => {
    if (score >= 60) return { level: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (score >= 30) return { level: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { level: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  };

  const overallScore = Math.round((cardiacRisk.score + diabetesRisk.score + hypertensionRisk.score) / 3);
  const overallRisk = getRiskLevel(overallScore);

  const riskCards = [
    { name: 'Cardiac', icon: Heart, data: cardiacRisk, color: 'rose' },
    { name: 'Diabetes', icon: Droplets, data: diabetesRisk, color: 'amber' },
    { name: 'Hypertension', icon: Activity, data: hypertensionRisk, color: 'violet' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Health Risk Assessment</h1>
            <p className="text-rose-50/90 text-sm mt-1">Multi-factor risk analysis · ICMR-INDIAB & PURE India data</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> Real-time</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Info className="w-3 h-3" /> 6 risk factors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Risk */}
      <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border-2 ${overallRisk.border} ${overallRisk.bg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Overall Risk Score</div>
            <div className={`text-5xl font-extrabold ${overallRisk.color}`}>{overallScore}<span className="text-2xl">/100</span></div>
            <div className={`text-lg font-bold ${overallRisk.color} mt-1`}>{overallRisk.level} Risk</div>
          </div>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${overallScore * 3.27} 327`} className={overallRisk.color} />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-2xl font-extrabold ${overallRisk.color}`}>{overallScore}%</div>
          </div>
        </div>
      </div>

      {/* Lifestyle Inputs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">Lifestyle Factors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => setSmoking(!smoking)} className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-colors ${smoking ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <Cigarette className="w-5 h-5" /> Smoking: {smoking ? 'Yes' : 'No'}
          </button>
          <button onClick={() => setAlcohol(!alcohol)} className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-colors ${alcohol ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <Wine className="w-5 h-5" /> Alcohol: {alcohol ? 'Yes' : 'No'}
          </button>
          <button onClick={() => setFamilyHistory(!familyHistory)} className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-colors ${familyHistory ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <Heart className="w-5 h-5" /> Family History: {familyHistory ? 'Yes' : 'No'}
          </button>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <Brain className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-bold text-slate-600">Stress:</span>
            <select value={stress} onChange={e => setStress(e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <Activity className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-bold text-slate-600">Exercise:</span>
            <select value={exercise} onChange={e => setExercise(e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold">
              <option value="none">None</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <span className="text-base">🥗</span>
            <span className="text-sm font-bold text-slate-600">Diet:</span>
            <select value={diet} onChange={e => setDiet(e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold">
              <option value="poor">Poor</option><option value="average">Average</option><option value="good">Good</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span className="text-slate-500">Vitals: BP {metrics.systolicBP}/{metrics.diastolicBP} · BMI {bmi} · Age {metrics.age}</span>
        </div>
      </div>

      {/* Individual Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {riskCards.map((card, i) => {
          const risk = getRiskLevel(card.data.score);
          return (
            <div key={i} className={`bg-white border ${risk.border} border-opacity-30 rounded-3xl p-5 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${risk.bg}`}><card.icon className={`w-5 h-5 ${risk.color}`} /></div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${risk.bg} ${risk.color}`}>{risk.level}</span>
              </div>
              <h3 className="font-extrabold text-slate-900 mb-1">{card.name} Risk</h3>
              <div className={`text-3xl font-extrabold ${risk.color}`}>{card.data.score}<span className="text-base text-slate-400">/100</span></div>
              {card.data.reasons.length > 0 && (
                <div className="mt-3 space-y-1">
                  {card.data.reasons.slice(0, 3).map((r, j) => (
                    <div key={j} className="text-[10px] text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" /> {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Recommendations</h2>
        <div className="space-y-2">
          {[
            { cond: cardiacRisk.score >= 30, text: 'Get annual cardiac checkup (ECG, lipid profile, BP monitoring)' },
            { cond: diabetesRisk.score >= 30, text: 'Check fasting blood sugar & HbA1c every 6 months' },
            { cond: hypertensionRisk.score >= 30, text: 'Monitor BP daily. Reduce salt to <5g/day. DASH diet recommended.' },
            { cond: smoking, text: 'Quit smoking — reduces cardiac risk by 50% in 1 year' },
            { cond: bmi >= 25, text: 'Aim for 5-10% weight loss. Even small reductions significantly lower risk.' },
            { cond: exercise === 'none', text: 'Start with 30-min daily walk. Build to 150 min/week moderate exercise.' },
            { cond: diet === 'poor', text: 'Adopt Mediterranean or DASH diet. More fruits, vegetables, whole grains.' },
            { cond: stress === 'high', text: 'Practice stress management: meditation, yoga, or counseling' },
            { cond: true, text: 'Stay hydrated (3L/day) and get 7-9 hours sleep' },
          ].filter(r => r.cond).map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{rec.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">This is a simplified risk screening tool based on population-level risk factors (ICMR-INDIAB, PURE India Study). It is NOT a medical diagnosis. Consult a physician for comprehensive evaluation including blood tests and clinical examination.</p>
      </div>
    </div>
  );
};

export default RiskAssessment;
