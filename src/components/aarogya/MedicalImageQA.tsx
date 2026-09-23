'use client';

// ============================================
// AAROGYA AI — MEDICAL VISUAL Q&A
// Image + question → real AI via /api/ai/xray (VLM)
// Conversation history with follow-up questions.
// Emerald/teal medical-grade design.
// ============================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ScanLine, Upload, Sparkles, AlertTriangle,
  Activity, RotateCcw, Cpu, Database, Award,
  MessageSquare, Image as ImageIcon, Search, X,
  Send, User, Bot, Loader2, ChevronDown, Info,
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
// TYPES
// ============================================

interface QATurn {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  impression_hi?: string;
  findings?: { region: string; observation: string; severity: string }[];
  recommendations?: string[];
  urgency?: string;
  timestamp: number;
  error?: boolean;
}

const SAMPLE_QUESTIONS = [
  'What abnormalities are visible in this image?',
  'Is there any sign of pneumonia or consolidation?',
  'Describe the lung fields and cardiac silhouette.',
  'Are there any bone fractures visible?',
  'What is the primary finding in this radiograph?',
];

// ============================================
// NORMALIZE AI RESPONSE
// ============================================

function normalizeAnswer(raw: any): {
  answer: string;
  impression_hi?: string;
  findings: { region: string; observation: string; severity: string }[];
  recommendations: string[];
  urgency?: string;
  confidence: number;
} {
  if (!raw || typeof raw !== 'object') {
    return { answer: 'No response from AI.', findings: [], recommendations: [], confidence: 30 };
  }
  const answer = String(
    raw.impression_en || raw.answer || raw.response || raw.summary_en || ''
  ) || 'The AI could not produce a structured answer.';
  return {
    answer,
    impression_hi: String(raw.impression_hi || raw.summary_hi || '') || undefined,
    findings: Array.isArray(raw.findings)
      ? raw.findings.map((f: any) => ({
          region: String(f?.region ?? ''),
          observation: String(f?.observation ?? ''),
          severity: String(f?.severity ?? 'normal'),
        }))
      : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations.map(String) : [],
    urgency: raw.urgency,
    confidence: Number(raw.confidence ?? 60) || 60,
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export const MedicalImageQA: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [turns, setTurns] = useState<QATurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedTurn, setExpandedTurn] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const turnsEndRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest turn
  useEffect(() => {
    if (turnsEndRef.current) {
      turnsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [turns, isProcessing]);

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
      setTurns([]); // reset conversation on new image
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

  const askQuestion = async (questionText?: string) => {
    const q = (questionText ?? question).trim();
    if (!imageBase64) {
      setError('Please upload a medical image first.');
      return;
    }
    if (!q) {
      setError('Please enter a question.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setQuestion(''); // clear input

    // Optimistic placeholder turn
    const turnId = `turn-${Date.now()}`;
    setTurns(prev => [...prev, {
      id: turnId,
      question: q,
      answer: '',
      confidence: 0,
      findings: [],
      recommendations: [],
      timestamp: Date.now(),
    }]);

    try {
      const res = await fetch('/api/ai/xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, text: q }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const result = await res.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed.');
      }
      const normalized = normalizeAnswer(result.data);
      setTurns(prev => prev.map(t => t.id === turnId ? {
        ...t,
        answer: normalized.answer,
        impression_hi: normalized.impression_hi,
        findings: normalized.findings,
        recommendations: normalized.recommendations,
        urgency: normalized.urgency,
        confidence: normalized.confidence,
      } : t));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Check your connection.';
      setTurns(prev => prev.map(t => t.id === turnId ? {
        ...t,
        answer: `⚠️ ${msg}`,
        confidence: 0,
        error: true,
      } : t));
    } finally {
      setIsProcessing(false);
      setTimeout(() => questionInputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const reset = () => {
    setImageUrl('');
    setImageBase64('');
    setFileName('');
    setQuestion('');
    setTurns([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        @keyframes nxQaTyping {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .nx-qa-dot { animation: nxQaTyping 1.2s infinite ease-in-out; }
        @keyframes nxQaScanSweep {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
          65% { opacity: 0; }
          100% { top: 0%; opacity: 0; }
        }
        .nx-qa-sweep { animation: nxQaScanSweep 2.2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Medical Visual Q&amp;A</h1>
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
            🤝 BiomedCLIP-PubMedBERT · Microsoft Corporation (India) Pvt. Ltd.
          </span>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-full border border-cyan-100">
            PMC-15M Dataset (15M biomedical image-text pairs)
          </span>
        </div>
      </div>

      {/* Model info panel */}
      {showModelInfo && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 p-5 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
              <ScanLine className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-slate-800">BiomedCLIP-PubMedBERT_256-vit_base_patch16_224</h3>
              <p className="text-xs text-slate-500 mt-0.5">Zero-Shot Image Classification · Vision-Language Foundation Model</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Sector: Healthcare, Wellness &amp; Family Welfare · Updated: Mar 2025</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">MIT License</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Training Dataset</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">PMC-15M</p>
              <p className="text-[10px] text-slate-400 mt-1">15,000,000 biomedical image-text pairs</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Cpu className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Architecture</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">PubMedBERT + ViT</p>
              <p className="text-[10px] text-slate-400 mt-1">Text encoder + Vision Transformer</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Model Type</span>
              </div>
              <p className="text-sm font-extrabold text-slate-800">Zero-Shot Classification</p>
              <p className="text-[10px] text-slate-400 mt-1">Vision-Language Foundation Model</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Core Applications</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Cross-modal retrieval (text-to-image and image-to-text search)',
                'Zero-shot image classification for medical images',
                'Visual question answering (VQA) in radiology and pathology',
                'Supports radiography, microscopy, and histology modalities',
              ].map((app, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold">{idx + 1}</span>
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image panel (left, sticky on desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm lg:sticky lg:top-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
              <ImageIcon className="w-5 h-5 text-emerald-600" /> Medical Image
            </h2>

            {!imageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
              >
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mx-auto mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-700">Upload a medical image</p>
                <p className="text-xs text-slate-400 mt-1">Radiography, microscopy, histology (JPG, PNG · max 10 MB)</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 group">
                <img src={imageUrl} alt="Medical" className="w-full h-56 object-contain" />
                {isProcessing && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] nx-qa-sweep"
                    />
                    <div className="absolute inset-0 bg-emerald-500/5" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap">
                      <Activity className="w-3 h-3 animate-spin text-emerald-400" />
                      Encoding image + question…
                    </div>
                  </div>
                )}
                <button
                  onClick={reset}
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

            {/* Sample questions */}
            {imageUrl && (
              <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Try a sample question:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setQuestion(q); questionInputRef.current?.focus(); }}
                      className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-full transition-colors border border-emerald-100 flex items-center gap-1"
                    >
                      <Search className="w-3 h-3" /> {q.split(' ').slice(0, 4).join(' ')}…
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                <strong>How it works:</strong> BiomedCLIP encodes your image with Vision Transformer (ViT) and your question with PubMedBERT, then performs cross-modal attention across 15M+ biomedical references.
              </p>
            </div>
          </div>
        </div>

        {/* Conversation panel (right) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-[600px]">
            {/* Conversation header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-emerald-600" /> Conversation
              </h2>
              {turns.length > 0 && (
                <button
                  onClick={() => setTurns([])}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Conversation body */}
            <div className="flex-1 overflow-y-auto scrollbar-slim p-5 space-y-5">
              {turns.length === 0 && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl w-fit mb-4">
                    <Bot className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">Ask about your medical image</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    {imageUrl
                      ? 'Type a question below or pick a sample. The AI will analyze the image and respond.'
                      : 'Upload a medical image first, then ask clinical questions about it.'}
                  </p>
                </div>
              )}

              {turns.map(turn => (
                <div key={turn.id} className="space-y-3">
                  {/* User question bubble */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{turn.question}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  </div>

                  {/* AI answer bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className={`max-w-[85%] ${turn.error ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-100'} px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm`}>
                      {turn.answer ? (
                        <>
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${turn.error ? 'text-red-700' : 'text-slate-700'}`}>
                            {turn.answer}
                          </p>
                          {turn.impression_hi && !turn.error && (
                            <p lang="hi" className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-200 whitespace-pre-wrap">
                              {turn.impression_hi}
                            </p>
                          )}
                          {!turn.error && (
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 flex-wrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                turn.confidence >= 85 ? 'bg-emerald-100 text-emerald-700'
                                : turn.confidence >= 70 ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                                {turn.confidence}% confidence
                              </span>
                              {turn.urgency && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                                  {turn.urgency.replace('_', ' ')}
                                </span>
                              )}
                              {turn.findings.length > 0 && (
                                <button
                                  onClick={() => setExpandedTurn(expandedTurn === turn.id ? null : turn.id)}
                                  className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 ml-auto"
                                >
                                  {turn.findings.length} finding(s)
                                  {expandedTurn === turn.id ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Expandable findings */}
                          {expandedTurn === turn.id && turn.findings.length > 0 && (
                            <div className="mt-3 space-y-2 animate-fadeIn">
                              {turn.findings.map((f, i) => (
                                <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-800">{f.region}</span>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                      f.severity === 'normal' ? 'bg-emerald-100 text-emerald-700'
                                      : f.severity === 'mild' ? 'bg-amber-100 text-amber-700'
                                      : f.severity === 'moderate' ? 'bg-orange-100 text-orange-700'
                                      : 'bg-red-100 text-red-700'
                                    }`}>
                                      {f.severity}
                                    </span>
                                  </div>
                                  {f.observation && <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.observation}</p>}
                                </div>
                              ))}
                              {turn.recommendations.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Recommendations</p>
                                  <ul className="space-y-1">
                                    {turn.recommendations.map((r, i) => (
                                      <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                        <span className="text-emerald-500 mt-0.5">•</span> {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        // Placeholder while loading
                        <div className="flex items-center gap-2 py-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full nx-qa-dot" />
                          <span className="w-2 h-2 bg-emerald-500 rounded-full nx-qa-dot" style={{ animationDelay: '0.15s' }} />
                          <span className="w-2 h-2 bg-emerald-500 rounded-full nx-qa-dot" style={{ animationDelay: '0.3s' }} />
                          <span className="text-xs text-slate-400 ml-1">BiomedCLIP is thinking…</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isProcessing && turns.length > 0 && turns[turns.length - 1].answer === '' && (
                <div ref={turnsEndRef} />
              )}
              <div ref={turnsEndRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-slate-100 p-3">
              {error && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">{error}</span>
                  <button onClick={() => setError(null)} className="text-red-500"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={questionInputRef}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={imageUrl ? 'Ask a clinical question… (Enter to send, Shift+Enter for newline)' : 'Upload an image to start asking…'}
                  disabled={!imageUrl || isProcessing}
                  rows={1}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none scrollbar-slim disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => askQuestion()}
                  disabled={!imageUrl || !question.trim() || isProcessing}
                  className={`p-3 rounded-2xl transition-all flex-shrink-0 ${
                    imageUrl && question.trim() && !isProcessing
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-glow-lg'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label="Send question"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Research Use Only:</strong>{' '}
              <span>BiomedCLIP is intended for AI research purposes and is not suitable for clinical decision-making or commercial deployment. Consult a qualified radiologist or medical professional for official interpretation.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalImageQA;
