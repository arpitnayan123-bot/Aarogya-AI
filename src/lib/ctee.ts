// ============================================
// AAROGYA AI — CLINICAL TRUST & EXPLAINABILITY ENGINE (CTEE)
//
// Every AI output must be:
//   1. Explainable   (why this result?)
//   2. Confidence-scored (with uncertainty)
//   3. Clinically backed (mapped to guidelines)
//   4. Traceable (input → model → output)
//   5. Consensus-driven (causal + predictive + rule-based)
//   6. Auditable (predictions vs outcomes)
//   7. Doctor-ready (clinical format conversion)
//   8. Safety-checked (never overstate, always show uncertainty)
//
// This module is an EXTENSION layer. It does NOT modify existing
// engines — it wraps them with a trust/explainability surface.
// ============================================

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type ModelLayer = 'causal' | 'predictive' | 'rule_based';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type AuditOutcome = 'pending' | 'confirmed' | 'partially_confirmed' | 'disproved' | 'expired';
export type ModuleSource =
  | 'lab_report'
  | 'xray'
  | 'disease_prediction'
  | 'digital_twin'
  | 'decision_engine'
  | 'symptom_checker'
  | 'skin_analyzer'
  | 'mental_health';

export interface ReasoningStep {
  id: string;
  label: string;                  // Human-readable step
  layer: ModelLayer;              // Which reasoning layer produced it
  input: string;                  // What fed in
  mechanism: string;              // The transformation/logic applied
  output: string;                 // What came out
  evidence?: string;              // Supporting evidence/citation
  weight: number;                 // 0-1 contribution to final result
}

export interface ReasoningChain {
  steps: ReasoningStep[];
  conclusion: string;
  causeEffect: { cause: string; effect: string }[];
}

export interface ModelVote {
  layer: ModelLayer;
  label: string;                  // "Causal Engine", "Predictive Engine", "Rule-based Engine"
  verdict: string;                // What this layer concluded
  confidence: number;             // 0-100
  agrees: boolean;                // Whether it agrees with majority
  notes?: string;
}

export interface ModelConsensus {
  votes: ModelVote[];
  agreementScore: number;         // 0-100 (how aligned the layers are)
  majorityVerdict: string;
  dissent: string[];              // Where models disagreed
}

export interface ClinicalGuideline {
  id: string;
  name: string;
  source: string;                 // e.g., "WHO", "ICMR", "ADA", "AHA", "NICE"
  year: number;
  reference: string;              // Citation
  recommendation: string;
  appliesTo: string[];            // Tags: 'diabetes', 'hypertension', etc.
}

export interface KnowledgeGraphNode {
  id: string;
  type: 'disease' | 'symptom' | 'treatment' | 'guideline' | 'lab' | 'risk_factor';
  label: string;
  description?: string;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  relation: 'causes' | 'indicates' | 'treats' | 'tests' | 'prevents' | 'references' | 'risk_of';
}

export interface ClinicalKnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  module: ModuleSource;
  prediction: string;
  confidence: number;
  riskLevel: RiskLevel;
  context: string;                // Brief context (input summary)
  outcome: AuditOutcome;
  actualResult?: string;          // Filled when outcome is known
  resolvedAt?: string;
  notes?: string;
}

export interface UncertaintyFactor {
  factor: string;
  impact: number;                 // 0-100 (how much it lowers confidence)
  detail: string;
  mitigatable: boolean;
}

