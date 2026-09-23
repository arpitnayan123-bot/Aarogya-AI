// POST /api/rag — RAG retrieval endpoint
//
// Retrieves relevant medical evidence passages from curated Kaggle / Hugging Face /
// AI4Bharat datasets. Returns augmented context for LLM generation.
//
// GET /api/rag — returns dataset registry + stats (no API keys, fully public)

import { NextRequest, NextResponse } from 'next/server';
import { retrieve, buildAugmentedPrompt, getRAGStats, getDatasetsForDisplay } from '@/lib/ai/ragEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, topK, mode } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query string is required' },
        { status: 400 },
      );
    }

    const k = typeof topK === 'number' && topK > 0 && topK <= 10 ? topK : 3;

    if (mode === 'augmented_prompt') {
      // Return full augmented prompt for LLM generation
      const augmented = buildAugmentedPrompt(query, k);
      return NextResponse.json({
        success: true,
        data: augmented,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: return retrieval results
    const result = retrieve(query, k);
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[rag] Error:', err);
    return NextResponse.json(
      { error: 'RAG retrieval failed', detail: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      datasets: getDatasetsForDisplay(),
      stats: getRAGStats(),
      pipeline: ['query_embedding', 'vector_similarity_search', 'top_k_retrieval', 'context_augmentation'],
      sources: ['kaggle', 'huggingface', 'ai4bharat'],
    },
  });
}
