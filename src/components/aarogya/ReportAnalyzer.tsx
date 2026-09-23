'use client';

// ============================================
// AAROGYA AI — LAB REPORT ANALYZER
// Real AI via /api/ai/lab-report (LLM JSON mode)
// Emerald/teal medical-grade design.
// ============================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileText, Sparkles, CheckCircle2, ChevronDown, ChevronUp,
  Search, X, Activity, Sun, TrendingUp, TrendingDown, Minus,
  Loader2, Volume2, VolumeX, Share2, AlertOctagon, Phone,
  Stethoscope, ShieldAlert, HeartPulse, RotateCcw, Database,
  Beaker, Droplet, FlaskConical, Microscope, Zap,
} from 'lucide-react';
import type { LabReportAnalysis, Biomarker } from '@/types/aarogya';
import { BIOMARKER_DATABASE } from '@/data/labReportAnalysis';

// ============================================
// SAMPLE REPORT
// ============================================

const SAMPLE_REPORT = `Complete Blood Count: Hemoglobin: 11.2 g/dL, WBC: 7200, Platelets: 245000
Sugar: Fasting Glucose: 108 mg/dL, HbA1c: 5.9%
Lipids: Total Cholesterol: 224 mg/dL, LDL: 152 mg/dL, HDL: 38 mg/dL, Triglycerides: 168 mg/dL
Liver: SGPT (ALT): 32 IU/L, SGOT (AST): 28 IU/L, Bilirubin: 0.8 mg/dL
Kidney: Creatinine: 0.9 mg/dL, Urea: 28 mg/dL, eGFR: 95
Thyroid: TSH: 3.2 mIU/L
Vitamins: Vitamin D: 18 ng/mL, Vitamin B12: 285 pg/mL, Ferritin: 45 ng/mL
Inflammation: hs-CRP: 3.8 mg/L`;

// ============================================
// HELPERS
// ============================================

const isHigherBetter = (name: string) => {
  const goodHigh = ['HDL', 'Hemoglobin', 'Vitamin D', 'Vitamin B12', 'Ferritin', 'Platelets', 'WBC', 'RBC', 'Hematocrit'];
  return goodHigh.some(g => name.toLowerCase().includes(g.toLowerCase()));
};

