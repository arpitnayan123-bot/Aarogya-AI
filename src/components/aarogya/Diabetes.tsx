'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Droplets, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Activity, Plus, Trash2, Calendar, Target, Apple, Footprints,
  Heart, Pill, Info
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine
} from 'recharts';

interface SugarReading {
  id: string;
  date: string;
  time: string;
  value: number;
  type: 'fasting' | 'post_meal' | 'random';
}

const HBA1C_LEVELS = [
  { range: '<5.7%', label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { range: '5.7-6.4%', label: 'Prediabetes', color: 'text-amber-600', bg: 'bg-amber-50' },
  { range: '≥6.5%', label: 'Diabetes', color: 'text-red-600', bg: 'bg-red-50' },
];

const INDIAN_DIABETES_TIPS = [
  { icon: Apple, title: 'Low GI Foods', desc: 'Choose whole grains (jowar, bajra, ragi) over white rice. GI <55 is ideal.' },
  { icon: Droplets, title: 'Hydration', desc: 'Drink 3L water daily. High blood sugar increases dehydration risk.' },
  { icon: Footprints, title: 'Post-Meal Walk', desc: '10-minute walk after meals lowers blood sugar by 12%.' },
  { icon: Pill, title: 'Medication Timing', desc: 'Take Metformin with meals to reduce GI side effects.' },
];

export const Diabetes: React.FC = () => {
  const [readings, setReadings] = useState<SugarReading[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_diabetes_readings');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [
      { id: 'r1', date: new Date(Date.now() - 6*86400000).toISOString().split('T')[0], time: '07:30', value: 95, type: 'fasting' },
      { id: 'r2', date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], time: '08:00', value: 142, type: 'post_meal' },
      { id: 'r3', date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], time: '07:45', value: 98, type: 'fasting' },
      { id: 'r4', date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], time: '08:15', value: 138, type: 'post_meal' },
      { id: 'r5', date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], time: '07:30', value: 92, type: 'fasting' },
      { id: 'r6', date: new Date(Date.now() - 1*86400000).toISOString().split('T')[0], time: '08:00', value: 130, type: 'post_meal' },
    ];
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newReading, setNewReading] = useState({ value: '', type: 'fasting' as SugarReading['type'], date: new Date().toISOString().split('T')[0], time: '08:00' });

  useEffect(() => {
    localStorage.setItem('aarogya_diabetes_readings', JSON.stringify(readings));
  }, [readings]);

  const avgGlucose = useMemo(() => {
    if (readings.length === 0) return 0;
    return Math.round(readings.reduce((sum, r) => sum + r.value, 0) / readings.length);
  }, [readings]);

  const estimatedHbA1c = useMemo(() => {
    if (readings.length === 0) return 0;
    // Estimated HbA1c = (avg glucose + 46.7) / 28.7
    return parseFloat(((avgGlucose + 46.7) / 28.7).toFixed(1));
  }, [avgGlucose, readings.length]);

  const addReading = () => {
    if (!newReading.value) return;
    setReadings([...readings, { ...newReading, value: parseInt(newReading.value), id: `r-${Date.now()}` }]);
    setNewReading({ value: '', type: 'fasting', date: new Date().toISOString().split('T')[0], time: '08:00' });
    setShowAdd(false);
  };

  const deleteReading = (id: string) => setReadings(readings.filter(r => r.id !== id));

  const chartData = readings.slice(-14).map(r => ({
    date: r.date.substring(5),
    value: r.value,
    type: r.type,
  }));

  const latestReading = readings[readings.length - 1];
  const latestStatus = !latestReading ? 'normal' :
    latestReading.type === 'fasting' ?
      (latestReading.value < 100 ? 'normal' : latestReading.value < 126 ? 'borderline' : 'high') :
      (latestReading.value < 140 ? 'normal' : latestReading.value < 200 ? 'borderline' : 'high');

  const getStatusColor = (value: number, type: string) => {
    if (type === 'fasting') {
      if (value < 100) return 'text-emerald-600';
      if (value < 126) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value < 140) return 'text-emerald-600';
      if (value < 200) return 'text-amber-600';
      return 'text-red-600';
    }
  };

  const hba1cCategory = estimatedHbA1c < 5.7 ? HBA1C_LEVELS[0] : estimatedHbA1c < 6.5 ? HBA1C_LEVELS[1] : HBA1C_LEVELS[2];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Diabetes Care</h1>
            <p className="text-rose-50/90 text-sm mt-1">Blood sugar management · ICMR-INDIAB guidelines</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Activity className="w-3 h-3" /> {readings.length} readings</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Target className="w-3 h-3" /> Target: &lt;100 Fasting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Latest Reading</div>
          <div className={`text-3xl font-extrabold ${latestReading ? getStatusColor(latestReading.value, latestReading.type) : 'text-slate-300'}`}>
            {latestReading ? latestReading.value : '--'}<span className="text-sm font-normal text-slate-400 ml-1">mg/dL</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">{latestReading?.type === 'post_meal' ? 'Post-meal' : latestReading?.type || 'No data'}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Glucose</div>
          <div className="text-3xl font-extrabold text-slate-900">{avgGlucose}<span className="text-sm font-normal text-slate-400 ml-1">mg/dL</span></div>
          <div className="text-xs text-slate-500 mt-1">{readings.length} readings</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. HbA1c</div>
          <div className={`text-3xl font-extrabold ${hba1cCategory.color}`}>{estimatedHbA1c}%</div>
          <div className={`text-xs font-bold mt-1 ${hba1cCategory.color}`}>{hba1cCategory.label}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</div>
          <div className={`text-2xl font-extrabold capitalize ${latestStatus === 'normal' ? 'text-emerald-600' : latestStatus === 'borderline' ? 'text-amber-600' : 'text-red-600'}`}>
            {latestStatus}
          </div>
          <div className="text-xs text-slate-500 mt-1">Based on latest</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Blood Sugar Trend</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-emerald-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Reading
          </button>
        </div>

        {showAdd && (
          <div className="bg-slate-50 rounded-2xl p-3 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2 animate-fadeIn">
            <input type="number" value={newReading.value} onChange={e => setNewReading({ ...newReading, value: e.target.value })} placeholder="mg/dL" className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={newReading.type} onChange={e => setNewReading({ ...newReading, type: e.target.value as any })} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="fasting">Fasting</option>
              <option value="post_meal">Post-meal</option>
              <option value="random">Random</option>
            </select>
            <input type="date" value={newReading.date} onChange={e => setNewReading({ ...newReading, date: e.target.value })} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={addReading} className="bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">Save</button>
          </div>
        )}

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sugarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[60, 250]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <ReferenceLine y={100} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Fasting target', fontSize: 10, fill: '#10b981' }} />
              <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Post-meal target', fontSize: 10, fill: '#f59e0b' }} />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#sugarGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">No readings yet. Add your first blood sugar reading!</div>
        )}
      </div>

      {/* HbA1c Reference */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-cyan-600" /> HbA1c Reference Levels</h2>
        <div className="grid grid-cols-3 gap-3">
          {HBA1C_LEVELS.map((level, i) => (
            <div key={i} className={`p-4 rounded-2xl ${level.bg} text-center`}>
              <div className={`text-2xl font-extrabold ${level.color}`}>{level.range}</div>
              <div className={`text-xs font-bold mt-1 ${level.color}`}>{level.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-3 text-center">Estimated HbA1c = (Average Glucose + 46.7) / 28.7. For actual HbA1c, consult a lab.</p>
      </div>

      {/* Indian Diet Tips */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Apple className="w-5 h-5 text-rose-500" /> Indian Diabetes Diet Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INDIAN_DIABETES_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-xl flex-shrink-0"><tip.icon className="w-5 h-5 text-emerald-600" /></div>
              <div>
                <div className="font-bold text-sm text-slate-800">{tip.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading History */}
      {readings.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-3">Reading History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-slim">
            {[...readings].reverse().map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`p-2 rounded-lg ${getStatusColor(r.value, r.type) === 'text-emerald-600' ? 'bg-emerald-100' : getStatusColor(r.value, r.type) === 'text-amber-600' ? 'bg-amber-100' : 'bg-red-100'}`}>
                  <Droplets className={`w-4 h-4 ${getStatusColor(r.value, r.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-extrabold text-lg ${getStatusColor(r.value, r.type)}`}>{r.value}</span>
                  <span className="text-xs text-slate-400 ml-1">mg/dL</span>
                  <span className="text-xs text-slate-500 ml-2 capitalize">· {r.type.replace('_', '-')}</span>
                </div>
                <span className="text-xs text-slate-400">{r.date} {r.time}</span>
                <button onClick={() => deleteReading(r.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">This tool helps track blood sugar for self-monitoring. Always consult your diabetologist for treatment decisions. If blood sugar is &gt;250 mg/dL or &lt;70 mg/dL, seek medical attention.</p>
      </div>
    </div>
  );
};

export default Diabetes;
