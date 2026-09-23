'use client';

/**
 * HumanBodyModel — Premium glass-morphism 3D-style human anatomy visualization.
 *
 * Features:
 * - Layered anatomical systems: organs, circulatory, nervous
 * - Animated heartbeat (heart pulses), breathing (lungs expand), blood flow (veins pulse)
 * - Glass morphism container with backdrop blur
 * - Interactive hotspots — hover to highlight body systems
 * - Rotating aura glow
 * - Premium dark aesthetic with emerald/teal medical theme
 *
 * Pure SVG — no 3D libraries needed. All animations CSS-based.
 */

import React, { useState, useEffect } from 'react';
import {
  Heart, Brain, Wind, Bone, Droplet, Activity, Eye,
  Sparkles, Plus,
} from 'lucide-react';

type BodySystem = 'all' | 'organs' | 'circulatory' | 'nervous';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  icon: any;
  color: string;
  desc: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'brain', x: 150, y: 38, label: 'Brain', icon: Brain, color: '#a78bfa', desc: 'Neural activity · 86B neurons' },
  { id: 'heart', x: 138, y: 135, label: 'Heart', icon: Heart, color: '#ef4444', desc: '72 BPM · Blood circulation' },
  { id: 'lungs', x: 165, y: 125, label: 'Lungs', icon: Wind, color: '#06b6d4', desc: 'Respiration · O₂ exchange' },
  { id: 'liver', x: 155, y: 175, label: 'Liver', icon: Activity, color: '#f59e0b', desc: 'Detoxification · 500+ functions' },
  { id: 'kidney', x: 125, y: 195, label: 'Kidneys', icon: Droplet, color: '#10b981', desc: 'Filtration · 180L/day' },
  { id: 'spine', x: 150, y: 250, label: 'Spine', icon: Bone, color: '#e2e8f0', desc: '33 vertebrae · Neural pathway' },
];

