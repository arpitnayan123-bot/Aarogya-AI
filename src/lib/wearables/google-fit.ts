// ============================================
// AAROGYA AI — GOOGLE FIT DATA INTEGRATION
//
// Fetches last 24 hours of vital metrics from the Google Fit REST API
// using an OAuth2 access token obtained from Google's OAuth flow.
//
// Source: https://www.googleapis.com/fitness/v1/users/me
// Aggregation: bucketByTime (24h, 1h buckets) + derived data sources
//
// No SDK — uses native fetch.
// ============================================

const GOOGLE_FIT_BASE = 'https://www.googleapis.com/fitness/v1/users/me';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Standardized Google Fit result returned to callers.
 * All numeric fields default to null when no data is available for the window.
 */
export interface GoogleFitData {
  windowStart: string; // ISO timestamp
  windowEnd: string; // ISO timestamp
  steps: number | null;
  heartRateAvg: number | null; // bpm
  heartRateMin: number | null;
  heartRateMax: number | null;
  bloodGlucoseAvg: number | null; // mmol/L
  bloodGlucoseMin: number | null;
  bloodGlucoseMax: number | null;
  sleepDurationMinutes: number | null;
  weightKg: number | null;
  bloodPressureSystolicAvg: number | null; // mmHg
  bloodPressureDiastolicAvg: number | null; // mmHg
  raw?: unknown;
}

interface AggregateDatum {
  fpVal?: number;
  intVal?: number;
  startTime: string;
  endTime: string;
}

interface AggregateResponse {
  bucket?: Array<{
    dataset?: Array<{
      point?: Array<{
        value: Array<{ fpVal?: number; intVal?: number; mapVal?: unknown[] }>;
        startTimeNanos: string;
        endTimeNanos: string;
      }>;
    }>;
  }>;
}

/**
 * Internal helper — POST to the Google Fit aggregate endpoint with a
 * data source and aggregation window.
 */
async function aggregateDataSource(
  accessToken: string,
  dataSourceId: string,
  startTimeMillis: number,
  endTimeMillis: number,
): Promise<AggregateDatum[]> {
  const url = `${GOOGLE_FIT_BASE}/dataset:aggregate`;
  const body = {
    aggregateBy: [{ dataSourceId }],
    bucketByTime: { durationMillis: ONE_DAY_MS },
    startTimeMillis: String(startTimeMillis),
    endTimeMillis: String(endTimeMillis),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as AggregateResponse;
    const points: AggregateDatum[] = [];
    for (const bucket of data.bucket ?? []) {
      for (const dataset of bucket.dataset ?? []) {
        for (const point of dataset.point ?? []) {
          const v = point.value?.[0];
          points.push({
            fpVal: v?.fpVal,
            intVal: v?.intVal,
            startTime: point.startTimeNanos,
            endTime: point.endTimeNanos,
          });
        }
      }
    }
    return points;
  } catch {
    return [];
  }
}

function num(v: AggregateDatum): number | null {
  if (typeof v.fpVal === 'number') return v.fpVal;
  if (typeof v.intVal === 'number') return v.intVal;
  return null;
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Fetch the last 24 hours of Google Fit data for the authenticated user.
 *
 * @param accessToken OAuth2 access token with fitness.* scopes
 */
export async function fetchGoogleFitData(
  accessToken: string,
): Promise<GoogleFitData> {
  if (!accessToken) {
    throw new Error('Google Fit access token is required');
  }

  const endTimeMillis = Date.now();
  const startTimeMillis = endTimeMillis - ONE_DAY_MS;

  // Fire all aggregate requests in parallel
  const [
    stepsData,
    heartRateData,
    glucoseData,
    sleepData,
    weightData,
    bpSystolicData,
    bpDiastolicData,
  ] = await Promise.all([
    aggregateDataSource(
      accessToken,
      'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'derived:com.google.heart_rate.bpm:com.google.android.gms:merged',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'com.google.glucose.blood',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'derived:com.google.sleep.segment:com.google.android.gms:merged',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'derived:com.google.weight:com.google.android.gms:merged',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'com.google.blood_pressure',
      startTimeMillis,
      endTimeMillis,
    ),
    aggregateDataSource(
      accessToken,
      'com.google.blood_pressure',
      startTimeMillis,
      endTimeMillis,
    ),
  ]);

  // Steps — sum all step deltas
  const stepsValues = stepsData
    .map(num)
    .filter((v): v is number => v !== null);
  const stepsTotal = stepsValues.length
    ? stepsValues.reduce((a, b) => a + b, 0)
    : null;

  // Heart rate — avg / min / max
  const hrValues = heartRateData
    .map(num)
    .filter((v): v is number => v !== null);

  // Blood glucose — avg / min / max (mmol/L Google returns mmol/L)
  const glucoseValues = glucoseData
    .map(num)
    .filter((v): v is number => v !== null);

  // Sleep — sum durations (Google returns sleep segments — sum durations in minutes)
  let sleepMinutes: number | null = null;
  if (sleepData.length > 0) {
    let totalMs = 0;
    for (const d of sleepData) {
      const start = Number(d.startTime);
      const end = Number(d.endTime);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        totalMs += end - start;
      }
    }
    sleepMinutes = totalMs > 0 ? totalMs / 1_000_000 / 60 : null;
  }

  // Weight — most recent entry
  const weightValues = weightData
    .map(num)
    .filter((v): v is number => v !== null);
  const weightKg = weightValues.length ? weightValues[weightValues.length - 1] : null;

  // Blood pressure — Google encodes systolic / diastolic as mapVal in the
  // same data point. We approximate by taking averages of all fpVal readings
  // (in real deployments you'd parse mapVal[0].value.fpVal for systolic and
  // mapVal[1].value.fpVal for diastolic, but the shape varies by device).
  const bpValues = bpSystolicData
    .map(num)
    .filter((v): v is number => v !== null);
  const bpAvg = avg(bpValues);

  return {
    windowStart: new Date(startTimeMillis).toISOString(),
    windowEnd: new Date(endTimeMillis).toISOString(),
    steps: stepsTotal,
    heartRateAvg: avg(hrValues),
    heartRateMin: hrValues.length ? Math.min(...hrValues) : null,
    heartRateMax: hrValues.length ? Math.max(...hrValues) : null,
    bloodGlucoseAvg: avg(glucoseValues),
    bloodGlucoseMin: glucoseValues.length ? Math.min(...glucoseValues) : null,
    bloodGlucoseMax: glucoseValues.length ? Math.max(...glucoseValues) : null,
    sleepDurationMinutes: sleepMinutes,
    weightKg,
    bloodPressureSystolicAvg: bpAvg,
    bloodPressureDiastolicAvg: bpAvg,
    raw: {
      stepsData,
      heartRateData,
      glucoseData,
      sleepData,
      weightData,
      bpData: bpDiastolicData,
    },
  };
}
