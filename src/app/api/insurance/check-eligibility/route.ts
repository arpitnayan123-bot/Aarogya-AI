// ============================================
// POST /api/insurance/check-eligibility
//
// Validates the user's ABHA / Health ID format and returns
// a plain-language message directing them to the official
// PMJAY beneficiary portal / helpline. Aarogya AI is NOT
// an ABDM credential proxy — we never call the ABDM
// backend on the user's behalf (that requires Aadhaar
// e-KYC + a registered mobile, which is out of scope for
// an educational navigator).
//
// Request body (JSON):
//   { abha: string }  // 14-digit ABHA (hyphens tolerated)
//
// Response (200):
//   { success: true, message: string, officialPortal: string, helpline: string }
// Response (400):
//   { success: false, error: string }
// ============================================

import { NextRequest, NextResponse } from 'next/server';

const OFFICIAL_PORTAL = 'https://beneficiary.nha.gov.in/';
const PMJAY_HELPLINE = '14555';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { abha?: string };

    if (
      !body ||
      typeof body.abha !== 'string' ||
      body.abha.replace(/[^0-9]/g, '').length !== 14
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'A valid 14-digit ABHA / Health ID is required.',
        },
        { status: 400 },
      );
    }

    const masked = body.abha.replace(/[^0-9]/g, '');
    const maskedDisplay = `${masked.slice(0, 2)}-XXXX-XXXX-${masked.slice(10)}`;

    const message = `We received your ABHA / Health ID (${maskedDisplay}).

PMJAY eligibility is determined by the National Health Authority based on SECC-2011 deprivation and occupational criteria — Aarogya AI cannot verify it directly. To check whether your family is enrolled:

1. Visit the official PMJAY beneficiary portal: ${OFFICIAL_PORTAL}
2. Enter your Aadhaar-linked mobile number or ration-card details.
3. If you are eligible, download your Ayushman Card from the same portal.
4. If you are NOT on the list, you may still be eligible under State-specific schemes — call the PMJAY helpline ${PMJAY_HELPLINE} (toll-free, 24×7, available in Hindi, English and 9 regional languages).

For Aadhaar-ABHA linking or to create a new ABHA, use https://abha.abdm.gov.in/.`;

    return NextResponse.json({
      success: true,
      message,
      officialPortal: OFFICIAL_PORTAL,
      helpline: PMJAY_HELPLINE,
      // Always remind: we did NOT call the ABDM backend.
      verifiedByAarogya: false,
    });
  } catch (error) {
    console.error('Insurance check-eligibility error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check eligibility.' },
      { status: 500 },
    );
  }
}
