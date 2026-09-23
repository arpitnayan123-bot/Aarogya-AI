'use client';

// ============================================
// AAROGYA AI — AI ORCHESTRATION ENGINE UI
//
// Visualizes the GLM → Gemini → XGBoost orchestration pipeline.
// Users can input text, upload images, or provide structured data,
// then watch the orchestrator route and execute the pipeline.
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Brain, Sparkles, Image as ImageIcon, FileText, Database, Zap,
  Play, Loader2, CheckCircle2, XCircle, Clock, ArrowRight, Layers,
  Shield, ShieldCheck, ShieldAlert, Cpu, GitBranch, AlertTriangle, Eye,
  TrendingUp, FileJson, Activity, Lock,
} from 'lucide-react';

type InputType = 'text' | 'image' | 'pdf' | 'structured_data' | 'multimodal';

interface PipelineStepTrace {
  step: string;
  engine: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  summary?: string;
  output?: unknown;
  error?: string;
}

interface ExtractedFeature {
  name: string;
  value: string | number | boolean;
  confidence: number;
  source: string;
}

interface OrchestrationResult {
  input_type: InputType;
  pipeline: string[];
  pipelineTrace: PipelineStepTrace[];
  features_extracted: ExtractedFeature[];
  final_result: string;
  confidence_score: number;
  explanation: string;
  engines_used: string[];
  fallback_used: boolean;
  timestamp: string;
  totalDurationMs: number;
}

// --- Preset examples ---
const PRESETS = [
  {
    id: 'text-medical',
    label: 'Medical Text',
    icon: FileText,
    input: {
      text: 'Patient is a 52-year-old male. Lab results: HbA1c 7.2%, fasting glucose 154 mg/dL, LDL 145 mg/dL, blood pressure 142/88 mmHg, BMI 29.5. Reports fatigue and increased thirst.',
    },
  },
  {
    id: 'structured-risk',
    label: 'Structured Data',
    icon: Database,
    input: {
      structuredData: { hba1c: 7.2, fpg: 154, ldl: 145, systolic: 142, bmi: 29.5, age: 52 },
    },
  },
  {
    id: 'multimodal',
    label: 'Multimodal',
    icon: Layers,
    input: {
      text: 'Lab report shows elevated HbA1c and LDL. Patient feels fatigued.',
      structuredData: { hba1c: 6.9, ldl: 138, age: 48, bmi: 27 },
    },
  },
];

