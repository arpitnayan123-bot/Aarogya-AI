'use client';

import React, { useState, useEffect } from 'react';
import {
  Pill, Clock, Bell, Plus, Trash2, CheckCircle2, AlertCircle,
  Calendar, Repeat, X, Volume2, Zap
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'thrice_daily' | 'as_needed' | 'weekly';
  times: string[];
  startDate: string;
  notes: string;
  color: string;
}

interface MedicationLog {
  medId: string;
  time: string;
  date: string;
  taken: boolean;
}

const MED_COLORS = [
  'from-rose-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-fuchsia-400 to-pink-500',
];

const FREQUENCY_LABELS: Record<Medication['frequency'], string> = {
  once_daily: 'Once Daily',
  twice_daily: 'Twice Daily',
  thrice_daily: 'Thrice Daily',
  as_needed: 'As Needed',
  weekly: 'Weekly',
};

export const MedicationReminder: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_medications');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [
      { id: 'm1', name: 'Vitamin D3', dosage: '60K IU', frequency: 'once_daily', times: ['08:00'], startDate: new Date().toISOString().split('T')[0], notes: 'After breakfast', color: MED_COLORS[1] },
      { id: 'm2', name: 'Omega-3', dosage: '1000mg', frequency: 'once_daily', times: ['13:00'], startDate: new Date().toISOString().split('T')[0], notes: 'After lunch', color: MED_COLORS[4] },
    ];
  });

  const [logs, setLogs] = useState<MedicationLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_med_logs');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [];
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'once_daily' as Medication['frequency'], times: ['08:00'], notes: '' });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    localStorage.setItem('aarogya_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('aarogya_med_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toDateString();

  const isMedTaken = (medId: string, time: string) => {
    return logs.some(l => l.medId === medId && l.time === time && l.date === today && l.taken);
  };

  const toggleMedTaken = (medId: string, time: string) => {
    const existing = logs.find(l => l.medId === medId && l.time === time && l.date === today);
    if (existing) {
      setLogs(logs.map(l => l.medId === medId && l.time === time && l.date === today ? { ...l, taken: !l.taken } : l));
    } else {
      setLogs([...logs, { medId, time, date: today, taken: true }]);
    }
  };

  const addMedication = () => {
    if (!newMed.name) return;
    const times = newMed.frequency === 'twice_daily' ? ['08:00', '20:00'] :
                  newMed.frequency === 'thrice_daily' ? ['08:00', '14:00', '20:00'] :
                  newMed.frequency === 'weekly' ? ['09:00'] : newMed.times;
    setMedications([...medications, {
      ...newMed,
      id: `m-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      color: MED_COLORS[medications.length % MED_COLORS.length],
      times,
    }]);
    setNewMed({ name: '', dosage: '', frequency: 'once_daily', times: ['08:00'], notes: '' });
    setShowAdd(false);
  };

  const deleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    setLogs(logs.filter(l => l.medId !== id));
  };

  const isTimeSoon = (time: string) => {
    if (!currentTime) return false;
    const [ch, cm] = currentTime.split(':').map(Number);
    const [th, tm] = time.split(':').map(Number);
    const diff = (th * 60 + tm) - (ch * 60 + cm);
    return diff > 0 && diff <= 60; // within next hour
  };

  const isTimePast = (time: string) => {
    if (!currentTime) return false;
    const [ch, cm] = currentTime.split(':').map(Number);
    const [th, tm] = time.split(':').map(Number);
    return (th * 60 + tm) < (ch * 60 + cm);
  };

  const todaysReminders = medications.flatMap(m => m.times.map(t => ({ med: m, time: t })));
  const takenCount = todaysReminders.filter(r => isMedTaken(r.med.id, r.time)).length;
  const upcomingCount = today => todaysReminders.filter(r => isTimeSoon(r.time) && !isMedTaken(r.med.id, r.time)).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Medication Reminders</h1>
              <p className="text-violet-50/90 text-sm mt-1">Never miss a dose · {takenCount}/{todaysReminders.length} taken today</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {currentTime || '--:--'}</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Pill className="w-3 h-3" /> {medications.length} active</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-white text-violet-700 font-bold px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm animate-fadeInScale">
          <h3 className="font-extrabold text-slate-900 mb-4">Add New Medication</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} placeholder="Medicine name (e.g., Paracetamol)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="Dosage (e.g., 500mg)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <select value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value as Medication['frequency'] })} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {Object.entries(FREQUENCY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input value={newMed.notes} onChange={e => setNewMed({ ...newMed, notes: e.target.value })} placeholder="Notes (e.g., after food)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addMedication} className="flex-1 bg-violet-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-violet-700 transition-colors">Add Medication</button>
            <button onClick={() => setShowAdd(false)} className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-600" /> Today's Schedule
        </h2>
        {todaysReminders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <Pill className="w-10 h-10 mx-auto mb-2 opacity-30" />
            No medications scheduled. Add your first medicine to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {todaysReminders
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(({ med, time }) => {
                const taken = isMedTaken(med.id, time);
                const soon = isTimeSoon(time);
                const past = isTimePast(time) && !taken;
                return (
                  <div
                    key={`${med.id}-${time}`}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      taken ? 'bg-emerald-50' : past ? 'bg-red-50' : soon ? 'bg-amber-50' : 'bg-slate-50'
                    }`}
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 text-center w-16">
                      <div className={`text-sm font-extrabold ${taken ? 'text-emerald-600' : past ? 'text-red-600' : soon ? 'text-amber-600' : 'text-slate-700'}`}>
                        {time}
                      </div>
                      {soon && !taken && (
                        <div className="text-[9px] font-bold text-amber-500 flex items-center justify-center gap-0.5 mt-0.5">
                          <Zap className="w-2.5 h-2.5" /> SOON
                        </div>
                      )}
                      {past && !taken && (
                        <div className="text-[9px] font-bold text-red-500 mt-0.5">OVERDUE</div>
                      )}
                    </div>

                    {/* Medicine info */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${med.color} flex items-center justify-center text-white`}>
                      <Pill className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm ${taken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {med.name} <span className="text-xs font-normal text-slate-400">{med.dosage}</span>
                      </div>
                      {med.notes && <div className="text-[10px] text-slate-500">{med.notes}</div>}
                    </div>

                    {/* Toggle taken */}
                    <button
                      onClick={() => toggleMedTaken(med.id, time)}
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        taken ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 hover:border-emerald-300'
                      }`}
                      aria-label={taken ? 'Mark as not taken' : 'Mark as taken'}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* All Medications */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-violet-600" /> All Medications ({medications.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {medications.map(med => (
            <div key={med.id} className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${med.color} flex items-center justify-center text-white`}>
                <Pill className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-800">{med.name}</div>
                <div className="text-xs text-slate-500">{med.dosage} · {FREQUENCY_LABELS[med.frequency]}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  {med.times.map(t => (
                    <span key={t} className="text-[9px] bg-white px-1.5 py-0.5 rounded font-bold text-slate-600">{t}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => deleteMed(med.id)} className="text-slate-300 hover:text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Adherence Stats */}
      {logs.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-violet-600" /> Adherence (Last 7 Days)
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(Date.now() - (6 - i) * 86400000);
              const dateStr = date.toDateString();
              const dayLogs = logs.filter(l => l.date === dateStr);
              const dayTotal = todaysReminders.length;
              const dayTaken = dayLogs.filter(l => l.taken).length;
              const pct = dayTotal > 0 ? Math.round((dayTaken / dayTotal) * 100) : 0;
              return (
                <div key={i} className="text-center">
                  <div className="text-[9px] font-bold text-slate-400 mb-1">
                    {date.toLocaleDateString('en', { weekday: 'short' }).charAt(0)}
                  </div>
                  <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all ${
                        pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : pct > 0 ? 'bg-red-400' : ''
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 mt-1">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">This is a reminder tool only. Always follow your doctor's prescription. Do not stop or change medication without consulting your healthcare provider. For adverse reactions, call your doctor immediately.</p>
      </div>
    </div>
  );
};

export default MedicationReminder;
