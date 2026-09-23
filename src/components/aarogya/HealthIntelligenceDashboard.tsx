'use client';

/**
 * HealthIntelligenceDashboard — The unified cross-module intelligence view.
 *
 * This is the "brain output" of Aarogya AI. It displays:
 * - Cross-module insights (auto-generated from findings across all modules)
 * - Prioritized decision recommendations
 * - Findings from all modules in one view
 * - Causal chain explanations
 *
 * This component consumes the useHealthContext store, which is the
 * shared state layer connecting all health modules.
 */

import React, { useState } from 'react';
import {
  Brain, AlertTriangle, CheckCircle2, Activity, Heart, Droplet,
  Pill, Stethoscope, ScanLine, TrendingUp, Zap, ArrowRight,
  ChevronDown, ChevronUp, Bell, ShieldAlert, Sparkles, X, Plus
} from 'lucide-react';
import { useHealthContext, type FindingSource, type FindingSeverity } from '@/lib/healthContext';
import { LatentHealthVisualizer } from './LatentHealthVisualizer';

const SEVERITY_CONFIG: Record<FindingSeverity, { color: string; bg: string; border: string; label: string; icon: any }> = {
  normal: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Normal', icon: CheckCircle2 },
  borderline: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Borderline', icon: AlertTriangle },
  abnormal: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Abnormal', icon: AlertTriangle },
  critical: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', label: 'Critical', icon: ShieldAlert },
};

const SOURCE_CONFIG: Record<FindingSource, { label: string; icon: any; color: string }> = {
  lab_report: { label: 'Lab Report', icon: Activity, color: 'text-cyan-600' },
  xray: { label: 'X-Ray', icon: ScanLine, color: 'text-violet-600' },
  skin: { label: 'Skin Scan', icon: Stethoscope, color: 'text-pink-600' },
  symptom: { label: 'Symptom Check', icon: Brain, color: 'text-rose-600' },
  disease_prediction: { label: 'Disease Predictor', icon: TrendingUp, color: 'text-amber-600' },
  vitals: { label: 'Vitals', icon: Heart, color: 'text-red-600' },
  manual: { label: 'Manual', icon: Plus, color: 'text-slate-600' },
};

const URGENCY_CONFIG = {
  routine: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  within_week: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertTriangle },
  urgent: { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertTriangle },
  emergency: { color: 'text-red-700 bg-red-100 border-red-300', icon: ShieldAlert },
};

const PRIORITY_CONFIG = {
  critical: { color: 'text-red-700 bg-red-100 border-red-300', label: 'CRITICAL', icon: ShieldAlert },
  high: { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'HIGH', icon: AlertTriangle },
  medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'MEDIUM', icon: Bell },
  low: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'LOW', icon: CheckCircle2 },
};

