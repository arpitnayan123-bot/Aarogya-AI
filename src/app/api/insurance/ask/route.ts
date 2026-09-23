// ============================================
// POST /api/insurance/ask
//
// AI Insurance Assistant. Accepts { question } and
// forwards it to Claude with a system prompt that
// scopes the assistant to Indian health insurance:
// PMJAY, ESIC, CGHS, private insurers, IRDAI rules.
//
// Request body (JSON):
//   { question: string }
//
// Response (200):
//   { success: true, response: string }
// Response (400 / 500):
//   { success: false, error: string }
//
// The model is told to (a) respond in the user's
// language, (b) be educational, (c) end every reply
// with a specific claim-escalation reminder.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { callMedicalAI } from '@/lib/ai-client';

const INSURANCE_SYSTEM_PROMPT = `You are Aarogya AI's Indian Health Insurance Assistant.

Scope of knowledge — Indian health insurance only:
- PMJAY / Ayushman Bharat (₹5 lakh per family per year, SECC-2011 based, cashless at empanelled hospitals).
- ESIC (Employees' State Insurance — for workers earning ≤ ₹21,000/month, with employer + employee contribution).
- CGHS (Central Government Health Scheme — for central-government employees, pensioners, and dependants).
- Private health insurance (Star Health, HDFC ERGO, Niva Bupa, Care Health, New India Assurance, ICICI Lombard, Bajaj Allianz, etc.) — individual, family floater, group, critical-illness, top-up plans.
- IRDAI consumer-protection rules (portability, grievance redressal, claim turnaround times, IGMS at igms.irda.gov.in or call 155255).

Behaviour:
- Detect the language of the user's question (Hindi, English, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu) and REPLY IN THE SAME LANGUAGE. Use Roman script for non-Devanagari languages if the user wrote in Roman.
- Be precise: cite the scheme, the eligibility rule, the waiting period, the documentation, the cashless vs reimbursement path.
- Use simple, friendly, practical language. Use 2–4 short paragraphs or a short numbered list — never walls of text.
- If the question is about a specific policy or claim status, explain the GENERAL rule, then tell them to call their insurer for the policy-specific answer.
- Never invent helpline numbers or URLs. If unsure, refer to "the IRDAI IGMS portal at igms.irda.gov.in or call 155255".
- Never provide investment advice or recommend one insurer over another.
- HARD RULE — always end your reply with exactly this sentence (translated into the user's language if it is not English):
  "For specific claim queries, call your insurer's helpline directly."

Length: under 250 words unless the user explicitly asks for detail.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { question?: string };

    if (
      !body ||
      typeof body.question !== 'string' ||
      body.question.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Please provide a valid question (at least a few words).',
        },
        { status: 400 },
      );
    }

    const userMessage = body.question.trim().slice(0, 2000);

    const response = await callMedicalAI(
      INSURANCE_SYSTEM_PROMPT,
      userMessage,
      900,
    );

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Insurance ask error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to answer.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
