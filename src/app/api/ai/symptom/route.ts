// POST /api/ai/symptom — Symptom analysis
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput, assessInputSafety } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptoms, context } = body;

    if (!symptoms || typeof symptoms !== 'string') {
      return NextResponse.json({ error: 'Symptoms description is required' }, { status: 400 });
    }

    const cleanSymptoms = sanitizeInput(symptoms);
    const inputSafety = assessInputSafety(cleanSymptoms, context);

    const result = await orchestrate({
      type: 'symptom',
      input: cleanSymptoms,
      context,
    });

    // Merge safety flags
    if (result.success) {
      result.safetyFlags = [...new Set([...result.safetyFlags, ...inputSafety.flags])];
      if (inputSafety.riskLevel === 'emergency' && result.data.urgency !== 'emergency') {
        result.data.urgency = 'emergency';
        result.data.red_flags = [...(result.data.red_flags || []), ...inputSafety.flags];
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Symptom API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze symptoms' },
      { status: 500 }
    );
  }
}
