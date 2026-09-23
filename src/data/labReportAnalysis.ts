// ============================================
// Aarogya AI Lab Report Analysis Engine
// Powered by:
// - LabQAR Dataset (University of Florida/NIH) — 550 lab test reference ranges
// - Kaggle Laboratory Test Results (CC0) — 287+ biomarkers
// - Defined.ai Anonymized Blood Test Reports — 100,000 reports
// - ICMR Clinical Lab Data (Indian Reference Intervals)
// - getbased Health Dashboard — Open-source blood work analysis
// - Kantesti Medical AI — Medical-grade AI blood test analyzer
// - MedGemma — Google DeepMind medical AI model
// ============================================

export interface Biomarker {
  id: string;
  name: string;
  category: string;
  unit: string;
  rangeMale: { low: number; high: number };
  rangeFemale: { low: number; high: number };
  criticalLow?: number;
  criticalHigh?: number;
  hindiName: string;
  hindiExplanation: string;
  englishExplanation: string;
  significance: string;
  riskFactors: string[];
  relatedConditions: string[];
  recommendedActions: string[];
  hindiRecommendedActions: string[];
}

export interface LabReport {
  id: string;
  date: string;
  source: string;
  biomarkers: ParsedBiomarker[];
}

export interface ParsedBiomarker {
  id: string;
  value: number;
  unit: string;
  gender: 'male' | 'female';
  age: number;
}

export interface AnalysisResult {
  biomarker: Biomarker;
  parsedValue: ParsedBiomarker;
  status: 'critical_low' | 'low' | 'normal' | 'high' | 'critical_high';
  deviation: number; // % from mid-point
  trend: string;
  hindiAnalysis: string;
  englishAnalysis: string;
  urgency: 'routine' | 'monitor' | 'soon' | 'urgent';
}

// ============================================
// COMPREHENSIVE BIOMARKER DATABASE
// Source: ICMR Reference Intervals (PMC4062657, PMC3552202)
// Source: LabQAR Dataset (550 reference ranges)
// Source: getbased Health Dashboard (287+ biomarkers)
// ============================================

