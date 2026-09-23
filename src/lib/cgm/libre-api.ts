// ============================================
// AAROGYA AI — FREESTYLE LIBRE (LibreView) CGM INTEGRATION
//
// Provides:
//   • fetchLibreData(email, password)
//     → logs in to the LibreView API (https://api.libreview.io)
//     → fetches the patient's CGM graph for the last 24 hours
//     → returns a structured CGMSummary (current glucose, TIR,
//       readings array)
//
// Why LibreView?
//   LibreView is the official Abbott cloud for FreeStyle Libre
//   CGM data. Patients can share their data with any third-party
//   app by logging in with their LibreView credentials — Abbott
//   issues a short-lived JWT which we use to read the graph.
//
// Security / privacy notes:
//   • Credentials are NEVER persisted. They are used in-memory for
//     a single login handshake, then discarded.
//   • The returned JWT is also short-lived (~15 min) and is not
//     cached across requests in this layer.
//   • On the API side, the route handler is the only consumer;
//     credentials never touch localStorage, cookies, or the DB.
//   • The official mobile-app User-Agent is used to mirror the
//     LibreLinkUp client and avoid API rejection.
//
// Targets:
//   • Time-in-Range (TIR) — % readings between 70–180 mg/dL
//     (per ATTD 2019 international consensus)
//   • Below range: <70 mg/dL (level 1 <54 mg/dL = critical)
//   • Above range: >180 mg/dL (level 2 >250 mg/dL = critical)
//
// Errors are handled gracefully — the function never throws to
// the caller; it returns a CGMSummary with `currentGlucose: null`
// and an explanation in `error` if anything fails.
// ============================================

const LIBREVIEW_BASE_URL = 'https://api.libreview.io';
const LIBREVIEW_USER_AGENT =
  'FreeStyle LibreLink Up iPhone App / LibreLinkUp 4.7.0';
const LIBREVIEW_PRODUCT = 'llu.android';
const LIBREVIEW_VERSION = '4.7';

export interface GlucoseReading {
  /** ISO 8601 timestamp of the reading. */
  timestamp: string;
  /** Glucose value in mg/dL. */
  value: number;
}

export interface CGMSummary {
  /** Latest glucose value in mg/dL, or null if no data. */
  currentGlucose: number | null;
  /** % of readings in 70–180 mg/dL range (0–100). */
  timeInRange: number;
  /** % of readings below 70 mg/dL (0–100). */
  timeBelowRange: number;
  /** % of readings above 180 mg/dL (0–100). */
  timeAboveRange: number;
  /** All 24h readings (newest last). */
  readings: GlucoseReading[];
  /** Error message if the fetch failed. */
  error?: string;
}

// ---------- helpers ----------

/** Standard headers LibreView expects on every call. */
function libreHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': LIBREVIEW_USER_AGENT,
    'Content-Type': 'application/json',
    'product': LIBREVIEW_PRODUCT,
    'version': LIBREVIEW_VERSION,
    'Accept': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

interface LibreLoginResponse {
  data?: {
    authTicket?: {
      token?: string;
      expires?: number;
    };
    user?: { id?: string };
  };
  status?: number;
  error?: { message?: string } | string;
}

interface LibreConnection {
  patientId: string;
  // [other fields ignored]
}

interface LibreGraphResponse {
  data?: {
    connection?: LibreConnection;
    graphData?: Array<{
      // Each graphData entry has Timestamp (ms) + Value in mg/dL
      // (LibreView returns Value as glucose in mg/dL by default).
      Timestamp?: number;
      Value?: number;
      // Some locales return value in mmol/L — flag present in factory.
      ValueInMgPerDl?: number;
    }>;
    activeSensors?: unknown;
  };
  status?: number;
  error?: { message?: string } | string;
}

/**
 * Compute TIR / TBR / TAR percentages from a list of readings.
 * Empty array → all zeros.
 */
function computeRangeStats(
  readings: GlucoseReading[],
): Pick<
  CGMSummary,
  'timeInRange' | 'timeBelowRange' | 'timeAboveRange'
> {
  if (readings.length === 0) {
    return { timeInRange: 0, timeBelowRange: 0, timeAboveRange: 0 };
  }
  let inRange = 0;
  let below = 0;
  let above = 0;
  for (const r of readings) {
    if (r.value < 70) below++;
    else if (r.value > 180) above++;
    else inRange++;
  }
  const n = readings.length;
  return {
    timeInRange: Math.round((inRange / n) * 1000) / 10,
    timeBelowRange: Math.round((below / n) * 1000) / 10,
    timeAboveRange: Math.round((above / n) * 1000) / 10,
  };
}

