'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale, TrendingUp, TrendingDown, Activity, Apple, Flame,
  Target, Calculator, Info, CheckCircle2, AlertCircle
} from 'lucide-react';
import type { UserMetrics } from '@/types/aarogya';

interface BMINutritionProps {
  metrics: UserMetrics;
}

const BMI_CATEGORIES = [
  { range: '< 18.5', label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50', advice: 'Increase caloric intake with nutrient-dense foods.' },
  { range: '18.5 - 24.9', label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50', advice: 'Maintain your healthy lifestyle!' },
  { range: '25.0 - 29.9', label: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-50', advice: 'Moderate calorie deficit + 150 min/week exercise.' },
  { range: '≥ 30', label: 'Obese', color: 'text-red-600', bg: 'bg-red-50', advice: 'Consult a doctor. Structured weight loss plan needed.' },
];

export const BMINutrition: React.FC<BMINutritionProps> = ({ metrics }) => {
  const [weight, setWeight] = useState(metrics.weight);
  const [height, setHeight] = useState(metrics.height);
  const [age, setAge] = useState(metrics.age);
  const [gender, setGender] = useState(metrics.gender);
  const [activityLevel, setActivityLevel] = useState('moderate');

  const bmi = useMemo(() => {
    const h = height / 100;
    return +(weight / (h * h)).toFixed(1);
  }, [weight, height]);

  const bmiCategory = BMI_CATEGORIES.find(c => {
    if (c.range.startsWith('<')) return bmi < 18.5;
    if (c.range.startsWith('≥')) return bmi >= 30;
    return bmi >= 18.5 && bmi < 25;
  }) || BMI_CATEGORIES[1];

  // BMR (Mifflin-St Jeor)
  const bmr = useMemo(() => {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(gender === 'Male' ? base + 5 : base - 161);
  }, [weight, height, age, gender]);

  // TDEE
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very_active': 1.9,
  };
  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

  // Macros (balanced diet: 50% carbs, 25% protein, 25% fat)
  const proteinCal = tdee * 0.25;
  const carbCal = tdee * 0.50;
  const fatCal = tdee * 0.25;
  const proteinG = Math.round(proteinCal / 4);
  const carbG = Math.round(carbCal / 4);
  const fatG = Math.round(fatCal / 9);
  const waterMl = Math.round(weight * 35); // 35ml per kg

  // BMI position on scale (for visualization)
  const bmiPercent = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">BMI & Nutrition Calculator</h1>
            <p className="text-emerald-50/90 text-sm mt-1">Body composition · Caloric needs · Macro targets</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Calculator className="w-3 h-3" /> Mifflin-St Jeor</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Target className="w-3 h-3" /> Personalized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">Your Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Weight (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Height (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Age</label>
            <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs font-bold text-slate-600 mb-1 block">Activity Level</label>
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very_active">Very Active (2x/day training)</option>
          </select>
        </div>
      </div>

      {/* BMI Display */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> Body Mass Index</h2>
        <div className="text-center mb-4">
          <div className={`text-6xl font-extrabold ${bmiCategory.color}`}>{bmi}</div>
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold mt-2 ${bmiCategory.bg} ${bmiCategory.color}`}>
            {bmiCategory.label} · BMI {bmiCategory.range}
          </div>
        </div>
        {/* BMI Scale */}
        <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-400">
          <div className="absolute top-0 w-1 h-full bg-slate-900 -translate-x-1/2" style={{ left: `${bmiPercent}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
        </div>
        <div className={`mt-4 p-3 rounded-2xl ${bmiCategory.bg}`}>
          <p className={`text-sm ${bmiCategory.color}`}>💡 {bmiCategory.advice}</p>
        </div>
      </div>

      {/* Caloric Needs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-orange-50 rounded-xl"><Flame className="w-5 h-5 text-orange-500" /></div>
            <h3 className="font-extrabold text-slate-900">BMR</h3>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{bmr}</div>
          <div className="text-xs text-slate-400">calories/day at rest</div>
          <p className="text-[10px] text-slate-500 mt-2">Basal Metabolic Rate — energy needed for basic life functions (Mifflin-St Jeor equation).</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-50 rounded-xl"><Target className="w-5 h-5 text-emerald-600" /></div>
            <h3 className="font-extrabold text-slate-900">TDEE</h3>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{tdee}</div>
          <div className="text-xs text-slate-400">calories/day (maintenance)</div>
          <p className="text-[10px] text-slate-500 mt-2">Total Daily Energy Expenditure — BMR × activity level. Eat less to lose, more to gain.</p>
        </div>
      </div>

      {/* Macro Targets */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Apple className="w-5 h-5 text-rose-500" /> Daily Macro Targets</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-emerald-600">{proteinG}g</div>
            <div className="text-xs font-bold text-emerald-700 mt-1">Protein</div>
            <div className="text-[10px] text-emerald-500">{Math.round(proteinCal)} kcal</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-600">{carbG}g</div>
            <div className="text-xs font-bold text-amber-700 mt-1">Carbs</div>
            <div className="text-[10px] text-amber-500">{Math.round(carbCal)} kcal</div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-rose-600">{fatG}g</div>
            <div className="text-xs font-bold text-rose-700 mt-1">Fat</div>
            <div className="text-[10px] text-rose-500">{Math.round(fatCal)} kcal</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 p-3 bg-cyan-50 rounded-2xl">
          <div className="p-1.5 bg-white rounded-lg"><span className="text-base">💧</span></div>
          <div>
            <div className="text-sm font-bold text-cyan-700">Water: {waterMl} ml/day</div>
            <div className="text-[10px] text-cyan-500">{Math.round(waterMl / 250)} glasses · 35ml per kg body weight</div>
          </div>
        </div>
      </div>

      {/* Goal-based calories */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4">Calorie Goals by Objective</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-4">
            <TrendingDown className="w-5 h-5 text-rose-500 mb-2" />
            <div className="text-xs font-bold text-rose-700 uppercase">Weight Loss</div>
            <div className="text-2xl font-extrabold text-rose-600">{tdee - 500}</div>
            <div className="text-[10px] text-rose-400">kcal/day · -0.5 kg/week</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
            <div className="text-xs font-bold text-emerald-700 uppercase">Maintain</div>
            <div className="text-2xl font-extrabold text-emerald-600">{tdee}</div>
            <div className="text-[10px] text-emerald-400">kcal/day · stable weight</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4">
            <TrendingUp className="w-5 h-5 text-amber-500 mb-2" />
            <div className="text-xs font-bold text-amber-700 uppercase">Muscle Gain</div>
            <div className="text-2xl font-extrabold text-amber-600">{tdee + 300}</div>
            <div className="text-[10px] text-amber-400">kcal/day · +0.25 kg/week</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">BMI has limitations — it doesn't account for muscle mass, bone density, or body composition. Athletes may have high BMI but low body fat. Consult a nutritionist for personalized guidance.</p>
      </div>
    </div>
  );
};

export default BMINutrition;