/** Defensively normalize any AI response into a LabReportAnalysis shape. */
function normalizeAnalysis(raw: any): LabReportAnalysis {
  const fallback: LabReportAnalysis = {
    critical_alerts: [],
    categories: {},
    recommended_specialist: { type: 'General Physician', urgency: 'routine', reason_en: '', reason_hi: '' },
    summary_en: 'Analysis could not be fully structured. Please consult a doctor for interpretation.',
    summary_hi: 'विश्लेषण पूरी तरह से संरचित नहीं हो सका। कृपया व्याख्या के लिए डॉक्टर से मिलें।',
    disclaimer: 'AI analysis for informational purposes only. Not a medical diagnosis.',
    overall_status: 'needs_attention',
    confidence: 50,
  };
  if (!raw) return fallback;

  // If raw is a string (AI returned text instead of parsed JSON), try to extract JSON
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      // Try to extract from markdown fences
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try { raw = JSON.parse(match[1].trim()); } catch { return fallback; }
      } else {
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          try { raw = JSON.parse(raw.substring(start, end + 1)); } catch { return fallback; }
        } else {
          return fallback;
        }
      }
    }
  }

  // If raw is an array, the AI returned critical_alerts as top-level.
  // Wrap it in the expected shape.
  if (Array.isArray(raw)) {
    const alerts = raw.filter((item: any) => item && typeof item === 'object' && (item.test_name_en || item.test_name));
    return {
      ...fallback,
      critical_alerts: alerts.map((a: any) => ({
        test_name_en: String(a?.test_name_en ?? a?.test_name ?? 'Unknown'),
        test_name_hi: String(a?.test_name_hi ?? ''),
        value: Number(a?.value ?? 0) || 0,
        unit: String(a?.unit ?? ''),
        normal_range: String(a?.normal_range ?? ''),
        danger_level: a?.danger_level === 'critical' ? 'critical' : 'high',
        emergency_action_en: String(a?.emergency_action_en ?? 'Seek immediate medical attention.'),
        emergency_action_hi: String(a?.emergency_action_hi ?? ''),
      })),
      summary_en: 'Analysis completed. Critical alerts are shown above. Some biomarker categories may not have been fully parsed.',
      overall_status: alerts.length > 0 ? 'abnormal' : 'needs_attention',
    };
  }

  if (typeof raw !== 'object') return fallback;

  return {
    critical_alerts: Array.isArray(raw.critical_alerts)
      ? raw.critical_alerts.map((a: any) => ({
          test_name_en: String(a?.test_name_en ?? a?.test_name ?? 'Unknown'),
          test_name_hi: String(a?.test_name_hi ?? ''),
          value: Number(a?.value ?? 0) || 0,
          unit: String(a?.unit ?? ''),
          normal_range: String(a?.normal_range ?? ''),
          danger_level: a?.danger_level === 'critical' ? 'critical' : 'high',
          emergency_action_en: String(a?.emergency_action_en ?? 'Seek immediate medical attention.'),
          emergency_action_hi: String(a?.emergency_action_hi ?? ''),
        }))
      : [],
    categories: (() => {
      if (!raw.categories || typeof raw.categories !== 'object') return {};
      const result: Record<string, Biomarker[]> = {};
      for (const [catName, items] of Object.entries(raw.categories)) {
        if (Array.isArray(items)) {
          const normalizedItems = items.map((item: any) => ({
            name_en: String(item?.name_en ?? item?.name ?? 'Unknown'),
            name_hi: String(item?.name_hi ?? ''),
            value: Number(item?.value ?? 0) || 0,
            unit: String(item?.unit ?? ''),
            normal_range: String(item?.normal_range ?? ''),
            status: (['normal', 'borderline', 'abnormal', 'critical'].includes(item?.status) ? item.status : 'normal') as Biomarker['status'],
            category: String(item?.category ?? catName),
            explanation_en: String(item?.explanation_en ?? ''),
            explanation_hi: String(item?.explanation_hi ?? ''),
            causes_en: String(item?.causes_en ?? ''),
            causes_hi: String(item?.causes_hi ?? ''),
            action_en: String(item?.action_en ?? ''),
            action_hi: String(item?.action_hi ?? ''),
          }));
          if (normalizedItems.length > 0) {
            result[catName] = normalizedItems;
          }
        }
      }
      return result;
    })(),
    recommended_specialist: {
      type: String(raw?.recommended_specialist?.type ?? raw?.recommended_specialist ?? 'General Physician'),
      urgency: String(raw?.recommended_specialist?.urgency ?? 'routine'),
      reason_en: String(raw?.recommended_specialist?.reason_en ?? ''),
      reason_hi: String(raw?.recommended_specialist?.reason_hi ?? ''),
    },
    summary_en: String(raw?.summary_en ?? ''),
    summary_hi: String(raw?.summary_hi ?? ''),
    disclaimer: String(raw?.disclaimer ?? raw?._disclaimer ?? ''),
    overall_status: ['normal', 'needs_attention', 'abnormal', 'critical'].includes(raw?.overall_status)
      ? raw.overall_status
      : 'needs_attention',
    confidence: Number(raw?.confidence ?? 60) || 60,
  };
}

const speakText = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'hi-IN';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
  return true;
};

