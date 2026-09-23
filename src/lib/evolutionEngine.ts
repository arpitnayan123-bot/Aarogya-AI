// ============================================
// AAROGYA AI — AUTONOMOUS LEARNING & EVOLUTION ENGINE (ALEE)
// Continuous self-improvement, adaptation, and intelligence evolution.
//
// Learning Loop: Prediction → Outcome → Error → Learning → Update
//
// Memory: Personal (user-specific) + Global (cross-user)
// Methods: Reinforcement + Continual + Self-supervised (JEPA-based)
// Self-correction: detect incorrect predictions, adjust reasoning
// Safety: validate before updating, maintain clinical alignment
// ============================================

// --- Types ---

export interface LearningEvent {
  id: string;
  timestamp: number;
  type: 'prediction' | 'decision' | 'intervention' | 'correction';
  description: string;
  prediction: string;
  outcome: string;
  error: number;           // 0 = perfect, 1 = completely wrong
  learned: string;         // what was learned
  modelUpdated: string;    // which model was updated
  confidenceBefore: number;
  confidenceAfter: number;
}

export interface PersonalMemory {
  userId: string;
  patterns: {
    id: string;
    pattern: string;
    frequency: number;       // how often observed
    confidence: number;
    lastSeen: number;
    category: 'behavior' | 'physiological' | 'response' | 'trigger';
  }[];
  interventionResponses: {
    intervention: string;
    attempted: number;
    successful: number;
    avgImprovement: number;  // % improvement when successful
    lastAttempt: number;
    learningNote: string;
  }[];
  behavioralProfile: {
    adherenceScore: number;    // how well user follows recommendations
    bestResponseTime: string;  // when user is most responsive
    preferredActions: string[];
    avoidancePatterns: string[];
  };
  totalDataPoints: number;
  memoryAge: number;           // days since first data
  modelVersion: number;
}

export interface GlobalMemory {
  patterns: {
    id: string;
    pattern: string;
    populationFreq: number;    // % of users showing this pattern
    clinicalSignificance: string;
    confidence: number;
    discoveredAt: number;
  }[];
  crossUserInsights: {
    insight: string;
    evidenceCount: number;
    applicableTo: string;      // which user profiles
    confidence: number;
  }[];
  populationBaselines: {
    variable: string;
    mean: number;
    stdDev: number;
    sampleSize: number;
  }[];
  totalUsers: number;
  totalLearnings: number;
}

export interface ModelEvolution {
  modelId: string;
  modelName: string;
  version: string;
  accuracyHistory: { date: string; accuracy: number }[];
  currentAccuracy: number;
  previousAccuracy: number;
  improvement: number;
  updatesApplied: number;
  lastUpdate: number;
  changes: { description: string; impact: string; date: number }[];
}

export interface SelfCorrection {
  id: string;
  timestamp: number;
  incorrectPrediction: string;
  whatWentWrong: string;
  rootCause: string;
  correctionApplied: string;
  reasoningPathwayAdjusted: string;
  expectedImprovement: string;
  validated: boolean;
}

export interface PerformanceMetric {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'improving' | 'stable' | 'declining';
  history: number[];
  target: number;
  unit: string;
}

export interface DigitalIntuition {
  id: string;
  pattern: string;
  description: string;
  detectedFrom: string;      // what data revealed this
  confidence: number;
  actionable: boolean;
  clinicalRelevance: string;
  novelty: 'known' | 'emerging' | 'novel';
}

export interface SafetyCheck {
  id: string;
  timestamp: number;
  proposedChange: string;
  riskAssessment: 'safe' | 'caution' | 'blocked';
  clinicalAlignment: boolean;
  biasCheck: 'passed' | 'warning' | 'failed';
  driftCheck: 'stable' | 'minor' | 'significant';
  decision: 'approved' | 'rejected' | 'pending_review';
  notes: string;
}

export interface ALEEAnalysis {
  learningEvents: LearningEvent[];
  personalMemory: PersonalMemory;
  globalMemory: GlobalMemory;
  modelEvolutions: ModelEvolution[];
  selfCorrections: SelfCorrection[];
  performanceMetrics: PerformanceMetric[];
  digitalIntuitions: DigitalIntuition[];
  safetyChecks: SafetyCheck[];
  systemStats: {
    totalLearningEvents: number;
    modelsEvolved: number;
    avgAccuracyGain: number;
    selfCorrectionsApplied: number;
    patternsLearned: number;
    safetyBlocks: number;
    systemAge: number;
    intelligenceLevel: number;  // 0-100, overall system intelligence
  };
  evolutionSummary: string;
}

