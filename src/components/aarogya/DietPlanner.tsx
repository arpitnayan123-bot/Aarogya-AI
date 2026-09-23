'use client';

// ============================================
// AAROGYA AI — SMART DIET PLANNER
// Real AI via /api/ai/diet (LLM JSON mode).
// Falls back to generateDietPlan from @/data/aiSimulator.
// Indian-food-first, emerald/teal premium design.
// ============================================

import React, { useState, useMemo } from 'react';
import {
  Apple, Utensils, Calculator, Loader2, Target, Info,
  Flame, Beef, Wheat, Droplet, Leaf, Sparkles, ShoppingBasket,
  Sun, Moon, Coffee, Cookie, CheckCircle2, AlertCircle, RotateCcw,
  Activity, TrendingDown, TrendingUp, ShieldCheck, Gauge, Salad,
} from 'lucide-react';
import type {
  DietPlan, DayDietPlan, Meal, MedicalGoal, UserMetrics,
} from '@/types/aarogya';
import { generateDietPlan } from '@/data/aiSimulator';

// ============================================
// PROPS
// ============================================
interface DietPlannerProps {
  /** Optional user metrics (weight, height, age, …). Falls back to a sensible default. */
  metrics?: Partial<UserMetrics>;
}

// ============================================
// OPTIONS
// ============================================
const GOAL_OPTIONS: { value: MedicalGoal['goal']; label: string; icon: React.ElementType; hint: string }[] = [
  { value: 'weight_loss',       label: 'Weight Loss',       icon: TrendingDown, hint: 'Sustainable caloric deficit' },
  { value: 'muscle_gain',       label: 'Muscle Gain',       icon: TrendingUp,   hint: 'High-protein surplus' },
  { value: 'maintenance',       label: 'Maintenance',       icon: Gauge,        hint: 'Balanced energy' },
  { value: 'diabetes_mgmt',     label: 'Diabetes Care',     icon: ShieldCheck,  hint: 'Low glycemic load' },
  { value: 'hypertension_mgmt', label: 'BP Management',     icon: ShieldCheck,  hint: 'DASH-style, low sodium' },
];

