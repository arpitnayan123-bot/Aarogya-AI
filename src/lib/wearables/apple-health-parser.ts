// ============================================
// AAROGYA AI — APPLE HEALTH EXPORT XML PARSER
//
// Apple Health exports an enormous XML file containing all health records.
// We parse it client-side (or in API routes) and aggregate the same metric
// categories as Google Fit so the unified HealthMetrics schema can ingest
// both sources.
//
// Robustness:
//   • Tries dynamic import('xml2js') first (fastest, full-featured)
//   • Falls back to a hand-rolled regex parser if xml2js is not installed
//   • Never throws — returns empty summary on parse failure
// ============================================

/**
 * Normalized summary of an Apple Health export.
 * Mirrors GoogleFitData fields where possible.
 */
export interface AppleHealthSummary {
  parseMethod: 'xml2js' | 'fallback' | 'none';
  totalRecords: number;
  steps: number | null;
  heartRateAvg: number | null; // bpm
  heartRateMin: number | null;
  heartRateMax: number | null;
  bloodGlucoseAvg: number | null; // mg/dL
  bloodGlucoseMin: number | null;
  bloodGlucoseMax: number | null;
  weightKg: number | null;
  sleepDurationMinutes: number | null;
  /** Raw type identifier → record count (for debugging / UI display). */
  typeBreakdown: Record<string, number>;
  /** Earliest record date (ISO) */
  startDate?: string;
  /** Latest record date (ISO) */
  endDate?: string;
}

interface RawRecord {
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  unit?: string;
}

const TYPE_MAP = {
  steps: ['HKQuantityTypeIdentifierStepCount'],
  heartRate: ['HKQuantityTypeIdentifierHeartRate'],
  bloodGlucose: ['HKQuantityTypeIdentifierBloodGlucose'],
  weight: ['HKQuantityTypeIdentifierBodyMass'],
  sleep: ['HKCategoryTypeIdentifierSleepAnalysis'],
} as const;

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function parseRecord(entry: Record<string, unknown>): RawRecord | null {
  const attrs = (entry.$ ?? {}) as Record<string, string>;
  const type = attrs.type;
  const rawValue = attrs.value;
  const value = parseFloat(rawValue);
  if (!type || isNaN(value)) return null;
  return {
    type,
    value,
    startDate: attrs.startDate,
    endDate: attrs.endDate,
    unit: attrs.unit,
  };
}

/**
 * Aggregate parsed records into the normalized summary.
 */
function aggregate(records: RawRecord[]): AppleHealthSummary {
  const typeBreakdown: Record<string, number> = {};
  const steps: number[] = [];
  const hr: number[] = [];
  const glucose: number[] = [];
  const weight: number[] = [];
  const sleep: { start: number; end: number }[] = [];

  let startDate: number | undefined;
  let endDate: number | undefined;

  for (const r of records) {
    typeBreakdown[r.type] = (typeBreakdown[r.type] ?? 0) + 1;

    const s = Date.parse(r.startDate);
    const e = Date.parse(r.endDate);
    if (!isNaN(s)) startDate = startDate === undefined ? s : Math.min(startDate, s);
    if (!isNaN(e)) endDate = endDate === undefined ? e : Math.max(endDate, e);

    if (TYPE_MAP.steps.includes(r.type as (typeof TYPE_MAP.steps)[number])) {
      steps.push(r.value);
    } else if (
      TYPE_MAP.heartRate.includes(r.type as (typeof TYPE_MAP.heartRate)[number])
    ) {
      hr.push(r.value);
    } else if (
      TYPE_MAP.bloodGlucose.includes(
        r.type as (typeof TYPE_MAP.bloodGlucose)[number],
      )
    ) {
      glucose.push(r.value);
    } else if (
      TYPE_MAP.weight.includes(r.type as (typeof TYPE_MAP.weight)[number])
    ) {
      weight.push(r.value);
    } else if (
      TYPE_MAP.sleep.includes(r.type as (typeof TYPE_MAP.sleep)[number])
    ) {
      if (!isNaN(s) && !isNaN(e) && e >= s) sleep.push({ start: s, end: e });
    }
  }

  // Steps — sum across all step records
  const stepsTotal = steps.length ? steps.reduce((a, b) => a + b, 0) : null;

  // Weight — most recent value
  const weightKg = weight.length ? weight[weight.length - 1] : null;

  // Sleep — sum durations in minutes (only "asleep" segments count if device labels them,
  // but Apple's SleepAnalysis uses value=0/1/2 — we approximate via duration of in-bed/asleep segments)
  let sleepMinutes: number | null = null;
  if (sleep.length > 0) {
    const totalMs = sleep.reduce((acc, seg) => acc + (seg.end - seg.start), 0);
    sleepMinutes = totalMs / 60000;
  }

  return {
    parseMethod: 'xml2js',
    totalRecords: records.length,
    steps: stepsTotal,
    heartRateAvg: avg(hr),
    heartRateMin: hr.length ? Math.min(...hr) : null,
    heartRateMax: hr.length ? Math.max(...hr) : null,
    bloodGlucoseAvg: avg(glucose),
    bloodGlucoseMin: glucose.length ? Math.min(...glucose) : null,
    bloodGlucoseMax: glucose.length ? Math.max(...glucose) : null,
    weightKg,
    sleepDurationMinutes: sleepMinutes,
    typeBreakdown,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
  };
}

