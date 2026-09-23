// ============================================
// POST /api/pharmacogenomics/analyze
//
// Reads the user's uploaded genetic-test report (text payload)
// and asks Claude to produce a plain-language educational
// pharmacogenomic interpretation tuned for the Indian
// population.
//
// Request body (JSON):
//   { fileName: string, fileType: string, text: string }
//
// Response (200):
//   { success: true, response: string }
// Response (4xx / 5xx):
//   { success: false, error: string }
//
// The uploaded text is truncated to 3000 characters before
// being sent to the model to keep prompt cost predictable.
// Files are NEVER persisted — they are processed in-memory
// and discarded.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { callMedicalAI } from '@/lib/ai-client';

const MAX_INPUT_CHARS = 3000;

const PHARMACOGENOMICS_SYSTEM_PROMPT = `You are Aarogya AI's pharmacogenomics assistant, focused on the Indian population.

Your job:
- Read the user's uploaded genetic / pharmacogenomic test report (may be raw text, CSV, JSON, or unstructured).
- Explain the variants found in plain, non-jargon language.
- For each clinically actionable variant, cover:
  1. The gene and the variant / allele / phenotype call (e.g. CYP2C19 *2/*3 — Poor Metabolizer).
  2. The affected drug class(es) and specific common drugs.
  3. The Indian-population frequency context (use the Indian Genome Variation Consortium, PharmGKB, CPIC-published Indian cohort figures where you know them; otherwise state "frequency varies by Indian sub-population — confirm with the testing lab").
  4. The clinical consequence (efficacy loss, toxicity risk, dose adjustment, alternative drug).
  5. The CPIC / PharmGKB guideline level (A/B/C) if known.
- If the report does NOT contain pharmacogenomic information, say so plainly and explain what a pharmacogenomic panel looks like.
- Be honest about uncertainty — never invent variants or frequencies.

HARD RULES:
- You are an EDUCATIONAL tool, NOT a prescriber. You MUST NOT recommend specific dose changes, start/stop medications, or substitute drugs.
- Always end with: "Discuss these findings with your physician or a clinical pharmacologist before making any medication decision. For emergencies, call 112."
- Indian context: prefer Indian drug brand examples (e.g. Clopilet, Ecosprin, Rosuvas, Glycomet) where useful, but always use the INN/generic name first.
- Use headings (##) and short bullet lists for readability. Keep the response under ~600 words.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      fileName?: string;
      fileType?: string;
      text?: string;
    };

    if (
      !body ||
      typeof body !== 'object' ||
      typeof body.text !== 'string' ||
      body.text.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Report text is required. Upload a text-readable file (.txt/.csv/.md/.json) — PDF parsing is coming soon.',
        },
        { status: 400 },
      );
    }

    const fileName =
      typeof body.fileName === 'string' ? body.fileName : 'report.txt';
    const truncated = body.text.slice(0, MAX_INPUT_CHARS);

    const userMessage = `File name: ${fileName}\nFile type: ${body.fileType ?? 'text/plain'}\n\n--- BEGIN REPORT ---\n${truncated}\n--- END REPORT ---\n\nProvide a plain-language educational pharmacogenomic interpretation for an Indian patient.`;

    const response = await callMedicalAI(
      PHARMACOGENOMICS_SYSTEM_PROMPT,
      userMessage,
      1500,
    );

    return NextResponse.json({
      success: true,
      response,
      // Surface truncation so the client can warn the user
      truncated: body.text.length > MAX_INPUT_CHARS,
      charsProcessed: truncated.length,
    });
  } catch (error) {
    console.error('Pharmacogenomics analyze error:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to analyze pharmacogenomic report';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
