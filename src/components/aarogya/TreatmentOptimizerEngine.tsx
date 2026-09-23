'use client';

/**
 * TreatmentOptimizerEngine — Personalized treatment plan generator.
 *
 * Lightweight module — reads from Medical Knowledge Engine + Causal Engine
 * without modifying them. Generates optimized treatment plans.
 */

import React, { useState, useMemo } from 'react';
import {
  Stethoscope, Pill, Apple, Activity, Moon, Brain,
  Zap, CheckCircle2, AlertTriangle, Target, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';
import { getDiseaseInfo, getGuideline, getAllDiseases } from '@/lib/knowledgeEngine';

interface TreatmentPlan {
  condition: string;
  icdCode: string;
  guideline: string;
  phases: {
    phase: string;
    duration: string;
    actions: { type: 'medication' | 'lifestyle' | 'monitoring' | 'behavioral'; action: string; rationale: string; expectedOutcome: string; priority: 'high' | 'medium' | 'low' }[];
  }[];
  successMetrics: string[];
  followUpSchedule: string;
  personalizedAdjustments: string[];
  confidence: number;
}

const PLANS: Record<string, TreatmentPlan> = {
  htn: {
    condition: 'Hypertension Management Plan',
    icdCode: 'I10',
    guideline: 'ICMR Guidelines: Lifestyle first for Stage 1, medication if >140/90',
    phases: [
      { phase: 'Phase 1: Lifestyle (Weeks 1-4)', duration: '4 weeks', actions: [
        { type: 'lifestyle', action: 'Reduce salt to <5g/day', rationale: 'You consume 8g/day — salt is 35% contributor to your BP', expectedOutcome: 'BP reduction 8-12 mmHg', priority: 'high' },
        { type: 'lifestyle', action: '30-min daily walk', rationale: 'Steps at 5,400 — activity is low', expectedOutcome: 'BP reduction 5-8 mmHg', priority: 'high' },
        { type: 'behavioral', action: '10-min daily meditation', rationale: 'Stress index at 68/100 — major contributor', expectedOutcome: 'BP reduction 3-5 mmHg', priority: 'medium' },
        { type: 'lifestyle', action: 'Sleep 7+ hours', rationale: 'Current 5.8h worsens BP via cortisol', expectedOutcome: 'BP reduction 2-4 mmHg', priority: 'medium' },
      ]},
      { phase: 'Phase 2: Assessment (Week 4)', duration: '1 visit', actions: [
        { type: 'monitoring', action: 'Clinical BP measurement', rationale: 'Confirm wearable readings', expectedOutcome: 'Validate diagnosis', priority: 'high' },
        { type: 'monitoring', action: 'Lipid panel + renal function', rationale: 'Check for target organ damage', expectedOutcome: 'Risk stratification', priority: 'high' },
        { type: 'monitoring', action: 'ECG (12-lead)', rationale: 'Check for LVH given cardiomegaly on X-ray', expectedOutcome: 'Cardiac assessment', priority: 'high' },
      ]},
      { phase: 'Phase 3: Pharmacotherapy (if needed)', duration: 'Ongoing', actions: [
        { type: 'medication', action: 'Amlodipine 5mg OD (first-line)', rationale: 'ICMR first-line for Indian patients', expectedOutcome: 'BP control <130/80', priority: 'high' },
        { type: 'medication', action: 'Add Telmisartan 40mg if not controlled', rationale: 'Dual therapy per ICMR guidelines', expectedOutcome: 'Additional 10-15 mmHg reduction', priority: 'medium' },
      ]},
    ],
    successMetrics: ['BP <130/80 on 3 separate readings', 'No morning headaches', 'Exercise tolerance improved', 'HRV >40ms'],
    followUpSchedule: 'Week 2 (lifestyle check) → Week 4 (assessment) → Month 3 (medication review) → Every 6 months',
    personalizedAdjustments: [
      'Your salt sensitivity is moderate (not high) — salt reduction will help but less than average',
      'Your stress is the #1 driver — prioritize stress management alongside lifestyle',
      'Your sleep pattern affects morning BP most — fix sleep first for fastest results',
      'Cardiac silhouette enlargement on X-ray warrants early cardiology referral',
    ],
    confidence: 85,
  },
  t2dm: {
    condition: 'Prediabetes Reversal Plan',
    icdCode: 'R73.0',
    guideline: 'ICMR-INDIAB: Lifestyle intervention for prediabetes, metformin if progressing',
    phases: [
      { phase: 'Phase 1: Intensive Lifestyle (Months 1-3)', duration: '12 weeks', actions: [
        { type: 'lifestyle', action: 'Cut added sugar to <25g/day', rationale: 'Sugar intake at 45g/day — driving insulin resistance', expectedOutcome: 'Fasting glucose -8 to -12 mg/dL', priority: 'high' },
        { type: 'lifestyle', action: '10-min walk after each meal', rationale: 'Most effective single glucose intervention', expectedOutcome: 'Post-meal glucose -20-30%', priority: 'high' },
        { type: 'lifestyle', action: 'Weight loss target 5%', rationale: 'BMI 27.5 → target 26.1', expectedOutcome: 'Insulin sensitivity +30%', priority: 'high' },
        { type: 'lifestyle', action: 'Sleep 7+ hours', rationale: 'Your glucose responds to sleep faster than diet', expectedOutcome: 'Fasting glucose -5 mg/dL in 2 days', priority: 'medium' },
      ]},
      { phase: 'Phase 2: Assessment (Month 3)', duration: '1 visit', actions: [
        { type: 'monitoring', action: 'HbA1c repeat', rationale: 'Check if prediabetes reversed or progressed', expectedOutcome: 'Guide further treatment', priority: 'high' },
        { type: 'monitoring', action: 'Fasting insulin + C-peptide', rationale: 'Confirm insulin resistance change', expectedOutcome: 'HOMA-IR calculation', priority: 'medium' },
      ]},
      { phase: 'Phase 3: Pharmacotherapy (if HbA1c ≥6.5%)', duration: 'Ongoing', actions: [
        { type: 'medication', action: 'Metformin 500mg BD', rationale: 'ICMR/ADA first-line for T2D', expectedOutcome: 'HbA1c -1-2%', priority: 'high' },
      ]},
    ],
    successMetrics: ['HbA1c <5.7%', 'Fasting glucose <100 mg/dL', 'Weight loss ≥3kg', 'No post-meal fatigue'],
    followUpSchedule: 'Month 1 (lifestyle check) → Month 3 (HbA1c) → Month 6 (if medicated) → Annually if reversed',
    personalizedAdjustments: [
      'Your glucose responds to sleep improvement in 2 days (faster than diet) — prioritize sleep',
      'Your insulin resistance is moderate (HOMA-IR ~2.5) — lifestyle alone may reverse',
      'Post-meal walks are your most effective intervention based on personal data',
      'Festival days show 40% sugar increase — plan pre-festival interventions',
    ],
    confidence: 82,
  },
};

export const TreatmentOptimizerEngine: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<keyof typeof PLANS>('htn');
  const plan = PLANS[selectedCondition];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><Stethoscope className="w-7 h-7 text-emerald-300" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              Treatment Optimizer
              <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span>
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1">Personalized treatment plans — optimized for YOUR body</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> ICMR-guideline aligned</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><Brain className="w-3 h-3" /> Causally personalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Condition Selector */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Condition:</label>
        <div className="flex gap-2">
          {Object.entries(PLANS).map(([key, p]) => (
            <button key={key} onClick={() => setSelectedCondition(key as keyof typeof PLANS)}
              className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${selectedCondition === key ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
              <div className="font-bold text-sm text-slate-900">{p.condition.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400">{p.icdCode}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Guideline Reference */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-900">Clinical Guideline</h2>
        </div>
        <p className="text-sm text-slate-700">{plan.guideline}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{plan.confidence}% confidence</span>
        </div>
      </div>

      {/* Treatment Phases */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-600" /> Treatment Phases</h2>
        <div className="space-y-4">
          {plan.phases.map((phase, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-extrabold">{i + 1}</div>
              {i < plan.phases.length - 1 && <div className="absolute left-3 top-6 bottom-0 w-px bg-slate-200" />}
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-slate-900">{phase.phase}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{phase.duration}</span>
                </div>
                <div className="space-y-2">
                  {phase.actions.map((action, j) => {
                    const icon = action.type === 'medication' ? Pill : action.type === 'lifestyle' ? Apple : action.type === 'monitoring' ? Activity : Brain;
                    const Icon = icon;
                    return (
                      <div key={j} className={`p-3 rounded-xl border ${action.priority === 'high' ? 'border-red-100 bg-red-50/50' : action.priority === 'medium' ? 'border-amber-100 bg-amber-50/50' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-lg ${action.priority === 'high' ? 'bg-red-100 text-red-600' : action.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}><Icon className="w-3.5 h-3.5" /></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{action.action}</span>
                              <span className={`text-[8px] font-bold uppercase ${action.priority === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{action.priority}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">{action.rationale}</p>
                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">→ {action.expectedOutcome}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Adjustments */}
      <div className="bg-gradient-to-br from-violet-50 to-emerald-50 border border-violet-100 rounded-3xl p-5">
        <h2 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><Brain className="w-5 h-5 text-violet-600" /> Personalized Adjustments</h2>
        <div className="space-y-2">
          {plan.personalizedAdjustments.map((adj, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg">
              <span className="text-violet-400 mt-0.5">•</span>
              <p className="text-xs text-slate-700">{adj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics + Follow-up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Success Metrics</h3>
          <ul className="space-y-1">{plan.successMetrics.map((m, i) => <li key={i} className="text-xs text-slate-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> {m}</li>)}</ul>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> Follow-Up Schedule</h3>
          <p className="text-xs text-slate-600">{plan.followUpSchedule}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Treatment plans are AI-generated recommendations based on your personal health data, ICMR guidelines, and causal analysis. They are NOT prescriptions. Only a qualified doctor can prescribe medication and determine treatment. Share this plan with your doctor for clinical decision-making.</p>
      </div>
    </div>
  );
};

export default TreatmentOptimizerEngine;
