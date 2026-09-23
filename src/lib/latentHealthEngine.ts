// ============================================
// AAROGYA AI — JEPA-INSPIRED LATENT HEALTH STATE ENGINE
// ============================================
//
// JEPA (Joint-Embedding Predictive Architecture) principles applied:
//
// 1. REPRESENTATION FIRST: Instead of predicting text, we predict
//    ABSTRACT HEALTH STATES (latent variables) from observed findings.
//    Raw inputs (lab values, symptoms, images) are converted into
//    a unified latent representation.
//
// 2. PREDICT HIDDEN STRUCTURE: Given observed findings, predict
//    what hidden variables SHOULD exist (e.g., inflammation level,
//    metabolic health, immune status) even if not directly measured.
//
// 3. JOINT EMBEDDING: All health data types (lab, imaging, symptoms)
//    are embedded into the SAME latent space, enabling cross-modal
//    reasoning.
//
// 4. PREDICTIVE, NOT GENERATIVE: We predict relationships in latent
//    space (what should exist) rather than generating surface text.
// ============================================

import type { HealthFinding, FindingSeverity } from './healthContext';

// --- Latent Health State Variables (hidden dimensions) ---

export interface LatentHealthState {
  // Metabolic axis (0-100, higher = healthier)
  metabolicScore: number;
  metabolicTrajectory: 'improving' | 'stable' | 'declining';

  // Cardiovascular axis
  cardiovascularScore: number;
  cardiovascularRisk: 'low' | 'moderate' | 'high' | 'critical';

  // Inflammation axis (0-100, higher = more inflammation)
  inflammationLevel: number;
  inflammationTrend: 'low' | 'moderate' | 'high' | 'severe';

  // Immune status (0-100, higher = stronger)
  immuneScore: number;

  // Nutritional axis
  nutritionalScore: number;
  deficiencies: string[];

  // Organ system stress map (0-100 per system, higher = more stress)
  organStress: {
    liver: number;
    kidney: number;
    heart: number;
    lungs: number;
    thyroid: number;
    pancreas: number;
  };

  // Overall latent health embedding (vector for similarity matching)
  healthEmbedding: number[];

  // Predicted hidden variables (not directly measured but inferred)
  predicted: {
    biologicalAge: number;           // vs chronological age
    energyLevel: number;              // 0-100
    sleepQuality: number;             // 0-100
    stressLevel: number;              // 0-100
    recoveryCapacity: number;         // 0-100
  };

  // Confidence in the latent state estimate
  confidence: number;
}

// --- Severity to numeric mapping ---

const SEVERITY_WEIGHTS: Record<FindingSeverity, number> = {
  normal: 0,
  borderline: -0.3,
  abnormal: -0.6,
  critical: -1,
};

// --- Organ system mapping ---

const ORGAN_KEYWORDS: Record<string, string[]> = {
  liver: ['sgpt', 'sgot', 'alt', 'ast', 'bilirubin', 'ggt', 'alkaline phosphatase', 'liver', 'hepatic'],
  kidney: ['creatinine', 'urea', 'bun', 'egfr', 'kidney', 'renal', 'cystatin'],
  heart: ['cholesterol', 'ldl', 'hdl', 'triglyceride', 'troponin', 'ck-mb', 'bnp', 'cardiac', 'heart', 'blood pressure', 'bp'],
  lungs: ['lung', 'pulmonary', 'respiratory', 'spo2', 'oxygen', 'chest x-ray', 'pneumonia'],
  thyroid: ['tsh', 't3', 't4', 'thyroid', 'thyroxine'],
  pancreas: ['glucose', 'hba1c', 'insulin', 'c-peptide', 'amylase', 'lipase', 'pancreas'],
};

// --- Nutritional deficiency detection ---

const NUTRIENT_KEYWORDS: Record<string, string[]> = {
  'Iron Deficiency': ['hemoglobin', 'ferritin', 'iron', 'mcv', 'mch'],
  'Vitamin D Deficiency': ['vitamin d', '25-hydroxy', 'cholecalciferol'],
  'Vitamin B12 Deficiency': ['b12', 'cobalamin', 'mcv', 'mch'],
  'Folate Deficiency': ['folate', 'folic acid', 'b9'],
  'Protein Deficiency': ['albumin', 'total protein', 'globulin'],
  'Calcium Deficiency': ['calcium', 'ca'],
};

