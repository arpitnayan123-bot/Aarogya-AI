'use client';

import React, { useState } from 'react';
import {
  Activity, Heart, Droplets, FlaskConical, Ribbon, AlertTriangle,
  CheckCircle2, ChevronRight, TrendingUp, Info, Shield
} from 'lucide-react';
import {
  predictHeartDisease, predictDiabetes, predictLiverDisease,
  predictKidneyDisease, predictBreastCancer, RISK_CONFIG, DISEASE_INFO,
  type DiseaseType, type DiseasePrediction
} from '@/data/diseasePredictor';

const DISEASES: { type: DiseaseType; icon: any; color: string; bg: string; desc: string }[] = [
  { type: 'heart', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Cardiovascular risk' },
  { type: 'diabetes', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Type 2 diabetes' },
  { type: 'liver', icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Liver disease' },
  { type: 'kidney', icon: Activity, color: 'text-violet-500', bg: 'bg-violet-50', desc: 'Chronic kidney disease' },
  { type: 'breast_cancer', icon: Ribbon, color: 'text-pink-500', bg: 'bg-pink-50', desc: 'Breast cancer risk' },
];

export const DiseasePredictor: React.FC = () => {
  const [selected, setSelected] = useState<DiseaseType>('heart');
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [loading, setLoading] = useState(false);

  // Heart inputs
  const [heartInputs, setHeartInputs] = useState({
    age: 45, sex: 'male' as 'male' | 'female', chestPainType: 'asymptomatic' as any,
    restingBP: 120, cholesterol: 200, fastingBloodSugar: false,
    restingECG: 'normal' as any, maxHeartRate: 150, exerciseAngina: false,
    oldpeak: 1, slope: 'flat' as any, majorVessels: 0, thalassemia: 'normal' as any,
  });

  // Diabetes inputs
  const [diabetesInputs, setDiabetesInputs] = useState({
    pregnancies: 0, glucose: 100, bloodPressure: 70, skinThickness: 20,
    insulin: 80, bmi: 25, diabetesPedigree: 0.5, age: 35,
  });

  // Liver inputs
  const [liverInputs, setLiverInputs] = useState({
    age: 40, gender: 'male' as 'male' | 'female', totalBilirubin: 1.0,
    directBilirubin: 0.3, alkalinePhosphatase: 200, alanineAminotransferase: 30,
    aspartateAminotransferase: 30, totalProteins: 6.5, albumin: 3.5,
    albuminGlobulinRatio: 1.0,
  });

  // Kidney inputs
  const [kidneyInputs, setKidneyInputs] = useState({
    age: 45, bp: 80, specificGravity: 1.02, albumin: 0, sugar: 0,
    redBloodCells: 'normal' as 'normal' | 'abnormal',
    pusCell: 'normal' as 'normal' | 'abnormal',
    hypertension: false, diabetesMellitus: false, hemoglobin: 13, packedCellVolume: 40,
  });

  // Breast cancer inputs
  const [breastInputs, setBreastInputs] = useState({
    radius: 14, texture: 14, perimeter: 90, area: 600, smoothness: 0.1,
    compactness: 0.1, concavity: 0.1, symmetry: 0.2, fractalDimension: 0.05,
  });

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      let result: DiseasePrediction;
      switch (selected) {
        case 'heart': result = predictHeartDisease(heartInputs); break;
        case 'diabetes': result = predictDiabetes(diabetesInputs); break;
        case 'liver': result = predictLiverDisease(liverInputs); break;
        case 'kidney': result = predictKidneyDisease(kidneyInputs); break;
        case 'breast_cancer': result = predictBreastCancer(breastInputs); break;
      }
      setPrediction(result);
      setLoading(false);
    }, 800);
  };

  const currentDisease = DISEASES.find(d => d.type === selected)!;

  const numInput = (label: string, value: number, onChange: (v: number) => void, unit?: string) => (
    <div>
      <label className="text-xs font-bold text-slate-600 mb-1 block">{label}{unit && ` (${unit})`}</label>
      <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>
  );

  const selectInput = (label: string, value: string, options: { value: string; label: string }[], onChange: (v: string) => void) => (
    <div>
      <label className="text-xs font-bold text-slate-600 mb-1 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Disease Risk Predictor</h1>
            <p className="text-indigo-50/90 text-sm mt-1">Multi-disease screening · Kaggle clinical datasets</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" /> 5 diseases</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Info className="w-3 h-3" /> ML-based</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {DISEASES.map(d => (
          <button
            key={d.type}
            onClick={() => { setSelected(d.type); setPrediction(null); }}
            className={`p-4 rounded-2xl text-center transition-all ${selected === d.type ? `${d.bg} ring-2 ring-offset-2 ring-${d.color.replace('text-', '')}-300` : 'bg-white border border-slate-100 hover:bg-slate-50'}`}
          >
            <d.icon className={`w-7 h-7 mx-auto mb-2 ${selected === d.type ? d.color : 'text-slate-400'}`} />
            <div className={`text-xs font-bold ${selected === d.type ? d.color : 'text-slate-600'}`}>{DISEASE_INFO[d.type].name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <currentDisease.icon className={`w-5 h-5 ${currentDisease.color}`} />
          {DISEASE_INFO[selected].name} — Input Parameters
        </h2>
        <p className="text-xs text-slate-500 mb-4">{DISEASE_INFO[selected].description}</p>

        {selected === 'heart' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {numInput('Age', heartInputs.age, v => setHeartInputs({ ...heartInputs, age: v }))}
            {selectInput('Sex', heartInputs.sex, [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], v => setHeartInputs({ ...heartInputs, sex: v as any }))}
            {selectInput('Chest Pain', heartInputs.chestPainType, [{ value: 'typical', label: 'Typical Angina' }, { value: 'atypical', label: 'Atypical Angina' }, { value: 'non-anginal', label: 'Non-anginal' }, { value: 'asymptomatic', label: 'Asymptomatic' }], v => setHeartInputs({ ...heartInputs, chestPainType: v as any }))}
            {numInput('Resting BP', heartInputs.restingBP, v => setHeartInputs({ ...heartInputs, restingBP: v }), 'mmHg')}
            {numInput('Cholesterol', heartInputs.cholesterol, v => setHeartInputs({ ...heartInputs, cholesterol: v }), 'mg/dL')}
            {selectInput('FBS > 120', heartInputs.fastingBloodSugar ? 'yes' : 'no', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], v => setHeartInputs({ ...heartInputs, fastingBloodSugar: v === 'yes' }))}
            {numInput('Max HR', heartInputs.maxHeartRate, v => setHeartInputs({ ...heartInputs, maxHeartRate: v }))}
            {selectInput('Exercise Angina', heartInputs.exerciseAngina ? 'yes' : 'no', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], v => setHeartInputs({ ...heartInputs, exerciseAngina: v === 'yes' }))}
            {numInput('Oldpeak', heartInputs.oldpeak, v => setHeartInputs({ ...heartInputs, oldpeak: v }))}
            {numInput('Major Vessels', heartInputs.majorVessels, v => setHeartInputs({ ...heartInputs, majorVessels: v }))}
          </div>
        )}

        {selected === 'diabetes' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {numInput('Pregnancies', diabetesInputs.pregnancies, v => setDiabetesInputs({ ...diabetesInputs, pregnancies: v }))}
            {numInput('Glucose', diabetesInputs.glucose, v => setDiabetesInputs({ ...diabetesInputs, glucose: v }), 'mg/dL')}
            {numInput('Blood Pressure', diabetesInputs.bloodPressure, v => setDiabetesInputs({ ...diabetesInputs, bloodPressure: v }), 'mmHg')}
            {numInput('Skin Thickness', diabetesInputs.skinThickness, v => setDiabetesInputs({ ...diabetesInputs, skinThickness: v }), 'mm')}
            {numInput('Insulin', diabetesInputs.insulin, v => setDiabetesInputs({ ...diabetesInputs, insulin: v }), 'mu U/ml')}
            {numInput('BMI', diabetesInputs.bmi, v => setDiabetesInputs({ ...diabetesInputs, bmi: v }))}
            {numInput('Diabetes Pedigree', diabetesInputs.diabetesPedigree, v => setDiabetesInputs({ ...diabetesInputs, diabetesPedigree: v }))}
            {numInput('Age', diabetesInputs.age, v => setDiabetesInputs({ ...diabetesInputs, age: v }))}
          </div>
        )}

        {selected === 'liver' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {numInput('Age', liverInputs.age, v => setLiverInputs({ ...liverInputs, age: v }))}
            {selectInput('Gender', liverInputs.gender, [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], v => setLiverInputs({ ...liverInputs, gender: v as any }))}
            {numInput('Total Bilirubin', liverInputs.totalBilirubin, v => setLiverInputs({ ...liverInputs, totalBilirubin: v }), 'mg/dL')}
            {numInput('Direct Bilirubin', liverInputs.directBilirubin, v => setLiverInputs({ ...liverInputs, directBilirubin: v }), 'mg/dL')}
            {numInput('Alk. Phosphatase', liverInputs.alkalinePhosphatase, v => setLiverInputs({ ...liverInputs, alkalinePhosphatase: v }), 'IU/L')}
            {numInput('ALT (SGPT)', liverInputs.alanineAminotransferase, v => setLiverInputs({ ...liverInputs, alanineAminotransferase: v }), 'IU/L')}
            {numInput('AST (SGOT)', liverInputs.aspartateAminotransferase, v => setLiverInputs({ ...liverInputs, aspartateAminotransferase: v }), 'IU/L')}
            {numInput('Total Proteins', liverInputs.totalProteins, v => setLiverInputs({ ...liverInputs, totalProteins: v }), 'g/dL')}
            {numInput('Albumin', liverInputs.albumin, v => setLiverInputs({ ...liverInputs, albumin: v }), 'g/dL')}
          </div>
        )}

        {selected === 'kidney' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {numInput('Age', kidneyInputs.age, v => setKidneyInputs({ ...kidneyInputs, age: v }))}
            {numInput('BP', kidneyInputs.bp, v => setKidneyInputs({ ...kidneyInputs, bp: v }), 'mmHg')}
            {numInput('Specific Gravity', kidneyInputs.specificGravity, v => setKidneyInputs({ ...kidneyInputs, specificGravity: v }))}
            {numInput('Albumin', kidneyInputs.albumin, v => setKidneyInputs({ ...kidneyInputs, albumin: v }))}
            {selectInput('RBC', kidneyInputs.redBloodCells, [{ value: 'normal', label: 'Normal' }, { value: 'abnormal', label: 'Abnormal' }], v => setKidneyInputs({ ...kidneyInputs, redBloodCells: v as any }))}
            {selectInput('Hypertension', kidneyInputs.hypertension ? 'yes' : 'no', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], v => setKidneyInputs({ ...kidneyInputs, hypertension: v === 'yes' }))}
            {selectInput('Diabetes', kidneyInputs.diabetesMellitus ? 'yes' : 'no', [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], v => setKidneyInputs({ ...kidneyInputs, diabetesMellitus: v === 'yes' }))}
            {numInput('Hemoglobin', kidneyInputs.hemoglobin, v => setKidneyInputs({ ...kidneyInputs, hemoglobin: v }), 'g/dL')}
          </div>
        )}

        {selected === 'breast_cancer' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {numInput('Radius', breastInputs.radius, v => setBreastInputs({ ...breastInputs, radius: v }))}
            {numInput('Texture', breastInputs.texture, v => setBreastInputs({ ...breastInputs, texture: v }))}
            {numInput('Perimeter', breastInputs.perimeter, v => setBreastInputs({ ...breastInputs, perimeter: v }))}
            {numInput('Area', breastInputs.area, v => setBreastInputs({ ...breastInputs, area: v }))}
            {numInput('Smoothness', breastInputs.smoothness, v => setBreastInputs({ ...breastInputs, smoothness: v }))}
            {numInput('Compactness', breastInputs.compactness, v => setBreastInputs({ ...breastInputs, compactness: v }))}
            {numInput('Concavity', breastInputs.concavity, v => setBreastInputs({ ...breastInputs, concavity: v }))}
            {numInput('Symmetry', breastInputs.symmetry, v => setBreastInputs({ ...breastInputs, symmetry: v }))}
          </div>
        )}

        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
          ) : (
            <><TrendingUp className="w-4 h-4" /> Assess Risk</>
          )}
        </button>
      </div>

      {/* Results */}
      {prediction && (
        <div className="space-y-4 animate-fadeInScale">
          {/* Risk Score */}
          <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl border-2 ${
            prediction.risk === 'High' ? 'border-red-200 bg-red-50' :
            prediction.risk === 'Moderate' ? 'border-amber-200 bg-amber-50' :
            'border-emerald-200 bg-emerald-50'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Risk Assessment</div>
                <div className={`text-5xl font-extrabold ${
                  prediction.risk === 'High' ? 'text-red-600' :
                  prediction.risk === 'Moderate' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>{prediction.riskScore}<span className="text-2xl">/100</span></div>
                <div className={`text-lg font-bold mt-1 ${
                  prediction.risk === 'High' ? 'text-red-600' :
                  prediction.risk === 'Moderate' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>{prediction.risk} Risk</div>
              </div>
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${prediction.riskScore * 3.27} 327`} className={
                      prediction.risk === 'High' ? 'text-red-500' :
                      prediction.risk === 'Moderate' ? 'text-amber-500' :
                      'text-emerald-500'
                    } />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-extrabold ${
                  prediction.risk === 'High' ? 'text-red-600' :
                  prediction.risk === 'Moderate' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>{prediction.riskScore}%</div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {prediction.factors.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Contributing Factors</h3>
              <div className="space-y-2">
                {prediction.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Recommendations</h3>
            <div className="space-y-2">
              {prediction.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle Changes */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-teal-600" /> Lifestyle Changes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {prediction.lifestyleChanges.map((l, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-teal-50 rounded-xl">
                  <span className="text-teal-500 font-bold">{i + 1}.</span>
                  <span className="text-sm text-slate-700">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* When to see doctor */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><ChevronRight className="w-5 h-5 text-rose-500" /> When to See a Doctor</h3>
            <div className="space-y-2">
              {prediction.whenToSeeDoctor.map((w, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-rose-50 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">This tool uses statistical models trained on clinical datasets (Heart Disease: 1,888 records, Pima Diabetes: 768, Indian Liver: 583, CKD: 400, Breast Cancer: 569). It provides risk screening only — NOT a diagnosis. Always consult a qualified physician for medical evaluation.</p>
      </div>
    </div>
  );
};

export default DiseasePredictor;
