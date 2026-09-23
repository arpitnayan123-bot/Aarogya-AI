'use client';

// ============================================
// AAROGYA AI — AYURVEDA INTELLIGENCE
// Dosha quiz (Vata / Pitta / Kapha) + herbal recs +
// Dinacharya (daily routine) + Ayurvedic diet tips.
// References BhashaBench-Ayur (BharatGen) dataset.
// Emerald/green leaf-themed premium design.
// ============================================

import React, { useState, useMemo } from 'react';
import {
  Leaf, Database, Info, ExternalLink, CheckCircle2, AlertCircle,
  BookOpen, Flame, Wind, Flower, Sparkles, Users, Sun, Sunrise,
  Sunset, Moon, Sun as SunIcon, Droplet, Heart, Brain, Activity,
  ChevronRight, ChevronLeft, RotateCcw, Star, Quote, Sprout,
  Soup, Wheat, Apple, ShoppingBasket, Sage, Trees,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type Dosha = 'vata' | 'pitta' | 'kapha';

interface DoshaInfo {
  name: string;
  hindi: string;
  element: string;
  icon: React.ElementType;
  emoji: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  accent: string;
  qualities: string[];
  bodyTraits: string[];
  balanced: string[];
  imbalanced: string[];
  foods: string[];
  avoid: string[];
  herbs: { name: string; benefit: string }[];
  dinacharya: { time: string; activity: string; icon: React.ElementType }[];
}

// ============================================
// DOSHA DATA
// ============================================
const DOSHA_DATA: Record<Dosha, DoshaInfo> = {
  vata: {
    name: 'Vata',
    hindi: 'वात',
    element: 'Air + Ether (आकाश)',
    icon: Wind,
    emoji: '🌬️',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    accent: 'teal',
    qualities: ['Light', 'Cold', 'Dry', 'Rough', 'Mobile', 'Subtle'],
    bodyTraits: ['Thin frame', 'Dry skin', 'Cold hands & feet', 'Irregular appetite', 'Quick learner, quick forgetter', 'Light, restless sleep'],
    balanced: ['Creative', 'Energetic', 'Flexible', 'Enthusiastic', 'Quick-thinking'],
    imbalanced: ['Anxiety', 'Insomnia', 'Constipation', 'Joint pain', 'Dry skin', 'Worried mind'],
    foods: ['Warm cooked meals', 'Root vegetables', 'Ghee', 'Sesame oil', 'Sweet, sour, salty tastes', 'Nuts & seeds', 'Warm milk with spices'],
    avoid: ['Cold raw foods', 'Carbonated drinks', 'Excessive caffeine', 'Dry crackers', 'Cold dairy'],
    herbs: [
      { name: 'Ashwagandha', benefit: 'Grounds & calms the nervous system, builds ojas' },
      { name: 'Shatavari', benefit: 'Nourishes & moisturises tissues' },
      { name: 'Ginger (Sunthi)', benefit: 'Kindles agni, reduces bloating' },
      { name: 'Cardamom (Elaichi)', benefit: 'Warms digestion, calms mind' },
    ],
    dinacharya: [
      { time: '6:00 AM', activity: 'Wake before sunrise (Brahma Muhurta); tongue scraping', icon: Sunrise },
      { time: '6:30 AM', activity: 'Warm sesame oil self-massage (Abhyanga)', icon: Droplet },
      { time: '7:00 AM', activity: 'Gentle yoga + Pranayama (Nadi Shodhana)', icon: Activity },
      { time: '8:00 AM', activity: 'Warm, grounding breakfast (oats, cooked grains)', icon: Sun },
      { time: '12:30 PM', activity: 'Largest warm meal; sit, chew slowly', icon: Soup },
      { time: '6:00 PM', activity: 'Light early dinner; no cold drinks', icon: Sunset },
      { time: '9:30 PM', activity: 'Warm milk with nutmeg; lights out by 10', icon: Moon },
    ],
  },
  pitta: {
    name: 'Pitta',
    hindi: 'पित्त',
    element: 'Fire + Water (जल)',
    icon: Flame,
    emoji: '🔥',
    gradient: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    accent: 'rose',
    qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Spreading', 'Liquid'],
    bodyTraits: ['Medium build', 'Warm body temperature', 'Strong appetite', 'Sharp intellect', 'Good digestion', 'Freckled / reddish skin'],
    balanced: ['Intelligent', 'Courageous', 'Strong leader', 'Clear skin', 'Articulate'],
    imbalanced: ['Anger', 'Inflammation', 'Acidity', 'Skin rashes', 'Excessive sweating', 'Irritability'],
    foods: ['Cooling foods', 'Sweet fruits', 'Leafy greens', 'Coconut water', 'Bitter & astringent tastes', 'Cucumber, melons', 'Mint, cilantro'],
    avoid: ['Spicy chillies', 'Sour foods', 'Excess salt', 'Fried foods', 'Coffee on empty stomach', 'Alcohol'],
    herbs: [
      { name: 'Brahmi', benefit: 'Calms mind, cools intellect' },
      { name: 'Neem (Nimba)', benefit: 'Detoxifies blood, clears skin' },
      { name: 'Coriander (Dhania)', benefit: 'Cools & supports digestion' },
      { name: 'Rose (Gulab)', benefit: 'Soothes heart, cools emotions' },
    ],
    dinacharya: [
      { time: '6:30 AM', activity: 'Wake; tongue scraping; cool rinse', icon: Sunrise },
      { time: '7:00 AM', activity: 'Light coconut-oil massage; walking', icon: Droplet },
      { time: '7:30 AM', activity: 'Cooling pranayama (Sheetali); meditation', icon: Activity },
      { time: '8:00 AM', activity: 'Cooling breakfast (sweet fruits, milk)', icon: Sun },
      { time: '12:00 PM', activity: 'Main meal at noon (peak agni); avoid sun', icon: Soup },
      { time: '6:30 PM', activity: 'Light dinner; sweet, bitter tastes', icon: Sunset },
      { time: '10:00 PM', activity: 'Moonlight walk; sleep by 10:30', icon: Moon },
    ],
  },
  kapha: {
    name: 'Kapha',
    hindi: 'कफ',
    element: 'Earth + Water (पृथ्वी)',
    icon: Flower,
    emoji: '🌱',
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    accent: 'emerald',
    qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense'],
    bodyTraits: ['Strong, sturdy build', 'Smooth, oily skin', 'Slow metabolism', 'Calm demeanour', 'Excellent stamina', 'Deep, long sleep'],
    balanced: ['Loving', 'Patient', 'Stable', 'Strong immunity', 'Forgiving', 'Loyal'],
    imbalanced: ['Weight gain', 'Lethargy', 'Congestion', 'Attachment', 'Slow digestion', 'Depression'],
    foods: ['Light, warm foods', 'Spices (ginger, pepper)', 'Honey', 'Bitter greens', 'Pungent & astringent tastes', 'Steamed vegetables', 'Barley, millet'],
    avoid: ['Dairy', 'Sweets & desserts', 'Oily foods', 'Cold foods', 'Wheat', 'Refined carbs'],
    herbs: [
      { name: 'Tulsi (Holy Basil)', benefit: 'Clears congestion, lifts mood' },
      { name: 'Turmeric (Haldi)', benefit: 'Reduces kapha, supports immunity' },
      { name: 'Triphala', benefit: 'Gentle detox, supports elimination' },
      { name: 'Guggulu', benefit: 'Mobilises fat & toxins' },
    ],
    dinacharya: [
      { time: '5:30 AM', activity: 'Wake early — before Vata/Kapha time', icon: Sunrise },
      { time: '6:00 AM', activity: 'Dry-brush massage (Udvartana); vigorous', icon: Activity },
      { time: '6:30 AM', activity: 'Vigorous exercise; Kapalabhati pranayama', icon: Activity },
      { time: '8:00 AM', activity: 'Light, spiced breakfast (barley, fruit)', icon: Sun },
      { time: '1:00 PM', activity: 'Light warm lunch; pungent, bitter tastes', icon: Soup },
      { time: '7:00 PM', activity: 'Light, early dinner; walking after', icon: Sunset },
      { time: '10:30 PM', activity: 'Sleep on right side; lighter hours', icon: Moon },
    ],
  },
};

// ============================================
// DOSHA QUIZ — 10 QUESTIONS
// Each option increments one dosha's score.
// ============================================
interface QuizOption { label: string; dosha: Dosha }
interface QuizQuestion { q: string; emoji: string; options: QuizOption[] }

const QUIZ: QuizQuestion[] = [
  { emoji: '🦴', q: 'Which best describes your body frame?',
    options: [
      { label: 'Thin, light, prominent joints', dosha: 'vata' },
      { label: 'Medium, muscular, well-proportioned', dosha: 'pitta' },
      { label: 'Solid, sturdy, well-developed', dosha: 'kapha' },
    ] },
  { emoji: '🌡️', q: 'How is your body temperature usually?',
    options: [
      { label: 'Cold hands & feet, dislike cold', dosha: 'vata' },
      { label: 'Warm, sweat easily, dislike heat', dosha: 'pitta' },
      { label: 'Cool but comfortable, adaptable', dosha: 'kapha' },
    ] },
  { emoji: '👵', q: 'Your skin tends to be…',
    options: [
      { label: 'Dry, thin, rough', dosha: 'vata' },
      { label: 'Warm, reddish, sensitive', dosha: 'pitta' },
      { label: 'Oily, smooth, cool', dosha: 'kapha' },
    ] },
  { emoji: '😴', q: 'Your sleep pattern is…',
    options: [
      { label: 'Light, easily disturbed, vivid dreams', dosha: 'vata' },
      { label: 'Moderate, wake refreshed, intense dreams', dosha: 'pitta' },
      { label: 'Deep, long, hard to wake from', dosha: 'kapha' },
    ] },
  { emoji: '🍽️', q: 'Your appetite is…',
    options: [
      { label: 'Variable — sometimes ravenous, sometimes none', dosha: 'vata' },
      { label: 'Strong & sharp — get irritable if I miss a meal', dosha: 'pitta' },
      { label: 'Steady but can comfortably skip meals', dosha: 'kapha' },
    ] },
  { emoji: '⚡', q: 'Your energy & activity level is…',
    options: [
      { label: 'Bursts of energy, then fatigue', dosha: 'vata' },
      { label: 'Intense, focused, competitive', dosha: 'pitta' },
      { label: 'Steady, enduring, slow to start', dosha: 'kapha' },
    ] },
  { emoji: '🧠', q: 'Your mind & thinking style is…',
    options: [
      { label: 'Quick, creative, often anxious', dosha: 'vata' },
      { label: 'Sharp, analytical, sometimes critical', dosha: 'pitta' },
      { label: 'Calm, steady, sometimes slow to learn', dosha: 'kapha' },
    ] },
  { emoji: '😊', q: 'Under stress, you tend to feel…',
    options: [
      { label: 'Anxious, worried, scattered', dosha: 'vata' },
      { label: 'Irritable, frustrated, angry', dosha: 'pitta' },
      { label: 'Withdrawn, heavy, attached', dosha: 'kapha' },
    ] },
  { emoji: '🌧️', q: 'How does weather affect you?',
    options: [
      { label: 'Dislike cold, wind, dryness', dosha: 'vata' },
      { label: 'Dislike heat & humidity', dosha: 'pitta' },
      { label: 'Dislike cold, damp, cloudy days', dosha: 'kapha' },
    ] },
  { emoji: '🗣️', q: 'Your speech & voice tend to be…',
    options: [
      { label: 'Fast, talkative, voice can be hoarse', dosha: 'vata' },
      { label: 'Sharp, articulate, persuasive', dosha: 'pitta' },
      { label: 'Slow, melodious, often soft', dosha: 'kapha' },
    ] },
];

// ============================================
// DATASET INFO (BhashaBench-Ayur)
// ============================================
const DATASET_INFO = {
  name: 'BhashaBench-Ayur (BBA)',
  description: "India's first comprehensive Ayurvedic AI benchmark",
  author: 'BharatGen',
  license: 'CC BY-4.0',
  link: 'https://aikosh.indiaai.gov.in/home/datasets/details/bhashabench_ayur.html',
  questions: '14,963',
  exams: '50+',
  domains: '15+',
  languages: 'EN / HI (+Sanskrit planned)',
};

// ============================================
// COMPONENT
// ============================================
export const Ayurveda: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [quizIdx, setQuizIdx] = useState(0);
  const [scores, setScores] = useState<Record<Dosha, number>>({ vata: 0, pitta: 0, kapha: 0 });
  const [answers, setAnswers] = useState<Record<number, Dosha>>({});
  const [showDataset, setShowDataset] = useState(false);
  const [browseDosha, setBrowseDosha] = useState<Dosha>('vata');

  const primaryDosha = useMemo<Dosha>(() => {
    const entries = Object.entries(scores) as [Dosha, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }, [scores]);

  const secondaryDosha = useMemo<Dosha | null>(() => {
    const entries = Object.entries(scores) as [Dosha, number][];
    entries.sort((a, b) => b[1] - a[1]);
    if (entries[0][1] === entries[1][1]) return null;
    return entries[1][0] as Dosha;
  }, [scores]);

  const totalAnswered = Object.keys(answers).length;

  // ----- Quiz flow -----
  const startQuiz = () => {
    setStage('quiz');
    setQuizIdx(0);
    setScores({ vata: 0, pitta: 0, kapha: 0 });
    setAnswers({});
  };

  const answer = (qIdx: number, dosha: Dosha) => {
    if (answers[qIdx]) return; // can't change once answered (single-shot)
    const newAnswers = { ...answers, [qIdx]: dosha };
    setAnswers(newAnswers);
    setScores(prev => ({ ...prev, [dosha]: prev[dosha] + 1 }));
    // Auto-advance after a short tick
    setTimeout(() => {
      if (qIdx + 1 >= QUIZ.length) {
        setStage('result');
      } else {
        setQuizIdx(qIdx + 1);
      }
    }, 250);
  };

  const prev = () => setQuizIdx(i => Math.max(0, i - 1));
  const next = () => setQuizIdx(i => Math.min(QUIZ.length - 1, i + 1));

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 animate-fadeIn">
      <style jsx>{`
        @keyframes nxLeafFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          20%  { opacity: 0.5; }
          100% { transform: translateY(50px) rotate(180deg); opacity: 0; }
        }
        .nx-leaf-fall { animation: nxLeafFall 8s ease-in-out infinite; }
        @keyframes nxProgressGrow { from { width: 0; } }
        .nx-progress-grow { animation: nxProgressGrow 0.4s ease-out forwards; }
        @keyframes nxResultPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .nx-result-pop { animation: nxResultPop 0.5s ease-out forwards; opacity: 0; }
        @keyframes nxAuraPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.08); }
        }
        .nx-aura-pulse { animation: nxAuraPulse 4s ease-in-out infinite; }
      `}</style>

      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950 p-8 text-white shadow-2xl">
        <div className="absolute -mr-20 -mt-20 right-0 top-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulseGlow" />
        <div className="absolute -mb-24 -ml-16 bottom-0 left-0 h-56 w-56 rounded-full bg-teal-300/15 blur-3xl" />
        {/* Falling leaves */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          {[{l: 10, d: 0}, {l: 30, d: 2}, {l: 55, d: 4}, {l: 75, d: 1}, {l: 90, d: 3}].map((p, i) => (
            <Leaf key={i}
              className="absolute h-5 w-5 text-emerald-200 nx-leaf-fall"
              style={{ left: `${p.l}%`, top: '0%', animationDelay: `${p.d}s` }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                <Leaf className="h-8 w-8 text-emerald-300" />
              </div>
              <h1 className="text-3xl font-black">Ayurveda Intelligence</h1>
            </div>
            <p className="max-w-2xl text-emerald-100">
              Discover your mind-body constitution (Prakriti) through a 10-question dosha
              quiz, then receive personalized herbal recommendations, daily routine
              (Dinacharya), and Ayurvedic diet guidance — grounded in the BhashaBench-Ayur
              benchmark.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🌬️ Vata</span>
              <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🔥 Pitta</span>
              <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">🌱 Kapha</span>
              <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">📜 14,963 validated Q&amp;A</span>
            </div>
          </div>
          <button onClick={() => setShowDataset(!showDataset)}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-emerald-100 backdrop-blur-md transition-colors hover:bg-white/20">
            <Database className="h-3.5 w-3.5" /> Dataset Info
          </button>
        </div>
      </div>

      {/* ===== DATASET INFO PANEL ===== */}
      {showDataset && (
        <div className="nx-result-pop rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 shadow-premium">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-500 p-2.5 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">{DATASET_INFO.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{DATASET_INFO.description}</p>
              <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                Author: {DATASET_INFO.author} · License: {DATASET_INFO.license}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Questions" value={DATASET_INFO.questions} />
            <Stat label="Exams" value={DATASET_INFO.exams} />
            <Stat label="Domains" value={`${DATASET_INFO.domains}+`} />
            <Stat label="Languages" value={DATASET_INFO.languages} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-600">
            BBA evaluates AI models on Ayurvedic knowledge drawn from authentic government
            examinations and institutional curricula across India. Its purpose: preserve
            traditional medicine knowledge and support evidence-based integration with
            modern healthcare.
          </p>
          <a href={DATASET_INFO.link} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
            <ExternalLink className="h-4 w-4" /> View BhashaBench-Ayur Dataset
          </a>
        </div>
      )}

      {/* ===== STAGE: INTRO ===== */}
      {stage === 'intro' && (
        <>
          {/* Quiz CTA card */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-premium">
            <div className="mb-3 inline-flex rounded-2xl bg-emerald-50 p-4">
              <Sprout className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-xl font-extrabold text-slate-900">Discover Your Dosha</h2>
            <p className="mx-auto mb-5 max-w-xl text-sm text-slate-500">
              Take a 10-question quiz to learn your dominant dosha. Results include
              personalized herbs, daily routine (Dinacharya), and Ayurvedic diet guidance.
            </p>
            <button onClick={startQuiz}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700">
              <Sparkles className="h-4 w-4" /> Start Dosha Quiz
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-[10px] text-slate-400">Takes about 2 minutes · Saved on this device only</p>
          </div>

          {/* Browse doshas directly */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
              <Users className="h-5 w-5 text-emerald-500" /> Or Browse Doshas
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(DOSHA_DATA) as [Dosha, DoshaInfo][]).map(([key, d]) => {
                const Icon = d.icon;
                const active = browseDosha === key;
                return (
                  <button key={key}
                    onClick={() => setBrowseDosha(key)}
                    className={`rounded-2xl border-2 p-4 text-center transition-all ${
                      active ? `${d.bg} ${d.text} ${d.border}` : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}>
                    <Icon className="mx-auto mb-2 h-6 w-6" />
                    <p className="text-sm font-extrabold">{d.name}</p>
                    <p className="text-[10px] font-medium opacity-75">{d.hindi}</p>
                  </button>
                );
              })}
            </div>
            <DoshaSummary dosha={browseDosha} />
          </div>
        </>
      )}

      {/* ===== STAGE: QUIZ ===== */}
      {stage === 'quiz' && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-premium sm:p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {quizIdx + 1} of {QUIZ.length}</span>
              <span>{Math.round(((quizIdx + 1) / QUIZ.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="nx-progress-grow h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${((quizIdx + 1) / QUIZ.length) * 100}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 text-center">
            <div className="mb-3 text-5xl">{QUIZ[quizIdx].emoji}</div>
            <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">{QUIZ[quizIdx].q}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {QUIZ[quizIdx].options.map((opt, i) => {
              const isSelected = answers[quizIdx] === opt.dosha;
              const isAnswered = !!answers[quizIdx];
              const doshaInfo = DOSHA_DATA[opt.dosha];
              return (
                <button key={i}
                  onClick={() => answer(quizIdx, opt.dosha)}
                  disabled={isAnswered}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-sm font-bold transition-all ${
                    isSelected
                      ? `${doshaInfo.bg} ${doshaInfo.border} ${doshaInfo.text}`
                      : isAnswered
                        ? 'border-slate-100 bg-slate-50 text-slate-400'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}>
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    isSelected ? 'bg-white' : 'bg-slate-100'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  {isSelected && <CheckCircle2 className="h-5 w-5" />}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={prev} disabled={quizIdx === 0}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-[10px] text-slate-400">{totalAnswered} of {QUIZ.length} answered</span>
            <button onClick={next} disabled={quizIdx === QUIZ.length - 1}
              className="flex items-center gap-1 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===== STAGE: RESULT ===== */}
      {stage === 'result' && (
        <>
          <DoshaResult
            dosha={primaryDosha}
            secondary={secondaryDosha}
            scores={scores}
            onRetake={() => setStage('intro')}
          />
          <DinacharyaCard dosha={primaryDosha} />
          <DietTipsCard dosha={primaryDosha} />
          <DisclaimerCard />
        </>
      )}
    </div>
  );
};

export default Ayurveda;

// ============================================
// SUB-COMPONENTS
// ============================================
const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-emerald-100 bg-white p-3 text-center">
    <p className="text-xl font-extrabold text-emerald-700">{value}</p>
    <p className="text-[9px] font-bold uppercase text-slate-500">{label}</p>
  </div>
);

/** Compact dosha summary used in "Browse" mode */
const DoshaSummary: React.FC<{ dosha: Dosha }> = ({ dosha }) => {
  const d = DOSHA_DATA[dosha];
  const Icon = d.icon;
  return (
    <div className={`mt-6 ${d.bg} rounded-2xl border ${d.border} p-5`}>
      <h3 className={`mb-3 flex items-center gap-2 text-lg font-extrabold ${d.text}`}>
        <Icon className="h-6 w-6" /> {d.name} Dosha <span className="text-xs font-medium opacity-75">({d.hindi}) · {d.element}</span>
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/70 p-3 backdrop-blur">
          <p className="mb-2 text-xs font-bold text-slate-700">Key Qualities</p>
          <div className="flex flex-wrap gap-1.5">
            {d.qualities.map(q => (
              <span key={q} className={`${d.text} rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold`}>{q}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white/70 p-3 backdrop-blur">
          <p className="mb-2 text-xs font-bold text-slate-700">When Balanced</p>
          <ul className="space-y-1">
            {d.balanced.slice(0, 4).map(b => (
              <li key={b} className="flex items-start gap-1.5 text-xs text-slate-700">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/** Full dosha result screen */
const DoshaResult: React.FC<{
  dosha: Dosha;
  secondary: Dosha | null;
  scores: Record<Dosha, number>;
  onRetake: () => void;
}> = ({ dosha, secondary, scores, onRetake }) => {
  const d = DOSHA_DATA[dosha];
  const Icon = d.icon;
  const total = scores.vata + scores.pitta + scores.kapha;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <>
      {/* Result hero */}
      <div className="nx-result-pop relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-premium sm:p-8">
        <div className={`absolute right-0 top-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-gradient-to-br ${d.gradient} opacity-15 blur-2xl nx-aura-pulse`} />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Your Prakriti Result</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${d.gradient} text-2xl text-white shadow-lg`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900">
                {d.name} <span className="text-slate-400">·</span> {d.hindi}
              </h2>
              <p className="text-sm text-slate-500">Element: {d.element}</p>
            </div>
            <button onClick={onRetake}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200">
              <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
            </button>
          </div>

          {/* Score bars */}
          <div className="mt-5 space-y-2">
            {(Object.entries(scores) as [Dosha, number][]).sort((a, b) => b[1] - a[1]).map(([k, n]) => {
              const info = DOSHA_DATA[k];
              const p = pct(n);
              const isPrimary = k === dosha;
              return (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                    <span className={isPrimary ? info.text : 'text-slate-500'}>
                      {info.emoji} {info.name}{isPrimary && ' ✓'}
                    </span>
                    <span className="text-slate-400">{p}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`nx-progress-grow h-full rounded-full bg-gradient-to-r ${info.gradient}`}
                      style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {secondary && (
            <p className="mt-3 text-[11px] text-slate-500">
              Your secondary dosha is <strong className={DOSHA_DATA[secondary].text}>{DOSHA_DATA[secondary].name}</strong> — a
              dual constitution ({dosha}-{secondary}).
            </p>
          )}
        </div>
      </div>

      {/* Characteristics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Qualities + Body */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
            <Info className="h-5 w-5 text-emerald-500" /> Characteristics
          </h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Key Qualities</p>
              <div className="flex flex-wrap gap-1.5">
                {d.qualities.map(q => (
                  <span key={q} className={`${d.bg} ${d.text} rounded-full border ${d.border} px-2.5 py-1 text-xs font-bold`}>{q}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Physical Traits</p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {d.bodyTraits.map(t => (
                  <div key={t} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Balanced / Imbalanced */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> When Balanced
            </p>
            <ul className="space-y-1.5">
              {d.balanced.map(b => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <span className="text-emerald-500">🌿</span> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4" /> When Imbalanced
            </p>
            <ul className="space-y-1.5">
              {d.imbalanced.map(im => (
                <li key={im} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <span className="text-rose-500">⚠</span> {im}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Herbal recommendations */}
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-emerald-50 to-teal-50 p-6 shadow-premium">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <Sparkles className="h-5 w-5 text-violet-500" /> Herbal Recommendations for {d.name}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.herbs.map(h => (
            <div key={h.name} className="nx-result-pop rounded-2xl border border-violet-100 bg-white/80 p-4 backdrop-blur">
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-violet-100 p-1.5 text-violet-600">
                  <Sprout className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-extrabold text-slate-800">{h.name}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">{h.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/** Dinacharya (daily routine) card */
const DinacharyaCard: React.FC<{ dosha: Dosha }> = ({ dosha }) => {
  const d = DOSHA_DATA[dosha];
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
      <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-800">
        <Sun className="h-5 w-5 text-amber-500" /> Dinacharya — Daily Routine for {d.name}
      </h3>
      <p className="mb-5 text-xs text-slate-500">
        A dosha-specific daily rhythm aligns your body with nature's clock (कालचक्र) for
        optimal energy, digestion, and rest.
      </p>
      <div className="relative space-y-3 pl-4">
        {/* Vertical timeline line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-200 via-teal-200 to-violet-200" />
        {d.dinacharya.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="relative flex items-start gap-3">
              <div className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${d.gradient} text-white shadow-sm`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="ml-5 flex-1 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{item.time}</span>
                  <span className="text-[10px] text-slate-400">Step {i + 1}</span>
                </div>
                <p className="mt-0.5 text-sm font-bold text-slate-800">{item.activity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Ayurvedic diet tips card */
const DietTipsCard: React.FC<{ dosha: Dosha }> = ({ dosha }) => {
  const d = DOSHA_DATA[dosha];
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
      <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-800">
        <Soup className="h-5 w-5 text-emerald-500" /> Ayurvedic Diet for {d.name}
      </h3>
      <p className="mb-5 text-xs text-slate-500">
        Food is medicine (आहारम् औषधम्). Eat for your constitution to keep your dosha balanced.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Favour These
          </p>
          <div className="flex flex-wrap gap-1.5">
            {d.foods.map(f => (
              <span key={f} className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                🌿 {f}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-rose-700">
            <AlertCircle className="h-4 w-4" /> Reduce or Avoid
          </p>
          <div className="flex flex-wrap gap-1.5">
            {d.avoid.map(f => (
              <span key={f} className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-bold text-rose-700">
                ⚠ {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3">
        <Quote className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
        <p className="text-[11px] italic leading-relaxed text-amber-900">
          &ldquo;When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.&rdquo;
          <span className="block mt-1 not-italic font-bold text-amber-700">— Ayurvedic proverb</span>
        </p>
      </div>
    </div>
  );
};

/** Disclaimer card */
const DisclaimerCard: React.FC = () => (
  <div className="flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
    <p className="text-[11px] leading-relaxed text-amber-800">
      <strong>Disclaimer:</strong> Ayurvedic guidance here is educational, drawn from
      traditional texts and the BhashaBench-Ayur benchmark. It is not a substitute for
      professional medical advice. Always consult a qualified Ayurvedic practitioner
      (BAMS / MD Ayurveda) before starting herbs or treatments — especially if you have
      existing health conditions or take medications.
    </p>
  </div>
);
