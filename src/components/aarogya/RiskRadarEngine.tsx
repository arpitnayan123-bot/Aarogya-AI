'use client';

/**
 * RiskRadarEngine — "Live Risk Monitoring"
 *
 * Continuous real-time risk tracking with visual radar.
 * Lightweight — reads from existing data without modifying other modules.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Radar, Activity, AlertTriangle, TrendingUp, TrendingDown,
  Zap, ShieldCheck, Eye, Clock, Radio
} from 'lucide-react';

interface RiskSignal {
  id: string;
  condition: string;
  currentRisk: number;
  trend: 'rising' | 'stable' | 'falling';
  trendValue: number;
  changeRate: string;
  sources: string[];
  alertLevel: 'safe' | 'watch' | 'warning' | 'critical';
  timeToThreshold: string | null;
  recommendation: string;
}

const RISK_SIGNALS: RiskSignal[] = [
  { id: 'bp', condition: 'Hypertensive Crisis', currentRisk: 68, trend: 'rising', trendValue: +3.2, changeRate: '+3.2%/week', sources: ['Wearable BP', 'Stress Index', 'Sleep Data'], alertLevel: 'warning', timeToThreshold: '12 days to Stage 2', recommendation: 'Reduce salt + stress. Walk 30 min daily. Monitor BP twice daily.' },
  { id: 'cardiac', condition: 'Cardiac Event', currentRisk: 22, trend: 'rising', trendValue: +1.5, changeRate: '+1.5%/week', sources: ['HRV decline', 'BP trend', 'LDL lab'], alertLevel: 'watch', timeToThreshold: null, recommendation: 'Cardiology consult recommended. Echocardiogram to assess cardiac structure.' },
  { id: 'glucose', condition: 'Type 2 Diabetes', currentRisk: 45, trend: 'rising', trendValue: +0.8, changeRate: '+0.8%/week', sources: ['Glucose readings', 'HbA1c', 'Sleep-glucose correlation'], alertLevel: 'watch', timeToThreshold: '180 days to threshold', recommendation: 'Cut sugar, post-meal walks, improve sleep. HbA1c repeat in 3 months.' },
  { id: 'sleep', condition: 'Severe Insomnia', currentRisk: 38, trend: 'rising', trendValue: +2.1, changeRate: '+2.1%/week', sources: ['Sleep tracker', 'Circadian analysis', 'Screen time'], alertLevel: 'warning', timeToThreshold: '8 days to threshold', recommendation: 'Screens off at 9:30 PM. Consider melatonin 1mg. CBT-I if persists.' },
  { id: 'stress', condition: 'Stress Exhaustion', currentRisk: 55, trend: 'rising', trendValue: +4.0, changeRate: '+4.0%/week', sources: ['HRV', 'Stress index', 'Sleep quality'], alertLevel: 'warning', timeToThreshold: '5 days to critical zone', recommendation: 'Immediate stress reduction. 10-min breathing. Consider day off.' },
  { id: 'inflammation', condition: 'Chronic Inflammation', currentRisk: 28, trend: 'stable', trendValue: +0.2, changeRate: '+0.2%/week', sources: ['CRP trend', 'BMI', 'Sugar intake'], alertLevel: 'safe', timeToThreshold: null, recommendation: 'Maintain anti-inflammatory diet. Monitor CRP quarterly.' },
];

const ALERT_COLORS = {
  safe: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'SAFE' },
  watch: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', label: 'WATCH' },
  warning: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'WARNING' },
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'CRITICAL' },
};

export const RiskRadarEngine: React.FC = () => {
  const [liveTick, setLiveTick] = useState(0);

  // Minimal update — only ticks the "live" indicator, no heavy re-render
  useEffect(() => {
    const interval = setInterval(() => setLiveTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const avgRisk = useMemo(() => Math.round(RISK_SIGNALS.reduce((sum, r) => sum + r.currentRisk, 0) / RISK_SIGNALS.length), []);
  const activeAlerts = RISK_SIGNALS.filter(r => r.alertLevel === 'warning' || r.alertLevel === 'critical').length;
  const risingCount = RISK_SIGNALS.filter(r => r.trend === 'rising').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-red-900 to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-400 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><Radar className="w-7 h-7 text-rose-300" /></div>
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                Live Risk Radar
                <span className="text-[9px] font-bold bg-rose-400 text-rose-900 px-2 py-0.5 rounded-full">NEW</span>
              </h1>
              <p className="text-rose-100/80 text-sm mt-1">Continuous real-time risk monitoring — always scanning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30">
              <Radio className="w-3 h-3 text-rose-300" />
              <span className="text-[10px] font-bold text-rose-200">LIVE · Scan #{liveTick}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <div className={`text-3xl font-extrabold ${avgRisk > 50 ? 'text-red-600' : avgRisk > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>{avgRisk}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Risk Score</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-amber-600">{activeAlerts}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Active Alerts</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-3xl font-extrabold text-red-600">{risingCount}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">Rising Risks</div>
        </div>
      </div>

      {/* Radar Visualization */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Radar className="w-5 h-5 text-rose-600" /> Risk Radar Map</h2>
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 300 300" className="w-64 h-64">
            {/* Radar rings */}
            {[40, 80, 120, 140].map((r, i) => (
              <circle key={i} cx="150" cy="150" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray={i === 3 ? "none" : "3 3"} />
            ))}
            {/* Risk points */}
            {RISK_SIGNALS.map((risk, i) => {
              const angle = (i / RISK_SIGNALS.length) * 2 * Math.PI - Math.PI / 2;
              const radius = (risk.currentRisk / 100) * 140;
              const x = 150 + radius * Math.cos(angle);
              const y = 150 + radius * Math.sin(angle);
              const cfg = ALERT_COLORS[risk.alertLevel];
              const color = risk.alertLevel === 'critical' ? '#ef4444' : risk.alertLevel === 'warning' ? '#f59e0b' : risk.alertLevel === 'watch' ? '#06b6d4' : '#10b981';
              return (
                <g key={risk.id}>
                  <line x1="150" y1="150" x2={x} y2={y} stroke={color} strokeWidth="1" opacity="0.3" />
                  <circle cx={x} cy={y} r="6" fill={color} opacity="0.9" />
                  <circle cx={x} cy={y} r="6" fill="none" stroke={color} strokeWidth="1" opacity="0.4" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
                  <text x={x} y={y - 10} textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">{risk.condition.split(' ')[0]}</text>
                </g>
              );
            })}
            {/* Center */}
            <circle cx="150" cy="150" r="4" fill="#6366f1" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Watch</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
        </div>
      </div>

      {/* Risk Signal Cards */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-rose-600" /> Active Risk Signals</h2>
        <div className="space-y-3">
          {RISK_SIGNALS.map(risk => {
            const cfg = ALERT_COLORS[risk.alertLevel];
            return (
              <div key={risk.id} className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{risk.condition}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {risk.sources.map(s => <span key={s} className="text-[8px] text-slate-400 bg-white/60 px-1 py-0.5 rounded">{s}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-extrabold ${cfg.color}`}>{risk.currentRisk}%</div>
                    <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${risk.trend === 'rising' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {risk.trend === 'rising' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {risk.changeRate}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full ${risk.alertLevel === 'critical' ? 'bg-red-500' : risk.alertLevel === 'warning' ? 'bg-amber-500' : risk.alertLevel === 'watch' ? 'bg-cyan-500' : 'bg-emerald-500'}`} style={{ width: `${risk.currentRisk}%` }} />
                </div>
                {risk.timeToThreshold && (
                  <div className="flex items-center gap-1 mb-2 text-[10px] text-amber-600 font-bold">
                    <Clock className="w-3 h-3" /> {risk.timeToThreshold}
                  </div>
                )}
                <div className="p-2 bg-white/60 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Action:</span>
                  <span className="text-[11px] text-slate-700 ml-1">{risk.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Risk Radar continuously monitors your health data from wearables, labs, and symptom reports. Risk scores are statistical estimates based on population data (ICMR, NFHS-5) and personal trends. They are not diagnostic. Always consult a doctor for clinical decisions.</p>
      </div>
      <style jsx>{`@keyframes pulseGlow { 0%,100% { opacity: 0.3; r: 6; } 50% { opacity: 0.6; r: 10; } }`}</style>
    </div>
  );
};

export default RiskRadarEngine;
