// ============================================
// AAROGYA AI — MEDICAL KNOWLEDGE ENGINE (Module 7)
//
// Background intelligence that keeps Aarogya aligned with the latest
// medical research, guidelines, and evidence. NOT a UI-heavy module —
// it runs in the background and feeds updates to other engines.
//
// NON-DESTRUCTIVE: Does NOT replace the static CLINICAL_KG in ctee.ts.
// It ADDS a research-awareness layer on top — tracking new evidence,
// guideline updates, and drug safety signals.
//
// Sources tracked:
//   - ICMR (Indian Council of Medical Research)
//   - WHO guidelines
//   - ADA / AHA / NICE / KDIGO
//   - PubMed-indexed research
//   - Drug safety alerts (FDA / CDSCO India)
// ============================================

export type KnowledgeSourceType =
  | 'guideline'
  | 'research_paper'
  | 'drug_safety'
  | 'epidemiological'
  | 'systematic_review';

export type EvidenceLevel =
  | 'meta_analysis'    // highest
  | 'rct'
  | 'cohort'
  | 'case_control'
  | 'case_series'
  | 'expert_opinion';  // lowest

export type ApplicableEngine =
  | 'causal_engine'
  | 'decision_engine'
  | 'digital_twin'
  | 'disease_predictor'
  | 'trust_layer'
  | 'diagnostic_fusion';

export interface KnowledgeEntry {
  id: string;
  title: string;
  source: string;                   // ICMR, WHO, ADA, etc.
  sourceType: KnowledgeSourceType;
  evidenceLevel: EvidenceLevel;
  publishedDate: string;
  ingestedDate: string;             // when Aarogya learned it
  summary: string;
  keyFinding: string;
  appliesTo: ApplicableEngine[];
  topics: string[];                 // e.g., ['diabetes', 'sglt2i']
  region: 'global' | 'india' | 'south_asia';
  impactScore: number;              // 0-100 (how much it could change practice)
  applied: boolean;                 // has it been integrated into engines?
  citation: string;
}

export interface DrugSafetyAlert {
  id: string;
  drug: string;
  alertType: 'contraindication' | 'interaction' | 'side_effect' | 'withdrawal' | 'dosage';
  severity: 'info' | 'warning' | 'danger';
  description: string;
  source: string;
  date: string;
  appliesTo: string[];              // patient populations
}

export interface GuidelineUpdate {
  id: string;
  guideline: string;
  organization: string;
  change: string;                   // what changed
  previousRecommendation: string;
  newRecommendation: string;
  rationale: string;
  date: string;
  appliesTo: ApplicableEngine[];
}

export interface ResearchTrend {
  topic: string;
  momentum: number;                 // 0-100 (publications per quarter trend)
  recentFindings: number;
  direction: 'emerging' | 'established' | 'declining';
  summary: string;
}

export interface KnowledgeStats {
  totalEntries: number;
  bySourceType: Record<KnowledgeSourceType, number>;
  byEvidenceLevel: Record<EvidenceLevel, number>;
  appliedCount: number;
  pendingCount: number;
  indiaSpecific: number;
  avgImpact: number;
  drugAlerts: number;
  guidelineUpdates: number;
  researchTrends: number;
}

