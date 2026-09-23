// POST /api/ai/diet — Diet plan generation
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { preferences, context } = body;

    if (!preferences || typeof preferences !== 'string') {
      return NextResponse.json({ error: 'Diet preferences are required' }, { status: 400 });
    }

    const cleanPrefs = sanitizeInput(preferences);

    const result = await orchestrate({
      type: 'diet',
      input: cleanPrefs,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Diet API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate diet plan' },
      { status: 500 }
    );
  }
}
