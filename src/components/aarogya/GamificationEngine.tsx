'use client';

/**
 * GamificationEngine — Coins, levels, achievements, streaks.
 *
 * Makes health addictive by rewarding every healthy action.
 * - Aarogya Health Coins for every positive action
 * - 5-level progression system
 * - 30+ achievements to unlock
 * - Streak system with freeze protection
 * - Community challenges
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Star, Flame, Zap, Crown, Shield, Award, Target,
  TrendingUp, Lock, CheckCircle2, Gift, Coins, ChevronRight
} from 'lucide-react';

const LEVELS = [
  { level: 1, name: 'Health Seeker', minCoins: 0, icon: Target, color: 'from-slate-400 to-slate-500', textColor: 'text-slate-600' },
  { level: 2, name: 'Wellness Warrior', minCoins: 500, icon: Shield, color: 'from-emerald-400 to-teal-500', textColor: 'text-emerald-600' },
  { level: 3, name: 'Vitality Champion', minCoins: 1500, icon: Award, color: 'from-amber-400 to-orange-500', textColor: 'text-amber-600' },
  { level: 4, name: 'Health Guardian', minCoins: 3000, icon: Crown, color: 'from-violet-400 to-purple-500', textColor: 'text-violet-600' },
  { level: 5, name: 'Aarogya Health Master', minCoins: 6000, icon: Trophy, color: 'from-rose-400 to-pink-500', textColor: 'text-rose-600' },
];

const ACHIEVEMENTS = [
  { id: 'first_lab', name: 'First Lab Report', desc: 'Upload your first lab report', icon: '🧪', coins: 50, unlocked: false },
  { id: 'sugar_warrior', name: 'Sugar Warrior', desc: '30 days controlled glucose', icon: '🩸', coins: 200, unlocked: false },
  { id: 'steps_legend', name: 'Steps Legend', desc: '10,000 steps for 7 days', icon: '👣', coins: 150, unlocked: false },
  { id: 'med_master', name: 'Medicine Master', desc: '30 days no missed dose', icon: '💊', coins: 200, unlocked: false },
  { id: 'sleep_champ', name: 'Sleep Champion', desc: '7 nights good sleep', icon: '😴', coins: 100, unlocked: false },
  { id: 'family_protector', name: 'Family Protector', desc: 'Added 3 family members', icon: '👨‍👩‍👧', coins: 150, unlocked: false },
  { id: 'first_consult', name: 'First Consultation', desc: 'Complete first doctor consult', icon: '👨‍⚕️', coins: 100, unlocked: false },
  { id: 'symptom_check', name: 'Health Aware', desc: 'First symptom check', icon: '🩺', coins: 50, unlocked: false },
  { id: 'xray_scan', name: 'X-Ray Explorer', desc: 'First X-ray analysis', icon: '🩻', coins: 75, unlocked: false },
  { id: 'skin_scan', name: 'Skin Detective', desc: 'First skin analysis', icon: '🔬', coins: 75, unlocked: false },
  { id: 'diet_plan', name: 'Nutrition Planner', desc: 'Generated first diet plan', icon: '🥗', coins: 100, unlocked: false },
  { id: 'meditation', name: 'Zen Master', desc: '10 meditation sessions', icon: '🧘', coins: 150, unlocked: false },
  { id: 'water_30', name: 'Hydration Hero', desc: '3L water for 30 days', icon: '💧', coins: 200, unlocked: false },
  { id: 'early_bird', name: 'Early Bird', desc: '7 days morning check-in', icon: '🌅', coins: 100, unlocked: false },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak', icon: '🔥', coins: 100, unlocked: false },
  { id: 'streak_30', name: 'Month Master', desc: '30-day streak', icon: '⚡', coins: 300, unlocked: false },
  { id: 'streak_100', name: 'Centurion', desc: '100-day streak', icon: '👑', coins: 500, unlocked: false },
  { id: 'all_challenge', name: 'Challenge Champion', desc: 'Complete all daily challenges', icon: '🏆', coins: 250, unlocked: false },
  { id: 'emergency_ready', name: 'Safety First', desc: 'Set up emergency contacts', icon: '🚨', coins: 100, unlocked: false },
  { id: 'voice_user', name: 'Voice Pioneer', desc: 'Use voice assistant', icon: '🎤', coins: 75, unlocked: false },
];

const COMMUNITY_CHALLENGES = [
  { id: 'mumbai-walks', name: 'Mumbai Walks Together', goal: 10000000, current: 7234567, unit: 'steps', participants: 12453, city: 'Mumbai' },
  { id: 'delhi-diabetes', name: 'Delhi Diabetes Challenge', goal: 1000, current: 678, unit: 'users', participants: 678, city: 'Delhi' },
  { id: 'bangalore-hyd', name: 'Bengaluru Hydration Challenge', goal: 100000, current: 45234, unit: 'liters', participants: 8921, city: 'Bengaluru' },
];

export const GamificationEngine: React.FC = () => {
  const [coins, setCoins] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aarogya_coins') || '320');
    }
    return 320;
  });

  const [streak, setStreak] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aarogya_streak') || '7');
    }
    return 7;
  });

  const [longestStreak, setLongestStreak] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('aarogya_longest_streak') || '12');
    }
    return 12;
  });

  const [streakFreezes, setStreakFreezes] = useState(3);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_achievements');
      if (saved) { try { return new Set(JSON.parse(saved)); } catch {} }
    }
    return new Set(['symptom_check', 'first_lab', 'streak_7', 'voice_user']);
  });

  useEffect(() => {
    localStorage.setItem('aarogya_coins', String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('aarogya_streak', String(streak));
    if (streak > longestStreak) {
      setLongestStreak(streak);
      localStorage.setItem('aarogya_longest_streak', String(streak));
    }
  }, [streak, longestStreak]);

  useEffect(() => {
    localStorage.setItem('aarogya_achievements', JSON.stringify([...unlockedAchievements]));
  }, [unlockedAchievements]);

  const currentLevel = useMemo(() => {
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (coins >= l.minCoins) level = l;
    }
    return level;
  }, [coins]);

  const nextLevel = useMemo(() => {
    return LEVELS.find(l => l.level === currentLevel.level + 1) || null;
  }, [currentLevel]);

  const levelProgress = nextLevel
    ? Math.round(((coins - currentLevel.minCoins) / (nextLevel.minCoins - currentLevel.minCoins)) * 100)
    : 100;

  const earnedAchievements = ACHIEVEMENTS.filter(a => unlockedAchievements.has(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !unlockedAchievements.has(a.id));

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.has(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        setUnlockedAchievements(prev => new Set([...prev, id]));
        setCoins(c => c + ach.coins);
      }
    }
  };

  const addCoins = (amount: number) => setCoins(c => c + amount);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Health Gamification</h1>
              <p className="text-orange-50/90 text-sm mt-1">Earn coins · Level up · Unlock achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5" />
                <span className="text-2xl font-extrabold">{coins.toLocaleString()}</span>
              </div>
              <div className="text-[9px] font-bold uppercase opacity-80">Health Coins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentLevel.color} text-white shadow-lg`}>
              <currentLevel.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Current Level {currentLevel.level}</div>
              <div className={`text-lg font-extrabold ${currentLevel.textColor}`}>{currentLevel.name}</div>
            </div>
          </div>
          {nextLevel && (
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400">Next: {nextLevel.name}</div>
              <div className="text-sm font-bold text-slate-700">{nextLevel.minCoins - coins} coins to go</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentLevel.color} rounded-full transition-all duration-1000`}
            style={{ width: `${levelProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-white drop-shadow">{levelProgress}%</span>
          </div>
        </div>

        {/* Level badges */}
        <div className="flex items-center justify-between mt-4">
          {LEVELS.map(l => {
            const reached = coins >= l.minCoins;
            return (
              <div key={l.level} className="text-center flex-1">
                <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  reached ? `bg-gradient-to-br ${l.color} text-white shadow-md` : 'bg-slate-100 text-slate-300'
                }`}>
                  {reached ? <l.icon className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                </div>
                <div className={`text-[8px] font-bold ${reached ? l.textColor : 'text-slate-300'}`}>L{l.level}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak + Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <Flame className="w-6 h-6 mx-auto mb-1 text-orange-500" />
          <div className="text-2xl font-extrabold text-orange-600">{streak}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Day Streak</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <TrendingUp className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
          <div className="text-2xl font-extrabold text-emerald-600">{longestStreak}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Best Streak</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <Shield className="w-6 h-6 mx-auto mb-1 text-cyan-500" />
          <div className="text-2xl font-extrabold text-cyan-600">{streakFreezes}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Streak Freezes</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Achievements
          </h2>
          <span className="text-xs font-bold text-slate-400">{earnedAchievements.length}/{ACHIEVEMENTS.length} unlocked</span>
        </div>

        {earnedAchievements.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">✓ Unlocked</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {earnedAchievements.map(ach => (
                <div key={ach.id} className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-[10px] font-bold text-slate-700 leading-tight">{ach.name}</div>
                  <div className="text-[9px] text-emerald-600 font-bold mt-1">+{ach.coins} coins</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">🔒 Locked</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {lockedAchievements.slice(0, 12).map(ach => (
            <div key={ach.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center opacity-60">
              <div className="text-2xl mb-1 grayscale">{ach.icon}</div>
              <div className="text-[10px] font-bold text-slate-500 leading-tight">{ach.name}</div>
              <div className="text-[9px] text-slate-400 mt-1">{ach.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Challenges */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-violet-500" /> Community Challenges
        </h2>
        <div className="space-y-3">
          {COMMUNITY_CHALLENGES.map(ch => {
            const progress = Math.round((ch.current / ch.goal) * 100);
            return (
              <div key={ch.id} className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{ch.name}</div>
                    <div className="text-[10px] text-slate-500">{ch.participants.toLocaleString()} participants · {ch.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-violet-600">{progress}%</div>
                  </div>
                </div>
                <div className="h-2 bg-violet-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{ch.current.toLocaleString()} {ch.unit}</span>
                  <span>{ch.goal.toLocaleString()} {ch.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earn Coins Demo */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Quick Coin Earners
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Log Vitals', coins: 10, icon: '💓' },
            { label: 'Take Medicine', coins: 20, icon: '💊' },
            { label: 'Walk 8K Steps', coins: 30, icon: '👣' },
            { label: 'Log Healthy Meal', coins: 25, icon: '🥗' },
            { label: 'Complete Challenge', coins: 50, icon: '🏆' },
            { label: 'Doctor Visit', coins: 100, icon: '👨‍⚕️' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => addCoins(action.coins)}
              className="p-3 bg-slate-50 hover:bg-amber-50 rounded-2xl text-center transition-colors group"
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="text-[11px] font-bold text-slate-700">{action.label}</div>
              <div className="text-[10px] font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
                <Coins className="w-2.5 h-2.5" /> +{action.coins}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationEngine;