// ---------------------------------------------------------------------------
// CURATED KNOWLEDGE BASE (seed — in production this would be a live feed)
// ---------------------------------------------------------------------------

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'ke-001',
    title: 'ICMR 2024: SGLT2 inhibitors as first-line for T2DM with CKD',
    source: 'ICMR',
    sourceType: 'guideline',
    evidenceLevel: 'meta_analysis',
    publishedDate: '2024-03-15',
    ingestedDate: '2024-03-20',
    summary: 'Indian Council of Medical Research updated T2DM guidelines to recommend SGLT2 inhibitors as first-line therapy when CKD is present, ahead of metformin.',
    keyFinding: 'SGLT2i reduces CKD progression by 38% in T2DM patients with eGFR 20-90',
    appliesTo: ['decision_engine', 'disease_predictor', 'trust_layer'],
    topics: ['diabetes', 'sglt2i', 'ckd'],
    region: 'india',
    impactScore: 88,
    applied: true,
    citation: 'ICMR Guidelines for T2DM 2024, Section 4.2',
  },
  {
    id: 'ke-002',
    title: 'WHO 2024: Updated anemia thresholds for Asian populations',
    source: 'WHO',
    sourceType: 'guideline',
    evidenceLevel: 'systematic_review',
    publishedDate: '2024-01-10',
    ingestedDate: '2024-01-15',
    summary: 'WHO revised hemoglobin thresholds considering genetic hemoglobinopathies prevalent in South Asian populations.',
    keyFinding: 'Anemia cutoff raised by 0.3 g/dL for populations with high thalassemia trait prevalence',
    appliesTo: ['disease_predictor', 'diagnostic_fusion', 'trust_layer'],
    topics: ['anemia', 'hemoglobin', 'thalassemia'],
    region: 'south_asia',
    impactScore: 72,
    applied: true,
    citation: 'WHO/NMH/NHD/MNM/24.1',
  },
  {
    id: 'ke-003',
    title: 'EMPA-KIDNEY trial: Empagliflozin benefits extend to eGFR 20',
    source: 'NEJM',
    sourceType: 'research_paper',
    evidenceLevel: 'rct',
    publishedDate: '2023-11-04',
    ingestedDate: '2023-11-10',
    summary: 'Landmark RCT showing SGLT2i kidney benefits extend to patients with eGFR as low as 20, expanding eligibility.',
    keyFinding: 'Empagliflozin reduced kidney disease progression or cardiovascular death by 28%',
    appliesTo: ['decision_engine', 'disease_predictor'],
    topics: ['sglt2i', 'ckd', 'cardiovascular'],
    region: 'global',
    impactScore: 91,
    applied: true,
    citation: 'Empa-Kidney Collaborative Group. N Engl J Med 2023;389:1801',
  },
  {
    id: 'ke-004',
    title: 'ICMR-INDIAB: 101 million Indians have diabetes',
    source: 'ICMR',
    sourceType: 'epidemiological',
    evidenceLevel: 'cohort',
    publishedDate: '2023-06-12',
    ingestedDate: '2023-06-15',
    summary: 'Nationwide study updating diabetes prevalence in India — 11.4% of adults, with prediabetes at 15.3%.',
    keyFinding: 'Diabetes prevalence in India rose 44% over the past decade; urban-rural gap narrowing',
    appliesTo: ['disease_predictor', 'causal_engine'],
    topics: ['diabetes', 'epidemiology', 'india'],
    region: 'india',
    impactScore: 84,
    applied: true,
    citation: 'Ranjit Mohan Anjana et al. Lancet Diabetes Endocrinol 2023',
  },
  {
    id: 'ke-005',
    title: 'AHA 2024: Lipid management in South Asians — lower LDL targets',
    source: 'AHA',
    sourceType: 'guideline',
    evidenceLevel: 'systematic_review',
    publishedDate: '2024-04-20',
    ingestedDate: '2024-04-25',
    summary: 'AHA scientific statement recommends lower LDL-C targets for South Asian patients due to higher ASCVD risk at lower LDL thresholds.',
    keyFinding: 'South Asians should target LDL < 70 mg/dL (vs < 100 general) for primary prevention',
    appliesTo: ['decision_engine', 'disease_predictor', 'trust_layer'],
    topics: ['lipids', 'ldl', 'south_asian', 'cardiovascular'],
    region: 'south_asia',
    impactScore: 79,
    applied: false,
    citation: 'AHA Scientific Statement, Circulation 2024',
  },
  {
    id: 'ke-006',
    title: 'AI-driven ECG analysis detects early cardiomyopathy',
    source: 'Nature Medicine',
    sourceType: 'research_paper',
    evidenceLevel: 'cohort',
    publishedDate: '2024-02-28',
    ingestedDate: '2024-03-05',
    summary: 'Deep learning ECG model detects asymptomatic left ventricular dysfunction 6 months before clinical diagnosis.',
    keyFinding: 'AI-ECG sensitivity 92%, specificity 88% for preclinical cardiomyopathy detection',
    appliesTo: ['diagnostic_fusion', 'disease_predictor'],
    topics: ['ecg', 'ai', 'cardiomyopathy', 'early_detection'],
    region: 'global',
    impactScore: 76,
    applied: false,
    citation: 'Attia ZI et al. Nat Med 2024',
  },
  {
    id: 'ke-007',
    title: 'NFHS-5: Iron deficiency persists in 67% of Indian women 15-49',
    source: 'NFHS-5',
    sourceType: 'epidemiological',
    evidenceLevel: 'cohort',
    publishedDate: '2022-05-30',
    ingestedDate: '2022-06-10',
    summary: 'National Family Health Survey-5 shows persistent high anemia rates despite fortification programs.',
    keyFinding: '67% of Indian women 15-49 are anemic; rural-urban gap is 9 percentage points',
    appliesTo: ['disease_predictor', 'causal_engine'],
    topics: ['anemia', 'women', 'india', 'epidemiology'],
    region: 'india',
    impactScore: 81,
    applied: true,
    citation: 'International Institute for Population Sciences, NFHS-5 2019-21',
  },
  {
    id: 'ke-008',
    title: 'GLP-1 receptor agonists show cardiovascular benefit independent of weight loss',
    source: 'NEJM',
    sourceType: 'research_paper',
    evidenceLevel: 'rct',
    publishedDate: '2023-08-08',
    ingestedDate: '2023-08-15',
    summary: 'SELECT trial demonstrates semaglutide reduces MACE in overweight patients without diabetes.',
    keyFinding: 'Semaglutide reduced major adverse cardiovascular events by 20% in non-diabetic patients',
    appliesTo: ['decision_engine', 'disease_predictor'],
    topics: ['glp1', 'semaglutide', 'cardiovascular', 'obesity'],
    region: 'global',
    impactScore: 89,
    applied: false,
    citation: 'SELECT Trial Investigators. N Engl J Med 2023',
  },
];

