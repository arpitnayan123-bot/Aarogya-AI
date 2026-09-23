// POST /api/ai/xray — X-ray / radiology image analysis (VLM)
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

    // Validate base64 image
    const base64Regex = /^[A-Za-z0-9+/=\s]+$/;
    if (!base64Regex.test(imageBase64.substring(0, 100))) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const cleanText = text ? sanitizeInput(text) : 'Analyze this medical image and provide structured findings.';

    const result = await orchestrate({
      type: 'xray',
      input: { text: cleanText, imageBase64 },
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('X-ray API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
