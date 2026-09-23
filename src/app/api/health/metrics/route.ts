// GET/POST /api/health/metrics — Health metrics CRUD
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest';

    const metrics = await db.healthMetric.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Metrics GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type, value, unit, metadata } = body;

    if (!type || value === undefined) {
      return NextResponse.json(
        { error: 'Type and value are required' },
        { status: 400 }
      );
    }

    const metric = await db.healthMetric.create({
      data: {
        userId: userId || 'guest',
        type,
        value: parseFloat(value),
        unit: unit || '',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true, data: metric });
  } catch (error) {
    console.error('Metrics POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save metric' },
      { status: 500 }
    );
  }
}
