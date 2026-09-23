// ============================================
// AAROGYA AI — TEMPORAL HEALTH ENGINE
// Personal Health Timeline & Digital Twin System
// ============================================

export interface TimeSeriesPoint { timestamp: number; value: number; source?: string; }
export interface VariableHistory { variableId: string; label: string; unit: string; normalRange: [number, number]; data: TimeSeriesPoint[]; }
export interface PersonalBaseline { variableId: string; label: string; mean: number; stdDev: number; trend: 'increasing' | 'stable' | 'decreasing'; slope: number; personalNormalRange: [number, number]; populationNormalRange: [number, number]; lastUpdated: number; confidence: number; }
export interface TrajectoryPrediction { variableId: string; label: string; currentValue: number; predictions: { timeframe: string; predictedValue: number; confidenceLower: number; confidenceUpper: number; riskLevel: 'low' | 'moderate' | 'high'; changePercent: number; }[]; trendDirection: 'improving' | 'stable' | 'worsening'; confidence: number; }
export interface HealthEvent { id: string; timestamp: number; variableId: string; variableLabel: string; type: 'sudden_change' | 'trend_reversal' | 'phase_transition' | 'anomaly'; description: string; severity: 'info' | 'warning' | 'critical'; valueBefore: number; valueAfter: number; changePercent: number; }
export interface TwinSimulation { intervention: { variableId: string; variableLabel: string; changeDescription: string; changeAmount: number; }; projectedOutcomes: { variableId: string; variableLabel: string; currentValue: number; projectedValue3Month: number; projectedValue6Month: number; projectedValue12Month: number; riskReduction: number; unit: string; }[]; summary: string; confidence: number; }

function generateTimeSeries(base: number, trend: number, noise: number, days = 90): TimeSeriesPoint[] {
  const pts: TimeSeriesPoint[] = []; const now = Date.now();
  for (let i = days; i >= 0; i--) { const ts = now - i * 86400000; const tr = trend * (days - i) / days; const nz = (Math.sin(i * 0.3) + Math.cos(i * 0.17)) * noise * 0.5; pts.push({ timestamp: ts, value: Math.round((base + tr + nz) * 10) / 10, source: i % 7 === 0 ? 'lab' : 'wearable' }); }
  return pts;
}

const HISTORIES: VariableHistory[] = [
  { variableId: 'bp_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', normalRange: [90, 120], data: generateTimeSeries(135, 8, 5) },
  { variableId: 'glucose', label: 'Fasting Glucose', unit: 'mg/dL', normalRange: [70, 100], data: generateTimeSeries(100, 8, 4) },
  { variableId: 'sleep_hours', label: 'Sleep Duration', unit: 'hrs', normalRange: [7, 9], data: generateTimeSeries(6.8, -1.2, 0.6) },
  { variableId: 'steps', label: 'Daily Steps', unit: 'steps', normalRange: [8000, 15000], data: generateTimeSeries(7500, -1500, 1200) },
  { variableId: 'heart_rate', label: 'Resting Heart Rate', unit: 'BPM', normalRange: [60, 100], data: generateTimeSeries(72, 6, 3) },
  { variableId: 'hba1c', label: 'HbA1c', unit: '%', normalRange: [4, 5.7], data: generateTimeSeries(5.4, 0.5, 0.1) },
];

export function computeBaselines(): PersonalBaseline[] {
  return HISTORIES.map(vh => {
    const vals = vh.data.map(d => d.value); const n = vals.length;
    const mean = vals.reduce((s, v) => s + v, 0) / n;
    const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    const ts = vh.data.map(d => d.timestamp); const tMean = ts.reduce((s, t) => s + t, 0) / n;
    const slope = vals.reduce((s, v, i) => s + (ts[i] - tMean) * (v - mean), 0) / ts.reduce((s, t) => s + (t - tMean) ** 2, 0);
    const dailySlope = slope * 86400000;
    const trend: PersonalBaseline['trend'] = Math.abs(dailySlope) < 0.01 ? 'stable' : dailySlope > 0 ? 'increasing' : 'decreasing';
    return { variableId: vh.variableId, label: vh.label, mean: Math.round(mean * 10) / 10, stdDev: Math.round(stdDev * 10) / 10, trend, slope: Math.round(dailySlope * 1000) / 1000, personalNormalRange: [Math.round((mean - stdDev) * 10) / 10, Math.round((mean + stdDev) * 10) / 10], populationNormalRange: vh.normalRange, lastUpdated: Date.now(), confidence: Math.min(95, Math.round(40 + n * 0.6)) };
  });
}

export function predictTrajectories(): TrajectoryPrediction[] {
  const baselines = computeBaselines();
  return HISTORIES.map((vh, idx) => {
    const bl = baselines[idx]; const cur = vh.data[vh.data.length - 1].value; const ds = bl.slope;
    const tfs = [{ days: 90, label: '3 months' }, { days: 180, label: '6 months' }, { days: 365, label: '12 months' }];
    const preds = tfs.map(tf => {
      const proj = cur + ds * tf.days; const unc = bl.stdDev * Math.sqrt(tf.days / 30);
      const cl = proj - unc * 1.96; const cu = proj + unc * 1.96;
      const cp = Math.round(((proj - cur) / cur) * 100);
      const [nl, nh] = vh.normalRange;
      let rl: 'low' | 'moderate' | 'high' = 'low';
      if (proj < nl * 0.8 || proj > nh * 1.2) rl = 'high'; else if (proj < nl * 0.9 || proj > nh * 1.1) rl = 'moderate';
      return { timeframe: tf.label, predictedValue: Math.round(proj * 10) / 10, confidenceLower: Math.round(cl * 10) / 10, confidenceUpper: Math.round(cu * 10) / 10, riskLevel: rl, changePercent: cp };
    });
    const td: TrajectoryPrediction['trendDirection'] = bl.trend === 'stable' ? 'stable' : (vh.variableId === 'sleep_hours' || vh.variableId === 'steps') ? (bl.trend === 'decreasing' ? 'worsening' : 'improving') : (bl.trend === 'increasing' ? 'worsening' : 'improving');
    return { variableId: vh.variableId, label: vh.label, currentValue: Math.round(cur * 10) / 10, predictions: preds, trendDirection: td, confidence: bl.confidence };
  });
}