// --- Embedding generator ---
// Converts findings into a fixed-length vector for similarity matching.
// Each dimension represents a health axis.

const EMBEDDING_DIMENSIONS = 16;
const EMBEDDING_AXES = [
  'metabolic', 'cardiovascular', 'inflammatory', 'immune', 'nutritional',
  'hepatic', 'renal', 'thyroid', 'respiratory', 'hematological',
  'neurological', 'musculoskeletal', 'endocrine', 'dermatological',
  'gastrointestinal', 'psychological',
];

function generateEmbedding(findings: HealthFinding[]): number[] {
  const embedding = new Array(EMBEDDING_DIMENSIONS).fill(0.5); // neutral baseline

  findings.forEach(f => {
    const nameLower = f.name.toLowerCase();
    const catLower = f.category.toLowerCase();
    const combined = `${nameLower} ${catLower}`;
    const severityDelta = SEVERITY_WEIGHTS[f.severity] || 0;

    EMBEDDING_AXES.forEach((axis, i) => {
      if (combined.includes(axis) || combined.includes(axis.substring(0, 4))) {
        embedding[i] = Math.max(0, Math.min(1, embedding[i] + severityDelta * 0.5));
      }
    });

    // Cross-axis mapping
    if (combined.includes('glucose') || combined.includes('hba1c')) embedding[0] += severityDelta * 0.7;
    if (combined.includes('cholesterol') || combined.includes('ldl') || combined.includes('blood pressure')) embedding[1] += severityDelta * 0.7;
    if (combined.includes('crp') || combined.includes('esr') || combined.includes('inflammation')) embedding[2] += severityDelta * 0.8;
    if (combined.includes('wbc') || combined.includes('immunoglobulin')) embedding[3] += severityDelta * 0.6;
    if (combined.includes('hemoglobin') || combined.includes('iron') || combined.includes('ferritin')) embedding[4] += severityDelta * 0.6;
    if (combined.includes('sgpt') || combined.includes('bilirubin')) embedding[5] += severityDelta * 0.7;
    if (combined.includes('creatinine') || combined.includes('urea')) embedding[6] += severityDelta * 0.7;
    if (combined.includes('tsh') || combined.includes('thyroid')) embedding[7] += severityDelta * 0.7;
  });

  // Normalize to 0-1
  return embedding.map(v => Math.max(0, Math.min(1, v)));
}

// --- Cosine similarity for case matching ---

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}

// --- Main latent state predictor ---

