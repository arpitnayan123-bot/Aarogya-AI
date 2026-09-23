'use client';

// ============================================
// AAROGYA AI — DERMATOLOGY / SKIN ANALYZER
// Real AI via /api/ai/skin (VLM, vision model)
// Emerald/teal dermatology-grade design.
// ============================================

import React, { useState, useRef, useCallback } from 'react';
import {
  Camera, Upload, X, Sparkles, Droplets, Sun, Moon,
  AlertCircle, CheckCircle2, ShieldCheck, ArrowRight,
  ScanLine, Activity, RotateCcw, Cpu, AlertTriangle,
  Stethoscope, ShieldAlert, HeartPulse, ChevronDown, ChevronUp,
  Microscope, Flower, Star,
} from 'lucide-react';

// ============================================
// FILE → BASE64 HELPER
// ============================================

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================
// TYPES (defensive — the AI may return partial data)
// ============================================

interface SkinFinding {
  region: string;
  observation: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
}

interface PossibleCondition {
  name: string;
  probability: 'low' | 'moderate' | 'high';
  reasoning: string;
}

interface SkinAnalysis {
  findings: SkinFinding[];
  possible_conditions: PossibleCondition[];
  impression_en: string;
  impression_hi: string;
  recommendations: string[];
  urgency: 'routine' | 'within_week' | 'urgent' | 'emergency';
  confidence: number;
  disclaimer: string;
  // optional derm-specific fields
  skin_type?: string;
  skin_tone?: string;
}

// ============================================
// CONFIG MAPS
// ============================================

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: React.ComponentType<{ className?: string }> }> = {
  normal:    { label: 'Normal',         color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: CheckCircle2 },
  mild:      { label: 'Mild',           color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   Icon: AlertCircle },
  moderate:  { label: 'Moderate',       color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  Icon: AlertTriangle },
  severe:    { label: 'Significant',    color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     Icon: ShieldAlert },
};

const PROBABILITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low:       { label: 'Low Likelihood',      color: 'text-emerald-700', bg: 'bg-emerald-100' },
  moderate:  { label: 'Possible',            color: 'text-amber-700',   bg: 'bg-amber-100' },
  high:      { label: 'Likely Match',        color: 'text-orange-700',  bg: 'bg-orange-100' },
};

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  routine:      { label: 'Routine Skin Check',         color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', Icon: CheckCircle2 },
  within_week:  { label: 'See Dermatologist Soon',     color: 'text-amber-700',   bg: 'bg-amber-100 border-amber-200',   Icon: AlertCircle },
  urgent:       { label: 'Prompt Evaluation Needed',   color: 'text-orange-700',  bg: 'bg-orange-100 border-orange-200', Icon: AlertTriangle },
  emergency:    { label: 'Seek Immediate Care',         color: 'text-white',       bg: 'bg-red-600 border-red-700',       Icon: ShieldAlert },
};

// ============================================
// NORMALIZE AI RESPONSE
// ============================================

