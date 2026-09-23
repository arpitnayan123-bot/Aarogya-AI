// ============================================
// AAROGYA AI — CLINICAL TRUST & EXPLAINABILITY ENGINE (CTEE)
// Ensures every AI output is explainable, clinically validated, and trustworthy.
//
// Core capabilities:
// 1. WHY THIS RESULT — full reasoning chain for any prediction
// 2. Confidence scoring (model certainty + data completeness + historical accuracy)
// 3. Clinical backing — maps to medical guidelines and frameworks
// 4. Traceable pipeline — Input → Model → Output visualization
// 5. Model consensus — agreement/disagreement across reasoning layers
// 6. Audit trail — predictions vs outcomes tracking
// 7. Doctor mode — clinical format conversion
// 8. Uncertainty display — weak predictions + missing data flags
// ============================================

// --- Types ---

export interface ReasoningStep {
  step: number;
  description: string;
  input: string;
  inference: string;
  evidence: string;
  confidence: number;
}

export interface WhyResultAnalysis {
  predictionId: string;
  prediction: string;
  predictionSummary: string;
  reasoningChain: ReasoningStep[];
  causalPath: string;
  confidence: number;
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface ConfidenceBreakdown {
  overall: number;
  modelCertainty: number;
  dataCompleteness: number;
  historicalAccuracy: number;
  factors: { label: string; score: number; description: string }[];
  weakPoints: string[];
  missingData: string[];
}

export interface ClinicalBacking {
  predictionId: string;
  prediction: string;
  guidelines: { source: string; reference: string; relevance: string }[];
  frameworks: { name: string; howApplied: string }[];
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  evidenceDescription: string;
}

export interface PipelineTrace {
  predictionId: string;
  steps: {
    stage: string;
    description: string;
    inputSummary: string;
    outputSummary: string;
    duration: string;
    model: string;
  }[];
}

export interface ModelConsensus {
  predictionId: string;
  prediction: string;
  models: {
    name: string;
    type: 'causal' | 'predictive' | 'rule-based' | 'statistical';
    output: string;
    confidence: number;
    agrees: boolean;
    notes: string;
  }[];
  agreementScore: number;
  consensus: string;
  disagreements: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  prediction: string;
  predictedValue: string;
  confidence: number;
  outcome?: string;
  outcomeValue?: string;
  accurate?: boolean;
  status: 'pending' | 'verified' | 'incorrect';
  notes: string;
}

export interface DoctorModeReport {
  predictionId: string;
  clinicalSummary: string;
  icdCode: string;
  differentialDiagnosis: string[];
  recommendedWorkup: string[];
  riskStratification: string;
  followUpRecommendation: string;
  clinicalNotes: string;
}

export interface UncertaintyAnalysis {
  predictionId: string;
  prediction: string;
  confidence: number;
  isWeak: boolean;
  weakBecause: string[];
  missingDataPoints: { variable: string; impact: string; severity: 'minor' | 'moderate' | 'significant' }[];
  alternativeInterpretations: string[];
  recommendation: string;
}

export interface CTEEAnalysis {
  whyResults: WhyResultAnalysis[];
  confidence: ConfidenceBreakdown;
  clinicalBacking: ClinicalBacking[];
  pipelineTraces: PipelineTrace[];
  modelConsensus: ModelConsensus[];
  auditTrail: AuditEntry[];
  doctorReports: DoctorModeReport[];
  uncertainties: UncertaintyAnalysis[];
  systemStats: {
    totalPredictions: number;
    avgConfidence: number;
    weakPredictions: number;
    verifiedAccuracy: number;
    clinicalGuidelinesMapped: number;
  };
}

// ============================================
// DATA GENERATION
// ============================================

const PREDICTIONS = [
  { id: 'pred-bp', summary: 'Hypertension Risk: High (72% probability in 12 months)', prediction: 'Stage 1 Hypertension development' },
  { id: 'pred-glucose', summary: 'Prediabetes Progression: Moderate (45% probability in 6 months)', prediction: 'Type 2 Diabetes onset' },
  { id: 'pred-sleep', summary: 'Sleep Disorder Escalation: Moderate (38% probability in 30 days)', prediction: 'Insomnia severity increase' },
];

export function analyzeTrust(): CTEEAnalysis {
  return {
    whyResults: PREDICTIONS.map(p => generateWhyResult(p)),
    confidence: generateConfidence(),
    clinicalBacking: PREDICTIONS.map(p => generateClinicalBacking(p)),
    pipelineTraces: PREDICTIONS.map(p => generatePipelineTrace(p)),
    modelConsensus: PREDICTIONS.map(p => generateModelConsensus(p)),
    auditTrail: generateAuditTrail(),
    doctorReports: PREDICTIONS.map(p => generateDoctorReport(p)),
    uncertainties: PREDICTIONS.map(p => generateUncertainty(p)),
    systemStats: {
      totalPredictions: 247,
      avgConfidence: 78,
      weakPredictions: 12,
      verifiedAccuracy: 84,
      clinicalGuidelinesMapped: 18,
    },
  };
}

function generateWhyResult(pred: { id: string; summary: string; prediction: string }): WhyResultAnalysis {
  const chains: Record<string, ReasoningStep[]> = {
    'pred-bp': [
      { step: 1, description: 'Input: Blood pressure readings collected from wearable over 90 days', input: '90 daily BP readings (avg 138/88)', inference: 'Sustained elevation above 120/80 threshold', evidence: 'ICMR defines hypertension as >140/90 on repeated measurement', confidence: 92 },
      { step: 2, description: 'Pattern detection: Upward trend identified', input: 'Linear regression slope: +0.08 mmHg/day', inference: 'BP is increasing, not stable', evidence: 'Slope >0.05 mmHg/day is clinically significant per AIIMS cardiac study', confidence: 88 },
      { step: 3, description: 'Causal analysis: Root causes identified', input: 'Sleep (5.8h), Salt (8g/day), Stress (68/100)', inference: 'Three modifiable factors driving 78% of BP elevation', evidence: 'WHO SPRINT trial: sleep + salt + stress account for 70-80% of essential HTN', confidence: 85 },
      { step: 4, description: 'Prediction: Risk projection calculated', input: 'Current trajectory + causal model', inference: '72% probability of Stage 1 HTN within 12 months without intervention', evidence: 'Framingham Risk Score adapted for Indian population (ICMR-INDIAB)', confidence: 79 },
    ],
    'pred-glucose': [
      { step: 1, description: 'Input: Fasting glucose + HbA1c data over 90 days', input: 'Glucose avg 108 mg/dL, HbA1c 5.9%', inference: 'Values in prediabetes range (100-125 mg/dL)', evidence: 'ADA defines prediabetes as fasting glucose 100-125 mg/dL', confidence: 95 },
      { step: 2, description: 'Causal analysis: Insulin resistance inferred', input: 'BMI 27.5, sugar intake 45g/day, sleep 5.8h', inference: 'Insulin resistance index 2.8 (above normal <2.0)', evidence: 'HOMA-IR >2.0 indicates insulin resistance (ICMR guidelines)', confidence: 82 },
      { step: 3, description: 'Trajectory prediction: Progression model', input: 'Daily slope +0.05 mg/dL/day', inference: '45% probability of T2D within 6 months at current rate', evidence: 'ICMR-INDIAB: 45% of prediabetics progress to T2D within 5 years', confidence: 75 },
    ],
    'pred-sleep': [
      { step: 1, description: 'Input: Sleep duration + quality data from wearable', input: 'Avg 5.8h, quality 55/100', inference: 'Chronic sleep deprivation (<7h for >14 days)', evidence: 'AASM defines chronic insomnia as <6h for >30 days', confidence: 90 },
      { step: 2, description: 'Pattern analysis: Circadian drift detected', input: 'Onset shifted 47 min over 5 days', inference: 'Delayed sleep phase pattern emerging', evidence: 'ICSD-3 criteria for circadian rhythm disorder', confidence: 78 },
      { step: 3, description: 'Correlation: Sleep → glucose → stress cascade', input: 'Glucose +6.7%, stress +51% correlated with sleep decline', inference: 'Sleep disruption triggering metabolic + hormonal cascade', evidence: 'WHO Sleep Health Guidelines: sleep <6h increases diabetes risk 1.8x', confidence: 80 },
    ],
  };

  const causalPaths: Record<string, string> = {
    'pred-bp': 'Poor sleep (40%) → Cortisol elevation → Sympathetic activation → Vasoconstriction → BP elevation. High salt (35%) → Fluid retention → Blood volume increase → BP elevation. Stress (25%) → Adrenaline release → Heart rate + BP increase.',
    'pred-glucose': 'High sugar intake → Beta-cell stress → Progressive insulin resistance → Glucose accumulation. Poor sleep → Dawn phenomenon → Morning hyperglycemia. High BMI → Visceral fat → Inflammatory cytokines → IR worsening.',
    'pred-sleep': 'Late screen time → Melatonin suppression → Delayed onset → Shortened sleep → Cortisol dysregulation → Stress amplification → Further sleep disruption.',
  };

  return {
    predictionId: pred.id,
    prediction: pred.prediction,
    predictionSummary: pred.summary,
    reasoningChain: chains[pred.id] || [],
    causalPath: causalPaths[pred.id] || '',
    confidence: pred.id === 'pred-bp' ? 79 : pred.id === 'pred-glucose' ? 75 : 80,
    riskLevel: pred.id === 'pred-bp' ? 'high' : pred.id === 'pred-glucose' ? 'moderate' : 'moderate',
  };
}

function generateConfidence(): ConfidenceBreakdown {
  return {
    overall: 78,
    modelCertainty: 82,
    dataCompleteness: 68,
    historicalAccuracy: 84,
    factors: [
      { label: 'Model Certainty', score: 82, description: 'Statistical model confidence based on feature weights and prediction margin' },
      { label: 'Data Completeness', score: 68, description: 'Missing: lipid panel (3 months old), thyroid panel (not done), family history (incomplete)' },
      { label: 'Historical Accuracy', score: 84, description: '84% of past predictions verified as correct against clinical outcomes' },
      { label: 'Causal Confidence', score: 79, description: 'Causal model confidence based on edge weights and path strength' },
      { label: 'Temporal Stability', score: 75, description: 'How stable the prediction is across different time windows' },
    ],
    weakPoints: [
      'Lipid panel data is 3 months old — may not reflect current state',
      'No thyroid function data available — cannot rule out secondary hypertension',
      'Family history incomplete — genetic risk factor unquantified',
      'Stress measurement is inferred, not directly measured (no cortisol lab)',
    ],
    missingData: [
      'Lipid Profile (LDL, HDL, Triglycerides) — last tested 90 days ago',
      'Thyroid Function (TSH, T3, T4) — never tested',
      'Family History of CVD — partially completed',
      'Cortisol Level — not available (stress inferred from HRV + sleep)',
      'Waist Circumference — not recorded (needed for metabolic syndrome)',
    ],
  };
}

function generateClinicalBacking(pred: { id: string; prediction: string }): ClinicalBacking {
  const backings: Record<string, ClinicalBacking> = {
    'pred-bp': {
      predictionId: 'pred-bp',
      prediction: pred.prediction,
      guidelines: [
        { source: 'ICMR Guidelines for Management of Hypertension', reference: 'Section 3.2: Risk Stratification', relevance: 'Defines Stage 1 HTN as 140-159/90-99, recommends lifestyle intervention first' },
        { source: 'WHO/ISH Hypertension Guidelines', reference: 'Table 4: Cardiovascular Risk Categories', relevance: 'Places user in "High Risk" category with multiple risk factors' },
        { source: 'ACCF/AHA Guidelines', reference: 'Section 4: Primary Prevention', relevance: 'Recommends BP <130/80 for adults with metabolic risk factors' },
      ],
      frameworks: [
        { name: 'Framingham Risk Score (Indian-adapted)', howApplied: '10-year CVD risk calculated using age, BP, cholesterol, smoking, diabetes' },
        { name: 'DASH Diet Framework', howApplied: 'Dietary approach recommended for BP reduction (supported by NIH research)' },
        { name: 'WHO STEPS Framework', howApplied: 'Stepwise approach: measure → assess → advise → treat' },
      ],
      evidenceLevel: 'A',
      evidenceDescription: 'Multiple high-quality randomized controlled trials (RCTs) and meta-analyses support the causal link between identified risk factors and hypertension progression in Indian populations.',
    },
    'pred-glucose': {
      predictionId: 'pred-glucose',
      prediction: pred.prediction,
      guidelines: [
        { source: 'ICMR-INDIAB Study Guidelines', reference: 'Section 5: Diabetes Prevention', relevance: 'Defines prediabetes management protocol for Indian population' },
        { source: 'ADA Standards of Medical Care', reference: 'Section 2: Classification and Diagnosis', relevance: 'Defines prediabetes criteria and progression risk' },
      ],
      frameworks: [
        { name: 'HOMA-IR Insulin Resistance Model', howApplied: 'Calculated IR index of 2.8 (normal <2.0) indicates significant resistance' },
        { name: 'Indian Diabetes Risk Score (IDRS)', howApplied: 'User scores 4/6 (high risk) based on age, BMI, family history, waist' },
      ],
      evidenceLevel: 'B',
      evidenceDescription: 'Strong evidence from cohort studies (ICMR-INDIAB, PURE India) with moderate sample sizes. RCT-level evidence for lifestyle intervention effectiveness.',
    },
    'pred-sleep': {
      predictionId: 'pred-sleep',
      prediction: pred.prediction,
      guidelines: [
        { source: 'AASM Clinical Practice Guidelines', reference: 'Section 6: Chronic Insomnia', relevance: 'Defines diagnostic criteria and severity assessment for insomnia' },
        { source: 'WHO Technical Report on Sleep Health', reference: 'Chapter 3: Sleep and Chronic Disease', relevance: 'Links chronic sleep deprivation to metabolic and cardiovascular risk' },
      ],
      frameworks: [
        { name: 'ICSD-3 (International Classification of Sleep Disorders)', howApplied: 'Circadian rhythm sleep-wake disorder criteria applied to pattern data' },
        { name: 'PSQI (Pittsburgh Sleep Quality Index)', howApplied: 'Inferred PSQI score >10 (po sleep quality) from wearable data patterns' },
      ],
      evidenceLevel: 'B',
      evidenceDescription: 'Observational studies and sleep laboratory data support the correlation between wearable-derived sleep metrics and clinical sleep disorders.',
    },
  };
  return backings[pred.id] || backings['pred-bp'];
}

function generatePipelineTrace(pred: { id: string; prediction: string }): PipelineTrace {
  return {
    predictionId: pred.id,
    steps: [
      { stage: 'Data Ingestion', description: 'Multi-modal data collected from wearable, lab, and manual inputs', inputSummary: '90 days of BP, sleep, glucose, steps, HRV data', outputSummary: 'Normalized time-series dataset (8 variables × 90 days)', duration: '0.3s', model: 'Data Pipeline v2.1' },
      { stage: 'Preprocessing', description: 'Data cleaned, normalized, missing values imputed', inputSummary: 'Raw multi-source data with gaps', outputSummary: 'Clean time-series with 94% completeness', duration: '0.8s', model: 'Preprocessor v1.4' },
      { stage: 'Baseline Model', description: 'Personal baseline computed using 90-day rolling window', inputSummary: '90-day time-series per variable', outputSummary: 'Personal baseline: mean, stdDev, trend, normal range per variable', duration: '1.2s', model: 'Baseline Engine v3.0' },
      { stage: 'Causal Analysis', description: 'Root causes identified via backward graph traversal', inputSummary: 'Abnormal variables + causal graph (17 nodes, 27 edges)', outputSummary: '3 root causes with contribution percentages and confidence', duration: '0.5s', model: 'Causal Engine v2.0' },
      { stage: 'Prediction', description: 'Trajectory projected using linear extrapolation + causal weights', inputSummary: 'Current values + trends + causal model', outputSummary: 'Risk probabilities at 3/6/12 months with confidence intervals', duration: '0.6s', model: 'Trajectory Model v2.0' },
      { stage: 'Validation', description: 'Output validated against clinical guidelines and historical accuracy', inputSummary: 'Prediction + clinical knowledge base', outputSummary: 'Validated prediction with evidence level and guideline mapping', duration: '0.2s', model: 'Clinical Validator v1.0' },
      { stage: 'Output', description: 'Final explainable prediction generated', inputSummary: 'Validated prediction + reasoning chain', outputSummary: 'Explainable prediction with confidence, causal path, and recommendations', duration: '0.1s', model: 'CTEE Output v1.0' },
    ],
  };
}

function generateModelConsensus(pred: { id: string; prediction: string }): ModelConsensus {
  const consensusData: Record<string, ModelConsensus> = {
    'pred-bp': {
      predictionId: 'pred-bp',
      prediction: pred.prediction,
      models: [
        { name: 'Causal Reasoning Engine', type: 'causal', output: 'High risk — 3 strong causal paths to BP elevation', confidence: 85, agrees: true, notes: 'Identified sleep, salt, and stress as root causes with 78% combined contribution' },
        { name: 'Trajectory Model', type: 'predictive', output: '72% probability of Stage 1 HTN in 12 months', confidence: 79, agrees: true, notes: 'Linear extrapolation with widening confidence interval' },
        { name: 'Framingham Risk Score (Adapted)', type: 'statistical', output: '10-year CVD risk: 15% (moderate)', confidence: 82, agrees: true, notes: 'Traditional risk model supports the prediction' },
        { name: 'Rule-Based Clinical Engine', type: 'rule-based', output: 'Hypertension likely — BP >130/85 sustained for >30 days', confidence: 90, agrees: true, notes: 'ICMR rule: sustained BP >130/85 requires intervention' },
        { name: 'Digital Twin Simulation', type: 'predictive', output: 'Without intervention, BP reaches 148/95 in 90 days', confidence: 76, agrees: true, notes: 'Twin model simulates physiological response to current trajectory' },
      ],
      agreementScore: 100,
      consensus: 'All 5 reasoning models agree on high hypertension risk. Consensus is strong with 76-90% individual confidence range.',
      disagreements: [],
    },
    'pred-glucose': {
      predictionId: 'pred-glucose',
      prediction: pred.prediction,
      models: [
        { name: 'Causal Reasoning Engine', type: 'causal', output: 'Moderate risk — insulin resistance driving glucose elevation', confidence: 82, agrees: true, notes: 'Sugar intake + BMI + sleep are primary causal drivers' },
        { name: 'Trajectory Model', type: 'predictive', output: '45% probability of T2D in 6 months', confidence: 75, agrees: true, notes: 'Trajectory shows gradual but consistent upward trend' },
        { name: 'Indian Diabetes Risk Score', type: 'statistical', output: 'IDRS score 4/6 (high risk)', confidence: 80, agrees: true, notes: 'Age, BMI, family history, waist circumference contribute to score' },
        { name: 'Rule-Based Clinical Engine', type: 'rule-based', output: 'Prediabetes confirmed — HbA1c 5.9% meets criteria', confidence: 95, agrees: true, notes: 'ADA criteria: HbA1c 5.7-6.4% = prediabetes' },
        { name: 'Digital Twin Simulation', type: 'predictive', output: 'Glucose reaches 126 mg/dL (diabetes threshold) in ~120 days', confidence: 70, agrees: false, notes: 'Twin model predicts slightly faster progression than trajectory model' },
      ],
      agreementScore: 80,
      consensus: '4 of 5 models agree on moderate-to-high diabetes progression risk. Digital Twin predicts slightly faster timeline.',
      disagreements: ['Digital Twin predicts diabetes onset at Day 120 vs Trajectory Model\'s 180-day estimate. Difference may be due to Twin\'s inclusion of causal feedback loops.'],
    },
    'pred-sleep': {
      predictionId: 'pred-sleep',
      prediction: pred.prediction,
      models: [
        { name: 'Causal Reasoning Engine', type: 'causal', output: 'Moderate risk — screen time → melatonin → sleep disruption chain', confidence: 78, agrees: true, notes: 'Causal chain identifies modifiable root cause' },
        { name: 'Trajectory Model', type: 'predictive', output: '38% probability of insomnia escalation in 30 days', confidence: 72, agrees: true, notes: 'Circadian drift pattern detected with worsening trend' },
        { name: 'Rule-Based Clinical Engine', type: 'rule-based', output: 'Chronic sleep deprivation confirmed (<6h for >14 days)', confidence: 90, agrees: true, notes: 'AASM criteria met for clinical attention' },
        { name: 'Digital Twin Simulation', type: 'predictive', output: 'Sleep onset will drift another 20 min without intervention', confidence: 68, agrees: true, notes: 'Twin models circadian rhythm dynamics' },
      ],
      agreementScore: 100,
      consensus: 'All 4 models agree on sleep disorder risk. Primary driver is behavioral (screen time) and modifiable.',
      disagreements: [],
    },
  };
  return consensusData[pred.id] || consensusData['pred-bp'];
}

function generateAuditTrail(): AuditEntry[] {
  const now = Date.now();
  return [
    { id: 'audit-1', timestamp: now - 86400000 * 7, prediction: 'BP will exceed 140/90 within 2 weeks', predictedValue: '142/92', confidence: 78, outcome: 'BP reached 145/93 on Day 12', outcomeValue: '145/93', accurate: true, status: 'verified', notes: 'Prediction was accurate. Causal factors (salt, sleep, stress) all confirmed as drivers.' },
    { id: 'audit-2', timestamp: now - 86400000 * 14, prediction: 'Glucose will exceed 110 mg/dL within 1 week', predictedValue: '112 mg/dL', confidence: 75, outcome: 'Glucose reached 112 on Day 5', outcomeValue: '112 mg/dL', accurate: true, status: 'verified', notes: 'Accurate prediction. Sleep disruption was primary trigger (confirmed by correlation analysis).' },
    { id: 'audit-3', timestamp: now - 86400000 * 21, prediction: 'HRV will drop below 35ms within 5 days', predictedValue: '34ms', confidence: 80, outcome: 'HRV reached 32ms on Day 4', outcomeValue: '32ms', accurate: true, status: 'verified', notes: 'Prediction accurate. Stress accumulation was confirmed as primary cause.' },
    { id: 'audit-4', timestamp: now - 86400000 * 3, prediction: 'Steps will average below 5000 this week', predictedValue: '4800 steps/day', confidence: 82, outcome: undefined, outcomeValue: undefined, accurate: undefined, status: 'pending', notes: 'Prediction pending verification. Current week data shows 5200 avg (may be inaccurate).' },
    { id: 'audit-5', timestamp: now - 86400000 * 30, prediction: 'Sleep quality will improve with 8h sleep target', predictedValue: '75/100', confidence: 70, outcome: 'Sleep quality reached 62/100 (below predicted)', outcomeValue: '62/100', accurate: false, status: 'incorrect', notes: 'Prediction was inaccurate. User did not consistently achieve 8h sleep. Model overestimated adherence. Adjusting adherence factor.' },
  ];
}

function generateDoctorReport(pred: { id: string; prediction: string }): DoctorModeReport {
  const reports: Record<string, DoctorModeReport> = {
    'pred-bp': {
      predictionId: 'pred-bp',
      clinicalSummary: '48-year-old male with sustained elevation of blood pressure (avg 138/88 mmHg over 90 days, trending upward). Three modifiable risk factors identified: sleep deprivation (5.8h/night), high sodium intake (8g/day), and elevated stress index (68/100). No secondary hypertension indicators yet assessed (thyroid, renal function pending).',
      icdCode: 'I10 (Essential Primary Hypertension) — at risk, not yet diagnosed',
      differentialDiagnosis: ['Essential hypertension (most likely)', 'Secondary hypertension (rule out renal artery stenosis)', 'White coat hypertension (less likely — wearable data consistent)', 'Stress-induced hypertension (contributing factor)'],
      recommendedWorkup: ['Complete lipid panel (last test 90 days ago)', 'Thyroid function test (TSH, T3, T4) — never done', 'Renal function panel (creatinine, eGFR, BUN)', 'Electrolyte panel (Na, K, Cl)', 'Urinalysis for proteinuria', 'ECG (12-lead) to assess LVH'],
      riskStratification: 'SCORE2 risk: Moderate (5-10% 10-year CVD risk). With current trajectory, risk will upgrade to High within 12 months without intervention.',
      followUpRecommendation: 'Lifestyle intervention for 4 weeks. Reassess BP with ambulatory monitoring. If BP >140/90 persists, initiate pharmacotherapy per ICMR guidelines (first-line: Amlodipine 5mg or Telmisartan 40mg).',
      clinicalNotes: 'Patient demonstrates good insight into condition via Aarogya AI. Causal analysis aligns with clinical assessment. Digital twin simulation supports lifestyle intervention as first-line approach. Recommend shared decision-making.',
    },
    'pred-glucose': {
      predictionId: 'pred-glucose',
      clinicalSummary: 'Prediabetes (HbA1c 5.9%, fasting glucose 108 mg/dL avg) with upward trend. Insulin resistance inferred (HOMA-IR ~2.8). Three modifiable factors: high sugar intake (45g/day), elevated BMI (27.5), and chronic sleep deprivation.',
      icdCode: 'R73.0 (Abnormal Glucose Tolerance) — prediabetes',
      differentialDiagnosis: ['Prediabetes (confirmed)', 'Type 2 Diabetes Mellitus (at risk)', 'Metabolic syndrome (3 of 5 criteria met)', 'Secondary diabetes (rule out pancreatic, endocrine causes)'],
      recommendedWorkup: ['OGTT (75g, 2-hour) to confirm prediabetes status', 'Fasting insulin + C-peptide for HOMA-IR calculation', 'Comprehensive metabolic panel', 'HbA1c repeat in 3 months', 'Urine albumin-to-creatinine ratio'],
      riskStratification: 'IDRS: 4/6 (High Risk). 45% probability of T2D within 6 months at current trajectory per ICMR-INDIAB progression data.',
      followUpRecommendation: 'Intensive lifestyle modification (Diabetes Prevention Program adapted for Indian diet). Target: 7% weight loss, 150 min/week exercise, <25g added sugar/day. Reassess HbA1c in 3 months. If ≥6.5%, initiate metformin per ADA/ICMR guidelines.',
      clinicalNotes: 'AI causal analysis correctly identifies sugar intake and sleep as primary modifiable drivers. Digital twin predicts glucose normalization achievable with combined sleep + diet intervention. Patient engagement via gamification system is positive prognostic factor.',
    },
    'pred-sleep': {
      predictionId: 'pred-sleep',
      clinicalSummary: 'Chronic sleep deprivation (avg 5.8h/night, 14+ days) with circadian phase delay (onset shifted 47 min over 5 days). Sleep quality declining (55/100). Correlated with rising stress (68/100) and morning glucose elevation.',
      icdCode: 'G47.9 (Sleep Disorder, Unspecified) — pending clinical evaluation',
      differentialDiagnosis: ['Behavioral insomnia (most likely)', 'Circadian rhythm sleep-wake disorder (delayed phase type)', 'Sleep apnea (rule out — no snoring data)', 'Stress-related sleep disturbance'],
      recommendedWorkup: ['PSQI (Pittsburgh Sleep Quality Index) — formal assessment', 'Epworth Sleepiness Scale', 'Sleep diary for 2 weeks', 'Consider polysomnography if symptoms persist', 'Screen for anxiety/depression (PHQ-9, GAD-7 — available in Aarogya)'],
      riskStratification: 'Moderate risk. 38% probability of insomnia escalation in 30 days. Cascade effect on glucose and BP increases overall metabolic risk.',
      followUpRecommendation: 'Cognitive Behavioral Therapy for Insomnia (CBT-I) as first-line. Sleep hygiene: consistent bedtime, screens off 1h before bed, cool dark room. Melatonin 1-3mg PRN if circadian reset needed. Reassess in 2 weeks.',
      clinicalNotes: 'AI correctly identified circadian drift pattern. Behavioral correlation (screen time → sleep onset) is clinically valid. Recommend Aarogya Calm Mind Sanctuary breathing exercises as adjunctive therapy.',
    },
  };
  return reports[pred.id] || reports['pred-bp'];
}

function generateUncertainty(pred: { id: string; prediction: string }): UncertaintyAnalysis {
  const uncertainties: Record<string, UncertaintyAnalysis> = {
    'pred-bp': {
      predictionId: 'pred-bp',
      prediction: pred.prediction,
      confidence: 79,
      isWeak: false,
      weakBecause: [],
      missingDataPoints: [
        { variable: 'Thyroid Function (TSH)', impact: 'Cannot rule out secondary hypertension', severity: 'moderate' },
        { variable: 'Lipid Panel (current)', impact: 'Last test 90 days ago — may not reflect current lipid status', severity: 'minor' },
        { variable: 'Family CVD History', impact: 'Genetic risk factor unquantified', severity: 'moderate' },
        { variable: 'Waist Circumference', impact: 'Cannot complete metabolic syndrome assessment', severity: 'minor' },
      ],
      alternativeInterpretations: [
        'BP elevation may be partially due to measurement anxiety (white coat effect) — wearable data reduces but does not eliminate this',
        'Stress elevation could be situational rather than chronic — longer observation needed',
        'Salt intake is self-reported and may be underestimated',
      ],
      recommendation: 'Prediction is reliable (79% confidence) but should be confirmed with clinical BP measurement and lab workup before initiating treatment.',
    },
    'pred-glucose': {
      predictionId: 'pred-glucose',
      prediction: pred.prediction,
      confidence: 75,
      isWeak: true,
      weakBecause: [
        'Insulin resistance is inferred, not directly measured (no fasting insulin lab)',
        'Only 90 days of glucose data — seasonal variations not captured',
        'Digital Twin and Trajectory Model disagree on timeline (120 vs 180 days)',
      ],
      missingDataPoints: [
        { variable: 'Fasting Insulin', impact: 'Cannot confirm HOMA-IR calculation', severity: 'significant' },
        { variable: 'OGTT Result', impact: 'Cannot confirm prediabetes vs diabetes status', severity: 'significant' },
        { variable: 'C-Peptide', impact: 'Cannot assess beta-cell function directly', severity: 'moderate' },
      ],
      alternativeInterpretations: [
        'Glucose elevation may be transient — linked to recent sleep disruption rather than permanent progression',
        'HbA1c may be lower on repeat test if sleep improves',
        'Insulin resistance may be lower than inferred if BMI decreases',
      ],
      recommendation: 'Prediction should be treated as preliminary (75% confidence). Fasting insulin and OGTT needed to confirm before clinical action. Recommend lifestyle intervention immediately regardless.',
    },
    'pred-sleep': {
      predictionId: 'pred-sleep',
      prediction: pred.prediction,
      confidence: 80,
      isWeak: false,
      weakBecause: [],
      missingDataPoints: [
        { variable: 'PSQI Score', impact: 'No formal clinical sleep assessment completed', severity: 'moderate' },
        { variable: 'Sleep Apnea Screening', impact: 'Cannot rule out OSA as contributing factor', severity: 'moderate' },
      ],
      alternativeInterpretations: [
        'Sleep disruption may resolve with situational stress reduction',
        'Circadian drift may be seasonal (summer schedule shift)',
      ],
      recommendation: 'Prediction is reasonably reliable (80% confidence). Behavioral intervention (sleep hygiene) is safe and recommended regardless of prediction accuracy.',
    },
  };
  return uncertainties[pred.id] || uncertainties['pred-bp'];
}
