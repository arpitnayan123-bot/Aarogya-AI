// ============================================
// AAROGYA AI — DECISION INTELLIGENCE ENGINE
// Utility = ExpectedBenefit - Effort - Risk
// ============================================

import { runTwinSimulation, computeBaselines } from './temporalEngine';

export type ActionType = 'lifestyle' | 'behavioral' | 'clinical';
export type TimeToEffect = 'immediate' | 'short' | 'medium' | 'long';
export type RiskLevel = 'minimal' | 'low' | 'moderate' | 'high';

export interface HealthAction {
  id: string; title: string; description: string; type: ActionType;
  targetsRootCause: string; targetVariable: string;
  expectedBenefit: number; effort: number; risk: number; utility: number; confidence: number;
  timeToEffect: TimeToEffect; sustainability: number; requiresDoctor: boolean;
  projectedOutcome?: { variableLabel: string; currentValue: number; projected3Month: number; projected6Month: number; projected12Month: number; improvementPercent: number; };
  tradeoffs: { description: string; severity: 'minor' | 'moderate' | 'significant' }[];
  dailyPlan?: string; weeklyPlan?: string;
}

export interface DecisionAnalysis {
  primaryAction: HealthAction; rankedActions: HealthAction[];
  overallConfidence: number;
  safetyAlerts: { level: RiskLevel; message: string }[];
  summary: string;
}

export interface DayPlan { day: string; actions: { time: string; action: string; description: string }[]; }