/**
 * Fetch 24h CGM data from LibreView.
 *
 * Flow:
 *   1. POST /llu/auth/login  → obtain JWT.
 *   2. GET  /llu/connections  → list shared patient ids.
 *   3. GET  /llu/connections/{patientId}/graph  → 24h graph.
 *   4. Compute TIR/TBR/TAR and return CGMSummary.
 *
 * The function never throws — it always returns a CGMSummary.
 */
export async function fetchLibreData(
  email: string,
  password: string,
): Promise<CGMSummary> {
  // --- Validate inputs ---
  if (!email || !password) {
    return emptySummary('Email and password are required.');
  }

  try {
    // --- Step 1: Login ---
    const loginRes = await fetch(`${LIBREVIEW_BASE_URL}/llu/auth/login`, {
      method: 'POST',
      headers: libreHeaders(),
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!loginRes.ok) {
      const text = await loginRes.text().catch(() => '');
      return emptySummary(
        `LibreView login failed (${loginRes.status}). ${text.slice(0, 200)}`.trim(),
      );
    }

    const loginJson = (await loginRes.json()) as LibreLoginResponse;
    const token = loginJson.data?.authTicket?.token;
    if (!token) {
      return emptySummary(
        typeof loginJson.error === 'string'
          ? loginJson.error
          : loginJson.error?.message ?? 'LibreView returned no auth token.',
      );
    }

    // --- Step 2: List patient connections ---
    const connRes = await fetch(`${LIBREVIEW_BASE_URL}/llu/connections`, {
      method: 'GET',
      headers: libreHeaders(token),
    });
    if (!connRes.ok) {
      return emptySummary(
        `LibreView connections fetch failed (${connRes.status}).`,
      );
    }
    const connJson = (await connRes.json()) as {
      data?: Array<LibreConnection>;
    };
    const patients = connJson.data ?? [];
    if (patients.length === 0) {
      return emptySummary(
        'No shared LibreView patients found for this account.',
      );
    }

    // Use the first shared patient (the user can switch patients later).
    const patientId = patients[0].patientId;

    // --- Step 3: Fetch the 24h graph ---
    const graphRes = await fetch(
      `${LIBREVIEW_BASE_URL}/llu/connections/${patientId}/graph`,
      { method: 'GET', headers: libreHeaders(token) },
    );
    if (!graphRes.ok) {
      return emptySummary(
        `LibreView graph fetch failed (${graphRes.status}).`,
      );
    }
    const graphJson = (await graphRes.json()) as LibreGraphResponse;
    const raw = graphJson.data?.graphData ?? [];

    if (raw.length === 0) {
      return emptySummary('No CGM readings available for the last 24 hours.');
    }

    // --- Step 4: Normalize + compute stats ---
    const readings: GlucoseReading[] = raw
      .filter((g) => typeof g.Timestamp === 'number')
      .map((g) => {
        const value =
          typeof g.ValueInMgPerDl === 'number'
            ? g.ValueInMgPerDl
            : typeof g.Value === 'number'
              ? g.Value
              : 0;
        return {
          timestamp: new Date(g.Timestamp as number).toISOString(),
          value,
        };
      })
      .filter((r) => r.value > 0)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    const stats = computeRangeStats(readings);
    const current = readings.length > 0 ? readings[readings.length - 1].value : null;

    return {
      currentGlucose: current,
      ...stats,
      readings,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Unknown error contacting LibreView.';
    return emptySummary(message);
  }
}

/** Build an empty CGMSummary with an error message. */
function emptySummary(error: string): CGMSummary {
  return {
    currentGlucose: null,
    timeInRange: 0,
    timeBelowRange: 0,
    timeAboveRange: 0,
    readings: [],
    error,
  };
}

/**
 * Categorize a glucose value for UI color-coding.
 *   • in-range   → green    (70–180 mg/dL)
 *   • slight-low → yellow   (54–69 mg/dL)
 *   • slight-high→ yellow   (181–250 mg/dL)
 *   • critical   → red      (<54 or >250 mg/dL)
 */
export type GlucoseZone = 'in-range' | 'slight-low' | 'slight-high' | 'critical';

export function glucoseZone(value: number | null): GlucoseZone | null {
  if (value === null || typeof value !== 'number') return null;
  if (value < 54) return 'critical';
  if (value < 70) return 'slight-low';
  if (value <= 180) return 'in-range';
  if (value <= 250) return 'slight-high';
  return 'critical';
}
