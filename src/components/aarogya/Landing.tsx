'use client';

/**
 * Landing — Premium dark-mode landing page for Aarogya AI.
 *
 * Healthcare-themed animations:
 * - Animated ECG heartbeat line tracing across the screen
 * - Pulsing DNA double-helix in the background
 * - Beating heart with expanding ripple rings
 * - Orbiting medical icons with glowing trails
 * - Particle network with connecting lines
 * - Animated gradient mesh orbs
 * - Counter animation for stats
 * - Shine sweep on CTA button
 */

import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowRight, BarChart3, Beaker, Brain, Database, Droplet,
  FlaskConical, HeartPulse, Pill, ShieldAlert, ShieldCheck,
  Stethoscope, Syringe, TestTube2, Activity, Plus,
} from 'lucide-react';
import { AarogyaLogo } from './AarogyaLogo';

export interface LandingProps {
  onStart: () => void;
}

// Orbiting medical icons
const ORBITING_ICONS = [
  { Icon: HeartPulse, color: 'text-rose-300', glow: 'shadow-rose-500/40', bg: 'bg-rose-500/15 border-rose-400/40' },
  { Icon: Pill, color: 'text-sky-300', glow: 'shadow-sky-500/40', bg: 'bg-sky-500/15 border-sky-400/40' },
  { Icon: Syringe, color: 'text-emerald-300', glow: 'shadow-emerald-500/40', bg: 'bg-emerald-500/15 border-emerald-400/40' },
  { Icon: Beaker, color: 'text-amber-300', glow: 'shadow-amber-500/40', bg: 'bg-amber-500/15 border-amber-400/40' },
  { Icon: TestTube2, color: 'text-fuchsia-300', glow: 'shadow-fuchsia-500/40', bg: 'bg-fuchsia-500/15 border-fuchsia-400/40' },
  { Icon: Droplet, color: 'text-cyan-300', glow: 'shadow-cyan-500/40', bg: 'bg-cyan-500/15 border-cyan-400/40' },
  { Icon: Stethoscope, color: 'text-violet-300', glow: 'shadow-violet-500/40', bg: 'bg-violet-500/15 border-violet-400/40' },
  { Icon: FlaskConical, color: 'text-lime-300', glow: 'shadow-lime-500/40', bg: 'bg-lime-500/15 border-lime-400/40' },
];

// Deterministic particles for the network background
const NETWORK_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 53 + 17) % 100,
  top: (i * 71 + 13) % 100,
  delay: (i * 0.37) % 6,
  duration: 8 + ((i * 5) % 6),
}));

const STATS = [
  { value: '23+', target: 23, label: 'AI Tools', sub: 'powered', suffix: '+' },
  { value: '17', target: 17, label: 'Datasets', sub: 'integrated', suffix: '' },
  { value: '11', target: 11, label: 'Languages', sub: 'supported', suffix: '' },
  { value: '4.9', target: 4.9, label: 'User Rating', sub: '★★★★★', suffix: '', decimal: true },
];

const CORE_CAPABILITIES = [
  { icon: Database, title: 'Medical Data Structuring', desc: 'Structured clinical data extraction', color: 'from-emerald-500 to-teal-500', delay: '0.1s' },
  { icon: Brain, title: 'Clinical Insight Generation', desc: 'AI-powered medical reasoning', color: 'from-cyan-500 to-blue-500', delay: '0.2s' },
  { icon: ShieldAlert, title: 'Risk Identification', desc: 'Early warning risk detection', color: 'from-rose-500 to-pink-500', delay: '0.3s' },
  { icon: BarChart3, title: 'Health Data Interpretation', desc: 'Trend analysis & projections', color: 'from-amber-500 to-orange-500', delay: '0.4s' },
];

const TRUSTED_SOURCES = [
  'ICMR-INDIAB', 'NFHS-5', 'LabQAR (NIH)', 'AI4Bharat',
  'BharatGen', 'Groq AI', 'Google Gemini',
];