export function predictLatentHealthState(
  findings: HealthFinding[],
  profile: { age?: number; gender?: string; knownConditions: string[] }
): LatentHealthState {
  const abnormalFindings = findings.filter(f => f.severity !== 'normal');
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const abnormalCount = findings.filter(f => f.severity === 'abnormal').length;
  const borderlineCount = findings.filter(f => f.severity === 'borderline').length;
  const totalFindings = findings.length || 1;

  // --- Metabolic Score ---
  const metabolicFindings = findings.filter(f => {
    const n = f.name.toLowerCase();
    return n.includes('glucose') || n.includes('hba1c') || n.includes('cholesterol') || n.includes('ldl') || n.includes('hdl') || n.includes('triglyceride') || n.includes('insulin');
  });
  const metabolicPenalty = metabolicFindings.reduce((sum, f) => sum + Math.abs(SEVERITY_WEIGHTS[f.severity]), 0);
  const metabolicScore = Math.max(0, Math.min(100, 100 - (metabolicPenalty / Math.max(1, metabolicFindings.length)) * 60));

  // --- Cardiovascular Score ---
  const cardiacFindings = findings.filter(f => {
    const n = f.name.toLowerCase();
    return n.includes('cholesterol') || n.includes('ldl') || n.includes('hdl') || n.includes('blood pressure') || n.includes('bp') || n.includes('troponin') || n.includes('heart');
  });
  const cardiacPenalty = cardiacFindings.reduce((sum, f) => sum + Math.abs(SEVERITY_WEIGHTS[f.severity]), 0);
  const cardiovascularScore = Math.max(0, Math.min(100, 100 - (cardiacPenalty / Math.max(1, cardiacFindings.length)) * 55));
  const cardiovascularRisk = cardiovascularScore > 80 ? 'low' : cardiovascularScore > 60 ? 'moderate' : cardiovascularScore > 40 ? 'high' : 'critical';

  // --- Inflammation Level ---
  const inflammationFindings = findings.filter(f => {
    const n = f.name.toLowerCase();
    return n.includes('crp') || n.includes('esr') || n.includes('inflammation') || n.includes('wbc');
  });
  const inflammationLevel = inflammationFindings.length > 0
    ? Math.min(100, inflammationFindings.reduce((sum, f) => sum + Math.abs(SEVERITY_WEIGHTS[f.severity]) * 80, 0) / inflammationFindings.length)
    : 20; // baseline low
  const inflammationTrend = inflammationLevel < 30 ? 'low' : inflammationLevel < 50 ? 'moderate' : inflammationLevel < 75 ? 'high' : 'severe';

  // --- Immune Score ---
  const immuneFindings = findings.filter(f => {
    const n = f.name.toLowerCase();
    return n.includes('wbc') || n.includes('lymphocyte') || n.includes('immunoglobulin') || n.includes('vitamin d') || n.includes('zinc');
  });
  const immuneScore = immuneFindings.length > 0
    ? Math.max(0, Math.min(100, 100 - immuneFindings.reduce((sum, f) => sum + Math.abs(SEVERITY_WEIGHTS[f.severity]) * 50, 0) / immuneFindings.length))
    : 70;

  // --- Nutritional Score + Deficiencies ---
  const deficiencies: string[] = [];
  Object.entries(NUTRIENT_KEYWORDS).forEach(([deficiency, keywords]) => {
    const hasDeficiency = findings.some(f => {
      const n = f.name.toLowerCase();
      return keywords.some(kw => n.includes(kw)) && (f.severity === 'abnormal' || f.severity === 'borderline' || f.severity === 'critical');
    });
    if (hasDeficiency) deficiencies.push(deficiency);
  });
  const nutritionalScore = Math.max(0, Math.min(100, 100 - deficiencies.length * 20));

  // --- Organ Stress Map ---
  const organStress = {
    liver: 0,
    kidney: 0,
    heart: 0,
    lungs: 0,
    thyroid: 0,
    pancreas: 0,
  };

  Object.entries(ORGAN_KEYWORDS).forEach(([organ, keywords]) => {
    const organFindings = findings.filter(f => {
      const n = f.name.toLowerCase();
      return keywords.some(kw => n.includes(kw));
    });
    if (organFindings.length > 0) {
      const avgSeverity = organFindings.reduce((sum, f) => sum + Math.abs(SEVERITY_WEIGHTS[f.severity]), 0) / organFindings.length;
      organStress[organ as keyof typeof organStress] = Math.round(avgSeverity * 80);
    }
  });

  // --- Predicted Hidden Variables (JEPA core: predict what should exist) ---

  // Biological age (inferred from organ stress + risk factors)
  const totalOrganStress = Object.values(organStress).reduce((sum, v) => sum + v, 0) / 6;
  const ageBase = profile.age || 30;
  const biologicalAge = Math.round(ageBase + (totalOrganStress > 40 ? (totalOrganStress - 40) * 0.3 : -5));

  // Energy level (inferred from metabolic + nutritional + sleep)
  const energyLevel = Math.round((metabolicScore * 0.4 + nutritionalScore * 0.3 + immuneScore * 0.3));

  // Sleep quality (inferred from stress + thyroid + inflammation)
  const sleepQuality = Math.round(Math.max(20, 100 - inflammationLevel * 0.5 - (organStress.thyroid > 40 ? 20 : 0)));

  // Stress level (inferred from cortisol proxy: BP + heart rate + inflammation)
  const stressLevel = Math.round(Math.min(100, (100 - cardiovascularScore) * 0.4 + inflammationLevel * 0.4 + (criticalCount > 0 ? 20 : 0)));

  // Recovery capacity (inferred from immune + nutritional + age)
  const recoveryCapacity = Math.round(Math.max(20, (immuneScore * 0.4 + nutritionalScore * 0.3 + (100 - Math.max(0, biologicalAge - ageBase) * 2) * 0.3)));

  // --- Trajectory prediction ---
  const metabolicTrajectory: LatentHealthState['metabolicTrajectory'] =
    metabolicScore > 70 ? 'improving' : metabolicScore > 50 ? 'stable' : 'declining';

  // --- Confidence (based on data completeness) ---
  const dataPoints = findings.length;
  const confidence = Math.min(95, Math.round(30 + dataPoints * 10 + (abnormalFindings.length > 0 ? 15 : 0)));

  // --- Health embedding ---
  const healthEmbedding = generateEmbedding(findings);

  return {
    metabolicScore: Math.round(metabolicScore),
    metabolicTrajectory,
    cardiovascularScore: Math.round(cardiovascularScore),
    cardiovascularRisk,
    inflammationLevel: Math.round(inflammationLevel),
    inflammationTrend,
    immuneScore: Math.round(immuneScore),
    nutritionalScore: Math.round(nutritionalScore),
    deficiencies,
    organStress,
    healthEmbedding,
    predicted: {
      biologicalAge,
      energyLevel,
      sleepQuality,
      stressLevel,
      recoveryCapacity,
    },
    confidence,
  };
}

