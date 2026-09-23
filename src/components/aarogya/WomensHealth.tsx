'use client';

import React, { useState, useEffect } from 'react';
import {
  Flower2, Calendar, Heart, Droplets, Baby, Moon,
  TrendingUp, Info, ChevronRight, Sparkles, Apple, Activity,
  AlertCircle, Calculator
} from 'lucide-react';

interface CycleLog {
  id: string;
  date: string;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  mood: string;
}

export const WomensHealth: React.FC = () => {
  const [cycleLogs, setCycleLogs] = useState<CycleLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_cycle_logs');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [];
  });
  const [lastPeriod, setLastPeriod] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aarogya_last_period') || '';
    }
    return '';
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [activeTab, setActiveTab] = useState<'tracker' | 'pregnancy' | 'tips'>('tracker');

  useEffect(() => {
    localStorage.setItem('aarogya_cycle_logs', JSON.stringify(cycleLogs));
  }, [cycleLogs]);
  useEffect(() => {
    localStorage.setItem('aarogya_last_period', lastPeriod);
  }, [lastPeriod]);

  // Calculate next period
  const nextPeriodDate = lastPeriod ? new Date(new Date(lastPeriod).getTime() + cycleLength * 86400000) : null;
  const daysUntilNext = nextPeriodDate ? Math.ceil((nextPeriodDate.getTime() - Date.now()) / 86400000) : null;
  const fertileStart = lastPeriod ? new Date(new Date(lastPeriod).getTime() + (cycleLength - 14 - 5) * 86400000) : null;
  const fertileEnd = lastPeriod ? new Date(new Date(lastPeriod).getTime() + (cycleLength - 14 + 1) * 86400000) : null;

  const addCycleLog = (flow: CycleLog['flow']) => {
    const today = new Date().toISOString().split('T')[0];
    setCycleLogs([{ id: `c-${Date.now()}`, date: today, flow, symptoms: [], mood: 'neutral' }, ...cycleLogs].slice(0, 50));
    if (!lastPeriod) setLastPeriod(today);
  };

  // Pregnancy calculator
  const [lmp, setLmp] = useState('');
  const [pregnancyInfo, setPregnancyInfo] = useState<null | { weeks: number; days: number; dueDate: Date; trimester: number }>(null);

  const calcPregnancy = () => {
    if (!lmp) return;
    const lmpDate = new Date(lmp);
    const now = new Date();
    const diffMs = now.getTime() - lmpDate.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    const dueDate = new Date(lmpDate.getTime() + 280 * 86400000);
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    setPregnancyInfo({ weeks, days, dueDate, trimester });
  };

  const healthTips = [
    { icon: Apple, title: 'Iron-Rich Foods', desc: 'Palak, beetroot, jaggery, dates — prevent anemia common in Indian women (50% affected per NFHS-5).' },
    { icon: Droplets, title: 'Stay Hydrated', desc: '3L daily, more during menstruation. Coconut water replenishes electrolytes.' },
    { icon: Activity, title: 'PCOS Management', desc: '1 in 5 Indian women has PCOS. Regular exercise + low-GI diet helps manage symptoms.' },
    { icon: Moon, title: 'Sleep & Hormones', desc: '7-9 hours regulates estrogen & progesterone. Irregular sleep worsens PMS.' },
    { icon: Heart, title: 'Heart Health', desc: 'Women\'s heart attack symptoms differ — watch for nausea, jaw pain, fatigue. Not just chest pain.' },
    { icon: Calendar, title: 'Self-Breast Exam', desc: 'Check monthly, 7-10 days after period. 1 in 28 Indian women develops breast cancer.' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Flower2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Women's Health</h1>
            <p className="text-pink-50/90 text-sm mt-1">Comprehensive care · NFHS-5 data integrated</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Heart className="w-3 h-3" /> Personalized</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
        {[
          { id: 'tracker', label: 'Cycle Tracker', icon: Calendar },
          { id: 'pregnancy', label: 'Pregnancy Calc', icon: Baby },
          { id: 'tips', label: 'Health Tips', icon: Heart },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-colors ${activeTab === t.id ? 'bg-pink-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Cycle Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4">Cycle Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Last Period Start</label>
                <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Cycle Length (days)</label>
                <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value) || 28)} min="21" max="35" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Period Length (days)</label>
                <input type="number" value={periodLength} onChange={e => setPeriodLength(parseInt(e.target.value) || 5)} min="3" max="7" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
          </div>

          {/* Predictions */}
          {lastPeriod && nextPeriodDate && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 text-white shadow-lg">
                <Calendar className="w-5 h-5 mb-2 opacity-80" />
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Next Period</div>
                <div className="text-2xl font-extrabold">{nextPeriodDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                <div className="text-xs opacity-90 mt-1">{daysUntilNext !== null && daysUntilNext > 0 ? `in ${daysUntilNext} days` : daysUntilNext !== null && daysUntilNext <= 0 ? 'overdue' : ''}</div>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
                <Sparkles className="w-5 h-5 mb-2 opacity-80" />
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Fertile Window</div>
                <div className="text-sm font-extrabold">{fertileStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {fertileEnd?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                <TrendingUp className="w-5 h-5 mb-2 opacity-80" />
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Cycle Day</div>
                <div className="text-2xl font-extrabold">Day {Math.floor((Date.now() - new Date(lastPeriod).getTime()) / 86400000) + 1}</div>
              </div>
            </div>
          )}

          {/* Log Flow */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-3">Log Today's Flow</h2>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'medium', 'heavy'] as const).map(flow => (
                <button key={flow} onClick={() => addCycleLog(flow)} className="py-3 rounded-2xl text-sm font-bold capitalize bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-700 transition-colors">
                  {flow === 'light' ? '💧 Light' : flow === 'medium' ? '💧💧 Medium' : '💧💧💧 Heavy'}
                </button>
              ))}
            </div>
          </div>

          {cycleLogs.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <h2 className="font-extrabold text-slate-900 mb-3">Recent Logs</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-slim">
                {cycleLogs.slice(0, 10).map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Droplets className={`w-4 h-4 ${log.flow === 'heavy' ? 'text-red-500' : log.flow === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                    <span className="text-sm font-bold text-slate-700 capitalize">{log.flow}</span>
                    <span className="text-xs text-slate-400 ml-auto">{log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pregnancy Calculator */}
      {activeTab === 'pregnancy' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-pink-600" /> Pregnancy Calculator</h2>
            <label className="text-xs font-bold text-slate-600 mb-1 block">First Day of Last Period (LMP)</label>
            <div className="flex gap-2">
              <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <button onClick={calcPregnancy} className="bg-pink-500 text-white font-bold px-5 rounded-xl text-sm hover:bg-pink-600 transition-colors">Calculate</button>
            </div>
          </div>

          {pregnancyInfo && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">You are</div>
                  <div className="text-5xl font-extrabold">{pregnancyInfo.weeks}<span className="text-2xl">w</span> {pregnancyInfo.days}<span className="text-xl">d</span></div>
                  <div className="text-sm opacity-90 mt-2">pregnant · Trimester {pregnancyInfo.trimester}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <Baby className="w-6 h-6 text-pink-500 mb-2" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</div>
                  <div className="text-lg font-extrabold text-slate-900">{pregnancyInfo.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <Calendar className="w-6 h-6 text-fuchsia-500 mb-2" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Days Remaining</div>
                  <div className="text-lg font-extrabold text-slate-900">{Math.max(0, Math.ceil((pregnancyInfo.dueDate.getTime() - Date.now()) / 86400000))} days</div>
                </div>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
                <Info className="w-4 h-4 text-pink-600 inline mr-1" />
                <span className="text-xs text-pink-700">Regular prenatal checkups are essential. Consult your gynecologist monthly. This is an estimate based on LMP — ultrasound dating is more accurate.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Health Tips */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {healthTips.map((tip, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all card-hover">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-pink-50 rounded-2xl flex-shrink-0"><tip.icon className="w-6 h-6 text-pink-600" /></div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-slate-600">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">This information is for educational purposes. Always consult a gynecologist for personalized medical advice. For pregnancy concerns, contact your healthcare provider immediately.</p>
      </div>
    </div>
  );
};

export default WomensHealth;