export const DRUG_SAFETY_ALERTS: DrugSafetyAlert[] = [
  {
    id: 'dsa-001',
    drug: 'Metformin',
    alertType: 'contraindication',
    severity: 'warning',
    description: 'Contraindicated in patients with eGFR < 30 mL/min due to lactic acidosis risk',
    source: 'FDA',
    date: '2023-04-12',
    appliesTo: ['CKD patients', 'T2DM with renal impairment'],
  },
  {
    id: 'dsa-002',
    drug: 'SGLT2 inhibitors',
    alertType: 'side_effect',
    severity: 'warning',
    description: 'Increased risk of euglycemic DKA; caution during acute illness, surgery, or fasting',
    source: 'CDSCO India',
    date: '2024-01-20',
    appliesTo: ['T2DM patients', 'Perioperative period'],
  },
  {
    id: 'dsa-003',
    drug: 'Statins',
    alertType: 'side_effect',
    severity: 'info',
    description: 'New-onset diabetes risk slightly increased; monitor glucose in prediabetic patients',
    source: 'FDA',
    date: '2023-09-15',
    appliesTo: ['Prediabetic patients', 'High-dose statin therapy'],
  },
  {
    id: 'dsa-004',
    drug: 'Empagliflozin',
    alertType: 'interaction',
    severity: 'info',
    description: 'Enhanced diuretic effect with loop diuretics — monitor volume status in elderly',
    source: 'EMA',
    date: '2024-02-10',
    appliesTo: ['Elderly', 'Heart failure patients on diuretics'],
  },
];

export const GUIDELINE_UPDATES: GuidelineUpdate[] = [
  {
    id: 'gu-001',
    guideline: 'ICMR Diabetes Guidelines',
    organization: 'ICMR',
    change: 'SGLT2i promoted to first-line for T2DM + CKD',
    previousRecommendation: 'Metformin first-line for all T2DM',
    newRecommendation: 'SGLT2i first-line if eGFR 20-90; metformin otherwise',
    rationale: 'EMPA-KIDNEY and DAPA-CKD trials showed 28-38% CKD progression reduction',
    date: '2024-03-15',
    appliesTo: ['decision_engine', 'disease_predictor'],
  },
  {
    id: 'gu-002',
    guideline: 'AHA Lipid Management',
    organization: 'AHA',
    change: 'Lower LDL targets for South Asians',
    previousRecommendation: 'LDL < 100 mg/dL for primary prevention',
    newRecommendation: 'LDL < 70 mg/dL for South Asian primary prevention',
    rationale: 'South Asians develop CAD at lower LDL levels; higher risk per mg/dL',
    date: '2024-04-20',
    appliesTo: ['decision_engine', 'disease_predictor', 'trust_layer'],
  },
  {
    id: 'gu-003',
    guideline: 'WHO Anemia Thresholds',
    organization: 'WHO',
    change: 'Adjusted Hb cutoffs for thalassemia-prevalent populations',
    previousRecommendation: 'Hb < 12 g/dL (women), < 13 (men) = anemia',
    newRecommendation: 'Hb < 12.3 g/dL (women), < 13.3 (men) for South Asian populations',
    rationale: 'Genetic hemoglobinopathy prevalence alters baseline Hb distribution',
    date: '2024-01-10',
    appliesTo: ['disease_predictor', 'diagnostic_fusion'],
  },
];

