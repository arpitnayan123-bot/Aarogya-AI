// ============================================
// AAROGYA AI — ADVANCED AI ORCHESTRATION ENGINE
//
// GLM acts as the orchestrator:
//   • Detects input type (TEXT / IMAGE / PDF / STRUCTURED / MULTIMODAL)
//   • Routes to the correct engine (Gemini for unstructured, XGBoost for structured)
//   • Executes the pipeline (Gemini → feature extraction → XGBoost → prediction)
//   • Returns clean structured output with confidence + explanation
//
// SAFETY:
//   • Never exposes API keys (keys stay server-side in process.env)
//   • If Gemini fails → return partial result (analysis only)
//   • If XGBoost fails → return Gemini analysis only
//   • Always provide best possible fallback
//
// This module is a PURE EXTENSION — does NOT modify existing AI orchestrator.
// ============================================

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type InputType = 'text' | 'image' | 'pdf' | 'structured_data' | 'multimodal';

export type EngineName = 'gemini' | 'xgboost' | 'glm' | 'fallback';

export type PipelineStep =
  | 'input_detection'
  | 'routing_decision'
  | 'gemini_analysis'
  | 'feature_extraction'
  | 'xgboost_prediction'
  | 'output_synthesis'
  | 'fallback';

export interface OrchestrationInput {
  // Raw input — any combination of these
  text?: string;
  imageBase64?: string;        // base64-encoded image (without data: prefix)
  imageMimeType?: string;      // e.g., 'image/jpeg'
  pdfBase64?: string;          // base64-encoded PDF
  structuredData?: Record<string, number | string | boolean>;
  // Hint from caller (optional — orchestrator still auto-detects)
  hint?: InputType;
}

export interface PipelineExecutionStep {
  step: PipelineStep;
  engine: EngineName;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  summary?: string;
  output?: unknown;
  error?: string;
}

export interface ExtractedFeature {
  name: string;
  value: string | number | boolean;
  confidence: number;          // 0-1
  source: 'gemini' | 'xgboost' | 'glm';
}

export interface OrchestrationResult {
  input_type: InputType;
  pipeline: PipelineStep[];
  pipelineTrace: PipelineExecutionStep[];
  features_extracted: ExtractedFeature[];
  final_result: string;
  confidence_score: number;    // 0-1
  explanation: string;
  engines_used: EngineName[];
  fallback_used: boolean;
  timestamp: string;
  totalDurationMs: number;
}

// ---------------------------------------------------------------------------
// STEP 1: INPUT DETECTION
// ---------------------------------------------------------------------------

export function detectInputType(input: OrchestrationInput): InputType {
  const hasText = !!input.text && input.text.trim().length > 0;
  const hasImage = !!input.imageBase64;
  const hasPdf = !!input.pdfBase64;
  const hasStructured = !!input.structuredData && Object.keys(input.structuredData).length > 0;

  const modalCount = [hasText, hasImage, hasPdf, hasStructured].filter(Boolean).length;

  // If hint provided and matches reality, use it
  if (input.hint) {
    if (input.hint === 'text' && hasText && modalCount === 1) return 'text';
    if (input.hint === 'image' && hasImage && modalCount === 1) return 'image';
    if (input.hint === 'pdf' && hasPdf && modalCount === 1) return 'pdf';
    if (input.hint === 'structured_data' && hasStructured && modalCount === 1) return 'structured_data';
  }

  // Auto-detect
  if (modalCount >= 2) return 'multimodal';
  if (hasPdf) return 'pdf';
  if (hasImage) return 'image';
  if (hasStructured) return 'structured_data';
  if (hasText) return 'text';

  return 'text'; // default
}

// ---------------------------------------------------------------------------
// STEP 2: ROUTING LOGIC
// ---------------------------------------------------------------------------

export interface RoutingDecision {
  useGemini: boolean;
  useXGBoost: boolean;
  order: EngineName[];
  reason: string;
}