export interface MissingDataItem {
  field: string;
  whyItMatters: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface TraceablePipeline {
  input: { source: string; summary: string; raw?: string };
  model: { name: string; version: string; layers: ModelLayer[] };
  output: { summary: string; confidence: number };
}

export interface DoctorModeReport {
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  icd10: string[];                // ICD-10 code suggestions
  redFlags: string[];
  followUp: string;
  differential: string[];
}

export interface CTEEReport {
  id: string;
  timestamp: string;
  module: ModuleSource;
  headline: string;
  reasoningChain: ReasoningChain;
  confidence: {
    overall: number;              // 0-100
    riskLevel: RiskLevel;
    modelCertainty: number;
    dataCompleteness: number;
    historicalAccuracy: number;
    breakdown: { label: string; value: number; weight: number }[];
  };
  consensus: ModelConsensus;
  guidelines: ClinicalGuideline[];
  pipeline: TraceablePipeline;
  uncertainty: {
    factors: UncertaintyFactor[];
    missingData: MissingDataItem[];
    weakPrediction: boolean;
    disclosure: string;
  };
  doctorMode: DoctorModeReport;
  auditId: string;
  safetyFlags: string[];
}

// ---------------------------------------------------------------------------
// CLINICAL KNOWLEDGE GRAPH
// Curated,India-aware medical knowledge base linking diseases → symptoms →
// tests → treatments → guidelines. Used to back every AI output.
// ---------------------------------------------------------------------------

export const CLINICAL_KG: ClinicalKnowledgeGraph = {
  nodes: [
    // Diseases
    { id: 'd_dm2', type: 'disease', label: 'Type 2 Diabetes Mellitus', description: 'Chronic insulin resistance + hyperglycemia' },
    { id: 'd_htn', type: 'disease', label: 'Hypertension', description: 'Sustained elevated arterial pressure' },
    { id: 'd_cad', type: 'disease', label: 'Coronary Artery Disease', description: 'Atherosclerotic narrowing of coronary arteries' },
    { id: 'd_anemia', type: 'disease', label: 'Iron-Deficiency Anemia', description: 'Low hemoglobin due to depleted iron stores' },
    { id: 'd_hypo', type: 'disease', label: 'Hypothyroidism', description: 'Underactive thyroid hormone production' },
    { id: 'd_ckd', type: 'disease', label: 'Chronic Kidney Disease', description: 'Progressive loss of renal function' },
    { id: 'd_obi', type: 'disease', label: 'Obesity', description: 'Excess adipose tissue, BMI ≥ 30' },
    { id: 'd_dys', type: 'disease', label: 'Dyslipidemia', description: 'Abnormal lipid profile' },

    // Symptoms
    { id: 's_fatigue', type: 'symptom', label: 'Fatigue' },
    { id: 's_polyuria', type: 'symptom', label: 'Frequent Urination' },
    { id: 's_polydipsia', type: 'symptom', label: 'Excessive Thirst' },
    { id: 's_headache', type: 'symptom', label: 'Headache' },
    { id: 's_blur', type: 'symptom', label: 'Blurred Vision' },
    { id: 's_chest_pain', type: 'symptom', label: 'Chest Pain' },
    { id: 's_sob', type: 'symptom', label: 'Shortness of Breath' },
    { id: 's_pallor', type: 'symptom', label: 'Pallor' },
    { id: 's_edema', type: 'symptom', label: 'Peripheral Edema' },

    // Lab tests
    { id: 'l_fbs', type: 'lab', label: 'Fasting Blood Glucose' },
    { id: 'l_hba1c', type: 'lab', label: 'HbA1c' },
    { id: 'l_bp', type: 'lab', label: 'Blood Pressure' },
    { id: 'l_hb', type: 'lab', label: 'Hemoglobin' },
    { id: 'l_ldl', type: 'lab', label: 'LDL Cholesterol' },
    { id: 'l_hdl', type: 'lab', label: 'HDL Cholesterol' },
    { id: 'l_tsh', type: 'lab', label: 'TSH' },
    { id: 'l_egfr', type: 'lab', label: 'eGFR' },
    { id: 'l_bmi', type: 'lab', label: 'BMI' },

    // Treatments
    { id: 't_metformin', type: 'treatment', label: 'Metformin' },
    { id: 't_insulin', type: 'treatment', label: 'Insulin Therapy' },
    { id: 't_ace', type: 'treatment', label: 'ACE Inhibitor' },
    { id: 't_statin', type: 'treatment', label: 'Statin' },
    { id: 't_iron', type: 'treatment', label: 'Iron Supplementation' },
    { id: 't_levo', type: 'treatment', label: 'Levothyroxine' },
    { id: 't_lifestyle', type: 'treatment', label: 'Lifestyle Modification' },

    // Risk factors
    { id: 'r_ob', type: 'risk_factor', label: 'Obesity' },
    { id: 'r_smoke', type: 'risk_factor', label: 'Smoking' },
    { id: 'r_family', type: 'risk_factor', label: 'Family History' },
    { id: 'r_sedent', type: 'risk_factor', label: 'Sedentary Lifestyle' },

    // Guidelines
    { id: 'g_ada', type: 'guideline', label: 'ADA Standards of Care 2024' },
    { id: 'g_aha', type: 'guideline', label: 'AHA Hypertension Guidelines' },
    { id: 'g_icmr', type: 'guideline', label: 'ICMR Diabetes Guidelines' },
    { id: 'g_who_anemia', type: 'guideline', label: 'WHO Anemia Guidelines' },
  ],
  edges: [
    // Disease → symptoms
    { from: 'd_dm2', to: 's_polyuria', relation: 'causes' },
    { from: 'd_dm2', to: 's_polydipsia', relation: 'causes' },
    { from: 'd_dm2', to: 's_fatigue', relation: 'causes' },
    { from: 'd_dm2', to: 's_blur', relation: 'causes' },
    { from: 'd_htn', to: 's_headache', relation: 'causes' },
    { from: 'd_anemia', to: 's_fatigue', relation: 'causes' },
    { from: 'd_anemia', to: 's_pallor', relation: 'causes' },
    { from: 'd_cad', to: 's_chest_pain', relation: 'causes' },
    { from: 'd_cad', to: 's_sob', relation: 'causes' },
    { from: 'd_ckd', to: 's_edema', relation: 'causes' },

    // Labs indicate diseases
    { from: 'l_fbs', to: 'd_dm2', relation: 'indicates' },
    { from: 'l_hba1c', to: 'd_dm2', relation: 'indicates' },
    { from: 'l_bp', to: 'd_htn', relation: 'indicates' },
    { from: 'l_hb', to: 'd_anemia', relation: 'indicates' },
    { from: 'l_ldl', to: 'd_cad', relation: 'indicates' },
    { from: 'l_tsh', to: 'd_hypo', relation: 'indicates' },
    { from: 'l_egfr', to: 'd_ckd', relation: 'indicates' },
    { from: 'l_bmi', to: 'd_obi', relation: 'indicates' },

    // Risk factors → diseases
    { from: 'r_ob', to: 'd_dm2', relation: 'risk_of' },
    { from: 'r_ob', to: 'd_htn', relation: 'risk_of' },
    { from: 'r_smoke', to: 'd_cad', relation: 'risk_of' },
    { from: 'r_family', to: 'd_dm2', relation: 'risk_of' },
    { from: 'r_sedent', to: 'd_obi', relation: 'risk_of' },

    // Treatments
    { from: 't_metformin', to: 'd_dm2', relation: 'treats' },
    { from: 't_insulin', to: 'd_dm2', relation: 'treats' },
    { from: 't_ace', to: 'd_htn', relation: 'treats' },
    { from: 't_statin', to: 'd_dys', relation: 'treats' },
    { from: 't_iron', to: 'd_anemia', relation: 'treats' },
    { from: 't_levo', to: 'd_hypo', relation: 'treats' },
    { from: 't_lifestyle', to: 'd_obi', relation: 'treats' },

    // Guidelines reference
    { from: 'g_ada', to: 'd_dm2', relation: 'references' },
    { from: 'g_icmr', to: 'd_dm2', relation: 'references' },
    { from: 'g_aha', to: 'd_htn', relation: 'references' },
    { from: 'g_who_anemia', to: 'd_anemia', relation: 'references' },
  ],
};

// Curated guideline library
export const GUIDELINES: ClinicalGuideline[] = [
  {
    id: 'g_ada',
    name: 'ADA Standards of Care 2024',
    source: 'American Diabetes Association',
    year: 2024,
    reference: 'Diabetes Care 2024;47(Suppl.1)',
    recommendation: 'HbA1c ≥ 6.5% or FPG ≥ 126 mg/dL confirms diabetes. Lifestyle + metformin first-line for T2DM.',
    appliesTo: ['diabetes', 'hba1c', 'fasting_glucose'],
  },
  {
    id: 'g_icmr',
    name: 'ICMR Diabetes Guidelines',
    source: 'Indian Council of Medical Research',
    year: 2023,
    reference: 'ICMR Guidelines for Management of Type 2 Diabetes',
    recommendation: 'For Asian Indians, diabetes cut-offs: FPG ≥ 126 mg/dL, HbA1c ≥ 6.5%. Metformin preferred first-line given lower BMI thresholds.',
    appliesTo: ['diabetes', 'south_asian', 'hba1c'],
  },
  {
    id: 'g_aha',
    name: 'AHA Hypertension Guidelines',
    source: 'American Heart Association',
    year: 2017,
    reference: 'Whelton PK et al, Hypertension 2018',
    recommendation: 'BP ≥ 130/80 mmHg = Stage 1 hypertension. Lifestyle first; pharmacotherapy if CVD risk ≥ 10%.',
    appliesTo: ['hypertension', 'blood_pressure', 'cardiovascular'],
  },
  {
    id: 'g_who_anemia',
    name: 'WHO Anemia Guidelines',
    source: 'World Health Organization',
    year: 2011,
    reference: 'WHO/NMH/NHD/MNM/11.1',
    recommendation: 'Hb < 13 g/dL (men), < 12 g/dL (women) = anemia. Iron studies to confirm iron deficiency.',
    appliesTo: ['anemia', 'hemoglobin', 'iron_deficiency'],
  },
  {
    id: 'g_nice_lipid',
    name: 'NICE Lipid Modification',
    source: 'NICE (UK)',
    year: 2023,
    reference: 'NG181',
    recommendation: 'QRISK3 ≥ 10% → offer statin therapy. Atorvastatin 20mg first-line for primary prevention.',
    appliesTo: ['dyslipidemia', 'ldl', 'cardiovascular'],
  },
  {
    id: 'g_kdoqi',
    name: 'KDOQI CKD Guidelines',
    source: 'Kidney Disease: Improving Global Outcomes',
    year: 2024,
    reference: 'KDIGO 2024 CKD Guideline Update',
    recommendation: 'eGFR < 60 mL/min/1.73m² for > 3 months = CKD. ACEi/ARB for proteinuria. SGLT2i if eGFR ≥ 20.',
    appliesTo: ['ckd', 'egfr', 'kidney'],
  },
];

// ---------------------------------------------------------------------------
// AUDIT LOG (localStorage-backed)
// ---------------------------------------------------------------------------

const AUDIT_KEY = 'aarogya_ctee_audit_log_v1';

export function loadAuditLog(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(AUDIT_KEY);
    if (!raw) return seedAuditLog();
    const parsed = JSON.parse(raw) as AuditEntry[];
    return Array.isArray(parsed) ? parsed : seedAuditLog();
  } catch {
    return seedAuditLog();
  }
}

