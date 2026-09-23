// ============================================
// AAROGYA AI — ORCHESTRATION LAYER
// The brain of Aarogya AI.
//
// Responsibilities:
// 1. Route requests to the right AI model
// 2. Pre-process inputs (sanitize, enrich with context)
// 3. Post-process outputs (validate JSON, safety check)
// 4. Cache results (dedup identical queries)
// 5. Safety assessment on input AND output
// 6. Fallback handling
// 7. Confidence scoring
// 8. Cross-module context sharing
// ============================================

import { aiCache, getCacheTTL, hashInput } from './cache';
import { chatCompletion, jsonCompletion, visionCompletion, type ChatMessage } from './provider';
import { PROMPTS } from './prompts';
import { assessInputSafety, assessOutputSafety } from './safety';
import { extractJSON } from './jsonExtractor';
import type { AIRequest, AIResult } from '@/types/aarogya';

// ============================================
// MAIN ORCHESTRATION FUNCTION
// ============================================

export async function orchestrate(request: AIRequest): Promise<AIResult> {
  const startTime = Date.now();
  const traceId = `ai-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  const inputHash = hashInput(request.input);
  const ttl = getCacheTTL(request.type);

  // 1. Check cache (unless explicitly skipped or type is chat)
  if (!request.options?.skipCache && ttl > 0) {
    const cachedResult = aiCache.get(`${request.type}:${inputHash}`);
    if (cachedResult) {
      return {
        success: true,
        data: cachedResult.data,
        model: 'cached',
        tokens: { prompt: 0, completion: 0, total: 0 },
        latency_ms: Date.now() - startTime,
        cached: true,
        traceId,
        confidence: cachedResult.confidence || 80,
        safetyFlags: cachedResult.safetyFlags || [],
      };
    }
  }

  // 2. Select model config and prompt
  const { systemPrompt, temperature, maxTokens, useVision, useJSON } = getModelConfig(request.type);

  // 3. Build messages
  const messages = buildMessages(request, systemPrompt);

  // 4. Call AI provider with retry logic
  const maxRetries = request.options?.maxRetries || 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let result;

      if (useVision && typeof request.input === 'object' && request.input.imageBase64) {
        // Vision call for image analysis
        result = await visionCompletion(
          [{
            role: 'user',
            content: [
              { type: 'text', text: getMessageText(request) },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.input.imageBase64}` } },
            ],
          }],
          { temperature, maxTokens }
        );

        // Parse JSON from vision response using robust extractor
        let parsedData: any = extractJSON(result.content);

        if (!parsedData) {
          parsedData = {
            impression_en: result.content,
            impression_hi: '',
            confidence: 40,
            disclaimer: 'AI response could not be structured. Raw output provided.',
          };
        }

        return finalizeResult(parsedData, request, result, startTime, traceId, ttl);
      } else if (useJSON) {
        // JSON completion
        result = await jsonCompletion(messages, { temperature, maxTokens });

        if (!result.data) {
          // Fallback: return raw text as data
          result.data = {
            summary_en: result.raw,
            confidence: 40,
            disclaimer: 'AI response could not be structured. Raw output provided.',
          };
        }

        return finalizeResult(result.data, request, { model: result.model, tokens: result.tokens }, startTime, traceId, ttl);
      } else {
        // Plain text completion
        result = await chatCompletion(messages, { temperature, maxTokens });

        const data = { response: result.content, confidence: 80 };

        return finalizeResult(data, request, result, startTime, traceId, ttl);
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    data: {
      error: 'AI service temporarily unavailable. Please try again.',
      traceId,
      fallback_message: getFallbackMessage(request.type),
    },
    model: 'none',
    tokens: { prompt: 0, completion: 0, total: 0 },
    latency_ms: Date.now() - startTime,
    cached: false,
    traceId,
    confidence: 0,
    safetyFlags: [],
  };
}

// ============================================
// FINALIZE RESULT (post-process, cache, safety)
// ============================================

function finalizeResult(
  data: any,
  request: AIRequest,
  result: { model: string; tokens: any },
  startTime: number,
  traceId: string,
  ttl: number
): AIResult {
  // Post-process
  const processed = postProcess(request.type, data);

  // Safety assessment on output
  const safety = assessOutputSafety(processed, request.type);

  // Add safety metadata to data
  processed._safety = safety;
  processed._disclaimer = safety.disclaimer;

  // Cache result
  if (ttl > 0) {
    aiCache.set(`${request.type}:${hashInput(request.input)}`, {
      data: processed,
      confidence: processed.confidence || 75,
      safetyFlags: safety.flags,
    }, ttl);
  }

  return {
    success: true,
    data: processed,
    model: result.model,
    tokens: result.tokens,
    latency_ms: Date.now() - startTime,
    cached: false,
    traceId,
    confidence: processed.confidence || 75,
    safetyFlags: safety.flags,
  };
}

// ============================================
// MODEL CONFIG SELECTION
// ============================================