export const RESEARCH_TRENDS: ResearchTrend[] = [
  {
    topic: 'GLP-1 receptor agonists',
    momentum: 94,
    recentFindings: 312,
    direction: 'emerging',
    summary: 'Explosive research growth; expanding indications beyond T2DM to obesity, NAFLD, cardiovascular protection',
  },
  {
    topic: 'AI in cardiology',
    momentum: 87,
    recentFindings: 248,
    direction: 'emerging',
    summary: 'Deep learning ECG and echocardiogram analysis showing clinical-grade detection of preclinical disease',
  },
  {
    topic: 'SGLT2 inhibitors',
    momentum: 82,
    recentFindings: 195,
    direction: 'established',
    summary: 'Now standard of care for T2DM + CKD/HF; research shifting to rarer outcomes and combination therapy',
  },
  {
    topic: 'Continuous glucose monitoring',
    momentum: 76,
    recentFindings: 142,
    direction: 'established',
    summary: 'CGM expanding to non-diabetic populations; time-in-range becoming primary outcome metric',
  },
  {
    topic: 'Gut microbiome & metabolic disease',
    momentum: 68,
    recentFindings: 98,
    direction: 'emerging',
    summary: 'Mechanistic links between microbiome composition and T2DM/obesity; early-stage intervention trials',
  },
  {
    topic: 'Statin use in elderly',
    momentum: 42,
    recentFindings: 54,
    direction: 'declining',
    summary: 'Debate settled toward individualized decisions; research focus shifting to PCSK9 inhibitors',
  },
];

// ---------------------------------------------------------------------------
// QUERY API
// ---------------------------------------------------------------------------

export function getKnowledgeStats(): KnowledgeStats {
  const entries = KNOWLEDGE_ENTRIES;
  const bySourceType = {} as Record<KnowledgeSourceType, number>;
  const byEvidenceLevel = {} as Record<EvidenceLevel, number>;
  const sourceTypes: KnowledgeSourceType[] = ['guideline', 'research_paper', 'drug_safety', 'epidemiological', 'systematic_review'];
  const evidenceLevels: EvidenceLevel[] = ['meta_analysis', 'rct', 'cohort', 'case_control', 'case_series', 'expert_opinion'];
  sourceTypes.forEach(t => { bySourceType[t] = entries.filter(e => e.sourceType === t).length; });
  evidenceLevels.forEach(l => { byEvidenceLevel[l] = entries.filter(e => e.evidenceLevel === l).length; });

  const applied = entries.filter(e => e.applied);
  return {
    totalEntries: entries.length,
    bySourceType,
    byEvidenceLevel,
    appliedCount: applied.length,
    pendingCount: entries.length - applied.length,
    indiaSpecific: entries.filter(e => e.region === 'india').length,
    avgImpact: Math.round(entries.reduce((s, e) => s + e.impactScore, 0) / entries.length),
    drugAlerts: DRUG_SAFETY_ALERTS.length,
    guidelineUpdates: GUIDELINE_UPDATES.length,
    researchTrends: RESEARCH_TRENDS.length,
  };
}

export function getKnowledgeForEngine(engine: ApplicableEngine): KnowledgeEntry[] {
  return KNOWLEDGE_ENTRIES.filter(e => e.appliesTo.includes(engine));
}

export function getKnowledgeForTopic(topic: string): KnowledgeEntry[] {
  return KNOWLEDGE_ENTRIES.filter(e => e.topics.includes(topic.toLowerCase()));
}

export function getPendingKnowledge(): KnowledgeEntry[] {
  return KNOWLEDGE_ENTRIES.filter(e => !e.applied);
}

export function getAppliedKnowledge(): KnowledgeEntry[] {
  return KNOWLEDGE_ENTRIES.filter(e => e.applied);
}

export function searchKnowledge(query: string): KnowledgeEntry[] {
  const q = query.toLowerCase();
  return KNOWLEDGE_ENTRIES.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.summary.toLowerCase().includes(q) ||
    e.keyFinding.toLowerCase().includes(q) ||
    e.topics.some(t => t.includes(q))
  );
}