// ============================================
// STATUS CONFIG
// ============================================

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  normal:     { label: 'NORMAL',     color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', icon: '✓' },
  borderline: { label: 'BORDERLINE', color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-200',   icon: '⚠' },
  abnormal:   { label: 'ABNORMAL',   color: 'text-red-700',     bg: 'bg-red-100',     border: 'border-red-200',     icon: '✕' },
  critical:   { label: 'CRITICAL',   color: 'text-white',       bg: 'bg-red-600',     border: 'border-red-700',     icon: '☠' },
};

const OVERALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  normal:          { label: 'All Normal',          color: 'text-emerald-700', bg: 'bg-emerald-100' },
  needs_attention: { label: 'Needs Attention',     color: 'text-amber-700',   bg: 'bg-amber-100' },
  abnormal:        { label: 'Abnormal Values',     color: 'text-orange-700',  bg: 'bg-orange-100' },
  critical:        { label: 'Critical — Emergency',color: 'text-white',       bg: 'bg-red-600' },
};

const PROCESSING_STEPS = [
  'Extracting biomarkers…',
  'Analyzing with medical AI…',
  'Cross-referencing Indian ranges…',
  'Generating bilingual insights…',
  'Building recommendations…',
];

// ============================================
// MAIN COMPONENT
// ============================================