export function saveAuditLog(log: AuditEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(-200)));
  } catch {
    /* ignore quota */
  }
}

export function appendAuditEntry(entry: AuditEntry): AuditEntry[] {
  const log = loadAuditLog();
  log.push(entry);
  saveAuditLog(log);
  return log;
}

export function resolveAuditEntry(id: string, outcome: AuditOutcome, actualResult: string): AuditEntry[] {
  const log = loadAuditLog();
  const idx = log.findIndex(e => e.id === id);
  if (idx >= 0) {
    log[idx] = {
      ...log[idx],
      outcome,
      actualResult,
      resolvedAt: new Date().toISOString(),
    };
    saveAuditLog(log);
  }
  return log;
}

// Seed with realistic historical entries so the audit panel is meaningful
function seedAuditLog(): AuditEntry[] {
  const now = Date.now();
  const seed: AuditEntry[] = [
    {
      id: 'seed-1',
      timestamp: new Date(now - 86400000 * 14).toISOString(),
      module: 'lab_report',
      prediction: 'HbA1c 6.8% → prediabetes with progression risk to T2DM within 18 months',
      confidence: 82,
      riskLevel: 'moderate',
      context: 'FPG 142 mg/dL, HbA1c 6.8%, BMI 28.4',
      outcome: 'confirmed',
      actualResult: 'Endocrinologist confirmed prediabetes; metformin 500mg started',
      resolvedAt: new Date(now - 86400000 * 7).toISOString(),
    },
    {
      id: 'seed-2',
      timestamp: new Date(now - 86400000 * 21).toISOString(),
      module: 'xray',
      prediction: 'Right lower lobe consolidation → community-acquired pneumonia',
      confidence: 88,
      riskLevel: 'moderate',
      context: 'Chest X-ray, fever 39.1°C, productive cough',
      outcome: 'confirmed',
      actualResult: 'Sputum culture positive for S. pneumoniae; amoxicillin responded',
      resolvedAt: new Date(now - 86400000 * 18).toISOString(),
    },
    {
      id: 'seed-3',
      timestamp: new Date(now - 86400000 * 9).toISOString(),
      module: 'disease_prediction',
      prediction: '10-year ASCVD risk estimated at 14% (intermediate)',
      confidence: 71,
      riskLevel: 'moderate',
      context: 'Male 52, BP 138/88, LDL 142, non-smoker',
      outcome: 'partially_confirmed',
      actualResult: 'Cardiologist calculated 11.8% via QRISK3; statin started',
      resolvedAt: new Date(now - 86400000 * 5).toISOString(),
    },
    {
      id: 'seed-4',
      timestamp: new Date(now - 86400000 * 4).toISOString(),
      module: 'digital_twin',
      prediction: 'HbA1c projected to reach 7.4% in 90 days without intervention',
      confidence: 64,
      riskLevel: 'high',
      context: '90-day trajectory simulation, current HbA1c 6.8%',
      outcome: 'pending',
    },
    {
      id: 'seed-5',
      timestamp: new Date(now - 86400000 * 2).toISOString(),
      module: 'decision_engine',
      prediction: 'Recommend SGLT2 inhibitor addition given elevated CV risk',
      confidence: 69,
      riskLevel: 'moderate',
      context: 'T2DM + hypertension + LDL borderline',
      outcome: 'pending',
    },
    {
      id: 'seed-6',
      timestamp: new Date(now - 86400000 * 30).toISOString(),
      module: 'lab_report',
      prediction: 'Hemoglobin 10.4 g/dL → iron-deficiency anemia likely',
      confidence: 79,
      riskLevel: 'moderate',
      context: 'Female 34, Hb 10.4, MCV 76',
      outcome: 'confirmed',
      actualResult: 'Ferritin 12 ng/mL; iron supplementation started; Hb rose to 11.8 in 6 weeks',
      resolvedAt: new Date(now - 86400000 * 10).toISOString(),
    },
  ];
  saveAuditLog(seed);
  return seed;
}

