'use client';

// ============================================
// AAROGYA AI — CALM MIND SANCTUARY
// Breathing exercises (4-7-8 + Box), mood tracker (localStorage),
// guided meditation cards, mental health tips.
// Soft greens + warm lavender accents (NO indigo primary).
// ============================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Brain, Heart, Wind, BookOpen, TrendingUp, Sparkles, Moon,
  Smile, Frown, Meh, Meh as TiredIcon, Zap as EnergyIcon, Leaf,
  Play, Pause, RotateCcw, Sun, Clock, Quote, Lightbulb, Flower2,
  Waves, Mountain, TreePine, Droplets, Coffee, Star,
  ChevronRight, Trash2, CheckCircle2, Info,
} from 'lucide-react';
import type { MoodLog } from '@/types/aarogya';

// ============================================
// MOOD DEFINITIONS
// ============================================
type Mood = MoodLog['mood'];

interface MoodMeta {
  value: Mood;
  label: string;
  emoji: string;
  score: number; // 1 (worst) → 5 (best)
  color: string;
  ring: string;
  text: string;
  bg: string;
}

const MOODS: MoodMeta[] = [
  { value: 'happy',     label: 'Happy',     emoji: '😊', score: 5, color: 'emerald', ring: 'ring-emerald-300', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { value: 'calm',      label: 'Calm',      emoji: '😌', score: 4, color: 'teal',    ring: 'ring-teal-300',    text: 'text-teal-700',    bg: 'bg-teal-50 border-teal-200' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡', score: 5, color: 'amber',   ring: 'ring-amber-300',   text: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  { value: 'tired',     label: 'Tired',     emoji: '😴', score: 2, color: 'violet',  ring: 'ring-violet-300',  text: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200' },
  { value: 'anxious',   label: 'Anxious',   emoji: '😰', score: 2, color: 'orange',  ring: 'ring-orange-300',  text: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
  { value: 'stressed',  label: 'Stressed',  emoji: '😣', score: 1, color: 'rose',    ring: 'ring-rose-300',    text: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200' },
];

const moodMeta = (m: Mood): MoodMeta => MOODS.find(x => x.value === m) ?? MOODS[0];

// ============================================
// BREATHING TECHNIQUES
// ============================================
interface Technique {
  id: '4-7-8' | 'box' | 'calm';
  name: string;
  hindi: string;
  description: string;
  phases: { label: string; seconds: number }[];
  color: string;
  gradient: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Relaxing Breath',
    hindi: 'विश्राम श्वास',
    description: 'Dr. Andrew Weil\'s technique — calms the nervous system, aids sleep.',
    phases: [
      { label: 'Inhale',  seconds: 4 },
      { label: 'Hold',    seconds: 7 },
      { label: 'Exhale',  seconds: 8 },
    ],
    color: 'emerald',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'box',
    name: 'Box Breathing',
    hindi: 'बॉक्स श्वास',
    description: 'Used by Navy SEALs to focus under pressure. Equal 4-count phases.',
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Hold',   seconds: 4 },
      { label: 'Exhale', seconds: 4 },
      { label: 'Hold',   seconds: 4 },
    ],
    color: 'teal',
    gradient: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    hindi: 'शांत श्वास',
    description: 'Simple 4-4-6 pattern to settle an anxious mind anytime.',
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Hold',   seconds: 4 },
      { label: 'Exhale', seconds: 6 },
    ],
    color: 'violet',
    gradient: 'from-violet-400 to-fuchsia-500',
  },
];

