// ============================================
// AAROGYA AI — MEDICAL KNOWLEDGE ENGINE (MKE)
// Background intelligence — stays updated with medical research.
//
// This is a BACKGROUND library, not a UI module.
// Other modules query it for clinical knowledge.
//
// Provides:
// - Disease-symptom mappings
// - Drug interaction data
// - Clinical guideline references
// - Reference ranges (Indian population)
// - Latest research summaries
// ============================================

export interface DiseaseInfo {
  id: string;
  name: string;
  icdCode: string;
  symptoms: string[];
  riskFactors: string[];
  preventions: string[];
  earlySigns: string[];
  indianPrevalence: string;
  recommendedScreening: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe' | 'contraindicated';
  effect: string;
  action: string;
}

export interface ClinicalGuideline {
  condition: string;
  source: string;
  recommendation: string;
  evidenceLevel: 'A' | 'B' | 'C';
}

export interface ReferenceRange {
  test: string;
  male: [number, number];
  female: [number, number];
  unit: string;
  indianContext: string;
}

const DISEASES: DiseaseInfo[] = [
  { id: 'htn', name: 'Hypertension', icdCode: 'I10', symptoms: ['Headache', 'Dizziness', 'Blurred vision', 'Chest pain'], riskFactors: ['High salt intake', 'Stress', 'Obesity', 'Family history', 'Alcohol'], preventions: ['Reduce salt <5g/day', 'Exercise 150 min/week', 'Mediterranean/DASH diet', 'Stress management'], earlySigns: ['BP consistently >130/85', 'Morning headaches', 'Reduced exercise tolerance'], indianPrevalence: '28.5% of Indian adults (ICMR-INDIAB)', recommendedScreening: 'Annual BP check from age 18' },
  { id: 't2dm', name: 'Type 2 Diabetes', icdCode: 'E11', symptoms: ['Excessive thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Slow healing'], riskFactors: ['BMI >25', 'Family history', 'Sedentary lifestyle', 'High sugar diet', 'Age >40'], preventions: ['Weight loss 5-7%', '150 min/week exercise', 'Low GI diet', 'Regular screening'], earlySigns: ['HbA1c 5.7-6.4%', 'Fasting glucose 100-125', 'Post-meal fatigue'], indianPrevalence: '10.1% of Indian adults (ICMR-INDIAB)', recommendedScreening: 'HbA1c every 3 years from age 35' },
  { id: 'cad', name: 'Coronary Artery Disease', icdCode: 'I25', symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Palpitations'], riskFactors: ['Hypertension', 'Diabetes', 'High LDL', 'Smoking', 'Family history'], preventions: ['Control BP <130/80', 'LDL <100', 'Quit smoking', 'Daily exercise'], earlySigns: ['Exercise-induced chest tightness', 'New fatigue', 'ED in men >40'], indianPrevalence: '8.5% of Indian adults (PURE India)', recommendedScreening: 'Lipid panel annually, ECG if symptomatic' },
  { id: 'hypothyroid', name: 'Hypothyroidism', icdCode: 'E03', symptoms: ['Fatigue', 'Weight gain', 'Cold sensitivity', 'Dry skin', 'Constipation'], riskFactors: ['Female', 'Age >60', 'Family history', 'Iodine deficiency'], preventions: ['Adequate iodine intake', 'Regular screening if at risk'], earlySigns: ['TSH >4.0', 'Unexplained fatigue', 'Weight gain without diet change'], indianPrevalence: '11.4% of Indian adults (various studies)', recommendedScreening: 'TSH every 5 years from age 35' },
  { id: 'osa', name: 'Obstructive Sleep Apnea', icdCode: 'G47.3', symptoms: ['Loud snoring', 'Daytime sleepiness', 'Morning headache', 'Poor concentration'], riskFactors: ['BMI >30', 'Neck circumference >40cm', 'Male', 'Age >40'], preventions: ['Weight management', 'Avoid alcohol before bed', 'Side sleeping'], earlySigns: ['Snoring with pauses', 'Morning headaches', 'Daytime fatigue'], indianPrevalence: '8.6% of Indian adults (AIIMS study)', recommendedScreening: 'STOP-BANG questionnaire, polysomnography if positive' },
];

const DRUG_INTERACTIONS: DrugInteraction[] = [
  { drug1: 'Metformin', drug2: 'Alcohol', severity: 'severe', effect: 'Lactic acidosis risk', action: 'Avoid alcohol completely' },
  { drug1: 'Warfarin', drug2: 'Aspirin', severity: 'contraindicated', effect: 'Severe bleeding', action: 'Do not combine' },
  { drug1: 'Amlodipine', drug2: 'Grapefruit', severity: 'moderate', effect: 'Increased drug levels', action: 'Avoid grapefruit juice' },
  { drug1: 'Metformin', drug2: 'Contrast dye', severity: 'severe', effect: 'Lactic acidosis', action: 'Stop metformin 48h before contrast' },
  { drug1: 'ACE inhibitors', drug2: 'Potassium supplements', severity: 'moderate', effect: 'Hyperkalemia', action: 'Monitor potassium levels' },
  { drug1: 'Statins', drug2: 'Macrolide antibiotics', severity: 'severe', effect: 'Rhabdomyolysis risk', action: 'Use alternative antibiotic' },
  { drug1: 'SSRIs', drug2: 'NSAIDs', severity: 'moderate', effect: 'GI bleeding risk', action: 'Use PPI co-prescription' },
  { drug1: 'Telmisartan', drug2: 'Lithium', severity: 'severe', effect: 'Lithium toxicity', action: 'Monitor lithium levels closely' },
];

const GUIDELINES: ClinicalGuideline[] = [
  { condition: 'Hypertension', source: 'ICMR Guidelines 2023', recommendation: 'Lifestyle first for Stage 1, medication if >140/90 or target organ damage', evidenceLevel: 'A' },
  { condition: 'Type 2 Diabetes', source: 'ICMR-INDIAB Guidelines', recommendation: 'Metformin first-line if HbA1c <8%, add SGLT2i if CV risk', evidenceLevel: 'A' },
  { condition: 'Dyslipidemia', source: 'API Guidelines', recommendation: 'Statins if LDL >130 with risk factors, >190 without', evidenceLevel: 'A' },
  { condition: 'Hypothyroidism', source: 'ETA Guidelines', recommendation: 'Levothyroxine if TSH >10, monitor if 4.5-10', evidenceLevel: 'B' },
  { condition: 'Sleep Apnea', source: 'AASM Guidelines', recommendation: 'CPAP for moderate-severe OSA, weight loss for all', evidenceLevel: 'A' },
];

const REFERENCE_RANGES: ReferenceRange[] = [
  { test: 'Hemoglobin', male: [13.0, 17.0], female: [12.0, 15.0], unit: 'g/dL', indianContext: 'Lower cutoffs than Western due to higher anemia prevalence' },
  { test: 'Fasting Glucose', male: [70, 100], female: [70, 100], unit: 'mg/dL', indianContext: 'ICMR uses same cutoffs; Indians develop diabetes at lower BMI' },
  { test: 'HbA1c', male: [4.0, 5.6], female: [4.0, 5.6], unit: '%', indianContext: 'Prediabetes 5.7-6.4%; diabetes ≥6.5%' },
  { test: 'TSH', male: [0.4, 4.0], female: [0.4, 4.0], unit: 'mIU/L', indianContext: 'Subclinical hypothyroidism common in Indian women' },
  { test: 'Vitamin D', male: [30, 100], female: [30, 100], unit: 'ng/mL', indianContext: 'Deficiency <20 is extremely common in India despite sunlight' },
  { test: 'Vitamin B12', male: [200, 900], female: [200, 900], unit: 'pg/mL', indianContext: 'High deficiency rate among Indian vegetarians' },
  { test: 'LDL Cholesterol', male: [0, 100], female: [0, 100], unit: 'mg/dL', indianContext: 'Target <70 if diabetes or CAD' },
  { test: 'Creatinine', male: [0.6, 1.2], female: [0.5, 1.1], unit: 'mg/dL', indianContext: 'Indian eGFR calculation uses same MDRD formula' },
  { test: 'TSH', male: [0.4, 4.0], female: [0.4, 4.0], unit: 'mIU/L', indianContext: 'Upper limit may be 4.5 in Indian populations' },
];

// ============================================
// QUERY FUNCTIONS (used by other modules)
// ============================================

export function getDiseaseInfo(diseaseId: string): DiseaseInfo | undefined {
  return DISEASES.find(d => d.id === diseaseId);
}

export function searchDiseasesBySymptom(symptom: string): DiseaseInfo[] {
  return DISEASES.filter(d => d.symptoms.some(s => s.toLowerCase().includes(symptom.toLowerCase())));
}

export function checkDrugInteraction(drug1: string, drug2: string): DrugInteraction | undefined {
  return DRUG_INTERACTIONS.find(di =>
    (di.drug1.toLowerCase().includes(drug1.toLowerCase()) && di.drug2.toLowerCase().includes(drug2.toLowerCase())) ||
    (di.drug1.toLowerCase().includes(drug2.toLowerCase()) && di.drug2.toLowerCase().includes(drug1.toLowerCase()))
  );
}

export function getGuideline(condition: string): ClinicalGuideline | undefined {
  return GUIDELINES.find(g => g.condition.toLowerCase().includes(condition.toLowerCase()));
}

export function getReferenceRange(test: string, gender: 'male' | 'female'): ReferenceRange | undefined {
  return REFERENCE_RANGES.find(r => r.test.toLowerCase().includes(test.toLowerCase()));
}

export function getIndianPrevalence(diseaseId: string): string {
  const disease = DISEASES.find(d => d.id === diseaseId);
  return disease?.indianPrevalence || 'Data not available';
}

export function getEarlySigns(diseaseId: string): string[] {
  const disease = DISEASES.find(d => d.id === diseaseId);
  return disease?.earlySigns || [];
}

export function getAllDiseases(): DiseaseInfo[] {
  return DISEASES;
}

export function getAllGuidelines(): ClinicalGuideline[] {
  return GUIDELINES;
}

export function getAllReferenceRanges(): ReferenceRange[] {
  return REFERENCE_RANGES;
}