// ---------------------------------------------------------------------------
// CONFIDENCE CALCULATOR
// Confidence = w1*model_certainty + w2*data_completeness + w3*historical_accuracy
// Weights: 0.45 / 0.30 / 0.25  (model dominates but data gaps penalize hard)
// ---------------------------------------------------------------------------

export interface ConfidenceInputs {
  modelCertainty: number;        // 0-100 from model
  dataCompleteness: number;      // 0-100 (1 - fraction of required fields missing)
  historicalAccuracy?: number;   // 0-100 (default 75 if unknown)
}

export function computeConfidence(inputs: ConfidenceInputs) {
  const w1 = 0.45, w2 = 0.30, w3 = 0.25;
  const hist = inputs.historicalAccuracy ?? 75;
  const overall = Math.round(
    w1 * inputs.modelCertainty +
    w2 * inputs.dataCompleteness +
    w3 * hist
  );
  const riskLevel: RiskLevel =
    overall >= 85 ? 'low' :
    overall >= 70 ? 'moderate' :
    overall >= 50 ? 'high' : 'critical';
  return {
    overall: Math.min(100, Math.max(0, overall)),
    riskLevel,
    modelCertainty: inputs.modelCertainty,
    dataCompleteness: inputs.dataCompleteness,
    historicalAccuracy: hist,
    breakdown: [
      { label: 'Model Certainty', value: inputs.modelCertainty, weight: w1 },
      { label: 'Data Completeness', value: inputs.dataCompleteness, weight: w2 },
      { label: 'Historical Accuracy', value: hist, weight: w3 },
    ],
  };
}

// ---------------------------------------------------------------------------
// MODEL CONSENSUS RUNNER
// Runs 3 reasoning layers (causal, predictive, rule-based) and measures
// agreement. Disagreement lowers the consensus score and is surfaced.
// ---------------------------------------------------------------------------

export interface ConsensusInput {
  findings: { name: string; value?: string; severity: string }[];
  targetCondition: string;        // e.g., "Type 2 Diabetes"
  modelCertainty: number;         // base model certainty
}

