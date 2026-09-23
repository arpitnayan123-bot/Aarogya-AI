// ============================================
// Aarogya AI — Multi-Disease Risk Predictor
// Based on Kaggle Clinical Datasets:
// - Heart Disease Dataset (1,888 records)
// - Pima Indians Diabetes Database (768 records)
// - Indian Liver Patient Dataset
// - Chronic Kidney Disease Dataset
// - Breast Cancer Wisconsin Dataset
// ============================================

export type DiseaseType = 'heart' | 'diabetes' | 'liver' | 'kidney' | 'breast_cancer';

export interface DiseasePrediction {
  disease: DiseaseType;
  risk: 'Low' | 'Moderate' | 'High';
  riskScore: number; // 0-100
  factors: string[];
  recommendations: string[];
  lifestyleChanges: string[];
  whenToSeeDoctor: string[];
}

// ============================================
// HEART DISEASE RISK CALCULATOR
// Based on: Heart Disease Prediction Dataset (Kaggle)
// Features: Age, Sex, Chest Pain Type, BP, Cholesterol, etc.
// ============================================

interface HeartInputs {
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical' | 'atypical' | 'non-anginal' | 'asymptomatic';
  restingBP: number; // mm Hg
  cholesterol: number; // mg/dl
  fastingBloodSugar: boolean; // > 120 mg/dl
  restingECG: 'normal' | 'abnormal' | 'hypertrophy';
  maxHeartRate: number;
  exerciseAngina: boolean;
  oldpeak: number; // ST depression
  slope: 'upsloping' | 'flat' | 'downsloping';
  majorVessels: number; // 0-3
  thalassemia: 'normal' | 'fixed' | 'reversible';
}

export const predictHeartDisease = (inputs: HeartInputs): DiseasePrediction => {
  let score = 0;
  const factors: string[] = [];

  // Age factor (strong predictor)
  if (inputs.age >= 60) { score += 20; factors.push('Age ≥60 years'); }
  else if (inputs.age >= 45) { score += 15; factors.push('Age 45-59 years'); }
  else if (inputs.age >= 35) { score += 8; factors.push('Age 35-44 years'); }

  // Sex factor
  if (inputs.sex === 'male' && inputs.age >= 45) { score += 8; factors.push('Male gender (higher risk after 45)'); }

  // Chest pain type (critical)
  if (inputs.chestPainType === 'asymptomatic') { score += 15; factors.push('Asymptomatic chest pain (highest risk)'); }
  else if (inputs.chestPainType === 'non-anginal') { score += 5; }

  // Blood pressure
  if (inputs.restingBP >= 160) { score += 18; factors.push('Severe hypertension (≥160 mmHg)'); }
  else if (inputs.restingBP >= 140) { score += 12; factors.push('Hypertension (≥140 mmHg)'); }
  else if (inputs.restingBP >= 130) { score += 6; factors.push('Elevated BP (130-139 mmHg)'); }

  // Cholesterol
  if (inputs.cholesterol >= 280) { score += 15; factors.push('Very high cholesterol (≥280 mg/dL)'); }
  else if (inputs.cholesterol >= 240) { score += 10; factors.push('High cholesterol (≥240 mg/dL)'); }
  else if (inputs.cholesterol >= 200) { score += 5; factors.push('Borderline cholesterol (200-239 mg/dL)'); }

  // Fasting blood sugar
  if (inputs.fastingBloodSugar) { score += 6; factors.push('Elevated fasting blood sugar (>120 mg/dL)'); }

  // Max heart rate (lower is worse)
  const predictedMaxHR = 220 - inputs.age;
  if (inputs.maxHeartRate < predictedMaxHR * 0.7) { score += 10; factors.push('Low exercise tolerance'); }

  // Exercise-induced angina (strong predictor)
  if (inputs.exerciseAngina) { score += 15; factors.push('Exercise-induced angina'); }

  // ST depression (oldpeak)
  if (inputs.oldpeak >= 3) { score += 12; factors.push('Significant ST depression (≥3mm)'); }
  else if (inputs.oldpeak >= 1.5) { score += 8; factors.push('Moderate ST depression'); }

  // Slope (downsloping is worst)
  if (inputs.slope === 'downsloping') { score += 8; factors.push('Downsloping ST segment'); }

  // Major vessels (0-3)
  score += inputs.majorVessels * 8;
  if (inputs.majorVessels >= 2) factors.push(`${inputs.majorVessels} major vessels with fluoroscopy`);

  // Thalassemia
  if (inputs.thalassemia === 'reversible') { score += 10; factors.push('Reversible thalassemia defect'); }
  else if (inputs.thalassemia === 'fixed') { score += 6; }

  const riskScore = Math.min(100, score);
  const risk = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Moderate' : 'Low';

  return {
    disease: 'heart',
    risk,
    riskScore,
    factors,
    recommendations: [
      'Monitor blood pressure weekly',
      'Get lipid panel every 6 months',
      'Maintain healthy weight (BMI 18.5-24.9)',
      'Quit smoking if applicable',
      'Limit alcohol to ≤1 drink/day',
      'Manage stress through meditation/yoga'
    ],
    lifestyleChanges: [
      'DASH diet (low sodium, high potassium)',
      '150 min/week moderate aerobic exercise',
      'Avoid trans fats and processed foods',
      'Increase omega-3 fatty acids (fish, flaxseed)',
      'Practice deep breathing for 10 min daily'
    ],
    whenToSeeDoctor: [
      'Chest pain or discomfort lasting >5 minutes',
      'Pain radiating to arm, jaw, or back',
      'Sudden shortness of breath',
      'Dizziness or fainting',
      'Irregular heartbeat with symptoms'
    ]
  };
};