// ============================================
// DATA GENERATION
// ============================================

const now = Date.now();
const day = 86400000;

export function analyzeEvolution(): ALEEAnalysis {
  return {
    learningEvents: generateLearningEvents(),
    personalMemory: generatePersonalMemory(),
    globalMemory: generateGlobalMemory(),
    modelEvolutions: generateModelEvolutions(),
    selfCorrections: generateSelfCorrections(),
    performanceMetrics: generatePerformanceMetrics(),
    digitalIntuitions: generateDigitalIntuitions(),
    safetyChecks: generateSafetyChecks(),
    systemStats: {
      totalLearningEvents: 1247,
      modelsEvolved: 5,
      avgAccuracyGain: 12.4,
      selfCorrectionsApplied: 23,
      patternsLearned: 89,
      safetyBlocks: 4,
      systemAge: 94,
      intelligenceLevel: 82,
    },
    evolutionSummary: 'System has improved prediction accuracy by 12.4% over 94 days through 1,247 learning events. 23 self-corrections applied. 89 behavioral patterns learned. All model updates passed safety validation.',
  };
}

function generateLearningEvents(): LearningEvent[] {
  return [
    { id: 'le-1', timestamp: now - 2 * 3600000, type: 'prediction', description: 'BP prediction calibrated based on outcome verification', prediction: 'BP would reach 142/92 in 7 days', outcome: 'BP reached 145/93 in 12 days', error: 0.15, learned: 'User\'s BP responds to stress faster than population average — adjusted stress-to-BP causal weight from 0.65 to 0.72', modelUpdated: 'Causal Engine v2.0 → v2.1', confidenceBefore: 78, confidenceAfter: 82 },
    { id: 'le-2', timestamp: now - 6 * 3600000, type: 'intervention', description: 'Sleep intervention effectiveness learned', prediction: 'Sleep 30 min earlier → 0.5h increase', outcome: 'Actual increase: 0.3h (user compliance 60%)', error: 0.40, learned: 'User compliance for sleep interventions is 60% — adjusted adherence factor in Decision Engine. Future recommendations will include compliance-matched targets.', modelUpdated: 'Decision Engine v1.0 → v1.1', confidenceBefore: 80, confidenceAfter: 85 },
    { id: 'le-3', timestamp: now - 12 * 3600000, type: 'correction', description: 'Glucose prediction model corrected', prediction: 'Glucose would reach 115 mg/dL in 5 days', outcome: 'Glucose reached 112 mg/dL (lower than predicted)', error: 0.25, learned: 'User\'s insulin sensitivity is higher than inferred — adjusted HOMA-IR estimate from 2.8 to 2.5. User responds to sleep improvements faster than average for glucose control.', modelUpdated: 'Trajectory Model v2.0 → v2.1', confidenceBefore: 75, confidenceAfter: 80 },
    { id: 'le-4', timestamp: now - day, type: 'decision', description: 'Salt reduction recommendation validated', prediction: 'Reduce salt → BP drops 8-12 mmHg in 2 weeks', outcome: 'BP dropped 6 mmHg in 2 weeks (lower range)', error: 0.33, learned: 'User\'s salt sensitivity is moderate (not high). Adjusted salt-to-BP causal weight from 0.70 to 0.62. Future salt recommendations will include moderate-sensitivity guidance.', modelUpdated: 'Causal Engine v2.1 → v2.2', confidenceBefore: 85, confidenceAfter: 88 },
    { id: 'le-5', timestamp: now - 2 * day, type: 'prediction', description: 'HRV decline prediction confirmed', prediction: 'HRV would drop below 35ms in 5 days', outcome: 'HRV reached 32ms in 4 days', error: 0.10, learned: 'HRV decline model is accurate for this user. Strengthened sleep→stress→HRV causal chain confidence from 0.80 to 0.85.', modelUpdated: 'Continuous Intelligence v1.0 → v1.1', confidenceBefore: 80, confidenceAfter: 85 },
    { id: 'le-6', timestamp: now - 3 * day, type: 'intervention', description: 'Meditation intervention response learned', prediction: '10-min meditation → stress reduction 15-20%', outcome: 'Actual stress reduction: 12%', error: 0.30, learned: 'User responds to meditation but less than average. Adjusted expected impact from 17.5% to 12%. Recommend longer sessions (15 min) for this user.', modelUpdated: 'Decision Engine v1.1 → v1.2', confidenceBefore: 78, confidenceAfter: 82 },
  ];
}

