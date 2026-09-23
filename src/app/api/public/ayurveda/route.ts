// ============================================
// POST /api/public/ayurveda
//
// Open-source Ayurvedic intelligence API.
//   • IP-based rate limiting: 10 requests / hour / IP.
//   • POST { query, prakriti? } → Claude with an
//     Ayurvedic system prompt grounded in Charaka
//     Samhita, Sushruta Samhita, Ashtanga Hridayam.
//   • Response includes a fixed disclaimer +
//     powered_by string + rate_limit string.
//
// This is the public, unauthenticated endpoint —
// suitable for third-party developers building
// AYUSH apps on top of Aarogya AI. Authenticated
// higher-rate access will be added later.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { callMedicalAI } from '@/lib/ai-client';

// --------------------------------------------
// Rate-limiting (in-memory, per-IP)
// 10 requests / hour / IP. In-memory means limits
// reset on server restart and are not shared across
// instances — acceptable for an open beta. Move to
// Redis before scaling.
// --------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 requests per hour per IP
const rateLimitMap = new Map<string, number[]>();

function rateLimited(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const arr = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  arr.push(now);
  rateLimitMap.set(ip, arr);
  return {
    limited: arr.length > RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - arr.length),
  };
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

// --------------------------------------------
// System prompt
// --------------------------------------------
const AYURVEDA_SYSTEM_PROMPT = `You are Aarogya Ayurved — an Ayurvedic intelligence assistant trained on the classical texts:
  • Charaka Samhita (internal medicine / Kayachikitsa)
  • Sushruta Samhita (surgery / Shalya Tantra)
  • Ashtanga Hridayam (Vagbhata's synthesis)
  • CCRAS clinical guidelines and AYUSH Ministry protocols where applicable.

Your role:
- Answer the user's Ayurvedic question with classical-grounded, citable information.
- When a question is about a herb, formula (yoga), or regimen: cite the Samhita, chapter (sthana), and the classical reference where possible (e.g. "Charaka Samhita, Chikitsa Sthana 6").
- Personalize the answer by the user's Prakriti if provided (Vata / Pitta / Kapha / dual constitutions). State how the recommendation should be modified by Prakriti.
- ALWAYS flag known herb-drug interactions (e.g. Ashwagandha + thyroid/immunosuppressants, Guduchi + antidiabetics, Turmeric + anticoagulants, Guggulu + statins, Brahmi + sedatives) and contraindications in pregnancy.
- Use plain language. Use 2–4 short paragraphs or a short numbered list. Reply in the user's language (Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu). Use Roman script for non-Devanagari if the user wrote in Roman.

HARD RULES:
- You are an EDUCATIONAL assistant, NOT a prescriber. You MUST NOT recommend specific doses for serious illnesses, replace allopathic treatment, or claim to cure named diseases.
- Always end with: "This is educational Ayurvedic information, not medical advice. Consult a BAMS doctor for personal treatment."
- If the question is outside Ayurveda's scope (e.g. an emergency, acute trauma, suicidal ideation, acute severe breathlessness), respond briefly and route to modern emergency care (call 112 in India) before any Ayurvedic commentary.

Length: under 300 words unless the user explicitly asks for detail.`;

const DISCLAIMER =
  'This is educational Ayurvedic information, not medical advice. Consult a BAMS doctor for personal treatment.';
const POWERED_BY = 'Aarogya AI Open Ayurveda API v1.0';
const RATE_LIMIT_LABEL = '10 requests/hour';

// --------------------------------------------
// POST handler
// --------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { limited, remaining } = rateLimited(ip);
    if (limited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. You may make up to 10 requests per hour.',
          rate_limit: RATE_LIMIT_LABEL,
          retry_after_seconds: 60 * 60,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(60 * 60),
          },
        },
      );
    }

    const body = (await req.json()) as {
      query?: string;
      prakriti?: string;
    };

    if (
      !body ||
      typeof body.query !== 'string' ||
      body.query.trim().length < 3
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'A "query" field (string, ≥ 3 characters) is required.',
          rate_limit: RATE_LIMIT_LABEL,
        },
        { status: 400 },
      );
    }

    const validPrakriti = ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha'];
    const prakriti =
      typeof body.prakriti === 'string' &&
      validPrakriti.includes(body.prakriti.trim().toLowerCase())
        ? body.prakriti.trim().toLowerCase()
        : undefined;

    const userMessage = prakriti
      ? `Prakriti: ${prakriti}\n\nQuestion: ${body.query.trim().slice(0, 1500)}`
      : `Question: ${body.query.trim().slice(0, 1500)}`;

    const response = await callMedicalAI(
      AYURVEDA_SYSTEM_PROMPT,
      userMessage,
      1024,
    );

    return NextResponse.json(
      {
        success: true,
        response,
        disclaimer: DISCLAIMER,
        powered_by: POWERED_BY,
        rate_limit: RATE_LIMIT_LABEL,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(remaining - 1),
        },
      },
    );
  } catch (error) {
    console.error('Public Ayurveda API error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate response.';
    return NextResponse.json(
      {
        success: false,
        error: message,
        disclaimer: DISCLAIMER,
        powered_by: POWERED_BY,
        rate_limit: RATE_LIMIT_LABEL,
      },
      { status: 500 },
    );
  }
}

// --------------------------------------------
// GET — friendly metadata endpoint for developers
// who hit the URL in a browser.
// --------------------------------------------
export async function GET() {
  return NextResponse.json({
    name: 'Aarogya AI Open Ayurveda API',
    version: '1.0',
    description:
      'Open-source Ayurvedic intelligence API grounded in Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam.',
    endpoint: '/api/public/ayurveda',
    method: 'POST',
    request: {
      query: 'string (required, ≥ 3 chars)',
      prakriti:
        'string (optional) — one of vata, pitta, kapha, vata-pitta, pitta-kapha, vata-kapha, tridosha',
    },
    response: {
      success: 'boolean',
      response: 'string — Ayurvedic answer',
      disclaimer: 'string',
      powered_by: 'string',
      rate_limit: 'string',
    },
    rate_limit: RATE_LIMIT_LABEL,
    license: 'Apache-2.0',
    repository: 'https://github.com/aarogyaai/ayurveda-api',
  });
}