// ============================================
// DIABETES RISK CALCULATOR
// Based on: Pima Indians Diabetes Database (Kaggle)
// Features: Pregnancies, Glucose, BP, BMI, Insulin, Age, etc.
// ============================================

interface DiabetesInputs {
  pregnancies: number;
  glucose: number; // mg/dL (2-hour oral glucose tolerance)
  bloodPressure: number; // mm Hg
  skinThickness: number; // mm (triceps skin fold)
  insulin: number; // mu U/ml (2-hour serum)
  bmi: number;
  diabetesPedigree: number; // genetic predisposition
  age: number;
}

export const predictDiabetes = (inputs: DiabetesInputs): DiseasePrediction => {
  let score = 0;
  const factors: string[] = [];

  // Glucose (strongest predictor)
  if (inputs.glucose >= 200) { score += 25; factors.push('Very high glucose (≥200 mg/dL)'); }
  else if (inputs.glucose >= 140) { score += 18; factors.push('High glucose (≥140 mg/dL)'); }
  else if (inputs.glucose >= 126) { score += 12; factors.push('Diabetic range glucose (≥126 mg/dL)'); }
  else if (inputs.glucose >= 100) { score += 6; factors.push('Prediabetic glucose (100-125 mg/dL)'); }

  // BMI
  if (inputs.bmi >= 35) { score += 15; factors.push('Obesity Class II/III (BMI ≥35)'); }
  else if (inputs.bmi >= 30) { score += 12; factors.push('Obesity (BMI 30-34.9)'); }
  else if (inputs.bmi >= 25) { score += 8; factors.push('Overweight (BMI 25-29.9)'); }

  // Age
  if (inputs.age >= 60) { score += 10; factors.push('Age ≥60 years'); }
  else if (inputs.age >= 45) { score += 7; factors.push('Age 45-59 years'); }

  // Pregnancies (for females)
  if (inputs.pregnancies >= 5) { score += 8; factors.push('High number of pregnancies (≥5)'); }
  else if (inputs.pregnancies >= 3) { score += 5; factors.push('Multiple pregnancies (≥3)'); }

  // Blood pressure
  if (inputs.bloodPressure >= 100) { score += 8; factors.push('Hypertension (≥100 mmHg diastolic)'); }
  else if (inputs.bloodPressure >= 90) { score += 5; }

  // Insulin (low insulin in presence of high glucose is concerning)
  if (inputs.insulin === 0 && inputs.glucose > 140) { score += 8; factors.push('Low insulin with high glucose'); }
  else if (inputs.insulin >= 200) { score += 5; factors.push('Elevated insulin levels'); }

  // Diabetes pedigree (genetic)
  if (inputs.diabetesPedigree >= 0.8) { score += 10; factors.push('Strong family history (pedigree ≥0.8)'); }
  else if (inputs.diabetesPedigree >= 0.5) { score += 6; factors.push('Moderate family history'); }

  const riskScore = Math.min(100, score);
  const risk = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Moderate' : 'Low';

  return {
    disease: 'diabetes',
    risk,
    riskScore,
    factors,
    recommendations: [
      'Get HbA1c test every 3 months if high risk',
      'Monitor fasting glucose daily',
      'Maintain healthy weight',
      'Regular physical activity (150 min/week)',
      'Follow diabetic diet plan',
      'Annual eye exam (diabetic retinopathy screening)'
    ],
    lifestyleChanges: [
      'Low glycemic index foods (whole grains, legumes)',
      'Avoid sugary drinks and refined carbs',
      'Include bitter gourd, fenugreek, cinnamon',
      'Walk 30 min after meals',
      'Practice yoga (Paschimottanasana, Mandukasana)',
      'Stay hydrated (3-4L water/day)'
    ],
    whenToSeeDoctor: [
      'Fasting glucose consistently >126 mg/dL',
      'Random glucose >200 mg/dL with symptoms',
      'Excessive thirst and urination',
      'Unexplained weight loss',
      'Blurred vision or fatigue'
    ]
  };
};

