'use client';
import React, { useState } from 'react';
import { FileText, Link2, CheckCircle2, AlertTriangle, Database, Shield } from 'lucide-react';

export const ABHAIntegration: React.FC = () => {
  const [abhaId, setAbhaId] = useState('');
  const [connected, setConnected] = useState(false);
  const [records, setRecords] = useState([
    { date: '2024-12-15', hospital: 'AIIMS Delhi', type: 'Blood Test', summary: 'CBC, Lipid Profile, Thyroid' },
    { date: '2024-11-20', hospital: 'District Hospital', type: 'Consultation', summary: 'Hypertension follow-up' },
    { date: '2024-10-05', hospital: 'PHC Sector 22', type: 'Vaccination', summary: 'Influenza vaccine' },
  ]);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20"><FileText className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">ABHA Health Records <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">NEW</span></h1>
            <p className="text-emerald-50/90 text-sm mt-1">Connect your Ayushman Bharat Digital Mission records</p>
          </div>
        </div>
      </div>

      {!connected ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
          <div className="p-4 bg-emerald-50 rounded-2xl w-fit mx-auto mb-4"><Link2 className="w-8 h-8 text-emerald-600" /></div>
          <h2 className="font-extrabold text-slate-900 mb-2">Connect Your ABHA ID</h2>
          <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">Enter your 14-digit Ayushman Bharat Health Account (ABHA) ID to auto-import records from government hospitals.</p>
          <input value={abhaId} onChange={e => setAbhaId(e.target.value.replace(/\D/g, '').slice(0, 14))}
            placeholder="00-0000-0000-0000" className="w-full max-w-xs mx-auto bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 block" />
          <button onClick={() => setConnected(true)} disabled={abhaId.length < 14}
            className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl disabled:opacity-40 hover:bg-emerald-700 transition-colors">
            Connect & Import Records
          </button>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Encrypted</span>
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> ABDM API</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800">Connected! {records.length} records imported.</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4">Imported Health Records</h2>
            <div className="space-y-2">
              {records.map((rec, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl"><FileText className="w-4 h-4 text-emerald-600" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900">{rec.type}</div>
                    <div className="text-xs text-slate-500">{rec.hospital} · {rec.date}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{rec.summary}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ABHAIntegration;