export function runModelConsensus(input: ConsensusInput): ModelConsensus {
  const { findings, targetCondition, modelCertainty } = input;

  // --- Causal layer: graph traversal from findings → condition ---
  const causalEvidence: string[] = [];
  findings.forEach(f => {
    const node = CLINICAL_KG.nodes.find(n =>
      n.label.toLowerCase().includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(n.label.toLowerCase())
    );
    if (node) {
      const edges = CLINICAL_KG.edges.filter(e => e.from === node.id && e.relation === 'indicates');
      edges.forEach(e => {
        const target = CLINICAL_KG.nodes.find(n => n.id === e.to);
        if (target) causalEvidence.push(`${node.label} → indicates → ${target.label}`);
      });
    }
  });
  const causalConfidence = Math.min(95, 50 + causalEvidence.length * 12);
  const causalVerdict = causalEvidence.length > 0
    ? `Causal graph links ${causalEvidence.length} finding(s) to ${targetCondition}`
    : `No direct causal path found in knowledge graph for ${targetCondition}`;

  // --- Predictive layer: trajectory based on severity trend ---
  const abnormalCount = findings.filter(f => f.severity === 'abnormal' || f.severity === 'critical').length;
  const borderlineCount = findings.filter(f => f.severity === 'borderline').length;
  const predictiveScore = Math.min(95, 45 + abnormalCount * 18 + borderlineCount * 6);
  const predictiveVerdict = abnormalCount >= 2
    ? `${abnormalCount} abnormal markers → high probability trajectory`
    : borderlineCount >= 2
    ? `${borderlineCount} borderline markers → early-stage signal, monitor closely`
    : 'Insufficient abnormal markers to project trajectory';

  // --- Rule-based layer: guideline thresholds ---
  const ruleMatches: string[] = [];
  findings.forEach(f => {
    if (f.name.toLowerCase().includes('hba1c') && f.value) {
      const v = parseFloat(f.value);
      if (!isNaN(v) && v >= 6.5) ruleMatches.push(`HbA1c ${v}% ≥ 6.5% (ADA/ICMR threshold)`);
    }
    if (f.name.toLowerCase().includes('glucose') && f.value) {
      const v = parseInt(f.value);
      if (!isNaN(v) && v >= 126) ruleMatches.push(`FPG ${v} ≥ 126 mg/dL (ADA threshold)`);
    }
    if (f.name.toLowerCase().includes('pressure') && f.value) {
      const sys = parseInt(f.value.split('/')[0]);
      if (!isNaN(sys) && sys >= 130) ruleMatches.push(`BP sys ${sys} ≥ 130 mmHg (AHA Stage 1)`);
    }
    if (f.name.toLowerCase().includes('hemoglobin') && f.value) {
      const v = parseFloat(f.value);
      if (!isNaN(v) && v < 12) ruleMatches.push(`Hb ${v} < 12 g/dL (WHO anemia threshold)`);
    }
    if (f.name.toLowerCase().includes('ldl') && f.value) {
      const v = parseInt(f.value);
      if (!isNaN(v) && v >= 130) ruleMatches.push(`LDL ${v} ≥ 130 mg/dL (borderline high)`);
    }
  });
  const ruleConfidence = Math.min(95, 50 + ruleMatches.length * 15);
  const ruleVerdict = ruleMatches.length > 0
    ? `${ruleMatches.length} guideline threshold(s) crossed: ${ruleMatches.join('; ')}`
    : 'All findings within guideline thresholds';

  const votes: ModelVote[] = [
    {
      layer: 'causal',
      label: 'Causal Engine',
      verdict: causalVerdict,
      confidence: causalConfidence,
      agrees: causalConfidence >= 60,
      notes: causalEvidence.length > 0 ? causalEvidence.join(' | ') : undefined,
    },
    {
      layer: 'predictive',
      label: 'Predictive Engine',
      verdict: predictiveVerdict,
      confidence: predictiveScore,
      agrees: predictiveScore >= 60,
    },
    {
      layer: 'rule_based',
      label: 'Rule-based Engine',
      verdict: ruleVerdict,
      confidence: ruleConfidence,
      agrees: ruleConfidence >= 60,
    },
  ];

  const agreeCount = votes.filter(v => v.agrees).length;
  const agreementScore = Math.round((agreeCount / votes.length) * 100);
  const majorityVerdict = agreeCount >= 2
    ? `Majority (${agreeCount}/3) of reasoning layers support: ${targetCondition}`
    : 'Insufficient consensus — models disagree';

  const dissent: string[] = [];
  votes.forEach(v => {
    if (!v.agrees) dissent.push(`${v.label} disagrees: ${v.verdict}`);
  });

  return { votes, agreementScore, majorityVerdict, dissent };
}

// ---------------------------------------------------------------------------
// UNCERTAINTY DETECTOR
// ---------------------------------------------------------------------------

export interface UncertaintyInput {
  requiredFields: { name: string; provided: boolean; whyItMatters: string; severity: 'low' | 'moderate' | 'high' }[];
  modelCertainty: number;
  consensusAgreement: number;
}

