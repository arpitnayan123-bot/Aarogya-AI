// POST /api/ai/skin — Skin image analysis (VLM)
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, text, context } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const cleanText = text ? sanitizeInput(text) : 'Analyze this skin image and provide structured findings.';

    const result = await orchestrate({
      type: 'skin',
      input: { text: cleanText, imageBase64 },
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Skin analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze skin image' },
      { status: 500 }
    );
  }
}