function generatePersonalMemory(): PersonalMemory {
  return {
    userId: 'user-guest',
    patterns: [
      { id: 'p1', pattern: 'BP spikes on Mondays (work stress onset)', frequency: 8, confidence: 88, lastSeen: now - day, category: 'trigger' },
      { id: 'p2', pattern: 'Glucose lower on weekends (more walking, less stress)', frequency: 12, confidence: 92, lastSeen: now - 2 * day, category: 'behavior' },
      { id: 'p3', pattern: 'Sleep quality drops after 10 PM screen time', frequency: 15, confidence: 95, lastSeen: now, category: 'behavior' },
      { id: 'p4', pattern: 'HRV improves 15% day after 8000+ steps', frequency: 6, confidence: 80, lastSeen: now - 2 * day, category: 'response' },
      { id: 'p5', pattern: 'Stress peaks at 3 PM (work deadline pattern)', frequency: 10, confidence: 85, lastSeen: now - day, category: 'trigger' },
      { id: 'p6', pattern: 'Salt intake higher on festival days', frequency: 3, confidence: 70, lastSeen: now - 7 * day, category: 'behavior' },
    ],
    interventionResponses: [
      { intervention: '30-min daily walk', attempted: 12, successful: 8, avgImprovement: 7.5, lastAttempt: now - day, learningNote: 'User achieves 60% compliance. Best on weekdays. Weekends skipped.' },
      { intervention: 'Sleep 30 min earlier', attempted: 10, successful: 6, avgImprovement: 0.3, lastAttempt: now - 2 * day, learningNote: '60% compliance. Works when alarm set. Fails on social evenings.' },
      { intervention: 'Reduce salt', attempted: 8, successful: 5, avgImprovement: 4.2, lastAttempt: now - 3 * day, learningNote: '62% compliance. Easier when cooking at home. Harder when eating out.' },
      { intervention: '10-min meditation', attempted: 6, successful: 4, avgImprovement: 12.0, lastAttempt: now - day, learningNote: '67% compliance. Best in morning. User reports difficulty focusing at night.' },
      { intervention: 'Post-meal walk', attempted: 5, successful: 3, avgImprovement: 9.5, lastAttempt: now - 2 * day, learningNote: '60% compliance. Works after lunch but not dinner (too tired).' },
    ],
    behavioralProfile: {
      adherenceScore: 62,
      bestResponseTime: 'Morning (7-9 AM)',
      preferredActions: ['Walking', 'Breathing exercises', 'Dietary changes'],
      avoidancePatterns: ['Late-night exercise', 'Complex meal prep', 'Multiple simultaneous changes'],
    },
    totalDataPoints: 847,
    memoryAge: 94,
    modelVersion: 7,
  };
}

