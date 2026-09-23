// ============================================
// AAROGYA AI — AI PROVIDER (z-ai-web-dev-sdk)
// Model-agnostic wrapper for LLM + VLM calls
// ============================================

import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: any = null;

export async function getAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface VisionMessage {
  role: 'user' | 'assistant';
  content: Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  >;
}

export interface CompletionResult {
  content: string;
  model: string;
  tokens: { prompt: number; completion: number; total: number };
}

// ============================================
// TEXT COMPLETION
// ============================================

export async function chatCompletion(
  messages: ChatMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<CompletionResult> {
  const zai = await getAI();

  const completion = await zai.chat.completions.create({
    messages,
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens ?? 2000,
    thinking: { type: 'disabled' },
  });

  const content = completion.choices[0]?.message?.content || '';
  const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  return {
    content,
    model: completion.model || 'glm-4',
    tokens: {
      prompt: usage.prompt_tokens || 0,
      completion: usage.completion_tokens || 0,
      total: usage.total_tokens || 0,
    },
  };
}

// ============================================
// VISION COMPLETION (for X-ray, skin, medical images)
// ============================================

export async function visionCompletion(
  messages: VisionMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<CompletionResult> {
  const zai = await getAI();

  const completion = await zai.chat.completions.createVision({
    messages: messages as any,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 2000,
    thinking: { type: 'disabled' },
  });

  const content = completion.choices[0]?.message?.content || '';
  const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  return {
    content,
    model: completion.model || 'glm-4v',
    tokens: {
      prompt: usage.prompt_tokens || 0,
      completion: usage.completion_tokens || 0,
      total: usage.total_tokens || 0,
    },
  };
}

// ============================================
// JSON COMPLETION (with robust extraction)
// ============================================

import { extractJSON } from './jsonExtractor';

export async function jsonCompletion(
  messages: ChatMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<{ data: any; raw: string; model: string; tokens: any }> {
  const result = await chatCompletion(messages, options);

  const data = extractJSON(result.content);

  return {
    data,
    raw: result.content,
    model: result.model,
    tokens: result.tokens,
  };
}
