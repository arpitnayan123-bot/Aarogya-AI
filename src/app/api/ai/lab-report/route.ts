// POST /api/ai/lab-report — Lab report analysis
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportText, context } = body;

    if (!reportText || typeof reportText !== 'string') {
      return NextResponse.json({ error: 'Lab report text is required' }, { status: 400 });
    }

    const cleanText = sanitizeInput(reportText);

    const result = await orchestrate({
      type: 'lab_report',
      input: cleanText,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Lab report API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze lab report' },
      { status: 500 }
    );
  }
}
