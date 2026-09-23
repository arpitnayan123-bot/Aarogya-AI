'use client';

/**
 * AarogyaHealthBrain — The Central AGI System.
 *
 * A glowing neural network visualization that:
 * - Pulses when "thinking" or processing health data
 * - Generates proactive health predictions (30-60-90 days)
 * - Sends morning health briefings
 * - Monitors patterns across all modules
 * - Gets smarter with every interaction
 *
 * This is the "brain" that connects all features intelligently.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Brain, Sparkles, AlertTriangle, TrendingUp, TrendingDown,
  Bell, Activity, Heart, Droplets, Moon, Footprints, Apple,
  Zap, Clock, ChevronRight, X, Plus, ArrowRight, Flame
} from 'lucide-react';
import { useHealthContext } from '@/lib/healthContext';
import { predictLatentHealthState } from '@/lib/latentHealthEngine';

// Neural network node positions (deterministic for SSR safety)
const NEURAL_NODES = [
  { id: 'core', x: 150, y: 150, label: 'Core', type: 'core' },
  { id: 'lab', x: 60, y: 80, label: 'Lab', type: 'input' },
  { id: 'symptom', x: 240, y: 80, label: 'Symptom', type: 'input' },
  { id: 'imaging', x: 40, y: 180, label: 'Imaging', type: 'input' },
  { id: 'vitals', x: 260, y: 180, label: 'Vitals', type: 'input' },
  { id: 'meds', x: 60, y: 240, label: 'Meds', type: 'input' },
  { id: 'diet', x: 240, y: 240, label: 'Diet', type: 'input' },
  { id: 'h1', x: 100, y: 120, label: '', type: 'hidden' },
  { id: 'h2', x: 200, y: 120, label: '', type: 'hidden' },
  { id: 'h3', x: 100, y: 180, label: '', type: 'hidden' },
  { id: 'h4', x: 200, y: 180, label: '', type: 'hidden' },
  { id: 'predict', x: 150, y: 70, label: 'Predict', type: 'output' },
  { id: 'alert', x: 150, y: 230, label: 'Alert', type: 'output' },
];

const NEURAL_CONNECTIONS = [
  ['lab', 'h1'], ['symptom', 'h2'], ['imaging', 'h3'], ['vitals', 'h4'],
  ['meds', 'h3'], ['diet', 'h4'],
  ['h1', 'core'], ['h2', 'core'], ['h3', 'core'], ['h4', 'core'],
  ['core', 'predict'], ['core', 'alert'],
  ['h1', 'h2'], ['h3', 'h4'],
];

// Prediction templates — generated based on findings + latent state
interface Prediction {
  id: string;
  icon: any;
  color: string;
  title: string;
  detail: string;
  timeframe: string;
  urgency: 'low' | 'moderate' | 'high';
  action: string;
}

interface ProactiveAlert {
  id: string;
  icon: any;
  color: string;
  title: string;
  detail: string;
  time: string;
  type: 'morning' | 'medication' | 'vitals' | 'weather' | 'pattern';
}

export const AarogyaHealthBrain: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { findings, profile } = useHealthContext();
  const [isThinking, setIsThinking] = useState(true);
  const [activePulse, setActivePulse] = useState(0);
  const [showAlerts, setShowAlerts] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate brain "thinking" pulses
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActivePulse(prev => (prev + 1) % NEURAL_CONNECTIONS.length);
      setIsThinking(prev => !prev);
    }, 1500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Generate predictions from findings + latent state
  const latentState = useMemo(() => {
    if (findings.length === 0) return null;
    return predictLatentHealthState(findings, profile);
  }, [findings, profile]);

  const predictions: Prediction[] = useMemo(() => {
    const preds: Prediction[] = [];

    // Diabetes prediction
    const hasGlucose = findings.some(f => f.name.toLowerCase().includes('glucose') && f.severity !== 'normal');
    const hasHbA1c = findings.some(f => f.name.toLowerCase().includes('hba1c') && f.severity !== 'normal');
    if (hasGlucose || hasHbA1c || (latentState && latentState.metabolicScore < 60)) {
      preds.push({
        id: 'pred-diabetes',
        icon: Droplets,
        color: 'text-amber-600',
        title: 'Diabetes Risk Escalation',
        detail: 'Based on your glucose patterns, diabetes risk may increase significantly in the next 45 days if current trends continue.',
        timeframe: '45 days',
        urgency: 'high',
        action: 'Reduce sugar intake, walk 30 min daily, consult endocrinologist',
      });
    }

    // Cardiac prediction
    if (latentState && latentState.cardiovascularScore < 60) {
      preds.push({
        id: 'pred-cardiac',
        icon: Heart,
        color: 'text-red-600',
        title: 'Cardiovascular Risk Increasing',
        detail: 'Your cardiac risk factors show an upward trajectory. Without intervention, risk may escalate in 60-90 days.',
        timeframe: '60-90 days',
        urgency: 'high',
        action: 'DASH diet, reduce salt, daily cardio exercise, consult cardiologist',
      });
    }

    // Inflammation prediction
    if (latentState && latentState.inflammationLevel > 50) {
      preds.push({
        id: 'pred-inflammation',
        icon: Flame,
        color: 'text-orange-600',
        title: 'Chronic Inflammation Risk',
        detail: 'Elevated inflammation markers suggest risk of chronic inflammation within 30 days, affecting recovery and immune function.',
        timeframe: '30 days',
        urgency: 'moderate',
        action: 'Anti-inflammatory foods (turmeric, ginger), omega-3, stress reduction',
      });
    }

    // Nutritional deficiency prediction
    if (latentState && latentState.deficiencies.length > 0) {
      preds.push({
        id: 'pred-nutrition',
        icon: Apple,
        color: 'text-emerald-600',
        title: 'Nutritional Deficiency Progression',
        detail: `${latentState.deficiencies.length} deficiencies detected. Without correction, symptoms may worsen in 60 days.`,
        timeframe: '60 days',
        urgency: 'moderate',
        action: `Address: ${latentState.deficiencies.join(', ')}. Dietary changes + supplementation.`,
      });
    }

    // General wellness prediction if no specific risks
    if (preds.length === 0 && latentState) {
      preds.push({
        id: 'pred-wellness',
        icon: Sparkles,
        color: 'text-emerald-600',
        title: 'Health Trajectory Stable',
        detail: 'Your current health patterns indicate a stable trajectory. Continue healthy habits to maintain this status for the next 90 days.',
        timeframe: '90 days',
        urgency: 'low',
        action: 'Continue current lifestyle, annual checkup recommended',
      });
    }

    return preds;
  }, [findings, latentState]);

  // Generate proactive alerts
  const alerts: ProactiveAlert[] = useMemo(() => {
    const now = new Date();
    const alerts: ProactiveAlert[] = [
      {
        id: 'alert-morning',
        icon: Clock,
        color: 'text-emerald-600',
        title: 'Morning Health Briefing',
        detail: generateMorningBriefing(latentState, findings.length),
        time: '7:00 AM IST',
        type: 'morning',
      },
    ];

    if (findings.some(f => f.severity === 'critical')) {
      alerts.push({
        id: 'alert-critical',
        icon: AlertTriangle,
        color: 'text-red-600',
        title: 'Critical Health Alert',
        detail: 'Critical findings detected in your recent health data. Immediate medical attention recommended.',
        time: 'Just now',
        type: 'pattern',
      });
    }

    if (latentState && latentState.predicted.stressLevel > 60) {
      alerts.push({
        id: 'alert-stress',
        icon: Brain,
        color: 'text-violet-600',
        title: 'Elevated Stress Detected',
        detail: 'Your stress indicators are elevated. Try 4-7-8 breathing for 2 minutes. Consider a short walk.',
        time: '10 min ago',
        type: 'pattern',
      });
    }

    if (latentState && latentState.predicted.sleepQuality < 50) {
      alerts.push({
        id: 'alert-sleep',
        icon: Moon,
        color: 'text-indigo-600',
        title: 'Sleep Quality Concern',
        detail: 'Your sleep quality appears low. Possible cause: late dinner or screen time. Try eating by 8 PM and screens off by 10 PM.',
        time: '1 hour ago',
        type: 'pattern',
      });
    }

    alerts.push({
      id: 'alert-vitals',
      icon: Activity,
      color: 'text-cyan-600',
      title: 'Vitals Check Reminder',
      detail: "You haven't logged vitals recently. Quick 30-second check recommended for continuous health monitoring.",
      time: '3 days ago',
      type: 'vitals',
    });

    return alerts;
  }, [findings, latentState]);

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));
  const dismissAlert = (id: string) => setDismissedAlerts(prev => new Set([...prev, id]));

  return (
    <div className="space-y-5">
      {/* Brain Visualization + Status */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 opacity-10 rounded-full blur-2xl -ml-12 -mb-12" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center">
          {/* Neural Network SVG */}
          <div className="relative flex-shrink-0">
            <svg viewBox="0 0 300 300" className="w-64 h-64 sm:w-72 sm:h-72">
              <defs>
                <radialGradient id="brainCore" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#00d4aa" stopOpacity="1" />
                  <stop offset="60%" stopColor="#00d4aa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
                </radialGradient>
                <filter id="brainGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connections */}
              {NEURAL_CONNECTIONS.map((conn, i) => {
                const from = NEURAL_NODES.find(n => n.id === conn[0])!;
                const to = NEURAL_NODES.find(n => n.id === conn[1])!;
                const isActive = i === activePulse;
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke={isActive ? '#00d4aa' : 'rgba(0,212,170,0.15)'}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                  />
                );
              })}

              {/* Nodes */}
              {NEURAL_NODES.map(node => {
                const isCore = node.type === 'core';
                const size = isCore ? 16 : node.type === 'input' ? 10 : 6;
                return (
                  <g key={node.id}>
                    {isCore && (
                      <circle cx={node.x} cy={node.y} r="40" fill="url(#brainCore)" filter="url(#brainGlow)"
                        style={{ animation: 'brainPulse 2s ease-in-out infinite' }} />
                    )}
                    <circle
                      cx={node.x} cy={node.y} r={size}
                      fill={isCore ? '#00d4aa' : node.type === 'input' ? 'rgba(0,212,170,0.6)' : 'rgba(139,92,246,0.5)'}
                      stroke={isCore ? '#00d4aa' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="1"
                      style={{
                        animation: isCore ? 'brainPulse 2s ease-in-out infinite' : `nodePulse 3s ease-in-out infinite`,
                        animationDelay: `${NEURAL_NODES.indexOf(node) * 0.2}s`,
                      }}
                    />
                    {node.label && (
                      <text x={node.x} y={node.y + size + 12} textAnchor="middle"
                        fill="rgba(255,255,255,0.5)" fontSize="8" fontWeight="bold">
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Brain status overlay */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-bold text-emerald-300">BRAIN ACTIVE</span>
            </div>
          </div>

          {/* Brain Status Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <Brain className="w-6 h-6 text-teal-400" />
              <h2 className="text-2xl font-extrabold text-white">Aarogya Health Brain</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              {isThinking ? 'Processing health patterns...' : 'Monitoring your health 24/7'}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-xl font-extrabold text-teal-400">{findings.length}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Data Points</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-xl font-extrabold text-violet-400">{predictions.length}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Predictions</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <div className="text-xl font-extrabold text-amber-400">{visibleAlerts.length}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">Alerts</div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center lg:justify-start flex-wrap">
              <span className="text-[10px] text-slate-500">Learning from:</span>
              {['Lab', 'Symptoms', 'Imaging', 'Vitals', 'Meds', 'Diet'].map(tag => (
                <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proactive Alerts */}
      {showAlerts && visibleAlerts.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" /> Proactive Alerts
              <span className="text-xs font-normal text-slate-400 ml-1">Brain-generated, no prompt needed</span>
            </h3>
            <button onClick={() => setShowAlerts(false)} className="text-xs text-slate-400 hover:text-slate-600">Hide</button>
          </div>
          <div className="space-y-2">
            {visibleAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className={`p-2 bg-white rounded-xl ${alert.color} flex-shrink-0`}>
                  <alert.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900">{alert.title}</span>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.detail}</p>
                </div>
                <button onClick={() => dismissAlert(alert.id)} className="text-slate-300 hover:text-slate-500 flex-shrink0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictive Engine */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-600" /> Predictive Engine
          <span className="text-xs font-normal text-slate-400 ml-1">30-60-90 day forecasts</span>
        </h3>
        {predictions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Add health findings to activate predictions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {predictions.map(pred => (
              <div key={pred.id} className={`p-4 rounded-2xl border ${
                pred.urgency === 'high' ? 'border-red-200 bg-red-50' :
                pred.urgency === 'moderate' ? 'border-amber-200 bg-amber-50' :
                'border-emerald-200 bg-emerald-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-white rounded-xl ${pred.color} flex-shrink-0`}>
                    <pred.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">{pred.title}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        pred.urgency === 'high' ? 'bg-red-200 text-red-700' :
                        pred.urgency === 'moderate' ? 'bg-amber-200 text-amber-700' :
                        'bg-emerald-200 text-emerald-700'
                      }`}>{pred.timeframe}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{pred.detail}</p>
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg">
                      <Zap className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700">{pred.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cross-Feature Intelligence */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl p-5">
        <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" /> Cross-Feature Intelligence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-cyan-50 rounded-lg"><Droplets className="w-3.5 h-3.5 text-cyan-600" /></div>
              <div className="p-1.5 bg-rose-50 rounded-lg"><Brain className="w-3.5 h-3.5 text-rose-600" /></div>
              <div className="p-1.5 bg-amber-50 rounded-lg"><Apple className="w-3.5 h-3.5 text-amber-600" /></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-700 mb-1">3-Signal Detection</p>
            <p className="text-[11px] text-slate-500">Lab glucose + fatigue symptom + high sugar diet → pre-diabetic pattern alert</p>
          </div>
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-red-50 rounded-lg"><Heart className="w-3.5 h-3.5 text-red-600" /></div>
              <div className="p-1.5 bg-violet-50 rounded-lg"><Activity className="w-3.5 h-3.5 text-violet-600" /></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs font-bold text-slate-700 mb-1">Cardiac Pattern Watch</p>
            <p className="text-[11px] text-slate-500">BP elevation + cholesterol abnormal → cardiac risk compound detected</p>
          </div>
        </div>
      </div>

      {/* Scoped animations */}
      <style jsx>{`
        @keyframes brainPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

function generateMorningBriefing(latentState: any, findingCount: number): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (latentState) {
    const score = Math.round((latentState.metabolicScore + latentState.cardiovascularScore + latentState.immuneScore + latentState.nutritionalScore) / 4);
    return `${greeting}! Your overall health score is ${score}/100. ${latentState.deficiencies.length > 0 ? `Detected: ${latentState.deficiencies.join(', ')}.` : 'No deficiencies detected.'} ${latentState.predicted.energyLevel > 60 ? 'Energy looks good today!' : 'Energy may be low — prioritize rest.'}`;
  }
  return `${greeting}! You have ${findingCount} health data points logged. Start your day by logging vitals for continuous monitoring.`;
}

export default AarogyaHealthBrain;