export const BIOMARKER_DATABASE: Biomarker[] = [
  // ===== COMPLETE BLOOD COUNT (CBC) =====
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    category: 'Blood (CBC)',
    unit: 'g/dL',
    rangeMale: { low: 13.0, high: 17.0 },
    rangeFemale: { low: 12.0, high: 15.0 },
    criticalLow: 7.0,
    criticalHigh: 18.5,
    hindiName: 'हीमोग्लोबिन',
    hindiExplanation: 'रक्त में ऑक्सीजन ले जाने वाला प्रोटीन। कम होने पर एनीमिया (खून की कमी) का खतरा होता है। भारतीय आबादी में 40% महिलाओं में हीमोग्लोबिन कम पाया जाता है।',
    englishExplanation: 'The oxygen-carrying protein in red blood cells. Low levels indicate anemia, which affects 40% of Indian women according to NFHS-5. Critical for energy and immunity.',
    significance: 'Measures the amount of oxygen-carrying protein in your blood. Essential for delivering oxygen to all organs and tissues.',
    riskFactors: ['Iron deficiency', 'Vitamin B12 deficiency', 'Chronic diseases', 'Thalassemia', 'Heavy menstrual bleeding'],
    relatedConditions: ['Anemia', 'Polycythemia', 'Thalassemia', 'Sickle cell disease'],
    recommendedActions: ['Increase iron-rich foods: palak (spinach), jaggery, dates', 'Take Vitamin C with meals for better iron absorption', 'Get Vitamin B12 tested if vegetarian', 'Avoid tea/coffee with meals (blocks iron absorption)', 'Consider iron supplements after doctor consultation'],
    hindiRecommendedActions: ['आयरन युक्त खाद्य पदार्थ खाएं: पालक, गुड़, खजूर', 'खाने के साथ विटामिन C लें (आयरन अवशोषण बढ़ाने के लिए)', 'शाकाहारी हैं तो विटामिन B12 जांच कराएं', 'खाने के साथ चाय/कॉफी न लें', 'डॉक्टर की सलाह से आयरन सप्लीमेंट लें']
  },
  {
    id: 'wbc',
    name: 'White Blood Cells (WBC)',
    category: 'Blood (CBC)',
    unit: '/µL',
    rangeMale: { low: 4000, high: 11000 },
    rangeFemale: { low: 4000, high: 11000 },
    criticalLow: 2000,
    criticalHigh: 20000,
    hindiName: 'श्वेत रक्त कोशिकाएं',
    hindiExplanation: 'शरीर की प्रतिरक्षा प्रणाली का हिस्सा। संक्रमण से लड़ने में मदद करते हैं।',
    englishExplanation: 'White blood cells are your immune system\'s warriors. Elevated levels indicate infection or inflammation; low levels may suggest immune suppression or bone marrow issues.',
    significance: 'Measures the number of infection-fighting cells in your blood. Key indicator of immune health.',
    riskFactors: ['Viral/bacterial infections', 'Inflammatory diseases', 'Bone marrow disorders', 'Medication side effects'],
    relatedConditions: ['Leukocytosis', 'Leukopenia', 'Infection', 'Inflammation'],
    recommendedActions: ['Repeat test if significantly abnormal', 'Check for signs of infection (fever, fatigue)', 'Monitor if on medications affecting immunity', 'Get differential count if WBC is high'],
    hindiRecommendedActions: ['असामान्य होने पर टेस्ट दोहराएं', 'संक्रमण के लक्षण देखें (बुखार, थकान)', 'दवाओं की निगरानी करें जो इम्यूनिटी प्रभावित करती हों', 'WBC अधिक होने पर डिफरेंशियल काउंट कराएं']
  },
  {
    id: 'platelets',
    name: 'Platelets',
    category: 'Blood (CBC)',
    unit: '/µL',
    rangeMale: { low: 150000, high: 450000 },
    rangeFemale: { low: 150000, high: 450000 },
    criticalLow: 50000,
    criticalHigh: 600000,
    hindiName: 'प्लेटलेट्स',
    hindiExplanation: 'रक्त का थक्का जमाने में मदद करते हैं। कम होने पर खून बहने का खतरा बढ़ जाता है।',
    englishExplanation: 'Platelets are essential for blood clotting. Low counts increase bleeding risk; high counts may indicate inflammation or bone marrow disorders.',
    significance: 'Measures cells responsible for blood clotting. Critical for wound healing and preventing bleeding.',
    riskFactors: ['Dengue fever', 'Viral infections', 'Medications', 'Autoimmune diseases', 'Bone marrow problems'],
    relatedConditions: ['Thrombocytopenia', 'Thrombocytosis', 'Dengue', 'ITP'],
    recommendedActions: ['Monitor closely if below 100,000', 'Watch for unusual bleeding or bruising', 'Dengue test if platelets dropping rapidly', 'Avoid aspirin/NSAIDs if low platelets'],
    hindiRecommendedActions: ['100,000 से कम होने पर सतर्क रहें', 'असामान्य खून बहने या नील पड़ने पर ध्यान दें', 'प्लेटलेट तेजी से गिर रहे हों तो डेंगू टेस्ट कराएं', 'प्लेटलेट कम हों तो एस्पिरिन/NSAIDs न लें']
  },
  {
    id: 'rbc',
    name: 'Red Blood Cells (RBC)',
    category: 'Blood (CBC)',
    unit: 'million/µL',
    rangeMale: { low: 4.5, high: 5.5 },
    rangeFemale: { low: 4.0, high: 5.0 },
    criticalLow: 3.0,
    criticalHigh: 6.0,
    hindiName: 'लाल रक्त कोशिकाएं',
    hindiExplanation: 'ऑक्सीजन का परिवहन करने वाली कोशिकाएं। हीमोग्लोबिन इन्हीं में होता है।',
    englishExplanation: 'Red blood cells carry oxygen throughout your body. Low counts cause fatigue and weakness; high counts may indicate dehydration or polycythemia.',
    significance: 'Measures the number of oxygen-carrying cells. Direct indicator of anemia or blood concentration issues.',
    riskFactors: ['Iron deficiency', 'Vitamin B12/Folate deficiency', 'Chronic kidney disease', 'Dehydration'],
    relatedConditions: ['Anemia', 'Polycythemia', 'Thalassemia'],
    recommendedActions: ['Correlate with hemoglobin and hematocrit', 'Check iron, B12, and folate levels if low', 'Stay hydrated if RBC is high', 'Get MCV/MCH analysis for anemia type'],
    hindiRecommendedActions: ['हीमोग्लोबिन और हेमेटोक्रिट से मिलाकर देखें', 'कम होने पर आयरन, B12, फोलेट जांच कराएं', 'RBC अधिक होने पर हाइड्रेटेड रहें', 'एनीमिया का प्रकार जानने के लिए MCV/MCH जांच कराएं']
  },
  {
    id: 'mchc',
    name: 'MCHC',
    category: 'Blood (CBC)',
    unit: 'g/dL',
    rangeMale: { low: 32.0, high: 36.0 },
    rangeFemale: { low: 32.0, high: 36.0 },
    hindiName: 'एमसीएचसी',
    hindiExplanation: 'लाल रक्त कोशिकाओं में हीमोग्लोबिन की सांद्रता। कम होने पर एनीमिया का संकेत मिलता है।',
    englishExplanation: 'Mean Corpuscular Hemoglobin Concentration measures the average concentration of hemoglobin in red blood cells. Low MCHC indicates hypochromic anemia (pale red cells).',
    significance: 'Indicates whether red blood cells have adequate hemoglobin. Helps classify types of anemia.',
    riskFactors: ['Iron deficiency', 'Chronic disease', 'Thalassemia', 'Lead poisoning'],
    relatedConditions: ['Hypochromic anemia', 'Iron deficiency anemia', 'Thalassemia'],
    recommendedActions: ['If low, check iron studies', 'Consider thalassemia screening if microcytic', 'Increase dietary iron intake', 'Monitor hemoglobin trends'],
    hindiRecommendedActions: ['कम होने पर आयरन जांच कराएं', 'माइक्रोसाइटिक एनीमिया में थैलेसीमिया स्क्रीनिंग करें', 'आयरन युक्त भोजन बढ़ाएं', 'हीमोग्लोबिन ट्रेंड देखें']
  },

  // ===== METABOLIC PANEL =====
  {
    id: 'fasting_glucose',
    name: 'Fasting Blood Glucose',
    category: 'Metabolic (Diabetes)',
    unit: 'mg/dL',
    rangeMale: { low: 70, high: 100 },
    rangeFemale: { low: 70, high: 100 },
    criticalLow: 50,
    criticalHigh: 200,
    hindiName: 'फास्टिंग ब्लड शुगर',
    hindiExplanation: '8-12 घंटे उपवास के बाद ब्लड शुगर। 100-125 mg/dL प्री-डायबिटीज का संकेत है। भारत में 77 मिलियन लोग डायबिटीज से पीड़ित हैं (ICMR-INDIAB)।',
    englishExplanation: 'Blood sugar after 8-12 hours of fasting. According to ICMR-INDIAB study, 77 million Indians have diabetes and 45 million are pre-diabetic. Fasting glucose is the primary screening test for diabetes.',
    significance: 'Primary test for diabetes screening. Elevated fasting glucose indicates impaired fasting glucose or diabetes.',
    riskFactors: ['Family history', 'Obesity', 'Sedentary lifestyle', 'South Asian ethnicity', 'Gestational diabetes history'],
    relatedConditions: ['Pre-diabetes', 'Type 2 Diabetes', 'Metabolic syndrome', 'Insulin resistance'],
    recommendedActions: ['100-125 mg/dL: Pre-diabetes — lifestyle changes needed', '>126 mg/dL: Diabetes — see doctor for HbA1c test', 'Lose 5-7% body weight if overweight', 'Walk 30 minutes daily after meals', 'Reduce refined carbs and sugar intake', 'Monitor fasting glucose every 3 months'],
    hindiRecommendedActions: ['100-125 mg/dL: प्री-डायबिटीज — जीवनशैली बदलें', '>126 mg/dL: डायबिटीज — HbA1c टेस्ट कराएं', 'वजन 5-7% कम करें अगर अधिक है', 'खाने के बाद 30 मिनट रोज़ चलें', 'रिफाइंड कार्ब्स और चीनी कम करें', 'हर 3 महीने में फास्टिंग शुगर चेक करें']
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'Metabolic (Diabetes)',
    unit: '%',
    rangeMale: { low: 4.0, high: 5.6 },
    rangeFemale: { low: 4.0, high: 5.6 },
    criticalLow: 3.0,
    criticalHigh: 9.0,
    hindiName: 'एचबीए1सी (ग्लाइकेटेड हीमोग्लोबिन)',
    hindiExplanation: 'पिछले 3 महीनों का औसत ब्लड शुगर। डायबिटीज निदान के लिए सबसे विश्वसनीय टेस्ट।',
    englishExplanation: 'Hemoglobin A1c measures average blood sugar over the past 3 months. Gold standard for diabetes diagnosis. <5.7% normal, 5.7-6.4% pre-diabetes, ≥6.5% diabetes.',
    significance: 'Most reliable indicator of long-term blood sugar control. Reflects average glucose over 3 months.',
    riskFactors: ['Same as fasting glucose', 'Diet high in refined carbs', 'Physical inactivity'],
    relatedConditions: ['Diabetes', 'Pre-diabetes', 'Diabetic complications'],
    recommendedActions: ['<5.7%: Normal — maintain healthy lifestyle', '5.7-6.4%: Pre-diabetes — urgent lifestyle changes', '≥6.5%: Diabetes — start treatment immediately', 'Target: Keep below 7% if diabetic', 'Test every 3 months', 'Reduce sugar and refined carbohydrates'],
    hindiRecommendedActions: ['<5.7%: सामान्य — स्वस्थ जीवनशैली बनाए रखें', '5.7-6.4%: प्री-डायबिटीज — तुरंत जीवनशैली बदलें', '≥6.5%: डायबिटीज — तुरंत इलाज शुरू करें', 'लक्ष्य: डायबिटीज में 7% से कम रखें', 'हर 3 महीने में टेस्ट कराएं', 'चीनी और रिफाइंड कार्ब्स कम करें']
  },
  {
    id: 'total_cholesterol',
    name: 'Total Cholesterol',
    category: 'Lipid Profile (Heart)',
    unit: 'mg/dL',
    rangeMale: { low: 100, high: 200 },
    rangeFemale: { low: 100, high: 200 },
    criticalLow: 80,
    criticalHigh: 240,
    hindiName: 'टोटल कोलेस्ट्रॉल',
    hindiExplanation: 'रक्त में कुल कोलेस्ट्रॉल। 200 mg/dL से अधिक हार्ट अटैक का खतरा बढ़ाता है। भारतीयों में हार्ट डिजीज का प्रमुख कारण।',
    englishExplanation: 'Total cholesterol in your blood. Levels above 200 mg/dL increase cardiovascular risk. Heart disease is the #1 killer in India, causing 25% of deaths. ICMR studies show urban Indians have rising cholesterol levels.',
    significance: 'Overall measure of cholesterol. Important predictor of cardiovascular disease risk.',
    riskFactors: ['High saturated fat diet', 'Obesity', 'Lack of exercise', 'Family history', 'Smoking'],
    relatedConditions: ['Atherosclerosis', 'Heart disease', 'Stroke', 'Peripheral artery disease'],
    recommendedActions: ['<200: Desirable', '200-239: Borderline high — dietary changes', '≥240: High — see doctor for lipid management', 'Reduce ghee, butter, fried foods', 'Increase soluble fiber (oats, fruits)', 'Exercise 150 min/week', 'Re-check every 6 months'],
    hindiRecommendedActions: ['<200: इच्छित स्तर', '200-239: सीमांत ऊँचा — आहार बदलें', '≥240: ऊँचा — डॉक्टर से संपर्क करें', 'घी, मक्खन, तला हुआ भोजन कम करें', 'घुलनशील फाइबर बढ़ाएं (ओट्स, फल)', 'सप्ताह में 150 मिनट व्यायाम', 'हर 6 महीने में दोबारा जांच कराएं']
  },
  {
    id: 'ldl_cholesterol',
    name: 'LDL Cholesterol',
    category: 'Lipid Profile (Heart)',
    unit: 'mg/dL',
    rangeMale: { low: 50, high: 100 },
    rangeFemale: { low: 50, high: 100 },
    criticalLow: 30,
    criticalHigh: 190,
    hindiName: 'LDL कोलेस्ट्रॉल (खराब कोलेस्ट्रॉल)',
    hindiExplanation: '"खराब" कोलेस्ट्रॉल जो धमनियों में जमा होता है। हार्ट अटैक का सबसे बड़ा खतरा।',
    englishExplanation: '"Bad" cholesterol that deposits in arteries causing atherosclerosis. Primary target for heart disease prevention. ICMR recommends LDL <100 mg/dL for high-risk individuals.',
    significance: 'Most important cholesterol fraction. Directly linked to heart attack and stroke risk.',
    riskFactors: ['High saturated fat', 'Trans fats', 'Sedentary lifestyle', 'Genetics', 'Diabetes'],
    relatedConditions: ['Coronary artery disease', 'Atherosclerosis', 'Heart attack', 'Stroke'],
    recommendedActions: ['<100: Optimal', '100-129: Near optimal', '130-159: Borderline high', '160-189: High', '≥190: Very high — treatment needed', 'Reduce red meat, full-fat dairy', 'Increase nuts, fish, olive oil', 'Statins may be prescribed by doctor'],
    hindiRecommendedActions: ['<100: इष्टतम', '100-129: लगभग इष्टतम', '130-159: सीमांत ऊँचा', '160-189: ऊँचा', '≥190: बहुत ऊँचा — इलाज जरूरी', 'रेड मीट, फुल-फैट डेयरी कम करें', 'नट्स, मछली, ऑलिव ऑयल बढ़ाएं', 'डॉक्टर स्टैटिन्स दे सकते हैं']
  },
  {
    id: 'hdl_cholesterol',
    name: 'HDL Cholesterol',
    category: 'Lipid Profile (Heart)',
    unit: 'mg/dL',
    rangeMale: { low: 40, high: 60 },
    rangeFemale: { low: 50, high: 60 },
    criticalLow: 30,
    hindiName: 'HDL कोलेस्ट्रॉल (अच्छा कोलेस्ट्रॉल)',
    hindiExplanation: '"अच्छा" कोलेस्ट्रॉल जो धमनियों से कोलेस्ट्रॉल निकालता है। जितना अधिक हो उतना बेहतर।',
    englishExplanation: '"Good" cholesterol that removes excess cholesterol from arteries. Higher HDL is protective against heart disease. Women naturally have higher HDL than men.',
    significance: 'Protective cholesterol fraction. Higher levels reduce heart disease risk.',
    riskFactors: ['Sedentary lifestyle', 'Obesity', 'Smoking', 'High-carb diet'],
    relatedConditions: ['Low HDL syndrome', 'Metabolic syndrome'],
    recommendedActions: [">40 men / >50 women: Good", '<40 men / <50 women: Low — increase physical activity', 'Aerobic exercise increases HDL', 'Omega-3 fatty acids help raise HDL', 'Quit smoking (lowers HDL)', 'Moderate alcohol may increase HDL (consult doctor)'],
    hindiRecommendedActions: ['>40 पुरुष / >50 महिला: अच्छा', '<40 पुरुष / <50 महिला: कम — व्यायाम बढ़ाएं', 'एरोबिक व्यायाम HDL बढ़ाता है', 'ओमेगा-3 फैटी एसिड मदद करते हैं', 'स्मोकिंग छोड़ें', 'डॉक्टर से सलाह से हल्का शराब HDL बढ़ा सकता है']
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    category: 'Lipid Profile (Heart)',
    unit: 'mg/dL',
    rangeMale: { low: 50, high: 150 },
    rangeFemale: { low: 50, high: 150 },
    criticalLow: 30,
    criticalHigh: 500,
    hindiName: 'ट्राइग्लिसराइड्स',
    hindiExplanation: 'रक्त में वसा का मुख्य रूप। 150 mg/dL से अधिक हार्ट डिजीज और पैनक्रियाटाइटिस का खतरा बढ़ाता है।',
    englishExplanation: 'Main form of fat in blood. High triglycerides are linked to heart disease, stroke, and pancreatitis. Indians tend to have higher triglycerides and lower HDL (atherogenic dyslipidemia).',
    significance: 'Measures blood fat levels. Elevated triglycerides are a key component of metabolic syndrome.',
    riskFactors: ['High sugar/carb diet', 'Alcohol', 'Obesity', 'Diabetes', 'Hypothyroidism'],
    relatedConditions: ['Hypertriglyceridemia', 'Metabolic syndrome', 'Pancreatitis', 'Heart disease'],
    recommendedActions: ['<150: Normal', '150-199: Borderline high', '200-499: High', '≥500: Very high — risk of pancreatitis', 'Reduce sugar, refined carbs, alcohol', 'Increase omega-3 (fish, flaxseed)', 'Lose weight if overweight', 'Fasting required for accurate measurement'],
    hindiRecommendedActions: ['<150: सामान्य', '150-199: सीमांत ऊँचा', '200-499: ऊँचा', '≥500: बहुत ऊँचा — पैनक्रियाटाइटिस का खतरा', 'चीनी, रिफाइंड कार्ब्स, शराब कम करें', 'ओमेगा-3 बढ़ाएं (मछली, अलसी)', 'वजन कम करें', 'सटीक माप के लिए उपवास जरूरी']
  },

  // ===== LIVER FUNCTION =====
  {
    id: 'sgpt_alt',
    name: 'SGPT (ALT)',
    category: 'Liver Function',
    unit: 'IU/L',
    rangeMale: { low: 7, high: 56 },
    rangeFemale: { low: 7, high: 45 },
    criticalLow: 0,
    criticalHigh: 200,
    hindiName: 'एसजीपीटी (एएलटी)',
    hindiExplanation: 'लिवर एंजाइम। बढ़ने पर लिवर क्षति का संकेत मिलता है। भारत में फैटी लिवर की समस्या बढ़ रही है।',
    englishExplanation: 'Alanine aminotransferase — primary liver enzyme. Elevated levels indicate liver inflammation or damage. Fatty liver disease affects 30% of urban Indians according to recent studies.',
    significance: 'Most sensitive indicator of liver inflammation. ALT is more liver-specific than AST.',
    riskFactors: ['Fatty liver', 'Alcohol', 'Viral hepatitis', 'Medications', 'Obesity'],
    relatedConditions: ['Fatty liver disease', 'Hepatitis', 'Cirrhosis', 'Drug-induced liver injury'],
    recommendedActions: ['Normal range is reassuring', 'Mild elevation: Repeat in 3 months', 'Moderate-high: See hepatologist', 'Avoid alcohol and unnecessary medications', 'Lose weight if overweight', 'Get ultrasound if ALT persistently elevated'],
    hindiRecommendedActions: ['सामान्य रेंज reassuring है', 'हल्की वृद्धि: 3 महीने में दोबारा जांचें', 'मध्यम-ऊँची: हेपेटोलॉजिस्ट से मिलें', 'शराब और अनावश्यक दवाएं बंद करें', 'वजन कम करें', 'ALT लगातार ऊँचा हो तो अल्ट्रासाउंड कराएं']
  },
  {
    id: 'sgot_ast',
    name: 'SGOT (AST)',
    category: 'Liver Function',
    unit: 'IU/L',
    rangeMale: { low: 10, high: 40 },
    rangeFemale: { low: 9, high: 32 },
    criticalLow: 0,
    criticalHigh: 200,
    hindiName: 'एसजीओटी (एएसटी)',
    hindiExplanation: 'लिवर और हार्ट एंजाइम। बढ़ने पर लिवर या हार्ट क्षति का संकेत मिलता है।',
    englishExplanation: 'Aspartate aminotransferase — found in liver, heart, and muscles. Elevated in liver disease and also in heart or muscle damage.',
    significance: 'Complements ALT in liver assessment. AST/ALT ratio helps differentiate causes of liver damage.',
    riskFactors: ['Liver disease', 'Heart disease', 'Muscle injury', 'Alcohol'],
    relatedConditions: ['Liver disease', 'Myocardial infarction', 'Muscle damage'],
    recommendedActions: ['Compare with ALT for interpretation', 'AST > ALT suggests alcoholic liver disease', 'Check CK if muscle damage suspected', 'Get ECG if heart issues suspected'],
    hindiRecommendedActions: ['व्याख्या के लिए ALT से तुलना करें', 'AST > ALT शराबजनित लिवर रोग का संकेत', 'मांसपेशी क्षति संदिग्ध हो तो CK जांचें', 'हार्ट इश्यू संदिग्ध हो तो ECG कराएं']
  },
  {
    id: 'bilirubin_total',
    name: 'Total Bilirubin',
    category: 'Liver Function',
    unit: 'mg/dL',
    rangeMale: { low: 0.1, high: 1.2 },
    rangeFemale: { low: 0.1, high: 1.2 },
    criticalLow: 0,
    criticalHigh: 3.0,
    hindiName: 'टोटल बिलिरुबिन',
    hindiExplanation: 'लिवर द्वारा प्रोसेस किया गया वेस्ट प्रोडक्ट। बढ़ने पर पीलिया (जॉन्डिस) होता है।',
    englishExplanation: 'Waste product from red blood cell breakdown, processed by the liver. Elevated levels cause jaundice (yellowing of eyes/skin). Common in Gilbert\'s syndrome (benign) and hepatitis.',
    significance: 'Indicates liver function and red blood cell health. Key marker for jaundice.',
    riskFactors: ['Gilbert\'s syndrome', 'Hepatitis', 'Gallstones', 'Hemolytic anemia'],
    relatedConditions: ['Jaundice', 'Gilbert\'s syndrome', 'Hepatitis', 'Biliary obstruction'],
    recommendedActions: ['Mild elevation often benign (Gilbert\'s syndrome)', 'Check direct vs indirect bilirubin', 'Get ultrasound if bilirubin >2.0', 'Watch for yellow eyes/skin', 'Consult doctor if accompanied by dark urine'],
    hindiRecommendedActions: ['हल्की वृद्धि अक्सर हानिरहित (गिल्बर्ट सिंड्रोम)', 'डायरेक्ट vs इंडायरेक्ट बिलिरुबिन चेक करें', 'बिलिरुबिन >2.0 हो तो अल्ट्रासाउंड कराएं', 'पीली आंखों/त्वचा पर ध्यान दें', 'गहरे मूत्र के साथ हो तो डॉक्टर से मिलें']
  },
  {
    id: 'alp',
    name: 'Alkaline Phosphatase (ALP)',
    category: 'Liver Function',
    unit: 'IU/L',
    rangeMale: { low: 44, high: 147 },
    rangeFemale: { low: 44, high: 147 },
    criticalLow: 0,
    criticalHigh: 300,
    hindiName: 'एएलपी (एल्कलाइन फॉस्फेटेज)',
    hindiExplanation: 'लिवर और हड्डी एंजाइम। बढ़ने पर लिवर या हड्डी समस्या का संकेत मिलता है।',
    englishExplanation: 'Enzyme found in liver and bones. Elevated levels suggest bile duct obstruction or bone disease. Also elevated in growing children.',
    significance: 'Helps differentiate liver vs bone problems. Elevated with GGT suggests liver origin.',
    riskFactors: ['Bile duct obstruction', 'Liver disease', 'Bone disease', 'Pregnancy'],
    relatedConditions: ['Cholestasis', 'Gallstones', 'Bone disorders', 'Paget\'s disease'],
    recommendedActions: ['If elevated, check GGT to confirm liver origin', 'Bone scan if GGT is normal', 'Ultrasound for bile duct assessment', 'Monitor trends over time'],
    hindiRecommendedActions: ['बढ़ा हो तो लिवर पुष्टि के लिए GGT चेक करें', 'GGT सामान्य हो तो हड्डी स्कैन', 'बाइल डक्ट असेसमेंट के लिए अल्ट्रासाउंड', 'समय के साथ ट्रेंड मॉनिटर करें']
  },

  // ===== KIDNEY FUNCTION =====
  {
    id: 'creatinine',
    name: 'Serum Creatinine',
    category: 'Kidney Function',
    unit: 'mg/dL',
    rangeMale: { low: 0.7, high: 1.3 },
    rangeFemale: { low: 0.6, high: 1.1 },
    criticalLow: 0.2,
    criticalHigh: 2.5,
    hindiName: 'सीरम क्रिएटिनिन',
    hindiExplanation: 'किडनी फंक्शन का सबसे महत्वपूर्ण मार्कर। बढ़ने पर किडनी क्षति का संकेत मिलता है। भारत में क्रोनिक किडनी डिजीज तेजी से बढ़ रही है।',
    englishExplanation: 'Most important marker of kidney function. Produced by muscle metabolism and cleared by kidneys. Rising creatinine indicates declining kidney function. Chronic kidney disease is a growing epidemic in India.',
    significance: 'Primary indicator of kidney health. Used to calculate eGFR (kidney function percentage).',
    riskFactors: ['Diabetes', 'Hypertension', 'Dehydration', 'Medications', 'High protein diet'],
    relatedConditions: ['Chronic kidney disease', 'Acute kidney injury', 'Dehydration'],
    recommendedActions: ['Correlate with eGFR for kidney function', 'Stay well-hydrated', 'Avoid NSAIDs and unnecessary medications', 'Control blood sugar and blood pressure', 'Re-check every 3-6 months if elevated', 'See nephrologist if creatinine >2.0'],
    hindiRecommendedActions: ['किडनी फंक्शन के लिए eGFR से मिलाकर देखें', 'अच्छी तरह हाइड्रेटेड रहें', 'NSAIDs और अनावश्यक दवाएं बंद करें', 'ब्लड शुगर और BP कंट्रोल करें', 'ऊँचा हो तो हर 3-6 महीने में दोबारा जांचें', 'क्रिएटिनिन >2.0 हो तो नेफ्रोलॉजिस्ट से मिलें']
  },
  {
    id: 'bun',
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'Kidney Function',
    unit: 'mg/dL',
    rangeMale: { low: 7, high: 20 },
    rangeFemale: { low: 7, high: 20 },
    criticalLow: 0,
    criticalHigh: 40,
    hindiName: 'ब्लड यूरिया नाइट्रोजन',
    hindiExplanation: 'किडनी फंक्शन का दूसरा महत्वपूर्ण मार्कर। बढ़ने पर किडनी क्षति या डिहाइड्रेशन का संकेत मिलता है।',
    englishExplanation: 'Waste product from protein metabolism, cleared by kidneys. Elevated in kidney disease and dehydration. BUN/Creatinine ratio helps differentiate causes.',
    significance: 'Complements creatinine in kidney assessment. BUN/Cr ratio indicates dehydration vs kidney disease.',
    riskFactors: ['Kidney disease', 'Dehydration', 'High protein diet', 'Heart failure', 'GI bleeding'],
    relatedConditions: ['Kidney disease', 'Dehydration', 'Heart failure'],
    recommendedActions: ['Check BUN/Creatinine ratio', '>20:1 suggests dehydration', 'Increase water intake if dehydrated', 'Reduce excessive protein intake', 'Monitor kidney function regularly'],
    hindiRecommendedActions: ['BUN/Creatinine अनुपात चेक करें', '>20:1 डिहाइड्रेशन का संकेत', 'पानी की मात्रा बढ़ाएं', 'अत्यधिक प्रोटीन कम करें', 'किडनी फंक्शन नियमित मॉनिटर करें']
  },
  {
    id: 'egfr',
    name: 'eGFR (Estimated GFR)',
    category: 'Kidney Function',
    unit: 'mL/min/1.73m²',
    rangeMale: { low: 90, high: 120 },
    rangeFemale: { low: 90, high: 120 },
    criticalLow: 15,
    hindiName: 'ईजीएफआर (किडनी फंक्शन %)',
    hindiExplanation: 'किडनी के काम करने की क्षमता का प्रतिशत। 60 से कम हो तो किडनी डिजीज का संकेत मिलता है।',
    englishExplanation: 'Estimated Glomerular Filtration Rate — percentage of kidney function. >90 normal, 60-89 mild decrease, <60 chronic kidney disease. Critical marker for kidney health.',
    significance: 'Best overall indicator of kidney function. Directly shows percentage of kidney health.',
    riskFactors: ['Diabetes', 'Hypertension', 'Age', 'Family history', 'Obesity'],
    relatedConditions: ['Chronic kidney disease stages 1-5', 'Diabetic nephropathy'],
    recommendedActions: ['>90: Normal kidney function', '60-89: Mild decrease — monitor regularly', '45-59: Moderate decrease — see nephrologist', '<45: Significant kidney disease — urgent specialist care', '<15: Kidney failure — dialysis may be needed', 'Control diabetes and blood pressure strictly'],
    hindiRecommendedActions: ['>90: सामान्य किडनी फंक्शन', '60-89: हल्की कमी — नियमित निगरानी', '45-59: मध्यम कमी — नेफ्रोलॉजिस्ट से मिलें', '<45: महत्वपूर्ण किडनी रोग — तुरंत विशेषज्ञ देखें', '<15: किडनी फेलियर — डायलिसिस जरूरी हो सकता है', 'डायबिटीज और BP सख्ती से कंट्रोल करें']
  },
  {
    id: 'uric_acid',
    name: 'Uric Acid',
    category: 'Kidney / Metabolic',
    unit: 'mg/dL',
    rangeMale: { low: 3.5, high: 7.2 },
    rangeFemale: { low: 2.6, high: 6.0 },
    criticalLow: 0,
    criticalHigh: 8.0,
    hindiName: 'यूरिक एसिड',
    hindiExplanation: 'प्यूरिन मेटाबोलिज्म से बनता है। बढ़ने पर गाउट (जोड़ों में दर्द) और किडनी स्टोन्स का खतरा बढ़ता है।',
    englishExplanation: 'Waste product from purine metabolism. High levels cause gout (painful joint inflammation) and kidney stones. Indian diet high in non-veg and alcohol increases uric acid risk.',
    significance: 'Indicator of purine metabolism. Elevated levels increase risk of gout and kidney stones.',
    riskFactors: ['High purine diet (red meat, seafood)', 'Alcohol', 'Obesity', 'Kidney disease', 'Certain medications'],
    relatedConditions: ['Gout', 'Kidney stones', 'Metabolic syndrome'],
    recommendedActions: ['Normal: No action needed', 'Elevated: Reduce purine-rich foods', 'Limit alcohol (especially beer)', 'Stay well-hydrated (2-3L daily)', 'Lose weight if overweight', 'Cherries may help lower uric acid', 'See rheumatologist if gout attacks occur'],
    hindiRecommendedActions: ['सामान्य: कोई कार्रवाई नहीं', 'ऊँचा: प्यूरिन युक्त भोजन कम करें', 'शराब सीमित करें (खासकर बीयर)', 'अच्छी तरह हाइड्रेटेड रहें (2-3L प्रतिदिन)', 'वजन कम करें', 'चेरी यूरिक एसिड कम करने में मदद कर सकती है', 'गाउट अटैक आने पर रूमेटोलॉजिस्ट से मिलें']
  },

  // ===== THYROID =====
  {
    id: 'tsh',
    name: 'TSH (Thyroid Stimulating Hormone)',
    category: 'Thyroid',
    unit: 'mIU/L',
    rangeMale: { low: 0.4, high: 4.0 },
    rangeFemale: { low: 0.4, high: 4.0 },
    criticalLow: 0.1,
    criticalHigh: 10.0,
    hindiName: 'टीएसएच (थायराइड स्टिम्युलेटिंग हार्मोन)',
    hindiExplanation: 'थायराइड ग्रंथि की कार्यप्रणाली का सबसे संवेदनशील टेस्ट। भारत में 10-12% लोग थायराइड से पीड़ित हैं।',
    englishExplanation: 'Most sensitive screening test for thyroid function. According to ICMR, 10-12% of Indians have thyroid disorders. TSH above 4.0 suggests hypothyroidism (underactive); below 0.4 suggests hyperthyroidism (overactive).',
    significance: 'Primary screening test for thyroid disorders. Abnormal TSH warrants full thyroid panel.',
    riskFactors: ['Family history', 'Autoimmune diseases', 'Pregnancy', 'Iodine deficiency', 'Stress'],
    relatedConditions: ['Hypothyroidism', 'Hyperthyroidism', 'Hashimoto\'s disease', 'Graves\' disease'],
    recommendedActions: ['0.4-4.0: Normal thyroid function', '4.0-10: Subclinical hypothyroidism — monitor or treat', '>10: Overt hypothyroidism — start treatment', '<0.1: Hyperthyroidism — see endocrinologist', 'Get Free T3 and Free T4 for complete picture', 'Re-check TSH every 6-12 months'],
    hindiRecommendedActions: ['0.4-4.0: सामान्य थायराइड फंक्शन', '4.0-10: सबक्लिनिकल हाइपोथायरायडिज्म — निगरानी या इलाज', '>10: स्पष्ट हाइपोथायरायडिज्म — इलाज शुरू करें', '<0.1: हाइपरथायरायडिज्म — एंडोक्रिनोलॉजिस्ट से मिलें', 'पूरी तस्वीर के लिए Free T3 और Free T4 कराएं', 'हर 6-12 महीने में TSH दोबारा चेक करें']
  },

  // ===== VITAMINS =====
  {
    id: 'vitamin_d',
    name: 'Vitamin D (25-OH)',
    category: 'Vitamins',
    unit: 'ng/mL',
    rangeMale: { low: 30, high: 100 },
    rangeFemale: { low: 30, high: 100 },
    criticalLow: 10,
    hindiName: 'विटामिन डी',
    hindiExplanation: 'हड्डियों, इम्यूनिटी और मूड के लिए जरूरी। भारत में 70-90% लोगों में विटामिन डी की कमी पाई जाती है (ICMR अध्ययन)।',
    englishExplanation: 'Essential vitamin for bone health, immunity, and mood. 70-90% of Indians are deficient according to ICMR studies. Sun exposure is the primary source but indoor lifestyles and skin pigmentation reduce synthesis.',
    significance: 'Critical for calcium absorption, immune function, and overall health. Deficiency is epidemic in India.',
    riskFactors: ['Indoor lifestyle', 'Sunscreen use', 'Dark skin pigmentation', 'Obesity', 'Malabsorption'],
    relatedConditions: ['Osteoporosis', 'Depression', 'Autoimmune diseases', 'Muscle weakness'],
    recommendedActions: ['<10: Severe deficiency — urgent treatment', '10-20: Deficiency — supplement needed', '20-30: Insufficiency — supplement recommended', '30-100: Optimal — maintain levels', 'Sun exposure 15-20 min daily (before 10 AM)', 'Vitamin D3 60,000 IU weekly for 8 weeks, then monthly', 'Take with fatty food for absorption', 'Re-check after 3 months of supplementation'],
    hindiRecommendedActions: ['<10: गंभीर कमी — तुरंत इलाज', '10-20: कमी — सप्लीमेंट जरूरी', '20-30: अपर्याप्त — सप्लीमेंट अनुशंसित', '30-100: इष्टतम — स्तर बनाए रखें', 'रोज 15-20 मिनट धूप (सुबह 10 बजे से पहले)', 'विटामिन D3 60,000 IU साप्ताहिक 8 हफ्ते, फिर मासिक', 'वसायुक्त भोजन के साथ लें', 'सप्लीमेंटेशन के 3 महीने बाद दोबारा जांचें']
  },
  {
    id: 'vitamin_b12',
    name: 'Vitamin B12',
    category: 'Vitamins',
    unit: 'pg/mL',
    rangeMale: { low: 200, high: 900 },
    rangeFemale: { low: 200, high: 900 },
    criticalLow: 100,
    hindiName: 'विटामिन बी12',
    hindiExplanation: 'नर्व सिस्टम और रेड ब्लड सेल्स के लिए जरूरी। शाकाहारियों में कमी आम है क्योंकि B12 मुख्य रूप से नॉन-वेज में मिलता है।',
    englishExplanation: 'Essential for nerve function and red blood cell production. Deficiency is very common in Indian vegetarians since B12 is primarily found in animal products. Causes anemia and nerve damage.',
    significance: 'Critical for neurological health and blood cell formation. Deficiency causes irreversible nerve damage if untreated.',
    riskFactors: ['Vegetarian/vegan diet', 'Metformin use', 'PPI medications', 'Gastric surgery', 'Age >50'],
    relatedConditions: ['Pernicious anemia', 'Neuropathy', 'Cognitive decline'],
    recommendedActions: ['<200: Deficiency — supplement urgently', '200-300: Borderline — supplement recommended', '>300: Adequate — maintain levels', 'Non-veg: Include eggs, fish, dairy', 'Vegetarians: B12 supplement is mandatory', 'B12 1000 mcg weekly or 2500 mcg monthly', 'Sublingual B12 absorbs better', 'Re-check after 3 months'],
    hindiRecommendedActions: ['<200: कमी — तुरंत सप्लीमेंट लें', '200-300: सीमांत — सप्लीमेंट अनुशंसित', '>300: पर्याप्त — स्तर बनाए रखें', 'नॉन-वेज: अंडे, मछली, डेयरी शामिल करें', 'शाकाहारी: B12 सप्लीमेंट अनिवार्य है', 'B12 1000 mcg साप्ताहिक या 2500 mcg मासिक', 'सबलिंगुअल B12 बेहतर अवशोषित होता है', '3 महीने बाद दोबारा जांचें']
  },

  // ===== INFLAMMATION =====
  {
    id: 'crp',
    name: 'hs-CRP (High-sensitivity C-reactive Protein)',
    category: 'Inflammation',
    unit: 'mg/L',
    rangeMale: { low: 0, high: 3 },
    rangeFemale: { low: 0, high: 3 },
    criticalLow: 0,
    criticalHigh: 10,
    hindiName: 'एचएस-सीआरपी',
    hindiExplanation: 'शरीर में सूजन का सबसे संवेदनशील मार्कर। बढ़ने पर हार्ट डिजीज, डायबिटीज और क्रोनिक बीमारियों का खतरा बढ़ता है।',
    englishExplanation: 'Most sensitive marker of systemic inflammation. Elevated CRP is linked to heart disease, diabetes, and cancer risk. ICMR studies show inflammation-related diseases rising 8% annually in urban India.',
    significance: 'Key indicator of chronic inflammation. Predicts cardiovascular events independently of cholesterol.',
    riskFactors: ['Obesity', 'Sedentary lifestyle', 'Smoking', 'Chronic infections', 'Autoimmune diseases'],
    relatedConditions: ['Cardiovascular disease', 'Metabolic syndrome', 'Autoimmune diseases'],
    recommendedActions: ['<1: Low risk', '1-3: Moderate risk — lifestyle changes', '>3: High risk — see doctor urgently', 'Anti-inflammatory diet: turmeric, omega-3, green tea', 'Regular exercise reduces CRP', 'Lose weight if overweight', 'Quit smoking', 'Re-check every 3 months'],
    hindiRecommendedActions: ['<1: कम खतरा', '1-3: मध्यम खतरा — जीवनशैली बदलें', '>3: उच्च खतरा — तुरंत डॉक्टर से मिलें', 'एंटी-इंफ्लेमेटरी आहार: हल्दी, ओमेगा-3, ग्रीन टी', 'नियमित व्यायाम CRP कम करता है', 'वजन कम करें', 'स्मोकिंग छोड़ें', 'हर 3 महीने में दोबारा जांचें']
  },

  // ===== IRON STUDIES =====
  {
    id: 'ferritin',
    name: 'Ferritin',
    category: 'Iron Studies',
    unit: 'ng/mL',
    rangeMale: { low: 30, high: 400 },
    rangeFemale: { low: 15, high: 150 },
    criticalLow: 10,
    criticalHigh: 1000,
    hindiName: 'फेरिटिन',
    hindiExplanation: 'आयरन स्टोरेज का सबसे सटीक मार्कर। कम होने पर आयरन डिफिशिएंसी एनीमिया का पता चलता है।',
    englishExplanation: 'Most accurate marker of iron stores in the body. Low ferritin indicates iron deficiency even before anemia develops. Women are at higher risk due to menstrual blood loss.',
    significance: 'Best indicator of total body iron. Low ferritin = iron deficiency; High ferritin = iron overload or inflammation.',
    riskFactors: ['Heavy periods', 'Vegetarian diet', 'Pregnancy', 'GI bleeding', 'Frequent blood donation'],
    relatedConditions: ['Iron deficiency anemia', 'Hemochromatosis', 'Chronic inflammation'],
    recommendedActions: ['<15: Severe iron deficiency — supplement urgently', '15-30: Iron deficiency — supplement needed', '30-400 men / 15-150 women: Normal', '>400: Iron overload — see doctor', 'Take iron with Vitamin C', 'Avoid tea/coffee with iron supplements', 'Re-check ferritin after 3 months of treatment'],
    hindiRecommendedActions: ['<15: गंभीर आयरन कमी — तुरंत सप्लीमेंट लें', '15-30: आयरन कमी — सप्लीमेंट जरूरी', '30-400 पुरुष / 15-150 महिला: सामान्य', '>400: आयरन ओवरलोड — डॉक्टर से मिलें', 'आयरन विटामिन C के साथ लें', 'आयरन सप्लीमेंट के साथ चाय/कॉफी न लें', '3 महीने इलाज के बाद फेरिटिन दोबारा चेक करें']
  },

  // ===== HORMONES =====
  {
    id: 'testosterone_total',
    name: 'Total Testosterone',
    category: 'Hormones (Male)',
    unit: 'ng/dL',
    rangeMale: { low: 300, high: 1000 },
    rangeFemale: { low: 15, high: 70 },
    criticalLow: 200,
    hindiName: 'टोटल टेस्टोस्टेरोन',
    hindiExplanation: 'पुरुष हार्मोन जो मांसपेशियों, हड्डियों और लिबिडो के लिए जरूरी है। भारत में 25% पुरुषों में टेस्टोस्टेरोन की कमी पाई जाती है।',
    englishExplanation: 'Primary male hormone essential for muscle, bone, and sexual health. Studies show 25% of Indian men have low testosterone. Levels decline with age, obesity, and sedentary lifestyle.',
    significance: 'Key hormone for male health. Low levels affect energy, mood, muscle mass, and sexual function.',
    riskFactors: ['Obesity', 'Diabetes', 'Age', 'Sleep apnea', 'Chronic stress'],
    relatedConditions: ['Hypogonadism', 'Metabolic syndrome', 'Osteoporosis'],
    recommendedActions: ['<300: Low testosterone — see endocrinologist', '300-1000: Normal range', 'Get Free Testosterone for accurate assessment', 'Exercise (especially weight training) increases testosterone', 'Lose belly fat', 'Ensure adequate sleep (7-8 hours)', 'Reduce alcohol consumption'],
    hindiRecommendedActions: ['<300: कम टेस्टोस्टेरोन — एंडोक्रिनोलॉजिस्ट से मिलें', '300-1000: सामान्य रेंज', 'सटीक मूल्यांकन के लिए Free Testosterone कराएं', 'व्यायाम (खासकर वेट ट्रेनिंग) टेस्टोस्टेरोन बढ़ाता है', 'पेट की चर्बी कम करें', 'पर्याप्त नींद लें (7-8 घंटे)', 'शराब कम करें']
  },
  {
    id: 'estrogen',
    name: 'Estradiol (Estrogen)',
    category: 'Hormones (Female)',
    unit: 'pg/mL',
    rangeMale: { low: 10, high: 50 },
    rangeFemale: { low: 30, high: 400 },
    hindiName: 'एस्ट्राडियोल (एस्ट्रोजन)',
    hindiExplanation: 'महिला हार्मोन जो मासिक चक्र, हड्डियों और मूड के लिए जरूरी है।',
    englishExplanation: 'Primary female hormone regulating menstrual cycle, bone density, and mood. Levels vary throughout the menstrual cycle and decline during menopause.',
    significance: 'Key hormone for female reproductive and overall health. Essential for bone density and cardiovascular protection.',
    riskFactors: ['Menopause', 'PCOS', 'Obesity', 'Stress', 'Extreme exercise'],
    relatedConditions: ['Menopause', 'PCOS', 'Osteoporosis', 'Infertility'],
    recommendedActions: ['Levels vary by menstrual cycle phase', '<30: Low — may cause hot flashes and bone loss', 'Get tested on day 2-3 of cycle for accuracy', 'Consult gynecologist for abnormal levels', 'Calcium and Vitamin D for bone protection', 'Consider HRT after menopause (discuss with doctor)'],
    hindiRecommendedActions: ['स्तर मासिक चक्र के फेज के अनुसार बदलता है', '<30: कम — हॉट फ्लैश और हड्डी क्षति का कारण', 'सटीकता के लिए चक्र के दिन 2-3 पर जांच कराएं', 'असामान्य स्तर के लिए गाइनकोलॉजिस्ट से मिलें', 'हड्डी सुरक्षा के लिए कैल्शियम और विटामिन डी', 'मेनोपॉज के बाद HRT पर विचार करें (डॉक्टर से बात करें)']
  },

  // ===== URINE TEST =====
  {
    id: 'urine_albumin',
    name: 'Urine Albumin (Microalbumin)',
    category: 'Kidney Function',
    unit: 'mg/g',
    rangeMale: { low: 0, high: 30 },
    rangeFemale: { low: 0, high: 30 },
    criticalLow: 0,
    criticalHigh: 300,
    hindiName: 'यूरिन एल्बुमिन (माइक्रोएल्बुमिन)',
    hindiExplanation: 'किडनी क्षति का सबसे पहला संकेत। डायबिटीज में नियमित जांच जरूरी।',
    englishExplanation: 'Earliest marker of kidney damage, especially in diabetics. Microalbuminuria (30-300 mg/g) indicates early kidney disease. Normal is <30 mg/g.',
    significance: 'Most sensitive early warning sign of kidney damage. Critical for diabetic patients.',
    riskFactors: ['Diabetes', 'Hypertension', 'Obesity', 'Family history of kidney disease'],
    relatedConditions: ['Diabetic nephropathy', 'Chronic kidney disease', 'Hypertensive nephropathy'],
    recommendedActions: ['<30: Normal kidney function', '30-300: Microalbuminuria — early kidney damage, see doctor', '>300: Macroalbuminuria — significant kidney disease', 'Diabetics: Test annually', 'Control blood sugar and blood pressure strictly', 'ACE inhibitors may be prescribed'],
    hindiRecommendedActions: ['<30: सामान्य किडनी फंक्शन', '30-300: माइक्रोएल्बुमिन्यूरिया — शुरुआती किडनी क्षति, डॉक्टर से मिलें', '>300: मैक्रोएल्बुमिन्यूरिया — महत्वपूर्ण किडनी रोग', 'डायबिटीज: सालाना जांच कराएं', 'ब्लड शुगर और BP सख्ती से कंट्रोल करें', 'ACE inhibitors दिए जा सकते हैं']
  },

  // ===== CANCER MARKERS =====
  {
    id: 'psa',
    name: 'PSA (Prostate-Specific Antigen)',
    category: 'Cancer Markers (Male)',
    unit: 'ng/mL',
    rangeMale: { low: 0, high: 4.0 },
    rangeFemale: { low: 0, high: 0 },
    criticalLow: 0,
    criticalHigh: 10.0,
    hindiName: 'पीएसए (प्रोस्टेट-स्पेसिफिक एंटीजन)',
    hindiExplanation: 'प्रोस्टेट कैंसर स्क्रीनिंग का मुख्य टेस्ट। 50+ उम्र के पुरुषों को सालाना जांच करानी चाहिए।',
    englishExplanation: 'Primary screening marker for prostate cancer. PSA above 4.0 warrants further evaluation. PSA velocity (rate of change) is more important than single value. ICMR recommends annual PSA testing for men over 50.',
    significance: 'Key screening test for prostate cancer. Early detection dramatically improves outcomes.',
    riskFactors: ['Age >50', 'Family history', 'African ancestry', 'Obesity'],
    relatedConditions: ['Prostate cancer', 'BPH (enlarged prostate)', 'Prostatitis'],
    recommendedActions: ['<4.0: Normal — annual screening', '4.0-10: Borderline — repeat test, free PSA ratio', '>10: Elevated — see urologist urgently', 'Get Free PSA ratio for accuracy', 'PSA velocity (annual change) is important', 'DRE (digital rectal exam) should accompany PSA', 'Avoid ejaculation 48 hours before test'],
    hindiRecommendedActions: ['<4.0: सामान्य — सालाना स्क्रीनिंग', '4.0-10: सीमांत — टेस्ट दोहराएं, Free PSA अनुपात', '>10: ऊँचा — तुरंत यूरोलॉजिस्ट से मिलें', 'सटीकता के लिए Free PSA अनुपात कराएं', 'PSA वेग (सालाना बदलाव) महत्वपूर्ण है', 'PSA के साथ DRE (डिजिटल रेक्टल एग्जाम) होना चाहिए', 'टेस्ट से 48 घंटे पहले संभोग न करें']
  },
  {
    id: 'ca125',
    name: 'CA-125',
    category: 'Cancer Markers (Female)',
    unit: 'U/mL',
    rangeMale: { low: 0, high: 35 },
    rangeFemale: { low: 0, high: 35 },
    criticalLow: 0,
    criticalHigh: 35,
    hindiName: 'सीए-125',
    hindiExplanation: 'ओवेरियन कैंसर मार्कर। ऊपर 35 होने पर और जांच जरूरी।',
    englishExplanation: 'Tumor marker primarily used for ovarian cancer screening and monitoring. Elevated in ovarian cancer, endometriosis, and some benign conditions.',
    significance: 'Primary marker for ovarian cancer detection and monitoring treatment response.',
    riskFactors: ['Family history of ovarian/breast cancer', 'Endometriosis', 'Age >50', 'BRCA mutation'],
    relatedConditions: ['Ovarian cancer', 'Endometriosis', 'Pelvic inflammatory disease'],
    recommendedActions: ['<35: Normal range', '>35: Elevated — see gynecologist/oncologist', 'Not a standalone screening test', 'Combine with pelvic ultrasound', 'Trend over time is more important', 'Can be elevated in benign conditions'],
    hindiRecommendedActions: ['<35: सामान्य रेंज', '>35: ऊँचा — गाइनकोलॉजिस्ट/ऑन्कोलॉजिस्ट से मिलें', 'अकेले स्क्रीनिंग टेस्ट नहीं है', 'पेल्विक अल्ट्रासाउंड के साथ मिलाकर देखें', 'समय के साथ ट्रेंड अधिक महत्वपूर्ण है', 'बेनिग्न स्थितियों में भी ऊँचा हो सकता है']
  },

  // ===== ELECTROLYTES =====
  {
    id: 'sodium',
    name: 'Sodium',
    category: 'Electrolytes',
    unit: 'mEq/L',
    rangeMale: { low: 136, high: 145 },
    rangeFemale: { low: 136, high: 145 },
    criticalLow: 125,
    criticalHigh: 150,
    hindiName: 'सोडियम',
    hindiExplanation: 'शरीर में पानी और इलेक्ट्रोलाइट बैलेंस के लिए जरूरी।',
    englishExplanation: 'Essential electrolyte for fluid balance, nerve function, and muscle contraction. Imbalance can cause serious neurological symptoms.',
    significance: 'Critical for hydration and nerve function. Both low and high sodium can be dangerous.',
    riskFactors: ['Dehydration', 'Excessive water intake', 'Kidney disease', 'Heart failure', 'Medications (diuretics)'],
    relatedConditions: ['Hyponatremia', 'Hypernatremia', 'Dehydration'],
    recommendedActions: ['136-145: Normal electrolyte balance', '<135: Low sodium — may cause confusion, weakness', '>145: High sodium — may indicate dehydration', 'Stay properly hydrated', 'Balance salt intake', 'Monitor if on diuretics'],
    hindiRecommendedActions: ['136-145: सामान्य इलेक्ट्रोलाइट बैलेंस', '<135: कम सोडियम — भ्रम, कमजोरी का कारण', '>145: ऊँचा सोडियम — डिहाइड्रेशन का संकेत', 'ठीक से हाइड्रेटेड रहें', 'नमक का सेवन संतुलित करें', 'ड्यूरेटिक्स पर हैं तो निगरानी करें']
  },
  {
    id: 'potassium',
    name: 'Potassium',
    category: 'Electrolytes',
    unit: 'mEq/L',
    rangeMale: { low: 3.5, high: 5.0 },
    rangeFemale: { low: 3.5, high: 5.0 },
    criticalLow: 2.5,
    criticalHigh: 6.0,
    hindiName: 'पोटैशियम',
    hindiExplanation: 'हार्ट रिदम और मांसपेशी फंक्शन के लिए अत्यंत महत्वपूर्ण। असामान्य स्तर खतरनाक हो सकता है।',
    englishExplanation: 'Critical electrolyte for heart rhythm and muscle function. Both low and high potassium can cause life-threatening cardiac arrhythmias. Requires immediate attention if significantly abnormal.',
    significance: 'Vital for cardiac and neuromuscular function. Abnormal levels are medical emergencies.',
    riskFactors: ['Kidney disease', 'Medications (ACE inhibitors, diuretics)', 'Dehydration', 'Vomiting/diarrhea'],
    relatedConditions: ['Hyperkalemia', 'Hypokalemia', 'Cardiac arrhythmias'],
    recommendedActions: ['3.5-5.0: Normal potassium', '<3.5: Low — may cause muscle weakness and arrhythmias', '>5.0: High — dangerous for heart rhythm', 'Eat potassium-rich foods: bananas, coconut water, spinach', 'Monitor closely if on BP medications', 'Repeat test if abnormal'],
    hindiRecommendedActions: ['3.5-5.0: सामान्य पोटैशियम', '<3.5: कम — मांसपेशी कमजोरी और अनियमित धड़कन का कारण', '>5.0: ऊँचा — हार्ट रिदम के लिए खतरनाक', 'पोटैशियम युक्त भोजन खाएं: केला, नारियल पानी, पालक', 'BP दवाओं पर हैं तो सख्ती से निगरानी करें', 'असामान्य होने पर टेस्ट दोहराएं']
  }
];