export const HumanBodyModel: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<BodySystem>('all');
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [heartbeat, setHeartbeat] = useState(0);

  // Sync heartbeat counter with CSS animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat(prev => prev + 1);
    }, 833); // ~72 BPM
    return () => clearInterval(interval);
  }, []);

  const systemOpacity = (sys: BodySystem) => {
    if (activeSystem === 'all') return 1;
    return activeSystem === sys ? 1 : 0.15;
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glass morphism container */}
      <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Animated gradient aura */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(16,185,129,0.15), rgba(6,182,212,0.15), rgba(139,92,246,0.15), rgba(16,185,129,0.15))',
            animation: 'hbmAura 8s linear infinite',
          }}
        />

        {/* Header */}
        <div className="relative z-10 px-6 pt-6 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Anatomical Intelligence</h3>
            <p className="text-[10px] text-slate-400 font-medium">Interactive 3D body systems</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-bold text-emerald-300">LIVE</span>
          </div>
        </div>

        {/* System selector */}
        <div className="relative z-10 px-6 pb-2 flex items-center gap-1.5 flex-wrap">
          {([
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'organs', label: 'Organs', icon: Heart },
            { id: 'circulatory', label: 'Veins', icon: Droplet },
            { id: 'nervous', label: 'Nerves', icon: Activity },
          ] as const).map(sys => (
            <button
              key={sys.id}
              onClick={() => setActiveSystem(sys.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                activeSystem === sys.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
              }`}
            >
              <sys.icon className="w-3 h-3" />
              {sys.label}
            </button>
          ))}
        </div>

        {/* SVG Body Model */}
        <div className="relative px-4 py-2">
          <svg
            viewBox="0 0 300 520"
            className="w-full h-auto"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(16,185,129,0.15))' }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="bodyGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.06)" />
              </linearGradient>
              <linearGradient id="bodyOutline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.5)" />
                <stop offset="50%" stopColor="rgba(6,182,212,0.4)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.3)" />
              </linearGradient>
              <radialGradient id="heartGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(239,68,68,0.8)" />
                <stop offset="50%" stopColor="rgba(239,68,68,0.3)" />
                <stop offset="100%" stopColor="rgba(239,68,68,0)" />
              </radialGradient>
              <linearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(239,68,68,0.6)" />
                <stop offset="50%" stopColor="rgba(139,92,246,0.5)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.6)" />
              </linearGradient>
              <linearGradient id="organGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(239,68,68,0.4)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0.3)" />
              </linearGradient>
              <linearGradient id="lungGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(6,182,212,0.4)" />
                <stop offset="100%" stopColor="rgba(14,165,233,0.25)" />
              </linearGradient>
              <linearGradient id="liverGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(180,83,9,0.5)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0.3)" />
              </linearGradient>
              <linearGradient id="kidneyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.4)" />
                <stop offset="100%" stopColor="rgba(5,150,105,0.25)" />
              </linearGradient>
              <linearGradient id="brainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.25)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ===== BODY SILHOUETTE (Glass) ===== */}
            <g style={{ opacity: systemOpacity('organs') === 1 ? 0.6 : 0.3, transition: 'opacity 0.5s' }}>
              {/* Head */}
              <ellipse cx="150" cy="40" rx="26" ry="30" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1.5" />
              {/* Neck */}
              <rect x="140" y="65" width="20" height="15" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              {/* Torso */}
              <path
                d="M115,80 Q110,75 108,90 L105,140 Q100,160 102,200 Q105,240 110,270 L120,290 L135,295 L150,295 L165,295 L180,290 L190,270 Q195,240 198,200 Q200,160 195,140 L192,90 Q190,75 185,80 Q170,72 150,72 Q130,72 115,80 Z"
                fill="url(#bodyGlass)"
                stroke="url(#bodyOutline)"
                strokeWidth="1.5"
              />
              {/* Arms */}
              <path d="M108,90 Q85,100 78,130 L72,180 Q68,220 70,260 L75,290 L82,295 L85,290 L80,260 Q78,220 82,180 L88,140 Q92,110 105,95 Z" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              <path d="M192,90 Q215,100 222,130 L228,180 Q232,220 230,260 L225,290 L218,295 L215,290 L220,260 Q222,220 218,180 L212,140 Q208,110 195,95 Z" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              {/* Hands */}
              <circle cx="78" cy="298" r="8" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              <circle cx="222" cy="298" r="8" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              {/* Legs */}
              <path d="M120,295 Q115,320 112,360 L108,420 Q106,460 108,490 L115,505 L128,508 L132,505 L128,490 Q126,460 130,420 L135,360 Q138,320 140,300 Z" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1.5" />
              <path d="M180,295 Q185,320 188,360 L192,420 Q194,460 192,490 L185,505 L172,508 L168,505 L172,490 Q174,460 170,420 L165,360 Q162,320 160,300 Z" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1.5" />
              {/* Feet */}
              <ellipse cx="120" cy="510" rx="12" ry="6" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
              <ellipse cx="180" cy="510" rx="12" ry="6" fill="url(#bodyGlass)" stroke="url(#bodyOutline)" strokeWidth="1" />
            </g>

            {/* ===== CIRCULATORY SYSTEM (Veins/Arteries) ===== */}
            <g style={{ opacity: systemOpacity('circulatory'), transition: 'opacity 0.5s' }} filter="url(#glow)">
              {/* Aorta (main artery from heart) */}
              <path
                d="M150,130 Q150,140 150,160 L150,200 Q150,220 148,240 Q146,270 145,295"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite' }}
              />
              {/* Branching arteries - arms */}
              <path
                d="M148,140 Q130,145 110,160 Q90,180 82,220 Q78,260 80,295"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite', animationDelay: '0.3s' }}
              />
              <path
                d="M152,140 Q170,145 190,160 Q210,180 218,220 Q222,260 220,295"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite', animationDelay: '0.3s' }}
              />
              {/* Branching arteries - legs */}
              <path
                d="M148,240 Q135,260 128,300 Q122,350 120,420 Q118,470 120,505"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite', animationDelay: '0.5s' }}
              />
              <path
                d="M152,240 Q165,260 172,300 Q178,350 180,420 Q182,470 180,505"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite', animationDelay: '0.5s' }}
              />
              {/* Neck to brain */}
              <path
                d="M150,130 Q148,110 149,90 Q150,70 150,50"
                fill="none"
                stroke="url(#veinGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
                style={{ animation: 'bloodFlow 2s ease-in-out infinite', animationDelay: '0.1s' }}
              />
              {/* Capillary network in brain */}
              {[0, 1, 2, 3, 4].map(i => (
                <circle
                  key={`cap-${i}`}
                  cx={140 + i * 5}
                  cy={35 + (i % 2) * 8}
                  r="2"
                  fill="rgba(239,68,68,0.5)"
                  style={{ animation: 'bloodFlow 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </g>

            {/* ===== NERVOUS SYSTEM ===== */}
            <g style={{ opacity: systemOpacity('nervous'), transition: 'opacity 0.5s' }} filter="url(#glow)">
              {/* Brain nerves */}
              <path d="M135,30 Q140,35 145,32 M155,32 Q160,35 165,30 M138,45 Q150,48 162,45" fill="none" stroke="rgba(167,139,250,0.6)" strokeWidth="1" strokeLinecap="round" />
              {/* Spinal cord */}
              <path
                d="M150,70 L150,280"
                fill="none"
                stroke="rgba(167,139,250,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 3"
                style={{ animation: 'nervePulse 1.5s ease-in-out infinite' }}
              />
              {/* Nerve branches */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={`nerves-${i}`}>
                  <path
                    d={`M150,${110 + i * 30} Q${130 - i * 3},${120 + i * 30} ${115},${130 + i * 30}`}
                    fill="none"
                    stroke="rgba(167,139,250,0.4)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="3 2"
                    style={{ animation: `nervePulse 1.5s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
                  />
                  <path
                    d={`M150,${110 + i * 30} Q${170 + i * 3},${120 + i * 30} ${185},${130 + i * 30}`}
                    fill="none"
                    stroke="rgba(167,139,250,0.4)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="3 2"
                    style={{ animation: `nervePulse 1.5s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
                  />
                </g>
              ))}
              {/* Leg nerves */}
              <path d="M150,280 Q135,320 128,380 Q124,440 122,500" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" style={{ animation: 'nervePulse 1.5s ease-in-out infinite', animationDelay: '0.5s' }} />
              <path d="M150,280 Q165,320 172,380 Q176,440 178,500" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" style={{ animation: 'nervePulse 1.5s ease-in-out infinite', animationDelay: '0.5s' }} />
            </g>

            {/* ===== ORGANS ===== */}
            <g style={{ opacity: systemOpacity('organs'), transition: 'opacity 0.5s' }}>
              {/* Brain */}
              <g style={{ animation: 'organFloat 4s ease-in-out infinite' }}>
                <path
                  d="M130,25 Q125,20 130,15 Q135,12 140,15 Q145,10 150,12 Q155,10 160,15 Q165,12 170,15 Q175,20 170,25 Q172,35 168,42 Q160,48 150,48 Q140,48 132,42 Q128,35 130,25 Z"
                  fill="url(#brainGrad)"
                  stroke="rgba(167,139,250,0.5)"
                  strokeWidth="1"
                />
                <path d="M140,20 Q145,25 140,30 M155,20 Q160,25 155,30 M135,35 Q150,40 165,35" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="0.8" />
              </g>

              {/* Heart — beating */}
              <g style={{ transformOrigin: '145px 135px', animation: 'heartBeat 0.833s ease-in-out infinite' }}>
                {/* Glow */}
                <circle cx="145" cy="135" r="20" fill="url(#heartGlow)" />
                {/* Heart shape */}
                <path
                  d="M145,148 C138,140 128,135 128,125 C128,118 134,115 140,118 C143,120 145,123 145,126 C145,123 147,120 150,118 C156,115 162,118 162,125 C162,135 152,140 145,148 Z"
                  fill="rgba(239,68,68,0.6)"
                  stroke="rgba(239,68,68,0.8)"
                  strokeWidth="1.5"
                />
                {/* ECG line on heart */}
                <path d="M133,130 L138,130 L140,125 L142,138 L144,128 L146,135 L148,130 L153,130" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Lungs — breathing */}
              <g style={{ transformOrigin: '150px 135px', animation: 'breathe 4s ease-in-out infinite' }}>
                {/* Left lung */}
                <path
                  d="M118,110 Q112,115 110,130 Q108,150 112,165 Q116,170 122,168 Q126,160 125,145 Q124,125 122,112 Q120,108 118,110 Z"
                  fill="url(#lungGrad)"
                  stroke="rgba(6,182,212,0.5)"
                  strokeWidth="1"
                />
                {/* Right lung */}
                <path
                  d="M182,110 Q188,115 190,130 Q192,150 188,165 Q184,170 178,168 Q174,160 175,145 Q176,125 178,112 Q180,108 182,110 Z"
                  fill="url(#lungGrad)"
                  stroke="rgba(6,182,212,0.5)"
                  strokeWidth="1"
                />
                {/* Bronchi */}
                <path d="M145,105 L145,115 M155,105 L155,115 M145,115 L140,125 M155,115 L160,125" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Liver */}
              <g style={{ animation: 'organFloat 5s ease-in-out infinite', animationDelay: '0.5s' }}>
                <path
                  d="M125,168 Q120,172 122,182 Q125,190 140,192 Q155,193 170,190 Q180,185 178,175 Q175,168 165,168 Q150,166 125,168 Z"
                  fill="url(#liverGrad)"
                  stroke="rgba(180,83,9,0.5)"
                  strokeWidth="1"
                />
              </g>

              {/* Stomach */}
              <g style={{ animation: 'organFloat 4.5s ease-in-out infinite', animationDelay: '0.3s' }}>
                <path
                  d="M160,180 Q168,178 172,185 Q174,195 168,200 Q160,202 155,196 Q152,188 160,180 Z"
                  fill="rgba(245,158,11,0.3)"
                  stroke="rgba(245,158,11,0.5)"
                  strokeWidth="1"
                />
              </g>

              {/* Kidneys */}
              <g style={{ animation: 'organFloat 5s ease-in-out infinite', animationDelay: '0.8s' }}>
                <path
                  d="M128,190 Q122,193 122,202 Q123,210 130,212 Q135,210 135,200 Q134,192 128,190 Z"
                  fill="url(#kidneyGrad)"
                  stroke="rgba(16,185,129,0.5)"
                  strokeWidth="1"
                />
                <path
                  d="M172,190 Q178,193 178,202 Q177,210 170,212 Q165,210 165,200 Q166,192 172,190 Z"
                  fill="url(#kidneyGrad)"
                  stroke="rgba(16,185,129,0.5)"
                  strokeWidth="1"
                />
              </g>

              {/* Intestines */}
              <g style={{ animation: 'organFloat 6s ease-in-out infinite' }}>
                <path
                  d="M120,215 Q115,220 118,228 Q122,233 130,230 Q135,225 132,220 Q128,215 120,215 Z M135,225 Q130,230 133,238 Q138,242 145,238 Q150,232 146,227 Q140,223 135,225 Z M150,230 Q145,235 148,243 Q153,247 160,243 Q165,237 161,232 Q155,228 150,230 Z M165,225 Q160,230 163,238 Q168,242 175,238 Q180,232 176,227 Q170,223 165,225 Z"
                  fill="rgba(180,83,9,0.2)"
                  stroke="rgba(180,83,9,0.4)"
                  strokeWidth="1"
                />
              </g>
            </g>

            {/* ===== INTERACTIVE HOTSPOTS ===== */}
            {HOTSPOTS.map(spot => (
              <g
                key={spot.id}
                onMouseEnter={() => setHoveredHotspot(spot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="4"
                  fill="none"
                  stroke={spot.color}
                  strokeWidth="1.5"
                  opacity="0.6"
                  style={{ animation: 'hotspotPulse 2s ease-out infinite', transformOrigin: `${spot.x}px ${spot.y}px` }}
                />
                {/* Dot */}
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r={hoveredHotspot === spot.id ? 6 : 4}
                  fill={spot.color}
                  opacity="0.9"
                  style={{ transition: 'r 0.2s' }}
                  filter="url(#glow)"
                />
                {/* Label on hover */}
                {hoveredHotspot === spot.id && (
                  <g style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <rect
                      x={spot.x + 10}
                      y={spot.y - 12}
                      width={spot.label.length * 7 + 16}
                      height="24"
                      rx="8"
                      fill="rgba(15,23,42,0.9)"
                      stroke={spot.color}
                      strokeWidth="1"
                    />
                    <text
                      x={spot.x + 18}
                      y={spot.y + 3}
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {spot.label}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {/* Scan line effect */}
            <rect
              x="0"
              y="0"
              width="300"
              height="2"
              fill="rgba(16,185,129,0.4)"
              style={{ animation: 'scanDown 4s linear infinite' }}
            />
          </svg>
        </div>

        {/* Vital signs footer */}
        <div className="relative z-10 px-6 pb-5 pt-2 grid grid-cols-3 gap-3">
          <VitalStat label="Heart Rate" value="72" unit="BPM" color="text-red-400" icon={Heart} pulse />
          <VitalStat label="SpO₂" value="98" unit="%" color="text-cyan-400" icon={Activity} />
          <VitalStat label="BP" value="120/80" unit="mmHg" color="text-emerald-400" icon={Droplet} />
        </div>
      </div>

      {/* Info card for hovered hotspot */}
      {hoveredHotspot && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 translate-y-full z-20 animate-fadeIn">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-xl whitespace-nowrap">
            {(() => {
              const spot = HOTSPOTS.find(s => s.id === hoveredHotspot)!;
              return (
                <div className="flex items-center gap-2">
                  <spot.icon className="w-4 h-4" style={{ color: spot.color }} />
                  <span className="text-sm font-bold text-white">{spot.label}</span>
                  <span className="text-xs text-slate-400">· {spot.desc}</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Scoped animations */}
      <style jsx>{`
        @keyframes hbmAura {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.1); }
          60% { transform: scale(1); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes bloodFlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes nervePulse {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.4; }
          50% { stroke-dashoffset: -10; opacity: 0.8; }
        }
        @keyframes organFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes hotspotPulse {
          0% { r: 4; opacity: 0.8; }
          100% { r: 14; opacity: 0; }
        }
        @keyframes scanDown {
          0% { y: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { y: 520; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Vital sign stat sub-component
function VitalStat({ label, value, unit, color, icon: Icon, pulse }: {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: any;
  pulse?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <Icon className={`w-3 h-3 ${color} ${pulse ? 'animate-pulse' : ''}`} />
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-sm font-extrabold ${color}`}>{value}</div>
      <div className="text-[8px] text-slate-500 font-medium">{unit}</div>
    </div>
  );
}

export default HumanBodyModel;