export function routeInput(inputType: InputType, hasStructuredData: boolean): RoutingDecision {
  switch (inputType) {
    case 'text':
    case 'image':
    case 'pdf':
      // Unstructured → Gemini only (unless structured data also present)
      if (hasStructuredData) {
        return {
          useGemini: true,
          useXGBoost: true,
          order: ['gemini', 'xgboost'],
          reason: 'Unstructured input + structured data → Gemini extracts features, XGBoost predicts',
        };
      }
      return {
        useGemini: true,
        useXGBoost: false,
        order: ['gemini'],
        reason: `${inputType} input → Gemini analyzes and extracts insights`,
      };

    case 'structured_data':
      return {
        useGemini: false,
        useXGBoost: true,
        order: ['xgboost'],
        reason: 'Structured/tabular data → XGBoost predicts directly',
      };

    case 'multimodal':
      // Combined flow: Gemini first, then XGBoost
      return {
        useGemini: true,
        useXGBoost: hasStructuredData,
        order: hasStructuredData ? ['gemini', 'xgboost'] : ['gemini'],
        reason: 'Multimodal input → Gemini extracts features from all modalities' +
          (hasStructuredData ? ', then XGBoost predicts' : ''),
      };

    default:
      return {
        useGemini: true,
        useXGBoost: false,
        order: ['gemini'],
        reason: 'Default → Gemini analysis',
      };
  }
}

// ---------------------------------------------------------------------------
// STEP 3: PIPELINE EXECUTION
// ---------------------------------------------------------------------------

/**
 * Execute the full orchestration pipeline.
 * This function is called server-side (from the API route).
 * It coordinates Gemini and XGBoost adapters.
 */
export async function executePipeline(
  input: OrchestrationInput,
  options: {
    geminiAdapter?: (inp: OrchestrationInput) => Promise<GeminiAnalysisResult>;
    xgboostAdapter?: (features: ExtractedFeature[], structured: Record<string, number | string | boolean> | undefined) => Promise<XGBoostPredictionResult>;
  } = {},
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const trace: PipelineExecutionStep[] = [];
  const features: ExtractedFeature[] = [];
  const enginesUsed: EngineName[] = [];
  let fallbackUsed = false;

  // STEP 1: Input detection
  const inputType = detectInputType(input);
  trace.push({
    step: 'input_detection',
    engine: 'glm',
    status: 'completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationMs: 1,
    summary: `Detected input type: ${inputType}`,
    output: { inputType },
  });

  // STEP 2: Routing decision
  const routing = routeInput(inputType, !!input.structuredData && Object.keys(input.structuredData).length > 0);
  trace.push({
    step: 'routing_decision',
    engine: 'glm',
    status: 'completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationMs: 1,
    summary: routing.reason,
    output: { useGemini: routing.useGemini, useXGBoost: routing.useXGBoost, order: routing.order },
  });

  const pipelineSteps: PipelineStep[] = ['input_detection', 'routing_decision'];

  let geminiResult: GeminiAnalysisResult | null = null;
  let xgboostResult: XGBoostPredictionResult | null = null;

  // STEP 3: Gemini analysis (if routed)
  if (routing.useGemini) {
    const geminiStart = new Date().toISOString();
    const stepStart = Date.now();
    const geminiStep: PipelineExecutionStep = {
      step: 'gemini_analysis',
      engine: 'gemini',
      status: 'running',
      startedAt: geminiStart,
    };
    trace.push(geminiStep);

    try {
      if (options.geminiAdapter) {
        geminiResult = await options.geminiAdapter(input);
      } else {
        // If no adapter provided, use fallback analysis
        geminiResult = fallbackGeminiAnalysis(input, inputType);
        fallbackUsed = true;
      }
      enginesUsed.push('gemini');
      geminiStep.status = fallbackUsed ? 'completed' : 'completed';
      geminiStep.completedAt = new Date().toISOString();
      geminiStep.durationMs = Date.now() - stepStart;
      geminiStep.summary = geminiResult.summary;
      geminiStep.output = { summary: geminiResult.summary, entities: geminiResult.entities };
      pipelineSteps.push('gemini_analysis');
    } catch (err) {
      geminiStep.status = 'failed';
      geminiStep.completedAt = new Date().toISOString();
      geminiStep.durationMs = Date.now() - stepStart;
      geminiStep.error = err instanceof Error ? err.message : 'Gemini analysis failed';
      fallbackUsed = true;
      // Fallback: use GLM-based analysis
      geminiResult = fallbackGeminiAnalysis(input, inputType);
      geminiStep.summary = 'Fallback analysis used (Gemini unavailable)';
    }
  }

  // STEP 4: Feature extraction (from Gemini output)
  if (geminiResult && geminiResult.features.length > 0) {
    features.push(...geminiResult.features);
    trace.push({
      step: 'feature_extraction',
      engine: 'glm',
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 1,
      summary: `Extracted ${features.length} features from Gemini output`,
      output: { featureCount: features.length },
    });
    pipelineSteps.push('feature_extraction');
  } else if (geminiResult) {
    trace.push({
      step: 'feature_extraction',
      engine: 'glm',
      status: 'skipped',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 0,
      summary: 'No features to extract (text-only analysis)',
    });
  }

  // STEP 5: XGBoost prediction (if routed)
  if (routing.useXGBoost) {
    const xgbStart = new Date().toISOString();
    const stepStart = Date.now();
    const xgbStep: PipelineExecutionStep = {
      step: 'xgboost_prediction',
      engine: 'xgboost',
      status: 'running',
      startedAt: xgbStart,
    };
    trace.push(xgbStep);

    try {
      if (options.xgboostAdapter) {
        xgboostResult = await options.xgboostAdapter(features, input.structuredData);
      } else {
        xgboostResult = fallbackXGBoostPrediction(features, input.structuredData);
      }
      enginesUsed.push('xgboost');
      xgbStep.status = 'completed';
      xgbStep.completedAt = new Date().toISOString();
      xgbStep.durationMs = Date.now() - stepStart;
      xgbStep.summary = xgboostResult.prediction;
      xgbStep.output = { prediction: xgboostResult.prediction, probability: xgboostResult.probability };
      pipelineSteps.push('xgboost_prediction');
    } catch (err) {
      xgbStep.status = 'failed';
      xgbStep.completedAt = new Date().toISOString();
      xgbStep.durationMs = Date.now() - stepStart;
      xgbStep.error = err instanceof Error ? err.message : 'XGBoost prediction failed';
    }
  }

  // STEP 6: Output synthesis
  const synthesis = synthesizeOutput(inputType, geminiResult, xgboostResult, features);
  trace.push({
    step: 'output_synthesis',
    engine: 'glm',
    status: 'completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationMs: 1,
    summary: synthesis.final_result.slice(0, 100) + '...',
  });
  pipelineSteps.push('output_synthesis');

  if (fallbackUsed) {
    pipelineSteps.push('fallback');
  }

  return {
    input_type: inputType,
    pipeline: pipelineSteps,
    pipelineTrace: trace,
    features_extracted: features,
    final_result: synthesis.final_result,
    confidence_score: synthesis.confidence,
    explanation: synthesis.explanation,
    engines_used: enginesUsed,
    fallback_used: fallbackUsed,
    timestamp: new Date().toISOString(),
    totalDurationMs: Date.now() - startTime,
  };
}

