'use client';

// ============================================
// AAROGYA AI — MENTAL HEALTH SCREENING
// PHQ-9 (depression) + GAD-7 (anxiety) standard tools.
// Automatic severity scoring, resource referral,
// history tracking over time (localStorage).
// Emerald + violet accents (NO indigo primary).
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain, Heart, Sparkles, TrendingUp, TrendingDown,
  CheckCircle2, AlertCircle, Phone, MessageCircle,
  BookOpen, Calendar, Trash2, RotateCcw, Award,
  Activity, Moon, Wind, ShieldCheck, ArrowRight,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type Response = 0 | 1 | 2 | 3;
type Severity = 'none' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';

interface ScoreRecord {
  id: string;
  date: string;
  type: 'phq9' | 'gad7';
  score: number;
  severity: Severity;
  responses: number[];
}

const STORAGE_KEY = 'aarogya_mental_health_screenings';

// ============================================
// PHQ-9 QUESTIONS (Depression)
// ============================================
const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — that you are a failure',
  'Trouble concentrating on things like reading or TV',
  'Moving or speaking slowly — or being fidgety/restless',
  'Thoughts that you would be better off not alive',
];

// ============================================
// GAD-7 QUESTIONS (Anxiety)
// ============================================
const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

const RESPONSE_OPTIONS: { value: Response; label: string }[] = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

// ============================================
// SCORING LOGIC
// ============================================
const scorePHQ9 = (responses: number[]): { score: number; severity: Severity } => {
  const score = responses.reduce((a, b) => a + b, 0);
  const severity: Severity =
    score >= 20 ? 'severe' :
    score >= 15 ? 'moderately_severe' :
    score >= 10 ? 'moderate' :
    score >= 5  ? 'mild' : 'none';
  return { score, severity };
};

const scoreGAD7 = (responses: number[]): { score: number; severity: Severity } => {
  const score = responses.reduce((a, b) => a + b, 0);
  const severity: Severity =
    score >= 15 ? 'severe' :
    score >= 10 ? 'moderate' :
    score >= 5  ? 'mild' : 'none';
  return { score, severity };
};

const SEVERITY_META: Record<Severity, { label: string; color: string; bg: string; text: string; bar: string }> = {
  none:               { label: 'None',              color: 'emerald', bg: 'bg-emerald-50 border-emerald-200',   text: 'text-emerald-700',   bar: 'bg-emerald-500' },
  mild:               { label: 'Mild',              color: 'teal',    bg: 'bg-teal-50 border-teal-200',          text: 'text-teal-700',      bar: 'bg-teal-500' },
  moderate:           { label: 'Moderate',          color: 'amber',   bg: 'bg-amber-50 border-amber-200',        text: 'text-amber-700',     bar: 'bg-amber-500' },
  moderately_severe:  { label: 'Moderately Severe', color: 'orange',  bg: 'bg-orange-50 border-orange-200',      text: 'text-orange-700',    bar: 'bg-orange-500' },
  severe:             { label: 'Severe',            color: 'rose',    bg: 'bg-rose-50 border-rose-200',          text: 'text-rose-700',      bar: 'bg-rose-500' },
};

