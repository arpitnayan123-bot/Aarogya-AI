// POST /api/cgm/readings — Fetch 24h CGM data from LibreView
//
// Request body:
//   { email: string, password: string }
//
// Response:
//   { success: true, summary: CGMSummary }
//   { success: false, error: string }
//
// SECURITY:
//   • Credentials are accepted only in the request body (never query).
//   • They are passed in-memory to fetchLibreData() and discarded.
//   • They are NEVER logged, NEVER cached, NEVER written to DB.
//   • The response contains only the derived CGMSummary, never the
//     raw token or the user's email.
//
// Rate limiting (lightweight, in-memory) is applied per-IP to slow
// credential brute-force attempts — 5 requests / minute / IP.
import { NextRequest, NextResponse } from 'next/server';
import { fetchLibreData, type CGMSummary } from '@/lib/cgm/libre-api';

// In-memory sliding-window rate limiter (per IP).
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP
const rateLimitMap = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  arr.push(now);
  rateLimitMap.set(ip, arr);
  return arr.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  try {
    // --- Rate-limit check ---
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : req.headers.get('x-real-ip') ?? 'unknown';
    if (rateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a moment and try again.',
        },
        { status: 429 },
      );
    }

    // --- Parse body ---
    const body = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Request body must be a JSON object.' },
        { status: 400 },
      );
    }
    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.trim().length === 0 ||
      body.password.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    // --- Fetch + return ---
    const summary: CGMSummary = await fetchLibreData(
      body.email.trim(),
      body.password,
    );

    if (summary.error) {
      // Distinguish "no data / login failed" (4xx) from real server
      // errors (5xx). Since we surface a friendly message in summary.error,
      // we return 200 + success:false so the client can display it.
      return NextResponse.json({
        success: false,
        error: summary.error,
        summary,
      });
    }

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('CGM readings error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to fetch CGM data';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
