'use client';

/**
 * DNABackground — Animated DNA helix background.
 *
 * A subtle, premium, medical-grade ambient layer that sits behind the
 * dashboard. Two intertwining DNA strands drift vertically, base-pairs
 * connect them, and faint "data-flow" particles drift upward — all
 * intensifying gently when `processing` is true (e.g. when the user is
 * interacting with the dashboard).
 *
 * Never interferes with UI readability (pointer-events-none, very low
 * opacity). All animations respect `prefers-reduced-motion`.
 */

import React, { useMemo } from 'react';

export interface DNABackgroundProps {
  /** When true, the helix intensifies slightly — used as a "user is active" signal. */
  processing?: boolean;
  /** Optional className override (rarely needed). */
  className?: string;
}

interface Particle {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
}

interface BasePair {
  id: number;
  top: string;
  rotate: number;
}

const DNABackground: React.FC<DNABackgroundProps> = ({
  processing = false,
  className = '',
}) => {
  // Stable particle set — generated once, SSR-safe.
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        delay: i * 0.55,
        left: `${12 + (i % 5) * 19}%`,
        duration: 6 + (i % 3) * 2,
        size: 1 + (i % 3) * 0.5,
      })),
    []
  );

  const basePairs = useMemo<BasePair[]>(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        top: `${8 + i * 10.5}%`,
        rotate: i % 2 === 0 ? -14 : 14,
      })),
    []
  );

  const strandOpacity = processing ? 0.14 : 0.07;
  const particleOpacity = processing ? 0.18 : 0.1;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Central DNA helix structure */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Left strand */}
        <div
          className="nx-dna-float"
          style={{ animationDelay: '0s' }}
        >
          <svg
            viewBox="0 0 100 400"
            className="h-[620px] w-[110px]"
            style={{ opacity: strandOpacity }}
          >
            <defs>
              <linearGradient id="nx-dna-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 50 0 C 20 50 80 100 50 150 C 20 200 80 250 50 300 C 20 350 80 400 50 450"
              fill="none"
              stroke="url(#nx-dna-grad-1)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Right strand (mirrored) */}
        <div
          className="nx-dna-float"
          style={{ animationDelay: '0.5s' }}
        >
          <svg
            viewBox="0 0 100 400"
            className="h-[620px] w-[110px]"
            style={{ opacity: strandOpacity }}
          >
            <defs>
              <linearGradient id="nx-dna-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 50 0 C 80 50 20 100 50 150 C 80 200 20 250 50 300 C 80 350 20 400 50 450"
              fill="none"
              stroke="url(#nx-dna-grad-2)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Connecting base pairs */}
        <div
          className={`absolute inset-0 flex items-center justify-center nx-dna-float ${
            processing ? 'nx-dna-intensify' : ''
          }`}
          style={{ animationDelay: '0.25s' }}
        >
          {basePairs.map((bp) => (
            <div
              key={bp.id}
              className="absolute h-px w-[64px] rounded-full"
              style={{
                top: bp.top,
                transform: `rotate(${bp.rotate}deg)`,
                background:
                  'linear-gradient(90deg, rgba(6,182,212,0.06), rgba(20,184,166,0.06))',
              }}
            />
          ))}
        </div>

        {/* Data-flow particles drifting upward */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/80 nx-particle-flow"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: particleOpacity,
              animationDelay: `${p.delay}s`,
              animationDuration: processing
                ? `${p.duration * 0.5}s`
                : `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Soft glow orbs — intensify on user activity */}
      <div
        className={`absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl ${
          processing ? 'nx-glow-intensify' : 'nx-glow-subtle'
        }`}
      />
      <div
        className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl ${
          processing ? 'nx-glow-intensify' : 'nx-glow-subtle'
        }`}
        style={{ animationDelay: '2s' }}
      />
      <div
        className={`absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl ${
          processing ? 'nx-glow-intensify' : 'nx-glow-subtle'
        }`}
        style={{ animationDelay: '4s' }}
      />

      {/* Very subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6, 182, 212, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.35) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <style>{`
        @keyframes nxDnaFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-14px) scale(1.02); }
        }
        .nx-dna-float {
          animation: nxDnaFloat 7s ease-in-out infinite;
        }
        .nx-dna-intensify {
          filter: brightness(1.6);
        }

        @keyframes nxParticleFlow {
          0% { transform: translateY(20vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(8px); opacity: 0; }
        }
        .nx-particle-flow {
          animation: nxParticleFlow 8s linear infinite;
          will-change: transform, opacity;
        }

        @keyframes nxGlowIntensify {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.32; transform: scale(1.1); }
        }
        .nx-glow-intensify {
          animation: nxGlowIntensify 2.4s ease-in-out infinite;
        }

        @keyframes nxGlowSubtle {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.04); }
        }
        .nx-glow-subtle {
          animation: nxGlowSubtle 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .nx-dna-float,
          .nx-particle-flow,
          .nx-glow-intensify,
          .nx-glow-subtle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DNABackground;
