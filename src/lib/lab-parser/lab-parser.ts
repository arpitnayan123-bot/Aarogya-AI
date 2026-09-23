// ============================================
// AAROGYA AI — LAB REPORT PDF PARSER
//
// 3-stage pipeline:
//   1. Extract text from PDF buffer (dynamic import of pdf-parse, fallback to empty)
//   2. Send extracted text to Claude (via callMedicalAI) → structured JSON of test values
//   3. Classify each test against INDIAN_REFERENCE_RANGES → run second Claude call
//      to produce aiSummary, criticalFindings[], recommendations[]
//
// Reference ranges calibrated to Indian / ICMR norms (lower BMI, vitamin D
// deficiency endemic, anemia thresholds per NFHS-5, etc.).
// ============================================

import { callMedicalAI } from '@/lib/ai-client';

/**
 * Reference ranges for common Indian lab tests.
 * Calibrated to ICMR / NIN / AIIMS published norms where Indian-specific
 * thresholds exist (anemia, vitamin D, creatinine by sex, etc.).
 *
 * Keys are normalized lowercase snake_case test names.
 */
export const INDIAN_REFERENCE_RANGES: Record<
  string,
  { min: number; max: number; unit: string }
> = {
  hemoglobin_male: { min: 13.0, max: 17.0, unit: 'g/dL' },
  hemoglobin_female: { min: 12.0, max: 15.5, unit: 'g/dL' },
  hemoglobin: { min: 12.0, max: 17.0, unit: 'g/dL' },
  rbc_male: { min: 4.5, max: 5.9, unit: 'millions/uL' },
  rbc_female: { min: 3.8, max: 5.2, unit: 'millions/uL' },
  rbc: { min: 3.8, max: 5.9, unit: 'millions/uL' },
  wbc: { min: 4000, max: 11000, unit: 'cells/uL' },
  platelets: { min: 150000, max: 450000, unit: 'platelets/uL' },
  fasting_glucose: { min: 70, max: 100, unit: 'mg/dL' },
  post_prandial_glucose: { min: 70, max: 140, unit: 'mg/dL' },
  hba1c: { min: 4.0, max: 5.6, unit: '%' },
  creatinine_male: { min: 0.7, max: 1.3, unit: 'mg/dL' },
  creatinine_female: { min: 0.6, max: 1.1, unit: 'mg/dL' },
  creatinine: { min: 0.6, max: 1.3, unit: 'mg/dL' },
  urea: { min: 15, max: 40, unit: 'mg/dL' },
  uric_acid_male: { min: 3.4, max: 7.0, unit: 'mg/dL' },
  uric_acid_female: { min: 2.4, max: 6.0, unit: 'mg/dL' },
  uric_acid: { min: 2.4, max: 7.0, unit: 'mg/dL' },
  total_cholesterol: { min: 125, max: 200, unit: 'mg/dL' },
  ldl: { min: 0, max: 100, unit: 'mg/dL' },
  hdl_male: { min: 40, max: 60, unit: 'mg/dL' },
  hdl_female: { min: 50, max: 60, unit: 'mg/dL' },
  hdl: { min: 40, max: 60, unit: 'mg/dL' },
  triglycerides: { min: 0, max: 150, unit: 'mg/dL' },
  tsh: { min: 0.4, max: 4.5, unit: 'mIU/L' },
  vitamin_d: { min: 30, max: 100, unit: 'ng/mL' },
  vitamin_b12: { min: 200, max: 900, unit: 'pg/mL' },
  ferritin_male: { min: 30, max: 400, unit: 'ng/mL' },
  ferritin_female: { min: 13, max: 150, unit: 'ng/mL' },
  ferritin: { min: 13, max: 400, unit: 'ng/mL' },
  sgot: { min: 8, max: 40, unit: 'U/L' },
  sgpt: { min: 7, max: 56, unit: 'U/L' },
  total_bilirubin: { min: 0.2, max: 1.2, unit: 'mg/dL' },
};