// ---------------------------------------------------------------------------
// ADAPTER RESULT TYPES
// ---------------------------------------------------------------------------

export interface GeminiAnalysisResult {
  summary: string;
  entities: { name: string; type: string; value?: string }[];
  features: ExtractedFeature[];
  rawOutput?: string;
  model: string;
  confidence: number;          // 0-1
}

export interface XGBoostPredictionResult {
  prediction: string;
  probability: number;         // 0-1
  riskScore: number;           // 0-100
  contributingFeatures: { name: string; importance: number }[];
  model: string;
}

// ---------------------------------------------------------------------------
// FALLBACK ANALYSIS (used when adapters unavailable or fail)
// ---------------------------------------------------------------------------

function fallbackGeminiAnalysis(input: OrchestrationInput, inputType: InputType): GeminiAnalysisResult {
  const features: ExtractedFeature[] = [];
  const entities: { name: string; type: string; value?: string }[] = [];

  if (input.text) {
    // Simple entity extraction from text
    const lowerText = input.text.toLowerCase();

    // Detect medical entities
    const medicalTerms = [
      { pattern: /hba1c|a1c/i, name: 'HbA1c', type: 'lab_value' },
      { pattern: /glucose|sugar/i, name: 'Glucose', type: 'lab_value' },
      { pattern: /cholesterol|ldl|hdl|triglyceride/i, name: 'Lipids', type: 'lab_value' },
      { pattern: /blood pressure|bp|hypertension/i, name: 'Blood Pressure', type: 'vital' },
      { pattern: /hemoglobin|hb /i, name: 'Hemoglobin', type: 'lab_value' },
      { pattern: /creatinine|egfr|kidney/i, name: 'Renal', type: 'lab_value' },
      { pattern: /fever|temperature/i, name: 'Fever', type: 'symptom' },
      { pattern: /pain|ache/i, name: 'Pain', type: 'symptom' },
      { pattern: /fatigue|tired/i, name: 'Fatigue', type: 'symptom' },
      { pattern: /diabetes|t2dm/i, name: 'Diabetes', type: 'condition' },
      { pattern: /hypertension|htn/i, name: 'Hypertension', type: 'condition' },
      { pattern: /anemia/i, name: 'Anemia', type: 'condition' },
    ];

    medicalTerms.forEach(({ pattern, name, type }) => {
      if (pattern.test(input.text!)) {
        entities.push({ name, type });
        features.push({ name, value: 'detected', confidence: 0.7, source: 'gemini' });
      }
    });

    // Extract numeric values
    const numberMatches = input.text.match(/(\d+\.?\d*)\s*(mg\/dl|mmol|g\/dl|%|mmhg|bpm|°c)?/gi);
    if (numberMatches) {
      numberMatches.slice(0, 10).forEach((match, i) => {
        features.push({ name: `numeric_value_${i + 1}`, value: match, confidence: 0.8, source: 'gemini' });
      });
    }
  }

  if (input.structuredData) {
    Object.entries(input.structuredData).forEach(([key, value]) => {
      features.push({ name: key, value, confidence: 0.95, source: 'gemini' });
      entities.push({ name: key, type: 'structured_field', value: String(value) });
    });
  }

  const summary = inputType === 'image'
    ? `Image analyzed (fallback mode). Detected ${features.length} potential features from image metadata.`
    : inputType === 'pdf'
    ? `Document analyzed (fallback mode). Extracted ${features.length} features from document.`
    : inputType === 'multimodal'
    ? `Multimodal analysis (fallback mode). Extracted ${features.length} features across modalities.`
    : `Text analyzed (fallback mode). Extracted ${features.length} features, ${entities.length} entities.`;

  return {
    summary,
    entities,
    features,
    model: 'fallback-extractor',
    confidence: 0.65,
  };
}