// ============================================
// MEDITATION CARDS
// ============================================
const MEDITATIONS = [
  { id: 'morning',   title: 'Morning Awakening',     duration: '5 min',  icon: Sun,       color: 'from-amber-50 to-orange-50 border-amber-200',  iconBg: 'bg-amber-100 text-amber-600',     desc: 'Start the day with intention and gratitude.' },
  { id: 'midday',    title: 'Midday Reset',          duration: '3 min',  icon: Coffee,    color: 'from-emerald-50 to-teal-50 border-emerald-200', iconBg: 'bg-emerald-100 text-emerald-600', desc: 'Quick pause between tasks to refocus.' },
  { id: 'nature',    title: 'Forest Visualization',  duration: '10 min', icon: TreePine,  color: 'from-green-50 to-emerald-50 border-green-200',  iconBg: 'bg-green-100 text-green-600',     desc: 'Mental walk through a peaceful Indian forest.' },
  { id: 'ocean',     title: 'Ocean Breath (Ujjayi)', duration: '7 min',  icon: Waves,     color: 'from-cyan-50 to-teal-50 border-cyan-200',      iconBg: 'bg-cyan-100 text-cyan-600',       desc: 'The "victorious breath" — calming and grounding.' },
  { id: 'mountain',  title: 'Mountain Stillness',    duration: '8 min',  icon: Mountain,  color: 'from-slate-50 to-emerald-50 border-slate-200',  iconBg: 'bg-slate-100 text-slate-600',     desc: 'Cultivate unshakeable inner stability.' },
  { id: 'sleep',     title: 'Sleep Wind-down',       duration: '12 min', icon: Moon,      color: 'from-violet-50 to-purple-50 border-violet-200', iconBg: 'bg-violet-100 text-violet-600',   desc: 'Yoga Nidra-inspired release for deep rest.' },
];

// ============================================
// AFFIRMATIONS (EN + HI)
// ============================================
const AFFIRMATIONS = [
  { en: 'You are enough, just as you are.', hi: 'आप जैसे हैं, काफी हैं।' },
  { en: 'This moment will pass. You are stronger than you think.', hi: 'यह क्षण गुजर जाएगा। आप अपनी सोच से अधिक मजबूत हैं।' },
  { en: 'Your feelings are valid. Be gentle with yourself.', hi: 'आपकी भावनाएं वैध हैं। अपने प्रति कोमल रहें।' },
  { en: 'Every small step counts. You are making progress.', hi: 'हर छोटा कदम मायने रखता है। आप प्रगति कर रहे हैं।' },
  { en: 'You deserve peace, love, and kindness.', hi: 'आप शांति, प्रेम और करुणा के हकदार हैं।' },
  { en: 'Breathe in calm, breathe out tension.', hi: 'शांति अंदर, तनाव बाहर।' },
];

// ============================================
// TIPS
// ============================================
const TIPS = [
  { icon: Droplets,   title: 'Hydrate First',         text: 'Begin the day with a glass of warm water. Dehydration amplifies anxiety.' },
  { icon: Sun,        title: 'Morning Sunlight',      text: '10 minutes of morning sunlight regulates your circadian rhythm and mood.' },
  { icon: Leaf,       title: 'Eat Warm, Cooked Food', text: 'Ayurveda favours warm, freshly-cooked meals for sattvic (calm) energy.' },
  { icon: Moon,       title: 'Digital Sunset',        text: 'Switch off screens 1 hour before bed for deeper, more restful sleep.' },
  { icon: Wind,       title: 'Nadi Shodhana',         text: 'Alternate-nostril breathing for 5 minutes balances both brain hemispheres.' },
  { icon: Heart,      title: 'Practice Gratitude',    text: 'Note 3 things you\'re grateful for each night — proven to lift mood.' },
];

const STORAGE_KEY = 'aarogya_mood_history_v1';

