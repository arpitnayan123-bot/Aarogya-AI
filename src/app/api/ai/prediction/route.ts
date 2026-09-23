// POST /api/ai/prediction — Health prediction
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { healthData, context } = body;

    if (!healthData || typeof healthData !== 'string') {
      return NextResponse.json({ error: 'Health data is required' }, { status: 400 });
    }

    const cleanData = sanitizeInput(healthData);

    const result = await orchestrate({
      type: 'prediction',
      input: cleanData,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate health prediction' },
      { status: 500 }
    );
  }
}
