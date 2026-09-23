'use client';

// ============================================
// AAROGYA AI — CLINICAL ASSESSMENT COMPONENT
//
// Interactive PHQ-9 (depression) + GAD-7 (anxiety) screening.
//
// Flow:
//   1. Choice screen  → user picks Depression Check or Anxiety Check
//   2. Question flow   → one question at a time, 4 answer buttons
//   3. Result screen   → severity badge, color theme, recommendation
//                        + crisis resources if score is high OR
//                        Q9 (suicidal ideation) flag is set.
//
// Accessibility:
//   • All buttons keyboard-focusable, Enter activates.
//   • Progress indicator with aria-valuenow.
//   • Crisis resources prominently displayed, never hidden.
//
// Safety:
//   • This is a screening tool, NOT a diagnosis.
//   • Q9 non-zero → crisis resources always shown.
//   • Disclaimer always visible on result screen.
// ============================================

import * as React from 'react';
import {
  HeartPulse,
  Brain,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Phone,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  ANSWER_OPTIONS,
  interpretPHQ9,
  interpretGAD7,
  hasSuicidalIdeationFlag,
  computeScore,
  type AssessmentInterpretation,
  type CrisisResource,
} from '@/lib/mental-health/assessments';

type AssessmentType = 'phq9' | 'gad7';
type Screen = 'choice' | 'questions' | 'result';

interface ClinicalAssessmentProps {
  /** Optional callback when an assessment completes (score, type, interpretation). */
  onComplete?: (info: {
    type: AssessmentType;
    score: number;
    interpretation: AssessmentInterpretation;
  }) => void;
}

const COLOR_THEME: Record<
  string,
  { badge: string; ring: string; text: string; bg: string; bar: string }
> = {
  emerald: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    ring: 'ring-emerald-400',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    bar: 'bg-emerald-500',
  },
  teal: {
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    ring: 'ring-teal-400',
    text: 'text-teal-700',
    bg: 'bg-teal-50',
    bar: 'bg-teal-500',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    ring: 'ring-amber-400',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    bar: 'bg-amber-500',
  },
  orange: {
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    ring: 'ring-orange-400',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    bar: 'bg-orange-500',
  },
  red: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    ring: 'ring-red-400',
    text: 'text-red-700',
    bg: 'bg-red-50',
    bar: 'bg-red-500',
  },
};

