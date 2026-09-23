'use client';

// ============================================
// AAROGYA AI — DIAGNOSTIC ENHANCEMENT OVERLAY (Modules 9 + 10 UI)
// Lightweight enhancement layer for Lab/Imaging (9) + Disease Predictor (10)
// ============================================

import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, CheckCircle2,
  FlaskConical, ScanLine, Link2, Target, Sparkles, Zap, Brain,
  Clock, ArrowRight, Layers, ShieldAlert,
} from 'lucide-react';
import {
  enhanceLabImaging, enhanceDiseasePrediction,
  type LabReading, type ImagingFinding,
} from '@/lib/diagnosticEnhancements';
import { publish } from '@/lib/intelligenceBus';

// --- Demo data for Module 9 (serial lab readings + imaging findings) ---
const SERIAL_LAB_READINGS: LabReading[] = [
  { date: '2024-01-15', testName: 'HbA1c', value: 6.2, unit: '%', referenceLow: 4.0, referenceHigh: 5.6 },
  { date: '2024-04-20', testName: 'HbA1c', value: 6.5, unit: '%', referenceLow: 4.0, referenceHigh: 5.6 },
  { date: '2024-07-18', testName: 'HbA1c', value: 6.8, unit: '%', referenceLow: 4.0, referenceHigh: 5.6 },
  { date: '2024-01-15', testName: 'LDL', value: 118, unit: 'mg/dL', referenceLow: 0, referenceHigh: 100 },
  { date: '2024-04-20', testName: 'LDL', value: 128, unit: 'mg/dL', referenceLow: 0, referenceHigh: 100 },
  { date: '2024-07-18', testName: 'LDL', value: 142, unit: 'mg/dL', referenceLow: 0, referenceHigh: 100 },
  { date: '2024-01-15', testName: 'Creatinine', value: 0.9, unit: 'mg/dL', referenceLow: 0.6, referenceHigh: 1.2 },
  { date: '2024-04-20', testName: 'Creatinine', value: 1.0, unit: 'mg/dL', referenceLow: 0.6, referenceHigh: 1.2 },
  { date: '2024-07-18', testName: 'Creatinine', value: 1.1, unit: 'mg/dL', referenceLow: 0.6, referenceHigh: 1.2 },
  { date: '2024-01-15', testName: 'Hemoglobin', value: 13.2, unit: 'g/dL', referenceLow: 12, referenceHigh: 16 },
  { date: '2024-07-18', testName: 'Hemoglobin', value: 12.8, unit: 'g/dL', referenceLow: 12, referenceHigh: 16 },
];

const LAB_FINDINGS = [
  { testName: 'HbA1c', value: 6.8, abnormal: true },
  { testName: 'LDL', value: 142, abnormal: true },
  { testName: 'Hemoglobin', value: 12.8, abnormal: false },
  { testName: 'Creatinine', value: 1.1, abnormal: false },
];

const IMAGING_FINDINGS: ImagingFinding[] = [
  { modality: 'X-ray', finding: 'Cardiomegaly', severity: 'mild', location: 'Cardiac silhouette' },
  { modality: 'X-ray', finding: 'Consolidation', severity: 'normal', location: 'Lungs' },
];

// --- Demo data for Module 10 (disease predictor enhancement) ---
const DISEASE_FINDINGS = [
  { name: 'HbA1c', value: '6.8%', abnormal: true, category: 'Diabetes' },
  { name: 'Fasting Glucose', value: '142 mg/dL', abnormal: true, category: 'Diabetes' },
  { name: 'LDL Cholesterol', value: '142 mg/dL', abnormal: true, category: 'Lipids' },
  { name: 'HDL Cholesterol', value: '38 mg/dL', abnormal: true, category: 'Lipids' },
  { name: 'Blood Pressure', value: '138/88 mmHg', abnormal: true, category: 'Cardiovascular' },
  { name: 'BMI', value: '28.4', abnormal: true, category: 'Metabolic' },
  { name: 'eGFR', value: '78 mL/min', abnormal: false, category: 'Renal' },
  { name: 'TSH', value: '2.4 mIU/L', abnormal: false, category: 'Thyroid' },
];