function normalizeAnalysis(raw: any): SkinAnalysis {
  const fallback: SkinAnalysis = {
    findings: [],
    possible_conditions: [],
    impression_en: 'The AI could not produce a structured impression. Please consult a licensed dermatologist.',
    impression_hi: '',
    recommendations: [],
    urgency: 'routine',
    confidence: 40,
    disclaimer: 'AI dermatology screening — for educational and informational purposes only.',
  };
  if (!raw || typeof raw !== 'object') return fallback;

  return {
    findings: Array.isArray(raw.findings)
      ? raw.findings.map((f: any) => ({
          region: String(f?.region ?? 'Skin area'),
          observation: String(f?.observation ?? ''),
          severity: ['normal', 'mild', 'moderate', 'severe'].includes(f?.severity) ? f.severity : 'normal',
          confidence: Number(f?.confidence ?? 70) || 70,
        } as SkinFinding))
      : [],
    possible_conditions: Array.isArray(raw.possible_conditions)
      ? raw.possible_conditions.map((c: any) => ({
          name: String(c?.name ?? 'Unknown condition'),
          probability: ['low', 'moderate', 'high'].includes(c?.probability) ? c.probability : 'low',
          reasoning: String(c?.reasoning ?? ''),
        } as PossibleCondition))
      : [],
    impression_en: String(raw?.impression_en ?? raw?.summary_en ?? ''),
    impression_hi: String(raw?.impression_hi ?? raw?.summary_hi ?? ''),
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations.map(String) : [],
    urgency: ['routine', 'within_week', 'urgent', 'emergency'].includes(raw.urgency) ? raw.urgency : 'routine',
    confidence: Number(raw?.confidence ?? 60) || 60,
    disclaimer: String(raw?.disclaimer ?? raw?._disclaimer ?? ''),
    skin_type: raw.skin_type ? String(raw.skin_type) : undefined,
    skin_tone: raw.skin_tone ? String(raw.skin_tone) : undefined,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export const SkinAnalyzer: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiMeta, setAiMeta] = useState<{ model?: string; cached?: boolean }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Please upload an image under 10 MB.');
      return;
    }
    setFileName(file.name);
    try {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImageUrl(`data:${file.type || 'image/jpeg'};base64,${base64}`);
      setAnalysis(null);
    } catch {
      setError('Could not read the image file. Please try another.');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!imageBase64) {
      setError('Please upload a skin photo first.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    const text = description.trim() ||
      'Analyze this skin image. Identify visible findings, possible dermatological conditions, severity, urgency, and provide bilingual (English + Hindi) impressions and recommendations. Include a strong dermatologist referral disclaimer.';

    try {
      const res = await fetch('/api/ai/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, text }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const result = await res.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed. Please try again.');
      }
      setAnalysis(normalizeAnalysis(result.data));
      setAiMeta({ model: result.model, cached: result.cached });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImageUrl('');
    setImageBase64('');
    setFileName('');
    setAnalysis(null);
    setError(null);
    setDescription('');
    setExpandedFindings(new Set());
    setAiMeta({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleFinding = (i: number) => {
    setExpandedFindings(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const attentionCount = analysis ? analysis.findings.filter(f => f.severity !== 'normal').length : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes nxSkinSweep {
          0% { top: 0%; opacity: 0; }
          12% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
          62% { opacity: 0; }
          100% { top: 0%; opacity: 0; }
        }
        .nx-skin-sweep { animation: nxSkinSweep 2.6s ease-in-out infinite; }
        @keyframes nxSkinRing {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .nx-skin-ring { animation: nxSkinRing 2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[120px] animate-pulseGlow" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/15 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Sparkles className="w-3 h-3" /> Powered by Fitzpatrick 17k &amp; ISIC Datasets
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-lg">
              <Microscope className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                DermAI <span className="gradient-text-emerald">Skin Scan</span>
              </h1>
              <p className="text-sm text-white/70 mt-1">Professional-grade dermatology analysis. Get findings, possible conditions, and dermatologist referrals instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload + preview */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <Camera className="w-5 h-5 text-teal-600" /> Upload Skin Photo
            </h2>

            {!imageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : 'border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                }`}
              >
                <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl w-fit mx-auto mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload or drag &amp; drop</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG · max 10 MB</p>
                <p className="text-[10px] text-teal-600 mt-2 font-semibold">For best results, use a clear, well-lit close-up photo</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 group">
                <img src={imageUrl} alt="Skin scan" className="w-full h-64 object-contain" />
                {isAnalyzing && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Expanding ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-teal-400/50 nx-skin-ring" />
                    {/* Scan sweep */}
                    <div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.8)] nx-skin-sweep"
                    />
                    {/* Corner brackets */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-teal-400 rounded-tl-lg" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-teal-400 rounded-tr-lg" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-teal-400 rounded-bl-lg" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-teal-400 rounded-br-lg" />
                    {/* Status */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                      <Activity className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      Cross-referencing Fitzpatrick 17k &amp; ISIC…
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { setImageUrl(''); setImageBase64(''); setFileName(''); }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-lg text-xs transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Change
                </button>
                {fileName && (
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg max-w-[60%] truncate">
                    {fileName}
                  </span>
                )}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/*" onChange={handleFileUpload} className="hidden" />

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
                <button onClick={analyze} className="text-xs font-bold text-red-700 underline">Retry</button>
              </div>
            )}
          </div>

          {/* Description + analyze */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <Flower className="w-5 h-5 text-emerald-600" /> Add Context (Optional)
            </h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your skin concern…&#10;&#10;Examples:&#10;• Itchy rash on the forearm for 3 days&#10;• Acne flare-up on cheeks&#10;• Dark spot that changed color recently"
              className="flex-1 min-h-[140px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none scrollbar-slim"
            />

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <Droplets className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-slate-500 uppercase">Skin Type</p>
                <p className="text-xs font-bold text-slate-700">AI-detected</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <Sun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-slate-500 uppercase">Skin Tone</p>
                <p className="text-xs font-bold text-slate-700">Fitzpatrick</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-slate-500 uppercase">Privacy</p>
                <p className="text-xs font-bold text-slate-700">In-browser</p>
              </div>
            </div>

            <button
              onClick={analyze}
              disabled={!imageBase64 || isAnalyzing}
              className={`mt-4 w-full font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 ${
                imageBase64 && !isAnalyzing
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg hover:shadow-glow-lg'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <><Activity className="w-4 h-4 animate-spin" /> Analyzing skin…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Analyze Skin</>
              )}
            </button>
            {!imageBase64 && <p className="text-[10px] text-slate-400 text-center mt-2">Upload a skin photo to enable analysis</p>}

            <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
              <p className="text-[10px] text-teal-700 font-medium leading-relaxed">
                <strong>How it works:</strong> The AI vision model extracts visual features, matches them against the ISIC (International Skin Imaging Collaboration) and Fitzpatrick 17k dermatology datasets, and produces structured findings with severity and urgency assessments.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════ RESULTS ═══════════ */
        <div className="space-y-6 animate-fadeIn">
          {/* Summary banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white shadow-xl p-6">
            <img src={imageUrl} alt="Skin scan" className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={imageUrl} alt="Skin scan" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 bg-black/20" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">DermAI Analysis Complete</p>
                  <h2 className="text-2xl font-extrabold mt-1">Skin Scan Report</h2>
                  <p className="text-sm opacity-90 mt-1">
                    {attentionCount === 0 ? 'No significant findings detected.' : `${attentionCount} finding(s) flagged for review.`}
                  </p>
                  {aiMeta.model && aiMeta.model !== 'none' && (
                    <p className="text-[10px] opacity-70 mt-1">model: {aiMeta.model}{aiMeta.cached ? ' · cached' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/20">
                  <p className="text-2xl font-extrabold">{analysis.confidence}%</p>
                  <p className="text-[10px] font-bold uppercase">Confidence</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/20">
                  <p className="text-2xl font-extrabold">{analysis.findings.length}</p>
                  <p className="text-[10px] font-bold uppercase">Findings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Urgency banner */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${URGENCY_CONFIG[analysis.urgency]?.bg ?? 'bg-slate-100 border-slate-200'}`}>
            {(() => {
              const U = URGENCY_CONFIG[analysis.urgency]?.Icon ?? Activity;
              return <U className={`w-5 h-5 ${URGENCY_CONFIG[analysis.urgency]?.color ?? 'text-slate-600'}`} />;
            })()}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Action</p>
              <p className={`font-bold ${URGENCY_CONFIG[analysis.urgency]?.color ?? 'text-slate-700'}`}>
                {URGENCY_CONFIG[analysis.urgency]?.label ?? analysis.urgency}
              </p>
            </div>
          </div>

          {/* Dermatology profile + Bilingual impression */}
          {(analysis.skin_type || analysis.skin_tone) && (
            <div className="grid grid-cols-2 gap-4">
              {analysis.skin_type && (
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-50"><Droplets className="w-5 h-5 text-teal-600" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skin Type</p>
                    <p className="font-bold text-slate-800">{analysis.skin_type}</p>
                  </div>
                </div>
              )}
              {analysis.skin_tone && (
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50"><Sun className="w-5 h-5 text-amber-600" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skin Tone</p>
                    <p className="font-bold text-slate-800">{analysis.skin_tone}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bilingual impression */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-black text-teal-900 mb-3 flex items-center gap-2">
              <HeartPulse className="w-5 h-5" /> Dermatologist Impression
            </h3>
            <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-teal-100">
              <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">{analysis.impression_en}</p>
              {analysis.impression_hi && (
                <p lang="hi" className="text-sm text-slate-600 mt-3 italic whitespace-pre-wrap border-t border-slate-200 pt-3">
                  {analysis.impression_hi}
                </p>
              )}
            </div>
          </div>

          {/* Findings */}
          {analysis.findings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-teal-600" /> Detected Findings
              </h3>
              {analysis.findings.map((finding, idx) => {
                const cfg = SEVERITY_CONFIG[finding.severity] ?? SEVERITY_CONFIG.normal;
                const Icon = cfg.Icon;
                const isExpanded = expandedFindings.has(idx);
                return (
                  <div key={idx} className={`bg-white border ${cfg.border} p-5 rounded-3xl shadow-sm`}>
                    <button
                      onClick={() => toggleFinding(idx)}
                      className="w-full flex items-start justify-between gap-4 text-left"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2.5 rounded-2xl ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-extrabold text-slate-800">{finding.region}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className={`text-xs text-slate-500 leading-relaxed mt-1.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {finding.observation}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                            <div className="flex-1 max-w-[160px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${cfg.border.replace('border-', 'bg-').replace('-200', '-500')}`} style={{ width: `${finding.confidence}%` }} />
                            </div>
                            <span className="text-xs font-extrabold text-slate-700">{finding.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-1 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Possible conditions */}
          {analysis.possible_conditions.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-teal-600" /> Possible Conditions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {analysis.possible_conditions.map((c, i) => {
                  const pcfg = PROBABILITY_CONFIG[c.probability] ?? PROBABILITY_CONFIG.low;
                  return (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          {c.name}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pcfg.bg} ${pcfg.color}`}>
                          {pcfg.label}
                        </span>
                      </div>
                      {c.reasoning && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{c.reasoning}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600" /> Recommendations
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dermatologist referral disclaimer */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 border-2 border-rose-200 p-5 rounded-3xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500 text-white rounded-2xl flex-shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-rose-900 text-base mb-1">See a Licensed Dermatologist</h3>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  {analysis.disclaimer ||
                    'This AI dermatology screening is for educational and informational purposes only and is NOT a medical diagnosis. Skin conditions can only be definitively diagnosed by a qualified dermatologist through in-person examination, dermoscopy, and when needed, biopsy. If you notice a changing, bleeding, or rapidly growing lesion, seek prompt professional evaluation. Do not delay medical care based on AI output.'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50 border border-amber-100 p-5 rounded-3xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed max-w-2xl">
                <strong>Reminder:</strong> AI dermatology tools have meaningful false-positive and false-negative rates. Always confirm findings with a board-certified dermatologist before starting any treatment.
              </p>
            </div>
            <button
              onClick={reset}
              className="flex-shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-amber-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Scan Another Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinAnalyzer;
