// ============================================
// AAROGYA AI — CLINICAL HEALTH SCORE METHODOLOGY
//
// A transparent, explainable composite score (0–100) computed
// from modifiable lifestyle + biometric inputs.
//
// Domain breakdown:
//   • Cardiovascular   25 pts   (HR + BP)
//   • Metabolic        20 pts   (fasting glucose + BMI)
//   • Sleep            20 pts   (sleep hours)
//   • Activity         20 pts   (daily steps)
//   • Nutrition        15 pts   (5 lifestyle questions × 3 pts)
//                          Total = 100 pts
//
// Indian clinical cutoffs are intentionally used (BMI 23 / 27.5
// instead of WHO 25 / 30, since South-Asian populations develop
// cardiometabolic risk at lower BMI — per ICMR / API guidelines).
//
// All sub-scores are returned alongside the total so the UI can
// render a per-domain breakdown for clinical transparency.
// ============================================

export interface HealthVitals {
  /** Resting heart rate (bpm). */
  heartRate?: number;
  /** Systolic blood pressure (mmHg). */
  systolicBP?: number;
  /** Diastolic blood pressure (mmHg). */
  diastolicBP?: number;
  /** Fasting plasma glucose (mg/dL). */
  fastingGlucose?: number;
  /** Body Mass Index (kg/m²). */
  bmi?: number;
  /** Average sleep per night (hours). */
  sleepHours?: number;
  /** Average daily step count. */
  dailySteps?: number;
  /**
   * 5 boolean answers to lifestyle questions (in order):
   *   [0] Eat ≥5 servings of fruits/vegetables daily?
   *   [1] Avoid sugary drinks & ultra-processed foods?
   *   [2] No tobacco use?
   *   [3] Limit alcohol (≤2 drinks/day for men, ≤1 for women)?
   *   [4] Practice stress management (meditation/yoga/breathing) ≥3×/week?
   * `true` = healthy behaviour, `false` = unhealthy.
   */
  lifestyleAnswers?: boolean[];
}

export interface HealthScoreResult {
  /** Composite score 0–100. */
  total: number;
  /** Cardiovascular domain (0–25). */
  cardiovascular: number;
  /** Metabolic domain (0–20). */
  metabolic: number;
  /** Sleep domain (0–20). */
  sleep: number;
  /** Activity domain (0–20). */
  activity: number;
  /** Nutrition/lifestyle domain (0–15). */
  nutrition: number;
}

/**
 * Clamp a value into the [min, max] range.
 */
function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

/**
 * Cardiovascular domain (max 25 pts).
 *   • Heart rate (15 pts):
 *       60–100 bpm = 15  (normal resting range)
 *       50–60 or 100–110 bpm = 9  (borderline)
 *       otherwise = 3
 *   • Blood pressure (10 pts):
 *       <120/80 = 10  (optimal, per AHA/ACC)
 *       <130/85 = 6   (elevated / stage 1)
 *       otherwise = 2
 */
function scoreCardiovascular(v: HealthVitals): number {
  let hrScore = 0;
  if (typeof v.heartRate === 'number') {
    const hr = v.heartRate;
    if (hr >= 60 && hr <= 100) hrScore = 15;
    else if ((hr >= 50 && hr < 60) || (hr > 100 && hr <= 110)) hrScore = 9;
    else hrScore = 3;
  }

  let bpScore = 0;
  if (
    typeof v.systolicBP === 'number' &&
    typeof v.diastolicBP === 'number'
  ) {
    const s = v.systolicBP;
    const d = v.diastolicBP;
    if (s < 120 && d < 80) bpScore = 10;
    else if (s < 130 && d < 85) bpScore = 6;
    else bpScore = 2;
  }
  // If neither HR nor BP is provided, return 0 for the domain.
  return clamp(hrScore + bpScore, 0, 25);
}