export interface LabTestResult {
  testName: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface ParsedLabReport {
  patientName: string | null;
  labName: string | null;
  reportDate: string | null;
  tests: LabTestResult[];
  aiSummary: string;
  criticalFindings: string[];
  recommendations: string[];
}

/**
 * Critical thresholds — values outside these ranges flag the test as critical
 * (not just high/low). Approximately 2× the upper or 0.5× the lower bound.
 */
function classifyStatus(
  value: number,
  min: number | null,
  max: number | null,
): LabTestResult['status'] {
  if (min === null && max === null) return 'normal';
  if (min !== null && value < min * 0.5) return 'critical';
  if (max !== null && value > max * 2) return 'critical';
  if (min !== null && value < min) return 'low';
  if (max !== null && value > max) return 'high';
  return 'normal';
}

/**
 * Normalize a test name to snake_case for lookup in INDIAN_REFERENCE_RANGES.
 * Strips punctuation, lowercases, collapses whitespace to underscores.
 */
function normalizeTestName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
    .trim();
}

function lookupRange(rawName: string): {
  min: number | null;
  max: number | null;
  unit: string;
} {
  const key = normalizeTestName(rawName);
  if (INDIAN_REFERENCE_RANGES[key]) {
    return INDIAN_REFERENCE_RANGES[key];
  }
  // Try substring matching (e.g. "HbA1c (Glycated Hemoglobin)" → "hba1c")
  for (const k of Object.keys(INDIAN_REFERENCE_RANGES)) {
    if (key.includes(k) || k.includes(key)) {
      return INDIAN_REFERENCE_RANGES[k];
    }
  }
  return { min: null, max: null, unit: '' };
}

interface AIExtractedTest {
  testName: string;
  value: number;
  unit: string;
}

interface AIExtractedReport {
  patientName?: string | null;
  labName?: string | null;
  reportDate?: string | null;
  tests?: AIExtractedTest[];
}

/**
 * Extract structured test results from raw PDF text using Claude.
 * Returns an object with patient metadata + tests array.
 */
async function extractTestsWithAI(
  pdfText: string,
): Promise<AIExtractedReport> {
  if (!pdfText || pdfText.trim().length === 0) {
    return { patientName: null, labName: null, reportDate: null, tests: [] };
  }

  const systemPrompt =
    'You are a medical lab report extraction engine. You extract structured ' +
    'data from raw Indian lab report text. Respond with STRICT JSON only — no ' +
    'preamble, no markdown fences. The JSON must have keys: patientName ' +
    '(string|null), labName (string|null), reportDate (string|null, ISO if ' +
    'possible), tests (array of {testName, value (number), unit (string)}).';

  const userMessage =
    'Extract every lab test result you can find from the report below. ' +
    'Use canonical test names (hemoglobin, RBC, WBC, platelets, fasting ' +
    'glucose, post-prandial glucose, HbA1c, creatinine, urea, uric acid, ' +
    'total cholesterol, LDL, HDL, triglycerides, TSH, Vitamin D, Vitamin ' +
    'B12, ferritin, SGOT, SGPT, total bilirubin). For sex-specific tests ' +
    'use the generic name (we resolve male/female variants downstream).\n\n' +
    `REPORT TEXT:\n${pdfText.slice(0, 8000)}`;

  try {
    const response = await callMedicalAI(systemPrompt, userMessage, 2048);
    // Strip markdown fences if present, then parse
    const cleaned = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned) as AIExtractedReport;
    return {
      patientName: parsed.patientName ?? null,
      labName: parsed.labName ?? null,
      reportDate: parsed.reportDate ?? null,
      tests: Array.isArray(parsed.tests) ? parsed.tests : [],
    };
  } catch (error) {
    console.error('AI extraction failed:', error);
    return { patientName: null, labName: null, reportDate: null, tests: [] };
  }
}

/**
 * Generate an AI summary, critical findings, and recommendations for the
 * parsed + classified test results. Second Claude call.
 */