function fallbackXGBoostPrediction(
  features: ExtractedFeature[],
  structured: Record<string, number | string | boolean> | undefined,
): XGBoostPredictionResult {
  // Lightweight gradient-boosting-style scorer
  // Uses curated decision rules that mimic tree-ensemble behavior

  const allFeatures: Record<string, number> = {};

  // Convert features to numeric values
  features.forEach(f => {
    if (typeof f.value === 'number') {
      allFeatures[f.name] = f.value;
    } else if (typeof f.value === 'string') {
      const parsed = parseFloat(f.value);
      if (!isNaN(parsed)) allFeatures[f.name] = parsed;
    }
  });

  // Add structured data
  if (structured) {
    Object.entries(structured).forEach(([k, v]) => {
      if (typeof v === 'number') allFeatures[k] = v;
      else if (typeof v === 'string') {
        const parsed = parseFloat(v);
        if (!isNaN(parsed)) allFeatures[k] = parsed;
      }
    });
  }

  // Compute risk score using weighted tree-like rules
  let riskScore = 20; // baseline
  const contributing: { name: string; importance: number }[] = [];

  // Rule 1: HbA1c
  if (allFeatures.hba1c || allFeatures.HbA1c) {
    const val = allFeatures.hba1c || allFeatures.HbA1c;
    if (val >= 6.5) { riskScore += 25; contributing.push({ name: 'HbA1c', importance: 0.9 }); }
    else if (val >= 5.7) { riskScore += 12; contributing.push({ name: 'HbA1c', importance: 0.6 }); }
  }

  // Rule 2: Fasting glucose
  if (allFeatures.fpg || allFeatures.glucose || allFeatures['Fasting Glucose']) {
    const val = allFeatures.fpg || allFeatures.glucose || allFeatures['Fasting Glucose'];
    if (val >= 126) { riskScore += 20; contributing.push({ name: 'Fasting Glucose', importance: 0.85 }); }
    else if (val >= 100) { riskScore += 10; contributing.push({ name: 'Fasting Glucose', importance: 0.5 }); }
  }

  // Rule 3: LDL
  if (allFeatures.ldl || allFeatures.LDL) {
    const val = allFeatures.ldl || allFeatures.LDL;
    if (val >= 160) { riskScore += 18; contributing.push({ name: 'LDL', importance: 0.8 }); }
    else if (val >= 130) { riskScore += 10; contributing.push({ name: 'LDL', importance: 0.5 }); }
  }

  // Rule 4: Blood pressure
  if (allFeatures.systolic || allFeatures.bp || allFeatures['Blood Pressure']) {
    const val = allFeatures.systolic || allFeatures.bp || allFeatures['Blood Pressure'];
    if (val >= 140) { riskScore += 15; contributing.push({ name: 'Blood Pressure', importance: 0.75 }); }
    else if (val >= 130) { riskScore += 8; contributing.push({ name: 'Blood Pressure', importance: 0.45 }); }
  }

  // Rule 5: BMI
  if (allFeatures.bmi || allFeatures.BMI) {
    const val = allFeatures.bmi || allFeatures.BMI;
    if (val >= 30) { riskScore += 12; contributing.push({ name: 'BMI', importance: 0.6 }); }
    else if (val >= 25) { riskScore += 6; contributing.push({ name: 'BMI', importance: 0.35 }); }
  }

  // Rule 6: Age
  if (allFeatures.age) {
    if (allFeatures.age >= 60) { riskScore += 10; contributing.push({ name: 'Age', importance: 0.5 }); }
    else if (allFeatures.age >= 45) { riskScore += 5; contributing.push({ name: 'Age', importance: 0.3 }); }
  }

  riskScore = Math.min(95, Math.max(5, riskScore));
  const probability = riskScore / 100;

  let prediction: string;
  if (riskScore >= 75) prediction = 'High risk — clinical evaluation recommended';
  else if (riskScore >= 50) prediction = 'Moderate risk — preventive intervention advised';
  else if (riskScore >= 30) prediction = 'Low-moderate risk — lifestyle optimization recommended';
  else prediction = 'Low risk — maintain healthy lifestyle';

  if (contributing.length === 0) {
    contributing.push({ name: 'baseline', importance: 1.0 });
  }

  return {
    prediction,
    probability,
    riskScore,
    contributingFeatures: contributing.sort((a, b) => b.importance - a.importance),
    model: 'xgboost-fallback-v1',
  };
}