// ============================================
// LIVER DISEASE RISK CALCULATOR
// Based on: Indian Liver Patient Dataset (Kaggle)
// Features: Age, Gender, Bilirubin, Alkaline Phosphatase, etc.
// ============================================

interface LiverInputs {
  age: number;
  gender: 'male' | 'female';
  totalBilirubin: number; // mg/dL
  directBilirubin: number; // mg/dL
  alkalinePhosphatase: number; // IU/L
  alt: number; // Alanine Aminotransferase
  ast: number; // Aspartate Aminotransferase
  totalProteins: number; // g/dL
  albumin: number; // g/dL
  agRatio: number; // Albumin/Globulin ratio
}

export const predictLiverDisease = (inputs: LiverInputs): DiseasePrediction => {
  let score = 0;
  const factors: string[] = [];

  // Bilirubin (critical marker)
  if (inputs.totalBilirubin >= 5) { score += 20; factors.push('Very high bilirubin (≥5 mg/dL)'); }
  else if (inputs.totalBilirubin >= 2) { score += 15; factors.push('Elevated bilirubin (≥2 mg/dL)'); }
  else if (inputs.totalBilirubin >= 1.2) { score += 8; factors.push('Borderline bilirubin (1.2-2 mg/dL)'); }

  // ALT (liver enzyme)
  if (inputs.alt >= 100) { score += 18; factors.push('Severely elevated ALT (≥100 IU/L)'); }
  else if (inputs.alt >= 50) { score += 12; factors.push('Elevated ALT (≥50 IU/L)'); }

  // AST
  if (inputs.ast >= 100) { score += 15; factors.push('Severely elevated AST (≥100 IU/L)'); }
  else if (inputs.ast >= 50) { score += 10; factors.push('Elevated AST (≥50 IU/L)'); }

  // AST/ALT ratio (>2 suggests alcoholic liver disease)
  if (inputs.alt > 0) {
    const ratio = inputs.ast / inputs.alt;
    if (ratio >= 2) { score += 10; factors.push('AST/ALT ratio ≥2 (suggests alcoholic liver disease)'); }
  }

  // Albumin (low is bad)
  if (inputs.albumin < 2.5) { score += 15; factors.push('Very low albumin (<2.5 g/dL)'); }
  else if (inputs.albumin < 3.5) { score += 10; factors.push('Low albumin (<3.5 g/dL)'); }

  // Alkaline Phosphatase
  if (inputs.alkalinePhosphatase >= 300) { score += 12; factors.push('High alkaline phosphatase (≥300 IU/L)'); }
  else if (inputs.alkalinePhosphatase >= 150) { score += 6; }

  // Age & Gender (males at higher risk in India)
  if (inputs.gender === 'male' && inputs.age >= 40) { score += 8; factors.push('Male, age ≥40 (higher liver disease risk in India)'); }
  if (inputs.age >= 60) { score += 5; }

  const riskScore = Math.min(100, score);
  const risk = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Moderate' : 'Low';

  return {
    disease: 'liver',
    risk,
    riskScore,
    factors,
    recommendations: [
      'Complete liver function test (LFT) annually',
      'Get ultrasound abdomen if high risk',
      'Avoid alcohol completely',
      'Maintain healthy weight',
      'Get vaccinated for Hepatitis A & B',
      'Avoid self-medication (especially painkillers)'
    ],
    lifestyleChanges: [
      'Avoid alcohol and processed foods',
      'Eat leafy greens, turmeric, garlic',
      'Drink warm water with lemon daily',
      'Avoid fried and fatty foods',
      'Include coffee (2-3 cups/day, protective)',
      'Practice Kapalabhati pranayama'
    ],
    whenToSeeDoctor: [
      'Yellowing of eyes/skin (jaundice)',
      'Severe abdominal pain (right upper quadrant)',
      'Dark urine or pale stools',
      'Unexplained weight loss',
      'Persistent fatigue and weakness'
    ]
  };
};

