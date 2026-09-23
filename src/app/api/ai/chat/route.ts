// POST /api/ai/chat — Aarogya AI Companion chat
import { NextRequest, NextResponse } from 'next/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { sanitizeInput, assessInputSafety, getEscalationMessage } from '@/lib/ai/safety';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const cleanMessage = sanitizeInput(message);

    // Safety assessment on input
    const inputSafety = assessInputSafety(cleanMessage, context);

    // If emergency, return immediate escalation
    if (inputSafety.riskLevel === 'emergency') {
      return NextResponse.json({
        success: true,
        data: {
          response: getEscalationMessage(inputSafety.riskLevel),
          confidence: 100,
          _safety: inputSafety,
          _disclaimer: inputSafety.disclaimer,
          emergency: true,
        },
        model: 'safety-layer',
        tokens: { prompt: 0, completion: 0, total: 0 },
        latency_ms: 0,
        cached: false,
        traceId: `safety-${Date.now()}`,
        confidence: 100,
        safetyFlags: inputSafety.flags,
      });
    }

    const result = await orchestrate({
      type: 'chat',
      input: cleanMessage,
      context,
      options: { skipCache: true }, // Never cache chat
    });

    // If safety flagged the input, append disclaimer
    if (inputSafety.flags.length > 0 && result.success) {
      result.data.response += `\n\n${inputSafety.disclaimer}`;
      result.safetyFlags = [...result.safetyFlags, ...inputSafety.flags];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