function generateGlobalMemory(): GlobalMemory {
  return {
    patterns: [
      { id: 'g1', pattern: 'Indian adults show 2.3x higher salt sensitivity than Western populations', populationFreq: 68, clinicalSignificance: 'Salt reduction more effective for BP in Indian users', confidence: 92, discoveredAt: now - 30 * day },
      { id: 'g2', pattern: 'Sleep onset before 11 PM reduces morning glucose by 8-12 mg/dL', populationFreq: 74, clinicalSignificance: 'Early sleep is a primary intervention for prediabetes', confidence: 88, discoveredAt: now - 45 * day },
      { id: 'g3', pattern: 'HRV below 35ms predicts cardiac events within 90 days (Indian adults)', populationFreq: 15, clinicalSignificance: 'Critical threshold for clinical escalation', confidence: 85, discoveredAt: now - 60 * day },
      { id: 'g4', pattern: 'Festival days show 40% increase in sugar + salt intake across all users', populationFreq: 82, clinicalSignificance: 'Pre-festival interventions can prevent BP/glucose spikes', confidence: 90, discoveredAt: now - 20 * day },
    ],
    crossUserInsights: [
      { insight: 'Users who log vitals within 1 hour of waking show 3x better adherence to treatment plans', evidenceCount: 156, applicableTo: 'All users with <70% adherence score', confidence: 87 },
      { insight: 'Morning meditation is 40% more effective than evening meditation for stress reduction', evidenceCount: 203, applicableTo: 'Users with stress >50/100', confidence: 89 },
      { insight: 'Users with social support (family using Aarogya) show 2.5x better outcomes', evidenceCount: 89, applicableTo: 'Users considering family health network', confidence: 82 },
      { insight: 'Post-meal walks reduce glucose by 22% on average — most effective single intervention', evidenceCount: 312, applicableTo: 'All prediabetic/diabetic users', confidence: 91 },
    ],
    populationBaselines: [
      { variable: 'BP Systolic (mmHg)', mean: 128, stdDev: 15, sampleSize: 700 },
      { variable: 'Fasting Glucose (mg/dL)', mean: 105, stdDev: 22, sampleSize: 700 },
      { variable: 'Sleep (hours)', mean: 6.4, stdDev: 1.2, sampleSize: 700 },
      { variable: 'HRV (ms)', mean: 42, stdDev: 14, sampleSize: 700 },
      { variable: 'Steps (daily)', mean: 6800, stdDev: 2400, sampleSize: 700 },
    ],
    totalUsers: 700,
    totalLearnings: 3421,
  };
}

function generateModelEvolutions(): ModelEvolution[] {
  return [
    {
      modelId: 'causal', modelName: 'Causal Reasoning Engine', version: 'v2.2',
      accuracyHistory: [
        { date: 'Day 1', accuracy: 72 }, { date: 'Day 30', accuracy: 76 }, { date: 'Day 60', accuracy: 80 }, { date: 'Day 90', accuracy: 85 },
      ],
      currentAccuracy: 85, previousAccuracy: 80, improvement: 13,
      updatesApplied: 4, lastUpdate: now - day,
      changes: [
        { description: 'Adjusted stress→BP weight: 0.65→0.72', impact: 'Improved BP prediction accuracy by 3%', date: now - day },
        { description: 'Adjusted salt→BP weight: 0.70→0.62', impact: 'Better personalized salt sensitivity', date: now - 2 * day },
        { description: 'Strengthened sleep→stress→HRV chain confidence', impact: 'Earlier HRV decline detection', date: now - 5 * day },
      ],
    },
    {
      modelId: 'trajectory', modelName: 'Trajectory Prediction Model', version: 'v2.1',
      accuracyHistory: [
        { date: 'Day 1', accuracy: 68 }, { date: 'Day 30', accuracy: 73 }, { date: 'Day 60', accuracy: 77 }, { date: 'Day 90', accuracy: 80 },
      ],
      currentAccuracy: 80, previousAccuracy: 77, improvement: 12,
      updatesApplied: 3, lastUpdate: now - 12 * 3600000,
      changes: [
        { description: 'Adjusted HOMA-IR estimate: 2.8→2.5', impact: 'More accurate glucose trajectory', date: now - 12 * 3600000 },
        { description: 'Added compliance factor (0.6)', impact: 'Predictions now account for user adherence', date: now - 7 * day },
      ],
    },
    {
      modelId: 'decision', modelName: 'Decision Intelligence Engine', version: 'v1.2',
      accuracyHistory: [
        { date: 'Day 1', accuracy: 70 }, { date: 'Day 30', accuracy: 74 }, { date: 'Day 60', accuracy: 78 }, { date: 'Day 90', accuracy: 82 },
      ],
      currentAccuracy: 82, previousAccuracy: 78, improvement: 12,
      updatesApplied: 5, lastUpdate: now - day,
      changes: [
        { description: 'Adjusted meditation expected impact: 17.5%→12%', impact: 'More realistic intervention predictions', date: now - day },
        { description: 'Added adherence-matched targets', impact: 'Recommendations match user compliance level', date: now - 3 * day },
      ],
    },
    {
      modelId: 'continuous', modelName: 'Continuous Intelligence Engine', version: 'v1.1',
      accuracyHistory: [
        { date: 'Day 1', accuracy: 74 }, { date: 'Day 30', accuracy: 78 }, { date: 'Day 60', accuracy: 81 }, { date: 'Day 90', accuracy: 84 },
      ],
      currentAccuracy: 84, previousAccuracy: 81, improvement: 10,
      updatesApplied: 2, lastUpdate: now - 2 * day,
      changes: [
        { description: 'Strengthened HRV decline detection threshold', impact: 'Earlier warning (5→7 days ahead)', date: now - 2 * day },
      ],
    },
    {
      modelId: 'trust', modelName: 'Clinical Trust Engine', version: 'v1.0',
      accuracyHistory: [
        { date: 'Day 1', accuracy: 80 }, { date: 'Day 30', accuracy: 82 }, { date: 'Day 60', accuracy: 84 }, { date: 'Day 90', accuracy: 86 },
      ],
      currentAccuracy: 86, previousAccuracy: 84, improvement: 6,
      updatesApplied: 1, lastUpdate: now - 5 * day,
      changes: [
        { description: 'Added historical accuracy weighting to confidence calculation', impact: 'More reliable confidence scores', date: now - 5 * day },
      ],
    },
  ];
}