// Animated counter hook
function useCounter(target: number, duration: number = 2000, start: boolean = false, decimal: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(target * eased);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return decimal ? count.toFixed(1) : Math.round(count);
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [hoveringCenter, setHoveringCenter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Trigger stats counter when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const orbitRadius = isMobile ? 145 : 180;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
      {/* ============ ANIMATED BACKGROUND LAYERS ============ */}

      {/* Layer 1: Deep gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.18),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.12),_transparent_60%)]" />

      {/* Layer 2: Animated grid with perspective */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* Layer 3: Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"
          style={{ animation: 'floatSlow 12s ease-in-out infinite' }}
        />
        <div
          className="absolute right-[10%] top-[30%] h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
          style={{ animation: 'floatSlow 14s ease-in-out infinite', animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[15%] left-[40%] h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
          style={{ animation: 'floatSlow 16s ease-in-out infinite', animationDelay: '4s' }}
        />
      </div>

      {/* Layer 4: ECG Heartbeat Line — animated SVG path */}
      <svg
        className="absolute left-0 right-0 top-1/3 h-32 w-full opacity-30"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="rgba(16,185,129,0.8)" />
            <stop offset="80%" stopColor="rgba(6,182,212,0.8)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0,50 L200,50 L220,50 L230,20 L240,80 L250,10 L260,90 L270,50 L400,50 L420,50 L430,30 L440,70 L450,20 L460,80 L470,50 L600,50 L620,50 L630,15 L640,85 L650,5 L660,95 L670,50 L800,50 L820,50 L830,25 L840,75 L850,15 L860,85 L870,50 L1000,50 L1020,50 L1030,20 L1040,80 L1050,10 L1060,90 L1070,50 L1200,50"
          fill="none"
          stroke="url(#ecgGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 3000,
            strokeDashoffset: 3000,
            animation: 'ecgTrace 4s ease-in-out infinite',
          }}
        />
      </svg>

      {/* Layer 5: DNA Double Helix — animated strands */}
      <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-40">
        <svg width="80" height="400" viewBox="0 0 80 400">
          <defs>
            <linearGradient id="dnaGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.6)" />
              <stop offset="50%" stopColor="rgba(6,182,212,0.8)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.6)" />
            </linearGradient>
            <linearGradient id="dnaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(20,184,166,0.6)" />
              <stop offset="50%" stopColor="rgba(139,92,246,0.8)" />
              <stop offset="100%" stopColor="rgba(20,184,166,0.6)" />
            </linearGradient>
          </defs>
          {/* Strand 1 */}
          <path
            d="M20,0 Q60,50 20,100 Q-20,150 20,200 Q60,250 20,300 Q-20,350 20,400"
            fill="none"
            stroke="url(#dnaGrad1)"
            strokeWidth="2.5"
            style={{ animation: 'dnaRotate 8s linear infinite' }}
          />
          {/* Strand 2 */}
          <path
            d="M60,0 Q20,50 60,100 Q100,150 60,200 Q20,250 60,300 Q100,350 60,400"
            fill="none"
            stroke="url(#dnaGrad2)"
            strokeWidth="2.5"
            style={{ animation: 'dnaRotate 8s linear infinite reverse' }}
          />
          {/* Base pairs */}
          {[0, 50, 100, 150, 200, 250, 300, 350].map((y, i) => (
            <line
              key={i}
              x1="20"
              y1={y + 25}
              x2="60"
              y2={y + 25}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              style={{
                animation: `dnaConnect 8s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Layer 6: Particle network */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full">
          {NETWORK_PARTICLES.map((p, i) =>
            NETWORK_PARTICLES.slice(i + 1).map((p2, j) => {
              const dist = Math.hypot(p.left - p2.left, p.top - p2.top);
              if (dist > 25) return null;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${p.left}%`}
                  y1={`${p.top}%`}
                  x2={`${p2.left}%`}
                  y2={`${p2.top}%`}
                  stroke="rgba(16,185,129,0.08)"
                  strokeWidth="1"
                />
              );
            })
          )}
        </svg>
        {NETWORK_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400/50"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `floatBob ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: '0 0 8px rgba(16,185,129,0.6)',
            }}
          />
        ))}
      </div>

      {/* ============ HERO SECTION ============ */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Trust badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-emerald-300 backdrop-blur-xl"
          style={{ animation: 'fadeSlideUp 0.6s ease-out 0.1s forwards', opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          🇮🇳 Made in India · Powered by AI · HIPAA Aligned
        </div>

        {/* ============ ORBITAL HERO ANIMATION ============ */}
        <div className="relative mb-8 flex h-[340px] w-[340px] items-center justify-center sm:h-[400px] sm:w-[400px]">
          {/* Expanding ripple rings from center */}
          {[0, 1, 2].map((i) => (
            <div
              key={`ripple-${i}`}
              className="absolute rounded-full border border-emerald-400/20"
              style={{
                width: '180px',
                height: '180px',
                animation: `rippleExpand 3s ease-out infinite`,
                animationDelay: `${i * 1}s`,
              }}
            />
          ))}

          {/* Outer ring (30s spin) */}
          <div className="absolute inset-0 animate-spinRing" style={{ animationDuration: '30s' }}>
            <svg viewBox="0 0 420 420" className="h-full w-full">
              <circle cx="210" cy="210" r="195" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="210" cy="210" r="195" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2.5" strokeDasharray="20 200" strokeLinecap="round" />
              {/* Small dots on outer ring */}
              {[0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <circle
                    key={angle}
                    cx={210 + 195 * Math.cos(rad)}
                    cy={210 + 195 * Math.sin(rad)}
                    r="3"
                    fill="rgba(16,185,129,0.6)"
                  />
                );
              })}
            </svg>
          </div>

          {/* Middle ring (20s reverse spin) */}
          <div
            className="absolute inset-8 animate-spinRing"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }}
          >
            <svg viewBox="0 0 340 340" className="h-full w-full">
              <circle cx="170" cy="170" r="160" fill="none" stroke="rgba(20,184,166,0.15)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="170" cy="170" r="160" fill="none" stroke="rgba(20,184,166,0.4)" strokeWidth="2.5" strokeDasharray="15 180" strokeLinecap="round" />
            </svg>
          </div>

          {/* Inner ring (15s spin) */}
          <div className="absolute inset-16 animate-spinRing" style={{ animationDuration: '15s' }}>
            <svg viewBox="0 0 260 260" className="h-full w-full">
              <circle cx="130" cy="130" r="125" fill="none" stroke="rgba(14,165,233,0.2)" strokeWidth="1" strokeDasharray="3 6" />
              <circle cx="130" cy="130" r="125" fill="none" stroke="rgba(14,165,233,0.5)" strokeWidth="2" strokeDasharray="10 100" strokeLinecap="round" />
            </svg>
          </div>

          {/* Central glowing logo with heartbeat */}
          <button
            type="button"
            onClick={onStart}
            onMouseEnter={() => setHoveringCenter(true)}
            onMouseLeave={() => setHoveringCenter(false)}
            className="relative z-20 flex h-32 w-32 cursor-pointer items-center justify-center rounded-full sm:h-40 sm:w-40"
            aria-label="Open Aarogya AI Health Hub"
            style={{
              animation: 'heartbeat 1.5s ease-in-out infinite',
            }}
          >
            {/* Glowing aura */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-2xl"
              style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
            />
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20" />
            <div className="absolute inset-2 rounded-full border border-white/30" />
            <div className="absolute inset-4 rounded-full border border-emerald-400/20" />

            {/* Logo */}
            <div
              className="relative z-10 transition-transform duration-500"
              style={{ transform: hoveringCenter ? 'scale(1.15)' : 'scale(1)' }}
            >
              <AarogyaLogo size={100} />
            </div>

            {/* Pulsing dot indicators */}
            {[
              { top: '10%', left: '50%', delay: '0s' },
              { top: '50%', left: '90%', delay: '0.5s' },
              { top: '90%', left: '50%', delay: '1s' },
              { top: '50%', left: '10%', delay: '1.5s' },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-emerald-400"
                style={{
                  top: dot.top,
                  left: dot.left,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulseGlow 2s ease-in-out infinite`,
                  animationDelay: dot.delay,
                  boxShadow: '0 0 10px rgba(16,185,129,0.8)',
                }}
              />
            ))}
          </button>

          {/* Orbiting medical icons with glow trails */}
          {ORBITING_ICONS.map((item, i) => {
            const duration = 25 + (i % 3) * 5;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={
                  {
                    animation: `orbit ${duration}s linear infinite`,
                    animationDelay: `${-i * (duration / ORBITING_ICONS.length)}s`,
                    ['--radius' as string]: `${orbitRadius}px`,
                  } as React.CSSProperties
                }
              >
                {/* Glow trail */}
                <div
                  className={`absolute inset-0 rounded-2xl ${item.bg} blur-md`}
                  style={{ animation: `pulseGlow 2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                />
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${item.bg} backdrop-blur-xl shadow-lg sm:h-14 sm:w-14 ${item.glow}`}
                  style={{ animation: `floatBob 3s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                >
                  <item.Icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Headline */}
        <div
          className="mb-8 max-w-3xl text-center"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.5s forwards', opacity: 0 }}
        >
          <h1 className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
            Healthcare, <br />
            <span className="gradient-text-emerald">Reimagined</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            AI-powered health intelligence for every Indian. From lab analysis to Ayurveda,
            <span className="font-medium text-slate-200"> all in one place.</span>
          </p>
        </div>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-4 sm:flex-row"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.7s forwards', opacity: 0 }}
        >
          <button
            type="button"
            onClick={onStart}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-5 text-lg font-bold text-slate-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 transition-opacity group-hover:opacity-15" />
            {/* Shine sweep */}
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative z-10">Open Health Hub</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>100% Private · End-to-End Encrypted</span>
          </div>
        </div>

        {/* Stats with animated counters */}
        <div
          ref={statsRef}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8"
          style={{ animation: 'fadeSlideUp 0.8s ease-out 0.9s forwards', opacity: 0 }}
        >
          {STATS.map((stat, i) => (
            <StatCounter key={i} stat={stat} visible={statsVisible} delay={i * 0.15} />
          ))}
        </div>
      </div>

      {/* ============ WHY AAROGYA AI ============ */}
      <div className="relative z-10 overflow-hidden px-6 py-20 sm:py-28">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-10 top-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
            style={{ animation: 'floatSlow 10s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
            style={{ animation: 'floatSlow 12s ease-in-out infinite', animationDelay: '2s' }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
              Why Aarogya AI?
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          </div>

          {/* Answer copy */}
          <div className="mb-16 space-y-4 text-center">
            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-slate-300 sm:text-xl">
              Aarogya AI doesn&apos;t generate text — it processes medical data as a system.
            </p>
            <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-slate-400 sm:text-lg">
              We are not competing with any AI models, we are just building on top of them intelligently.
            </p>
            <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-slate-400 sm:text-lg">
              We don&apos;t replace AI models. We structure them into a healthcare intelligence system.
            </p>
          </div>

          {/* Core capabilities */}
          <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_CAPABILITIES.map((item, i) => (
              <CapabilityCard key={i} item={item} />
            ))}
          </div>

          {/* Closing CTA copy */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-base font-light leading-relaxed text-slate-300 sm:text-lg">
              Aarogya AI transforms complex lab reports, prescriptions, and health data into
              <span className="font-medium text-white"> clear, structured insights </span>
              with risk detection and actionable guidance.
            </p>
            <p className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-base font-medium leading-relaxed text-transparent sm:text-lg">
              Upload your report. Get clinically structured analysis. Make better health decisions faster.
            </p>

            {/* Animated pulse dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" style={{ animationDelay: '0.2s' }} />
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ============ TRUSTED BY ============ */}
      <div className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
            Powered by India&apos;s leading health data &amp; AI
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
            {TRUSTED_SOURCES.map((source, i) => (
              <span
                key={i}
                className="cursor-default transition-colors hover:text-emerald-400"
                style={{
                  animation: 'fadeIn 0.5s ease-out forwards',
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                }}
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ SCOPED ANIMATIONS ============ */}
      <style jsx>{`
        @keyframes ekgTrace {
          0% { stroke-dashoffset: 3000; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -3000; }
        }
        @keyframes rippleExpand {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes dnaRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes dnaConnect {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -30px); }
          66% { transform: translate(-15px, 20px); }
        }
      `}</style>
    </div>
  );
};

// ============ STAT COUNTER SUBCOMPONENT ============
function StatCounter({ stat, visible, delay }: { stat: typeof STATS[0]; visible: boolean; delay: number }) {
  const count = useCounter(stat.target, 2000, visible, stat.decimal);
  return (
    <div className="group text-center">
      <div
        className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl"
        style={{
          animation: visible ? `counterPop 0.5s ease-out ${delay}s forwards` : 'none',
          opacity: visible ? undefined : 0,
        }}
      >
        {count}{stat.suffix}
      </div>
      <div className="mt-1 text-xs font-bold text-slate-200">{stat.label}</div>
      <div className="text-[10px] text-slate-500">{stat.sub}</div>
    </div>
  );
}

// ============ CAPABILITY CARD SUBCOMPONENT ============
function CapabilityCard({ item }: { item: typeof CORE_CAPABILITIES[0] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10 ${
        visible ? 'opacity-100' : 'opacity-0 translate-y-8'
      }`}
      style={{ transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', transitionDelay: item.delay }}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-15`} />
      <div className="relative z-10">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
        >
          <item.icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-base font-bold text-white">{item.title}</h3>
        <p className="mb-3 text-xs text-slate-400">{item.desc}</p>
        <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-transparent transition-all duration-500 group-hover:w-16" />
      </div>
    </div>
  );
}

export default Landing;
