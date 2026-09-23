'use client';
import React, { useState } from 'react';
import { Droplets, Brain, Apple, Pill, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

const SUBTYPE_QUESTIONS = [
  { id: 'q1', q: 'When is your blood sugar highest?', options: ['Morning (fasting)', 'After meals', 'Both equally'] },
  { id: 'q2', q: 'Your BMI range?', options: ['Normal (18-25)', 'Overweight (25-30)', 'Obese (30+)'] },
  { id: 'q3', q: 'Do you have belly fat?', options: ['Yes, significant', 'Some', 'No'] },
  { id: 'q4', q: 'Family history of diabetes?', options: ['Yes - parents', 'Yes - siblings', 'No'] },
];

const SUBTYPES = [
  { name: 'Type 2 Insulin Resistant', desc: 'Your body makes insulin but cells resist it. Common with belly fat and overweight.', diet: 'Low carb, high fiber, avoid sugar', meds: 'Metformin usually effective', color: 'from-amber-500 to-orange-600' },
  { name: 'Type 2 Insulin Deficient', desc: 'Your pancreas makes less insulin over time. Common in thin people.', diet: 'Balanced meals, moderate carbs', meds: 'May need insulin support', color: 'from-sky-500 to-blue-600' },
  { name: 'MODY (Genetic)', desc: 'Genetic form affecting insulin production. Often inherited.', diet: 'Balanced, regular meals', meds: 'Sulfonylureas often effective', color: 'from-violet-500 to-purple-600' },
];

export const DiseaseSubtypeDiscovery: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const allAnswered = Object.keys(answers).length === SUBTYPE_QUESTIONS.length;
  const result = SUBTYPES[0];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Droplets className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Disease Subtype Discovery <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-cyan-50/90 text-sm mt-1">Find YOUR specific type — get personalized guidance</p>
          </div>
        </div>
      </div>

      {!showResult ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          {SUBTYPE_QUESTIONS.map((question, i) => (
            <div key={question.id}>
              <p className="font-bold text-sm text-slate-900 mb-2">{i + 1}. {question.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {question.options.map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all ${answers[question.id] === opt ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setShowResult(true)} disabled={!allAnswered}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" /> Analyze My Subtype
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 animate-fadeInScale">
          <div className="text-center">
            <div className={`inline-block p-3 rounded-2xl bg-gradient-to-br ${result.color} text-white mb-3`}><CheckCircle2 className="w-8 h-8" /></div>
            <h2 className="text-xl font-extrabold text-slate-900">{result.name}</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">{result.desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-emerald-50 rounded-2xl"><Apple className="w-5 h-5 text-emerald-600 mb-2" /><div className="font-bold text-sm text-slate-900">Diet Plan</div><p className="text-xs text-slate-600 mt-1">{result.diet}</p></div>
            <div className="p-4 bg-violet-50 rounded-2xl"><Pill className="w-5 h-5 text-violet-600 mb-2" /><div className="font-bold text-sm text-slate-900">Medication Guidance</div><p className="text-xs text-slate-600 mt-1">{result.meds}</p></div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-amber-700">This is AI guidance only. Consult your doctor for confirmed diagnosis and treatment.</p></div>
          <button onClick={() => { setShowResult(false); setAnswers({}); }} className="w-full bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-sm">Retake Assessment</button>
        </div>
      )}
    </div>
  );
};
export default DiseaseSubtypeDiscovery;