export const HealthIntelligenceDashboard: React.FC = () => {
  const {
    findings, insights, recommendations, profile,
    addFinding, removeFinding, clearFindings, updateProfile,
    dismissInsight, dismissRecommendation,
  } = useHealthContext();

  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [showAddFinding, setShowAddFinding] = useState(false);
  const [newFinding, setNewFinding] = useState({
    source: 'manual' as FindingSource,
    category: '',
    name: '',
    value: '',
    severity: 'borderline' as FindingSeverity,
    details: '',
  });

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const abnormalCount = findings.filter(f => f.severity === 'abnormal').length;
  const normalCount = findings.filter(f => f.severity === 'normal').length;

  const handleAddFinding = () => {
    if (!newFinding.name) return;
    addFinding({
      ...newFinding,
      confidence: 80,
    });
    setNewFinding({ source: 'manual', category: '', name: '', value: '', severity: 'borderline', details: '' });
    setShowAddFinding(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300 opacity-10 rounded-full blur-2xl -ml-12 -mb-12" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">Health Intelligence Hub</h1>
              <p className="text-violet-50/90 text-sm mt-1">Cross-module reasoning · Integrated insights · Decision engine</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> {insights.length} insights</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> {recommendations.length} actions</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Activity className="w-3 h-3" /> {findings.length} findings</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddFinding(!showAddFinding)}
            className="bg-white text-violet-700 font-bold px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Finding
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-red-50 rounded-xl"><ShieldAlert className="w-5 h-5 text-red-600" /></div>
          <div>
            <div className="text-2xl font-extrabold text-red-600">{criticalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Critical</div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-amber-50 rounded-xl"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">{abnormalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Abnormal</div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">{normalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Normal</div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-violet-50 rounded-xl"><Brain className="w-5 h-5 text-violet-600" /></div>
          <div>
            <div className="text-2xl font-extrabold text-violet-600">{insights.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Insights</div>
          </div>
        </div>
      </div>

      {/* Cross-Module Insights */}
      {insights.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" /> Cross-Module Insights
            <span className="text-xs font-normal text-slate-400 ml-2">Auto-generated from integrated analysis</span>
          </h2>
          <div className="space-y-3">
            {insights.map(insight => {
              const urgencyCfg = URGENCY_CONFIG[insight.urgency];
              const UrgencyIcon = urgencyCfg.icon;
              return (
                <div key={insight.id} className={`p-4 rounded-2xl border ${urgencyCfg.color}`}>
                  <div className="flex items-start gap-3">
                    <UrgencyIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm">{insight.insight}</span>
                        <button onClick={() => dismissInsight(insight.id)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Modules involved */}
                      <div className="flex items-center gap-1 flex-wrap mb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Modules:</span>
                        {insight.modules.map((mod, i) => {
                          const cfg = SOURCE_CONFIG[mod as FindingSource] || { label: mod, icon: Sparkles, color: 'text-slate-500' };
                          return (
                            <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 ${cfg.color} flex items-center gap-0.5`}>
                              <cfg.icon className="w-2.5 h-2.5" /> {cfg.label}
                            </span>
                          );
                        })}
                      </div>
                      {/* Causal chain */}
                      <div className="text-xs text-slate-600 bg-white/50 rounded-lg px-3 py-2 mb-2">
                        <span className="font-bold">Causal chain: </span>{insight.causalChain}
                      </div>
                      {/* Recommended actions */}
                      {insight.recommendedActions.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Actions:</span>
                          {insight.recommendedActions.map((action, i) => (
                            <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-700 border border-slate-200">
                              {action}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Decision Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" /> Decision & Action Recommendations
          </h2>
          <div className="space-y-2">
            {recommendations.map(rec => {
              const cfg = PRIORITY_CONFIG[rec.priority];
              return (
                <div key={rec.id} className={`p-3 rounded-2xl border ${cfg.color} flex items-center gap-3`}>
                  <div className="p-1.5 bg-white rounded-lg"><cfg.icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">{cfg.label}</span>
                      <span className="text-sm font-bold">{rec.action}</span>
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">{rec.reason}</div>
                    <div className="text-[9px] opacity-60 mt-0.5">Source: {rec.source} · Impact: {rec.estimatedImpact}</div>
                  </div>
                  <button onClick={() => dismissRecommendation(rec.id)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Finding Form */}
      {showAddFinding && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm animate-fadeInScale">
          <h3 className="font-extrabold text-slate-900 mb-4">Add Health Finding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={newFinding.source} onChange={e => setNewFinding({ ...newFinding, source: e.target.value as FindingSource })} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {Object.entries(SOURCE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={newFinding.severity} onChange={e => setNewFinding({ ...newFinding, severity: e.target.value as FindingSeverity })} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {Object.entries(SEVERITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input value={newFinding.category} onChange={e => setNewFinding({ ...newFinding, category: e.target.value })} placeholder="Category (e.g., Blood Count)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={newFinding.name} onChange={e => setNewFinding({ ...newFinding, name: e.target.value })} placeholder="Name (e.g., Hemoglobin)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={newFinding.value} onChange={e => setNewFinding({ ...newFinding, value: e.target.value })} placeholder="Value (e.g., 11.2 g/dL)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <input value={newFinding.details} onChange={e => setNewFinding({ ...newFinding, details: e.target.value })} placeholder="Details (optional)" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAddFinding} className="flex-1 bg-violet-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-violet-700 transition-colors">Add Finding</button>
            <button onClick={() => setShowAddFinding(false)} className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Latent Health State (JEPA) + Findings — 2-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <LatentHealthVisualizer />
        <div className="space-y-5">

      {/* All Findings */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" /> All Findings ({findings.length})
          </h2>
          {findings.length > 0 && (
            <button onClick={clearFindings} className="text-xs font-bold text-red-500 hover:text-red-600">Clear All</button>
          )}
        </div>
        {findings.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No findings yet</p>
            <p className="text-xs mt-1">Add a finding or use other health modules to populate the intelligence hub</p>
          </div>
        ) : (
          <div className="space-y-2">
            {findings.map(finding => {
              const sevCfg = SEVERITY_CONFIG[finding.severity];
              const srcCfg = SOURCE_CONFIG[finding.source];
              const isExpanded = expandedFinding === finding.id;
              return (
                <div key={finding.id} className={`p-3 rounded-2xl border ${sevCfg.border} ${sevCfg.bg}`}>
                  <button
                    onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <div className={`p-1.5 rounded-lg bg-white ${sevCfg.color}`}><sevCfg.icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{finding.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white ${sevCfg.color}`}>{sevCfg.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className={`flex items-center gap-0.5 ${srcCfg.color}`}><srcCfg.icon className="w-3 h-3" /> {srcCfg.label}</span>
                        <span>·</span>
                        <span>{finding.category}</span>
                        {finding.value && <><span>·</span><span className="font-bold">{finding.value}</span></>}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isExpanded && finding.details && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                      {finding.details}
                      {finding.confidence && <div className="mt-1 text-[10px] text-slate-400">Confidence: {finding.confidence}%</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl p-5">
        <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-600" /> How Cross-Module Intelligence Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="bg-white p-3 rounded-xl">
            <div className="font-bold text-slate-800 mb-1">1. Findings Collected</div>
            <p>Each module (Lab, X-ray, Symptoms, etc.) feeds findings into the shared context store</p>
          </div>
          <div className="bg-white p-3 rounded-xl">
            <div className="font-bold text-slate-800 mb-1">2. Reasoning Engine Activates</div>
            <p>Causal rules detect relationships: high glucose + high HbA1c → diabetes risk escalation</p>
          </div>
          <div className="bg-white p-3 rounded-xl">
            <div className="font-bold text-slate-800 mb-1">3. Decisions Prioritized</div>
            <p>Insights generate prioritized recommendations based on urgency and impact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthIntelligenceDashboard;