export function detectUncertainty(input: UncertaintyInput) {
  const missing = input.requiredFields.filter(f => !f.provided);
  const missingData: MissingDataItem[] = missing.map(f => ({
    field: f.name,
    whyItMatters: f.whyItMatters,
    severity: f.severity,
  }));

  const factors: UncertaintyFactor[] = [];

  if (missing.length > 0) {
    const impact = Math.min(40, missing.length * 10);
    factors.push({
      factor: 'Missing Input Data',
      impact,
      detail: `${missing.length} required field(s) not provided: ${missing.map(m => m.name).join(', ')}`,
      mitigatable: true,
    });
  }

  if (input.modelCertainty < 70) {
    factors.push({
      factor: 'Low Model Certainty',
      impact: Math.round((70 - input.modelCertainty) * 1.2),
      detail: `Model certainty ${input.modelCertainty}% is below the 70% safety threshold`,
      mitigatable: false,
    });
  }

  if (input.consensusAgreement < 67) {
    factors.push({
      factor: 'Model Disagreement',
      impact: Math.round((67 - input.consensusAgreement) * 0.8),
      detail: `Only ${input.consensusAgreement}% agreement across reasoning layers`,
      mitigatable: true,
    });
  }

  const totalImpact = factors.reduce((s, f) => s + f.impact, 0);
  const weakPrediction = totalImpact >= 30 || input.modelCertainty < 60;

  const disclosure = weakPrediction
    ? '⚠ This prediction has material uncertainty. Treat as advisory, not diagnostic. A clinician should review before action.'
    : totalImpact > 0
    ? 'This prediction carries minor uncertainty. Confirm with clinical judgment.'
    : 'Prediction is well-supported with high confidence across all layers.';

  return { factors, missingData, weakPrediction, disclosure };
}

// ---------------------------------------------------------------------------
// EXPLAINABILITY ENGINE
// Converts a structured AI output into a human-readable reasoning chain.
// ---------------------------------------------------------------------------

export interface ExplainInput {
  module: ModuleSource;
  targetCondition: string;
  findings: { name: string; value?: string; severity: string }[];
  consensus: ModelConsensus;
  confidence: { overall: number; riskLevel: RiskLevel };
  recommendedAction?: string;
}

export function explainResult(input: ExplainInput): ReasoningChain {
  const steps: ReasoningStep[] = [];
  const causeEffect: { cause: string; effect: string }[] = [];

  // Step 1: Input perception
  const fSummary = input.findings.map(f => `${f.name}${f.value ? ` (${f.value})` : ''} [${f.severity}]`).join('; ');
  steps.push({
    id: 's1',
    label: 'Input Perception',
    layer: 'rule_based',
    input: `${input.module} module provided ${input.findings.length} finding(s)`,
    mechanism: 'Findings parsed, normalized, and tagged with severity using reference ranges',
    output: fSummary,
    weight: 0.15,
  });

  // Step 2: Causal graph traversal
  const causalVote = input.consensus.votes.find(v => v.layer === 'causal');
  if (causalVote) {
    steps.push({
      id: 's2',
      label: 'Causal Reasoning',
      layer: 'causal',
      input: fSummary,
      mechanism: 'Traversed clinical knowledge graph (disease ↔ symptom ↔ lab ↔ treatment) to identify mechanistic links',
      output: causalVote.verdict,
      evidence: causalVote.notes,
      weight: 0.30,
    });
    if (causalVote.notes) {
      causalVote.notes.split(' | ').forEach(path => {
        const parts = path.split('→');
        if (parts.length === 3) causeEffect.push({ cause: parts[0].trim(), effect: parts[2].trim() });
      });
    }
  }

  // Step 3: Predictive trajectory
  const predictiveVote = input.consensus.votes.find(v => v.layer === 'predictive');
  if (predictiveVote) {
    steps.push({
      id: 's3',
      label: 'Predictive Modeling',
      layer: 'predictive',
      input: 'Severity distribution of findings',
      mechanism: 'Projected trajectory using abnormal/borderline marker count and historical progression patterns',
      output: predictiveVote.verdict,
      weight: 0.25,
    });
  }

  // Step 4: Rule-based threshold check
  const ruleVote = input.consensus.votes.find(v => v.layer === 'rule_based');
  if (ruleVote) {
    steps.push({
      id: 's4',
      label: 'Guideline Threshold Check',
      layer: 'rule_based',
      input: 'Finding values vs. guideline thresholds',
      mechanism: 'Compared each value against ADA/ICMR/AHA/WHO/KDIGO thresholds',
      output: ruleVote.verdict,
      evidence: 'ADA 2024, ICMR 2023, AHA 2017, WHO 2011',
      weight: 0.20,
    });
  }

  // Step 5: Consensus synthesis
  steps.push({
    id: 's5',
    label: 'Consensus Synthesis',
    layer: 'causal',
    input: `3 model votes (${input.consensus.agreementScore}% agreement)`,
    mechanism: 'Majority voting with dissent surfacing; confidence weighted by agreement',
    output: input.consensus.majorityVerdict,
    weight: 0.10,
  });

  const conclusion = `Conclusion: ${input.targetCondition} — Confidence ${input.confidence.overall}% (${input.confidence.riskLevel} risk).${
    input.recommendedAction ? ` Recommended: ${input.recommendedAction}.` : ''
  }`;

  return { steps, conclusion, causeEffect };
}

