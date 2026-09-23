'use client';

/**
 * AIOrchestrationPanel — Shows how the AI routing engine works.
 *
 * Displays:
 * 1. Input detection and routing logic
 * 2. Pipeline execution visualization
 * 3. Engine selection reasoning
 * 4. Demo scenarios (5 real healthcare use cases)
 * 5. Output format with confidence + explanation
 *
 * This is a TRANSPARENCY panel — users can see HOW the AI decides
 * which engine to use and what steps it takes.
 */

import React, { useState, useMemo } from 'react';
import {
  Brain, Network, Zap, Activity, FileText, Image as ImageIcon,
  Database, ChevronRight, Sparkles, ShieldCheck, Cpu, GitBranch,
  CheckCircle2, AlertTriangle, ArrowRight, Eye
} from 'lucide-react';
import { getDemoScenarios, type DemoScenario, type InputType, type EngineType } from '@/lib/orchestrationEngine';

const INPUT_ICONS: Record<InputType, React.ElementType> = {
  text: FileText,
  image: ImageIcon,
  pdf: FileText,
  structured: Database,
  multimodal: Network,
};

const ENGINE_CONFIG: Record<EngineType, { label: string; color: string; bg: string; icon: string }> = {
  gemini: { label: 'Gemini', color: 'text-blue-600', bg: 'bg-blue-50', icon: '🔮' },
  xgboost: { label: 'XGBoost', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '⚡' },
  glm: { label: 'GLM', color: 'text-violet-600', bg: 'bg-violet-50', icon: '🧠' },
  gemini_then_xgboost: { label: 'Gemini → XGBoost', color: 'text-amber-600', bg: 'bg-amber-50', icon: '🔗' },
};

