// POST /api/orchestrate — Advanced AI Orchestration Engine
//
// GLM acts as orchestrator: detects input type → routes to Gemini (unstructured)
// or XGBoost (structured) → executes pipeline → returns structured output.
//
// SAFETY: The Gemini API key is read from process.env.GEMINI_API_KEY server-side
// and is NEVER exposed to the client. If Gemini fails, the system falls back to
// a local analyzer and still returns a partial result.

import { NextRequest, NextResponse } from 'next/server';
import { executePipeline, type OrchestrationInput } from '@/lib/ai/orchestrationEngine';
import { analyzeWithGemini, isGeminiAvailable } from '@/lib/ai/geminiAdapter';
import { predictWithXGBoost } from '@/lib/ai/xgboostAdapter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const input: OrchestrationInput = {
      text: body.text,
      imageBase64: body.imageBase64,
      imageMimeType: body.imageMimeType,
      pdfBase64: body.pdfBase64,
      structuredData: body.structuredData,
      hint: body.hint,
    };

    // Ensure at least one input modality is present
    const hasInput = input.text || input.imageBase64 || input.pdfBase64 || input.structuredData;
    if (!hasInput) {
      return NextResponse.json(
        { error: 'At least one input modality (text, image, pdf, structuredData) is required' },
        { status: 400 },
      );
    }

    // Validate image size if present (prevent oversized payloads)
    if (input.imageBase64 && input.imageBase64.length > 5_000_000) {
      return NextResponse.json(
        { error: 'Image too large (max 5MB base64)' },
        { status: 413 },
      );
    }

    const geminiAvailable = isGeminiAvailable();

    // Execute the orchestration pipeline
    // Pass the real adapters — the engine will use them and fall back if they fail
    const result = await executePipeline(input, {
      geminiAdapter: geminiAvailable ? analyzeWithGemini : undefined,
      xgboostAdapter: predictWithXGBoost,
    });

    // Return structured output (never includes the API key)
    return NextResponse.json({
      success: true,
      data: result,
      gemini_available: geminiAvailable, // informational only — does NOT expose the key
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[orchestrate] Error:', err);
    return NextResponse.json(
      {
        error: 'Orchestration failed',
        detail: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// GET endpoint — returns engine status (no keys exposed)
export async function GET() {
  return NextResponse.json({
    engines: {
      gemini: {
        available: isGeminiAvailable(),
        model: 'gemini-1.5-flash',
        capabilities: ['text', 'image', 'pdf', 'multimodal'],
        // NOTE: API key is NOT included — stays server-side
      },
      xgboost: {
        available: true,
        model: 'xgboost-ensemble-v1 (3 trees)',
        capabilities: ['structured_data', 'classification', 'risk_scoring'],
      },
      glm: {
        available: true,
        role: 'orchestrator',
        capabilities: ['routing', 'pipeline_control', 'output_synthesis'],
      },
    },
    pipeline_types: ['gemini_only', 'xgboost_only', 'gemini_then_xgboost'],
  });
}