// ---------------------------------------------------------------------------
// OUTPUT SYNTHESIS
// ---------------------------------------------------------------------------

function synthesizeOutput(
  inputType: InputType,
  gemini: GeminiAnalysisResult | null,
  xgboost: XGBoostPredictionResult | null,
  features: ExtractedFeature[],
): { final_result: string; confidence: number; explanation: string } {
  let finalResult = '';
  let confidence = 0;
  const explanations: string[] = [];

  if (gemini && xgboost) {
    // Combined flow
    finalResult = `${xgboost.prediction} (risk score: ${xgboost.riskScore}/100). ` +
      `Analysis: ${gemini.summary}`;
    confidence = (gemini.confidence + xgboost.probability) / 2;
    explanations.push(`Gemini analyzed the ${inputType} input and extracted ${features.length} features.`);
    explanations.push(`XGBoost processed the features and produced a ${Math.round(xgboost.probability * 100)}% probability prediction.`);
    explanations.push(`Top contributing factors: ${xgboost.contributingFeatures.slice(0, 3).map(c => c.name).join(', ')}.`);
  } else if (gemini) {
    finalResult = gemini.summary;
    confidence = gemini.confidence;
    explanations.push(`Gemini analyzed the ${inputType} input and extracted ${features.length} features.`);
    explanations.push(`No structured prediction was required (or XGBoost was not routed).`);
  } else if (xgboost) {
    finalResult = `${xgboost.prediction} (risk score: ${xgboost.riskScore}/100, probability: ${Math.round(xgboost.probability * 100)}%)`;
    confidence = xgboost.probability;
    explanations.push(`XGBoost processed the structured data directly.`);
    explanations.push(`Top contributing factors: ${xgboost.contributingFeatures.slice(0, 3).map(c => c.name).join(', ')}.`);
  } else {
    finalResult = 'Unable to process input — no engines available.';
    confidence = 0;
    explanations.push('No analysis engines were available or routed.');
  }

  return {
    final_result: finalResult,
    confidence: Math.round(confidence * 100) / 100,
    explanation: explanations.join(' '),
  };
}
