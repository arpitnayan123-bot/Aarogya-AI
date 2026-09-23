'use client';
import React, { useState } from 'react';
import { Users, MapPin, AlertTriangle, Thermometer, Activity, TrendingUp } from 'lucide-react';

const SYMPTOM_DATA = [
  { pincode: '110001', area: 'Connaught Place', symptom: 'Fever', count: 8, trend: 'up' },
  { pincode: '110002', area: 'Karol Bagh', symptom: 'Cough', count: 12, trend: 'up' },
  { pincode: '110003', area: 'Lajpat Nagar', symptom: 'Headache', count: 5, trend: 'stable' },
  { pincode: '110004', area: 'Defence Colony', symptom: 'Body pain', count: 3, trend: 'down' },
  { pincode: '110005', area: 'Rajendra Nagar', symptom: 'Fever', count: 7, trend: 'up' },
];

export const CommunitySymptomMap: React.FC = () => {
  const [reported, setReported] = useState(false);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><Users className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">Health In Your Area <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-teal-50/90 text-sm mt-1">Community symptom map — see what's spreading near you</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-amber-600" /><h2 className="font-extrabold text-slate-900">Outbreak Alert</h2></div>
        <p className="text-sm text-slate-700">8 people near you (PIN: 110001) have reported <strong>fever</strong> in the last 48 hours. This may indicate a seasonal flu outbreak in your area.</p>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" /> Trend: Rising</span>
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full">Risk: Moderate</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-600" /> Symptoms Near You (Delhi)</h2>
        <div className="space-y-2">
          {SYMPTOM_DATA.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className={`p-2 rounded-xl ${s.trend === 'up' ? 'bg-red-50 text-red-600' : s.trend === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-900">{s.symptom}</div>
                <div className="text-xs text-slate-500">{s.area} · PIN {s.pincode}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-slate-900">{s.count}</div>
                <div className={`text-[9px] font-bold ${s.trend === 'up' ? 'text-red-500' : s.trend === 'down' ? 'text-emerald-500' : 'text-slate-400'}`}>{s.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!reported ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-2">Report Your Symptoms Anonymously</h2>
          <p className="text-xs text-slate-500 mb-3">Help your community. Your report is 100% anonymous.</p>
          <button onClick={() => setReported(true)} className="w-full bg-teal-600 text-white font-bold py-3 rounded-2xl hover:bg-teal-700">Report: I have fever today</button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-2">
          <span className="text-2xl">✓</span>
          <span className="text-sm font-bold text-emerald-800">Thank you! Your anonymous report has been added to the community map.</span>
        </div>
      )}
    </div>
  );
};
export default CommunitySymptomMap;
