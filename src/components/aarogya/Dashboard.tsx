'use client';

/**
 * Dashboard — Premium redesigned health vitals hub for Aarogya AI.
 *
 * Design philosophy:
 *   - Glassmorphism with depth layering
 *   - Animated gradient mesh background (emerald/teal/violet)
 *   - Live health score ring with animated counter
 *   - Floating particle network
 *   - Bento grid with hover-reveal glow
 *   - Premium micro-interactions (scale, glow, shimmer)
 *   - Medical-grade color palette (emerald primary, accents)
 *
 * Features kept intact:
 *   - DNABackground ambient layer
 *   - Anatomical heart HUD (RotatingSkeletonHUD)
 *   - Daily Health Challenge
 *   - Core Features bento grid
 *   - Trust & values strip
 *   - Navigation via onNavigate
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, Brain, Droplets, FileText,
  Globe, HeartPulse, MessageCircle, ScanLine, ShieldCheck,
  TrendingUp, Zap, Sparkles, Bell, Plus, Flame, Target,
  Moon, Footprints, Apple, Database,
} from 'lucide-react';
import DNABackground from './DNABackground';
import { DailyChallenge } from './DailyChallenge';

export interface DashboardProps {
  onNavigate: (tab: string) => void;
}

/* ============================================================
   PREMIUM 3D HEART VISUALIZATION
   Next-level anatomical heart with:
   - Realistic beating rhythm (lub-dub)
   - Pulsing ECG waveform overlay
   - Blood flow particles through arteries
   - Expanding aura rings
   - Holographic scan line
   - 3D perspective rotation
   - Chamber glow synchronization
   ============================================================ */

interface RotatingSkeletonHUDProps {
  isUserActive?: boolean;
}