// --- Similar case patterns (for pattern matching) ---

export interface SimilarCase {
  id: string;
  label: string;
  similarity: number;  // 0-1
  outcome: string;
  recommendedAction: string;
}

// Predefined health patterns for matching (would be a database in production)
const HEALTH_PATTERNS: SimilarCase[] = [
  {
    id: 'pattern-metabolic-syndrome',
    label: 'Metabolic Syndrome Pattern',
    similarity: 0,
    outcome: 'High risk of Type 2 Diabetes within 5 years if untreated',
    recommendedAction: 'Lifestyle intervention: diet + 150min/week exercise + weight management',
  },
  {
    id: 'pattern-cardiovascular-risk',
    label: 'Cardiovascular Risk Pattern',
    similarity: 0,
    outcome: 'Elevated 10-year cardiac event risk',
    recommendedAction: 'Statins consideration, BP control, Mediterranean diet',
  },
  {
    id: 'pattern-inflammatory',
    label: 'Chronic Inflammation Pattern',
    similarity: 0,
    outcome: 'Accelerated aging and immune dysregulation',
    recommendedAction: 'Anti-inflammatory diet, stress reduction, sleep optimization',
  },
  {
    id: 'pattern-nutritional-deficiency',
    label: 'Nutritional Deficiency Pattern',
    similarity: 0,
    outcome: 'Fatigue, impaired immunity, poor recovery',
    recommendedAction: 'Targeted supplementation, dietary diversification',
  },
  {
    id: 'pattern-healthy',
    label: 'Optimal Health Pattern',
    similarity: 0,
    outcome: 'Low risk trajectory, maintain current lifestyle',
    recommendedAction: 'Continue preventive health monitoring annually',
  },
];

export function findSimilarPatterns(state: LatentHealthState): SimilarCase[] {
  const patterns = HEALTH_PATTERNS.map(p => {
    let sim = 0;
    if (p.id === 'pattern-metabolic-syndrome' && state.metabolicScore < 60) {
      sim = (60 - state.metabolicScore) / 60 * 0.9;
    }
    if (p.id === 'pattern-cardiovascular-risk' && state.cardiovascularScore < 60) {
      sim = (60 - state.cardiovascularScore) / 60 * 0.9;
    }
    if (p.id === 'pattern-inflammatory' && state.inflammationLevel > 50) {
      sim = (state.inflammationLevel - 50) / 50 * 0.85;
    }
    if (p.id === 'pattern-nutritional-deficiency' && state.deficiencies.length > 0) {
      sim = Math.min(0.9, state.deficiencies.length * 0.3);
    }
    if (p.id === 'pattern-healthy' && state.metabolicScore > 75 && state.cardiovascularScore > 75) {
      sim = 0.8;
    }
    return { ...p, similarity: Math.round(sim * 100) / 100 };
  });

  return patterns.filter(p => p.similarity > 0.3).sort((a, b) => b.similarity - a.similarity);
}
