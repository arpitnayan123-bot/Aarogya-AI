'use client';

/**
 * ContinuousIntelligenceEngine — "Continuous Intelligence" section.
 *
 * 6 panels:
 * 1. Live Health Stream — real-time readings with expected vs actual
 * 2. Trend Evolution Dashboard — micro-deviation visualization
 * 3. Early Risk Signals — 7-day and 30-day forecasts
 * 4. Behavioral + Physiological Correlation Map
 * 5. Predictive Timeline — upcoming events and warnings
 * 6. AI Intervention Feed — real-time micro-actions
 *
 * Feels like: a living intelligence, a silent observer, a predictive doctor.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity, Brain, TrendingUp, TrendingDown, AlertTriangle,
  Zap, Clock, Target, Sparkles, ShieldQuestion, Wifi,
  ChevronRight, ArrowRight, CheckCircle2, Radio
} from 'lucide-react';
import { analyzeContinuous, type CHIEAnalysis, type AnomalyDetection } from '@/lib/continuousEngine';

const STATUS_CONFIG = {
  normal: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Normal' },
  micro_deviation: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Micro-Deviation' },
  deviation: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Deviation' },
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' },
};

const SEVERITY_CONFIG = {
  info: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  watch: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  warning: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  alert: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export const ContinuousIntelligenceEngine: React.FC = () => {
  const analysis: CHIEAnalysis = useMemo(() => analyzeContinuous(), []);
  const [selectedForecast, setSelectedForecast] = useState<'7day' | '30day'>('7day');
  const [pulse, setPulse] = useState(0);

  // Subtle "living" pulse — CSS only, no re-render
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const forecast = selectedForecast === '7day' ? analysis.riskForecast7Day : analysis.riskForecast30Day;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header — Living Intelligence */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-teal-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-teal-400 blur-[100px]" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }} />
        </div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Radio className="w-7 h-7 text-teal-300" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                Continuous Intelligence
                <span className="text-[9px] font-bold bg-teal-400 text-teal-900 px-2 py-0.5 rounded-full">CHIE</span>
              </h1>
              <p className="text-teal-100/80 text-sm mt-1">Always watching. Always learning. Always predicting.</p>
            </div>
          </div>
          {/* System Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30">
              <Wifi className="w-3 h-3 text-teal-300" />
              <span className="text-[10px] font-bold text-teal-200">LIVE · {analysis.systemStatus.dataStreams} streams</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-200">{analysis.systemStatus.deviationsDetected} deviations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Insight — Silent Observer */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-6 shadow-xl border border-teal-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500 opacity-10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-teal-500/20 rounded-xl"><Brain className="w-5 h-5 text-teal-400" /></div>
            <div>
              <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider">Silent Observer — Active Intelligence</h2>
              <p className="text-[10px] text-slate-400">Continuously monitoring {analysis.systemStatus.dataStreams} health signals</p>
            </div>
          </div>
          <p className="text-base font-bold text-white leading-relaxed">{analysis.primaryInsight}</p>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30">
              <ShieldQuestion className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-bold text-teal-300">{analysis.systemStatus.baselineConfidence}% baseline confidence</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-bold text-violet-300">{analysis.systemStatus.predictionsGenerated} predictions generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 1: Live Health Stream */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" /> Live Health Stream
          <span className="text-xs font-normal text-slate-400 ml-1">Real-time · Expected vs Actual</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {analysis.liveStream.map(reading => {
            const cfg = STATUS_CONFIG[reading.status];
            return (
              <div key={reading.variableId} className={`p-3 rounded-2xl border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{reading.label}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-slate-900">{reading.value}</span>
                  <span className="text-[10px] text-slate-400">{reading.unit}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[9px]">
                  <span className="text-slate-400">Expected: {reading.expected}</span>
                  <span className={`font-bold ${reading.deviation > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {reading.deviation > 0 ? '+' : ''}{reading.deviationPercent}%
                  </span>
                </div>
                {/* Mini deviation bar */}
                <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${reading.status === 'normal' ? 'bg-emerald-400' : reading.status === 'micro_deviation' ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, Math.abs(reading.deviationPercent) * 2)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 2: Trend Evolution (Anomaly Detection) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-amber-500" /> Trend Evolution Dashboard
          <span className="text-xs font-normal text-slate-400 ml-1">Micro-deviations even within normal range</span>
        </h2>
        <div className="space-y-3">
          {analysis.anomalies.map(anomaly => (
            <div key={anomaly.id} className={`p-4 rounded-2xl border ${SEVERITY_CONFIG[anomaly.severity].border} ${SEVERITY_CONFIG[anomaly.severity].bg}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{anomaly.variableLabel}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[anomaly.severity].bg} ${SEVERITY_CONFIG[anomaly.severity].color}`}>
                      {anomaly.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{anomaly.description}</p>
                </div>
                <span className={`text-[9px] font-bold ${SEVERITY_CONFIG[anomaly.severity].color}`}>{anomaly.daysDetecting}d</span>
              </div>

              {/* Trend sparkline */}
              <div className="flex items-end gap-1 h-8 mb-2">
                {anomaly.trend.map((v, i) => {
                  const max = Math.max(...anomaly.trend);
                  const min = Math.min(...anomaly.trend);
                  const range = max - min || 1;
                  return <div key={i} className="flex-1 rounded-sm" style={{ height: `${((v - min) / range) * 100}%`, background: SEVERITY_CONFIG[anomaly.severity].color.replace('text-', 'rgb '), minHeight: '3px', opacity: i === anomaly.trend.length - 1 ? 1 : 0.4 }} />;
                })}
              </div>

              {/* Causal chain */}
              <div className="p-2 bg-white/60 rounded-lg mb-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Causal Chain</div>
                <p className="text-[11px] text-slate-700">{anomaly.causalChain}</p>
              </div>

              {/* Clinical mapping */}
              <div className="p-2 bg-white/60 rounded-lg mb-2">
                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Clinical Significance</div>
                <p className="text-[11px] text-slate-600">{anomaly.clinicalMapping}</p>
              </div>

              {/* Correlated systems */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[9px] font-bold text-slate-400">Systems:</span>
                {anomaly.correlatedSystems.map(sys => (
                  <span key={sys} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/60 text-slate-600">{sys}</span>
                ))}
                <span className="text-[9px] font-bold text-slate-400 ml-auto">{anomaly.confidence}% conf.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Early Risk Signals */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> Early Risk Signals
          </h2>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setSelectedForecast('7day')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${selectedForecast === '7day' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>7 Days</button>
            <button onClick={() => setSelectedForecast('30day')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${selectedForecast === '30day' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>30 Days</button>
          </div>
        </div>
        <p className="text-xs text-slate-600 mb-3 p-3 bg-slate-50 rounded-xl">{forecast.summary}</p>
        <div className="space-y-2">
          {forecast.risks.map((risk, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{risk.condition}</span>
                  {risk.daysToOnset && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">{risk.daysToOnset}d to onset</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{risk.currentProbability}%</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className={`text-sm font-extrabold ${risk.trend === 'rising' ? 'text-red-600' : risk.trend === 'falling' ? 'text-emerald-600' : 'text-slate-500'}`}>{risk.projectedProbability}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${risk.trend === 'rising' ? 'bg-red-500' : risk.trend === 'falling' ? 'bg-emerald-500' : 'bg-slate-400'}`} style={{ width: `${risk.projectedProbability}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span className={`font-bold ${risk.trend === 'rising' ? 'text-red-500' : 'text-emerald-500'}`}>{risk.changePercent > 0 ? '+' : ''}{risk.changePercent}% change</span>
                <span>{risk.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: Behavioral + Physiological Correlation Map */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-600" /> Behavioral + Physiological Correlation
        </h2>
        <div className="space-y-3">
          {analysis.correlations.map(corr => (
            <div key={corr.id} className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{corr.behavior}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">{corr.physiology}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold ${corr.direction === 'positive' ? 'text-red-600' : 'text-emerald-600'}`}>
                    r = {corr.correlation.toFixed(2)}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${corr.strength === 'strong' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>{corr.strength}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-2">{corr.description}</p>
              <div className="space-y-0.5">
                {corr.evidence.map((e, i) => (
                  <div key={i} className="flex items-start gap-1 text-[11px] text-slate-500">
                    <span className="text-violet-400 mt-0.5">•</span> {e}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 5: Predictive Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" /> Predictive Timeline
          <span className="text-xs font-normal text-slate-400 ml-1">Upcoming events and early warnings</span>
        </h2>
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />
          {analysis.timeline.map(event => {
            const cfg = SEVERITY_CONFIG[event.severity];
            return (
              <div key={event.id} className="relative">
                <div className={`absolute -left-4 top-2 w-3 h-3 rounded-full ${cfg.bg} border-2 border-white shadow-sm`} />
                <div className={`p-3 rounded-2xl border ${cfg.border} ${cfg.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{event.title}</span>
                    <span className="text-[10px] text-slate-400">{new Date(event.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p className="text-xs text-slate-600">{event.description}</p>
                  {event.actionRequired && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-amber-600">
                      <Zap className="w-3 h-3" /> Action required
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel 6: AI Intervention Feed */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> AI Intervention Feed
          <span className="text-xs font-normal text-slate-400 ml-1">Real-time micro-actions</span>
        </h2>
        <div className="space-y-2">
          {analysis.interventions.map(int => (
            <div key={int.id} className={`p-3 rounded-2xl border ${int.urgency === 'high' ? 'border-red-200 bg-red-50' : int.urgency === 'medium' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">{int.action}</span>
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${int.urgency === 'high' ? 'bg-red-100 text-red-600' : int.urgency === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{int.urgency}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">Trigger: {int.trigger}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> {int.expectedImpact}</span>
                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {int.timeToEffect}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer — System Identity */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-3xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </div>
          <span className="text-sm font-bold text-teal-300">CHIE is actively monitoring your health</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
          This system continuously learns your patterns, detects deviations before symptoms appear, and generates personalized interventions.
          It is a silent observer — always watching, always predicting, always protecting.
        </p>
      </div>

      {/* Scoped animation */}
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default ContinuousIntelligenceEngine;