export const ReportAnalyzer: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [labName, setLabName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LabReportAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showReference, setShowReference] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiMeta, setAiMeta] = useState<{ model?: string; confidence?: number; cached?: boolean }>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ============================================
  // ANALYSIS
  // ============================================

  const analyzeReport = async () => {
    if (!reportText.trim()) {
      setError('Please paste your lab report text first.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setProcessingStep(0);

    const interval = setInterval(() => {
      setProcessingStep(p => Math.min(p + 1, PROCESSING_STEPS.length - 1));
    }, 600);

    try {
      const res = await fetch('/api/ai/lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          context: { age, gender, labName: labName || undefined },
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const result = await res.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed. Please try again.');
      }

      const normalized = normalizeAnalysis(result.data);
      setAnalysis(normalized);
      setAiMeta({
        model: result.model,
        confidence: result.confidence ?? normalized.confidence,
        cached: result.cached,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Check your connection and try again.');
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setProcessingStep(0);
    }
  };

  const resetAnalyzer = () => {
    setReportText('');
    setAnalysis(null);
    setError(null);
    setLabName('');
    setExpandedCards(new Set());
    setAiMeta({});
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const loadDemoReport = () => {
    setReportText(SAMPLE_REPORT);
    setLabName('Dr Lal PathLabs');
    setError(null);
    setAnalysis(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const toggleSpeak = () => {
    if (!analysis) return;
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const ok = speakText(
        analysis.summary_hi +
        (analysis.critical_alerts.length > 0 ? '. सावधान: कुछ मान खतरनाक हैं। तुरंत डॉक्टर से मिलें।' : '')
      );
      if (ok) setIsSpeaking(true);
    }
  };

  const shareToWhatsApp = () => {
    if (!analysis) return;
    let text = `*Aarogya AI Lab Report Summary*\nAge: ${age}, Gender: ${gender}\n\n`;
    if (analysis.critical_alerts.length > 0) {
      text += `🚨 *CRITICAL ALERTS*\n`;
      analysis.critical_alerts.forEach(a => {
        text += `- ${a.test_name_en}: ${a.value} ${a.unit} (Normal: ${a.normal_range}). ${a.emergency_action_en}\n`;
      });
      text += `\n`;
    }
    text += `*Summary*: ${analysis.summary_en}\n\n`;
    text += `*Specialist*: ${analysis.recommended_specialist.type} (${analysis.recommended_specialist.urgency})\n`;
    text += `⚠️ This is an AI analysis. Please consult a doctor.`;
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // ============================================
  // DERIVED STATS
  // ============================================

  const allBiomarkers: Biomarker[] = useMemo(() => {
    if (!analysis) return [];
    return Object.values(analysis.categories).flat() as Biomarker[];
  }, [analysis]);

  const healthScore = analysis
    ? Math.round(
        (allBiomarkers.filter(b => b.status === 'normal').length / Math.max(1, allBiomarkers.length)) * 100
      )
    : 0;

  const toggleCard = (key: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <style>{`
        @keyframes nxLabStagePop { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .nx-lab-stage { animation: nxLabStagePop 0.35s ease-out both; }
        @keyframes nxLabAlertPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }
        .nx-lab-alert-pulse { animation: nxLabAlertPulse 1.8s ease-out infinite; }
      `}</style>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl -mr-40 -mt-40 animate-pulseGlow" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Aarogya AI Lab Report Analyzer</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-white/70">Expert Indian Medical Analysis · Hindi + English · Trends & Alerts</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Powered by NidaanKosha-100k-V1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERTS BANNER */}
      {analysis && analysis.critical_alerts.length > 0 && (
        <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-red-800 nx-lab-alert-pulse">
          <div className="flex items-start gap-4">
            <AlertOctagon className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-black uppercase tracking-wider mb-2">🚨 Critical Health Alert</h2>
              <p className="text-lg font-bold mb-4">Dangerously abnormal values detected. Immediate action required.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {analysis.critical_alerts.map((alert, i) => (
                  <div key={i} className="bg-red-800/50 p-4 rounded-2xl border border-red-400">
                    <p className="font-black text-xl">{alert.test_name_en} {alert.test_name_hi && <span className="text-red-200">/ {alert.test_name_hi}</span>}</p>
                    <p className="text-3xl font-black mt-1">
                      {alert.value} <span className="text-lg font-normal text-red-200">{alert.unit}</span>{' '}
                      <span className="text-sm font-normal text-red-300">(Normal: {alert.normal_range})</span>
                    </p>
                    <p className="mt-2 text-sm font-medium">{alert.emergency_action_en}</p>
                    {alert.emergency_action_hi && <p className="text-sm font-medium text-red-200">{alert.emergency_action_hi}</p>}
                  </div>
                ))}
              </div>
              <a href="tel:108" className="flex items-center justify-center gap-4 bg-white text-red-700 p-4 rounded-2xl font-black text-lg sm:text-xl hover:bg-red-50 transition-colors">
                <Phone className="w-8 h-8" />
                <span>Call 108 Immediately if experiencing severe symptoms</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {!analysis ? (
        /* ═══════════ INPUT SECTION ═══════════ */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Enter Lab Report
            </h2>

            {/* Patient context */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Math.max(0, +e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Age"
                aria-label="Age"
              />
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Lab Name (optional)"
                aria-label="Lab name"
              />
            </div>

            <textarea
              ref={textareaRef}
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              placeholder="Paste your lab report text here…&#10;&#10;Example:&#10;Hemoglobin: 11.2 g/dL&#10;Fasting Glucose: 108 mg/dL&#10;TSH: 3.2 mIU/L"
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none scrollbar-slim"
            />

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={analyzeReport}
                disabled={!reportText.trim() || isAnalyzing}
                className={`flex-1 min-w-[180px] py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  !reportText.trim() || isAnalyzing
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-glow-lg'
                }`}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analyze Report</>
                )}
              </button>
              <button
                onClick={loadDemoReport}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors"
              >
                Try Sample
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
                <button onClick={analyzeReport} className="text-xs font-bold text-red-700 underline">Retry</button>
              </div>
            )}
          </div>

          {/* Sidebar — How it works */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" /> How it works
            </h2>
            <div className="space-y-4 text-sm text-slate-600">
              {[
                'Paste your lab report text (or try the sample).',
                'AI extracts values and compares with ICMR Indian reference ranges.',
                'Get bilingual explanations, critical alerts, and a specialist recommendation.',
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
              <strong>💡 Tip:</strong> For best results, ensure the report text includes values and units (e.g., “11.2 g/dL”).
            </div>

            <button
              onClick={() => setShowReference(s => !s)}
              className="mt-4 w-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-100"
            >
              <Database className="w-3.5 h-3.5" />
              {showReference ? 'Hide' : 'View'} Biomarker Reference ({BIOMARKER_DATABASE.length} markers)
            </button>
          </div>
        </div>
      ) : (
        /* ═══════════ RESULTS SECTION ═══════════ */
        <div className="space-y-6 animate-fadeIn">
          {/* Header actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900">Analysis Results</h2>
              <p className="text-xs text-slate-500">
                {labName || 'Unknown Lab'} · {age}y/o {gender} · {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Health Score</span>
                <span className={`text-xl font-black ${healthScore > 80 ? 'text-emerald-600' : healthScore > 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {healthScore}/100
                </span>
              </div>
              {aiMeta.confidence != null && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase">Confidence</span>
                  <span className={`text-xl font-black ${(aiMeta.confidence ?? 0) >= 85 ? 'text-emerald-600' : (aiMeta.confidence ?? 0) >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {aiMeta.confidence}%
                  </span>
                </div>
              )}
              <button
                onClick={toggleSpeak}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  isSpeaking ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Stop' : 'Listen (Hindi)'}
              </button>
              <button
                onClick={shareToWhatsApp}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={resetAnalyzer}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> New Report
              </button>
            </div>
          </div>

          {/* Overall status banner */}
          {analysis.overall_status && (
            <div className={`px-5 py-3 rounded-2xl border ${OVERALL_STATUS_CONFIG[analysis.overall_status]?.bg ?? 'bg-slate-100'} ${OVERALL_STATUS_CONFIG[analysis.overall_status]?.color ?? 'text-slate-700'} border-current/20 flex items-center gap-3`}>
              <HeartPulse className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wide">
                Overall: {OVERALL_STATUS_CONFIG[analysis.overall_status]?.label ?? analysis.overall_status}
              </span>
              {aiMeta.model && aiMeta.model !== 'none' && (
                <span className="ml-auto text-[10px] font-semibold opacity-70">
                  {aiMeta.cached ? '⚡ cached · ' : ''}model: {aiMeta.model}
                </span>
              )}
            </div>
          )}

          {/* Bilingual summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-black text-emerald-900 mb-3 flex items-center gap-2">
              <HeartPulse className="w-5 h-5" /> In Simple Words — What Your Body Is Telling You
            </h3>
            <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-emerald-100">
              <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">{analysis.summary_en}</p>
              {analysis.summary_hi && (
                <p lang="hi" className="text-sm text-slate-600 mt-3 italic whitespace-pre-wrap border-t border-slate-200 pt-3">
                  {analysis.summary_hi}
                </p>
              )}
            </div>
          </div>

          {/* Specialist recommendation */}
          <div className="bg-cyan-50 border border-cyan-100 p-5 rounded-2xl flex items-start gap-4">
            <Activity className="w-8 h-8 text-cyan-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-cyan-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" /> Recommended Specialist: {analysis.recommended_specialist.type}
              </h3>
              <p className="text-sm text-cyan-700 mt-1"><strong>Urgency:</strong> {analysis.recommended_specialist.urgency}</p>
              {analysis.recommended_specialist.reason_en && (
                <p className="text-sm text-cyan-700 mt-1">{analysis.recommended_specialist.reason_en}</p>
              )}
              {analysis.recommended_specialist.reason_hi && (
                <p lang="hi" className="text-sm text-cyan-600 italic mt-0.5">{analysis.recommended_specialist.reason_hi}</p>
              )}
            </div>
          </div>

          {/* Categories */}
          {Object.entries(analysis.categories).map(([categoryName, items]) => {
            const safeItems = Array.isArray(items) ? items : [];
            if (safeItems.length === 0) return null;
            const catIcon = getCategoryIcon(categoryName);
            return (
              <div key={categoryName} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                    {catIcon} {categoryName}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {safeItems.length} tests
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {safeItems.map((item, i) => {
                    const key = `${categoryName}-${i}`;
                    const isExpanded = expandedCards.has(key);
                    const statusKey = (item.status || 'normal').toLowerCase();
                    const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.normal;
                    return (
                      <div key={key} className="p-4 hover:bg-slate-50 transition-colors">
                        <button
                          onClick={() => toggleCard(key)}
                          className="w-full flex items-start justify-between gap-4 text-left"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900">{item.name_en}</span>
                              {item.name_hi && <span lang="hi" className="text-xs text-slate-500">/ {item.name_hi}</span>}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                {cfg.icon} {cfg.label}
                              </span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                              <span className="text-2xl font-black text-slate-900">{item.value}</span>
                              <span className="text-xs text-slate-500">{item.unit}</span>
                              <span className="text-xs text-slate-400">(Normal: {item.normal_range})</span>
                            </div>
                          </div>
                          <div className="pt-2 flex-shrink-0">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="font-bold text-slate-700 mb-1 text-xs uppercase">Explanation</p>
                              <p className="text-slate-600 mb-2">{item.explanation_en}</p>
                              {item.explanation_hi && <p lang="hi" className="text-slate-500 italic">{item.explanation_hi}</p>}
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl">
                              <p className="font-bold text-slate-700 mb-1 text-xs uppercase">Causes & Action</p>
                              {item.causes_en && <p className="text-slate-600 mb-1"><strong>Causes:</strong> {item.causes_en}</p>}
                              {item.action_en && <p className="text-emerald-700 font-medium"><strong>Action:</strong> {item.action_en}</p>}
                              {item.action_hi && <p lang="hi" className="text-emerald-600 italic mt-1">{item.action_hi}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Biomarker reference panel */}
          {showReference && (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden animate-fadeIn">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" /> Biomarker Reference Database
                </h3>
                <button onClick={() => setShowReference(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto scrollbar-slim">
                <p className="text-xs text-slate-500 mb-3">
                  Reference intervals sourced from ICMR, LabQAR (550 ranges), and the getbased open blood-work dashboard. {BIOMARKER_DATABASE.length} markers indexed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BIOMARKER_DATABASE.map(b => {
                    const range = gender === 'female' ? b.rangeFemale : b.rangeMale;
                    return (
                      <div key={b.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-800">{b.name}</span>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{b.category}</span>
                        </div>
                        <p lang="hi" className="text-[10px] text-slate-500">{b.hindiName}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          Normal ({gender}): <strong>{range.low}–{range.high} {b.unit}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-800 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>⚠️ Medical Disclaimer:</strong>{' '}
              {analysis.disclaimer ||
                'This AI analysis is for informational purposes only and is NOT a medical diagnosis. Always consult qualified healthcare professionals. If any value is flagged as critical, seek immediate medical attention. Call 108 for emergencies.'}
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ LOADING OVERLAY ═══════════ */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 scan-line" />
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center animate-pulseGlow mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">AI is Analyzing…</h3>
            <p className="text-sm text-slate-500 mb-6">Extracting values and checking against Indian medical standards.</p>
            <div className="space-y-3 text-left">
              {PROCESSING_STEPS.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm nx-lab-stage ${i <= processingStep ? 'text-slate-900 font-bold' : 'text-slate-300'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  {i < processingStep ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : i === processingStep ? (
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                  )}
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// CATEGORY ICON HELPER
// ============================================

function getCategoryIcon(category: string): React.ReactNode {
  const c = category.toLowerCase();
  if (c.includes('blood') || c.includes('cbc')) return <Droplet className="w-5 h-5 text-rose-500" />;
  if (c.includes('sugar') || c.includes('diabet') || c.includes('metabolic')) return <Beaker className="w-5 h-5 text-emerald-500" />;
  if (c.includes('lipid') || c.includes('cholesterol') || c.includes('heart')) return <HeartPulse className="w-5 h-5 text-red-500" />;
  if (c.includes('liver')) return <FlaskConical className="w-5 h-5 text-amber-500" />;
  if (c.includes('kidney')) return <Activity className="w-5 h-5 text-cyan-500" />;
  if (c.includes('thyroid')) return <Microscope className="w-5 h-5 text-teal-500" />;
  if (c.includes('vitamin')) return <Sun className="w-5 h-5 text-yellow-500" />;
  if (c.includes('iron') || c.includes('ferritin')) return <Zap className="w-5 h-5 text-orange-500" />;
  return <FlaskConical className="w-5 h-5 text-emerald-500" />;
}

export default ReportAnalyzer;