const RotatingSkeletonHUD: React.FC<RotatingSkeletonHUDProps> = ({ isUserActive = false }) => {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48 [perspective:1200px]">
      {/* ===== Layer 1: Expanding aura rings ===== */}
      {[0, 1, 2].map(i => (
        <div
          key={`aura-${i}`}
          className="absolute rounded-full border border-emerald-400/20"
          style={{
            width: '100px',
            height: '100px',
            animation: `nxAuraExpand 3s ease-out infinite`,
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}

      {/* ===== Layer 2: Holographic scan line ===== */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          style={{ animation: 'nxScanLine 3s ease-in-out infinite', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}
        />
      </div>

      {/* ===== Layer 3: Orbital rings ===== */}
      <div className="nx-orbit absolute inset-0" style={{ animationDuration: '12s' }}>
        <svg viewBox="0 0 160 160" className="h-full w-full">
          <defs>
            <linearGradient id="nx-ring-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="75" fill="none" stroke="url(#nx-ring-grad-1)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.5" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" strokeDasharray="20 120" strokeLinecap="round" />
          {/* Dots on ring */}
          {[0, 90, 180, 270].map(angle => {
            const rad = (angle * Math.PI) / 180;
            return <circle key={angle} cx={80 + 75 * Math.cos(rad)} cy={80 + 75 * Math.sin(rad)} r="2" fill="#06b6d4" opacity="0.6" />;
          })}
        </svg>
      </div>

      <div className="nx-orbit-counter absolute inset-5" style={{ animationDuration: '16s' }}>
        <svg viewBox="0 0 130 130" className="h-full w-full">
          <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="3 10" />
          <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1.5" strokeDasharray="8 80" strokeLinecap="round" />
        </svg>
      </div>

      {/* ===== Layer 4: 3D Heart with realistic beat ===== */}
      <div className={`relative ${isUserActive ? 'nx-heart-flip' : 'nx-heart-3d-rotate'}`}>
        <div className="nx-heart-beat relative" style={{ transformStyle: 'preserve-3d' }}>
          <svg viewBox="0 0 120 120" className="h-24 w-24 sm:h-28 sm:w-28">
            <defs>
              {/* Heart muscle gradient — deep red to bright */}
              <radialGradient id="nx-heart-muscle" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="30%" stopColor="#ef4444" />
                <stop offset="70%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              {/* Artery gradient */}
              <linearGradient id="nx-artery-flow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.4" />
              </linearGradient>
              {/* Vein gradient */}
              <linearGradient id="nx-vein-flow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="nx-heart-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Inner shadow */}
              <radialGradient id="nx-heart-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
              </radialGradient>
            </defs>

            {/* ===== Heart shape — anatomically inspired ===== */}
            <g filter="url(#nx-heart-glow)">
              {/* Left atrium (top-left chamber) */}
              <ellipse cx="42" cy="40" rx="16" ry="14" fill="url(#nx-heart-muscle)" opacity="0.9" />
              {/* Right atrium (top-right chamber) */}
              <ellipse cx="78" cy="40" rx="16" ry="14" fill="url(#nx-heart-muscle)" opacity="0.9" />

              {/* Main heart body (ventricles) */}
              <path
                d="M26 42 Q20 60 30 80 Q42 95 60 98 Q78 95 90 80 Q100 60 94 42 Q78 48 60 48 Q42 48 26 42 Z"
                fill="url(#nx-heart-muscle)"
              />

              {/* Inner shadow for depth */}
              <path
                d="M26 42 Q20 60 30 80 Q42 95 60 98 Q78 95 90 80 Q100 60 94 42 Q78 48 60 48 Q42 48 26 42 Z"
                fill="url(#nx-heart-shadow)"
              />

              {/* Septum (divider line) */}
              <path d="M60 48 Q58 70 60 95" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />

              {/* Coronary arteries — left */}
              <path d="M60 50 Q50 65 42 80 Q38 88 35 92" fill="none" stroke="url(#nx-artery-flow)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M60 50 Q52 60 48 72" fill="none" stroke="url(#nx-artery-flow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Coronary arteries — right */}
              <path d="M60 50 Q70 65 78 80 Q82 88 85 92" fill="none" stroke="url(#nx-artery-flow)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M60 50 Q68 60 72 72" fill="none" stroke="url(#nx-artery-flow)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Aorta (top arch) */}
              <path d="M60 28 Q58 18 65 12 Q72 8 78 15" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

              {/* Pulmonary artery */}
              <path d="M52 28 Q48 20 42 18" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

              {/* Superior vena cava */}
              <path d="M72 28 Q76 20 80 16" fill="none" stroke="url(#nx-vein-flow)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

              {/* Specular highlights — glossy 3D effect */}
              <ellipse cx="42" cy="34" rx="6" ry="4" fill="white" opacity="0.35" transform="rotate(-20 42 34)" />
              <ellipse cx="78" cy="34" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(20 78 34)" />
              <ellipse cx="50" cy="60" rx="4" ry="8" fill="white" opacity="0.15" transform="rotate(-15 50 60)" />
            </g>

            {/* ===== Blood flow particles (animated) ===== */}
            <circle r="1.5" fill="#fca5a5" opacity="0.8">
              <animateMotion dur="2s" repeatCount="indefinite" path="M60 50 Q50 65 42 80 Q38 88 35 92" />
            </circle>
            <circle r="1" fill="#fbbf24" opacity="0.6">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M60 50 Q70 65 78 80 Q82 88 85 92" />
            </circle>
            <circle r="1.2" fill="#f87171" opacity="0.7">
              <animateMotion dur="1.8s" repeatCount="indefinite" path="M60 28 Q58 18 65 12 Q72 8 78 15" />
            </circle>
          </svg>

          {/* ===== Chamber pulse glow ===== */}
          <div
            className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
            style={{ animation: 'nxChamberPulse 0.833s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* ===== Layer 5: Orbiting data particles ===== */}
      <div className="nx-data-stream absolute h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)]" style={{ animationDelay: '0s' }} />
      <div className="nx-data-stream absolute h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" style={{ animationDelay: '1.7s' }} />
      <div className="nx-data-stream absolute h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)]" style={{ animationDelay: '3.4s' }} />
      <div className="nx-data-stream absolute h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]" style={{ animationDelay: '2.5s' }} />

      {/* ===== Layer 6: ECG waveform overlay ===== */}
      <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 opacity-60" viewBox="0 0 120 30">
        <defs>
          <linearGradient id="nx-ecg-overlay" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 15 L30 15 L35 15 L38 8 L42 22 L46 5 L50 15 L120 15"
          fill="none"
          stroke="url(#nx-ecg-overlay)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'nxEcgTrace 1.5s ease-in-out infinite' }}
        />
      </svg>

      {/* ===== Layer 7: Core glow aura ===== */}
      <div className="nx-hologram absolute inset-0 rounded-full bg-red-500/10 blur-2xl" />
      <div className="absolute inset-4 rounded-full bg-emerald-500/5 blur-xl" style={{ animation: 'nxHologram 3s ease-in-out infinite' }} />

      {/* ===== Layer 8: BPM indicator ===== */}
      <div className="absolute -top-1 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/30 backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        <span className="text-[8px] font-extrabold text-red-300">72 BPM</span>
      </div>
    </div>
  );
};

/* ============================================================
   LIVE HEALTH SCORE RING — animated circular progress
   ============================================================ */

const HealthScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 52;

  useEffect(() => {
    let startTime: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const dashOffset = circumference - (animatedScore / 100) * circumference;
  const scoreColor = animatedScore > 80 ? '#10b981' : animatedScore > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={scoreColor} />
            <stop offset="100%" stopColor={animatedScore > 60 ? '#06b6d4' : '#f97316'} />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle
          cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: `drop-shadow(0 0 6px ${scoreColor}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white" style={{ color: scoreColor }}>{animatedScore}</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
      </div>
    </div>
  );
};

/* ============================================================
   MINI STAT CARD — animated vital indicator
   ============================================================ */

interface MiniStat {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  color: string;
  bgColor: string;
}

const MINI_STATS: MiniStat[] = [
  { icon: HeartPulse, label: 'Heart Rate', value: '72', unit: 'BPM', trend: 'stable', trendValue: 'Normal', color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  { icon: Droplets, label: 'Blood Sugar', value: '108', unit: 'mg/dL', trend: 'up', trendValue: '+5', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { icon: Moon, label: 'Sleep', value: '7.2', unit: 'hrs', trend: 'up', trendValue: '+0.5', color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  { icon: Footprints, label: 'Steps', value: '8,420', unit: 'today', trend: 'up', trendValue: '+12%', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
];

const MiniStatCard: React.FC<{ stat: MiniStat; delay: number }> = ({ stat, delay }) => {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? TrendingUp : Activity;
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
      style={{ animation: `fadeSlideUp 0.6s ease-out ${delay}s forwards`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] font-bold ${
          stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          <TrendIcon className="w-3 h-3" />
          {stat.trendValue}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-extrabold text-white">{stat.value}</span>
        <span className="text-[10px] text-slate-400">{stat.unit}</span>
      </div>
      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.label}</div>
    </div>
  );
};

/* ============================================================
   FEATURE CARD — bento grid item with premium hover
   ============================================================ */

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  glow: string;
  badge?: string;
}

const FEATURES: Feature[] = [
  { id: 'report_analyzer', icon: FileText, title: 'Lab Reports', desc: 'Understand your reports instantly', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20', badge: 'AI' },
  { id: 'diabetes', icon: Droplets, title: 'Diabetes Care', desc: 'Track glucose, meals & insulin', color: 'from-sky-500 to-blue-600', glow: 'shadow-sky-500/20' },
  { id: 'symptom_checker', icon: Activity, title: 'Symptom Checker', desc: 'Get insights in your language', color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20', badge: 'Popular' },
  { id: 'ai_chat', icon: MessageCircle, title: 'Health Assistant', desc: 'Ask anything, anytime', color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
  { id: 'predictive_analytics', icon: TrendingUp, title: 'Health Trends', desc: 'See your health journey', color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/20' },
  { id: 'disease_predictor', icon: Brain, title: 'Risk Assessment', desc: 'Understand your risks', color: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/20' },
  { id: 'skin_analyzer', icon: ScanLine, title: 'DermAI Scan', desc: 'AI skin & face analysis', color: 'from-teal-500 to-emerald-600', glow: 'shadow-teal-500/20' },
  { id: 'health_brain', icon: Sparkles, title: 'Health Brain', desc: 'AGI-powered health intelligence', color: 'from-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/20', badge: 'New' },
];

const FeatureCard: React.FC<{ feature: Feature; index: number; onNavigate: (id: string) => void }> = ({ feature, index, onNavigate }) => {
  const Icon = feature.icon;
  return (
    <button
      type="button"
      onClick={() => onNavigate(feature.id)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 text-left shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl dark:bg-slate-900/50 dark:border-slate-800"
      style={{ animation: `fadeSlideUp 0.5s ease-out ${index * 0.07}s forwards`, opacity: 0 }}
    >
      {/* Gradient hover glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]`} />
      {/* Shine sweep */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 group-hover:translate-x-full" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {feature.badge && (
            <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              feature.badge === 'New' ? 'bg-fuchsia-100 text-fuchsia-600' :
              feature.badge === 'AI' ? 'bg-violet-100 text-violet-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {feature.badge}
            </span>
          )}
        </div>
        <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white transition-colors">
          {feature.title}
        </h3>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {feature.desc}
        </p>
        <div className="mt-3 flex items-center text-[10px] font-bold text-slate-400 transition-colors group-hover:text-emerald-600">
          Open
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
};

/* ============================================================
   AAROGYA HEALTH BRAIN — Central Cognitive Core (inline)
   Premium neural network visualization embedded in dashboard hero.
   Shows live status, metrics, and connection lines to all modules.
   Elevated with: breathing glow, data flow particles, gradient
   connections, reactive highlights, deeper glassmorphism.
   ============================================================ */

const BrainNeuralCore: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [activePulse, setActivePulse] = useState(0);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    // Single slow interval for neural pulse + thinking text — CSS handles breathing
    const pulseInterval = setInterval(() => {
      setActivePulse(prev => (prev + 1) % 14);
      setThinking(prev => !prev);
    }, 1200);
    return () => {
      clearInterval(pulseInterval);
    };
  }, []);

  // Neural nodes positioned in a brain-like cluster
  const nodes = [
    { id: 'core', x: 200, y: 105, label: '', type: 'core' },
    { id: 'lab', x: 75, y: 45, label: 'Lab', type: 'input' },
    { id: 'symptom', x: 325, y: 45, label: 'Symptom', type: 'input' },
    { id: 'imaging', x: 45, y: 115, label: 'Imaging', type: 'input' },
    { id: 'vitals', x: 355, y: 115, label: 'Vitals', type: 'input' },
    { id: 'meds', x: 75, y: 170, label: 'Meds', type: 'input' },
    { id: 'diet', x: 325, y: 170, label: 'Diet', type: 'input' },
    { id: 'h1', x: 130, y: 72, label: '', type: 'hidden' },
    { id: 'h2', x: 270, y: 72, label: '', type: 'hidden' },
    { id: 'h3', x: 130, y: 138, label: '', type: 'hidden' },
    { id: 'h4', x: 270, y: 138, label: '', type: 'hidden' },
    { id: 'predict', x: 200, y: 28, label: 'Predict', type: 'output' },
    { id: 'alert', x: 200, y: 185, label: 'Alert', type: 'output' },
  ];

  const connections: [string, string][] = [
    ['lab', 'h1'], ['symptom', 'h2'], ['imaging', 'h3'], ['vitals', 'h4'],
    ['meds', 'h3'], ['diet', 'h4'],
    ['h1', 'core'], ['h2', 'core'], ['h3', 'core'], ['h4', 'core'],
    ['core', 'predict'], ['core', 'alert'],
    ['h1', 'h2'], ['h3', 'h4'],
  ];

  // Breathing now CSS-driven (nxBrainBreath keyframe) — no JS state needed

  return (
    <div
      className="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl"
      style={{
        animation: 'fadeSlideUp 0.8s ease-out 0.15s forwards, nxBrainBreath 5s ease-in-out infinite',
        opacity: 0,
        background: 'linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(6,78,59,0.3) 50%, rgba(2,6,23,0.95) 100%)',
        border: '1px solid rgba(16,185,129,0.15)',
        willChange: 'transform, box-shadow',
      }}
    >
      {/* ===== Layer 1: Deep ambient gradient mesh (breathing) ===== */}
      <div className="absolute inset-0" style={{ opacity: 0.4, animation: 'nxBrainBreath 5s ease-in-out infinite', willChange: 'transform' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-emerald-500/20 blur-[80px]" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }} />
        <div className="absolute top-1/4 right-1/4 h-48 w-48 rounded-full bg-cyan-500/15 blur-[60px]" style={{ animation: 'pulseGlow 5s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 h-40 w-40 rounded-full bg-teal-500/10 blur-[50px]" style={{ animation: 'pulseGlow 6s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      {/* ===== Layer 2: Subtle grid pattern ===== */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* ===== Layer 3: Inner glow border (premium depth) ===== */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)' }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
        {/* ===== Left: Brain Identity + Status ===== */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          {/* Status badges — elevated */}
          <div className="flex items-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-1.5 backdrop-blur-md shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-extrabold text-emerald-300 tracking-[0.15em] uppercase">Brain Active</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-500/5 px-3 py-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-cyan-400" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
              <span className="text-[10px] font-bold text-cyan-300/90 tracking-wide">
                {thinking ? 'Processing patterns…' : 'Monitoring 24/7'}
              </span>
            </div>
          </div>

          {/* Title — elevated typography */}
          <h2 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Aarogya Health{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.3))' }}>
              Brain
            </span>
          </h2>
          <p className="mb-6 text-sm text-slate-400 max-w-md leading-relaxed">
            The central AGI core that connects your labs, symptoms, imaging, and vitals —
            predicting health events before they happen.
          </p>

          {/* Live metrics — premium glass cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { value: '12', label: 'Data Points', color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
              { value: '3', label: 'Predictions', color: 'text-violet-400', glow: 'shadow-violet-500/10' },
              { value: '2', label: 'Alerts', color: 'text-amber-400', glow: 'shadow-amber-500/10' },
            ].map((metric, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:${metric.glow}`}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color.includes('emerald') ? 'from-emerald-500/10' : metric.color.includes('violet') ? 'from-violet-500/10' : 'from-amber-500/10'} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className={`relative text-2xl font-extrabold ${metric.color}`} style={{ filter: `drop-shadow(0 0 8px currentColor)` }}>
                  {metric.value}
                </div>
                <div className="relative text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Connected modules indicator — refined */}
          <div className="flex items-center gap-1.5 flex-wrap mb-5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mr-1">Powering</span>
            {['Lab', 'Symptom', 'Imaging', 'Vitals', 'Meds', 'Diet'].map((mod, i) => (
              <span
                key={mod}
                className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-500/8 text-emerald-300/80 border border-emerald-500/15 transition-all hover:bg-emerald-500/15 hover:text-emerald-200"
                style={{ animation: `pulseGlow 3s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
              >
                {mod}
              </span>
            ))}
          </div>

          {/* CTA — elevated */}
          <button
            onClick={() => onNavigate('health_brain')}
            className="group inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.03] hover:shadow-emerald-600/40"
          >
            <Brain className="w-4 h-4 transition-transform group-hover:scale-110" />
            Explore Brain
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* ===== Right: Neural Network Diagram — elevated ===== */}
        <div className="relative flex-shrink-0 flex items-center justify-center p-6 lg:w-[440px]">
          {/* Ambient particle network */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[
              { left: '8%', top: '12%', delay: '0s', size: 'h-1 w-1' },
              { left: '88%', top: '22%', delay: '1.2s', size: 'h-1.5 w-1.5' },
              { left: '18%', top: '78%', delay: '2.4s', size: 'h-0.5 w-0.5' },
              { left: '78%', top: '72%', delay: '0.6s', size: 'h-1 w-1' },
              { left: '48%', top: '8%', delay: '1.8s', size: 'h-0.5 w-0.5' },
              { left: '92%', top: '55%', delay: '3s', size: 'h-1 w-1' },
              { left: '5%', top: '45%', delay: '0.9s', size: 'h-0.5 w-0.5' },
            ].map((p, i) => (
              <div
                key={i}
                className={`absolute ${p.size} rounded-full bg-emerald-400/50`}
                style={{ left: p.left, top: p.top, animation: 'floatParticle 3.5s ease-in-out infinite', animationDelay: p.delay, boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}
              />
            ))}
          </div>

          {/* Breathing aura behind diagram — CSS-driven for 90 FPS */}
          <div
            className="absolute inset-8 rounded-full bg-emerald-500/5 blur-3xl"
            style={{ animation: 'nxBrainBreath 5s ease-in-out infinite', willChange: 'transform' }}
          />

          <svg
            viewBox="0 0 400 210"
            className="w-full h-auto relative z-10"
            style={{ filter: 'drop-shadow(0 0 24px rgba(16,185,129,0.2))' }}
          >
            <defs>
              {/* Core radial gradient */}
              <radialGradient id="brain-core-grad-elevated" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="1" />
                <stop offset="40%" stopColor="#00d4aa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
              </radialGradient>
              {/* Connection line gradient */}
              <linearGradient id="brain-conn-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="brain-conn-active" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              {/* Node glow filter */}
              <filter id="brain-node-glow-elevated" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection lines — gradient + active highlight */}
            {connections.map((conn, i) => {
              const from = nodes.find(n => n.id === conn[0])!;
              const to = nodes.find(n => n.id === conn[1])!;
              const isActive = i === activePulse;
              return (
                <g key={i}>
                  {/* Base connection */}
                  <line
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke="url(#brain-conn-grad)"
                    strokeWidth={isActive ? 2 : 0.8}
                    opacity={isActive ? 1 : 0.4}
                    style={{ transition: 'stroke-width 0.4s, opacity 0.4s' }}
                  />
                  {/* Active connection overlay */}
                  {isActive && (
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="url(#brain-conn-active)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      filter="url(#brain-node-glow-elevated)"
                    />
                  )}
                  {/* Data flow particle on active connection */}
                  {isActive && (
                    <circle r="2" fill="#34d399" filter="url(#brain-node-glow-elevated)">
                      <animate
                        attributeName="cx"
                        values={`${from.x};${to.x}`}
                        dur="0.8s"
                        repeatCount="1"
                      />
                      <animate
                        attributeName="cy"
                        values={`${from.y};${to.y}`}
                        dur="0.8s"
                        repeatCount="1"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes — with reactive highlights */}
            {nodes.map((node, idx) => {
              const isCore = node.type === 'core';
              const isInput = node.type === 'input';
              const isOutput = node.type === 'output';
              const size = isCore ? 15 : isInput ? 9 : isOutput ? 8 : 5;
              // Check if this node is part of the active connection
              const activeConn = connections[activePulse];
              const isNodeActive = activeConn && (activeConn[0] === node.id || activeConn[1] === node.id);

              return (
                <g key={node.id}>
                  {isCore && (
                    <>
                      {/* Core glow aura — breathing */}
                      <circle
                        cx={node.x} cy={node.y} r="40"
                        fill="url(#brain-core-grad-elevated)"
                        filter="url(#brain-node-glow-elevated)"
                        style={{ animation: 'pulseGlow 2.5s ease-in-out infinite', transformOrigin: `${node.x}px ${node.y}px` }}
                      />
                      {/* Expanding aura rings */}
                      <circle cx={node.x} cy={node.y} r="18" fill="none" stroke="#00d4aa" strokeWidth="1" opacity="0.4" style={{ animation: 'nxAuraExpand 2.5s ease-out infinite' }} />
                      <circle cx={node.x} cy={node.y} r="18" fill="none" stroke="#00d4aa" strokeWidth="0.8" opacity="0.3" style={{ animation: 'nxAuraExpand 2.5s ease-out infinite', animationDelay: '1.2s' }} />
                      {/* Outer ring */}
                      <circle cx={node.x} cy={node.y} r="22" fill="none" stroke="rgba(0,212,170,0.2)" strokeWidth="0.5" strokeDasharray="2 4" />
                    </>
                  )}
                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={node.y} r={size}
                    fill={isCore ? '#00d4aa' : isInput ? 'rgba(6,182,212,0.8)' : isOutput ? 'rgba(139,92,246,0.7)' : 'rgba(167,139,250,0.5)'}
                    stroke={isCore ? '#34d399' : isNodeActive ? '#34d399' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isNodeActive ? 1.5 : 1}
                    filter={isCore || isInput || isNodeActive ? 'url(#brain-node-glow-elevated)' : undefined}
                    style={{
                      animation: isCore ? 'pulseGlow 2s ease-in-out infinite' : `pulseGlow 3s ease-in-out infinite`,
                      animationDelay: `${idx * 0.12}s`,
                      opacity: isNodeActive ? 1 : undefined,
                    }}
                  />
                  {/* Brain icon inside core */}
                  {isCore && (
                    <g transform={`translate(${node.x - 7}, ${node.y - 6})`}>
                      <path
                        d="M7 0 C4 0 2 2 2 4 C0.5 4.5 0 6 0 7.5 C0 9 1 10.5 2.5 11 C2.5 12.5 4 13.5 6 13.5 C7 13.5 8 13 8.5 12 C9 13 10 13.5 11 13.5 C13 13.5 14.5 12.5 14.5 11 C16 10.5 17 9 17 7.5 C17 6 16.5 4.5 15 4 C15 2 13 0 10 0 C9 0 8 0.5 7 1.5 C6.5 0.5 6 0 7 0 Z"
                        fill="rgba(255,255,255,0.7)"
                        opacity="0.8"
                      />
                    </g>
                  )}
                  {/* Node label */}
                  {node.label && (
                    <text
                      x={node.x} y={node.y + size + 12}
                      textAnchor="middle"
                      fill={isInput ? 'rgba(6,182,212,0.8)' : isOutput ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.5)'}
                      fontSize="7.5"
                      fontWeight="bold"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ===== Bottom: Connection flow indicator — elevated ===== */}
      <div className="relative z-10 border-t border-white/5 px-6 py-3.5 flex items-center justify-between flex-wrap gap-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
            <span className="text-[10px] font-bold text-slate-400 tracking-wide">Neural pathways active</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.3s', boxShadow: '0 0 6px rgba(6,182,212,0.6)' }} />
            <span className="text-[10px] font-bold text-slate-400 tracking-wide">Cross-module sync</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.6s', boxShadow: '0 0 6px rgba(139,92,246,0.6)' }} />
            <span className="text-[10px] font-bold text-slate-400 tracking-wide">Predictive engine online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500">Latency</span>
            <span className="text-[10px] font-extrabold text-emerald-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }}>12ms</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500">Uptime</span>
            <span className="text-[10px] font-extrabold text-emerald-400">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PREMIUM GLASSMORPHISM CREDITS SHOWCASE
   A Figma-grade footer showcasing every AI model, dataset,
   guideline, and technology that powers Aarogya AI.
   Design: glassmorphism + aurora gradient + staggered reveal
   ============================================================ */

// --- RAG dataset metadata (inline import avoids circular dependency) ---
const RAG_DATASETS_INFO = [
  { name: 'Diabetes Health Indicators', source: 'Kaggle', records: '253,680', domain: 'Diabetes', region: 'Global', url: 'kaggle.com/datasets/alexteboul/diabetes-health-indicators-dataset', license: 'CC0', passages: 3 },
  { name: 'UCI Heart Disease', source: 'Kaggle', records: '920', domain: 'Cardiology', region: 'Global', url: 'kaggle.com/datasets/redwankarimsony/heart-disease-data', license: 'CC BY 4.0', passages: 2 },
  { name: 'MIMIC-IV Clinical Database', source: 'Kaggle', records: '180,733', domain: 'Critical Care', region: 'Global', url: 'kaggle.com/datasets/asjad99/mimic4', license: 'PhysioNet', passages: 1 },
  { name: 'Medical QA Dataset', source: 'Hugging Face', records: '200,000', domain: 'General Medicine', region: 'Global', url: 'huggingface.co/datasets/lavita/medical-qa-datasets', license: 'Apache 2.0', passages: 3 },
  { name: 'PubMed Abstracts', source: 'Hugging Face', records: '211,269', domain: 'Research', region: 'Global', url: 'huggingface.co/datasets/pubmed_qa', license: 'MIT', passages: 2 },
  { name: 'CheXpert Chest X-ray', source: 'Hugging Face', records: '224,316', domain: 'Radiology', region: 'Global', url: 'huggingface.co/datasets/chexpert', license: 'Stanford RUA', passages: 1 },
  { name: 'AI4Bharat Health & Language', source: 'AI Kosh', records: '48,000', domain: 'India Health', region: 'India', url: 'ai4bharat.org', license: 'CC BY-NC 4.0', passages: 3 },
];

const RAG_SOURCE_META: Record<string, { gradient: string; icon: string; badge: string }> = {
  'Kaggle':       { gradient: 'from-sky-400 to-blue-500', icon: 'K', badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30' },
  'Hugging Face': { gradient: 'from-amber-400 to-yellow-500', icon: 'H', badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30' },
  'AI Kosh':      { gradient: 'from-rose-400 to-pink-500', icon: 'A', badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30' },
};

const PremiumCreditsShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'models' | 'data' | 'tech' | 'rag'>('models');

  const aiModels = [
    { name: 'Claude Sonnet', role: 'Primary Reasoning & Vision', provider: 'Anthropic', desc: 'Medical chat, symptom analysis, imaging, lab reports', gradient: 'from-amber-400 to-orange-500', icon: '🤖' },
    { name: 'Gemini', role: 'Non-Medical Orchestration', provider: 'Google', desc: 'Orchestration pipeline — text, image, PDF fusion', gradient: 'from-violet-400 to-purple-500', icon: '✨' },
    { name: 'XGBoost', role: 'Risk Prediction', provider: 'Local ML', desc: '3-tree gradient-boosted ensemble for structured data', gradient: 'from-cyan-400 to-blue-500', icon: '⚡' },
    { name: 'JEPA', role: 'Latent State Engine', provider: 'Concept: Y. LeCun', desc: 'Self-supervised prediction of hidden health variables', gradient: 'from-rose-400 to-pink-500', icon: '🔮' },
    { name: 'Anthropic SDK', role: 'AI Transport Layer', provider: 'Anthropic', desc: 'Server-side SDK replacing GLM-4 for DPDP compliance', gradient: 'from-emerald-400 to-teal-500', icon: '📦' },
    { name: 'z-ai-web-dev-sdk', role: 'Legacy SDK (Deprecating)', provider: 'Z.ai', desc: 'Being phased out — all routes migrating to Claude', gradient: 'from-slate-400 to-slate-500', icon: '📦' },
  ];

  const datasets = [
    { name: 'ICMR-INDIAB', desc: 'Diabetes prevalence — 101M Indians', region: '🇮🇳 India' },
    { name: 'NFHS-5', desc: 'Anemia, maternal health, nutrition', region: '🇮🇳 India' },
    { name: 'ICMR-NIN Food Tables', desc: 'Indian food nutrient database', region: '🇮🇳 India' },
    { name: 'UCI Heart Disease', desc: 'Cardiovascular ML training data', region: '🌍 Global' },
    { name: 'WHO Mental Health Atlas', desc: 'Country-level mental health resources', region: '🌍 Global' },
    { name: 'LASI', desc: 'Longitudinal aging study of India', region: '🇮🇳 India' },
    { name: 'AI4Bharat (Bhashini)', desc: '11 Indian language speech models', region: '🇮🇳 India' },
    { name: 'BharatGen (Ayur)', desc: 'Indic-language generative models', region: '🇮🇳 India' },
    { name: 'Pima Indians Diabetes', desc: 'Early-stage diabetes detection training', region: '🌍 Global' },
    { name: 'LabQAR (NIH)', desc: 'Lab reference ranges & QA', region: '🇺🇸 USA' },
  ];

  const techStack = [
    { name: 'Next.js 16', category: 'Framework', icon: '▲' },
    { name: 'React 19', category: 'UI Library', icon: '⚛️' },
    { name: 'TypeScript 5', category: 'Language', icon: '🔷' },
    { name: 'Tailwind CSS 4', category: 'Styling', icon: '🎨' },
    { name: 'shadcn/ui', category: 'Components', icon: '🧩' },
    { name: 'Radix UI', category: 'Primitives', icon: '♿' },
    { name: 'Prisma ORM', category: 'Database', icon: '🗃️' },
    { name: 'Zustand', category: 'State', icon: '🐻' },
    { name: 'Framer Motion', category: 'Animation', icon: '🎬' },
    { name: 'Recharts', category: 'Charts', icon: '📊' },
    { name: 'Lucide Icons', category: 'Icons', icon: '💡' },
    { name: 'Bun', category: 'Runtime', icon: '🥖' },
  ];

  const guidelines = ['ADA 2024', 'ICMR 2023', 'AHA 2017', 'WHO 2011', 'NICE NG181', 'KDIGO 2024'];
  const authorities = ['FDA', 'CDSCO India', 'EMA'];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 p-6 sm:p-8 mt-6">
      {/* Aurora gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" style={{ animation: 'meshFloat 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" style={{ animation: 'meshFloat 15s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" style={{ animation: 'meshFloat 18s ease-in-out infinite' }} />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* ====== HEADER ====== */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-300 tracking-[0.2em] uppercase">Built with Gratitude</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Powered by Giants
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Every AI model, dataset, and technology that makes Aarogya AI possible.
            We stand on the shoulders of giants — this is our thank-you. 🙏
          </p>
        </div>

        {/* ====== TAB SWITCHER (glass pills) ====== */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-x-auto max-w-full">
            {([
              { id: 'models', label: 'AI Models', icon: '🧠', count: aiModels.length },
              { id: 'rag', label: 'RAG Sources', icon: '🔍', count: RAG_DATASETS_INFO.length },
              { id: 'data', label: 'Datasets', icon: '📊', count: datasets.length },
              { id: 'tech', label: 'Tech Stack', icon: '⚙️', count: techStack.length },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white shadow-lg border border-emerald-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ====== AI MODELS TAB ====== */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            {aiModels.map((m, i) => (
              <div
                key={m.name}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-white/20 transition-all"
                style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.05}s both` }}
              >
                {/* Hover gradient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl shadow-lg`}>
                      {m.icon}
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 backdrop-blur-sm">
                      {m.provider}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  <p className="text-[10px] text-emerald-300 font-medium uppercase tracking-wide mt-0.5">{m.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====== DATASETS TAB ====== */}
        {activeTab === 'data' && (
          <div className="space-y-4" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {datasets.map((d, i) => (
                <div
                  key={d.name}
                  className="group flex items-start gap-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 hover:border-emerald-400/30 transition-all"
                  style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.04}s both` }}
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-lg shrink-0">
                    📊
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-bold text-white truncate">{d.name}</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">{d.region}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guidelines + Authorities */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-400/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> Clinical Guidelines
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {guidelines.map(g => (
                    <span key={g} className="text-[10px] px-2 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">{g}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-400/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> Drug Safety Authorities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {authorities.map(a => (
                    <span key={a} className="text-[10px] px-2 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== TECH STACK TAB ====== */}
        {activeTab === 'tech' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            {techStack.map((t, i) => (
              <div
                key={t.name}
                className="group flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 hover:border-cyan-400/30 hover:bg-white/10 transition-all"
                style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.03}s both` }}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl">
                  {t.icon}
                </div>
                <p className="text-xs font-bold text-white text-center">{t.name}</p>
                <p className="text-[9px] text-slate-400 text-center">{t.category}</p>
              </div>
            ))}
          </div>
        )}

        {/* ====== RAG SOURCES TAB (Kaggle / HuggingFace / AI4Bharat) ====== */}
        {activeTab === 'rag' && (
          <div className="space-y-4" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            {/* RAG Pipeline banner */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 backdrop-blur-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Retrieval-Augmented Generation Pipeline</p>
                  <p className="text-[10px] text-slate-400">Query → Embedding → Vector Search → Top-K Passages → Augmented LLM Context</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-[10px] mt-3">
                <span className="text-slate-300"><strong className="text-emerald-300">{RAG_DATASETS_INFO.length}</strong> datasets indexed</span>
                <span className="text-slate-300"><strong className="text-cyan-300">{RAG_DATASETS_INFO.reduce((s, d) => s + d.passages, 0)}</strong> curated passages</span>
                <span className="text-slate-300"><strong className="text-violet-300">1M+</strong> total records</span>
                <span className="text-slate-300"><strong className="text-amber-300">3</strong> source platforms</span>
              </div>
            </div>

            {/* Dataset cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RAG_DATASETS_INFO.map((d, i) => {
                const meta = RAG_SOURCE_META[d.source];
                return (
                  <div
                    key={d.name}
                    className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:border-white/20 transition-all"
                    style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    {/* Source gradient glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                          {meta.icon}
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${meta.badge} backdrop-blur-sm`}>
                          {d.source}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-0.5">{d.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] mb-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">{d.domain}</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">{d.region}</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">{d.license}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span><strong className="text-slate-200">{d.records}</strong> records</span>
                        <span><strong className="text-emerald-300">{d.passages}</strong> passages indexed</span>
                      </div>
                      <a
                        href={`https://${d.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Globe className="h-2.5 w-2.5" /> {d.url}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* How RAG works mini-explainer */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">How RAG Enhances Aarogya AI</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[10px] text-slate-300">
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="font-bold text-emerald-300 mb-0.5">1. Embed</p>
                  <p>Query → 16-dim semantic vector</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="font-bold text-cyan-300 mb-0.5">2. Retrieve</p>
                  <p>Cosine similarity over indexed passages</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="font-bold text-violet-300 mb-0.5">3. Augment</p>
                  <p>Top-K passages + citations → LLM context</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="font-bold text-amber-300 mb-0.5">4. Generate</p>
                  <p>Grounded answer with source attribution</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== FOOTER MESSAGE ====== */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Made with love for Bharat</p>
                <p className="text-[10px] text-slate-400">भारत के लिए, भारत के लोगों द्वारा 🇮🇳</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                API keys server-side
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Advisory only
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-violet-400" />
                Open &amp; transparent
              </span>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-500">
            © 2026 Aarogya AI · Healthcare Intelligence Platform · Not a substitute for professional medical care
          </p>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   MAIN DASHBOARD
   ============================================================ */

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isUserActive, setIsUserActive] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      setIsUserActive(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsUserActive(false), 2000);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 animate-fadeIn">
      {/* DNA Background ambient layer */}
      <DNABackground processing={isUserActive} />

      {/* ============ PREMIUM HERO SECTION ============ */}
      <div
        className="relative z-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 shadow-2xl"
        style={{ animation: 'fadeSlideUp 0.8s ease-out forwards', opacity: 0 }}
      >
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/30 blur-3xl" style={{ animation: 'meshFloat 8s ease-in-out infinite' }} />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" style={{ animation: 'meshFloat 10s ease-in-out infinite', animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/2 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" style={{ animation: 'meshFloat 12s ease-in-out infinite', animationDelay: '4s' }} />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { left: '15%', top: '20%', size: 'h-1 w-1', color: 'bg-emerald-400/40', delay: '0s' },
            { left: '85%', top: '30%', size: 'h-1.5 w-1.5', color: 'bg-cyan-400/30', delay: '1.5s' },
            { left: '60%', top: '70%', size: 'h-1 w-1', color: 'bg-violet-400/30', delay: '3s' },
            { left: '25%', top: '80%', size: 'h-0.5 w-0.5', color: 'bg-emerald-400/50', delay: '0.8s' },
          ].map((p, i) => (
            <div key={i} className={`absolute ${p.size} rounded-full ${p.color}`} style={{ left: p.left, top: p.top, animation: `floatParticle 4s ease-in-out infinite`, animationDelay: p.delay }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center">
          {/* Left content */}
          <div className="min-w-0 flex-1">
            {/* Greeting + status badge */}
            <div className="mb-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                ALL SYSTEMS ACTIVE
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300 backdrop-blur-sm">
                <Sparkles className="w-2.5 h-2.5" /> AGI POWERED
              </div>
            </div>

            <h1 className="mb-2 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              Your Health,<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Clearly Understood
              </span>
            </h1>
            <p className="mb-5 max-w-md text-sm text-slate-400 sm:text-base">
              AI-powered intelligence that connects your labs, symptoms, and vitals into one clear picture.
            </p>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MINI_STATS.map((stat, i) => (
                <MiniStatCard key={i} stat={stat} delay={0.3 + i * 0.1} />
              ))}
            </div>
          </div>

          {/* Right: Health Score Ring + Heart HUD */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <div className="relative">
              <HealthScoreRing score={72} />
              {/* Pulsing aura */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }} />
            </div>
            <RotatingSkeletonHUD isUserActive={isUserActive} />
          </div>
        </div>
      </div>

      {/* ============ AAROGYA HEALTH BRAIN — CENTRAL COGNITIVE CORE ============ */}
      <BrainNeuralCore onNavigate={onNavigate} />

      {/* ============ DAILY HEALTH CHALLENGE ============ */}
      <div className="relative z-10" style={{ animation: 'fadeSlideUp 0.8s ease-out 0.3s forwards', opacity: 0 }}>
        <DailyChallenge />
      </div>

      {/* ============ CORE FEATURES BENTO GRID ============ */}
      <div className="relative z-10" style={{ animation: 'fadeSlideUp 0.8s ease-out 0.4s forwards', opacity: 0 }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              Core Features
            </h2>
            <p className="ml-9 text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tap any module to get started</p>
          </div>
          <button
            onClick={() => onNavigate('intelligence_hub')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* ============ TRUST & VALUES STRIP ============ */}
      <div
        className="relative z-10 grid grid-cols-1 gap-3 md:grid-cols-3"
        style={{ animation: 'fadeSlideUp 0.8s ease-out 0.5s forwards', opacity: 0 }}
      >
        {[
          { icon: ShieldCheck, title: 'Your Privacy Matters', desc: 'All data stays on your device. We never sell or share your information.', color: 'emerald' },
          { icon: Globe, title: 'In Your Language', desc: 'Available in 11 Indian languages. Healthcare should be accessible to all.', color: 'indigo' },
          { icon: HeartPulse, title: 'Human-Centered AI', desc: 'AI-assisted insights designed to support, not replace healthcare professionals.', color: 'rose' },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-900/50 dark:border-slate-800"
          >
            {/* Hover gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              item.color === 'emerald' ? 'from-emerald-500/5 to-teal-500/5' :
              item.color === 'indigo' ? 'from-indigo-500/5 to-violet-500/5' :
              'from-rose-500/5 to-pink-500/5'
            } opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            <div className="relative z-10 flex items-start gap-3">
              <div className={`flex-shrink-0 rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110 ${
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                item.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ ECG DIVIDER ============ */}
      <div className="relative z-10 flex h-12 items-center justify-center">
        <svg viewBox="0 0 400 30" className="h-full w-full max-w-2xl opacity-30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="nx-ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 15 L 150 15 L 165 15 L 172 5 L 188 25 L 205 5 L 220 15 L 400 15"
            fill="none" stroke="url(#nx-ecg-grad)" strokeWidth="2" strokeLinecap="round"
            style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: 'ecgDraw 3s ease-in-out infinite' }}
          />
        </svg>
      </div>

      {/* ============ PREMIUM GLASSMORPHISM CREDITS SHOWCASE ============ */}
      <PremiumCreditsShowcase />

      {/* ============ SCOPED ANIMATIONS ============ */}
      <style>{`
        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 20px) scale(0.95); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-15px); opacity: 1; }
        }
        @keyframes ecgDraw {
          0% { stroke-dashoffset: 500; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -500; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Orbit + counter-rotate */
        @keyframes nxOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nx-orbit { animation: nxOrbit 10s linear infinite; }
        @keyframes nxOrbitCounter { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .nx-orbit-counter { animation: nxOrbitCounter 10s linear infinite; }

        /* Data stream dots — orbit the HUD */
        @keyframes nxDataStream {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(70px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(70px) rotate(-360deg); opacity: 0; }
        }
        .nx-data-stream {
          animation: nxDataStream 5s linear infinite;
          top: 50%; left: 50%;
        }

        /* ===== NEW: Realistic heart beat (lub-dub rhythm) ===== */
        @keyframes nx-heart-beat {
          0%, 100% { transform: scale(1); }
          15%      { transform: scale(1.12); }  /* lub */
          30%      { transform: scale(1.0); }
          45%      { transform: scale(1.08); }  /* dub */
          60%      { transform: scale(1.0); }
        }
        .nx-heart-beat { animation: nx-heart-beat 0.833s ease-in-out infinite; }

        /* ===== NEW: 3D Y-axis rotation ===== */
        @keyframes nx-heart-3d-rotate {
          0%   { transform: rotateY(0deg) rotateX(5deg); }
          50%  { transform: rotateY(180deg) rotateX(-5deg); }
          100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        .nx-heart-3d-rotate {
          animation: nx-heart-3d-rotate 15s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        /* Heart flip on user activity */
        @keyframes nxHeartFlip {
          0%, 100% { transform: rotateY(0deg); }
          50%      { transform: rotateY(180deg); }
        }
        .nx-heart-flip { animation: nxHeartFlip 2s ease-in-out 1; }

        /* ===== NEW: Expanding aura rings ===== */
        @keyframes nxAuraExpand {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* ===== NEW: Holographic scan line ===== */
        @keyframes nxScanLine {
          0%, 100% { top: 0%; opacity: 0; }
          10%      { opacity: 1; }
          90%      { opacity: 1; }
          100%     { top: 100%; opacity: 0; }
        }

        /* ===== NEW: Chamber pulse (synced with heartbeat) ===== */
        @keyframes nxChamberPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          15%      { opacity: 0.5; transform: scale(1.1); }
          30%      { opacity: 0.2; transform: scale(1); }
          45%      { opacity: 0.4; transform: scale(1.08); }
          60%      { opacity: 0.2; transform: scale(1); }
        }

        /* ===== NEW: ECG waveform tracing ===== */
        @keyframes nxEcgTrace {
          0%   { stroke-dashoffset: 200; }
          50%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }

        /* Hologram glow */
        @keyframes nxHologram {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.5;  transform: scale(1.06); }
        }
        .nx-hologram { animation: nxHologram 3s ease-in-out infinite; }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.1); }
        }

        /* GPU-accelerated brain breathing — replaces 80ms JS interval */
        @keyframes nxBrainBreath {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 60px rgba(16,185,129,0.08), 0 20px 50px rgba(0,0,0,0.4);
          }
          50% {
            transform: scale(1.015);
            box-shadow: 0 0 80px rgba(16,185,129,0.12), 0 20px 50px rgba(0,0,0,0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
