// POST /api/medications/check-interactions — Check drug-drug interactions
import { NextRequest, NextResponse } from 'next/server';
import { checkAllInteractions } from '@/lib/medications/drug-database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medications } = body as { medications?: unknown };

    if (!Array.isArray(medications)) {
      return NextResponse.json(
        {
          success: false,
          error: 'medications must be an array of drug name strings',
        },
        { status: 400 },
      );
    }

    const cleaned = medications.filter(
      (m): m is string => typeof m === 'string' && m.trim().length > 0,
    );

    if (cleaned.length < 2) {
      return NextResponse.json({
        success: true,
        interactions: [],
        message:
          'At least two medications are required to detect interactions.',
      });
    }

    const interactions = await checkAllInteractions(cleaned);
    return NextResponse.json({
      success: true,
      interactions,
      count: interactions.length,
    });
  } catch (error) {
    console.error('Drug interaction check error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to check drug interactions';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