export default function DiagnosticEnhancements() {
  const [age, setAge] = useState(52);
  const [gender, setGender] = useState('Male');

  const labImaging = useMemo(
    () => enhanceLabImaging(SERIAL_LAB_READINGS, LAB_FINDINGS, IMAGING_FINDINGS),
    [],
  );
  const diseasePred = useMemo(
    () => enhanceDiseasePrediction(DISEASE_FINDINGS, age, gender),
    [age, gender],
  );

  const handlePublishTrend = (testName: string, significance: string) => {
    publish({
      type: 'lab_trend_found',
      source: 'diagnostic_enhancements',
      targets: ['disease_predictor', 'risk_radar'],
      headline: `${testName} trend detected — ${significance}`,
      payload: { testName, significance },
      priority: significance === 'critical' ? 'critical' : significance === 'concerning' ? 'high' : 'medium',
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-300 tracking-wide">ENHANCEMENT OVERLAY</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300">Non-destructive layer</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs text-slate-300">Reads existing module output</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
            Diagnostic Enhancement Overlay
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            A lightweight layer that ADDS trend detection, cross-analysis, multi-disease
            prediction, and early-stage detection ON TOP of existing Lab, Imaging, and
            Disease Predictor modules — without modifying them.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">Module 9: Lab + Imaging Upgrade</span>
            <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-400/20">Module 10: Disease Predictor Upgrade</span>
          </div>
        </div>
      </div>

      {/* ALERTS BANNER */}
      {labImaging.alerts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Enhancement Alerts</h3>
          </div>
          <ul className="space-y-1">
            {labImaging.alerts.map((a, i) => (
              <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex gap-1.5">
                <span className="text-amber-500">•</span>{a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MODULE 9: LAB TRENDS */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Lab Trend Detection</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Serial readings analyzed for direction, rate &amp; threshold crossings</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">Module 9</span>
        </div>
        <div className="space-y-3">
          {labImaging.trends.map(trend => {
            const sigColor = trend.significance === 'critical' ? 'rose' : trend.significance === 'concerning' ? 'amber' : trend.significance === 'monitor' ? 'cyan' : 'slate';
            const DirIcon = trend.direction === 'rising' ? TrendingUp : trend.direction === 'falling' ? TrendingDown : trend.direction === 'volatile' ? Activity : Minus;
            return (
              <div key={trend.testName} className={`rounded-xl border border-${sigColor}-200 dark:border-${sigColor}-800 p-4`}>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FlaskConical className={`h-4 w-4 text-${sigColor}-600`} />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{trend.testName}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${sigColor}-100 dark:bg-${sigColor}-950/40 text-${sigColor}-700 dark:text-${sigColor}-300 capitalize flex items-center gap-0.5`}>
                      <DirIcon className="h-2.5 w-2.5" /> {trend.direction}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${
                    trend.significance === 'critical' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                    : trend.significance === 'concerning' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : trend.significance === 'monitor' ? 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {trend.significance}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{trend.insight}</p>

                {/* Mini sparkline */}
                <div className="flex items-end gap-1 h-12 mb-2">
                  {trend.readings.map((r, i) => {
                    const max = Math.max(...trend.readings.map(x => x.value));
                    const min = Math.min(...trend.readings.map(x => x.value));
                    const range = max - min || 1;
                    const heightPct = ((r.value - min) / range) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className={`w-full rounded-sm bg-${sigColor}-500`} style={{ height: `${Math.max(10, heightPct)}%` }} />
                        <span className="text-[8px] text-slate-400">{r.value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">Rate</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{trend.ratePerMonth}/mo</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">90d Projection</p>
                    <p className={`font-semibold ${trend.crossesThreshold ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>{trend.projectedValue90d}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">Threshold</p>
                    {trend.crossesThreshold ? (
                      <p className="font-semibold text-rose-600 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> {trend.daysToThreshold}d
                      </p>
                    ) : (
                      <p className="font-semibold text-emerald-600">Safe</p>
                    )}
                  </div>
                </div>

                {(trend.significance === 'critical' || trend.significance === 'concerning') && (
                  <button
                    onClick={() => handlePublishTrend(trend.testName, trend.significance)}
                    className="mt-2 text-[11px] px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Share with Risk Radar &amp; Disease Predictor
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MODULE 9: CROSS-ANALYSIS */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Lab ↔ Imaging Cross-Analysis</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Correlations between lab findings and imaging observations</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">Module 9</span>
        </div>
        {labImaging.crossAnalysisLinks.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-4 w-4" /> No cross-modal correlations detected in current data
          </div>
        ) : (
          <div className="space-y-2">
            {labImaging.crossAnalysisLinks.map((link, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
                    <FlaskConical className="h-3 w-3" /> {link.labFinding}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-300 flex items-center gap-1">
                    <ScanLine className="h-3 w-3" /> {link.imagingFinding}
                  </span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {link.strength}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 mb-1">{link.correlation}</p>
                <p className="text-[11px] text-slate-500 italic">{link.clinicalSignificance}</p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${link.strength}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODULE 10: DISEASE PREDICTOR UPGRADE */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Brain className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Multi-Disease Prediction</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enhanced: multiple diseases assessed simultaneously with risk interactions</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">Module 10</span>
        </div>

        {/* Demographic controls */}
        <div className="flex gap-3 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Age:</label>
            <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 50)} className="w-16 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Gender:</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        {/* Primary risk */}
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 mb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Primary Risk</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${diseasePred.primaryRisk.stage === 'established' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'}`}>
              {diseasePred.primaryRisk.stage} stage
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{diseasePred.primaryRisk.disease}</h3>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{diseasePred.primaryRisk.probability}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" style={{ width: `${diseasePred.primaryRisk.probability}%` }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Modifiable Risk Factors</p>
              <div className="flex flex-wrap gap-1">
                {diseasePred.primaryRisk.modifiableRiskFactors.map(f => (
                  <span key={f} className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Early Warning Signals</p>
              <div className="flex flex-wrap gap-1">
                {diseasePred.primaryRisk.earlyWarningSignals.map(s => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comorbid risks */}
        {diseasePred.comorbidRisks.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Comorbid Risks</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {diseasePred.comorbidRisks.map(r => (
                <div key={r.disease} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{r.disease}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{r.probability}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full bg-slate-400" style={{ width: `${r.probability}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 capitalize">{r.stage} stage</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk interactions */}
        {diseasePred.riskInteractions.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Risk Interactions (diseases compound each other)</p>
            <div className="space-y-2">
              {diseasePred.riskInteractions.map((ri, i) => (
                <div key={i} className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10 p-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {ri.diseases.map((d, j) => (
                      <span key={d} className="flex items-center gap-1">
                        {j > 0 && <ArrowRight className="h-3 w-3 text-rose-400" />}
                        <span className="text-xs font-medium text-rose-700 dark:text-rose-300">{d}</span>
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold">
                      Combined: {Math.round(ri.combinedRisk)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{ri.interaction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Early stage detections */}
        {diseasePred.earlyStageDetections.length > 0 && (
          <div className="rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/30 dark:bg-cyan-950/10 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Early-Stage Detections — preventive window open</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diseasePred.earlyStageDetections.map(d => (
                <span key={d.disease} className="text-[11px] px-2 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300">
                  {d.disease} ({d.probability}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-slate-700 dark:text-slate-200">{diseasePred.recommendation}</p>
        </div>
      </section>
    </div>
  );
}