/**
 * Fallback regex-based parser — used when xml2js is unavailable.
 * Walks the XML once, extracting <Record .../> elements via regex.
 */
function parseWithRegex(xmlString: string): RawRecord[] {
  const records: RawRecord[] = [];
  // Matches self-closing <Record ... /> OR <Record ...></Record>
  const recordRegex = /<Record\b([^>]*?)(?:\/>|>(?:[\s\S]*?)<\/Record>)/g;
  const attrRegex = /(\w+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = recordRegex.exec(xmlString)) !== null) {
    const attrs: Record<string, string> = {};
    const attrStr = match[1] ?? '';
    let am: RegExpExecArray | null;
    while ((am = attrRegex.exec(attrStr)) !== null) {
      attrs[am[1]] = am[2];
    }
    const type = attrs.type;
    const value = parseFloat(attrs.value ?? '');
    if (!type || isNaN(value)) continue;
    records.push({
      type,
      value,
      startDate: attrs.startDate,
      endDate: attrs.endDate,
      unit: attrs.unit,
    });
  }
  return records;
}

/**
 * Parse an Apple Health export XML string and return an aggregated summary.
 * Safe-by-default — never throws, returns empty summary on failure.
 *
 * @param xmlString raw contents of export.xml
 */
export async function parseAppleHealthExport(
  xmlString: string,
): Promise<AppleHealthSummary> {
  if (!xmlString || xmlString.trim().length === 0) {
    return {
      parseMethod: 'none',
      totalRecords: 0,
      steps: null,
      heartRateAvg: null,
      heartRateMin: null,
      heartRateMax: null,
      bloodGlucoseAvg: null,
      bloodGlucoseMin: null,
      bloodGlucoseMax: null,
      weightKg: null,
      sleepDurationMinutes: null,
      typeBreakdown: {},
    };
  }

  // Attempt 1 — dynamic import of xml2js (preferred when installed)
  try {
    const xml2js = await import('xml2js');
    const parsed = await xml2js.parseStringPromise(xmlString, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
    });
    const root = parsed?.HealthData ?? parsed;
    let recordNodes: Record<string, unknown>[] = [];
    if (Array.isArray(root?.Record)) {
      recordNodes = root.Record as Record<string, unknown>[];
    } else if (root?.Record && typeof root.Record === 'object') {
      recordNodes = [root.Record as Record<string, unknown>];
    }
    const records: RawRecord[] = [];
    for (const node of recordNodes) {
      const r = parseRecord(node);
      if (r) records.push(r);
    }
    return aggregate(records);
  } catch {
    // xml2js unavailable or parse failed — fall through to regex parser
  }

  // Attempt 2 — fallback regex parser (always available)
  try {
    const records = parseWithRegex(xmlString);
    const summary = aggregate(records);
    summary.parseMethod = 'fallback';
    return summary;
  } catch {
    return {
      parseMethod: 'none',
      totalRecords: 0,
      steps: null,
      heartRateAvg: null,
      heartRateMin: null,
      heartRateMax: null,
      bloodGlucoseAvg: null,
      bloodGlucoseMin: null,
      bloodGlucoseMax: null,
      weightKg: null,
      sleepDurationMinutes: null,
      typeBreakdown: {},
    };
  }
}
