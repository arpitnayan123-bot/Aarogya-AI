// GET /api/wearables/google-fit — fetch last 24h Google Fit data
import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleFitData } from '@/lib/wearables/google-fit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'accessToken query param is required' },
        { status: 400 },
      );
    }

    const data = await fetchGoogleFitData(accessToken);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Google Fit API error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch Google Fit data';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