function generateSelfCorrections(): SelfCorrection[] {
  return [
    {
      id: 'sc-1', timestamp: now - 3 * day,
      incorrectPrediction: 'Glucose would reach 115 mg/dL in 5 days',
      whatWentWrong: 'Overestimated insulin resistance (HOMA-IR inferred at 2.8, actual closer to 2.5)',
      rootCause: 'Inference relied on BMI + sugar intake without fasting insulin lab data',
      correctionApplied: 'Adjusted HOMA-IR estimate from 2.8 to 2.5. Added uncertainty flag when fasting insulin is not available.',
      reasoningPathwayAdjusted: 'Latent inference → insulin resistance → glucose trajectory',
      expectedImprovement: 'Glucose predictions should be within ±3 mg/dL instead of ±7 mg/dL',
      validated: true,
    },
    {
      id: 'sc-2', timestamp: now - 7 * day,
      incorrectPrediction: 'Sleep intervention would increase sleep by 0.5h',
      whatWentWrong: 'Overestimated user compliance (predicted 80%, actual 60%)',
      rootCause: 'Compliance model used population average instead of user-specific adherence',
      correctionApplied: 'Added user-specific adherence factor (0.6). Future predictions multiply expected benefit by adherence score.',
      reasoningPathwayAdjusted: 'Decision Engine → intervention impact → predicted outcome',
      expectedImprovement: 'Intervention predictions will be 40% more accurate for this user',
      validated: true,
    },
    {
      id: 'sc-3', timestamp: now - 14 * day,
      incorrectPrediction: 'Salt reduction would lower BP by 10 mmHg',
      whatWentWrong: 'Assumed high salt sensitivity (actual: moderate)',
      rootCause: 'Applied population-level salt sensitivity without personalization',
      correctionApplied: 'Updated salt-to-BP causal weight from 0.70 to 0.62. Added personalization step in causal weight assignment.',
      reasoningPathwayAdjusted: 'Causal Engine → salt intake → BP systolic',
      expectedImprovement: 'BP predictions accounting for salt will be within ±2 mmHg',
      validated: true,
    },
  ];
}

function generatePerformanceMetrics(): PerformanceMetric[] {
  return [
    { metric: 'Prediction Accuracy', currentValue: 82, previousValue: 72, trend: 'improving', history: [72, 74, 76, 78, 80, 82], target: 90, unit: '%' },
    { metric: 'Decision Success Rate', currentValue: 76, previousValue: 65, trend: 'improving', history: [65, 68, 70, 72, 74, 76], target: 85, unit: '%' },
    { metric: 'User Outcome Improvement', currentValue: 38, previousValue: 22, trend: 'improving', history: [22, 26, 30, 33, 36, 38], target: 50, unit: '%' },
    { metric: 'Early Detection Rate', currentValue: 71, previousValue: 55, trend: 'improving', history: [55, 58, 62, 66, 69, 71], target: 80, unit: '%' },
    { metric: 'False Positive Rate', currentValue: 12, previousValue: 18, trend: 'improving', history: [18, 16, 15, 14, 13, 12], target: 8, unit: '%' },
    { metric: 'Model Confidence', currentValue: 78, previousValue: 68, trend: 'improving', history: [68, 71, 73, 75, 77, 78], target: 85, unit: '%' },
  ];
}