const DIET_OPTIONS: { value: MedicalGoal['dietPreference']; label: string; emoji: string }[] = [
  { value: 'vegetarian',    label: 'Vegetarian',    emoji: '🥗' },
  { value: 'vegan',         label: 'Vegan',         emoji: '🌱' },
  { value: 'keto',          label: 'Keto',          emoji: '🥑' },
  { value: 'balanced',      label: 'Balanced',      emoji: '🍽️' },
  { value: 'gluten_free',   label: 'Gluten-Free',   emoji: '🌾' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
];

const ACTIVITY_OPTIONS: { value: MedicalGoal['activityLevel']; label: string; hint: string }[] = [
  { value: 'sedentary',     label: 'Sedentary',     hint: 'Office job, little exercise' },
  { value: 'moderate',      label: 'Moderate',      hint: '1–3 workouts / week' },
  { value: 'active',        label: 'Active',        hint: '4–5 workouts / week' },
  { value: 'highly_active', label: 'Highly Active', hint: 'Daily training / physical job' },
];

const COMMON_ALLERGIES = [
  'Peanuts', 'Tree nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Sesame',
];

const DEFAULT_METRICS: UserMetrics = {
  weight: 70, height: 170, age: 30, gender: 'female',
  steps: 5000, waterIntake: 1500, waterTarget: 2500,
  caloriesConsumed: 0, caloriesTarget: 2000,
  systolicBP: 118, diastolicBP: 78, sleepHours: 7,
};

// ============================================
// COMPONENT
// ============================================
export const DietPlanner: React.FC<DietPlannerProps> = ({ metrics }) => {
  const merged: UserMetrics = { ...DEFAULT_METRICS, ...(metrics ?? {}) };

  const [goal, setGoal] = useState<MedicalGoal['goal']>('weight_loss');
  const [dietPreference, setDietPreference] = useState<MedicalGoal['dietPreference']>('vegetarian');
  const [activityLevel, setActivityLevel] = useState<MedicalGoal['activityLevel']>('moderate');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [weight, setWeight] = useState<number>(merged.weight);
  const [height, setHeight] = useState<number>(merged.height);
  const [age, setAge] = useState<number>(merged.age);
  const [gender, setGender] = useState<string>(merged.gender);

  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------- Derived metrics: BMI / BMR / TDEE --------
  const derived = useMemo(() => {
    const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);
    const bmiCategory = bmi < 18.5 ? 'Underweight'
      : bmi < 25 ? 'Normal'
      : bmi < 30 ? 'Overweight'
      : 'Obese';
    const bmr = Math.round(
      10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)
    );
    const activityFactor = activityLevel === 'sedentary' ? 1.2
      : activityLevel === 'moderate' ? 1.45
      : activityLevel === 'active' ? 1.65
      : 1.85;
    const tdee = Math.round(bmr * activityFactor);
    const targetCalories = goal === 'weight_loss' ? tdee - 400
      : goal === 'muscle_gain' ? tdee + 300
      : goal === 'diabetes_mgmt' ? Math.min(1700, tdee - 100)
      : goal === 'hypertension_mgmt' ? Math.min(1800, tdee)
      : tdee;
    return { bmi, bmiCategory, bmr, tdee, targetCalories };
  }, [weight, height, age, gender, activityLevel, goal]);

  const getBmiColor = (bmi: number) => {
    if (bmi < 18.5) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (bmi < 25)   return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (bmi < 30)   return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const toggleAllergy = (a: string) => {
    setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  // -------- Generate plan: real AI → fallback --------
  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    const liveMetrics: UserMetrics = { ...merged, weight, height, age, gender };
    const preferences: MedicalGoal = { goal, dietPreference, allergies, activityLevel };

    try {
      const res = await fetch('/api/ai/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: JSON.stringify({
            goal, dietPreference, allergies, activityLevel, metrics: liveMetrics,
          }),
          context: { age, gender, metrics: liveMetrics },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = json?.data ?? json;
      const normalized = normalizeDietPlan(data, preferences, liveMetrics);
      if (!normalized) throw new Error('Invalid plan payload');
      setPlan(normalized);
    } catch (err) {
      console.warn('[DietPlanner] AI request failed — using local simulator fallback', err);
      const fallback = generateDietPlan(preferences, liveMetrics);
      setPlan(fallback);
      setUsingFallback(true);
      setError('Live AI unavailable — showing locally generated plan.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setError(null);
    setUsingFallback(false);
  };

  const bmiColors = getBmiColor(derived.bmi);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      <style jsx>{`
        @keyframes nxPlateSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        .nx-plate-spin { animation: nxPlateSpin 18s linear infinite; }
        @keyframes nxCalBarGrow { from { width: 0%; } }
        .nx-cal-bar { animation: nxCalBarGrow 1s ease-out forwards; }
        @keyframes nxMealPop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .nx-meal-pop { animation: nxMealPop 0.4s ease-out forwards; opacity: 0; }
        @keyframes nxShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .nx-shimmer {
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.18), transparent);
          background-size: 200% 100%;
          animation: nxShimmer 1.4s linear infinite;
        }
      `}</style>

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-950 p-8 text-white shadow-2xl">
        <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl animate-pulseGlow" />
        <div className="absolute -mb-24 -ml-16 bottom-0 left-0 h-56 w-56 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="absolute right-8 top-8 opacity-10">
          <Utensils className="h-32 w-32 nx-plate-spin" />
        </div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <Apple className="h-8 w-8 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-black">Smart Diet &amp; Nutrition Planner</h1>
          </div>
          <p className="max-w-2xl text-emerald-100">
            Get a personalized 3-day Indian meal plan powered by AI — tuned to your goal,
            dietary preference, allergies, and activity level. Built on ICMR-NIN food tables
            and Ayurvedic wisdom.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🥗 Indian-first meals</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">📊 BMI · BMR · TDEE</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🌿 Ayurvedic insights</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🛒 Smart shopping list</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===== FORM ===== */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Calculator className="h-5 w-5 text-emerald-500" /> Your Profile
          </h2>

          <div className="space-y-4">
            {/* Body stats */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Weight (kg)">
                <input type="number" value={weight} min={30} max={250}
                  onChange={e => setWeight(Math.max(30, +e.target.value))}
                  className={inputCls} />
              </Field>
              <Field label="Height (cm)">
                <input type="number" value={height} min={120} max={220}
                  onChange={e => setHeight(Math.max(120, +e.target.value))}
                  className={inputCls} />
              </Field>
              <Field label="Age">
                <input type="number" value={age} min={10} max={100}
                  onChange={e => setAge(Math.max(10, +e.target.value))}
                  className={inputCls} />
              </Field>
              <Field label="Gender">
                <select value={gender} onChange={e => setGender(e.target.value)} className={inputCls}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>

            {/* Goal */}
            <Field label="Primary Goal">
              <div className="grid grid-cols-1 gap-2">
                {GOAL_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = goal === opt.value;
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setGoal(opt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition-all ${
                        active
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}>
                      <Icon className={`h-4 w-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="flex-1">{opt.label}</span>
                      <span className="text-[9px] font-medium text-slate-400">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Diet preference */}
            <Field label="Diet Preference">
              <div className="grid grid-cols-3 gap-2">
                {DIET_OPTIONS.map(opt => {
                  const active = dietPreference === opt.value;
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setDietPreference(opt.value)}
                      className={`rounded-xl border px-2 py-2 text-[10px] font-bold transition-all ${
                        active ? 'border-teal-500 bg-teal-50 text-teal-800'
                               : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}>
                      <span className="mr-1">{opt.emoji}</span>{opt.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Activity */}
            <Field label="Activity Level">
              <div className="space-y-1.5">
                {ACTIVITY_OPTIONS.map(opt => {
                  const active = activityLevel === opt.value;
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setActivityLevel(opt.value)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-bold transition-all ${
                        active ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                               : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}>
                      <span>{opt.label}</span>
                      <span className="text-[9px] font-medium text-slate-400">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Allergies */}
            <Field label="Allergies / Avoid">
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ALLERGIES.map(a => {
                  const active = allergies.includes(a);
                  return (
                    <button key={a} type="button"
                      onClick={() => toggleAllergy(a)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-all ${
                        active ? 'border-rose-400 bg-rose-50 text-rose-700'
                               : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}>
                      {active && '✕ '}{a}
                    </button>
                  );
                })}
              </div>
            </Field>

            <button onClick={generatePlan} disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Plan…</>
                : <><Utensils className="h-4 w-4" /> Generate Meal Plan</>}
            </button>
          </div>
        </div>

        {/* ===== RESULTS ===== */}
        <div className="space-y-6 lg:col-span-2">
          {/* Metric strip — always visible */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Your BMI" value={derived.bmi}
              sub={derived.bmiCategory}
              accent={bmiColors.text} bg={bmiColors.bg} border={bmiColors.border} />
            <MetricCard label="BMR" value={derived.bmr} sub="cal/day at rest"
              accent="text-orange-600" bg="bg-orange-50" border="border-orange-200" />
            <MetricCard label="TDEE" value={derived.tdee} sub="with activity"
              accent="text-teal-600" bg="bg-teal-50" border="border-teal-200" />
            <MetricCard label="Daily Target" value={derived.targetCalories} sub="calories"
              icon={Target} accent="text-emerald-600" bg="bg-emerald-50" border="border-emerald-200" />
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
              <div className="mb-4 h-5 w-1/3 rounded-full bg-slate-100 nx-shimmer" />
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-50 nx-shimmer" />
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Crafting your personalized Indian meal plan…
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty state */}
          {!plan && !loading && (
            <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-premium">
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-4">
                <Salad className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Ready to plan your meals?</h3>
              <p className="mx-auto max-w-md text-sm text-slate-500">
                Set your goal, diet preference, and activity level on the left, then tap
                <span className="font-bold text-emerald-600"> Generate Meal Plan</span> for a
                3-day AI-crafted Indian menu.
              </p>
            </div>
          )}

          {/* Plan result */}
          {plan && !loading && (
            <>
              {/* Plan header card */}
              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-premium">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {usingFallback ? 'Local AI · Offline mode' : 'Aarogya AI · Personalized'}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{plan.title}</h3>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">{plan.description}</p>
                  </div>
                  <div className="rounded-2xl bg-white/70 px-4 py-3 text-center backdrop-blur">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Daily Calories</p>
                    <p className="text-3xl font-black text-emerald-600">{plan.dailyCalories}</p>
                    <p className="text-[9px] text-slate-400">kcal / day</p>
                  </div>
                </div>

                {/* Macro targets */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <MacroPill icon={Beef}    label="Protein" value={plan.proteinTarget} color="text-rose-600" bg="bg-rose-50" />
                  <MacroPill icon={Wheat}   label="Carbs"   value={plan.carbsTarget}   color="text-amber-600" bg="bg-amber-50" />
                  <MacroPill icon={Droplet} label="Fat"     value={plan.fatTarget}     color="text-orange-600" bg="bg-orange-50" />
                </div>
              </div>

              {/* Day-by-day plan */}
              <div className="space-y-4">
                {Object.entries(plan.days).slice(0, 3).map(([dayName, day], idx) => (
                  <DayCard key={dayName} dayName={dayName} day={day} index={idx} target={plan.dailyCalories} />
                ))}
              </div>

              {/* Shopping list */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
                  <ShoppingBasket className="h-5 w-5 text-emerald-500" /> Smart Shopping List
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plan.shoppingList.map((item, i) => (
                    <span key={i}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                      🛒 {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* General advice */}
              <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-6 shadow-premium">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-teal-800">
                  <Leaf className="h-5 w-5 text-teal-600" /> Wellness Guidance
                </h3>
                <ul className="space-y-2">
                  {plan.generalAdvice.map((tip, i) => (
                    <li key={i}
                      className="flex items-start gap-2 rounded-xl border border-teal-100 bg-white/70 p-3 text-xs text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer actions */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-premium sm:flex-row">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <p className="max-w-2xl text-[11px] leading-relaxed text-slate-500">
                    Meal plans are AI-generated for educational use based on ICMR-NIN food
                    tables and Ayurvedic principles. Consult a registered dietitian or your
                    physician before making significant dietary changes, especially if you
                    have diabetes, hypertension, or other medical conditions.
                  </p>
                </div>
                <button onClick={reset}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200">
                  <RotateCcw className="h-3.5 w-3.5" /> New Plan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;

// ============================================
// SUB-COMPONENTS
// ============================================
const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
    {children}
  </div>
);

const MetricCard: React.FC<{
  label: string; value: number | string; sub: string;
  accent: string; bg: string; border: string; icon?: React.ElementType;
}> = ({ label, value, sub, accent, bg, border, icon: Icon }) => (
  <div className={`rounded-2xl border ${border} ${bg} p-4 text-center`}>
    <p className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
      {Icon && <Icon className="h-3 w-3" />}{label}
    </p>
    <p className={`mt-1 text-2xl font-black ${accent}`}>{value}</p>
    <p className="mt-0.5 text-[9px] text-slate-500">{sub}</p>
  </div>
);

const MacroPill: React.FC<{
  icon: React.ElementType; label: string; value: string; color: string; bg: string;
}> = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`flex items-center gap-2 rounded-xl ${bg} px-3 py-2`}>
    <Icon className={`h-4 w-4 ${color}`} />
    <div>
      <p className="text-[9px] font-bold uppercase text-slate-500">{label}</p>
      <p className={`text-sm font-extrabold ${color}`}>{value}</p>
    </div>
  </div>
);

const MEAL_META: { key: keyof DayDietPlan; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'breakfast', label: 'Breakfast',   icon: Coffee,  color: 'from-amber-50 to-orange-50 border-amber-100' },
  { key: 'lunch',     label: 'Lunch',       icon: Sun,     color: 'from-emerald-50 to-teal-50 border-emerald-100' },
  { key: 'snack',     label: 'Snack',       icon: Cookie,  color: 'from-rose-50 to-pink-50 border-rose-100' },
  { key: 'dinner',    label: 'Dinner',      icon: Moon,    color: 'from-indigo-50 to-violet-50 border-violet-100' },
];

const DayCard: React.FC<{ dayName: string; day: DayDietPlan; index: number; target: number }> = ({
  dayName, day, index, target,
}) => {
  const meals = MEAL_META.map(m => ({ ...m, meal: day[m.key] })).filter(m => m.meal);
  const total = meals.reduce((s, m) => s + (m.meal.calories || 0), 0);
  const pct = Math.min(100, Math.round((total / target) * 100));

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-premium">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-black text-white">
            {index + 1}
          </span>
          <h3 className="text-base font-extrabold text-slate-900">{dayName}</h3>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase text-slate-400">Day total</p>
          <p className="text-lg font-black text-emerald-600">{total} kcal</p>
        </div>
      </div>

      {/* Calorie progress */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="nx-cal-bar h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {meals.map((m, i) => (
          <MealCard key={m.key} label={m.label} icon={m.icon} meal={m.meal} color={m.color} delay={i * 80} />
        ))}
      </div>
    </div>
  );
};

const MealCard: React.FC<{
  label: string; icon: React.ElementType; meal: Meal; color: string; delay: number;
}> = ({ label, icon: Icon, meal, color, delay }) => (
  <div
    className={`nx-meal-pop rounded-2xl border bg-gradient-to-br ${color} p-3`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-1.5 flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
        {meal.calories} kcal
      </span>
    </div>
    <p className="text-sm font-bold text-slate-800">{meal.name}</p>
    {meal.description && (
      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{meal.description}</p>
    )}
    <div className="mt-2 flex flex-wrap gap-1">
      <MacroChip label="P" value={meal.protein} cls="bg-rose-100 text-rose-700" />
      <MacroChip label="C" value={meal.carbs}   cls="bg-amber-100 text-amber-700" />
      <MacroChip label="F" value={meal.fat}     cls="bg-orange-100 text-orange-700" />
    </div>
  </div>
);

const MacroChip: React.FC<{ label: string; value: string; cls: string }> = ({ label, value, cls }) => (
  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${cls}`}>
    {label}: {value}
  </span>
);

// ============================================
// HELPERS
// ============================================
/** Defensively coerce an AI response into a DietPlan; return null if unfixable. */
function normalizeDietPlan(raw: any, goal: MedicalGoal, metrics: UserMetrics): DietPlan | null {
  if (!raw || typeof raw !== 'object') return null;

  // If the API returned the simulator's structure already, trust it but coerce days.
  const fallback = generateDietPlan(goal, metrics);

  const title: string = typeof raw.title === 'string' && raw.title.trim()
    ? raw.title : fallback.title;
  const description: string = typeof raw.description === 'string' && raw.description.trim()
    ? raw.description : fallback.description;
  const dailyCalories: number = Number.isFinite(raw.dailyCalories)
    ? Math.round(raw.dailyCalories) : fallback.dailyCalories;
  const proteinTarget: string = stringifyTarget(raw.proteinTarget) ?? fallback.proteinTarget;
  const carbsTarget: string   = stringifyTarget(raw.carbsTarget)   ?? fallback.carbsTarget;
  const fatTarget: string     = stringifyTarget(raw.fatTarget)     ?? fallback.fatTarget;

  // Days — accept either Day 1/2/3 keys OR Monday/Tuesday/Wednesday.
  const rawDays = raw.days ?? {};
  const days: Record<string, DayDietPlan> = {};
  const dayKeys = Object.keys(rawDays).slice(0, 3);
  if (dayKeys.length === 0) {
    // Use first 3 days of fallback
    Object.entries(fallback.days).slice(0, 3).forEach(([k, v]) => { days[k] = v; });
  } else {
    dayKeys.forEach((k, i) => {
      const d = rawDays[k];
      const label = `Day ${i + 1}`;
      days[label] = normalizeDay(d, fallback);
    });
  }

  let shoppingList: string[] = Array.isArray(raw.shoppingList) && raw.shoppingList.length > 0
    ? raw.shoppingList.filter((x: any) => typeof x === 'string')
    : fallback.shoppingList;

  let generalAdvice: string[] = Array.isArray(raw.generalAdvice) && raw.generalAdvice.length > 0
    ? raw.generalAdvice.filter((x: any) => typeof x === 'string')
    : fallback.generalAdvice;

  return {
    title, description, dailyCalories,
    proteinTarget, carbsTarget, fatTarget,
    days, shoppingList, generalAdvice,
  };
}

function normalizeDay(d: any, fallback: DietPlan): DayDietPlan {
  const ref = fallback.days['Monday'];
  const mk = (key: keyof DayDietPlan): Meal => normalizeMeal(d?.[key], ref[key]);
  return { breakfast: mk('breakfast'), lunch: mk('lunch'), snack: mk('snack'), dinner: mk('dinner') };
}

function normalizeMeal(m: any, fallback: Meal): Meal {
  if (!m || typeof m !== 'object') return fallback;
  return {
    name:        typeof m.name === 'string' && m.name.trim() ? m.name : fallback.name,
    calories:    Number.isFinite(m.calories) ? Math.round(m.calories) : fallback.calories,
    protein:     stringifyMacro(m.protein) ?? fallback.protein,
    carbs:       stringifyMacro(m.carbs)   ?? fallback.carbs,
    fat:         stringifyMacro(m.fat)     ?? fallback.fat,
    description: typeof m.description === 'string' ? m.description : fallback.description,
  };
}

function stringifyTarget(v: any): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return `${v}g`;
  if (typeof v === 'object' && v !== null) {
    const g = v.grams ?? v.g;
    const pct = v.percent ?? v.pct;
    if (g != null && pct != null) return `${g}g (${pct}%)`;
    if (g != null) return `${g}g`;
  }
  return null;
}

function stringifyMacro(v: any): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return `${v}g`;
  return null;
}
