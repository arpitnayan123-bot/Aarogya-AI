// ============================================
// AAROGYA AI — AI ORCHESTRATION ENGINE
// Intelligent router that coordinates multimodal analysis.
//
// Role: GLM acts as orchestrator — decides which engine to use,
// defines processing steps, structures inputs/outputs.
//
// Engines:
// 1. GEMINI — Primary multimodal (text, image, PDF, unstructured)
// 2. XGBOOST — Local ML (structured data, prediction, scoring)
// 3. GLM — Orchestrator (decision making, pipeline control)
//
// Pipeline:
// STEP 1: Input detection (text/image/pdf/structured/multimodal)
// STEP 2: Routing (unstructured→Gemini, structured→XGBoost, both→Gemini→XGBoost)
// STEP 3: Processing (extract features, run predictions)
// STEP 4: Structured output with confidence + explanation
// ============================================

export type InputType = 'text' | 'image' | 'pdf' | 'structured' | 'multimodal';
export type EngineType = 'gemini' | 'xgboost' | 'glm' | 'gemini_then_xgboost';

export interface PipelineStep {
  step: number;
  engine: EngineType;
  action: string;
  input: string;
  output: string;
  duration: string;
  status: 'completed' | 'skipped' | 'fallback';
}

export interface OrchestrationResult {
  inputType: InputType;
  routingDecision: {
    selectedEngine: EngineType;
    reason: string;
    alternatives: string[];
  };
  pipeline: PipelineStep[];
  finalResult: string;
  confidenceScore: number;
  explanation: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

// ============================================
// INPUT DETECTION
// ============================================

export function detectInputType(input: unknown): InputType {
  if (typeof input === 'string') {
    // Check if it looks like structured data (JSON-like)
    if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
      try {
        JSON.parse(input);
        return 'structured';
      } catch {
        // Not valid JSON, treat as text
      }
    }
    // Check for image references
    if (input.match(/\.(jpg|jpeg|png|gif|webp)/i) || input.includes('image_base64')) {
      return 'image';
    }
    // Check for PDF references
    if (input.includes('.pdf') || input.includes('pdf_base64')) {
      return 'pdf';
    }
    return 'text';
  }

  if (typeof input === 'object' && input !== null) {
    const keys = Object.keys(input);
    if (keys.some(k => k.includes('image') || k.includes('photo'))) {
      return 'multimodal';
    }
    return 'structured';
  }

  return 'text';
}

// ============================================
// ROUTING LOGIC
// ============================================

export function routeToEngine(inputType: InputType, needsPrediction: boolean): {
  selectedEngine: EngineType;
  reason: string;
  alternatives: string[];
} {
  const isUnstructured = inputType === 'text' || inputType === 'image' || inputType === 'pdf' || inputType === 'multimodal';
  const isStructured = inputType === 'structured';

  if (isUnstructured && needsPrediction) {
    return {
      selectedEngine: 'gemini_then_xgboost',
      reason: 'Input is unstructured and prediction is required. Gemini will extract features first, then XGBoost will generate prediction.',
      alternatives: ['Gemini-only (if prediction not needed)', 'GLM reasoning fallback (if both engines fail)'],
    };
  }

  if (isUnstructured && !needsPrediction) {
    return {
      selectedEngine: 'gemini',
      reason: 'Input is unstructured. Gemini will handle text/image/PDF understanding and feature extraction.',
      alternatives: ['GLM reasoning (if Gemini fails)'],
    };
  }

  if (isStructured && needsPrediction) {
    return {
      selectedEngine: 'xgboost',
      reason: 'Input is structured tabular data and prediction is required. XGBoost will classify and score directly.',
      alternatives: ['Gemini (if contextual reasoning also needed)'],
    };
  }

  // Structured without prediction
  return {
    selectedEngine: 'glm',
    reason: 'Input is structured but no prediction required. GLM orchestrator will process directly.',
    alternatives: ['XGBoost (if scoring needed)', 'Gemini (if context extraction needed)'],
  };
}

// ============================================
// SIMULATE PIPELINE EXECUTION
// (In production, this would call actual APIs)
// ============================================