export const AIOrchestrationPanel: React.FC = () => {
  const scenarios = useMemo(() => getDemoScenarios(), []);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const scenario = scenarios[selectedScenario];
  const result = scenario.result;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-violet-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400 opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"><Cpu className="w-7 h-7 text-violet-300" /></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              AI Orchestration Engine
              <span className="text-[9px] font-bold bg-violet-400 text-violet-900 px-2 py-0.5 rounded-full">CORE</span>
            </h1>
            <p className="text-violet-100/80 text-sm mt-1">Intelligent router — automatically selects the best AI engine for each task</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">🔮 Gemini (Multimodal)</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">⚡ XGBoost (ML)</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">🧠 GLM (Orchestrator)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔮</span>
            <div>
              <div className="font-bold text-sm text-slate-900">Gemini</div>
              <div className="text-[10px] text-slate-400">Primary Multimodal Engine</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Handles: text, images, PDFs, unstructured data. Extracts features, entities, and insights.</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {['Text', 'Image', 'PDF', 'Multimodal'].map(t => <span key={t} className="text-[8px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{t}</span>)}
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="font-bold text-sm text-slate-900">XGBoost</div>
              <div className="text-[10px] text-slate-400">Local ML Engine</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Handles: structured/tabular data. Classifies, predicts, and scores risk.</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {['Classification', 'Risk Score', 'Prediction'].map(t => <span key={t} className="text-[8px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">{t}</span>)}
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧠</span>
            <div>
              <div className="font-bold text-sm text-slate-900">GLM</div>
              <div className="text-[10px] text-slate-400">Orchestrator (You)</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Decides which engine to use, defines pipeline, synthesizes output.</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {['Routing', 'Pipeline', 'Synthesis'].map(t => <span key={t} className="text-[8px] font-bold bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded">{t}</span>)}
          </div>
        </div>
      </div>

      {/* Demo Scenario Selector */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-violet-600" /> Demo Scenarios — See the Router in Action</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {scenarios.map((s, i) => {
            const InputIcon = INPUT_ICONS[s.inputType];
            return (
              <button key={s.id} onClick={() => setSelectedScenario(i)}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${selectedScenario === i ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                <InputIcon className={`w-4 h-4 mb-1 ${selectedScenario === i ? 'text-violet-600' : 'text-slate-400'}`} />
                <div className="font-bold text-xs text-slate-900">{s.name}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{s.inputType}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scenario Detail */}
      <div className="space-y-4">
        {/* Input Detection */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-violet-50 rounded-xl"><Eye className="w-4 h-4 text-violet-600" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Step 1: Input Detection</h3>
              <p className="text-[10px] text-slate-400">Automatically classifies the input type</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Scenario:</span>
              <span className="text-sm font-bold text-slate-900">{scenario.name}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{scenario.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Detected Type:</span>
              <span className="text-xs font-extrabold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase">{result.inputType}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Prediction Needed:</span>
              <span className={`text-xs font-bold ${scenario.needsPrediction ? 'text-amber-600' : 'text-slate-400'}`}>{scenario.needsPrediction ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Routing Decision */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-50 rounded-xl"><GitBranch className="w-4 h-4 text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Step 2: Routing Decision</h3>
              <p className="text-[10px] text-slate-400">Selects the optimal engine based on input type</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Engine:</span>
              <span className={`text-sm font-extrabold ${ENGINE_CONFIG[result.routingDecision.selectedEngine].color} ${ENGINE_CONFIG[result.routingDecision.selectedEngine].bg} px-3 py-1 rounded-full`}>
                {ENGINE_CONFIG[result.routingDecision.selectedEngine].icon} {ENGINE_CONFIG[result.routingDecision.selectedEngine].label}
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-2">{result.routingDecision.reason}</p>
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Alternatives:</div>
            <ul className="text-[11px] text-slate-500 space-y-0.5">
              {result.routingDecision.alternatives.map((alt, i) => <li key={i} className="flex items-start gap-1"><span className="text-blue-400">→</span> {alt}</li>)}
            </ul>
          </div>
        </div>

        {/* Pipeline Execution */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-50 rounded-xl"><Zap className="w-4 h-4 text-emerald-600" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Step 3: Pipeline Execution</h3>
              <p className="text-[10px] text-slate-400">Each step processed by the selected engine</p>
            </div>
          </div>
          <div className="space-y-2">
            {result.pipeline.map((step, i) => {
              const cfg = ENGINE_CONFIG[step.engine];
              return (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-xs">{cfg.icon}</div>
                    {i < result.pipeline.length - 1 && <div className="w-px h-6 bg-slate-200" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cfg.label}: {step.action}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400">{step.duration}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="p-1 bg-white rounded text-slate-500">In: {step.input}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="p-1 bg-emerald-50 rounded text-emerald-600">Out: {step.output}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Output */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-violet-950 rounded-3xl p-6 shadow-xl border border-violet-500/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500 opacity-10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-violet-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-violet-400" /></div>
              <h3 className="text-sm font-bold text-violet-300 uppercase tracking-wider">Step 4: Structured Output</h3>
            </div>
            <p className="text-sm text-white leading-relaxed mb-4">{result.finalResult}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-300">{Math.round(result.confidenceScore * 100)}% confidence</span>
              </div>
              {result.fallbackUsed && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Fallback used</span>
                </div>
              )}
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Explanation:</span>
              <p className="text-[11px] text-slate-300 mt-0.5">{result.explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Safety Rules</h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> API keys never exposed to client</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> If Gemini fails → partial result returned</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> If XGBoost fails → analysis only returned</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Always provides best possible fallback</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Never hallucinates missing outputs</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Performance Rules</h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Uses minimum required engines</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Avoids unnecessary processing</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> XGBoost runs in under 50ms (local)</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Gemini called only when needed</li>
            <li className="flex items-start gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Future models added modularly</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          The AI Orchestration Engine is the intelligence layer that routes inputs to the optimal AI engine.
          It does NOT execute APIs directly — it decides, structures, and synthesizes.
          All engine calls are processed server-side with API keys secured. Client never sees raw API responses.
        </p>
      </div>
    </div>
  );
};

export default AIOrchestrationPanel;