function generateActions(): HealthAction[] {
  const baselines = computeBaselines();
  const actions: HealthAction[] = [];
  const sleepB = baselines.find(b => b.variableId === 'sleep_hours');
  const bpB = baselines.find(b => b.variableId === 'bp_systolic');
  const glucoseB = baselines.find(b => b.variableId === 'glucose');

  if (sleepB && sleepB.mean < 7) {
    actions.push({ id: 'act-sleep-earlier', title: 'Sleep 30 Minutes Earlier', description: `Your average sleep is ${sleepB.mean}h. Going to bed 30 min earlier can raise it to ${(sleepB.mean + 0.5).toFixed(1)}h within 2 weeks.`, type: 'lifestyle', targetsRootCause: 'sleep_hours', targetVariable: 'sleep_hours', expectedBenefit: 78, effort: 25, risk: 5, utility: 0, confidence: 85, timeToEffect: 'short', sustainability: 80, requiresDoctor: false, tradeoffs: [{ description: 'Less evening screen time', severity: 'minor' }, { description: 'May require adjusting family schedule', severity: 'minor' }], dailyPlan: 'Set 10 PM bedtime alarm. Screens off at 9:30 PM. Read or meditate for 15 min before sleep.' });
    actions.push({ id: 'act-no-caffeine', title: 'No Caffeine After 2 PM', description: 'Caffeine has a 6-hour half-life. Cutting it after 2 PM improves sleep onset and deep sleep quality.', type: 'behavioral', targetsRootCause: 'sleep_hours', targetVariable: 'sleep_hours', expectedBenefit: 65, effort: 20, risk: 3, utility: 0, confidence: 80, timeToEffect: 'immediate', sustainability: 90, requiresDoctor: false, tradeoffs: [{ description: 'Possible mild headache for first 3 days', severity: 'minor' }], dailyPlan: 'Switch to herbal tea or decaf after 2 PM. Last coffee no later than noon.' });
  }
  if (bpB && bpB.mean > 120) {
    actions.push({ id: 'act-reduce-salt', title: 'Reduce Salt to Under 5g/Day', description: `Your BP averages ${Math.round(bpB.mean)} mmHg. Reducing salt to 5g/day can lower BP by 8-12 mmHg.`, type: 'lifestyle', targetsRootCause: 'salt_intake', targetVariable: 'bp_systolic', expectedBenefit: 82, effort: 35, risk: 5, utility: 0, confidence: 90, timeToEffect: 'medium', sustainability: 75, requiresDoctor: false, tradeoffs: [{ description: 'Food may taste bland for 1-2 weeks', severity: 'minor' }, { description: 'Need to avoid pickles, papads, processed foods', severity: 'moderate' }], dailyPlan: 'Use 1/2 tsp salt for cooking. Replace with lemon, herbs, spices. Avoid pickles and packaged snacks.', weeklyPlan: 'Week 1: Track salt intake. Week 2: Switch to low-sodium alternatives. Week 3: Maintain and monitor BP.' });
    actions.push({ id: 'act-daily-walk', title: '30-Minute Daily Walk', description: 'Regular aerobic exercise lowers BP by 5-8 mmHg and improves cardiovascular health.', type: 'lifestyle', targetsRootCause: 'steps', targetVariable: 'bp_systolic', expectedBenefit: 75, effort: 40, risk: 8, utility: 0, confidence: 88, timeToEffect: 'medium', sustainability: 70, requiresDoctor: false, tradeoffs: [{ description: 'Requires 30 min daily time commitment', severity: 'moderate' }, { description: 'May cause initial muscle soreness', severity: 'minor' }], dailyPlan: 'Walk 15 min after breakfast + 15 min after dinner. Use phone pedometer to track steps.', weeklyPlan: 'Week 1: 15 min/day. Week 2: 20 min/day. Week 3: 25 min/day. Week 4: 30 min/day.' });
    actions.push({ id: 'act-meditation', title: '10-Minute Daily Meditation', description: 'Stress is a significant contributor to your elevated BP. Daily meditation reduces stress hormones and can lower BP by 3-5 mmHg.', type: 'behavioral', targetsRootCause: 'stress_level', targetVariable: 'bp_systolic', expectedBenefit: 62, effort: 20, risk: 2, utility: 0, confidence: 78, timeToEffect: 'short', sustainability: 85, requiresDoctor: false, tradeoffs: [{ description: 'May feel uncomfortable initially', severity: 'minor' }], dailyPlan: 'Use Aarogya Calm Mind Sanctuary. 10 min 4-7-8 breathing before lunch. Track mood before and after.' });
  }
  if (glucoseB && glucoseB.mean > 100) {
    actions.push({ id: 'act-cut-sugar', title: 'Cut Added Sugar to Under 25g/Day', description: `Your fasting glucose averages ${Math.round(glucoseB.mean)} mg/dL. Reducing sugar directly lowers glucose and improves insulin sensitivity.`, type: 'lifestyle', targetsRootCause: 'sugar_intake', targetVariable: 'glucose', expectedBenefit: 80, effort: 45, risk: 5, utility: 0, confidence: 87, timeToEffect: 'medium', sustainability: 65, requiresDoctor: false, tradeoffs: [{ description: 'Sugar cravings for first 5-7 days', severity: 'moderate' }, { description: 'Need to read labels on packaged foods', severity: 'minor' }], dailyPlan: 'No sweets, chocolates, or sugary drinks. Replace with fruits. Check labels for hidden sugar.', weeklyPlan: 'Week 1: Track all sugar. Week 2: Replace 1 sugary item daily. Week 3: Full target <25g/day.' });
    actions.push({ id: 'act-post-meal-walk', title: '10-Minute Walk After Each Meal', description: 'Walking after meals reduces post-meal glucose spikes by 20-30%. One of the most effective glucose control strategies.', type: 'behavioral', targetsRootCause: 'steps', targetVariable: 'glucose', expectedBenefit: 72, effort: 25, risk: 3, utility: 0, confidence: 85, timeToEffect: 'immediate', sustainability: 75, requiresDoctor: false, tradeoffs: [{ description: 'Need to walk within 30 min of eating', severity: 'minor' }], dailyPlan: '10-min walk after breakfast, lunch, and dinner. Total 30 min. Track with phone pedometer.' });
  }
  if (bpB && bpB.mean > 140) { actions.push({ id: 'act-consult-cardio', title: 'Consult a Cardiologist', description: `Your BP consistently averages ${Math.round(bpB.mean)} mmHg (Stage 2 Hypertension). Medical evaluation recommended.`, type: 'clinical', targetsRootCause: 'bp_systolic', targetVariable: 'bp_systolic', expectedBenefit: 90, effort: 50, risk: 10, utility: 0, confidence: 95, timeToEffect: 'medium', sustainability: 100, requiresDoctor: true, tradeoffs: [{ description: 'May require medication with potential side effects', severity: 'moderate' }, { description: 'Requires appointment time and cost', severity: 'moderate' }] }); }
  if (glucoseB && glucoseB.mean > 125) { actions.push({ id: 'act-consult-endo', title: 'Consult an Endocrinologist', description: `Your fasting glucose averages ${Math.round(glucoseB.mean)} mg/dL (diabetic range). Professional evaluation needed.`, type: 'clinical', targetsRootCause: 'glucose', targetVariable: 'glucose', expectedBenefit: 92, effort: 55, risk: 12, utility: 0, confidence: 95, timeToEffect: 'medium', sustainability: 100, requiresDoctor: true, tradeoffs: [{ description: 'May require medication or insulin', severity: 'significant' }, { description: 'Requires ongoing monitoring', severity: 'moderate' }] }); }

  // Compute utility + simulate
  actions.forEach(a => {
    a.utility = Math.round(Math.max(0, a.expectedBenefit - a.effort * 0.4 - a.risk * 0.6));
    const twinMap: Record<string, string> = { 'act-daily-walk': 'exercise', 'act-sleep-earlier': 'sleep', 'act-reduce-salt': 'diet', 'act-cut-sugar': 'diet', 'act-meditation': 'stress', 'act-post-meal-walk': 'exercise' };
    const tk = twinMap[a.id];
    if (tk) { try { const sim = runTwinSimulation(tk as any); const ro = sim.projectedOutcomes.find(o => o.variableId === a.targetVariable); if (ro) { a.projectedOutcome = { variableLabel: ro.variableLabel, currentValue: ro.currentValue, projected3Month: ro.projectedValue3Month, projected6Month: ro.projectedValue6Month, projected12Month: ro.projectedValue12Month, improvementPercent: ro.riskReduction }; } } catch {} }
  });
  return actions.sort((a, b) => b.utility - a.utility);
}