export function executePipeline(
  input: string,
  inputType: InputType,
  engine: EngineType,
  context?: string
): OrchestrationResult {
  const pipeline: PipelineStep[] = [];
  let finalResult = '';
  let confidence = 0;
  let fallbackUsed = false;
  let fallbackReason: string | undefined;
  let stepNum = 1;

  // GEMINI processing
  if (engine === 'gemini' || engine === 'gemini_then_xgboost') {
    pipeline.push({
      step: stepNum++,
      engine: 'gemini',
      action: inputType === 'image' ? 'Image analysis and feature extraction' : inputType === 'pdf' ? 'Document parsing and data extraction' : 'Text understanding and entity extraction',
      input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      output: 'Extracted: biomarkers, values, units, abnormal flags, contextual notes',
      duration: '2.3s',
      status: 'completed',
    });

    if (engine === 'gemini') {
      finalResult = 'Gemini analysis complete. Key entities and features extracted from unstructured input. Structured representation generated for downstream use.';
      confidence = 0.85;
    }
  }

  // Feature extraction step (between Gemini and XGBoost)
  if (engine === 'gemini_then_xgboost') {
    pipeline.push({
      step: stepNum++,
      engine: 'glm',
      action: 'Feature extraction and structuring',
      input: 'Gemini raw output',
      output: 'Structured feature vector: {age: 45, bmi: 27.5, glucose: 108, hba1c: 5.9, bp: 138/88, ...}',
      duration: '0.1s',
      status: 'completed',
    });
  }

  // XGBOOST processing
  if (engine === 'xgboost' || engine === 'gemini_then_xgboost') {
    pipeline.push({
      step: stepNum++,
      engine: 'xgboost',
      action: 'Risk classification and probability scoring',
      input: 'Structured feature vector',
      output: 'Prediction: High risk (78% probability). Top features: glucose, BMI, sleep_hours.',
      duration: '0.05s',
      status: 'completed',
    });

    finalResult = 'Combined analysis complete. Gemini extracted features from input, XGBoost generated prediction. Result: High health risk detected with 78% probability. Primary drivers: elevated glucose, high BMI, sleep deprivation.';
    confidence = 0.82;
  }

  // GLM-only processing
  if (engine === 'glm') {
    pipeline.push({
      step: stepNum++,
      engine: 'glm',
      action: 'Direct reasoning and structuring',
      input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      output: 'Processed and structured data ready for display',
      duration: '0.2s',
      status: 'completed',
    });

    finalResult = 'GLM orchestrator processed structured input directly. No multimodal analysis needed.';
    confidence = 0.90;
  }

  // Explanation
  const explanation = generateExplanation(inputType, engine, confidence, fallbackUsed);

  return {
    inputType,
    routingDecision: routeToEngine(inputType, engine === 'xgboost' || engine === 'gemini_then_xgboost'),
    pipeline,
    finalResult,
    confidenceScore: confidence,
    explanation,
    fallbackUsed,
    fallbackReason,
  };
}

function generateExplanation(inputType: InputType, engine: EngineType, confidence: number, fallback: boolean): string {
  const inputDesc = {
    text: 'unstructured text',
    image: 'medical image',
    pdf: 'PDF document',
    structured: 'structured tabular data',
    multimodal: 'multimodal input (text + image)',
  }[inputType];

  const engineDesc = {
    gemini: 'Gemini multimodal engine for feature extraction and understanding',
    xgboost: 'XGBoost ML engine for classification and risk scoring',
    glm: 'GLM orchestrator for direct reasoning',
    gemini_then_xgboost: 'Gemini (feature extraction) → XGBoost (prediction) pipeline',
  }[engine];

  return `Input detected as ${inputDesc}. Routed to ${engineDesc}. ${fallback ? 'Fallback was used due to engine limitation. ' : ''}Confidence: ${Math.round(confidence * 100)}%. The orchestration engine selected this pipeline based on input type and task requirements.`;
}

// ============================================
// ORCHESTRATION DEMO SCENARIOS
// ============================================

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  input: string;
  inputType: InputType;
  needsPrediction: boolean;
  result: OrchestrationResult;
}

export function getDemoScenarios(): DemoScenario[] {
  const scenarios: { id: string; name: string; description: string; input: string; inputType: InputType; needsPrediction: boolean }[] = [
    {
      id: 'lab-report-image',
      name: 'Lab Report Photo',
      description: 'User uploads a photo of their lab report. Gemini reads the image, extracts values, XGBoost predicts risk.',
      input: 'data:image/jpeg;base64,/9j/4AAQ... [lab report photo]',
      inputType: 'image',
      needsPrediction: true,
    },
    {
      id: 'symptom-text',
      name: 'Symptom Description',
      description: 'User types symptoms in natural language. Gemini understands and extracts clinical entities.',
      input: 'I have headache, fever for 3 days, and body pain. Feel weak in mornings.',
      inputType: 'text',
      needsPrediction: true,
    },
    {
      id: 'xray-pdf',
      name: 'X-Ray Report PDF',
      description: 'Doctor uploads radiology report as PDF. Gemini parses and extracts findings.',
      input: 'radiology_report_2024.pdf [PDF document]',
      inputType: 'pdf',
      needsPrediction: false,
    },
    {
      id: 'vitals-structured',
      name: 'Wearable Vitals Data',
      description: 'Structured vitals from wearable device. XGBoost predicts cardiac risk directly.',
      input: JSON.stringify({ heart_rate: 82, bp_systolic: 138, bp_diastolic: 88, hrv: 32, sleep_hours: 5.8, steps: 5400, age: 45, bmi: 27.5 }),
      inputType: 'structured',
      needsPrediction: true,
    },
    {
      id: 'multimodal-scan',
      name: 'Skin Photo + Question',
      description: 'User uploads skin photo with a text question. Multimodal: Gemini analyzes both.',
      input: JSON.stringify({ image: 'skin_photo.jpg', question: 'Is this rash concerning?' }),
      inputType: 'multimodal',
      needsPrediction: true,
    },
  ];

  return scenarios.map(s => ({
    ...s,
    result: executePipeline(s.input, s.inputType, routeToEngine(s.inputType, s.needsPrediction).selectedEngine),
  }));
}
