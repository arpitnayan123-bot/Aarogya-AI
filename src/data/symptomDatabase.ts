// ============================================
// Aarogya AI — Indian Healthcare Symptom Dataset
// Source: Indian Healthcare Dataset (300+ entries)
// Covers: Disease mapping, severity, duration, regional prevalence
// ============================================

export type Severity = 'Mild' | 'Moderate' | 'Severe';

export interface SymptomDiseaseEntry {
  symptom: string;
  possibleDiseases: string;
  severity: Severity;
  avgDurationDays: number;
  commonRegion: string;
  languages: string;
}

export const SYMPTOM_DATABASE: SymptomDiseaseEntry[] = [
  { symptom: 'Fever', possibleDiseases: 'Malaria, Dengue, Typhoid', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali' },
  { symptom: 'Persistent cough', possibleDiseases: 'Tuberculosis, Bronchitis, COVID-19', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Joint pain', possibleDiseases: 'Chikungunya, Arthritis, Dengue', severity: 'Moderate', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Skin rash', possibleDiseases: 'Chickenpox, Measles, Allergic dermatitis', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Headache', possibleDiseases: 'Migraine, Sinusitis, Hypertension', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Malayalam' },
  { symptom: 'Abdominal pain', possibleDiseases: 'Gastritis, Appendicitis, Food poisoning', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada, Bengali' },
  { symptom: 'Diarrhea', possibleDiseases: 'Gastroenteritis, Cholera, Food poisoning', severity: 'Moderate', avgDurationDays: 4, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Gujarati' },
  { symptom: 'Vomiting', possibleDiseases: 'Food poisoning, Viral infection, Gastritis', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Malayalam' },
  { symptom: 'Fatigue', possibleDiseases: 'Anemia, Hypothyroidism, Chronic fatigue syndrome', severity: 'Mild', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Difficulty breathing', possibleDiseases: 'Asthma, Pneumonia, COPD', severity: 'Severe', avgDurationDays: 14, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Sore throat', possibleDiseases: 'Pharyngitis, Tonsillitis, Common cold', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Nasal congestion', possibleDiseases: 'Common cold, Sinusitis, Allergic rhinitis', severity: 'Mild', avgDurationDays: 7, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Chest pain', possibleDiseases: 'Angina, Gastroesophageal reflux, Pneumonia', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Dizziness', possibleDiseases: 'Vertigo, Anemia, Low blood pressure', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Swollen lymph nodes', possibleDiseases: 'Tuberculosis, Lymphoma, Viral infection', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Tamil, Marathi' },
  { symptom: 'Jaundice', possibleDiseases: 'Hepatitis, Liver cirrhosis, Malaria', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Blood in stool', possibleDiseases: 'Hemorrhoids, Colorectal cancer, Dysentery', severity: 'Severe', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Malayalam' },
  { symptom: 'Burning urination', possibleDiseases: 'Urinary tract infection, Kidney stones, Prostatitis', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Bengali' },
  { symptom: 'Back pain', possibleDiseases: 'Muscle strain, Herniated disc, Kidney stones', severity: 'Moderate', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Marathi, Bengali' },
  { symptom: 'Ear pain', possibleDiseases: 'Ear infection, Swimmer\'s ear, Sinusitis', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Blurred vision', possibleDiseases: 'Cataract, Glaucoma, Diabetic retinopathy', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Malayalam' },
  { symptom: 'Loss of appetite', possibleDiseases: 'Tuberculosis, Depression, Hepatitis', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Night sweats', possibleDiseases: 'Tuberculosis, Lymphoma, Menopause', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Gujarati' },
  { symptom: 'Nausea', possibleDiseases: 'Motion sickness, Gastritis, Pregnancy', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Malayalam' },
  { symptom: 'Muscle weakness', possibleDiseases: 'Vitamin D deficiency, Myasthenia gravis, Thyroid disorders', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Frequent urination', possibleDiseases: 'Diabetes, Urinary tract infection, Prostate enlargement', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Constipation', possibleDiseases: 'Irritable bowel syndrome, Hypothyroidism, Dehydration', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Blood in urine', possibleDiseases: 'Urinary tract infection, Kidney stones, Bladder cancer', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Wheezing', possibleDiseases: 'Asthma, Bronchitis, COPD', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Stiff neck', possibleDiseases: 'Meningitis, Cervical spondylosis, Muscle strain', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Ankle swelling', possibleDiseases: 'Heart failure, Kidney disease, Venous insufficiency', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Malayalam' },
  { symptom: 'Weight loss', possibleDiseases: 'Tuberculosis, Cancer, Hyperthyroidism', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Excessive thirst', possibleDiseases: 'Diabetes, Dehydration, Kidney disease', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Increased hunger', possibleDiseases: 'Diabetes, Hyperthyroidism, Parasitic infection', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Gujarati' },
  { symptom: 'Dry cough', possibleDiseases: 'Bronchitis, COVID-19, Asthma', severity: 'Moderate', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Malayalam' },
  { symptom: 'Productive cough', possibleDiseases: 'Pneumonia, Bronchitis, Tuberculosis', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Itchy skin', possibleDiseases: 'Scabies, Eczema, Allergies', severity: 'Mild', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Red eyes', possibleDiseases: 'Conjunctivitis, Allergies, Glaucoma', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Mouth ulcers', possibleDiseases: 'Vitamin deficiency, Viral infection, Stress', severity: 'Mild', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Hair loss', possibleDiseases: 'Alopecia, Thyroid disorders, Nutritional deficiency', severity: 'Mild', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Palpitations', possibleDiseases: 'Anxiety, Arrhythmia, Anemia', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Malayalam' },
  { symptom: 'Memory problems', possibleDiseases: 'Dementia, Vitamin B12 deficiency, Depression', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Tremors', possibleDiseases: 'Parkinson\'s disease, Essential tremor, Hyperthyroidism', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Excessive sweating', possibleDiseases: 'Hyperthyroidism, Tuberculosis, Menopause', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Gujarati' },
  { symptom: 'Hoarseness', possibleDiseases: 'Laryngitis, Vocal cord nodules, Thyroid cancer', severity: 'Mild', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Insomnia', possibleDiseases: 'Anxiety, Depression, Sleep apnea', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Excessive sleepiness', possibleDiseases: 'Sleep apnea, Depression, Hypothyroidism', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Numbness in extremities', possibleDiseases: 'Peripheral neuropathy, Vitamin B12 deficiency, Diabetes', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Painful urination', possibleDiseases: 'Urinary tract infection, Kidney stones, Sexually transmitted infection', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Swollen joints', possibleDiseases: 'Rheumatoid arthritis, Gout, Reactive arthritis', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Muscle cramps', possibleDiseases: 'Dehydration, Electrolyte imbalance, Vitamin D deficiency', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Eye pain', possibleDiseases: 'Glaucoma, Corneal abrasion, Iritis', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Blood pressure fluctuations', possibleDiseases: 'Hypertension, Pheochromocytoma, Anxiety', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Irregular heartbeat', possibleDiseases: 'Arrhythmia, Anxiety, Electrolyte imbalance', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Excessive bruising', possibleDiseases: 'Platelet disorders, Vitamin K deficiency, Leukemia', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Toothache', possibleDiseases: 'Dental cavity, Abscess, Gum disease', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Jaw pain', possibleDiseases: 'Temporomandibular joint disorder, Dental abscess, Trigeminal neuralgia', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Bloody sputum', possibleDiseases: 'Tuberculosis, Lung cancer, Pneumonia', severity: 'Severe', avgDurationDays: 7, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Lower back pain', possibleDiseases: 'Sciatica, Kidney infection, Herniated disc', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Knee pain', possibleDiseases: 'Osteoarthritis, Ligament injury, Gout', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Shoulder pain', possibleDiseases: 'Frozen shoulder, Rotator cuff injury, Bursitis', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Abdominal bloating', possibleDiseases: 'Irritable bowel syndrome, Gastritis, Lactose intolerance', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Anal bleeding', possibleDiseases: 'Hemorrhoids, Anal fissure, Colorectal cancer', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Decreased urine output', possibleDiseases: 'Kidney disease, Dehydration, Urinary obstruction', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Loss of consciousness', possibleDiseases: 'Syncope, Epilepsy, Hypoglycemia', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Malayalam' },
  { symptom: 'Confusion', possibleDiseases: 'Delirium, Dementia, Encephalitis', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Slurred speech', possibleDiseases: 'Stroke, Transient ischemic attack, Multiple sclerosis', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Facial drooping', possibleDiseases: 'Stroke, Bell\'s palsy, Transient ischemic attack', severity: 'Severe', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Limb weakness', possibleDiseases: 'Stroke, Multiple sclerosis, Guillain-Barré syndrome', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Double vision', possibleDiseases: 'Stroke, Brain tumor, Multiple sclerosis', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Seizures', possibleDiseases: 'Epilepsy, Brain tumor, Meningitis', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Ringing in ears', possibleDiseases: 'Tinnitus, Meniere\'s disease, Ear infection', severity: 'Mild', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Hearing loss', possibleDiseases: 'Age-related hearing loss, Ear infection, Acoustic neuroma', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Balance problems', possibleDiseases: 'Vertigo, Inner ear infection, Multiple sclerosis', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Frequent falls', possibleDiseases: 'Parkinson\'s disease, Orthostatic hypotension, Multiple sclerosis', severity: 'Severe', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Erectile dysfunction', possibleDiseases: 'Diabetes, Hypertension, Depression', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Breast lump', possibleDiseases: 'Fibrocystic disease, Breast cancer, Mastitis', severity: 'Severe', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Menstrual pain', possibleDiseases: 'Endometriosis, Adenomyosis, Pelvic inflammatory disease', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Missed periods', possibleDiseases: 'Pregnancy, Polycystic ovary syndrome, Stress', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Testicular pain', possibleDiseases: 'Epididymitis, Testicular torsion, Orchitis', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Yellow skin', possibleDiseases: 'Jaundice, Hepatitis, Gallstones', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Pale skin', possibleDiseases: 'Anemia, Shock, Vitamin deficiency', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Cyanosis', possibleDiseases: 'Heart failure, Pulmonary embolism, COPD', severity: 'Severe', avgDurationDays: 3, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Swollen face', possibleDiseases: 'Kidney disease, Allergic reaction, Cushing\'s syndrome', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Dark circles under eyes', possibleDiseases: 'Allergies, Sleep deprivation, Anemia', severity: 'Mild', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Difficulty swallowing', possibleDiseases: 'Esophageal stricture, Throat cancer, Achalasia', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Neck swelling', possibleDiseases: 'Goiter, Lymphadenopathy, Thyroid cancer', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Hiccups', possibleDiseases: 'Gastroesophageal reflux, Hiatal hernia, Pneumonia', severity: 'Mild', avgDurationDays: 2, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Night blindness', possibleDiseases: 'Vitamin A deficiency, Retinitis pigmentosa, Cataracts', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Rural India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Sensitivity to light', possibleDiseases: 'Migraine, Iritis, Corneal abrasion', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Dry eyes', possibleDiseases: 'Sjögren\'s syndrome, Aging, Computer vision syndrome', severity: 'Mild', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Yellow eyes', possibleDiseases: 'Jaundice, Hepatitis, Alcoholic liver disease', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Dry mouth', possibleDiseases: 'Sjögren\'s syndrome, Dehydration, Medication side effect', severity: 'Mild', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Nose bleeding', possibleDiseases: 'Hypertension, Dry air, Blood disorders', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Runny nose', possibleDiseases: 'Common cold, Allergies, Sinusitis', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Sneezing', possibleDiseases: 'Allergies, Common cold, Rhinitis', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Loss of smell', possibleDiseases: 'COVID-19, Nasal polyps, Zinc deficiency', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Frequent infections', possibleDiseases: 'HIV, Diabetes, Immunodeficiency', severity: 'Severe', avgDurationDays: 90, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Unexplained weight loss', possibleDiseases: 'Tuberculosis, Cancer, Hyperthyroidism', severity: 'Severe', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Unexplained weight gain', possibleDiseases: 'Hypothyroidism, Cushing\'s syndrome, Edema', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Delayed wound healing', possibleDiseases: 'Diabetes, Peripheral vascular disease, Zinc deficiency', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Skin discoloration', possibleDiseases: 'Vitiligo, Melasma, Tinea versicolor', severity: 'Mild', avgDurationDays: 180, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Foot ulcers', possibleDiseases: 'Diabetes, Peripheral vascular disease, Neuropathy', severity: 'Severe', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Vitiligo', possibleDiseases: 'Autoimmune disorder, Genetic factors, Inflammatory conditions', severity: 'Moderate', avgDurationDays: 3650, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Hives', possibleDiseases: 'Allergic reaction, Stress, Infection', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Warts', possibleDiseases: 'Human papillomavirus, Immune suppression, Skin trauma', severity: 'Mild', avgDurationDays: 180, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Varicose veins', possibleDiseases: 'Chronic venous insufficiency, Pregnancy, Prolonged standing', severity: 'Mild', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Cold sores', possibleDiseases: 'Herpes simplex virus, Weakened immune system, Stress', severity: 'Mild', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Leg cramps at night', possibleDiseases: 'Dehydration, Electrolyte imbalance, Peripheral artery disease', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Flank pain', possibleDiseases: 'Kidney stones, Pyelonephritis, Muscle strain', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Kannada' },
  { symptom: 'Pelvic pain', possibleDiseases: 'Endometriosis, Pelvic inflammatory disease, Ovarian cysts', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali' },
  { symptom: 'Heel pain', possibleDiseases: 'Plantar fasciitis, Achilles tendinitis, Heel spurs', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Malayalam' },
  { symptom: 'Hip pain', possibleDiseases: 'Arthritis, Bursitis, Sciatica', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Telugu, Marathi' },
  { symptom: 'Tingling sensation', possibleDiseases: 'Peripheral neuropathy, Vitamin deficiency, Carpal tunnel syndrome', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Loss of coordination', possibleDiseases: 'Ataxia, Stroke, Multiple sclerosis', severity: 'Severe', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Shuffling gait', possibleDiseases: 'Parkinson\'s disease, Normal pressure hydrocephalus, Stroke', severity: 'Severe', avgDurationDays: 180, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Difficulty walking', possibleDiseases: 'Peripheral neuropathy, Parkinson\'s disease, Arthritis', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Mood swings', possibleDiseases: 'Bipolar disorder, Hormonal changes, Premenstrual syndrome (PMS)', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Feeling hopeless', possibleDiseases: 'Depression, Anxiety, Chronic illness', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Excessive worry', possibleDiseases: 'Generalized anxiety disorder, Panic disorder, OCD', severity: 'Moderate', avgDurationDays: 90, commonRegion: 'Urban India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Panic attacks', possibleDiseases: 'Panic disorder, Agoraphobia, Specific phobia', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Urban India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Feeling detached', possibleDiseases: 'Depersonalization disorder, Anxiety, PTSD', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Urban India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Substance craving', possibleDiseases: 'Substance use disorder, Addiction, Withdrawal', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Punjabi' },
  { symptom: 'Heat intolerance', possibleDiseases: 'Hyperthyroidism, Graves\' disease, Menopause', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Cold intolerance', possibleDiseases: 'Hypothyroidism, Raynaud\'s disease, Anemia', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Cloudy urine', possibleDiseases: 'Urinary tract infection, Kidney stones, Dehydration', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Vaginal itching', possibleDiseases: 'Yeast infection, Bacterial vaginosis, Sexually transmitted infection', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Heavy menstrual bleeding', possibleDiseases: 'Uterine fibroids, Adenomyosis, Bleeding disorders', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Irregular periods', possibleDiseases: 'Polycystic ovary syndrome (PCOS), Thyroid disorders, Stress', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Lump in testicle', possibleDiseases: 'Testicular cancer, Epididymal cyst, Hydrocele', severity: 'Severe', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Painful ejaculation', possibleDiseases: 'Prostatitis, Seminal vesiculitis, Sexually transmitted infection', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Sores on genitals', possibleDiseases: 'Herpes simplex virus, Syphilis, Chancroid', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu, Punjabi' },
  { symptom: 'Mucus in stool', possibleDiseases: 'Irritable bowel syndrome (IBS), Ulcerative colitis, Infection', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Heartburn', possibleDiseases: 'Gastroesophageal reflux disease (GERD), Hiatal hernia, Pregnancy', severity: 'Mild', avgDurationDays: 2, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Regurgitation of food or sour liquid', possibleDiseases: 'Gastroesophageal reflux disease (GERD), Achalasia', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Chest pressure', possibleDiseases: 'Angina, Heart attack, GERD', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Chest tightness', possibleDiseases: 'Asthma, Anxiety attack, Angina', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Pain radiating to arm/jaw/back', possibleDiseases: 'Heart attack, Angina', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Shortness of breath with exertion', possibleDiseases: 'Heart failure, COPD, Anemia', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Shortness of breath at rest', possibleDiseases: 'Pulmonary embolism, Pneumonia, Severe heart failure', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Waking up breathless', possibleDiseases: 'Heart failure, Sleep apnea', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Rapid breathing', possibleDiseases: 'Pneumonia, Asthma attack, Anxiety', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Blue lips or fingernails', possibleDiseases: 'Hypoxia (low oxygen), Heart failure, Severe lung disease', severity: 'Severe', avgDurationDays: 1, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Coughing up blood', possibleDiseases: 'Tuberculosis, Lung cancer, Bronchiectasis', severity: 'Severe', avgDurationDays: 7, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Chronic cough (more than 8 weeks)', possibleDiseases: 'Asthma, COPD, Postnasal drip', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Loss of voice', possibleDiseases: 'Laryngitis, Vocal cord paralysis, Overuse', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Ear discharge', possibleDiseases: 'Ear infection (otitis media/externa), Ruptured eardrum', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Sudden hearing loss', possibleDiseases: 'Sensorineural hearing loss, Viral infection, Stroke', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Gradual hearing loss', possibleDiseases: 'Age-related hearing loss, Noise exposure, Otosclerosis', severity: 'Moderate', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Eye redness', possibleDiseases: 'Conjunctivitis (pink eye), Dry eye, Uveitis', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Eye discharge', possibleDiseases: 'Conjunctivitis, Blocked tear duct, Corneal ulcer', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Seeing flashes of light', possibleDiseases: 'Retinal tear or detachment, Migraine aura', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Curtain or veil over vision', possibleDiseases: 'Retinal detachment', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Tunnel vision', possibleDiseases: 'Glaucoma, Retinitis pigmentosa, Stroke', severity: 'Severe', avgDurationDays: 180, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Blind spots in vision', possibleDiseases: 'Macular degeneration, Glaucoma, Optic neuritis', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Joint deformities', possibleDiseases: 'Rheumatoid arthritis, Osteoarthritis', severity: 'Severe', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Bone pain', possibleDiseases: 'Osteoporosis (fracture), Bone cancer, Paget\'s disease', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Curvature of the spine', possibleDiseases: 'Scoliosis, Kyphosis, Osteoporosis', severity: 'Moderate', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Loss of height', possibleDiseases: 'Osteoporosis (vertebral fractures), Degenerative disc disease', severity: 'Moderate', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Feeling cold all the time', possibleDiseases: 'Hypothyroidism, Anemia, Poor circulation', severity: 'Mild', avgDurationDays: 30, commonRegion: 'North India', languages: 'English, Hindi, Punjabi, Urdu' },
  { symptom: 'Pounding heart', possibleDiseases: 'Palpitations, Anxiety, Arrhythmia', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Rapid heartbeat', possibleDiseases: 'Anxiety, Arrhythmia (SVT, Afib), Hyperthyroidism', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Slow heartbeat', possibleDiseases: 'Heart block, Sick sinus syndrome, Medications', severity: 'Moderate', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Swelling in legs and ankles', possibleDiseases: 'Heart failure, Kidney disease, Venous insufficiency', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Swelling in abdomen', possibleDiseases: 'Liver cirrhosis, Heart failure, Kidney disease', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Calf pain when walking', possibleDiseases: 'Peripheral artery disease', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Sores on feet or legs that heal slowly', possibleDiseases: 'Peripheral artery disease, Diabetes', severity: 'Severe', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'One leg swollen and painful', possibleDiseases: 'Deep vein thrombosis (DVT), Cellulitis', severity: 'Severe', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Headache worse in the morning', possibleDiseases: 'Brain tumor, Sleep apnea, High blood pressure', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Headache with fever and stiff neck', possibleDiseases: 'Meningitis', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Headache after head injury', possibleDiseases: 'Concussion, Subdural hematoma', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Band-like pressure around head', possibleDiseases: 'Tension headache', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Severe pain around one eye', possibleDiseases: 'Cluster headache', severity: 'Severe', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Chills', possibleDiseases: 'Fever, Infection, Hypothermia', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Fever that comes and goes', possibleDiseases: 'Malaria, Tuberculosis, Lymphoma', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'High fever (above 103F)', possibleDiseases: 'Severe infection (sepsis, pneumonia), Heat stroke', severity: 'Severe', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Bedwetting', possibleDiseases: 'Urinary tract infection, Sleep apnea, Diabetes', severity: 'Mild', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Bedwetting', possibleDiseases: 'Urinary tract infection, Sleep apnea, Diabetes', severity: 'Mild', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Excessive crying in infants', possibleDiseases: 'Colic, Ear infection, Gastroesophageal reflux', severity: 'Moderate', avgDurationDays: 90, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Speech delay', possibleDiseases: 'Autism spectrum disorder, Hearing loss, Intellectual disability', severity: 'Severe', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Hyperactivity', possibleDiseases: 'ADHD, Hyperthyroidism, Lead poisoning', severity: 'Moderate', avgDurationDays: 365, commonRegion: 'Urban India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Lockjaw', possibleDiseases: 'Tetanus, Temporomandibular joint disorder, Peritonsillar abscess', severity: 'Severe', avgDurationDays: 14, commonRegion: 'Rural India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Dandruff', possibleDiseases: 'Seborrheic dermatitis, Psoriasis, Fungal infection', severity: 'Mild', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Premature graying', possibleDiseases: 'Genetic factors, Vitamin B12 deficiency, Thyroid disorders', severity: 'Mild', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Boils', possibleDiseases: 'Staphylococcal infection, Folliculitis, Hidradenitis suppurativa', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Telugu' },
  { symptom: 'Blisters', possibleDiseases: 'Burns, Friction, Pemphigus', severity: 'Moderate', avgDurationDays: 10, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Bengali, Marathi' },
  { symptom: 'Indigestion', possibleDiseases: 'Gastroesophageal reflux disease (GERD), Peptic ulcer, Gastritis', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Water brash', possibleDiseases: 'Gastroesophageal reflux disease (GERD)', severity: 'Mild', avgDurationDays: 2, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Pain after eating', possibleDiseases: 'Gastritis, Peptic ulcer, Gallstones', severity: 'Moderate', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Bloating after eating', possibleDiseases: 'Irritable bowel syndrome (IBS), Food intolerance, Gastroparesis', severity: 'Mild', avgDurationDays: 2, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Greasy stools', possibleDiseases: 'Malabsorption, Pancreatitis, Celiac disease', severity: 'Moderate', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Pale stools', possibleDiseases: 'Bile duct obstruction, Liver disease, Pancreatitis', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Bright red blood in stool', possibleDiseases: 'Lower gastrointestinal bleeding', severity: 'Severe', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Alternating constipation and diarrhea', possibleDiseases: 'Irritable bowel syndrome (IBS), Inflammatory bowel disease (IBD)', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Straining during bowel movements', possibleDiseases: 'Constipation, Hemorrhoids, Anal fissure', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Metallic taste in mouth', possibleDiseases: 'Medication side effect, Pregnancy, Gum disease', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Sour taste in mouth', possibleDiseases: 'Gastroesophageal reflux disease (GERD), Gastritis', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Bitter taste in mouth', possibleDiseases: 'Acid reflux, Liver or gallbladder problems, Medication side effect', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Feeling full quickly', possibleDiseases: 'Gastroparesis, Stomach ulcer, Stomach cancer', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Barking cough', possibleDiseases: 'Croup, Laryngitis', severity: 'Moderate', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Whooping cough sound', possibleDiseases: 'Pertussis', severity: 'Severe', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Ear fullness', possibleDiseases: 'Eustachian tube dysfunction, Earwax impaction, Meniere\'s disease', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Itchy ear canal', possibleDiseases: 'Otitis externa (swimmer\'s ear), Eczema, Fungal infection', severity: 'Mild', avgDurationDays: 5, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Sudden hearing loss', possibleDiseases: 'Sensorineural hearing loss, Viral infection, Stroke', severity: 'Severe', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Gritty sensation in eye', possibleDiseases: 'Dry eye syndrome, Foreign body, Blepharitis', severity: 'Mild', avgDurationDays: 3, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Stye', possibleDiseases: 'Infected eyelash follicle', severity: 'Mild', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Droopy eyelid', possibleDiseases: 'Myasthenia gravis, Nerve damage, Aging', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Seeing floaters', possibleDiseases: 'Posterior vitreous detachment, Retinal tear, Uveitis', severity: 'Mild', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Distorted vision', possibleDiseases: 'Macular degeneration, Diabetic retinopathy', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Difficulty seeing at night', possibleDiseases: 'Night blindness (Vitamin A def.), Cataracts, Retinitis pigmentosa', severity: 'Moderate', avgDurationDays: 60, commonRegion: 'Rural India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Halos around lights', possibleDiseases: 'Cataracts, Glaucoma, Corneal edema', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Skin sensitivity to touch', possibleDiseases: 'Neuropathy, Fibromyalgia, Sunburn', severity: 'Moderate', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Stretch marks', possibleDiseases: 'Rapid weight gain/loss, Pregnancy, Cushing\'s syndrome', severity: 'Mild', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Pinpoint red spots on skin', possibleDiseases: 'Thrombocytopenia, Infection (meningitis, sepsis), Leukemia', severity: 'Severe', avgDurationDays: 7, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Sore that does not heal', possibleDiseases: 'Skin cancer (basal cell, squamous cell), Chronic infection', severity: 'Severe', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Butterfly rash across face', possibleDiseases: 'Systemic lupus erythematosus (SLE)', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Reduced range of motion in joints', possibleDiseases: 'Arthritis, Injury, Frozen shoulder', severity: 'Moderate', avgDurationDays: 30, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Feeling hot all the time', possibleDiseases: 'Hyperthyroidism, Menopause, Anxiety', severity: 'Mild', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Skipped heartbeats', possibleDiseases: 'Premature atrial/ventricular contractions (PACs/PVCs), Anxiety', severity: 'Mild', avgDurationDays: 1, commonRegion: 'Pan-India', languages: 'English, Hindi, Tamil, Telugu' },
  { symptom: 'Prominent neck veins', possibleDiseases: 'Heart failure, Superior vena cava obstruction', severity: 'Severe', avgDurationDays: 14, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Poor wound healing', possibleDiseases: 'Diabetes, Poor circulation, Malnutrition', severity: 'Moderate', avgDurationDays: 21, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Marathi' },
  { symptom: 'Delayed milestones in children', possibleDiseases: 'Developmental delay, Autism spectrum disorder, Cerebral palsy', severity: 'Severe', avgDurationDays: 365, commonRegion: 'Pan-India', languages: 'English, Hindi, Bengali, Malayalam' },
  { symptom: 'Learning disability', possibleDiseases: 'Specific learning disorder (dyslexia, dyscalculia), ADHD', severity: 'Moderate', avgDurationDays: 365, commonRegion: 'Urban India', languages: 'English, Hindi, Tamil, Kannada' },
  { symptom: 'Behavioral problems in children', possibleDiseases: 'ADHD, Oppositional defiant disorder, Conduct disorder', severity: 'Moderate', avgDurationDays: 180, commonRegion: 'Urban India', languages: 'English, Hindi, Bengali, Marathi' },
];

// Smart fuzzy-matching function for symptom lookup
export const findSymptomEntry = (query: string): SymptomDiseaseEntry | null => {
  if (!query.trim()) return null;
  const normalized = query.toLowerCase().trim();

  // Exact match first
  const exact = SYMPTOM_DATABASE.find(e => e.symptom.toLowerCase() === normalized);
  if (exact) return exact;

  // Word-based match: check if any database symptom is contained in the query OR vice versa
  const queryWords = normalized.split(/\s+/);
  let bestMatch: SymptomDiseaseEntry | null = null;
  let bestScore = 0;

  for (const entry of SYMPTOM_DATABASE) {
    const entryLower = entry.symptom.toLowerCase();
    const entryWords = entryLower.split(/\s+/);

    // Count word overlap
    let overlap = 0;
    for (const qWord of queryWords) {
      if (qWord.length < 2) continue;
      for (const eWord of entryWords) {
        if (eWord.includes(qWord) || qWord.includes(eWord)) {
          overlap++;
          break;
        }
      }
    }

    // Also check if the entry symptom appears fully in query
    if (entryLower.length > 3 && normalized.includes(entryLower)) {
      overlap += 5;
    }

    // Prefer longer, more specific matches
    const score = overlap + (entryWords.length > 1 ? 1 : 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Return only if we have reasonable confidence (at least 1 significant overlap)
  return bestScore >= 1 ? bestMatch : null;
};

export const searchSymptoms = (query: string, limit = 8): SymptomDiseaseEntry[] => {
  if (!query.trim()) return SYMPTOM_DATABASE.slice(0, limit);
  const normalized = query.toLowerCase();
  return SYMPTOM_DATABASE
    .filter(e => e.symptom.toLowerCase().includes(normalized))
    .slice(0, limit);
};

export const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; badge: string; label: string; emoji: string }> = {
  Mild:     { color: 'text-emerald-600', bg: 'bg-emerald-50',  badge: 'border-emerald-200', label: 'Mild',     emoji: '🟢' },
  Moderate: { color: 'text-amber-600',   bg: 'bg-amber-50',    badge: 'border-amber-200',  label: 'Moderate', emoji: '🟡' },
  Severe:   { color: 'text-red-600',     bg: 'bg-red-50',      badge: 'border-red-200',    label: 'Severe',   emoji: '🔴' },
};
