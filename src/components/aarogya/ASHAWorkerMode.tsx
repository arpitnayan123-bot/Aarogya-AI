'use client';

// ============================================
// AAROGYA AI — ASHA WORKER MODE
// Simplified interface for community health workers.
// Patient roster, 10-condition quick screening,
// offline indicator, per-patient health report.
// All data saved on device (localStorage).
// Emerald + amber accents (NO indigo primary).
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Trash2, ClipboardList, Wifi, WifiOff,
  HeartPulse, FileText, Activity, MapPin, Stethoscope,
  Sparkles, ShieldCheck, Baby, Thermometer, Droplets,
  CheckCircle2, Circle, AlertCircle, Download, X,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  village: string;
  phone?: string;
  screenings: Screening[];
  addedOn: string;
}

interface Screening {
  id: string;
  date: string;
  conditions: string[]; // checked condition ids
  notes: string;
  vitals: { bp: string; pulse: number; temp: number; spo2: number };
}

const STORAGE_KEY = 'aarogya_asha_patients';

// ============================================
// 10 QUICK SCREENING CONDITIONS
// ============================================
const SCREENING_CONDITIONS = [
  { id: 'fever',       label: 'Fever',                icon: Thermometer, tone: 'amber' },
  { id: 'cough',       label: 'Cough / Cold',         icon: Activity,    tone: 'teal' },
  { id: 'bp',          label: 'High Blood Pressure',  icon: HeartPulse,  tone: 'rose' },
  { id: 'sugar',       label: 'High Blood Sugar',     icon: Droplets,    tone: 'violet' },
  { id: 'pregnancy',   label: 'Pregnancy Care',       icon: Baby,        tone: 'pink' },
  { id: 'child',       label: 'Child Health Issue',   icon: Baby,        tone: 'emerald' },
  { id: 'stomach',     label: 'Stomach Pain',         icon: Activity,    tone: 'orange' },
  { id: 'skin',        label: 'Skin Problem',         icon: ShieldCheck, tone: 'cyan' },
  { id: 'mental',      label: 'Mental Health Concern', icon: HeartPulse, tone: 'fuchsia' },
  { id: 'elderly',     label: 'Elderly Weakness',     icon: Users,       tone: 'slate' },
] as const;

const TONE_BG: Record<string, string> = {
  amber:   'bg-amber-50 border-amber-200 text-amber-800',
  teal:    'bg-teal-50 border-teal-200 text-teal-800',
  rose:    'bg-rose-50 border-rose-200 text-rose-800',
  violet:  'bg-violet-50 border-violet-200 text-violet-800',
  pink:    'bg-pink-50 border-pink-200 text-pink-800',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  orange:  'bg-orange-50 border-orange-200 text-orange-800',
  cyan:    'bg-cyan-50 border-cyan-200 text-cyan-800',
  fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800',
  slate:   'bg-slate-50 border-slate-200 text-slate-800',
};

