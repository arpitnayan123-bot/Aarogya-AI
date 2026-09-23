// ============================================
// AAROGYA AI — CLAUDE (ANTHROPIC) AI CLIENT
//
// Replaces GLM-4 with Claude Sonnet for DPDP Act 2023 compliance.
// GLM-4 is built by Zhipu AI (China) — routing Indian health data
// through a Chinese provider violates India's data protection law.
//
// Two functions:
//   • callMedicalAI — text reasoning (chat, symptoms, diet, mental health)
//   • callMedicalVisionAI — image analysis (X-ray, skin, lab reports)
//
// Both use claude-sonnet-4-6. Server-side only — API key in process.env.
// ============================================

import Anthropic from '@anthropic-ai/sdk';

// Lazy-init the client so missing key doesn't crash on import
let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes('placeholder')) {
      throw new Error('ANTHROPIC_API_KEY not configured. Set it in .env');
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

/**
 * Check if Claude is available (key configured and not placeholder).
 */
export function isClaudeAvailable(): boolean {
  const key = process.env.ANTHROPIC_API_KEY;
  return !!key && !key.includes('placeholder') && key.startsWith('sk-ant');
}

/**
 * Call Claude for text-only medical reasoning tasks.
 * Returns a plain string response.
 */
export async function callMedicalAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 1024,
): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
  return block.text;
}

/**
 * Call Claude for vision/image medical analysis tasks.
 * Returns a plain string response.
 */
export async function callMedicalVisionAI(
  systemPrompt: string,
  userMessage: string,
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
        { type: 'text', text: userMessage },
      ],
    }],
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
  return block.text;
}
