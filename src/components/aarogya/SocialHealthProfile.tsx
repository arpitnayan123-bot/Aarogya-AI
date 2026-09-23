'use client';
import React, { useState } from 'react';
import { Home, Droplet, Flame, Users, MapPin, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  { id: 'water', q: 'Your drinking water source?', icon: Droplet, options: ['Tap water', 'Well water', 'River/pond', 'Tanker/bottled'] },
  { id: 'occupation', q: 'Your occupation?', icon: Users, options: ['Farmer', 'Factory worker', 'Office job', 'Daily wage'] },
  { id: 'income', q: 'Monthly household income?', icon: Home, options: ['Below ₹10,000', '₹10,000-25,000', '₹25,000-50,000', 'Above ₹50,000'] },
  { id: 'cooking', q: 'Cooking fuel used?', icon: Flame, options: ['LPG', 'Wood', 'Coal/kerosene', 'Electric/induction'] },
  { id: 'toilet', q: 'Toilet access?', icon: Home, options: ['Indoor toilet', 'Shared toilet', 'Open defecation'] },
  { id: 'hospital', q: 'Distance to nearest hospital?', icon: MapPin, options: ['Under 2 km', '2-10 km', '10-30 km', 'Over 30 km'] },
  { id: 'food', q: 'Food security?', icon: CheckCircle2, options: ['3 meals daily', 'Sometimes skip', 'Often skip', 'Rarely enough'] },
  { id: 'area', q: 'Your living area?', icon: Home, options: ['Urban', 'Semi-urban', 'Rural', 'Tribal'] },
];

export const SocialHealthProfile: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Home className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Social Health Profile <span className="text-[9px] font-bold bg-white text-amber-700 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-amber-50/90 text-sm mt-1">Your environment affects your health — help us personalize advice</p>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{answered}/{QUESTIONS.length} answered</span>
            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          {QUESTIONS.map((q, i) => (
            <div key={q.id}>
              <p className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2"><q.icon className="w-4 h-4 text-amber-500" /> {i + 1}. {q.q}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all ${answers[q.id] === opt ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => setCompleted(true)} disabled={answered < QUESTIONS.length}
            className="w-full bg-amber-600 text-white font-bold py-3 rounded-2xl disabled:opacity-40">Save My Profile</button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-emerald-600" /><h2 className="font-extrabold text-slate-900 text-lg">Profile Saved!</h2></div>
          <p className="text-sm text-slate-700">Your health advice is now personalized based on your social determinants of health.</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.entries(answers).map(([k, v]) => (
              <div key={k} className="p-2 bg-white rounded-xl"><span className="text-[10px] font-bold text-slate-400 uppercase">{k}</span><div className="text-sm font-bold text-slate-800">{v}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SocialHealthProfile;