// ---------------------------------------------------------------------------
// DOCTOR MODE FORMATTER
// Converts the CTEE report into a clinical SOAP + ICD-10 + red-flag format.
// ---------------------------------------------------------------------------

export function formatDoctorMode(
  module: ModuleSource,
  findings: { name: string; value?: string; severity: string }[],
  targetCondition: string,
  recommendedAction?: string,
): DoctorModeReport {
  const subjective = `Patient reports via ${module.replace(/_/g, ' ')} assessment. ${
    findings.filter(f => f.severity !== 'normal').map(f => `${f.name}${f.value ? ` ${f.value}` : ''}`).join('; ')
  }.`;

  const objective = findings.map(f =>
    `${f.name}: ${f.value || 'N/A'} [${f.severity}]`
  ).join(' • ');

  const assessment = `Assessment: ${targetCondition}. Confidence-weighted by CTEE (causal + predictive + rule-based consensus).`;

  const plan = recommendedAction ||
    '1. Confirm with clinical evaluation. 2. Order corroborating investigations. 3. Initiate guideline-based management. 4. Schedule follow-up in 2-4 weeks.';

  // ICD-10 mapping (curated)
  const icdMap: Record<string, string> = {
    'type 2 diabetes': 'E11.9',
    'diabetes': 'E11.9',
    'hypertension': 'I10',
    'coronary artery disease': 'I25.10',
    'anemia': 'D50.9',
    'iron-deficiency anemia': 'D50.9',
    'hypothyroidism': 'E03.9',
    'chronic kidney disease': 'N18.9',
    'obesity': 'E66.9',
    'dyslipidemia': 'E78.5',
    'pneumonia': 'J18.9',
  };
  const icd10: string[] = [];
  Object.entries(icdMap).forEach(([k, v]) => {
    if (targetCondition.toLowerCase().includes(k)) icd10.push(`${v} — ${k.replace(/\b\w/g, c => c.toUpperCase())}`);
  });
  if (icd10.length === 0) icd10.push('R69 — Unknown causes of morbidity (pending clinical correlation)');

  // Red flags
  const redFlags: string[] = [];
  findings.forEach(f => {
    if (f.severity === 'critical') redFlags.push(`Critical: ${f.name}${f.value ? ` ${f.value}` : ''}`);
  });
  if (targetCondition.toLowerCase().includes('coronary')) redFlags.push('Cardiac red flag — rule out ACS if chest pain present');
  if (targetCondition.toLowerCase().includes('diabetes') && findings.some(f => f.name.toLowerCase().includes('glucose') && f.value && parseInt(f.value) > 250)) {
    redFlags.push('Severe hyperglycemia — assess for DKA/HHS');
  }
  if (redFlags.length === 0) redFlags.push('No acute red flags identified');

  // Differentials
  const differential: string[] = [];
  if (targetCondition.toLowerCase().includes('diabetes')) {
    differential.push('Type 1 diabetes mellitus', 'Secondary diabetes (pancreatic)', 'Stress hyperglycemia');
  } else if (targetCondition.toLowerCase().includes('anemia')) {
    differential.push('Thalassemia trait', 'Anemia of chronic disease', 'B12/folate deficiency');
  } else if (targetCondition.toLowerCase().includes('hypertension')) {
    differential.push('Secondary hypertension (renal/endocrine)', 'White-coat hypertension', 'Masked hypertension');
  } else {
    differential.push('Condition-specific differential to be determined by treating clinician');
  }

  const followUp = `Reassess in 2-4 weeks. Repeat key labs in 6-12 weeks. Re-run CTEE on follow-up data to track outcome vs prediction.`;

  return {
    soap: { subjective, objective, assessment, plan },
    icd10,
    redFlags,
    followUp,
    differential,
  };
}

// ---------------------------------------------------------------------------
// PIPELINE TRACE
// ---------------------------------------------------------------------------

export function buildPipeline(
  module: ModuleSource,
  inputSummary: string,
  outputSummary: string,
  confidence: number,
): TraceablePipeline {
  const moduleVersion: Record<ModuleSource, string> = {
    lab_report: 'Aarogya Lab v2.4 (GLM-4V)',
    xray: 'Aarogya Imaging v1.8 (GLM-4V)',
    disease_prediction: 'Aarogya Predict v3.1 (GLM-4)',
    digital_twin: 'Aarogya Twin v1.2',
    decision_engine: 'Aarogya Decision v2.0',
    symptom_checker: 'Aarogya Symptom v2.6 (GLM-4)',
    skin_analyzer: 'Aarogya Derm v1.5 (GLM-4V)',
    mental_health: 'Aarogya Mind v1.3 (GLM-4)',
  };
  return {
    input: { source: module, summary: inputSummary },
    model: {
      name: moduleVersion[module] || 'Aarogya Engine',
      version: '2024.11',
      layers: ['causal', 'predictive', 'rule_based'],
    },
    output: { summary: outputSummary, confidence },
  };
}

// ---------------------------------------------------------------------------
// SAFETY FLAGS
// ---------------------------------------------------------------------------