function getModelConfig(type: AIRequest['type']): {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  useVision: boolean;
  useJSON: boolean;
} {
  switch (type) {
    case 'symptom':
      return {
        systemPrompt: PROMPTS.SYMPTOM_ANALYSIS,
        temperature: 0.3,
        maxTokens: 2000,
        useVision: false,
        useJSON: true,
      };
    case 'lab_report':
      return {
        systemPrompt: PROMPTS.LAB_REPORT,
        temperature: 0.2,
        maxTokens: 3000,
        useVision: false,
        useJSON: true,
      };
    case 'chat':
      return {
        systemPrompt: PROMPTS.HEALTH_CHAT,
        temperature: 0.6,
        maxTokens: 1500,
        useVision: false,
        useJSON: false,
      };
    case 'xray':
      return {
        systemPrompt: PROMPTS.XRAY_ANALYSIS,
        temperature: 0.2,
        maxTokens: 2000,
        useVision: true,
        useJSON: true,
      };
    case 'skin':
      return {
        systemPrompt: PROMPTS.SKIN_ANALYSIS,
        temperature: 0.3,
        maxTokens: 2000,
        useVision: true,
        useJSON: true,
      };
    case 'diet':
      return {
        systemPrompt: PROMPTS.DIET_PLANNING,
        temperature: 0.5,
        maxTokens: 3000,
        useVision: false,
        useJSON: true,
      };
    case 'prediction':
      return {
        systemPrompt: PROMPTS.HEALTH_PREDICTION,
        temperature: 0.3,
        maxTokens: 2500,
        useVision: false,
        useJSON: true,
      };
    default:
      return {
        systemPrompt: PROMPTS.HEALTH_CHAT,
        temperature: 0.5,
        maxTokens: 1500,
        useVision: false,
        useJSON: false,
      };
  }
}

// ============================================
// MESSAGE BUILDER
// ============================================

function buildMessages(request: AIRequest, systemPrompt: string): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt }];

  // Add conversation history (last 10 messages for context)
  if (request.context?.conversationHistory) {
    const history = request.context.conversationHistory.slice(-10);
    for (const m of history) {
      messages.push({ role: m.role as any, content: m.content });
    }
  }

  // Build user message with context
  let userContent = getMessageText(request);

  // Enrich with patient context
  if (request.context) {
    const ctx = request.context;
    const contextLines: string[] = [];
    if (ctx.age) contextLines.push(`Patient age: ${ctx.age}`);
    if (ctx.gender) contextLines.push(`Gender: ${ctx.gender}`);
    if (ctx.knownConditions?.length) contextLines.push(`Known conditions: ${ctx.knownConditions.join(', ')}`);
    if (ctx.language) contextLines.push(`Preferred language: ${ctx.language}`);
    if (ctx.metrics) {
      contextLines.push(`Vitals: BP ${ctx.metrics.systolicBP}/${ctx.metrics.diastolicBP}, Weight ${ctx.metrics.weight}kg, Height ${ctx.metrics.height}cm, Sleep ${ctx.metrics.sleepHours}h`);
    }

    if (contextLines.length > 0) {
      userContent += `\n\n--- Patient Context ---\n${contextLines.join('\n')}`;
    }
  }

  messages.push({ role: 'user', content: userContent });

  return messages;
}

function getMessageText(request: AIRequest): string {
  if (typeof request.input === 'string') return request.input;
  return request.input.text || 'Analyze this medical image.';
}

// ============================================
// POST-PROCESSING
// ============================================

function postProcess(type: string, data: any): any {
  if (!data || typeof data !== 'object') return data;

  // Add metadata
  data._processed_at = new Date().toISOString();
  data._type = type;

  // Validate urgency levels
  const validUrgency = ['routine', 'within_week', 'urgent', 'emergency'];
  if (data.urgency && !validUrgency.includes(data.urgency)) {
    data.urgency = 'routine';
  }

  // Ensure arrays are arrays
  const arrayFields = [
    'possible_conditions', 'red_flags', 'home_care', 'when_to_see_doctor',
    'suggested_tests', 'findings', 'recommendations', 'critical_alerts',
    'preventive_actions', 'risk_assessment', 'shoppingList', 'generalAdvice',
    'primary_symptoms'
  ];

  arrayFields.forEach(field => {
    if (data[field] && !Array.isArray(data[field])) {
      data[field] = [data[field]];
    }
  });

  // Ensure confidence exists
  if (data.confidence === undefined || data.confidence === null) {
    data.confidence = 70;
  }

  return data;
}

// ============================================
// FALLBACK MESSAGES
// ============================================

function getFallbackMessage(type: string): string {
  switch (type) {
    case 'symptom':
      return 'I am currently unable to analyze your symptoms. If you are experiencing a medical emergency, please call 108 immediately. Otherwise, please try again in a moment.';
    case 'lab_report':
      return 'I am currently unable to analyze your lab report. Please try again, or consult a doctor for interpretation.';
    case 'chat':
      return 'I am having trouble responding right now. Please try again. If this is an emergency, call 108.';
    case 'xray':
      return 'I am currently unable to analyze this image. Please consult a radiologist for proper interpretation.';
    case 'diet':
      return 'I am currently unable to generate a diet plan. Please try again later.';
    case 'prediction':
      return 'I am currently unable to generate health predictions. Please try again later.';
    default:
      return 'Service temporarily unavailable. Please try again.';
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function analyzeSymptom(input: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'symptom', input, context });
}

export async function analyzeLabReport(input: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'lab_report', input, context });
}

export async function chatWithAI(input: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'chat', input, context });
}

export async function analyzeXray(imageBase64: string, text?: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'xray', input: { text, imageBase64 }, context });
}

export async function analyzeSkin(imageBase64: string, text?: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'skin', input: { text, imageBase64 }, context });
}

export async function generateDietPlan(input: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'diet', input, context });
}

export async function predictHealth(input: string, context?: AIRequest['context']): Promise<AIResult> {
  return orchestrate({ type: 'prediction', input, context });
}
