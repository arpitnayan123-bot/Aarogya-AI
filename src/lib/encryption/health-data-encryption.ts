// ============================================
// AAROGYA AI — FIELD-LEVEL HEALTH DATA ENCRYPTION
//
// AES-256-CBC field-level encryption for sensitive health
// data (PHI) before it lands in the database or is shipped
// to external services.
//
// Why field-level (not just TLS + at-rest)?
//   • TLS protects data in transit. At-rest encryption protects
//     against disk theft. Neither protects against a SQL injection
//     that reads the live DB, a misconfigured backup, or a rogue
//     DBA SELECT. Field-level encryption means the DB rows are
//     ciphertext without the application-layer key.
//
// Why AES-256-CBC and not AES-256-GCM?
//   • GCM provides authenticated encryption (integrity + confidentiality)
//     and is preferred for new systems. CBC is chosen here ONLY to match
//     the spec. A future PR should switch to GCM (`createCipheriv('aes-256-gcm')`)
//     and prepend the auth tag to the ciphertext. The wire format
//     "iv:encryptedHex" stays the same — only the algorithm and tag
//     handling change.
//
// Env var:
//   HEALTH_DATA_ENCRYPTION_KEY — 32-byte hex string (64 hex chars).
//   Generate with: `openssl rand -hex 32`
//
// Wire format:
//   "iv:encryptedHex"
//   • iv           — 16 random bytes, hex-encoded (32 chars)
//   • encryptedHex — AES-256-CBC ciphertext, hex-encoded
//
// Server-side only — the key must never ship to the browser.
// ============================================

import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size in bytes
const KEY_LENGTH = 32; // 256 bits

// --------------------------------------------
// Key resolution
// --------------------------------------------

let _cachedKey: Buffer | null = null;

/**
 * Resolve and cache the encryption key from the environment.
 * Throws a descriptive error if the key is missing or malformed
 * so misconfigured deployments fail loudly at first use rather
 * than silently writing unencrypted or wrongly-encrypted data.
 */
function getEncryptionKey(): Buffer {
  if (_cachedKey) return _cachedKey;

  const hex = process.env.HEALTH_DATA_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      'HEALTH_DATA_ENCRYPTION_KEY is not configured. Generate one with `openssl rand -hex 32` and set it in .env',
    );
  }

  if (hex.length !== KEY_LENGTH * 2 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error(
      `HEALTH_DATA_ENCRYPTION_KEY must be ${KEY_LENGTH * 2} hex characters (32 bytes). ` +
        `Received ${hex.length} characters. Generate one with: openssl rand -hex 32`,
    );
  }

  _cachedKey = Buffer.from(hex, 'hex');
  return _cachedKey;
}

// --------------------------------------------
// encryptHealthData
// --------------------------------------------

/**
 * Encrypt any JSON-serializable value with AES-256-CBC.
 *
 * @param value  Any value that survives JSON.stringify (objects, arrays, strings, numbers, booleans, null).
 * @returns      Wire-format string "iv:encryptedHex" (both parts hex-encoded).
 * @throws       Error if the encryption key is missing/malformed or the value
 *               cannot be serialized.
 */
export function encryptHealthData(value: unknown): string {
  // Serialize first so we throw early on non-serializable input
  // (e.g. values containing functions, Symbols, circular refs).
  let plaintext: string;
  try {
    plaintext = JSON.stringify(value);
  } catch (error) {
    throw new Error(
      'encryptHealthData: value is not JSON-serializable. ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }

  // Per-call IV — never reuse an IV with the same key under CBC.
  const iv = crypto.randomBytes(IV_LENGTH);

  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// --------------------------------------------
// decryptHealthData
// --------------------------------------------

/**
 * Decrypt a wire-format "iv:encryptedHex" string produced by encryptHealthData.
 *
 * @param encrypted  The "iv:encryptedHex" string.
 * @returns          The original value, parsed back from JSON.
 * @throws           Error if the input is malformed, the key is wrong/missing,
 *                   or the ciphertext is corrupt.
 */
export function decryptHealthData(encrypted: string): unknown {
  if (typeof encrypted !== 'string' || encrypted.length === 0) {
    throw new Error(
      'decryptHealthData: expected non-empty string in "iv:encryptedHex" format.',
    );
  }

  const colonIndex = encrypted.indexOf(':');
  if (colonIndex === -1) {
    throw new Error(
      'decryptHealthData: malformed input — expected format "iv:encryptedHex" but no ":" separator found.',
    );
  }

  const ivHex = encrypted.slice(0, colonIndex);
  const encryptedHex = encrypted.slice(colonIndex + 1);

  if (ivHex.length !== IV_LENGTH * 2) {
    throw new Error(
      `decryptHealthData: IV must be ${IV_LENGTH * 2} hex chars, got ${ivHex.length}.`,
    );
  }

  if (!/^[0-9a-fA-F]+$/.test(ivHex)) {
    throw new Error('decryptHealthData: IV contains non-hex characters.');
  }
  if (!/^[0-9a-fA-F]+$/.test(encryptedHex)) {
    throw new Error('decryptHealthData: ciphertext contains non-hex characters.');
  }

  let iv: Buffer;
  let ciphertext: Buffer;
  try {
    iv = Buffer.from(ivHex, 'hex');
    ciphertext = Buffer.from(encryptedHex, 'hex');
  } catch (error) {
    throw new Error(
      'decryptHealthData: failed to decode hex — ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }

  if (ciphertext.length === 0) {
    throw new Error('decryptHealthData: ciphertext is empty.');
  }

  const key = getEncryptionKey();
  let plaintext: string;
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  } catch (error) {
    // Most common cause: wrong key (auth tag mismatch / padding error in CBC).
    throw new Error(
      'decryptHealthData: decryption failed — wrong key or corrupt ciphertext. ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }

  try {
    return JSON.parse(plaintext);
  } catch (error) {
    throw new Error(
      'decryptHealthData: decrypted payload was not valid JSON. ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }
}

// --------------------------------------------
// isEncrypted — cheap heuristic for "does this look like our wire format?"
// Useful for migrations where some rows are still plaintext.
// --------------------------------------------

const WIRE_FORMAT_REGEX = /^[0-9a-fA-F]{32}:[0-9a-fA-F]+$/;

/**
 * Cheap heuristic: returns true if the string matches the
 * "iv:encryptedHex" wire format produced by encryptHealthData.
 *
 * NOT a security check — only used to decide whether to attempt
 * decryption during a partial migration where some rows are
 * still plaintext.
 */
export function isEncryptedHealthData(value: unknown): value is string {
  return typeof value === 'string' && WIRE_FORMAT_REGEX.test(value);
}
