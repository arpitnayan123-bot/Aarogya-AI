'use client';

import React from 'react';
import { Activity, TrendingUp, Heart, Droplets, Footprints, Moon } from 'lucide-react';
import type { UserMetrics } from '@/types/aarogya';

interface HealthScoreWidgetProps {
  metrics: UserMetrics;
  onNavigate?: (tab: string) => void;
}

/**
 * Computes a composite health score (0-100) from user metrics.
 * Factors: BMI, BP, Sleep, Hydration, Steps, Calories.
 */
function computeHealthScore(m: UserMetrics): { score: number; factors: { label: string; value: number; max: number; icon: any; color: string }[] } {
  const bmi = m.weight / ((m.height / 100) ** 2);
  const factors: { label: string; value: number; max: number; icon: any; color: string }[] = [];

  // BMI score (25 pts)
  let bmiScore = 0;
  if (bmi >= 18.5 && bmi < 25) bmiScore = 25;
  else if (bmi >= 25 && bmi < 30) bmiScore = 15;
  else if (bmi < 18.5) bmiScore = 10;
  factors.push({ label: 'BMI', value: bmiScore, max: 25, icon: Activity, color: bmiScore >= 20 ? 'text-emerald-500' : 'text-amber-500' });

  // Blood pressure (20 pts)
  let bpScore = 0;
  if (m.systolicBP < 120 && m.diastolicBP < 80) bpScore = 20;
  else if (m.systolicBP < 130 && m.diastolicBP < 85) bpScore = 15;
  else if (m.systolicBP < 140 && m.diastolicBP < 90) bpScore = 8;
  factors.push({ label: 'Blood Pressure', value: bpScore, max: 20, icon: Heart, color: bpScore >= 15 ? 'text-emerald-500' : 'text-amber-500' });

  // Sleep (20 pts)
  let sleepScore = 0;
  if (m.sleepHours >= 7 && m.sleepHours <= 9) sleepScore = 20;
  else if (m.sleepHours >= 6 && m.sleepHours < 7) sleepScore = 12;
  else if (m.sleepHours >= 5) sleepScore = 6;
  factors.push({ label: 'Sleep', value: sleepScore, max: 20, icon: Moon, color: sleepScore >= 15 ? 'text-emerald-500' : 'text-amber-500' });

  // Hydration (15 pts)
  const hydrationPct = Math.min(1, m.waterIntake / m.waterTarget);
  const hydrationScore = Math.round(hydrationPct * 15);
  factors.push({ label: 'Hydration', value: hydrationScore, max: 15, icon: Droplets, color: hydrationScore >= 10 ? 'text-emerald-500' : 'text-amber-500' });

  // Steps (10 pts) — target 8000
  const stepsPct = Math.min(1, m.steps / 8000);
  const stepsScore = Math.round(stepsPct * 10);
  factors.push({ label: 'Activity', value: stepsScore, max: 10, icon: Footprints, color: stepsScore >= 7 ? 'text-emerald-500' : 'text-amber-500' });

  // Calories (10 pts)
  const calPct = m.caloriesConsumed / m.caloriesTarget;
  let calScore = 10;
  if (calPct > 1.1 || calPct < 0.6) calScore = 4;
  else if (calPct > 1.05 || calPct < 0.7) calScore = 7;
  factors.push({ label: 'Nutrition', value: calScore, max: 10, icon: TrendingUp, color: calScore >= 8 ? 'text-emerald-500' : 'text-amber-500' });

  const total = factors.reduce((sum, f) => sum + f.value, 0);
  return { score: total, factors };
}

export const HealthScoreWidget: React.FC<HealthScoreWidgetProps> = ({ metrics, onNavigate }) => {
  const { score, factors } = computeHealthScore(metrics);

  const scoreColor = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = score >= 80 ? 'from-emerald-500 to-teal-500' : score >= 60 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention';

  // Circle progress
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-3">
      <button
        onClick={() => onNavigate?.('dashboard')}
        className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-left hover:scale-[1.02] transition-transform shadow-lg group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Health Score</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${scoreBg} text-white`}>{scoreLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="28" fill="none" stroke="url(#scoreGrad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
                  <stop offset="100%" stopColor={score >= 80 ? '#0d9488' : score >= 60 ? '#f97316' : '#ec4899'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-extrabold ${scoreColor}`}>{score}</span>
            </div>
          </div>

          {/* Mini factors */}
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            {factors.map((f, i) => (
              <div key={i} className="flex flex-col items-center">
                <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                <span className="text-[9px] font-bold text-slate-300 mt-0.5">{f.value}/{f.max}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">View Dashboard</span>
          <TrendingUp className="w-3 h-3 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
};

export default HealthScoreWidget;
