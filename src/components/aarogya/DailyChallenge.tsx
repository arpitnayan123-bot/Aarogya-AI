'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy, CheckCircle2, Circle, Flame, Star, Zap,
  Target, Droplets, Footprints, Moon, Apple, Brain, Sparkles
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  points: number;
  category: 'hydration' | 'activity' | 'nutrition' | 'mindfulness' | 'sleep';
}

const CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Drink 3L Water', description: 'Stay hydrated throughout the day', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50', points: 20, category: 'hydration' },
  { id: 'c2', title: 'Walk 8000 Steps', description: 'Take a brisk walk after meals', icon: Footprints, color: 'text-emerald-600', bg: 'bg-emerald-50', points: 25, category: 'activity' },
  { id: 'c3', title: 'Eat 5 Colors', description: 'Fruits & vegetables of 5 different colors', icon: Apple, color: 'text-rose-600', bg: 'bg-rose-50', points: 20, category: 'nutrition' },
  { id: 'c4', title: '10-min Meditation', description: 'Practice mindfulness breathing', icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50', points: 15, category: 'mindfulness' },
  { id: 'c5', title: 'Sleep by 11 PM', description: 'Get 7-9 hours of quality sleep', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', points: 20, category: 'sleep' },
  { id: 'c6', title: 'No Sugar Today', description: 'Avoid added sugars for 24 hours', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', points: 15, category: 'nutrition' },
  { id: 'c7', title: '30-min Yoga', description: 'Practice Surya Namaskar or asanas', icon: Sparkles, color: 'text-teal-600', bg: 'bg-teal-50', points: 20, category: 'activity' },
  { id: 'c8', title: 'Digital Detox', description: '1 hour screen-free before bed', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', points: 15, category: 'mindfulness' },
];

export const DailyChallenge: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const saved = localStorage.getItem(`aarogya_challenges_${today}`);
      if (saved) { try { return new Set(JSON.parse(saved)); } catch {} }
    }
    return new Set();
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aarogya_challenge_streak') || '0');
    }
    return 0;
  });

  const today = new Date().toDateString();

  useEffect(() => {
    localStorage.setItem(`aarogya_challenges_${today}`, JSON.stringify([...completed]));
  }, [completed, today]);

  useEffect(() => {
    localStorage.setItem('aarogya_challenge_streak', String(streak));
  }, [streak]);

  const toggleChallenge = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      // Update streak if all challenges completed
      if (next.size === CHALLENGES.length && !completed.has(id)) {
        const lastComplete = localStorage.getItem('aarogya_last_complete_date');
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastComplete === yesterday) {
          setStreak(s => s + 1);
        } else if (lastComplete !== today) {
          setStreak(1);
        }
        localStorage.setItem('aarogya_last_complete_date', today);
      }
      return next;
    });
  };

  const totalPoints = CHALLENGES.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = CHALLENGES.filter(c => completed.has(c.id)).reduce((sum, c) => sum + c.points, 0);
  const progressPct = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-xl">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900">Daily Health Challenge</h2>
            <p className="text-xs text-slate-400">Complete tasks to earn points</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-extrabold text-orange-600">{streak}</span>
            <span className="text-[10px] font-bold text-orange-400">day streak</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">Today's Progress</span>
          <span className="text-sm font-extrabold text-emerald-600">{earnedPoints}/{totalPoints} pts</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPct}%` }}
          >
            {progressPct > 0 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
        </div>
        <div className="text-right mt-1">
          <span className="text-[10px] font-bold text-slate-400">{progressPct}% complete</span>
        </div>
      </div>

      {/* Challenge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CHALLENGES.map(challenge => {
          const isDone = completed.has(challenge.id);
          const Icon = challenge.icon;
          return (
            <button
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                isDone
                  ? 'bg-emerald-50 border-2 border-emerald-200'
                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl ${isDone ? 'bg-emerald-100' : challenge.bg} flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${isDone ? 'text-emerald-600' : challenge.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${isDone ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {challenge.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{challenge.description}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-bold ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                  +{challenge.points}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion celebration */}
      {completed.size === CHALLENGES.length && (
        <div className="mt-4 p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white text-center animate-fadeInScale">
          <Star className="w-8 h-8 mx-auto mb-2 fill-white" />
          <div className="font-extrabold text-lg">All Challenges Complete!</div>
          <div className="text-sm opacity-90">You earned {totalPoints} points today. Keep the streak going!</div>
        </div>
      )}

      {/* Motivational message */}
      {completed.size > 0 && completed.size < CHALLENGES.length && (
        <div className="mt-3 p-3 bg-emerald-50 rounded-xl text-center">
          <p className="text-xs text-emerald-700 font-medium">
            {completed.size === 1 ? "Great start! " : completed.size < 4 ? "Keep going! " : "Almost there! "}
            {CHALLENGES.length - completed.size} more to complete all challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;