// ============================================
// COMPONENT
// ============================================
export const MentalHealth: React.FC = () => {
  // ----- Mood state -----
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [saved, setSaved] = useState(false);

  // ----- Affirmation -----
  const [affIdx, setAffIdx] = useState(0);

  // ----- Meditation -----
  const [playingMeditation, setPlayingMeditation] = useState<string | null>(null);

  // ----- Hydrate from localStorage (SSR-safe) -----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: MoodLog[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // ----- Persist history -----
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch { /* ignore */ }
  }, [history]);

  // ----- Save mood entry -----
  const logMood = () => {
    if (!selectedMood) return;
    const entry: MoodLog = {
      id: `mood-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
      mood: selectedMood,
      note: moodNote.trim(),
    };
    setHistory(prev => [entry, ...prev].slice(0, 50));
    setSaved(true);
    setMoodNote('');
    setSelectedMood(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteEntry = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  // ----- Derived: last 7 moods for sparkline -----
  const recent = useMemo(() => history.slice(0, 7).reverse(), [history]);
  const avgScore = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.slice(0, 7).reduce((s, e) => s + moodMeta(e.mood).score, 0);
    return +(sum / Math.min(history.length, 7)).toFixed(1);
  }, [history]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      <style jsx>{`
        @keyframes nxBreathScale {
          0%   { transform: scale(0.6); }
          100% { transform: scale(1); }
        }
        @keyframes nxPetalFloat {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50%  { transform: translateY(-12px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
        }
        .nx-petal { animation: nxPetalFloat 6s ease-in-out infinite; }
        @keyframes nxBarGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .nx-bar { animation: nxBarGrow 0.5s ease-out forwards; transform-origin: bottom; }
        @keyframes nxPopIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .nx-pop-in { animation: nxPopIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes nxAuraPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50%      { opacity: 0.7; transform: scale(1.05); }
        }
        .nx-aura { animation: nxAuraPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-green-950 p-8 text-white shadow-2xl">
        <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulseGlow" />
        <div className="absolute -mb-24 -ml-16 bottom-0 left-0 h-56 w-56 rounded-full bg-teal-300/15 blur-3xl" />
        {/* Floating petals */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          {[{l: 15, t: 20, d: 0}, {l: 80, t: 30, d: 1}, {l: 25, t: 70, d: 2}, {l: 70, t: 65, d: 3}].map((p, i) => (
            <Flower2 key={i}
              className="absolute h-6 w-6 text-emerald-200 nx-petal"
              style={{ left: `${p.l}%`, top: `${p.t}%`, animationDelay: `${p.d}s` }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <Brain className="h-8 w-8 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-black">Calm Mind Sanctuary</h1>
          </div>
          <p className="max-w-2xl text-emerald-100">
            A gentle space for your mental wellbeing. Breathe, log your mood, journal
            your thoughts, and find moments of stillness. You are not alone. 🌿
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🌬️ 3 breathing techniques</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">😊 Mood tracking</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🧘 6 guided meditations</span>
            <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">📜 Saved locally</span>
          </div>
        </div>
      </div>

      {/* ===== BREATHING EXERCISE ===== */}
      <BreathingExercise />

      {/* ===== MOOD TRACKER + HISTORY ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Mood selector + note */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Heart className="h-5 w-5 text-rose-500" /> How are you feeling?
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            Tap a mood, add a note if you like, then save. Your entries stay private on this device.
          </p>

          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {MOODS.map(m => {
              const active = selectedMood === m.value;
              return (
                <button key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-2.5 transition-all hover:scale-105 ${
                    active ? `${m.bg} ring-2 ${m.ring}` : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                  }`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className={`text-[9px] font-bold ${active ? m.text : 'text-slate-500'}`}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div className="nx-pop-in mb-3">
              <textarea
                value={moodNote}
                onChange={e => setMoodNote(e.target.value)}
                placeholder="What's on your mind? (optional)"
                className="mb-3 min-h-[80px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={logMood}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700">
                <CheckCircle2 className="h-4 w-4" /> Save Mood Entry
              </button>
            </div>
          )}

          {saved && (
            <div className="nx-pop-in mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Saved. Be gentle with yourself today. 🌿
            </div>
          )}
        </div>

        {/* Mood history + sparkline */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Mood Trend
            </h2>
            {history.length > 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                7-day avg: {avgScore || '—'} / 5
              </span>
            )}
          </div>

          {/* Sparkline */}
          <div className="mb-4 h-32 rounded-xl border border-slate-100 bg-slate-50 p-3">
            {recent.length > 0 ? (
              <div className="flex h-full items-end justify-between gap-1">
                {recent.map((e, i) => {
                  const m = moodMeta(e.mood);
                  const h = (m.score / 5) * 100;
                  return (
                    <div key={e.id} className="group relative flex h-full flex-1 flex-col items-center justify-end"
                      title={`${m.label} • ${new Date(e.date).toLocaleString()}`}>
                      <div
                        className={`nx-bar w-full rounded-t bg-gradient-to-t ${gradientByScore(m.score)}`}
                        style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                      />
                      <span className="mt-1 text-[8px]">{m.emoji}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Log a mood to see your trend 🌱
              </div>
            )}
          </div>

          {/* Recent entries list */}
          <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">No entries yet.</p>
            ) : (
              history.slice(0, 10).map(entry => {
                const m = moodMeta(entry.mood);
                return (
                  <div key={entry.id}
                    className="nx-pop-in flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    <span className="text-lg">{m.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${m.text}`}>{m.label}</span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(entry.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="mt-0.5 truncate text-[11px] text-slate-600">{entry.note}</p>
                      )}
                    </div>
                    <button onClick={() => deleteEntry(entry.id)}
                      className="rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ===== AFFIRMATION ===== */}
      <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-emerald-50 to-teal-50 p-6 shadow-premium">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-900">
              <Sparkles className="h-4 w-4 text-violet-500" /> Daily Affirmation
            </h3>
            <p className="mb-1 text-base font-medium leading-relaxed text-slate-800">
              &ldquo;{AFFIRMATIONS[affIdx].en}&rdquo;
            </p>
            <p className="text-sm text-violet-700" lang="hi">{AFFIRMATIONS[affIdx].hi}</p>
          </div>
          <button onClick={() => setAffIdx((affIdx + 1) % AFFIRMATIONS.length)}
            className="flex-shrink-0 rounded-xl bg-white/70 p-2 text-violet-600 transition-colors hover:bg-white"
            aria-label="Next affirmation">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== MEDITATION CARDS ===== */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <Mountain className="h-5 w-5 text-emerald-500" /> Guided Meditations
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MEDITATIONS.map((m, i) => {
            const Icon = m.icon;
            const isPlaying = playingMeditation === m.id;
            return (
              <div key={m.id}
                className={`nx-pop-in rounded-2xl border bg-gradient-to-br ${m.color} p-4 transition-all hover:shadow-md`}
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mb-2 flex items-start justify-between">
                  <div className={`rounded-xl p-2 ${m.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                    <Clock className="h-2.5 w-2.5" /> {m.duration}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">{m.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{m.desc}</p>
                <button
                  onClick={() => setPlayingMeditation(isPlaying ? null : m.id)}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold transition-colors ${
                    isPlaying ? 'bg-rose-500 text-white hover:bg-rose-600'
                              : 'bg-white/70 text-emerald-700 hover:bg-white'
                  }`}>
                  {isPlaying
                    ? <><Pause className="h-3 w-3" /> Stop</>
                    : <><Play className="h-3 w-3" /> Begin</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MENTAL HEALTH TIPS ===== */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <Lightbulb className="h-5 w-5 text-amber-500" /> Wellness Tips
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i}
                className="nx-pop-in rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{t.title}</p>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">{t.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== QUOTE ===== */}
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center shadow-premium">
        <Quote className="mx-auto mb-3 h-6 w-6 text-emerald-400" />
        <p className="mx-auto max-w-2xl text-sm font-medium italic leading-relaxed text-slate-700">
          &ldquo;You don&apos;t have to control your thoughts. You just have to stop letting them control you.&rdquo;
        </p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600">— Dan Millman</p>
      </div>

      {/* ===== DISCLAIMER ===== */}
      <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="text-[11px] leading-relaxed text-amber-800">
          <strong>Heads up:</strong> Aarogya AI&apos;s mental wellness tools are educational
          and supportive — not a replacement for professional care. If you&apos;re in crisis or
          having thoughts of self-harm, please contact iCall (India) at 9152987821 or AASRA
          at 9820466726, or your local emergency services immediately.
        </p>
      </div>
    </div>
  );
};

export default MentalHealth;

// ============================================
// BREATHING EXERCISE SUB-COMPONENT
// ============================================
const BreathingExercise: React.FC = () => {
  const [techniqueId, setTechniqueId] = useState<Technique['id']>(TECHNIQUES[0].id);
  const technique = useMemo(() => TECHNIQUES.find(t => t.id === techniqueId) ?? TECHNIQUES[0], [techniqueId]);

  // Selecting a new technique remounts the inner BreathingRunner via key.
  const selectTechnique = (id: Technique['id']) => {
    setTechniqueId(id);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 shadow-premium">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-emerald-900">
          <Wind className="h-5 w-5 text-emerald-600" /> Guided Breathing
          <span className="ml-1 text-[10px] font-bold text-emerald-600" lang="hi">प्राणायाम</span>
        </h2>
        {/* Technique selector */}
        <div className="flex flex-wrap gap-1.5">
          {TECHNIQUES.map(t => (
            <button key={t.id}
              onClick={() => selectTechnique(t.id)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition-all ${
                technique.id === t.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white/70 text-emerald-700 hover:bg-white'
              }`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 text-xs leading-relaxed text-emerald-800">{technique.description}</p>

      <BreathingRunner key={technique.id} technique={technique} />
    </div>
  );
};

// ============================================
// BREATHING RUNNER (remounts per technique)
// ============================================
const BreathingRunner: React.FC<{ technique: Technique }> = ({ technique }) => {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(technique.phases[0].seconds);
  const [cyclesDone, setCyclesDone] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Tick — uses functional updates so we don't depend on stale phaseIdx
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1;
        // Advance phase using functional update
        setPhaseIdx(prevPhase => {
          const next = (prevPhase + 1) % technique.phases.length;
          if (next === 0) setCyclesDone(c => c + 1);
          // queue the next phase's seconds
          setTimeout(() => setSecondsLeft(technique.phases[next].seconds), 0);
          return next;
        });
        return 0; // brief zero before next phase sets it
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, technique]);

  const toggle = () => setRunning(r => !r);

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(technique.phases[0].seconds);
    setCyclesDone(0);
  };

  const phase = technique.phases[phaseIdx];
  // Scale: inhale grows, hold stays large, exhale shrinks
  const scale = phase.label === 'Inhale' ? 1.0
    : phase.label === 'Hold' && phaseIdx === 1 && technique.id === 'box' ? 1.0
    : phase.label === 'Hold' ? 1.0
    : 0.55; // Exhale

  const transitionDuration = phase.label === 'Inhale' ? `${phase.seconds}s`
    : phase.label === 'Exhale' ? `${phase.seconds}s`
    : '0.4s';

  return (
    <>
      {/* Breathing circle */}
      <div className="flex flex-col items-center">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          {/* Aura rings */}
          <div className="nx-aura absolute inset-0 rounded-full bg-emerald-200/40 blur-2xl" />
          <div className="absolute inset-4 rounded-full border border-emerald-200/60" />
          <div className="absolute inset-8 rounded-full border border-teal-200/60" />

          {/* Phase dots */}
          <div className="absolute inset-0">
            {technique.phases.map((p, i) => {
              const total = technique.phases.length;
              const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
              const r = 110;
              const x = 50 + (Math.cos(angle) * r) / 2.56;
              const y = 50 + (Math.sin(angle) * r) / 2.56;
              const active = i === phaseIdx && running;
              return (
                <div key={i}
                  className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                    active ? 'scale-150 bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-emerald-300'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }} />
              );
            })}
          </div>

          {/* Main breathing circle */}
          <div
            className={`relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${technique.gradient} shadow-2xl ${
              running ? 'shadow-emerald-500/40' : ''
            }`}
            style={{
              transform: `scale(${running ? scale : 0.7})`,
              transition: `transform ${transitionDuration} ease-in-out`,
            }}>
            <div className="text-center text-white">
              {running ? (
                <>
                  <p className="text-lg font-extrabold">{phase.label}</p>
                  <p className="text-3xl font-black tabular-nums">{secondsLeft}</p>
                </>
              ) : (
                <>
                  <Wind className="mx-auto mb-1 h-6 w-6" />
                  <p className="text-xs font-bold">Ready</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-3">
          <button onClick={toggle}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700">
            {running
              ? <><Pause className="h-4 w-4" /> Pause</>
              : <><Play className="h-4 w-4" /> Start Breathing</>}
          </button>
          <button onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-white"
            aria-label="Reset breathing">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          {cyclesDone > 0 && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {cyclesDone} cycle{cyclesDone !== 1 ? 's' : ''} complete 🌿
            </span>
          )}
        </div>

        {/* Phase strip */}
        <div className="mt-5 flex w-full max-w-md items-center justify-center gap-2">
          {technique.phases.map((p, i) => (
            <React.Fragment key={i}>
              <div className={`flex flex-col items-center rounded-xl border px-3 py-1.5 ${
                running && i === phaseIdx
                  ? 'border-emerald-400 bg-white shadow-sm'
                  : 'border-slate-200 bg-white/50'
              }`}>
                <span className={`text-[10px] font-bold ${running && i === phaseIdx ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {p.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{p.seconds}s</span>
              </div>
              {i < technique.phases.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

// ============================================
// HELPERS
// ============================================
function gradientByScore(score: number): string {
  if (score >= 5) return 'from-emerald-400 to-teal-500';
  if (score >= 4) return 'from-teal-400 to-cyan-500';
  if (score >= 3) return 'from-amber-400 to-orange-500';
  if (score >= 2) return 'from-orange-400 to-rose-500';
  return 'from-rose-400 to-red-500';
}
