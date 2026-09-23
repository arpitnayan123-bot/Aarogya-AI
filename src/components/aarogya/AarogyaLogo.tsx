'use client';

/**
 * AarogyaLogo — Premium animated medical logo (SVG-based).
 * Heart + ECG line on an emerald→teal→deep-teal radial gradient.
 * Subtle heartbeat animation on the ECG path keeps the mark alive
 * without distracting from surrounding UI.
 */

import React from 'react';

export interface AarogyaLogoProps {
  className?: string;
  size?: number;
  /** Enable the ECG heartbeat draw animation (default: true) */
  animate?: boolean;
}

export const AarogyaLogo: React.FC<AarogyaLogoProps> = ({
  className = '',
  size = 40,
  animate = true,
}) => {
  // Unique IDs so multiple logos can coexist on one page without
  // colliding gradient/filter ids.
  const uid = React.useId().replace(/[:]/g, '');
  const gradId = `nx-logo-grad-${uid}`;
  const glowId = `nx-logo-glow-${uid}`;
  const ecgGradId = `nx-logo-ecg-${uid}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Aarogya AI logo"
      role="img"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Emerald → Teal → Deep teal radial gradient (medical, premium) */}
          <radialGradient id={gradId} cx="32%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="32%" stopColor="#34d399" />
            <stop offset="65%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </radialGradient>

          {/* Subtle inner gloss for 3D depth */}
          <radialGradient id={`ecgGrad-${uid}`} cx="35%" cy="25%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* ECG stroke gradient — cyan→emerald sheen */}
          <linearGradient id={ecgGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
          </linearGradient>

          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background disc */}
        <circle cx="200" cy="200" r="200" fill={`url(#${gradId})`} />

        {/* Inner glassy sheen */}
        <circle cx="200" cy="200" r="200" fill={`url(#ecgGrad-${uid})`} opacity="0.35" />

        {/* Subtle concentric ring */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Heart + ECG group with glow */}
        <g filter={`url(#${glowId})`}>
          {/* Heart outline */}
          <path
            d="M 200 280 Q 130 210 130 160 Q 130 120 165 120 Q 185 120 200 140 Q 215 120 235 120 Q 270 120 270 160 Q 270 210 200 280 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ECG line — animated stroke draw when `animate` is true */}
          <path
            d="M 40 220 L 110 220 L 125 180 L 145 260 L 170 160 L 195 240 L 210 180 L 225 220 L 290 220 L 305 180 L 320 240 L 340 220 L 370 220"
            fill="none"
            stroke={`url(#${ecgGradId})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animate ? 'nx-logo-ecg' : undefined}
            style={
              animate
                ? {
                    strokeDasharray: 820,
                    strokeDashoffset: 820,
                  }
                : undefined
            }
          />
        </g>

        {/* Tiny particles — give a sense of "data" inside the mark */}
        <circle cx="285" cy="260" r="2.2" fill="#ffffff" opacity="0.65" />
        <circle cx="296" cy="270" r="1.6" fill="#ffffff" opacity="0.45" />
        <circle cx="306" cy="278" r="1.1" fill="#ffffff" opacity="0.32" />
        <circle cx="118" cy="252" r="1.6" fill="#ffffff" opacity="0.45" />
        <circle cx="108" cy="262" r="1.1" fill="#ffffff" opacity="0.3" />
      </svg>

      <style>{`
        @keyframes nxLogoEcgDraw {
          0% { stroke-dashoffset: 820; }
          55% { stroke-dashoffset: 0; }
          65% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -820; }
        }
        .nx-logo-ecg {
          animation: nxLogoEcgDraw 4.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nx-logo-ecg { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * AarogyaLogoText — Compact logo + wordmark for headers / sidebars.
 */
export interface AarogyaLogoTextProps {
  className?: string;
  size?: number;
  /** Force dark-mode wordmark (useful on dark backgrounds). */
  onDark?: boolean;
}

export const AarogyaLogoText: React.FC<AarogyaLogoTextProps> = ({
  className = '',
  size = 36,
  onDark = false,
}) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <AarogyaLogo size={size} />
    <div className="leading-tight">
      <div
        className={`text-base font-black tracking-tight ${
          onDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        Aarogya AI
      </div>
      <div
        className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
          onDark ? 'text-emerald-300/80' : 'text-slate-400'
        }`}
      >
        Healthcare Intelligence
      </div>
    </div>
  </div>
);

export default AarogyaLogo;
