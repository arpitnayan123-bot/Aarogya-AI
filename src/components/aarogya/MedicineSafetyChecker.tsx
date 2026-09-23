'use client';
import React, { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle2, Plus, X, ShieldAlert } from 'lucide-react';

const DRUG_INTERACTIONS = [
  { drug1: 'Metformin', drug2: 'Alcohol', severity: 'high', effect: 'Increased risk of lactic acidosis', action: 'Avoid alcohol completely while taking Metformin' },
  { drug1: 'Warfarin', drug2: 'Aspirin', severity: 'critical', effect: 'Severe bleeding risk', action: 'Do not combine. Consult doctor immediately' },
  { drug1: 'Amlodipine', drug2: 'Grapefruit', severity: 'moderate', effect: 'Increased drug levels, low BP', action: 'Avoid grapefruit juice' },
];

export const MedicineSafetyChecker: React.FC = () => {
  const [medicines, setMedicines] = useState<string[]>(['Metformin 500mg', 'Amlodipine 5mg']);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  const addMed = () => { if (input.trim()) { setMedicines([...medicines, input.trim()]); setInput(''); } };
  const removeMed = (i: number) => setMedicines(medicines.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-red-600 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><ShieldAlert className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Medicine Safety Check <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-rose-50/90 text-sm mt-1">Check for dangerous drug interactions before it's too late</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-3">Your Medicines ({medicines.length})</h2>
        <div className="flex gap-2 mb-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMed()}
            placeholder="e.g., Metformin 500mg" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          <button onClick={addMed} className="bg-rose-600 text-white p-2.5 rounded-xl hover:bg-rose-700"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2 mb-4">
          {medicines.map((med, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
              <Pill className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-bold text-slate-700 flex-1">{med}</span>
              <button onClick={() => removeMed(i)} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setChecked(true)} disabled={medicines.length < 2}
          className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold py-3 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Check Safety
        </button>
      </div>

      {checked && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <h2 className="font-extrabold text-slate-900">Safety Report</h2>
          {DRUG_INTERACTIONS.filter(d => medicines.some(m => m.toLowerCase().includes(d.drug1.toLowerCase()))).map((interaction, i) => (
            <div key={i} className={`p-4 rounded-2xl border-2 ${interaction.severity === 'critical' ? 'border-red-300 bg-red-50' : interaction.severity === 'high' ? 'border-orange-300 bg-orange-50' : 'border-amber-300 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`w-5 h-5 ${interaction.severity === 'critical' ? 'text-red-600' : interaction.severity === 'high' ? 'text-orange-600' : 'text-amber-600'}`} />
                <span className={`font-extrabold text-sm uppercase ${interaction.severity === 'critical' ? 'text-red-700' : interaction.severity === 'high' ? 'text-orange-700' : 'text-amber-700'}`}>{interaction.severity} Risk</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{interaction.drug1} + {interaction.drug2}</p>
              <p className="text-xs text-slate-600 mt-1">{interaction.effect}</p>
              <p className="text-xs text-emerald-700 font-bold mt-2">✓ {interaction.action}</p>
            </div>
          ))}
          {DRUG_INTERACTIONS.filter(d => medicines.some(m => m.toLowerCase().includes(d.drug1.toLowerCase()))).length === 0 && (
            <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">No dangerous interactions found. Your medicine combination appears safe.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MedicineSafetyChecker;