export function analyzeDecisions(): DecisionAnalysis {
  const actions = generateActions();
  if (actions.length === 0) return { primaryAction: { id: 'none', title: 'No Actions Needed', description: 'Your health metrics are within normal range.', type: 'lifestyle', targetsRootCause: '', targetVariable: '', expectedBenefit: 0, effort: 0, risk: 0, utility: 0, confidence: 100, timeToEffect: 'long', sustainability: 100, requiresDoctor: false, tradeoffs: [] }, rankedActions: [], overallConfidence: 95, safetyAlerts: [{ level: 'minimal', message: 'All health metrics are within normal range.' }], summary: 'Your health metrics look good. Continue your current healthy habits.' };
  const primary = actions[0]; const ranked = actions.slice(1);
  const safetyAlerts: { level: RiskLevel; message: string }[] = [];
  actions.filter(a => a.requiresDoctor).forEach(a => safetyAlerts.push({ level: 'high', message: `${a.title}: ${a.description} This requires professional medical evaluation.` }));
  const avgConf = Math.round(actions.reduce((s, a) => s + a.confidence, 0) / actions.length);
  const summary = `Your highest-impact action is "${primary.title}" (Utility: ${primary.utility}/100). ${primary.description} ${actions.length} personalized actions available.`;
  return { primaryAction: primary, rankedActions: ranked, overallConfidence: avgConf, safetyAlerts, summary };
}

export function generateWeeklyPlan(actions: HealthAction[]): DayPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const top = actions.slice(0, 4);
  return days.map((day, i) => {
    const acts: DayPlan['actions'] = [];
    if (top[0]?.dailyPlan) acts.push({ time: '7:00 AM', action: top[0].title, description: top[0].dailyPlan.split('.')[0] + '.' });
    if (top[1]?.dailyPlan && i % 2 === 0) acts.push({ time: '1:00 PM', action: top[1].title, description: top[1].dailyPlan.split('.')[0] + '.' });
    if (top[2]?.dailyPlan) acts.push({ time: '6:00 PM', action: top[2].title, description: top[2].dailyPlan.split('.')[0] + '.' });
    if (top[3]?.dailyPlan) acts.push({ time: '9:30 PM', action: top[3].title, description: top[3].dailyPlan.split('.')[0] + '.' });
    return { day, actions: acts };
  });
}