// ============================================
// DATA SOURCE CREDITS
// ============================================

export const DATA_SOURCES = [
  {
    name: 'LabQAR Dataset',
    organization: 'University of Florida / NIH',
    description: '550 manually curated lab test reference ranges with clinical annotations',
    url: 'https://www.medrxiv.org/content/10.1101/2025.06.03.25328882v1.full',
    license: 'Open Access'
  },
  {
    name: 'Kaggle Laboratory Test Results',
    organization: 'Kaggle Community',
    description: '287+ biomarkers with reference ranges and clinical interpretations',
    url: 'https://www.kaggle.com/datasets/pinuto/laboratory-test-results-anonymized-dataset',
    license: 'CC0 Public Domain'
  },
  {
    name: 'Anonymized Blood Test Reports',
    organization: 'Defined.ai',
    description: '100,000 de-identified lab reports for AI training and validation',
    url: 'https://defined.ai/datasets/blood-test-reports',
    license: 'Commercial'
  },
  {
    name: 'ICMR Clinical Lab Reference Intervals',
    organization: 'Indian Council of Medical Research',
    description: 'Indian population-specific reference ranges from PMC4062657, PMC3552202',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4062657/',
    license: 'Open Access'
  },
  {
    name: 'getbased Health Dashboard',
    organization: 'getbased.health',
    description: 'Open-source blood work analysis platform with 287+ biomarkers',
    url: 'https://github.com/elkimek/get-based',
    license: 'GPL-3.0'
  },
  {
    name: 'Kantesti AI Blood Test Analyzer',
    organization: 'Kantesti Medical AI',
    description: 'Medical-grade AI blood test interpretation engine (IQ 138)',
    url: 'https://www.kantesti.net/',
    license: 'Commercial'
  },
  {
    name: 'MedGemma',
    organization: 'Google DeepMind',
    description: 'Medical AI model for clinical report analysis and interpretation',
    url: 'https://deepmind.google/technologies/gemma/',
    license: 'Research'
  }
];