// ============================================
// KIDNEY DISEASE RISK CALCULATOR
// Based on: Chronic Kidney Disease Dataset (Kaggle)
// Features: Age, BP, Albumin, Creatinine, Hemoglobin, etc.
// ============================================

interface KidneyInputs {
  age: number;
  bloodPressure: number; // mm Hg
  specificGravity: number; // 1.005-1.030
  albumin: number; // 0-5
  sugar: number; // 0-5
  bloodUrea: number; // mg/dL
  serumCreatinine: number; // mg/dL
  sodium: number; // mEq/L
  potassium: number; // mEq/L
  hemoglobin: number; // g/dL
}

export const predictKidneyDisease = (inputs: KidneyInputs): DiseasePrediction => {
  let score = 0;
  const factors: string[] = [];

  // Serum creatinine (most important)
  if (inputs.serumCreatinine >= 5) { score += 25; factors.push('Severely elevated creatinine (≥5 mg/dL)'); }
  else if (inputs.serumCreatinine >= 2) { score += 18; factors.push('High creatinine (≥2 mg/dL)'); }
  else if (inputs.serumCreatinine >= 1.3) { score += 10; factors.push('Borderline creatinine (1.3-2 mg/dL)'); }

  // Blood urea
  if (inputs.bloodUrea >= 100) { score += 15; factors.push('Very high blood urea (≥100 mg/dL)'); }
  else if (inputs.bloodUrea >= 60) { score += 10; factors.push('Elevated blood urea (≥60 mg/dL)'); }

  // Blood pressure
  if (inputs.bloodPressure >= 160) { score += 12; factors.push('Severe hypertension (≥160 mmHg)'); }
  else if (inputs.bloodPressure >= 140) { score += 8; factors.push('Hypertension (≥140 mmHg)'); }

  // Albumin (high in urine indicates kidney damage)
  if (inputs.albumin >= 4) { score += 15; factors.push('High albuminuria (≥4)'); }
  else if (inputs.albumin >= 2) { score += 10; factors.push('Moderate albuminuria (≥2)'); }

  // Hemoglobin (low indicates CKD)
  if (inputs.hemoglobin < 8) { score += 12; factors.push('Severe anemia (Hb <8 g/dL)'); }
  else if (inputs.hemoglobin < 12) { score += 8; factors.push('Anemia (Hb <12 g/dL)'); }

  // Age
  if (inputs.age >= 65) { score += 8; factors.push('Age ≥65 years'); }
  else if (inputs.age >= 50) { score += 5; }

  const riskScore = Math.min(100, score);
  const risk = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Moderate' : 'Low';

  return {
    disease: 'kidney',
    risk,
    riskScore,
    factors,
    recommendations: [
      'Get kidney function test (KFT) annually',
      'Monitor blood pressure weekly',
      'Control blood sugar if diabetic',
      'Limit salt intake (<5g/day)',
      'Stay hydrated (2-3L water/day)',
      'Avoid NSAIDs (ibuprofen, etc.)'
    ],
    lifestyleChanges: [
      'Low-protein diet if CKD diagnosed',
      'Avoid high-potassium foods if advanced',
      'Include coconut water, cucumber, watermelon',
      'Practice gentle yoga (avoid inversions)',
      'Limit processed and packaged foods',
      'Regular moderate exercise'
    ],
    whenToSeeDoctor: [
      'Swelling in legs, ankles, or face',
      'Foamy or bloody urine',
      'Decreased urine output',
      'Persistent fatigue and weakness',
      'Nausea, vomiting, loss of appetite'
    ]
  };
};

// ============================================
// BREAST CANCER RISK CALCULATOR
// Based on: Breast Cancer Wisconsin Dataset (Kaggle)
// Features: Cell characteristics from fine needle aspirate
// ============================================

interface BreastCancerInputs {
  age: number;
  familyHistory: boolean;
  lumpSize: 'small' | 'medium' | 'large';
  lumpTexture: 'smooth' | 'irregular';
  symmetry: 'symmetric' | 'asymmetric';
  concavity: 'absent' | 'present';
  mitoses: number; // 0-10
  menarcheAge: number; // age of first period
  menopauseAge: number | null; // null if not menopausal
  firstPregnancyAge: number | null; // null if never pregnant
}