export default function AIOrchestrationEngine() {
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [structuredJson, setStructuredJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrchestrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setImageBase64(base64);
      setImageMime(file.type);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const clearImage = () => {
    setImageBase64(null);
    setImageMime(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setTextInput(preset.input.text || '');
    setStructuredJson(preset.input.structuredData ? JSON.stringify(preset.input.structuredData, null, 2) : '');
    clearImage();
    setResult(null);
    setError(null);
  };

  const runOrchestration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {};
      if (textInput.trim()) payload.text = textInput.trim();
      if (imageBase64 && imageMime) {
        payload.imageBase64 = imageBase64;
        payload.imageMimeType = imageMime;
      }
      let structuredData: Record<string, unknown> | undefined;
      if (structuredJson.trim()) {
        try {
          structuredData = JSON.parse(structuredJson);
          payload.structuredData = structuredData;
        } catch {
          setError('Invalid JSON in structured data field');
          setLoading(false);
          return;
        }
      }

      if (Object.keys(payload).length === 0) {
        setError('Please provide at least one input (text, image, or structured data)');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error || 'Orchestration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const detectedInputType = detectInputTypeFromInputs(textInput, !!imageBase64, !!structuredJson);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Header />

      {/* ENGINE STATUS BAR */}
      <EngineStatusBar />

      {/* PRESET EXAMPLES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quick Examples</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all text-left"
              >
                <Icon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input modalities */}
        <div className="space-y-4">
          {/* Detected input type */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 flex items-center gap-3">
            <Eye className="h-4 w-4 text-emerald-600" />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold">Auto-Detected Input Type</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">{detectedInputType.replace(/_/g, ' ')}</p>
            </div>
            <RoutingBadge inputType={detectedInputType} />
          </div>

          {/* Text input */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-cyan-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Text Input</h3>
            </div>
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Enter medical text, symptoms, lab descriptions..."
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Image input */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Image Input</h3>
              </div>
              {imagePreview && (
                <button onClick={clearImage} className="text-[11px] text-rose-500 hover:text-rose-600">Remove</button>
              )}
            </div>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="upload preview" className="w-full max-h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700" />
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 text-slate-400 hover:text-emerald-500 transition-colors text-xs"
              >
                <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                Click to upload image (X-ray, lab report photo, skin image)
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Structured data input */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Structured Data (JSON)</h3>
            </div>
            <textarea
              value={structuredJson}
              onChange={e => setStructuredJson(e.target.value)}
              placeholder='{"hba1c": 7.2, "ldl": 145, "age": 52}'
              rows={4}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Right: Pipeline visualization + result */}
        <div className="space-y-4">
          {/* Run button */}
          <button
            onClick={runOrchestration}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Orchestrating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Orchestration Pipeline
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">Error</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Pipeline trace */}
          {result && <PipelineTrace result={result} />}

          {/* Result */}
          {result && <ResultPanel result={result} />}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
              <Brain className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Run the pipeline to see results</p>
              <p className="text-[11px] text-slate-400 mt-1">The orchestrator will detect input type, route to the correct engine, and return structured output.</p>
            </div>
          )}
        </div>
      </div>

      {/* ARCHITECTURE DIAGRAM */}
      <ArchitectureDiagram />
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function Header() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
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
            <span className="text-xs font-semibold text-emerald-300 tracking-wide">ORCHESTRATOR ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-slate-300">API keys server-side</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs text-slate-300">Fallback-safe</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
          AI Orchestration Engine
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          GLM acts as the intelligent router: auto-detects input type, routes to Gemini
          (multimodal) or XGBoost (structured ML), executes the pipeline, and returns
          clean structured output with confidence + explanation.
        </p>
      </div>
    </div>
  );
}

// ============================================
// ENGINE STATUS BAR
// ============================================

function EngineStatusBar() {
  const [status, setStatus] = useState<{ gemini: boolean; xgboost: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/orchestrate')
      .then(r => r.json())
      .then(data => {
        setStatus({
          gemini: data.engines?.gemini?.available ?? false,
          xgboost: data.engines?.xgboost?.available ?? false,
        });
      })
      .catch(() => setStatus({ gemini: false, xgboost: true }));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <EngineCard
        name="Gemini"
        role="Multimodal Engine"
        icon={Sparkles}
        color="cyan"
        available={status?.gemini ?? null}
        capabilities={['Text', 'Image', 'PDF']}
      />
      <EngineCard
        name="XGBoost"
        role="ML Prediction"
        icon={Cpu}
        color="emerald"
        available={status?.xgboost ?? true}
        capabilities={['Structured', 'Classification', 'Risk']}
      />
      <EngineCard
        name="GLM"
        role="Orchestrator"
        icon={Brain}
        color="violet"
        available={true}
        capabilities={['Routing', 'Synthesis', 'Fallback']}
      />
    </div>
  );
}

function EngineCard({
  name, role, icon: Icon, color, available, capabilities,
}: {
  name: string; role: string; icon: typeof Sparkles; color: string;
  available: boolean | null; capabilities: string[];
}) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/15 text-cyan-600',
    emerald: 'bg-emerald-500/15 text-emerald-600',
    violet: 'bg-violet-500/15 text-violet-600',
  };
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {available === null ? (
          <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />
        ) : available ? (
          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
          </span>
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Fallback
          </span>
        )}
      </div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
      <p className="text-[10px] text-slate-500">{role}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {capabilities.map(c => (
          <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{c}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ROUTING BADGE
// ============================================

function RoutingBadge({ inputType }: { inputType: InputType }) {
  const routing: Record<InputType, { engines: string; color: string }> = {
    text: { engines: '→ Gemini', color: 'cyan' },
    image: { engines: '→ Gemini', color: 'cyan' },
    pdf: { engines: '→ Gemini', color: 'cyan' },
    structured_data: { engines: '→ XGBoost', color: 'emerald' },
    multimodal: { engines: '→ Gemini → XGBoost', color: 'violet' },
  };
  const r = routing[inputType];
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full bg-${r.color}-100 dark:bg-${r.color}-950/40 text-${r.color}-700 dark:text-${r.color}-300 font-semibold whitespace-nowrap`}>
      {r.engines}
    </span>
  );
}

// ============================================
// PIPELINE TRACE
// ============================================

function PipelineTrace({ result }: { result: OrchestrationResult }) {
  const stepIcon: Record<string, typeof Eye> = {
    input_detection: Eye,
    routing_decision: GitBranch,
    gemini_analysis: Sparkles,
    feature_extraction: FileJson,
    xgboost_prediction: Cpu,
    output_synthesis: Brain,
    fallback: ShieldAlert,
  };
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pipeline Execution</h3>
        <span className="ml-auto text-[10px] text-slate-400">{result.totalDurationMs}ms total</span>
      </div>
      <div className="space-y-2">
        {result.pipelineTrace.map((step, i) => {
          const Icon = stepIcon[step.step] || Activity;
          const statusColor = step.status === 'completed' ? 'emerald' : step.status === 'failed' ? 'rose' : step.status === 'skipped' ? 'slate' : 'amber';
          const statusIcon = step.status === 'completed' ? CheckCircle2 : step.status === 'failed' ? XCircle : step.status === 'skipped' ? Clock : Loader2;
          const SIcon = statusIcon;
          return (
            <div key={i} className="relative pl-8">
              {i < result.pipelineTrace.length - 1 && (
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
              )}
              <div className={`absolute left-0 top-0.5 h-6 w-6 rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-950/40 flex items-center justify-center`}>
                <Icon className={`h-3 w-3 text-${statusColor}-600`} />
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{step.step.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-1.5">
                    {step.durationMs !== undefined && <span className="text-[9px] text-slate-400">{step.durationMs}ms</span>}
                    <span className={`text-[9px] flex items-center gap-0.5 text-${statusColor}-600 capitalize`}>
                      <SIcon className={`h-2.5 w-2.5 ${step.status === 'running' ? 'animate-spin' : ''}`} />
                      {step.status}
                    </span>
                  </div>
                </div>
                {step.summary && <p className="text-[11px] text-slate-500">{step.summary}</p>}
                {step.error && <p className="text-[11px] text-rose-500 mt-0.5">Error: {step.error}</p>}
                <span className="text-[9px] text-slate-400 capitalize">engine: {step.engine}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// RESULT PANEL
// ============================================

function ResultPanel({ result }: { result: OrchestrationResult }) {
  const confPct = Math.round(result.confidence_score * 100);
  const confColor = confPct >= 70 ? 'emerald' : confPct >= 50 ? 'amber' : 'rose';
  return (
    <div className="space-y-3">
      {/* Final result */}
      <div className={`rounded-xl border-2 border-${confColor}-300 dark:border-${confColor}-700 bg-${confColor}-50/30 dark:bg-${confColor}-950/20 p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className={`h-4 w-4 text-${confColor}-600`} />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Final Result</h3>
          {result.fallback_used && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">Fallback used</span>
          )}
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-100">{result.final_result}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Confidence</span>
            <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className={`h-full rounded-full bg-${confColor}-500`} style={{ width: `${confPct}%` }} />
            </div>
            <span className={`text-xs font-bold text-${confColor}-600`}>{confPct}%</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Explanation</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">{result.explanation}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {result.engines_used.map(e => (
            <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 capitalize">{e}</span>
          ))}
        </div>
      </div>

      {/* Extracted features */}
      {result.features_extracted.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Extracted Features ({result.features_extracted.length})</h3>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 orch-scroll pr-1">
            {result.features_extracted.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-200 flex-1">{f.name}</span>
                <span className="text-slate-500 font-mono">{String(f.value)}</span>
                <span className={`text-[9px] px-1 py-0.5 rounded ${f.source === 'gemini' ? 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'}`}>
                  {f.source}
                </span>
                <span className="text-[9px] text-slate-400">{Math.round(f.confidence * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ARCHITECTURE DIAGRAM
// ============================================

function ArchitectureDiagram() {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Layers className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Orchestration Architecture</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">How the pipeline routes inputs through engines</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[700px]">
          {/* Input */}
          <ArchNode icon={FileText} label="Input" sub="Text / Image / PDF / Structured" color="slate" />
          <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
          {/* GLM Router */}
          <ArchNode icon={Brain} label="GLM Router" sub="Detects type → Routes" color="violet" highlight />
          <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
          {/* Engines */}
          <div className="flex flex-col gap-2">
            <ArchNode icon={Sparkles} label="Gemini" sub="Unstructured → Features" color="cyan" />
            <ArchNode icon={Cpu} label="XGBoost" sub="Structured → Prediction" color="emerald" />
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
          {/* Synthesis */}
          <ArchNode icon={Brain} label="GLM Synthesis" sub="Combine + Explain" color="violet" highlight />
          <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
          {/* Output */}
          <ArchNode icon={CheckCircle2} label="Structured Output" sub="Result + Confidence" color="emerald" />
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Shield className="h-3 w-3 text-emerald-500" /> API keys never exposed to client
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <ShieldCheck className="h-3 w-3 text-cyan-500" /> Graceful fallback on engine failure
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Lock className="h-3 w-3 text-violet-500" /> Extensible — new engines plug in modularly
        </div>
      </div>
    </section>
  );
}

function ArchNode({ icon: Icon, label, sub, color, highlight }: {
  icon: typeof FileText; label: string; sub: string; color: string; highlight?: boolean;
}) {
  const colorMap: Record<string, string> = {
    slate: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600',
    violet: 'border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
    cyan: 'border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
    emerald: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
  };
  return (
    <div className={`rounded-xl border-2 p-3 min-w-[120px] text-center ${colorMap[color]} ${highlight ? 'shadow-lg' : ''}`}>
      <Icon className="h-5 w-5 mx-auto mb-1" />
      <p className="text-xs font-bold">{label}</p>
      <p className="text-[9px] opacity-70 mt-0.5">{sub}</p>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function detectInputTypeFromInputs(text: string, hasImage: boolean, hasStructured: boolean): InputType {
  const hasText = text.trim().length > 0;
  const modalCount = [hasText, hasImage, hasStructured].filter(Boolean).length;
  if (modalCount >= 2) return 'multimodal';
  if (hasImage) return 'image';
  if (hasStructured) return 'structured_data';
  if (hasText) return 'text';
  return 'text';
}