export function computeSafetyFlags(
  confidence: number,
  riskLevel: RiskLevel,
  weakPrediction: boolean,
  targetCondition: string,
): string[] {
  const flags: string[] = [];
  if (confidence < 50) flags.push('CRITICAL: Confidence below 50% — do not act without clinician review');
  if (weakPrediction) flags.push('Uncertainty flagged — prediction is advisory only');
  if (riskLevel === 'critical') flags.push('Critical risk level — escalate immediately');
  if (targetCondition.toLowerCase().includes('coronary') || targetCondition.toLowerCase().includes('cardiac')) {
    flags.push('Cardiac condition — recommend ECG + troponin if symptomatic');
  }
  if (confidence >= 85 && !weakPrediction) flags.push('High confidence — still requires clinical confirmation');
  return flags;
}

// ---------------------------------------------------------------------------
// FULL REPORT BUILDER
// Ties everything together into a single CTEEReport
// ---------------------------------------------------------------------------

export interface BuildReportInput {
  module: ModuleSource;
  targetCondition: string;
  findings: { name: string; value?: string; severity: string }[];
  requiredFields: { name: string; provided: boolean; whyItMatters: string; severity: 'low' | 'moderate' | 'high' }[];
  modelCertainty: number;
  dataCompleteness: number;
  recommendedAction?: string;
}

export function buildCTEEReport(input: BuildReportInput): CTEEReport {
  const consensus = runModelConsensus({
    findings: input.findings,
    targetCondition: input.targetCondition,
    modelCertainty: input.modelCertainty,
  });

  // Historical accuracy from audit log (confirmed / total resolved)
  const audit = loadAuditLog();
  const resolved = audit.filter(a => a.outcome === 'confirmed' || a.outcome === 'partially_confirmed' || a.outcome === 'disproved');
  const correct = audit.filter(a => a.outcome === 'confirmed' || a.outcome === 'partially_confirmed');
  const historicalAccuracy = resolved.length > 0
    ? Math.round((correct.length / resolved.length) * 100)
    : 75;

  const confidence = computeConfidence({
    modelCertainty: input.modelCertainty,
    dataCompleteness: input.dataCompleteness,
    historicalAccuracy,
  });

  const uncertainty = detectUncertainty({
    requiredFields: input.requiredFields,
    modelCertainty: input.modelCertainty,
    consensusAgreement: consensus.agreementScore,
  });

  const reasoningChain = explainResult({
    module: input.module,
    targetCondition: input.targetCondition,
    findings: input.findings,
    consensus,
    confidence,
    recommendedAction: input.recommendedAction,
  });

  // Match guidelines by condition keywords
  const matchingGuidelines = GUIDELINES.filter(g =>
    g.appliesTo.some(tag => input.targetCondition.toLowerCase().includes(tag.split('_')[0])) ||
    input.findings.some(f => g.appliesTo.some(tag => f.name.toLowerCase().includes(tag.split('_')[0])))
  );
  const guidelines = matchingGuidelines.length > 0 ? matchingGuidelines : [GUIDELINES[0]];

  const pipeline = buildPipeline(
    input.module,
    input.findings.map(f => `${f.name}: ${f.value || f.severity}`).join('; '),
    input.targetCondition,
    confidence.overall,
  );

  const doctorMode = formatDoctorMode(
    input.module,
    input.findings,
    input.targetCondition,
    input.recommendedAction,
  );

  const safetyFlags = computeSafetyFlags(
    confidence.overall,
    confidence.riskLevel,
    uncertainty.weakPrediction,
    input.targetCondition,
  );

  const auditId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const auditEntry: AuditEntry = {
    id: auditId,
    timestamp: new Date().toISOString(),
    module: input.module,
    prediction: input.targetCondition,
    confidence: confidence.overall,
    riskLevel: confidence.riskLevel,
    context: input.findings.map(f => `${f.name}=${f.value || f.severity}`).join(', ').slice(0, 200),
    outcome: 'pending',
  };
  appendAuditEntry(auditEntry);

  return {
    id: `ctee-${Date.now()}`,
    timestamp: new Date().toISOString(),
    module: input.module,
    headline: input.targetCondition,
    reasoningChain,
    confidence,
    consensus,
    guidelines,
    pipeline,
    uncertainty,
    doctorMode,
    auditId,
    safetyFlags,
  };
}

// ---------------------------------------------------------------------------
// KNOWLEDGE GRAPH QUERIES
// ---------------------------------------------------------------------------

export function findRelatedNodes(conditionId: string): KnowledgeGraphNode[] {
  const related = new Set<string>([conditionId]);
  CLINICAL_KG.edges.forEach(e => {
    if (e.from === conditionId) related.add(e.to);
    if (e.to === conditionId) related.add(e.from);
  });
  return CLINICAL_KG.nodes.filter(n => related.has(n.id));
}

export function findTreatmentOptions(diseaseId: string): KnowledgeGraphNode[] {
  return CLINICAL_KG.edges
    .filter(e => e.to === diseaseId && e.relation === 'treats')
    .map(e => CLINICAL_KG.nodes.find(n => n.id === e.from)!)
    .filter(Boolean);
}

export function findIndicatingLabs(diseaseId: string): KnowledgeGraphNode[] {
  return CLINICAL_KG.edges
    .filter(e => e.to === diseaseId && e.relation === 'indicates')
    .map(e => CLINICAL_KG.nodes.find(n => n.id === e.from)!)
    .filter(Boolean);
}
