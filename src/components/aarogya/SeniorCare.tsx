'use client';

import React, { useState, useEffect } from 'react';
import {
  HandHeart, Pill, Activity, Brain, Clock, Plus, Trash2,
  CheckCircle2, AlertTriangle, Phone, Heart, Footprints,
  Bell, BookOpen, ChevronRight, Calendar, TrendingDown
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface FallRisk {
  age: number;
  balanceIssues: boolean;
  visionProblems: boolean;
  medications: number;
  previousFalls: boolean;
}

export const SeniorCare: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_senior_meds');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [
      { id: 'm1', name: 'Amlodipine', dosage: '5mg', time: '08:00', taken: false },
      { id: 'm2', name: 'Metformin', dosage: '500mg', time: '09:00', taken: true },
      { id: 'm3', name: 'Vitamin D3', dosage: '60K IU', time: '10:00', taken: false },
    ];
  });

  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00' });
  const [fallRisk, setFallRisk] = useState<FallRisk>({ age: 65, balanceIssues: false, visionProblems: false, medications: 3, previousFalls: false });
  const [activeExercise, setActiveExercise] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('aarogya_senior_meds', JSON.stringify(medications));
  }, [medications]);

  const addMedication = () => {
    if (!newMed.name) return;
    setMedications([...medications, { ...newMed, id: `m-${Date.now()}`, taken: false }]);
    setNewMed({ name: '', dosage: '', time: '08:00' });
    setShowAddMed(false);
  };

  const toggleMed = (id: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const deleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Fall risk calculation
  let fallRiskScore = 0;
  if (fallRisk.age >= 75) fallRiskScore += 3;
  else if (fallRisk.age >= 65) fallRiskScore += 1;
  if (fallRisk.balanceIssues) fallRiskScore += 2;
  if (fallRisk.visionProblems) fallRiskScore += 2;
  if (fallRisk.medications >= 4) fallRiskScore += 2;
  else if (fallRisk.medications >= 2) fallRiskScore += 1;
  if (fallRisk.previousFalls) fallRiskScore += 3;

  const fallRiskLevel = fallRiskScore >= 7 ? 'high' : fallRiskScore >= 4 ? 'moderate' : 'low';
  const fallRiskColor = fallRiskLevel === 'high' ? 'text-red-600 bg-red-50 border-red-200' : fallRiskLevel === 'moderate' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  const memoryExercises = [
    { name: 'Word Recall', desc: 'Memorize 5 words, recall after 5 minutes', icon: Brain, duration: '10 min' },
    { name: 'Number Sequence', desc: 'Count backwards from 100 by 7s', icon: Activity, duration: '5 min' },
    { name: 'Story Telling', desc: 'Recall a recent event in detail', icon: BookOpen, duration: '15 min' },
    { name: 'Name & Place', desc: 'List 10 cities for each letter', icon: Calendar, duration: '10 min' },
  ];

  const goiSchemes = [
    { name: 'IGNOAPS', desc: 'Indira Gandhi National Old Age Pension Scheme — ₹200/month (60+), ₹500/month (80+)', elig: '60+ years, BPL' },
    { name: 'IGNDPS', desc: 'Indira Gandhi National Disability Pension — ₹300/month', elig: '40+ with 80% disability' },
    { name: 'National Programme for HC of Elderly', desc: 'Free healthcare at district hospitals', elig: '60+ years' },
    { name: 'Rashtriya Vayoshri Yojana', desc: 'Free assisted-living devices', elig: 'BPL, 60+' },
    { name: 'Pradhan Mantri Vaya Vandana', desc: 'Pension scheme — 8% guaranteed return', elig: '60+' },
  ];

  const takenCount = medications.filter(m => m.taken).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <HandHeart className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Senior Citizens Care</h1>
            <p className="text-violet-50/90 text-sm mt-1">Comprehensive care for elders 60+ · GOI Integrated Programme</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Heart className="w-3 h-3" /> LASI Data</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Bell className="w-3 h-3" /> Reminders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medication Tracker */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl"><Pill className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <h2 className="font-extrabold text-slate-900">Medication Tracker</h2>
              <p className="text-xs text-slate-400">{takenCount}/{medications.length} taken today</p>
            </div>
          </div>
          <button onClick={() => setShowAddMed(!showAddMed)} className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-emerald-700 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {showAddMed && (
          <div className="bg-slate-50 rounded-2xl p-3 mb-3 grid grid-cols-1 sm:grid-cols-4 gap-2 animate-fadeIn">
            <input value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} placeholder="Medicine name" className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="Dosage" className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input type="time" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={addMedication} className="bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">Add</button>
          </div>
        )}

        <div className="space-y-2">
          {medications.map(med => (
            <div key={med.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${med.taken ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <button onClick={() => toggleMed(med.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${med.taken ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200'}`}>
                {med.taken && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`font-bold text-sm ${med.taken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{med.name}</span>
                <span className="text-xs text-slate-400 ml-2">{med.dosage}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" /> {med.time}</span>
              <button onClick={() => deleteMed(med.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Fall Risk Assessment */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-50 rounded-xl"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
          <div>
            <h2 className="font-extrabold text-slate-900">Fall Risk Assessment</h2>
            <p className="text-xs text-slate-400">WHO falls prevention guidelines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Age</label>
            <input type="number" value={fallRisk.age} onChange={e => setFallRisk({ ...fallRisk, age: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1 block">Number of medications</label>
            <input type="number" value={fallRisk.medications} onChange={e => setFallRisk({ ...fallRisk, medications: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {[
            { key: 'balanceIssues', label: 'Balance or walking problems' },
            { key: 'visionProblems', label: 'Vision problems' },
            { key: 'previousFalls', label: 'Previous fall in last 6 months' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFallRisk({ ...fallRisk, [item.key]: !fallRisk[item.key as keyof FallRisk] as any })}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${fallRisk[item.key as keyof FallRisk] ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-600'}`}
            >
              {item.label}
              <span className={`w-5 h-5 rounded-md flex items-center justify-center ${fallRisk[item.key as keyof FallRisk] ? 'bg-amber-500' : 'bg-white border border-slate-200'}`}>
                {fallRisk[item.key as keyof FallRisk] && <CheckCircle2 className="w-3 h-3 text-white" />}
              </span>
            </button>
          ))}
        </div>

        <div className={`p-4 rounded-2xl border-2 ${fallRiskColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">Risk Level</div>
              <div className="text-2xl font-extrabold capitalize">{fallRiskLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">Score</div>
              <div className="text-2xl font-extrabold">{fallRiskScore}/10</div>
            </div>
          </div>
          {fallRiskLevel !== 'low' && (
            <p className="text-xs mt-2 opacity-80">
              {fallRiskLevel === 'high' ? '⚠️ High risk — consider home safety modifications, balance exercises, and medication review with doctor.' : '💡 Moderate risk — stay active, remove tripping hazards, and get regular vision checks.'}
            </p>
          )}
        </div>
      </div>

      {/* Memory Exercises */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-violet-50 rounded-xl"><Brain className="w-5 h-5 text-violet-600" /></div>
          <div>
            <h2 className="font-extrabold text-slate-900">Memory & Brain Exercises</h2>
            <p className="text-xs text-slate-400">Cognitive wellness activities</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {memoryExercises.map((ex, i) => (
            <button
              key={i}
              onClick={() => setActiveExercise(activeExercise === i ? null : i)}
              className={`text-left p-4 rounded-2xl transition-all ${activeExercise === i ? 'bg-violet-50 ring-2 ring-violet-300' : 'bg-slate-50 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl"><ex.icon className="w-5 h-5 text-violet-600" /></div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-800">{ex.name}</div>
                  <div className="text-xs text-slate-500">{ex.duration}</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeExercise === i ? 'rotate-90' : ''}`} />
              </div>
              {activeExercise === i && (
                <p className="text-xs text-slate-600 mt-3 animate-fadeIn">{ex.desc}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* GOI Schemes */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-cyan-50 rounded-xl"><Phone className="w-5 h-5 text-cyan-600" /></div>
          <div>
            <h2 className="font-extrabold text-slate-900">GOI Senior Welfare Schemes</h2>
            <p className="text-xs text-slate-400">Integrated Programme for Older Persons</p>
          </div>
        </div>
        <div className="space-y-2">
          {goiSchemes.map((s, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-800">{s.name}</span>
                <span className="text-[9px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{s.elig}</span>
              </div>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 flex items-center gap-4">
        <div className="p-3 bg-red-100 rounded-2xl"><Phone className="w-6 h-6 text-red-600" /></div>
        <div className="flex-1">
          <h3 className="font-extrabold text-red-800">Emergency Support</h3>
          <p className="text-xs text-red-600">24/7 helpline for seniors</p>
        </div>
        <a href="tel:14567" className="bg-red-600 text-white font-bold px-5 py-3 rounded-2xl text-sm hover:bg-red-700 transition-colors">
          Call 14567
        </a>
      </div>
    </div>
  );
};

export default SeniorCare;