function generateDigitalIntuitions(): DigitalIntuition[] {
  return [
    {
      id: 'di-1',
      pattern: 'Monday BP spikes correlate with Sunday night sleep disruption',
      description: 'System detected that BP is consistently 8-12 mmHg higher on Mondays. Root cause traced to Sunday night sleep pattern (user sleeps later on weekends, disrupting circadian rhythm for Monday).',
      detectedFrom: '90-day BP + sleep data cross-correlation analysis',
      confidence: 88,
      actionable: true,
      clinicalRelevance: 'Social jetlag (weekend sleep shift) is a recognized contributor to Monday cardiovascular events. ICMR data shows 23% of MI admissions occur on Mondays.',
      novelty: 'emerging',
    },
    {
      id: 'di-2',
      pattern: 'Stress accumulation has 4-day lag before BP manifestation',
      description: 'System learned that stress spikes don\'t immediately raise BP — there\'s a 4-day delay. This means current BP elevation may reflect stress from 4 days ago, not today.',
      detectedFrom: 'Cross-correlation of daily stress index with BP readings at various lags',
      confidence: 82,
      actionable: true,
      clinicalRelevance: 'Delayed stress-BP coupling means interventions should target stress patterns, not single spikes. Supports sustained stress management over acute relaxation.',
      novelty: 'novel',
    },
    {
      id: 'di-3',
      pattern: 'Glucose response to sleep improvement is faster than to diet change',
      description: 'When user improves sleep, glucose drops within 2 days. When user changes diet, glucose takes 7-10 days to respond. Sleep intervention should be prioritized for faster glucose control.',
      detectedFrom: 'Intervention response tracking (sleep vs diet interventions with glucose outcomes)',
      confidence: 85,
      actionable: true,
      clinicalRelevance: 'Challenges conventional clinical guidance that prioritizes diet for glucose control. Sleep may be a faster-acting lever for this user phenotype.',
      novelty: 'novel',
    },
    {
      id: 'di-4',
      pattern: 'User\'s HRV is most predictive of next-day BP (r=0.72)',
      description: 'Today\'s HRV is a stronger predictor of tomorrow\'s BP than today\'s BP itself. This suggests autonomic nervous system state precedes BP manifestation.',
      detectedFrom: 'Lagged correlation analysis across HRV, BP, stress, and sleep variables',
      confidence: 80,
      actionable: true,
      clinicalRelevance: 'HRV monitoring may enable pre-emptive BP management. If HRV drops, intervene before BP rises.',
      novelty: 'emerging',
    },
  ];
}

function generateSafetyChecks(): SafetyCheck[] {
  return [
    {
      id: 'sf-1', timestamp: now - day,
      proposedChange: 'Increase stress→BP causal weight from 0.65 to 0.72',
      riskAssessment: 'safe',
      clinicalAlignment: true,
      biasCheck: 'passed',
      driftCheck: 'minor',
      decision: 'approved',
      notes: 'Change is within clinical plausibility range. Validated against 12 outcome data points. No bias introduced.',
    },
    {
      id: 'sf-2', timestamp: now - 2 * day,
      proposedChange: 'Reduce expected meditation impact from 17.5% to 12%',
      riskAssessment: 'safe',
      clinicalAlignment: true,
      biasCheck: 'passed',
      driftCheck: 'stable',
      decision: 'approved',
      notes: 'Adjustment makes predictions more conservative, which is clinically safer. User-specific personalization approved.',
    },
    {
      id: 'sf-3', timestamp: now - 5 * day,
      proposedChange: 'Remove HbA1c from diabetes risk model (user data suggests weak correlation)',
      riskAssessment: 'caution',
      clinicalAlignment: false,
      biasCheck: 'warning',
      driftCheck: 'significant',
      decision: 'rejected',
      notes: 'HbA1c is a clinically validated diabetes marker per ADA/ICMR. Removing it would violate clinical guidelines. Rejected. Model retains HbA1c with adjusted weight instead.',
    },
    {
      id: 'sf-4', timestamp: now - 7 * day,
      proposedChange: 'Auto-approve salt reduction recommendation without confidence threshold',
      riskAssessment: 'caution',
      clinicalAlignment: true,
      biasCheck: 'passed',
      driftCheck: 'minor',
      decision: 'pending_review',
      notes: 'Salt reduction is clinically safe, but auto-approving without confidence threshold may lead to over-recommendation. Pending human review.',
    },
  ];
}
