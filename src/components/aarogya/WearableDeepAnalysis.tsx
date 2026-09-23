'use client';

// ============================================
// AAROGYA AI — WEARABLE DEEP ANALYSIS
// 24h heart rate pattern, HRV stress detection,
// sleep stage analysis, step pattern, detection of
// AFib, chronic fatigue, high stress days, weekly report.
// Emerald + cyan accents (NO indigo primary).
// ============================================

import React, { useState } from 'react';
import {
  Heart, Activity, Moon, Footprints, Zap, Brain,
  AlertTriangle, TrendingUp, TrendingDown, Sparkles,
  Clock, Battery, Flame, ShieldCheck, Waves,
  Stethoscope, Gauge, Calendar, Info, Watch,
} from 'lucide-react';

// ============================================
// MOCK 24h HEART RATE DATA (every 2 hours)
// ============================================
const HR_24H = [
  { hour: '12am', hr: 58, label: 'Deep sleep' },
  { hour: '2am',  hr: 55, label: 'Deep sleep' },
  { hour: '4am',  hr: 56, label: 'REM' },
  { hour: '6am',  hr: 62, label: 'Light sleep' },
  { hour: '8am',  hr: 78, label: 'Morning walk' },
  { hour: '10am', hr: 82, label: 'Work' },
  { hour: '12pm', hr: 88, label: 'Active' },
  { hour: '2pm',  hr: 90, label: 'Stress spike' },
  { hour: '4pm',  hr: 84, label: 'Work' },
  { hour: '6pm',  hr: 110, label: 'Exercise' },
  { hour: '8pm',  hr: 76, label: 'Relax' },
  { hour: '10pm', hr: 68, label: 'Wind down' },
];

const SLEEP_STAGES = [
  { stage: 'Deep',   pct: 18, target: 20, color: 'bg-indigo-400', icon: Moon,   desc: 'Body repair, immune boost' },
  { stage: 'Light',  pct: 52, target: 50, color: 'bg-sky-400',    icon: Waves,  desc: 'Memory and learning' },
  { stage: 'REM',    pct: 22, target: 25, color: 'bg-violet-400', icon: Brain,  desc: 'Dreaming, mood reset' },
  { stage: 'Awake',  pct: 8,  target: 5,  color: 'bg-amber-400',  icon: Clock,  desc: 'Wake-ups during night' },
];

const STEP_WEEK = [
  { day: 'Mon', steps: 6200 },
  { day: 'Tue', steps: 8400 },
  { day: 'Wed', steps: 4100 },
  { day: 'Thu', steps: 9800 },
  { day: 'Fri', steps: 5300 },
  { day: 'Sat', steps: 11500 },
  { day: 'Sun', steps: 7200 },
];

const HRV_WEEK = [
  { day: 'Mon', hrv: 42, stress: 'medium' as const },
  { day: 'Tue', hrv: 48, stress: 'low' as const },
  { day: 'Wed', hrv: 31, stress: 'high' as const },
  { day: 'Thu', hrv: 52, stress: 'low' as const },
  { day: 'Fri', hrv: 38, stress: 'medium' as const },
  { day: 'Sat', hrv: 55, stress: 'low' as const },
  { day: 'Sun', hrv: 35, stress: 'high' as const },
];

// ============================================
// DETECTIONS
// ============================================
interface Detection {
  id: string;
  title: string;
  severity: 'info' | 'watch' | 'alert';
  detail: string;
  advice: string;
  icon: React.ElementType;
}

const DETECTIONS: Detection[] = [
  {
    id: 'afib',
    title: 'Possible AFib Pattern',
    severity: 'alert',
    detail: 'Heartbeat showed irregular gaps on 2 nights this week (Wed, Sun). HRV dropped below 35ms.',
    advice: 'Please visit a cardiologist within 1 week. They may suggest an ECG. Avoid caffeine and alcohol until then.',
    icon: Heart,
  },
  {
    id: 'fatigue',
    title: 'Chronic Fatigue Pattern',
    severity: 'watch',
    detail: 'Deep sleep has been below 20% for 6 straight nights. Morning resting heart rate is rising.',
    advice: 'Your body needs more recovery. Aim for 7-9 hours sleep, reduce screen time after 9pm, and check iron/vitamin D.',
    icon: Battery,
  },
  {
    id: 'stress',
    title: 'High Stress Days',
    severity: 'watch',
    detail: 'Wednesday and Sunday showed stress spikes (HRV < 35ms) with low step counts.',
    advice: 'Try 10 min slow breathing on busy days. Even a short walk helps. Talk to someone you trust.',
    icon: Zap,
  },
  {
    id: 'recovery',
    title: 'Good Recovery Trend',
    severity: 'info',
    detail: 'Saturday showed your best HRV (55ms) and highest step count (11,500).',
    advice: 'Keep it up! Your body responds well to outdoor activity and early sleep.',
    icon: TrendingUp,
  },
];

