'use client';

// ============================================
// AAROGYA AI — X-RAY / RADIOLOGY READER
// Real AI via /api/ai/xray (VLM, vision model)
// Emerald/teal medical-grade design.
// ============================================

import React, { useState, useRef, useCallback } from 'react';
import {
  ScanLine, Upload, Sparkles, CheckCircle2, AlertTriangle,
  Activity, RotateCcw, Bone, Brain, Layers, Zap,
  Cpu, Database, FileText, Award, Info, X,
  ShieldAlert, HeartPulse, ChevronDown, ChevronUp, Stethoscope,
} from 'lucide-react';
import type { XrayAnalysis, XrayFinding } from '@/types/aarogya';

// ============================================
// FILE → BASE64 HELPER
// ============================================

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================
// SEVERITY CONFIG
// ============================================

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; barColor: string; Icon: React.ComponentType<{ className?: string }> }> = {
  normal:    { label: 'Normal',          color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', barColor: 'bg-emerald-500', Icon: CheckCircle2 },
  mild:      { label: 'Mild Finding',    color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   barColor: 'bg-amber-500',   Icon: Activity },
  moderate:  { label: 'Needs Attention', color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  barColor: 'bg-orange-500',  Icon: AlertTriangle },
  severe:    { label: 'Significant',     color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     barColor: 'bg-red-500',     Icon: AlertTriangle },
};

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  routine:      { label: 'Routine Follow-up',  color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', Icon: CheckCircle2 },
  within_week:  { label: 'See Doctor Within a Week', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', Icon: AlertTriangle },
  urgent:       { label: 'Urgent — See Doctor Soon', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-200', Icon: AlertTriangle },
  emergency:    { label: 'Emergency — Seek Immediate Care', color: 'text-white', bg: 'bg-red-600 border-red-700', Icon: ShieldAlert },
};

const IMAGE_QUALITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  adequate:        { label: 'Adequate',       color: 'text-emerald-700', bg: 'bg-emerald-100' },
  limited:         { label: 'Limited',        color: 'text-amber-700',   bg: 'bg-amber-100' },
  'non-diagnostic':{ label: 'Non-diagnostic', color: 'text-red-700',     bg: 'bg-red-100' },
};

const SCAN_TYPES = [
  { id: 'chest',  label: 'Chest X-Ray (CXR)', Icon: Activity, recommended: true,  prompt: 'Chest X-ray — evaluate lung fields, cardiac silhouette, mediastinum, costophrenic angles, bony thorax, and soft tissues.' },
  { id: 'bone',   label: 'Bone / Fracture',   Icon: Bone,     recommended: false, prompt: 'Orthopedic radiograph — evaluate cortical integrity, joint alignment, bone density, and soft tissues.' },
  { id: 'spine',  label: 'Spine',             Icon: Layers,   recommended: false, prompt: 'Spinal radiograph — evaluate vertebral alignment, disc spaces, and bony structures.' },
  { id: 'skull',  label: 'Skull / Head',      Icon: Brain,    recommended: false, prompt: 'Skull radiograph — evaluate cranial vault, paranasal sinuses, and intracranial bony structures.' },
];

// ============================================
// NORMALIZE AI RESPONSE → XrayAnalysis
// ============================================

function normalizeAnalysis(raw: any): XrayAnalysis {
  const fallback: XrayAnalysis = {
    image_quality: 'adequate',
    findings: [],
    impression_en: 'The AI could not produce a structured impression. Please consult a licensed radiologist.',
    impression_hi: '',
    recommendations: [],
    urgency: 'routine',
    disclaimer: 'AI radiology screening — for research and educational purposes only.',
    confidence: 40,
  };
  if (!raw || typeof raw !== 'object') return fallback;

  return {
    image_quality: ['adequate', 'limited', 'non-diagnostic'].includes(raw.image_quality) ? raw.image_quality : 'adequate',
    findings: Array.isArray(raw.findings)
      ? raw.findings.map((f: any) => ({
          region: String(f?.region ?? 'Unknown region'),
          observation: String(f?.observation ?? ''),
          severity: ['normal', 'mild', 'moderate', 'severe'].includes(f?.severity) ? f.severity : 'normal',
          confidence: Number(f?.confidence ?? 70) || 70,
        } as XrayFinding))
      : [],
    impression_en: String(raw?.impression_en ?? raw?.impression ?? ''),
    impression_hi: String(raw?.impression_hi ?? ''),
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations.map(String) : [],
    urgency: ['routine', 'within_week', 'urgent', 'emergency'].includes(raw.urgency) ? raw.urgency : 'routine',
    disclaimer: String(raw?.disclaimer ?? raw?._disclaimer ?? ''),
    confidence: Number(raw?.confidence ?? 60) || 60,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export const XrayReader: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [scanType, setScanType] = useState('chest');
  const [optionalQuestion, setOptionalQuestion] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<XrayAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
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

  const handleScan = async () => {
    if (!imageBase64) return;
    setIsScanning(true);
    setError(null);
    setAnalysis(null);

    const scanConfig = SCAN_TYPES.find(s => s.id === scanType);
    const text = optionalQuestion.trim() || scanConfig?.prompt || 'Analyze this medical image and provide structured findings.';

    try {
      const res = await fetch('/api/ai/xray', {
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
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImageUrl('');
    setImageBase64('');
    setFileName('');
    setAnalysis(null);
    setError(null);
    setOptionalQuestion('');
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

  // Derived stats
  const attentionCount = analysis ? analysis.findings.filter(f => f.severity !== 'normal').length : 0;
  const avgConfidence = analysis && analysis.findings.length > 0
    ? Math.round(analysis.findings.reduce((a, f) => a + f.confidence, 0) / analysis.findings.length)
    : analysis?.confidence ?? 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes nxXrayScanSweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
          60% { opacity: 0; }
          100% { top: 0%; opacity: 0; }
        }
        .nx-xray-sweep { animation: nxXrayScanSweep 2.4s ease-in-out infinite; }
        @keyframes nxXrayGridPulse {
          0%,100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .nx-xray-grid { animation: nxXrayGridPulse 2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
              <ScanLine className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">AI X-Ray Report Reader</h1>
          </div>
          <button
            onClick={() => setShowModelInfo(s => !s)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 border border-emerald-100"
          >
            <Cpu className="w-3.5 h-3.5" /> Model Info
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <p className="text-sm text-slate-500">Powered by</p>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">
            🤝 BiomedVLP-CXR-BERT · Microsoft Corporation (India) Pvt. Ltd.
          </span>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-full border border-cyan-100">
            VLM Vision Analysis · Real-time
          </span>
        </div>
      </div>

      {/* Model info panel */}
      {showModelInfo && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">BiomedVLP-CXR-BERT-Specialized</h3>
              <p className="text-xs text-slate-500 mt-0.5">Developed by Microsoft Corporation (India) Pvt. Ltd.</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">MIT License</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">RadNLI Accuracy</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">65.21%</p>
              <p className="text-[10px] text-slate-400 mt-1">Outperforms ClinicalBERT & PubMedBERT</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mask Prediction</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">81.58%</p>
              <p className="text-[10px] text-slate-400 mt-1">Significant improvement over prior models</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">CNR Score (MS-CXR)</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">1.142</p>
              <p className="text-[10px] text-slate-400 mt-1">Best zero-shot phrase grounding</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Training Data</span>
              </div>
              <p className="text-sm font-bold text-slate-800">MIMIC-CXR, PubMed, MIMIC-III</p>
              <p className="text-[10px] text-slate-400 mt-1">Multi-modal contrastive learning</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>Research Use Only:</strong> This model is intended for AI research purposes and is not suitable for clinical diagnosis. It serves as a powerful tool for radiology NLP, medical image-text analysis, and automated healthcare documentation.</span>
            </p>
          </div>
        </div>
      )}

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload + Preview */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <Upload className="w-5 h-5 text-emerald-600" /> Upload X-Ray Image
            </h2>

            {!imageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
              >
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mx-auto mb-3">
                  <ScanLine className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG · max 10 MB</p>
                <p className="text-[10px] text-emerald-600 mt-2 font-semibold">Optimized for Chest X-Ray (CXR) analysis</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 group">
                <img src={imageUrl} alt="X-ray preview" className="w-full h-64 object-contain" />
                {/* Scanning overlay */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Grid overlay */}
                    <div
                      className="absolute inset-0 nx-xray-grid"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                    {/* Scan sweep */}
                    <div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] nx-xray-sweep"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.9))' }}
                    />
                    <div className="absolute inset-0 bg-emerald-500/5" />
                    {/* Corner brackets */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                    {/* Status */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                      <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      Running VLM analysis…
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
                <button onClick={handleScan} className="text-xs font-bold text-red-700 underline">Retry</button>
              </div>
            )}
          </div>

          {/* Scan configuration */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <Layers className="w-5 h-5 text-emerald-600" /> Select Scan Region
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SCAN_TYPES.map(type => {
                const Icon = type.Icon;
                const selected = scanType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setScanType(type.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      selected ? 'bg-emerald-50 border-emerald-500 shadow-glow' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    {type.recommended && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">Best</span>
                    )}
                    <div className={`p-2 rounded-xl w-fit mb-2 ${selected ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className={`text-xs font-bold ${selected ? 'text-emerald-700' : 'text-slate-700'}`}>{type.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Optional question */}
            <div className="mt-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Optional: ask a specific question
              </label>
              <textarea
                value={optionalQuestion}
                onChange={e => setOptionalQuestion(e.target.value)}
                placeholder="e.g. Is there any sign of pneumonia or pleural effusion?"
                className="w-full min-h-[70px] bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none scrollbar-slim"
              />
            </div>

            <div className="mt-auto pt-4 space-y-3">
              <button
                onClick={handleScan}
                disabled={!imageBase64 || isScanning}
                className={`w-full font-bold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5 ${
                  imageBase64 && !isScanning
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-glow-lg'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isScanning ? (
                  <><Activity className="w-4 h-4 animate-spin" /> AI scanning radiograph…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Run VLM Analysis</>
                )}
              </button>
              {!imageBase64 && <p className="text-[10px] text-slate-400 text-center">Upload an X-ray image to enable analysis</p>}

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                  <strong>Model Capabilities:</strong> Superior medical text understanding for radiology NLP, multi-modal contrastive learning for image-text alignment, and zero-shot phrase grounding on MS-CXR benchmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════ RESULTS ═══════════ */
        <div className="space-y-6 animate-fadeIn">
          {/* Summary banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={imageUrl} alt="scan" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 bg-black/20" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">VLM Screening Complete</p>
                  <h2 className="text-2xl font-extrabold mt-1">{SCAN_TYPES.find(s => s.id === scanType)?.label}</h2>
                  <p className="text-sm opacity-90 mt-1">
                    {attentionCount === 0 ? 'No significant abnormalities detected.' : `${attentionCount} region(s) flagged for review.`}
                  </p>
                  {aiMeta.model && aiMeta.model !== 'none' && (
                    <p className="text-[10px] opacity-70 mt-1">model: {aiMeta.model}{aiMeta.cached ? ' · cached' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/20">
                  <p className="text-2xl font-extrabold flex items-center gap-1 justify-center"><Zap className="w-4 h-4" />{avgConfidence}%</p>
                  <p className="text-[10px] font-bold uppercase">Confidence</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/20">
                  <p className="text-2xl font-extrabold">{analysis.findings.length}</p>
                  <p className="text-[10px] font-bold uppercase">Regions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image quality + Urgency row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${IMAGE_QUALITY_CONFIG[analysis.image_quality]?.bg ?? 'bg-slate-100'}`}>
                <ScanLine className={`w-5 h-5 ${IMAGE_QUALITY_CONFIG[analysis.image_quality]?.color ?? 'text-slate-600'}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Quality</p>
                <p className={`font-bold ${IMAGE_QUALITY_CONFIG[analysis.image_quality]?.color ?? 'text-slate-700'}`}>
                  {IMAGE_QUALITY_CONFIG[analysis.image_quality]?.label ?? analysis.image_quality}
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${URGENCY_CONFIG[analysis.urgency]?.bg ?? 'bg-slate-100 border-slate-200'}`}>
              {(() => {
                const U = URGENCY_CONFIG[analysis.urgency]?.Icon ?? Activity;
                return <U className={`w-5 h-5 ${URGENCY_CONFIG[analysis.urgency]?.color ?? 'text-slate-600'}`} />;
              })()}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgency</p>
                <p className={`font-bold ${URGENCY_CONFIG[analysis.urgency]?.color ?? 'text-slate-700'}`}>
                  {URGENCY_CONFIG[analysis.urgency]?.label ?? analysis.urgency}
                </p>
              </div>
            </div>
          </div>

          {/* Bilingual impression */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-black text-emerald-900 mb-3 flex items-center gap-2">
              <HeartPulse className="w-5 h-5" /> Radiologist Impression
            </h3>
            <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-emerald-100">
              <p className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap">{analysis.impression_en}</p>
              {analysis.impression_hi && (
                <p lang="hi" className="text-sm text-slate-600 mt-3 italic whitespace-pre-wrap border-t border-slate-200 pt-3">
                  {analysis.impression_hi}
                </p>
              )}
            </div>
          </div>

          {/* Findings list */}
          {analysis.findings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Detailed Findings
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
                          {/* Confidence bar */}
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                            <div className="flex-1 max-w-[160px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${cfg.barColor}`} style={{ width: `${finding.confidence}%` }} />
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

          {/* Disclaimer + actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50 border border-amber-100 p-5 rounded-3xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed max-w-2xl">
                <strong>Important:</strong>{' '}
                {analysis.disclaimer ||
                  'This AI X-ray reader provides a preliminary educational screening only. Imaging must be interpreted by a licensed radiologist. Please consult a doctor for an official report.'}
              </p>
            </div>
            <button
              onClick={reset}
              className="flex-shrink-0 bg-white hover:bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-amber-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Scan Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default XrayReader;