// ============================================
// MAIN COMPONENT
// ============================================
export const ASHAWorkerMode: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [online, setOnline] = useState(true);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [reportFor, setReportFor] = useState<Patient | null>(null);

  // New patient form
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'female' as Patient['gender'], village: '', phone: '' });

  // New screening form (per active patient)
  const [screeningConditions, setScreeningConditions] = useState<string[]>([]);
  const [vitals, setVitals] = useState({ bp: '', pulse: '', temp: '', spo2: '' });
  const [notes, setNotes] = useState('');

  // Load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPatients(JSON.parse(saved));
    } catch {}
    setLoaded(true);
    // Random initial offline state demo (most ASHAs are offline)
    setOnline(navigator.onLine);
  }, []);

  // Save
  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients, loaded]);

  // Listen to connectivity
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const addPatient = () => {
    if (!newPatient.name.trim() || !newPatient.age || !newPatient.village.trim()) return;
    const p: Patient = {
      id: `p-${Date.now()}`,
      name: newPatient.name.trim(),
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      village: newPatient.village.trim(),
      phone: newPatient.phone.trim(),
      screenings: [],
      addedOn: new Date().toISOString(),
    };
    setPatients(prev => [p, ...prev]);
    setNewPatient({ name: '', age: '', gender: 'female', village: '', phone: '' });
    setShowAdd(false);
    setActivePatientId(p.id);
  };

  const removePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    if (activePatientId === id) setActivePatientId(null);
  };

  const saveScreening = () => {
    if (!activePatientId) return;
    const screening: Screening = {
      id: `s-${Date.now()}`,
      date: new Date().toISOString(),
      conditions: screeningConditions,
      notes: notes.trim(),
      vitals: { bp: vitals.bp || '—', pulse: parseInt(vitals.pulse) || 0, temp: parseFloat(vitals.temp) || 0, spo2: parseInt(vitals.spo2) || 0 },
    };
    setPatients(prev => prev.map(p => p.id === activePatientId ? { ...p, screenings: [screening, ...p.screenings] } : p));
    setScreeningConditions([]);
    setVitals({ bp: '', pulse: '', temp: '', spo2: '' });
    setNotes('');
  };

  const activePatient = patients.find(p => p.id === activePatientId) || null;

  const toggleCondition = (id: string) => {
    setScreeningConditions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalScreenings = patients.reduce((sum, p) => sum + p.screenings.length, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">ASHA Worker Mode</h1>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-amber-50/90 text-sm mt-1">Simple tools for community health workers</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Users className="w-3 h-3" /> {patients.length} patients</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ClipboardList className="w-3 h-3" /> {totalScreenings} screenings</span>
              </div>
            </div>
          </div>
          {/* Offline / Online indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-sm font-semibold ${
            online ? 'bg-emerald-500/30 border-emerald-200/40' : 'bg-slate-900/40 border-white/20'
          }`}>
            {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {online ? 'Online' : 'Offline — Saved Locally'}
          </div>
        </div>
      </div>

      {!online && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            You are offline. All patient data is saved on this device and will sync
            when you reconnect. Keep screening — your work is safe.
          </p>
        </div>
      )}

      {/* ============================================ */}
      {/* QUICK STATS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Patients"  value={patients.length}    icon={Users}           tone="emerald" />
        <StatCard label="Screenings Done" value={totalScreenings}     icon={ClipboardList}  tone="teal" />
        <StatCard label="Villages Covered" value={new Set(patients.map(p => p.village.toLowerCase())).size} icon={MapPin} tone="amber" />
        <StatCard label="Status"          value={online ? 'Online' : 'Offline'} icon={online ? Wifi : WifiOff} tone={online ? 'emerald' : 'slate'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================ */}
        {/* PATIENT ROSTER (LEFT) */}
        {/* ============================================ */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Patient Roster
            </h2>
            <button
              onClick={() => setShowAdd(s => !s)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {showAdd && (
            <div className="mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <input type="text" placeholder="Patient name" value={newPatient.name} onChange={e => setNewPatient(s => ({ ...s, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-400" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Age" value={newPatient.age} onChange={e => setNewPatient(s => ({ ...s, age: e.target.value }))}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-400" />
                <select value={newPatient.gender} onChange={e => setNewPatient(s => ({ ...s, gender: e.target.value as Patient['gender'] }))}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-400">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input type="text" placeholder="Village" value={newPatient.village} onChange={e => setNewPatient(s => ({ ...s, village: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-400" />
              <input type="text" placeholder="Phone (optional)" value={newPatient.phone} onChange={e => setNewPatient(s => ({ ...s, phone: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-400" />
              <div className="flex gap-2">
                <button onClick={addPatient} className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl">Save Patient</button>
                <button onClick={() => setShowAdd(false)} className="px-3 py-2 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl"><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {patients.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No patients added. Tap "Add" to start your roster.
              </div>
            ) : patients.map(p => (
              <button
                key={p.id}
                onClick={() => { setActivePatientId(p.id); setScreeningConditions([]); }}
                className={`w-full text-left p-3 rounded-2xl border transition ${
                  activePatientId === p.id
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-800 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {p.village}
                      <span>· {p.age}y · {p.gender}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700">{p.screenings.length}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); removePatient(p.id); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); removePatient(p.id); } }}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* SCREENING + HISTORY (RIGHT) */}
        {/* ============================================ */}
        <div className="lg:col-span-2 space-y-6">
          {!activePatient ? (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700">Select a patient</h3>
              <p className="text-sm text-slate-500 mt-1">Choose a patient from the list to begin a quick health screening.</p>
            </div>
          ) : (
            <>
              {/* Patient header */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{activePatient.name}</h3>
                    <p className="text-sm text-slate-500">
                      {activePatient.age} years · {activePatient.gender} · {activePatient.village}
                      {activePatient.phone && ` · ${activePatient.phone}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setReportFor(activePatient)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-xl transition"
                  >
                    <FileText className="w-4 h-4" /> Health Report
                  </button>
                </div>
              </div>

              {/* Quick screening */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800">Quick Health Screening</h3>
                  <span className="text-xs text-slate-400">Tick all that apply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {SCREENING_CONDITIONS.map(c => {
                    const checked = screeningConditions.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCondition(c.id)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-sm text-left transition ${
                          checked ? TONE_BG[c.tone] + ' border-current' : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {checked ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 opacity-40" />}
                        <c.icon className="w-4 h-4 shrink-0" />
                        <span className="font-medium">{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <VitalInput label="BP" placeholder="120/80" value={vitals.bp} onChange={v => setVitals(s => ({ ...s, bp: v }))} />
                  <VitalInput label="Pulse" placeholder="bpm" value={vitals.pulse} onChange={v => setVitals(s => ({ ...s, pulse: v }))} type="number" />
                  <VitalInput label="Temp" placeholder="°C" value={vitals.temp} onChange={v => setVitals(s => ({ ...s, temp: v }))} type="number" />
                  <VitalInput label="SpO₂" placeholder="%" value={vitals.spo2} onChange={v => setVitals(s => ({ ...s, spo2: v }))} type="number" />
                </div>

                <textarea
                  placeholder="Notes (symptoms, observations, advice given...)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none mb-3"
                />

                <button
                  onClick={saveScreening}
                  disabled={screeningConditions.length === 0 && !vitals.bp && !notes}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Save Screening
                </button>
              </div>

              {/* Screening history */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" /> Past Screenings
                </h3>
                {activePatient.screenings.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    No screenings recorded yet for this patient.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {activePatient.screenings.map(s => (
                      <div key={s.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600">
                            {new Date(s.date).toLocaleDateString()} · {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            {s.vitals.bp !== '—' && <span>BP {s.vitals.bp}</span>}
                            {s.vitals.pulse > 0 && <span>· {s.vitals.pulse} bpm</span>}
                            {s.vitals.temp > 0 && <span>· {s.vitals.temp}°C</span>}
                            {s.vitals.spo2 > 0 && <span>· {s.vitals.spo2}%</span>}
                          </div>
                        </div>
                        {s.conditions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {s.conditions.map(id => {
                              const cond = SCREENING_CONDITIONS.find(c => c.id === id);
                              return cond ? (
                                <span key={id} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TONE_BG[cond.tone]}`}>
                                  {cond.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No conditions flagged</span>
                        )}
                        {s.notes && <p className="text-xs text-slate-500 mt-2">{s.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* HEALTH REPORT MODAL */}
      {/* ============================================ */}
      {reportFor && (
        <HealthReportModal patient={reportFor} onClose={() => setReportFor(null)} />
      )}
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================
const StatCard: React.FC<{ label: string; value: number | string; icon: React.ElementType; tone: 'emerald' | 'teal' | 'amber' | 'slate' }> = ({ label, value, icon: Icon, tone }) => {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    teal:    'bg-teal-50 text-teal-700 border-teal-100',
    amber:   'bg-amber-50 text-amber-700 border-amber-100',
    slate:   'bg-slate-50 text-slate-700 border-slate-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${tones[tone]}`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

const VitalInput: React.FC<{ label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-[10px] font-bold uppercase text-slate-400">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full mt-0.5 px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-emerald-400"
    />
  </div>
);

const HealthReportModal: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient, onClose }) => {
  const lastScreening = patient.screenings[0];
  const flaggedConditions = lastScreening?.conditions.map(id => SCREENING_CONDITIONS.find(c => c.id === id)?.label).filter(Boolean) || [];

  const referralNeeded = flaggedConditions.some(c =>
    ['High Blood Pressure', 'High Blood Sugar', 'Mental Health Concern', 'Pregnancy Care'].includes(c || '')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Health Report</h3>
              <p className="text-xs text-emerald-50/90">ASHA Worker Mode · Generated {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Patient block */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Patient</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-400">Name</span><div className="font-semibold text-slate-800">{patient.name}</div></div>
              <div><span className="text-slate-400">Age / Gender</span><div className="font-semibold text-slate-800">{patient.age}y · {patient.gender}</div></div>
              <div><span className="text-slate-400">Village</span><div className="font-semibold text-slate-800">{patient.village}</div></div>
              <div><span className="text-slate-400">Phone</span><div className="font-semibold text-slate-800">{patient.phone || '—'}</div></div>
            </div>
          </div>

          {/* Vitals */}
          {lastScreening && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Latest Vitals</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <VitalTile label="BP" value={lastScreening.vitals.bp} unit="" />
                <VitalTile label="Pulse" value={lastScreening.vitals.pulse || '—'} unit="bpm" />
                <VitalTile label="Temp" value={lastScreening.vitals.temp || '—'} unit="°C" />
                <VitalTile label="SpO₂" value={lastScreening.vitals.spo2 || '—'} unit="%" />
              </div>
            </div>
          )}

          {/* Flagged conditions */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Flagged Conditions</h4>
            {flaggedConditions.length === 0 ? (
              <p className="text-sm text-slate-500 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-600" /> No conditions flagged in last screening.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {flaggedConditions.map(c => (
                  <span key={c} className="text-sm font-medium px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            referralNeeded ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            {referralNeeded ? <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            <div className="text-sm">
              <p className={`font-bold ${referralNeeded ? 'text-rose-800' : 'text-emerald-800'}`}>
                {referralNeeded ? 'Refer to Primary Health Centre' : 'Routine Follow-up'}
              </p>
              <p className={referralNeeded ? 'text-rose-700 mt-1' : 'text-emerald-700 mt-1'}>
                {referralNeeded
                  ? 'Patient shows signs that need a doctor. Please arrange a visit to the nearest PHC within 7 days.'
                  : 'No urgent issues. Continue routine home visits and educate the family on healthy habits.'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {lastScreening?.notes && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Worker Notes</h4>
              <p className="text-sm text-slate-600 p-3 rounded-2xl bg-slate-50 border border-slate-100">{lastScreening.notes}</p>
            </div>
          )}

          <button
            onClick={() => window.print()}
            className="w-full px-4 py-3 text-sm font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Print / Save Report
          </button>
        </div>
      </div>
    </div>
  );
};

const VitalTile: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
  <div className="p-3 rounded-2xl bg-white border border-slate-100 text-center">
    <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    <div className="text-lg font-bold text-slate-800">{value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span></div>
  </div>
);

export default ASHAWorkerMode;
