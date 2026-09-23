// ============================================
// AAROGYA AI — GEMINI ENGINE ADAPTER
//
// Server-side ONLY. The API key is read from process.env.GEMINI_API_KEY
// and is NEVER sent to the client.
//
// Calls Google's Gemini API for:
//   • Text understanding
//   • Image analysis
//   • PDF/document parsing
//   • Feature extraction
//
// If Gemini fails or the key is missing, the caller falls back to
// the fallback analyzer in orchestrationEngine.ts.
// ============================================

import type { OrchestrationInput, GeminiAnalysisResult, ExtractedFeature } from '@/lib/ai/orchestrationEngine';

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function getApiKey(): string | null {
  // Server-side only — process.env is not available on client
  if (typeof process !== 'undefined' && process.env) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key.trim().length > 0) return key.trim();
  }
  return null;
}

export function isGeminiAvailable(): boolean {
  return getApiKey() !== null;
}

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

interface GeminiRequestBody {
  contents: { parts: GeminiPart[]; role: string }[];
  generationConfig?: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

/**
 * Analyze input with Gemini. Supports text, image, PDF, and multimodal combinations.
 * Returns structured features + entities + summary.
 */
export async function analyzeWithGemini(input: OrchestrationInput): Promise<GeminiAnalysisResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const parts: GeminiPart[] = [];

  // Build the prompt for medical feature extraction
  const systemPrompt = `You are a medical AI assistant analyzing health data. Extract:
1. Key medical entities (lab values, vitals, symptoms, conditions)
2. Numeric values with their units
3. Risk indicators
4. Abnormal findings

Return a JSON object with:
{
  "summary": "brief analysis summary",
  "entities": [{"name": "", "type": "lab_value|vital|symptom|condition|medication", "value": ""}],
  "features": [{"name": "", "value": "", "confidence": 0.0-1.0}],
  "abnormal_findings": ["list of abnormal findings"]
}

Be precise and clinically accurate. If analyzing an image, describe medical findings visible.`;

  parts.push({ text: systemPrompt });

  if (input.text) {
    parts.push({ text: `Text input: ${input.text}` });
  }

  if (input.imageBase64 && input.imageMimeType) {
    parts.push({
      inline_data: {
        mime_type: input.imageMimeType,
        data: input.imageBase64,
      },
    });
  }

  if (input.pdfBase64) {
    parts.push({
      inline_data: {
        mime_type: 'application/pdf',
        data: input.pdfBase64,
      },
    });
  }

  if (input.structuredData) {
    parts.push({ text: `Structured data: ${JSON.stringify(input.structuredData, null, 2)}` });
  }

  const body: GeminiRequestBody = {
    contents: [{ parts, role: 'user' }],
    generationConfig: {
      temperature: 0.3,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      throw new Error(`Gemini API error ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const candidate = data.candidates?.[0];
    const responseText = candidate?.content?.parts?.[0]?.text || '';

    if (!responseText) {
      throw new Error('Gemini returned empty response');
    }

    // Parse the JSON from Gemini's response
    const parsed = parseGeminiResponse(responseText);

    const features: ExtractedFeature[] = (parsed.features || []).map((f: { name: string; value: string | number; confidence?: number }) => ({
      name: f.name,
      value: f.value,
      confidence: f.confidence ?? 0.8,
      source: 'gemini' as const,
    }));

    return {
      summary: parsed.summary || 'Analysis completed',
      entities: parsed.entities || [],
      features,
      rawOutput: responseText,
      model: GEMINI_MODEL,
      confidence: 0.85,
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Gemini API timeout (30s)');
    }
    throw err;
  }
}

/**
 * Parse Gemini's text response to extract the JSON object.
 * Gemini sometimes wraps JSON in markdown code blocks.
 */
function parseGeminiResponse(text: string): {
  summary: string;
  entities: { name: string; type: string; value?: string }[];
  features: { name: string; value: string | number; confidence?: number }[];
  abnormal_findings?: string[];
} {
  // Try to extract JSON from markdown code block first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1] : text;

  // Try to find the first { ... } block
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  const finalJsonStr = jsonMatch ? jsonMatch[0] : jsonStr;

  try {
    return JSON.parse(finalJsonStr);
  } catch {
    // If JSON parsing fails, return a basic structure from the raw text
    return {
      summary: text.slice(0, 300),
      entities: [],
      features: [],
    };
  }
}
