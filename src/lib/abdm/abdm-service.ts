// ============================================
// AAROGYA AI — ABDM (Ayushman Bharat Digital Mission) INTEGRATION
//
// India's national health account ecosystem. Three core operations:
//   • getABDMToken()      — OAuth2 client-credentials session with the gateway
//   • verifyABHA()        — Look up a patient by their 14-digit ABHA number
//   • initiateConsent()   — Request consent to access patient data via HIU
//
// Environment:
//   ABDM_CLIENT_ID     — Application Client ID from ABDM sandbox/production
//   ABDM_CLIENT_SECRET — Application Client Secret
//   ABDM_BASE_URL      — Gateway base URL (sandbox or production)
//
// All requests go through the ABDM gateway REST API. No third-party SDK.
// ============================================

/**
 * ABDM gateway access token cache (avoid re-fetching on every request).
 * Token TTL is typically 15 minutes — we refresh at 12 minutes for safety.
 */
let cachedToken: { token: string; expiresAt: number } | null = null;
const TOKEN_REFRESH_BUFFER_MS = 3 * 60 * 1000; // 3 minutes before expiry

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required env var ${key}. Configure ABDM credentials in .env`,
    );
  }
  return value;
}

/**
 * Obtain an OAuth2 access token from the ABDM gateway sessions endpoint.
 * Caches the token and refreshes proactively before expiry.
 *
 * @returns access token string (Bearer)
 */
export async function getABDMToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = getEnvOrThrow('ABDM_CLIENT_ID');
  const clientSecret = getEnvOrThrow('ABDM_CLIENT_SECRET');
  const baseUrl = getEnvOrThrow('ABDM_BASE_URL').replace(/\/$/, '');

  const sessionUrl = `${baseUrl}/sessions`;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  const response = await fetch(sessionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `ABDM token request failed (${response.status}): ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    accessToken?: string;
    expiresIn?: number;
    token?: string;
    expires_in?: number;
  };

  const token = data.accessToken ?? data.token;
  const expiresIn = data.expiresIn ?? data.expires_in;

  if (!token) {
    throw new Error('ABDM token response missing accessToken field');
  }

  // Default to 15 minutes if no expiresIn returned
  const ttlMs = (expiresIn ?? 900) * 1000;
  cachedToken = {
    token,
    expiresAt: Date.now() + ttlMs - TOKEN_REFRESH_BUFFER_MS,
  };

  return token;
}

/**
 * ABHA patient profile shape returned by the ABDM user auth/profile endpoint.
 * Subset of the full profile — only the fields we consume.
 */
export interface ABHAPatientProfile {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  gender?: string;
  yearOfBirth?: number;
  monthOfBirth?: number;
  dayOfBirth?: number;
  address?: string;
  district?: string;
  state?: string;
  pincode?: string;
  mobile?: string;
  email?: string;
  healthIdStatus?: string;
  raw?: unknown;
}

/**
 * Verify a 14-digit ABHA number against the ABDM gateway and return the
 * associated patient profile.
 *
 * @param abhaNumber 14-digit ABHA number (with or without hyphens)
 * @param token Bearer access token from getABDMToken()
 */
export async function verifyABHA(
  abhaNumber: string,
  token: string,
): Promise<ABHAPatientProfile> {
  if (!abhaNumber) {
    throw new Error('ABHA number is required');
  }
  // Normalize — strip hyphens / spaces
  const normalized = abhaNumber.replace(/[-\s]/g, '');
  const baseUrl = getEnvOrThrow('ABDM_BASE_URL').replace(/\/$/, '');
  const profileUrl = `${baseUrl}/users/auth/profile`;

  const response = await fetch(profileUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      abhaNumber: normalized,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `ABDM verifyABHA failed (${response.status}): ${errorText}`,
    );
  }

  const raw = (await response.json()) as Record<string, unknown>;
  return {
    abhaNumber: normalized,
    abhaAddress: (raw.abhaAddress as string) ?? (raw.healthId as string) ?? '',
    name: (raw.name as string) ?? (raw.firstName as string) ?? '',
    gender: raw.gender as string | undefined,
    yearOfBirth: raw.yearOfBirth as number | undefined,
    monthOfBirth: raw.monthOfBirth as number | undefined,
    dayOfBirth: raw.dayOfBirth as number | undefined,
    address: raw.address as string | undefined,
    district: raw.district as string | undefined,
    state: raw.state as string | undefined,
    pincode: raw.pincode as string | undefined,
    mobile: raw.mobile as string | undefined,
    email: raw.email as string | undefined,
    healthIdStatus: raw.healthIdStatus as string | undefined,
    raw,
  };
}

/**
 * Consent artifact request — initiate a consent request to access patient data
 * through the ABDM HIU (Health Information User) flow.
 *
 * @param patientId     Internal patient identifier (your system)
 * @param abhaAddress   Patient's ABHA address (e.g. name@abdm)
 * @param purpose       Purpose of data access (e.g. "CAREMGT" / "BTG" / "RND")
 * @param token         Bearer access token from getABDMToken()
 * @returns consent request id returned by the gateway
 */
export async function initiateConsent(
  patientId: string,
  abhaAddress: string,
  purpose: string,
  token: string,
): Promise<{ consentRequestId: string; raw: unknown }> {
  if (!patientId || !abhaAddress || !purpose) {
    throw new Error('patientId, abhaAddress, and purpose are required');
  }

  const baseUrl = getEnvOrThrow('ABDM_BASE_URL').replace(/\/$/, '');
  const consentUrl = `${baseUrl}/consent-requests/init`;

  // 24-hour expiry for the consent request, info medatypes requested
  const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const requestBody = {
    patient: { abhaAddress },
    purpose: { code: purpose, text: purpose },
    hip: { id: patientId },
    hiu: { id: patientId },
    permission: {
      accessMode: 'VIEW',
      dateRange: {
        from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
      },
      dataExpiryAt: expiryDate,
      frequency: {
        unit: 'HOUR',
        value: 1,
        repeats: 24,
      },
    },
  };

  const response = await fetch(consentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `ABDM initiateConsent failed (${response.status}): ${errorText}`,
    );
  }

  const raw = (await response.json()) as Record<string, unknown>;
  const consentRequestId =
    (raw.consentRequestId as string) ??
    (raw.id as string) ??
    (raw.referenceNumber as string) ??
    '';

  return { consentRequestId, raw };
}
