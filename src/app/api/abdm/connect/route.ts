// POST /api/abdm/connect — Connect patient's ABHA via ABDM gateway
import { NextRequest, NextResponse } from 'next/server';
import { getABDMToken, verifyABHA } from '@/lib/abdm/abdm-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { abhaNumber } = body as { abhaNumber?: string };

    if (!abhaNumber || typeof abhaNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'ABHA number is required' },
        { status: 400 },
      );
    }

    // Basic format validation — 14 digits (optionally with hyphens)
    const normalized = abhaNumber.replace(/[-\s]/g, '');
    if (!/^\d{14}$/.test(normalized)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ABHA number format. Expected 14 digits.',
        },
        { status: 400 },
      );
    }

    const token = await getABDMToken();
    const profile = await verifyABHA(abhaNumber, token);

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('ABDM connect error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to connect ABHA';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