const SEVERITY_META = {
  info:  { label: 'Good news',     bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  watch: { label: 'Watch closely', bg: 'bg-amber-50 border-amber-200',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  alert: { label: 'See a doctor',  bg: 'bg-rose-50 border-rose-200',       text: 'text-rose-700',    dot: 'bg-rose-500' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const WearableDeepAnalysis: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'hr' | 'sleep' | 'steps' | 'detections'>('overview');

  const maxHR = Math.max(...HR_24H.map(d => d.hr));
  const minHR = Math.min(...HR_24H.map(d => d.hr));
  const avgHR = Math.round(HR_24H.reduce((a, b) => a + b.hr, 0) / HR_24H.length);

  const todayHRV = 38;
  const stressLevel: 'low' | 'medium' | 'high' = todayHRV > 45 ? 'low' : todayHRV > 35 ? 'medium' : 'high';
  const stressMeta = {
    low:    { label: 'Low Stress',    color: 'text-emerald-700', bg: 'bg-emerald-100', text: 'Your body is recovering well. Keep up good sleep and walks.' },
    medium: { label: 'Medium Stress', color: 'text-amber-700',   bg: 'bg-amber-100',   text: 'Some stress signs. Take breaks, breathe slow, sleep early.' },
    high:   { label: 'High Stress',   color: 'text-rose-700',    bg: 'bg-rose-100',    text: 'Body is under stress. Rest today, reduce work, talk to someone.' },
  }[stressLevel];

  const totalSteps = STEP_WEEK.reduce((a, b) => a + b.steps, 0);
  const avgSteps = Math.round(totalSteps / STEP_WEEK.length);
  const maxStepDay = STEP_WEEK.reduce((max, d) => d.steps > max.steps ? d : max, STEP_WEEK[0]);
  const maxSteps = Math.max(...STEP_WEEK.map(d => d.steps));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-violet-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Wearable Deep Analysis</h1>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-emerald-50/90 text-sm mt-1">24h heart · sleep · stress · step intelligence</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Watch className="w-3 h-3" /> Smart Band connected</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> AI Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* QUICK STATS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickStat icon={Heart}       label="Avg HR"     value={`${avgHR}`} unit="bpm" tone="rose" />
        <QuickStat icon={Activity}    label="Today HRV"  value={`${todayHRV}`} unit="ms" tone={stressLevel === 'high' ? 'rose' : stressLevel === 'medium' ? 'amber' : 'emerald'} />
        <QuickStat icon={Footprints}  label="Avg Steps"  value={`${avgSteps.toLocaleString()}`} unit="/day" tone="teal" />
        <QuickStat icon={Moon}        label="Sleep"      value="6h 42m" unit="" tone="violet" />
      </div>

      {/* ============================================ */}
      {/* SECTION NAV */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-2 flex flex-wrap gap-1">
        {[
          { id: 'overview' as const,    label: 'Overview',   icon: Gauge },
          { id: 'hr' as const,          label: 'Heart Rate', icon: Heart },
          { id: 'sleep' as const,       label: 'Sleep',      icon: Moon },
          { id: 'steps' as const,       label: 'Steps',      icon: Footprints },
          { id: 'detections' as const,  label: 'Detections', icon: AlertTriangle },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex-1 justify-center ${
              activeSection === s.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <s.icon className="w-4 h-4" /> {s.label}
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* OVERVIEW */}
      {/* ============================================ */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stress gauge */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> HRV Stress Detection
              </h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${stressMeta.bg} ${stressMeta.color}`}>{stressMeta.label}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{stressMeta.text}</p>

            {/* Stress meter */}
            <div className="relative">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div className="flex-1 bg-emerald-400" />
                <div className="flex-1 bg-amber-400" />
                <div className="flex-1 bg-rose-400" />
              </div>
              <div className="absolute top-0 h-4 flex items-center justify-center" style={{ left: `${Math.max(0, Math.min(100, ((70 - todayHRV) / 70) * 100))}%`, transform: 'translateX(-50%)' }}>
                <div className="w-1.5 h-8 bg-slate-800 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>Low stress (HRV &gt; 45ms)</span>
              <span>Medium (35-45ms)</span>
              <span>High (&lt; 35ms)</span>
            </div>

            {/* Weekly HRV bars */}
            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-500 mb-2">Weekly HRV Trend</div>
              <div className="flex items-end justify-between gap-2 h-32">
                {HRV_WEEK.map(d => {
                  const heightPct = (d.hrv / 60) * 100;
                  const bg = d.stress === 'low' ? 'bg-emerald-400' : d.stress === 'medium' ? 'bg-amber-400' : 'bg-rose-400';
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-600">{d.hrv}</span>
                      <div className="w-full flex-1 flex items-end">
                        <div className={`w-full ${bg} rounded-t-lg`} style={{ height: `${heightPct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly report summary */}
          <WeeklyReport avgHR={avgHR} todayHRV={todayHRV} avgSteps={avgSteps} />
        </div>
      )}

      {/* ============================================ */}
      {/* HEART RATE */}
      {/* ============================================ */}
      {activeSection === 'hr' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" /> 24-Hour Heart Rate Pattern
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniStat label="Resting" value={minHR} unit="bpm" tone="emerald" />
            <MiniStat label="Average" value={avgHR} unit="bpm" tone="teal" />
            <MiniStat label="Peak"    value={maxHR} unit="bpm" tone="rose" />
          </div>

          {/* HR bar chart */}
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-48 mb-2">
            {HR_24H.map(d => {
              const heightPct = ((d.hr - 50) / (maxHR - 50)) * 100;
              const color = d.hr > 100 ? 'bg-rose-400' : d.hr > 80 ? 'bg-amber-400' : d.hr > 65 ? 'bg-emerald-400' : 'bg-teal-400';
              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition">{d.hr}</span>
                  <div className="w-full flex-1 flex items-end relative">
                    <div className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80`} style={{ height: `${heightPct}%` }}>
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-500">{d.hr}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{d.hour}</span>
                </div>
              );
            })}
          </div>

          {/* Color legend */}
          <div className="flex items-center justify-center gap-3 flex-wrap mt-4 text-[10px] text-slate-500">
            <Legend color="bg-teal-400" label="Resting (50-65)" />
            <Legend color="bg-emerald-400" label="Normal (66-80)" />
            <Legend color="bg-amber-400" label="Active (81-100)" />
            <Legend color="bg-rose-400" label="High (&gt;100)" />
          </div>

          {/* HR annotations */}
          <div className="mt-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-600">Key Moments Today</h3>
            {HR_24H.filter(d => d.hr > 85 || d.hr < 60).map(d => (
              <div key={d.hour} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600">{d.hour}</span>
                  <span className="text-xs font-semibold text-slate-700">{d.label}</span>
                </div>
                <span className={`text-xs font-bold ${d.hr > 100 ? 'text-rose-600' : d.hr > 85 ? 'text-amber-600' : 'text-teal-600'}`}>{d.hr} bpm</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SLEEP */}
      {/* ============================================ */}
      {activeSection === 'sleep' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Moon className="w-5 h-5 text-violet-500" /> Sleep Stage Analysis
            </h2>
            <span className="text-xs text-slate-500">Last night · 7h 18m total</span>
          </div>

          {/* Sleep stages */}
          <div className="space-y-3 mb-5">
            {SLEEP_STAGES.map(s => (
              <div key={s.stage}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <s.icon className={`w-4 h-4 ${s.stage === 'Deep' ? 'text-indigo-500' : s.stage === 'Light' ? 'text-sky-500' : s.stage === 'REM' ? 'text-violet-500' : 'text-amber-500'}`} />
                    <span className="text-sm font-semibold text-slate-700">{s.stage}</span>
                    <span className="text-[10px] text-slate-400">{s.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{s.pct}%</span>
                    <span className={`text-[10px] ${s.pct >= s.target - 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {s.pct >= s.target - 5 ? 'On target' : 'Below target'}
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Sleep timeline visual */}
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-600 mb-2">Tonight&apos;s Sleep Timeline</h3>
            <div className="flex h-8 rounded-xl overflow-hidden border border-slate-100">
              <div className="bg-indigo-300" style={{ width: '15%' }} title="Deep" />
              <div className="bg-sky-300" style={{ width: '20%' }} title="Light" />
              <div className="bg-violet-300" style={{ width: '8%' }} title="REM" />
              <div className="bg-sky-300" style={{ width: '12%' }} title="Light" />
              <div className="bg-indigo-300" style={{ width: '10%' }} title="Deep" />
              <div className="bg-sky-300" style={{ width: '15%' }} title="Light" />
              <div className="bg-violet-300" style={{ width: '12%' }} title="REM" />
              <div className="bg-amber-300" style={{ width: '3%' }} title="Awake" />
              <div className="bg-sky-300" style={{ width: '5%' }} title="Light" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>11:24 PM</span><span>6:42 AM</span>
            </div>
          </div>

          {/* Sleep insight */}
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-violet-800">Sleep Insight</p>
              <p className="text-violet-700 mt-1">
                Deep sleep is 2% below target. You went to bed after 11pm — earlier sleep (before 10:30pm)
                boosts deep sleep by up to 20%. Avoid phone use 30 min before bed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STEPS */}
      {/* ============================================ */}
      {activeSection === 'steps' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-teal-500" /> Step Pattern Analysis
            </h2>
            <span className="text-xs text-slate-500">Weekly total: {totalSteps.toLocaleString()} steps</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniStat label="Daily Avg" value={avgSteps.toLocaleString()} unit="steps" tone="emerald" />
            <MiniStat label="Best Day"   value={maxStepDay.steps.toLocaleString()} unit={maxStepDay.day} tone="teal" />
            <MiniStat label="Target"     value="10,000" unit="/day" tone="amber" />
          </div>

          {/* Step chart */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-48 mb-3">
            {STEP_WEEK.map(d => {
              const heightPct = (d.steps / maxSteps) * 100;
              const reached = d.steps >= 10000;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-slate-700">{(d.steps / 1000).toFixed(1)}k</span>
                  <div className="w-full flex-1 flex items-end">
                    <div className={`w-full ${reached ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : 'bg-gradient-to-t from-teal-300 to-cyan-300'} rounded-t-lg transition-all hover:opacity-80`} style={{ height: `${heightPct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400">{d.day}</span>
                  {reached && <Flame className="w-3 h-3 text-amber-500" />}
                </div>
              );
            })}
          </div>

          {/* Pattern insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon={TrendingUp}
              tone="emerald"
              title="Active Days"
              text="Thursday and Saturday crossed 10K steps. You feel more energetic and sleep better those days."
            />
            <InsightCard
              icon={TrendingDown}
              tone="amber"
              title="Low Days"
              text="Wednesday was your lowest (4,100 steps). On low-step days, your stress score went up."
            />
            <InsightCard
              icon={Clock}
              tone="teal"
              title="Best Time"
              text="Most steps happen between 6-9am and 5-8pm. Morning walks boost your whole day."
            />
            <InsightCard
              icon={Flame}
              tone="rose"
              title="Calorie Burn"
              text="You burned about 2,150 kcal this week from walking — about 6 chapatis a day."
            />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DETECTIONS */}
      {/* ============================================ */}
      {activeSection === 'detections' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> AI Health Detections
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Patterns spotted by AI from your wearable data this week. These are <strong>not a diagnosis</strong>.
              Please confirm with a doctor.
            </p>

            <div className="space-y-3">
              {DETECTIONS.map(d => {
                const meta = SEVERITY_META[d.severity];
                return (
                  <div key={d.id} className={`p-4 rounded-2xl border ${meta.bg}`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-100">
                        <d.icon className={`w-5 h-5 ${meta.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-sm">{d.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white ${meta.text}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{d.detail}</p>
                        <div className="mt-2 pt-2 border-t border-white/40 flex items-start gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-700">{d.advice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Wearable data is helpful but not perfect. A doctor can confirm with proper tests (ECG, blood test).
              Use these alerts as early hints, not final answers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// WEEKLY REPORT COMPONENT
// ============================================
const WeeklyReport: React.FC<{ avgHR: number; todayHRV: number; avgSteps: number }> = ({ avgHR, todayHRV, avgSteps }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-white rounded-lg border border-emerald-100">
        <Calendar className="w-4 h-4 text-emerald-600" />
      </div>
      <h2 className="font-bold text-slate-800">Weekly Wearable Health Intelligence Report</h2>
    </div>

    <div className="bg-white rounded-2xl p-4 border border-emerald-100 mb-3">
      <h3 className="text-xs font-bold uppercase text-emerald-600 mb-2">Summary</h3>
      <p className="text-sm text-slate-700">
        This week, your average heart rate was <strong>{avgHR} bpm</strong> (normal range),
        HRV averaged <strong>{todayHRV}ms</strong> (slightly stressed),
        and you walked <strong>{avgSteps.toLocaleString()} steps/day</strong> (just below the 10K target).
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ReportCard
        icon={Heart}
        title="Heart"
        good={true}
        points={[
          `Average HR ${avgHR} bpm is in healthy adult range`,
          'Resting HR stable across the week',
          'Watch: 2 nights showed possible irregular rhythm',
        ]}
      />
      <ReportCard
        icon={Moon}
        title="Sleep"
        good={false}
        points={[
          'Deep sleep 18% (target 20%)',
          'Average sleep 6h 42m (target 7-9h)',
          'Try sleeping before 10:30pm this week',
        ]}
      />
      <ReportCard
        icon={Footprints}
        title="Activity"
        good={true}
        points={[
          `Best day: Saturday with 11.5K steps`,
          '4 of 7 days above 7K steps',
          'Add 1 evening walk to reach 10K daily',
        ]}
      />
      <ReportCard
        icon={Zap}
        title="Stress"
        good={false}
        points={[
          '2 high-stress days (Wed, Sun)',
          'HRV drops on low-activity days',
          'Try 10 min breathing on busy days',
        ]}
      />
    </div>

    <div className="mt-4 p-3 rounded-2xl bg-white border border-emerald-100 flex items-start gap-2">
      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      <p className="text-xs text-slate-600">
        <strong>Action this week:</strong> Sleep 30 minutes earlier, take 1 short walk on busy days, and
        book a doctor visit if irregular heartbeats continue.
      </p>
    </div>
  </div>
);

const ReportCard: React.FC<{ icon: React.ElementType; title: string; good: boolean; points: string[] }> = ({ icon: Icon, title, good, points }) => (
  <div className="p-4 rounded-2xl bg-white border border-slate-100">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${good ? 'text-emerald-600' : 'text-amber-600'}`} />
        <span className="text-sm font-bold text-slate-700">{title}</span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${good ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {good ? 'Good' : 'Watch'}
      </span>
    </div>
    <ul className="space-y-1">
      {points.map((p, i) => (
        <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
          <span className={`w-1 h-1 rounded-full ${good ? 'bg-emerald-400' : 'bg-amber-400'} mt-1.5 shrink-0`} />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

// ============================================
// SMALL SUB-COMPONENTS
// ============================================
const QuickStat: React.FC<{ icon: React.ElementType; label: string; value: string; unit: string; tone: 'rose' | 'amber' | 'emerald' | 'teal' | 'violet' }> = ({ icon: Icon, label, value, unit, tone }) => {
  const tones = {
    rose:    'bg-rose-50 text-rose-700 border-rose-100',
    amber:   'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    teal:    'bg-teal-50 text-teal-700 border-teal-100',
    violet:  'bg-violet-50 text-violet-700 border-violet-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${tones[tone]}`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-xl font-bold">{value}<span className="text-xs font-normal opacity-70 ml-1">{unit}</span></div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

const MiniStat: React.FC<{ label: string; value: number | string; unit: string; tone: 'emerald' | 'teal' | 'rose' | 'amber' }> = ({ label, value, unit, tone }) => {
  const tones = {
    emerald: 'text-emerald-700 bg-emerald-50',
    teal:    'text-teal-700 bg-teal-50',
    rose:    'text-rose-700 bg-rose-50',
    amber:   'text-amber-700 bg-amber-50',
  };
  return (
    <div className={`p-3 rounded-xl ${tones[tone]} text-center`}>
      <div className="text-xl font-bold">{value}<span className="text-xs font-normal opacity-70 ml-1">{unit}</span></div>
      <div className="text-[10px] font-medium opacity-80 mt-0.5">{label}</div>
    </div>
  );
};

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
    <span>{label}</span>
  </div>
);

const InsightCard: React.FC<{ icon: React.ElementType; tone: 'emerald' | 'amber' | 'teal' | 'rose'; title: string; text: string }> = ({ icon: Icon, tone, title, text }) => {
  const tones = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber:   'bg-amber-50 border-amber-100 text-amber-700',
    teal:    'bg-teal-50 border-teal-100 text-teal-700',
    rose:    'bg-rose-50 border-rose-100 text-rose-700',
  };
  return (
    <div className={`p-3 rounded-2xl border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-4 h-4" />
        <h4 className="text-xs font-bold">{title}</h4>
      </div>
      <p className="text-[11px] text-slate-600">{text}</p>
    </div>
  );
};

export default WearableDeepAnalysis;