async function generateAISummary(
  tests: LabTestResult[],
  patientName: string | null,
): Promise<{ summary: string; critical: string[]; recommendations: string[] }> {
  if (tests.length === 0) {
    return {
      summary: 'No test results could be extracted from this report.',
      critical: [],
      recommendations: [],
    };
  }

  const systemPrompt =
    'You are a clinical decision support assistant calibrated for Indian ' +
    'patients (ICMR / AIIMS / NIN reference ranges). You receive classified ' +
    'lab test results and produce: (1) a concise plain-English summary of ' +
    'the patient\'s overall health picture, (2) a list of critical findings ' +
    'requiring immediate attention, (3) actionable lifestyle / medical ' +
    'recommendations. Respond with STRICT JSON: {summary: string, ' +
    'criticalFindings: string[], recommendations: string[]}. No markdown.';

  const testDigest = tests
    .map(
      (t) =>
        `${t.testName}: ${t.value} ${t.unit} ` +
        `(ref ${t.referenceMin ?? '—'}-${t.referenceMax ?? '—'}, ${t.status})`,
    )
    .join('\n');

  const userMessage =
    `Patient: ${patientName ?? 'Unknown'}\n` +
    `Tests (${tests.length}):\n${testDigest}\n\n` +
    `Summarize and recommend. Note Indian reference ranges apply.`;

  try {
    const response = await callMedicalAI(systemPrompt, userMessage, 1024);
    const cleaned = response
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned) as {
      summary?: string;
      criticalFindings?: string[];
      recommendations?: string[];
    };
    return {
      summary: parsed.summary ?? '',
      critical: Array.isArray(parsed.criticalFindings)
        ? parsed.criticalFindings
        : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
    };
  } catch (error) {
    console.error('AI summary failed:', error);
    return {
      summary: 'Summary generation failed — please review raw results.',
      critical: tests
        .filter((t) => t.status === 'critical')
        .map((t) => `${t.testName} ${t.value} ${t.unit} (critical)`),
      recommendations: [],
    };
  }
}

/**
 * Parse a lab report PDF buffer through the 3-stage pipeline.
 *
 * @param pdfBuffer raw PDF file bytes
 */
export async function parseLabReportPDF(
  pdfBuffer: Buffer,
): Promise<ParsedLabReport> {
  // Stage 1 — extract text (pdf-parse optional, graceful fallback)
  let pdfText = '';
  try {
    // Dynamic import so pdf-parse is only loaded when needed
    const pdfParseModule = (await import('pdf-parse')) as {
      default: (buf: Buffer) => Promise<{ text: string }>;
    } | ((buf: Buffer) => Promise<{ text: string }>);
    const pdfParse =
      typeof pdfParseModule === 'function'
        ? pdfParseModule
        : pdfParseModule.default;
    const result = await pdfParse(pdfBuffer);
    pdfText = result.text ?? '';
  } catch (error) {
    console.warn(
      'pdf-parse unavailable or failed — continuing with empty text:',
      error instanceof Error ? error.message : error,
    );
    pdfText = '';
  }

  // Stage 2 — AI extraction of structured test results
  const extracted = await extractTestsWithAI(pdfText);

  // Stage 3a — classify each test against reference ranges
  const tests: LabTestResult[] = (extracted.tests ?? []).map((t) => {
    const range = lookupRange(t.testName);
    return {
      testName: t.testName,
      value: t.value,
      unit: t.unit || range.unit,
      referenceMin: range.min,
      referenceMax: range.max,
      status: classifyStatus(t.value, range.min, range.max),
    };
  });

  // Stage 3b — generate AI summary, critical findings, recommendations
  const summaryResult = await generateAISummary(tests, extracted.patientName);

  return {
    patientName: extracted.patientName ?? null,
    labName: extracted.labName ?? null,
    reportDate: extracted.reportDate ?? null,
    tests,
    aiSummary: summaryResult.summary,
    criticalFindings: summaryResult.critical,
    recommendations: summaryResult.recommendations,
  };
}