export const predictBreastCancer = (inputs: BreastCancerInputs): DiseasePrediction => {
  let score = 0;
  const factors: string[] = [];

  // Age
  if (inputs.age >= 60) { score += 12; factors.push('Age ≥60 years'); }
  else if (inputs.age >= 40) { score += 8; factors.push('Age 40-59 years'); }

  // Family history (strong predictor)
  if (inputs.familyHistory) { score += 18; factors.push('Family history of breast cancer'); }

  // Reproductive factors
  if (inputs.menarcheAge < 12) { score += 8; factors.push('Early menarche (<12 years)'); }
  if (inputs.menopauseAge && inputs.menopauseAge >= 55) { score += 8; factors.push('Late menopause (≥55 years)'); }
  if (inputs.firstPregnancyAge && inputs.firstPregnancyAge >= 30) { score += 6; factors.push('First pregnancy after 30'); }

  // Lump characteristics
  if (inputs.lumpSize === 'large') { score += 10; factors.push('Large lump'); }
  else if (inputs.lumpSize === 'medium') { score += 5; }

  if (inputs.lumpTexture === 'irregular') { score += 12; factors.push('Irregular lump texture'); }
  if (inputs.symmetry === 'asymmetric') { score += 10; factors.push('Asymmetric cell nuclei'); }
  if (inputs.concavity === 'present') { score += 8; factors.push('Concave cell contours'); }

  // Mitoses (cell division rate)
  if (inputs.mitoses >= 5) { score += 15; factors.push('High mitotic count (≥5)'); }
  else if (inputs.mitoses >= 2) { score += 8; factors.push('Moderate mitotic count'); }

  const riskScore = Math.min(100, score);
  const risk = riskScore >= 60 ? 'High' : riskScore >= 30 ? 'Moderate' : 'Low';

  return {
    disease: 'breast_cancer',
    risk,
    riskScore,
    factors,
    recommendations: [
      'Monthly breast self-examination',
      'Annual clinical breast exam',
      'Mammogram every 1-2 years (age 40+)',
      'Breast ultrasound if dense breast tissue',
      'Genetic counseling if family history',
      'Maintain healthy weight'
    ],
    lifestyleChanges: [
      'Limit alcohol to ≤1 drink/day',
      'Regular physical activity (150 min/week)',
      'Breastfeed if possible (protective)',
      'Include cruciferous vegetables (broccoli, cauliflower)',
      'Avoid hormone replacement therapy if possible',
      'Practice stress management (yoga, meditation)'
    ],
    whenToSeeDoctor: [
      'New lump or mass in breast',
      'Nipple discharge (especially bloody)',
      'Skin dimpling or puckering',
      'Nipple retraction or inversion',
      'Breast pain that persists',
      'Swelling in armpit or collarbone area'
    ]
  };
};

// ============================================
// UNIFIED PREDICTION FUNCTION
// ============================================

export const predictDisease = (
  disease: DiseaseType,
  inputs: any
): DiseasePrediction => {
  switch (disease) {
    case 'heart': return predictHeartDisease(inputs as HeartInputs);
    case 'diabetes': return predictDiabetes(inputs as DiabetesInputs);
    case 'liver': return predictLiverDisease(inputs as LiverInputs);
    case 'kidney': return predictKidneyDisease(inputs as KidneyInputs);
    case 'breast_cancer': return predictBreastCancer(inputs as BreastCancerInputs);
    default: throw new Error('Unknown disease type');
  }
};

// ============================================
// RISK CONFIGURATION
// ============================================

export const RISK_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  Low: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅', label: 'Low Risk' },
  Moderate: { color: 'text-amber-600', bg: 'bg-amber-50', icon: '⚠️', label: 'Moderate Risk' },
  High: { color: 'text-red-600', bg: 'bg-red-50', icon: '🚨', label: 'High Risk' },
};

export const DISEASE_INFO: Record<DiseaseType, { name: string; description: string; icon: string }> = {
  heart: {
    name: 'Heart Disease',
    description: 'Cardiovascular disease prediction based on 14 clinical features',
    icon: '❤️'
  },
  diabetes: {
    name: 'Diabetes',
    description: 'Type 2 diabetes risk assessment using 8 key indicators',
    icon: '🩸'
  },
  liver: {
    name: 'Liver Disease',
    description: 'Hepatic function assessment with 10 liver enzymes & markers',
    icon: '🫁'
  },
  kidney: {
    name: 'Chronic Kidney Disease',
    description: 'Renal function evaluation using 10 kidney health indicators',
    icon: '🫘'
  },
  breast_cancer: {
    name: 'Breast Cancer',
    description: 'Breast cancer risk assessment with 10 clinical features',
    icon: '🎗️'
  }
};