/**
 * Metabolic domain (max 20 pts).
 *   • Fasting glucose (10 pts):
 *       <100 mg/dL = 10  (normal, per ADA)
 *       100–125 mg/dL = 5  (prediabetes)
 *       ≥126 mg/dL = 1  (diabetes range)
 *   • BMI (10 pts) — INDIAN cutoffs (per ICMR/API consensus):
 *       <23 = 10  (healthy for South-Asian body composition)
 *       23–27.5 = 5  (overweight)
 *       >27.5 = 1  (obese)
 */
function scoreMetabolic(v: HealthVitals): number {
  let glucoseScore = 0;
  if (typeof v.fastingGlucose === 'number') {
    const g = v.fastingGlucose;
    if (g < 100) glucoseScore = 10;
    else if (g <= 125) glucoseScore = 5;
    else glucoseScore = 1;
  }

  let bmiScore = 0;
  if (typeof v.bmi === 'number') {
    const b = v.bmi;
    if (b < 23) bmiScore = 10;
    else if (b <= 27.5) bmiScore = 5;
    else bmiScore = 1;
  }
  return clamp(glucoseScore + bmiScore, 0, 20);
}

/**
 * Sleep domain (max 20 pts).
 *   7–8 hours = 20  (optimal adult sleep, per AASM)
 *   6–7 or 8–9 hours = 12  (acceptable)
 *   otherwise = 4  (chronic deprivation or excess)
 */
function scoreSleep(v: HealthVitals): number {
  if (typeof v.sleepHours !== 'number') return 0;
  const s = v.sleepHours;
  if (s >= 7 && s <= 8) return 20;
  if ((s >= 6 && s < 7) || (s > 8 && s <= 9)) return 12;
  return 4;
}

/**
 * Activity domain (max 20 pts).
 *   ≥10,000 steps = 20  (active lifestyle)
 *   ≥8,000 steps  = 16  (baseline for cardiovascular health)
 *   Otherwise proportional from 0–16 based on steps / 8000.
 */
function scoreActivity(v: HealthVitals): number {
  if (typeof v.dailySteps !== 'number') return 0;
  const steps = v.dailySteps;
  if (steps >= 10000) return 20;
  if (steps >= 8000) return 16;
  // Proportional 0–16 below 8000.
  const proportional = Math.round((steps / 8000) * 16);
  return clamp(proportional, 0, 16);
}

/**
 * Nutrition / lifestyle domain (max 15 pts).
 *   5 questions × 3 pts each (true = healthy = 3 pts).
 *   If no answers provided, returns 0.
 */
function scoreNutrition(v: HealthVitals): number {
  if (!Array.isArray(v.lifestyleAnswers)) return 0;
  let pts = 0;
  for (let i = 0; i < 5; i++) {
    if (v.lifestyleAnswers[i] === true) pts += 3;
  }
  return clamp(pts, 0, 15);
}

/**
 * Compute the composite clinical health score (0–100) from
 * the provided vitals + lifestyle answers.
 *
 * Domains with no input data contribute 0 points (the user is
 * not penalised for missing data, but the maximum total is
 * reduced accordingly — the UI may wish to surface a "data
 * coverage" indicator alongside the score).
 */
export function calculateHealthScore(vitals: HealthVitals): HealthScoreResult {
  const cardiovascular = scoreCardiovascular(vitals);
  const metabolic = scoreMetabolic(vitals);
  const sleep = scoreSleep(vitals);
  const activity = scoreActivity(vitals);
  const nutrition = scoreNutrition(vitals);
  const total = clamp(
    cardiovascular + metabolic + sleep + activity + nutrition,
    0,
    100,
  );
  return { total, cardiovascular, metabolic, sleep, activity, nutrition };
}

/**
 * The 5 lifestyle questions used by the nutrition sub-score.
 * Exported so the UI can render them in a consistent order.
 */
export const LIFESTYLE_QUESTIONS: string[] = [
  'Do you eat 5+ servings of fruits and vegetables daily?',
  'Do you avoid sugary drinks and ultra-processed foods?',
  'Are you free from any tobacco use (smoking or smokeless)?',
  'Do you limit alcohol (≤2 drinks/day for men, ≤1 for women)?',
  'Do you practice stress management (yoga/meditation/breathing) 3+ times/week?',
];