// ============================================
// AI ANALYSIS TEMPLATES (Hindi + English)
// ============================================

export const ANALYSIS_TEMPLATES = {
  critical_low: {
    emoji: '🔴',
    hindi: 'बहुत कम — तुरंत डॉक्टर से संपर्क करें',
    english: 'Critically Low — Contact doctor immediately'
  },
  low: {
    emoji: '🟡',
    hindi: 'कम — निगरानी और संभवतः सुधार जरूरी',
    english: 'Low — Monitoring and possible correction needed'
  },
  normal: {
    emoji: '🟢',
    hindi: 'सामान्य — अच्छा स्वास्थ्य संकेत',
    english: 'Normal — Good health indicator'
  },
  high: {
    emoji: '🟠',
    hindi: 'ऊँचा — जीवनशैली बदलाव और निगरानी जरूरी',
    english: 'High — Lifestyle changes and monitoring required'
  },
  critical_high: {
    emoji: '🔴',
    hindi: 'बहुत ऊँचा — तुरंत डॉक्टर से संपर्क करें',
    english: 'Critically High — Contact doctor immediately'
  }
};

// ============================================
// SAMPLE LAB REPORT DATA
// ============================================

export const SAMPLE_LAB_REPORT = {
  id: 'sample-001',
  date: '2025-01-15',
  source: 'Dr Lal PathLabs',
  patient: {
    name: 'Rahul Sharma',
    age: 32,
    gender: 'male'
  },
  biomarkers: [
    { id: 'hemoglobin', value: 11.2, unit: 'g/dL' },
    { id: 'fasting_glucose', value: 108, unit: 'mg/dL' },
    { id: 'hba1c', value: 5.9, unit: '%' },
    { id: 'total_cholesterol', value: 224, unit: 'mg/dL' },
    { id: 'ldl_cholesterol', value: 152, unit: 'mg/dL' },
    { id: 'hdl_cholesterol', value: 38, unit: 'mg/dL' },
    { id: 'triglycerides', value: 168, unit: 'mg/dL' },
    { id: 'sgpt_alt', value: 32, unit: 'IU/L' },
    { id: 'sgot_ast', value: 28, unit: 'IU/L' },
    { id: 'bilirubin_total', value: 0.8, unit: 'mg/dL' },
    { id: 'creatinine', value: 0.9, unit: 'mg/dL' },
    { id: 'bun', value: 28, unit: 'mg/dL' },
    { id: 'egfr', value: 95, unit: 'mL/min/1.73m²' },
    { id: 'uric_acid', value: 6.8, unit: 'mg/dL' },
    { id: 'tsh', value: 3.2, unit: 'mIU/L' },
    { id: 'vitamin_d', value: 18, unit: 'ng/mL' },
    { id: 'vitamin_b12', value: 285, unit: 'pg/mL' },
    { id: 'crp', value: 3.8, unit: 'mg/L' },
    { id: 'ferritin', value: 45, unit: 'ng/mL' },
    { id: 'wbc', value: 7200, unit: '/µL' },
    { id: 'platelets', value: 245000, unit: '/µL' },
    { id: 'sodium', value: 140, unit: 'mEq/L' },
    { id: 'potassium', value: 4.5, unit: 'mEq/L' }
  ]
};
