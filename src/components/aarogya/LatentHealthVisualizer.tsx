'use client';

/**
 * LatentHealthVisualizer — JEPA-inspired latent health state display.
 *
 * Shows the PREDICTED HIDDEN VARIABLES that aren't directly measured
 * but are inferred from observed findings. This is the "joint embedding"
 * output — abstract health dimensions derived from concrete data.
 *
 * Features:
 * - Radial health dimensions (metabolic, cardiovascular, immune, etc.)
 * - Organ stress heatmap
 * - Predicted hidden variables (biological age, energy, sleep, stress, recovery)
 * - Similar pattern matching
 * - Health embedding visualization
 */

import React, { useMemo } from 'react';
import {
  Brain, Heart, Activity, Zap, Moon, Battery,
  TrendingUp, AlertCircle, Sparkles, Flame, Shield, Gauge
} from 'lucide-react';
import { useHealthContext } from '@/lib/healthContext';
import { predictLatentHealthState, findSimilarPatterns, type LatentHealthState } from '@/lib/latentHealthEngine';

export const LatentHealthVisualizer: React.FC = () => {
  const { findings, profile } = useHealthContext();

  const latentState: LatentHealthState | null = useMemo(() => {
    if (findings.length === 0) return null;
    return predictLatentHealthState(findings, profile);
  }, [findings, profile]);

  const similarPatterns = useMemo(() => {
    if (!latentState) return [];
    return findSimilarPatterns(latentState);
  }, [latentState]);

  if (!latentState) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center">
        <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <h3 className="font-extrabold text-slate-900 mb-1">Latent Health State</h3>
        <p className="text-sm text-slate-400">Add health findings to reveal your hidden health dimensions</p>
        <p className="text-xs text-slate-400 mt-2">JEPA-inspired engine predicts unmeasured variables from observed data</p>
      </div>
    );
  }

  const healthDimensions = [
    { label: 'Metabolic', value: latentState.metabolicScore, color: '#10b981', icon: Activity },
    { label: 'Cardiovascular', value: latentState.cardiovascularScore, color: '#ef4444', icon: Heart },
    { label: 'Immune', value: latentState.immuneScore, color: '#8b5cf6', icon: Shield },
    { label: 'Nutritional', value: latentState.nutritionalScore, color: '#f59e0b', icon: Zap },
  ];

  const hiddenVars = [
    { label: 'Biological Age', value: latentState.predicted.biologicalAge, max: 100, unit: 'yrs', icon: Brain, color: 'text-violet-600', compare: profile.age },
    { label: 'Energy Level', value: latentState.predicted.energyLevel, max: 100, unit: '%', icon: Zap, color: 'text-amber-500' },
    { label: 'Sleep Quality', value: latentState.predicted.sleepQuality, max: 100, unit: '%', icon: Moon, color: 'text-indigo-500' },
    { label: 'Stress Level', value: latentState.predicted.stressLevel, max: 100, unit: '%', icon: Flame, color: 'text-red-500' },
    { label: 'Recovery', value: latentState.predicted.recoveryCapacity, max: 100, unit: '%', icon: Battery, color: 'text-emerald-500' },
  ];

  const organLabels: Record<string, string> = {
    liver: 'Liver', kidney: 'Kidney', heart: 'Heart', lungs: 'Lungs', thyroid: 'Thyroid', pancreas: 'Pancreas'
  };

  const getStressColor = (val: number) => {
    if (val < 20) return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Normal' };
    if (val < 40) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Mild' };
    if (val < 60) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Moderate' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'High' };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-5 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-12 -mt-12" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              Latent Health State
              <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full">JEPA</span>
            </h3>
            <p className="text-violet-50/80 text-xs">Predicted hidden dimensions from observed findings</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> {latentState.confidence}% confidence
              </span>
              <span className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded-full">
                {findings.length} data points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Dimensions — Radial Bars */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="font-extrabold text-slate-900 mb-4 text-sm flex items-center gap-2">
          <Gauge className="w-4 h-4 text-violet-600" /> Health Dimensions
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {healthDimensions.map(dim => (
            <div key={dim.label} className="text-center">
              {/* Radial progress */}
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke={dim.color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - dim.value / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <dim.icon className="w-4 h-4 mb-0.5" style={{ color: dim.color }} />
                  <span className="text-xl font-extrabold text-slate-900">{dim.value}</span>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-700">{dim.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted Hidden Variables — JEPA Core */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="font-extrabold text-slate-900 mb-4 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-600" /> Predicted Hidden Variables
          <span className="text-[9px] font-normal text-slate-400 ml-1">Inferred, not measured</span>
        </h4>
        <div className="space-y-3">
          {hiddenVars.map(hv => (
            <div key={hv.label} className="flex items-center gap-3">
              <div className={`p-1.5 bg-slate-50 rounded-lg ${hv.color}`}>
                <hv.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{hv.label}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-extrabold ${hv.color}`}>{hv.value}{hv.unit}</span>
                    {hv.compare && (
                      <span className={`text-[9px] font-bold ${hv.value > hv.compare ? 'text-amber-500' : 'text-emerald-500'}`}>
                        ({hv.value > hv.compare ? '+' : ''}{hv.value - (hv.compare as number)} vs actual)
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      hv.label === 'Stress Level'
                        ? hv.value > 60 ? 'bg-red-500' : hv.value > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                        : hv.value > 70 ? 'bg-emerald-500' : hv.value > 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(hv.value / hv.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organ Stress Heatmap */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="font-extrabold text-slate-900 mb-4 text-sm flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-600" /> Organ System Stress
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(latentState.organStress).map(([organ, stress]) => {
            const cfg = getStressColor(stress);
            return (
              <div key={organ} className="text-center p-3 bg-slate-50 rounded-2xl">
                <div className={`text-2xl font-extrabold ${cfg.text}`}>{stress}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{organLabels[organ]}</div>
                <div className={`text-[9px] font-bold ${cfg.text} mt-1`}>{cfg.label}</div>
                <div className="h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full ${cfg.bg} rounded-full transition-all duration-1000`} style={{ width: `${stress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inflammation & Trajectory */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-700">Inflammation</span>
          </div>
          <div className={`text-2xl font-extrabold ${
            latentState.inflammationTrend === 'low' ? 'text-emerald-600' :
            latentState.inflammationTrend === 'moderate' ? 'text-amber-600' :
            latentState.inflammationTrend === 'high' ? 'text-orange-600' : 'text-red-600'
          }`}>
            {latentState.inflammationLevel}
          </div>
          <div className="text-[10px] text-slate-400 capitalize">{latentState.inflammationTrend} inflammation</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-bold text-slate-700">Metabolic Trend</span>
          </div>
          <div className={`text-2xl font-extrabold capitalize ${
            latentState.metabolicTrajectory === 'improving' ? 'text-emerald-600' :
            latentState.metabolicTrajectory === 'stable' ? 'text-amber-600' : 'text-red-600'
          }`}>
            {latentState.metabolicTrajectory}
          </div>
          <div className="text-[10px] text-slate-400">Score: {latentState.metabolicScore}/100</div>
        </div>
      </div>

      {/* Nutritional Deficiencies */}
      {latentState.deficiencies.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h4 className="font-extrabold text-slate-900 mb-3 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Detected Deficiencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {latentState.deficiencies.map((def, i) => (
              <span key={i} className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
                {def}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Similar Pattern Matching */}
      {similarPatterns.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h4 className="font-extrabold text-slate-900 mb-3 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" /> Pattern Match
            <span className="text-[9px] font-normal text-slate-400 ml-1">Embedding similarity</span>
          </h4>
          <div className="space-y-2">
            {similarPatterns.slice(0, 3).map(p => (
              <div key={p.id} className="p-3 bg-violet-50 rounded-2xl border border-violet-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">{p.label}</span>
                  <span className="text-xs font-extrabold text-violet-600">{Math.round(p.similarity * 100)}% match</span>
                </div>
                <p className="text-xs text-slate-600 mb-1">📊 {p.outcome}</p>
                <p className="text-xs text-violet-700 font-medium">💡 {p.recommendedAction}</p>
                {/* Similarity bar */}
                <div className="h-1 bg-violet-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${p.similarity * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Embedding Visualization */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="font-extrabold text-slate-900 mb-3 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600" /> Health Embedding Vector
          <span className="text-[9px] font-normal text-slate-400 ml-1">16D latent space</span>
        </h4>
        <div className="flex items-end gap-1 h-16">
          {latentState.healthEmbedding.map((val, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-1000"
              style={{
                height: `${val * 100}%`,
                background: val > 0.7 ? '#10b981' : val > 0.5 ? '#f59e0b' : val > 0.3 ? '#f97316' : '#ef4444',
              }}
              title={`${EMBEDDING_LABELS[i] || `Dim ${i+1}`}: ${Math.round(val * 100)}%`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-bold uppercase">
          <span>Meta</span><span>Cardio</span><span>Inflam</span><span>Immune</span>
          <span>Nutr</span><span>Hepat</span><span>Renal</span><span>Thyr</span>
        </div>
      </div>
    </div>
  );
};

const EMBEDDING_LABELS = [
  'Metabolic', 'Cardiovascular', 'Inflammatory', 'Immune', 'Nutritional',
  'Hepatic', 'Renal', 'Thyroid', 'Respiratory', 'Hematological',
  'Neurological', 'Musculoskeletal', 'Endocrine', 'Dermatological',
  'Gastrointestinal', 'Psychological',
];

export default LatentHealthVisualizer;