// ============================================
// RESOURCES
// ============================================
const RESOURCES: Record<Severity, { title: string; items: { icon: React.ElementType; text: string }[] }> = {
  none: {
    title: 'Keep Taking Care',
    items: [
      { icon: Moon, text: 'Sleep 7-9 hours, fix a daily routine.' },
      { icon: Wind, text: 'Try 10 minutes of slow breathing daily.' },
      { icon: BookOpen, text: 'Stay connected with friends and family.' },
    ],
  },
  mild: {
    title: 'Self-Care Suggestions',
    items: [
      { icon: Activity, text: '30 min walk daily — proven to lift mood.' },
      { icon: Moon, text: 'Cut caffeine after 5pm, sleep before 11pm.' },
      { icon: BookOpen, text: 'Journal 3 things you are grateful for each day.' },
      { icon: Phone, text: 'Talk to someone you trust about your feelings.' },
    ],
  },
  moderate: {
    title: 'Consider Counseling',
    items: [
      { icon: Phone, text: 'iCall: 9152987821 (free mental health helpline).' },
      { icon: MessageCircle, text: 'Vandrevala Foundation: 1860-2662-345.' },
      { icon: BookOpen, text: 'See a counselor at your nearest district hospital.' },
      { icon: Activity, text: 'Continue daily walks and good sleep.' },
    ],
  },
  moderately_severe: {
    title: 'See a Doctor Soon',
    items: [
      { icon: Phone, text: 'KIRAN Helpline: 1800-599-0019 (24x7, free).' },
      { icon: ShieldCheck, text: 'Book a visit with a psychiatrist within 2 weeks.' },
      { icon: MessageCircle, text: 'Tell a family member — do not stay alone.' },
      { icon: BookOpen, text: 'A doctor may suggest therapy or medicine.' },
    ],
  },
  severe: {
    title: 'Get Help Today',
    items: [
      { icon: Phone, text: 'KIRAN Helpline NOW: 1800-599-0019.' },
      { icon: AlertCircle, text: 'Visit the nearest hospital emergency today.' },
      { icon: ShieldCheck, text: 'Do not be alone — call a loved one right now.' },
      { icon: MessageCircle, text: 'A mental health professional can help you feel better.' },
    ],
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const MentalHealthScreening: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phq9' | 'gad7'>('phq9');
  const [phq9Responses, setPhq9Responses] = useState<number[]>(Array(9).fill(-1));
  const [gad7Responses, setGad7Responses] = useState<number[]>(Array(7).fill(-1));
  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecords(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records, loaded]);

  const setResponse = (tab: 'phq9' | 'gad7', qIndex: number, value: number) => {
    if (tab === 'phq9') {
      setPhq9Responses(prev => prev.map((v, i) => i === qIndex ? value : v));
    } else {
      setGad7Responses(prev => prev.map((v, i) => i === qIndex ? value : v));
    }
  };

  const allAnswered = (tab: 'phq9' | 'gad7') =>
    tab === 'phq9' ? phq9Responses.every(v => v >= 0) : gad7Responses.every(v => v >= 0);

  const currentScore = useMemo(() => {
    if (activeTab === 'phq9') return scorePHQ9(phq9Responses.filter(v => v >= 0));
    return scoreGAD7(gad7Responses.filter(v => v >= 0));
  }, [activeTab, phq9Responses, gad7Responses]);

  const saveResult = () => {
    if (!allAnswered(activeTab)) return;
    const responses = activeTab === 'phq9' ? phq9Responses : gad7Responses;
    const record: ScoreRecord = {
      id: `${activeTab}-${Date.now()}`,
      date: new Date().toISOString(),
      type: activeTab,
      score: currentScore.score,
      severity: currentScore.severity,
      responses,
    };
    setRecords(prev => [record, ...prev]);
  };

  const resetTab = (tab: 'phq9' | 'gad7') => {
    if (tab === 'phq9') setPhq9Responses(Array(9).fill(-1));
    else setGad7Responses(Array(7).fill(-1));
  };

  const phq9History = records.filter(r => r.type === 'phq9');
  const gad7History = records.filter(r => r.type === 'gad7');
  const activeResponses = activeTab === 'phq9' ? phq9Responses : gad7Responses;
  const questions = activeTab === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const answeredCount = activeResponses.filter(v => v >= 0).length;
  const maxScore = activeTab === 'phq9' ? 27 : 21;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Mental Health Screening</h1>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-violet-50/90 text-sm mt-1">PHQ-9 & GAD-7 · Standard medical questionnaires</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Private</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Heart className="w-3 h-3" /> Free Helplines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* EMERGENCY NOTE */}
      {/* ============================================ */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <p className="text-sm text-rose-800">
          If you feel like hurting yourself or cannot cope, please call <strong>KIRAN Helpline 1800-599-0019</strong> right now. You are not alone.
        </p>
      </div>

      {/* ============================================ */}
      {/* TABS */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('phq9')}
            className={`flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold transition relative ${
              activeTab === 'phq9' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4" /> PHQ-9 (Depression)
            {activeTab === 'phq9' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
          <button
            onClick={() => setActiveTab('gad7')}
            className={`flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold transition relative ${
              activeTab === 'gad7' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Brain className="w-4 h-4" /> GAD-7 (Anxiety)
            {activeTab === 'gad7' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
        </div>

        <div className="p-6">
          {/* Intro */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              Over the <strong>last 2 weeks</strong>, how often have you been bothered by these problems?
              Answer honestly — your answers stay on this device.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Progress: {answeredCount} of {questions.length} answered</span>
            <button onClick={() => resetTab(activeTab)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>

          {/* Questions */}
          <div className="space-y-3 mb-5">
            {questions.map((q, i) => (
              <div key={i} className={`p-3 rounded-2xl border transition ${activeResponses[i] >= 0 ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-slate-100'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm font-medium text-slate-700">{q}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 ml-7">
                  {RESPONSE_OPTIONS.map(opt => {
                    const selected = activeResponses[i] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setResponse(activeTab, i, opt.value)}
                        className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition ${
                          selected
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {opt.label}
                        <span className="block text-[9px] opacity-70">{opt.value} pt</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Live Score Preview */}
          <div className={`p-4 rounded-2xl border ${SEVERITY_META[currentScore.severity].bg}`}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${SEVERITY_META[currentScore.severity].text}`} />
                <span className="font-bold text-slate-800">
                  {answeredCount === questions.length ? 'Your Result' : 'Live Preview'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${SEVERITY_META[currentScore.severity].text}`}>
                  {SEVERITY_META[currentScore.severity].label}
                </span>
                <span className="text-sm font-bold text-slate-700">{currentScore.score} / {maxScore}</span>
              </div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className={`h-full ${SEVERITY_META[currentScore.severity].bar} transition-all`} style={{ width: `${(currentScore.score / maxScore) * 100}%` }} />
            </div>
            <button
              onClick={saveResult}
              disabled={!allAnswered(activeTab)}
              className="mt-3 w-full sm:w-auto px-5 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Result to History
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* RESOURCES / REFERRAL */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Recommended Next Steps
        </h2>
        <div className={`p-4 rounded-2xl border ${SEVERITY_META[currentScore.severity].bg} mb-4`}>
          <p className={`font-bold ${SEVERITY_META[currentScore.severity].text}`}>
            {RESOURCES[currentScore.severity].title}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Based on your current {activeTab === 'phq9' ? 'depression' : 'anxiety'} score.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RESOURCES[currentScore.severity].items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                <item.icon className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* HISTORY */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> Score History
          </h2>
          {records.length > 0 && (
            <button
              onClick={() => setRecords([])}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No past screenings saved. Complete a screening and tap "Save Result" to track your progress.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <HistoryColumn title="PHQ-9 (Depression)" records={phq9History} max={27} />
            <HistoryColumn title="GAD-7 (Anxiety)" records={gad7History} max={21} />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENT
// ============================================
const HistoryColumn: React.FC<{ title: string; records: ScoreRecord[]; max: number }> = ({ title, records, max }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
      <Activity className="w-4 h-4 text-emerald-600" /> {title}
    </h3>
    {records.length === 0 ? (
      <p className="text-xs text-slate-400 text-center py-4">No records yet.</p>
    ) : (
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {records.map(r => {
          const meta = SEVERITY_META[r.severity];
          const prev = records[records.indexOf(r) + 1];
          const trend = prev ? (r.score > prev.score ? 'up' : r.score < prev.score ? 'down' : 'same') : null;
          return (
            <div key={r.id} className="p-2.5 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-500">{new Date(r.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                  {trend === 'up' && <TrendingUp className="w-3 h-3 text-rose-500" />}
                  {trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">{r.score}<span className="text-xs text-slate-400">/{max}</span></span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>{meta.label}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                <div className={`h-full ${meta.bar}`} style={{ width: `${(r.score / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default MentalHealthScreening;