export function ClinicalAssessment({ onComplete }: ClinicalAssessmentProps) {
  const [screen, setScreen] = React.useState<Screen>('choice');
  const [type, setType] = React.useState<AssessmentType>('phq9');
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);

  const questions = type === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const total = questions.length;
  const progressPct = Math.round((currentIdx / total) * 100);

  const startAssessment = (t: AssessmentType) => {
    setType(t);
    setAnswers(new Array(t === 'phq9' ? 9 : 7).fill(0));
    setCurrentIdx(0);
    setScreen('questions');
  };

  const selectAnswer = (value: number) => {
    const next = [...answers];
    next[currentIdx] = value;
    setAnswers(next);

    if (currentIdx + 1 < total) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const score = computeScore(next);
      const interpretation =
        type === 'phq9' ? interpretPHQ9(score) : interpretGAD7(score);

      // Override: PHQ-9 Q9 non-zero → always show crisis resources.
      if (type === 'phq9' && hasSuicidalIdeationFlag(next)) {
        interpretation.showCrisisResources = true;
        interpretation.crisisResources = interpretation.crisisResources ?? [
          {
            name: 'iCall (TISS)',
            phone: '9152987821',
            hours: 'Mon–Sat, 8 AM – 10 PM',
          },
        ];
      }

      onComplete?.({ type, score, interpretation });
      setScreen('result');
    }
  };

  const goBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    else setScreen('choice');
  };

  const reset = () => {
    setScreen('choice');
    setCurrentIdx(0);
    setAnswers([]);
  };

  // ---------- CHOICE SCREEN ----------
  if (screen === 'choice') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Clinical Screening Tool
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Mental Health Check-In
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Choose a validated screening questionnaire. Your answers are
            processed locally in your browser and never uploaded unless you
            explicitly share them with your clinician.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => startAssessment('phq9')}
            className="group text-left p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all bg-white shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Depression Check
            </h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              PHQ-9 · 9 questions · ~3 minutes
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Screens for depression severity over the past 2 weeks using the
              Patient Health Questionnaire-9.
            </p>
            <span className="inline-flex items-center gap-1 text-emerald-700 text-sm font-semibold group-hover:gap-2 transition-all">
              Start assessment <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => startAssessment('gad7')}
            className="group text-left p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 transition-all bg-white shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Anxiety Check
            </h3>
            <p className="text-xs text-slate-500 mb-3 font-medium">
              GAD-7 · 7 questions · ~2 minutes
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Screens for generalized anxiety severity over the past 2 weeks
              using the validated GAD-7 instrument.
            </p>
            <span className="inline-flex items-center gap-1 text-teal-700 text-sm font-semibold group-hover:gap-2 transition-all">
              Start assessment <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6 max-w-xl mx-auto">
          These tools are validated screening instruments — not diagnostic
          tools. Results should be interpreted by a qualified mental-health
          professional.
        </p>
      </div>
    );
  }

  // ---------- QUESTIONS SCREEN ----------
  if (screen === 'questions') {
    const question = questions[currentIdx];
    const isCriticalQ9 = type === 'phq9' && currentIdx === 8;
    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {type === 'phq9' ? 'PHQ-9 · Depression' : 'GAD-7 · Anxiety'}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {currentIdx + 1} / {total}
            </span>
          </div>
          <div
            className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">
            Over the last 2 weeks, how often have you been bothered by:
          </p>
          <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-snug">
            {question}
            {isCriticalQ9 && (
              <span className="block mt-2 text-xs font-medium text-red-600">
                If you are in immediate danger, please call 112 (India) or go
                to your nearest emergency room.
              </span>
            )}
          </h3>

          <div className="grid gap-2">
            {ANSWER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-800">{opt.label}</span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-600 font-semibold">
                  {opt.value === 0
                    ? '0–1 days'
                    : opt.value === 1
                      ? '2–6 days'
                      : opt.value === 2
                        ? '7–10 days'
                        : '11–14 days'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentIdx === 0 ? 'Change assessment' : 'Previous'}
            </button>
            <span className="text-xs text-slate-400">
              Tap an answer to continue
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESULT SCREEN ----------
  const score = computeScore(answers);
  const interpretation =
    type === 'phq9' ? interpretPHQ9(score) : interpretGAD7(score);

  // Re-apply Q9 override on result render (idempotent).
  if (type === 'phq9' && hasSuicidalIdeationFlag(answers)) {
    interpretation.showCrisisResources = true;
    interpretation.crisisResources = interpretation.crisisResources ?? [
      {
        name: 'iCall (TISS)',
        phone: '9152987821',
        hours: 'Mon–Sat, 8 AM – 10 PM',
      },
    ];
  }

  const theme =
    COLOR_THEME[interpretation.color] ?? COLOR_THEME.emerald;
  const maxScore = type === 'phq9' ? 27 : 21;
  const scorePct = Math.round((score / maxScore) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`rounded-2xl border-2 ${theme.bg} p-6 sm:p-8 shadow-sm`}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-slate-600 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Complete
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
            {type === 'phq9' ? 'PHQ-9 · Depression' : 'GAD-7 · Anxiety'}
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className={`text-5xl font-bold ${theme.text}`}>{score}</span>
            <span className="text-lg text-slate-500 font-medium">
              / {maxScore}
            </span>
          </div>
          <div
            className={`inline-block px-4 py-1.5 rounded-full border ${theme.badge} text-sm font-bold`}
          >
            {interpretation.severity}
          </div>
        </div>

        {/* Score visualization */}
        <div className="mb-6">
          <div className="h-2.5 w-full bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bar} transition-all duration-500`}
              style={{ width: `${scorePct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
            <span>0</span>
            <span>Mid-range</span>
            <span>{maxScore}</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-white/70 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-slate-600" /> Recommendation
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {interpretation.recommendation}
          </p>
        </div>

        {/* Crisis resources */}
        {interpretation.showCrisisResources &&
          interpretation.crisisResources &&
          interpretation.crisisResources.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    You are not alone — please reach out
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Trained counsellors are available right now. Calls are free
                    and confidential.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {interpretation.crisisResources.map(
                  (r: CrisisResource) => (
                    <a
                      key={r.name}
                      href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg border border-red-200 hover:border-red-400 hover:bg-red-50 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {r.name}
                          </p>
                          <p className="text-xs text-slate-500">{r.hours}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-red-700">
                        {r.phone}
                      </span>
                    </a>
                  ),
                )}
              </div>
            </div>
          )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> This is a validated{' '}
            <em>screening</em> instrument, not a diagnosis. Only a qualified
            mental-health professional can diagnose and treat mental-health
            conditions. In a life-threatening emergency, call{' '}
            <strong>112</strong> (India) immediately.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClinicalAssessment;