export function detectEvents(): HealthEvent[] {
  const events: HealthEvent[] = []; const baselines = computeBaselines();
  HISTORIES.forEach((vh, idx) => {
    const bl = baselines[idx]; const data = vh.data;
    for (let i = 1; i < data.length; i++) {
      const ch = Math.abs(data[i].value - data[i - 1].value);
      if (ch > bl.stdDev * 2) { events.push({ id: `evt-${vh.variableId}-${i}`, timestamp: data[i].timestamp, variableId: vh.variableId, variableLabel: vh.label, type: 'sudden_change', description: `${vh.label} changed by ${Math.round(ch * 10) / 10} ${vh.unit} in one day`, severity: ch > bl.stdDev * 3 ? 'critical' : 'warning', valueBefore: data[i - 1].value, valueAfter: data[i].value, changePercent: Math.round((ch / data[i - 1].value) * 100) }); }
    }
    for (let i = 1; i < data.length; i++) {
      const [lo, hi] = vh.normalRange; const wasN = data[i - 1].value >= lo && data[i - 1].value <= hi; const isAb = data[i].value < lo || data[i].value > hi;
      if (wasN && isAb) { events.push({ id: `ph-${vh.variableId}-${i}`, timestamp: data[i].timestamp, variableId: vh.variableId, variableLabel: vh.label, type: 'phase_transition', description: `${vh.label} crossed from normal to abnormal (${data[i].value} ${vh.unit})`, severity: 'warning', valueBefore: data[i - 1].value, valueAfter: data[i].value, changePercent: Math.round(((data[i].value - data[i - 1].value) / data[i - 1].value) * 100) }); }
    }
  });
  return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}

const INTERVENTIONS: Record<string, { targets: { variableId: string; dailyEffect: number }[]; description: string }> = {
  exercise: { targets: [{ variableId: 'bp_systolic', dailyEffect: -0.08 }, { variableId: 'glucose', dailyEffect: -0.05 }, { variableId: 'steps', dailyEffect: 30 }, { variableId: 'heart_rate', dailyEffect: -0.02 }], description: '30 min daily exercise' },
  sleep: { targets: [{ variableId: 'sleep_hours', dailyEffect: 0.03 }, { variableId: 'bp_systolic', dailyEffect: -0.05 }, { variableId: 'glucose', dailyEffect: -0.03 }, { variableId: 'heart_rate', dailyEffect: -0.02 }], description: 'Sleep 8 hours nightly' },
  diet: { targets: [{ variableId: 'glucose', dailyEffect: -0.08 }, { variableId: 'hba1c', dailyEffect: -0.002 }, { variableId: 'bp_systolic', dailyEffect: -0.04 }], description: 'Low-sugar, low-salt diet' },
  stress: { targets: [{ variableId: 'bp_systolic', dailyEffect: -0.06 }, { variableId: 'heart_rate', dailyEffect: -0.04 }, { variableId: 'sleep_hours', dailyEffect: 0.02 }], description: 'Daily 10-min meditation' },
};

export function runTwinSimulation(type: keyof typeof INTERVENTIONS): TwinSimulation {
  const iv = INTERVENTIONS[type]; const baselines = computeBaselines(); const trajectories = predictTrajectories();
  const outcomes = iv.targets.map(t => {
    const bl = baselines.find(b => b.variableId === t.variableId)!; const tr = trajectories.find(p => p.variableId === t.variableId)!;
    const cur = tr.currentValue; const p3 = cur + t.dailyEffect * 90; const p6 = cur + t.dailyEffect * 180; const p12 = cur + t.dailyEffect * 365;
    const [nl, nh] = bl.populationNormalRange;
    const cd = Math.max(0, cur - nh) + Math.max(0, nl - cur); const pd = Math.max(0, p12 - nh) + Math.max(0, nl - p12);
    const rr = cd > 0 ? Math.round(((cd - pd) / cd) * 100) : 0;
    return { variableId: t.variableId, variableLabel: bl.label, currentValue: Math.round(cur * 10) / 10, projectedValue3Month: Math.round(p3 * 10) / 10, projectedValue6Month: Math.round(p6 * 10) / 10, projectedValue12Month: Math.round(p12 * 10) / 10, riskReduction: Math.max(0, rr), unit: bl.populationNormalRange[0] === bl.populationNormalRange[0] ? '' : '' };
  });
  const sig = outcomes.filter(o => o.riskReduction > 0);
  const summary = `${iv.description} is projected to ${sig.length > 0 ? `reduce risk in ${sig.length} variable${sig.length > 1 ? 's' : ''} by up to ${Math.max(...sig.map(e => e.riskReduction))}% over 12 months` : 'maintain current health status'}.`;
  return { intervention: { variableId: type, variableLabel: iv.description, changeDescription: iv.description, changeAmount: 1 }, projectedOutcomes: outcomes, summary, confidence: Math.round(65 + sig.length * 8) };
}

export function getVariableHistories() { return HISTORIES; }
export function getInterventionTypes() { return Object.entries(INTERVENTIONS).map(([k, v]) => ({ id: k, label: v.description })); }
