// ============================================
// AAROGYA AI — AUDIT LOGGER
//
// Append-only in-memory audit log for security-relevant
// events across the platform (consent changes, AI calls,
// data exports, access to PHI, etc.).
//
// Design goals:
//   • NEVER throws to caller — audit failures must not break
//     the request path of the action being audited.
//   • Bounded memory footprint (max 1000 entries, FIFO eviction).
//   • Trivially swappable backing store (just replace the array
//     push with a DB write / call to a SIEM forwarder).
//
// NOTE: In-memory storage is ephemeral — it resets on every
// serverless cold start. For production durability, write to
// Prisma (AuditEvent model) or ship to an external SIEM
// (Splunk, Datadog, AWS CloudTrail Lake). The interface here
// is intentionally storage-agnostic so the swap is localized.
// ============================================

// --------------------------------------------
// Types
// --------------------------------------------

/**
 * JSON-serializable value — used to constrain audit metadata so the
 * log can always be safely serialized to JSON / shipped to a SIEM.
 */
export type AuditJsonValue =
  | string
  | number
  | boolean
  | null
  | AuditJsonValue[]
  | { [key: string]: AuditJsonValue };

/**
 * A single audit event. `metadata` is an open bag for action-specific
 * context (e.g. consent decisions, AI prompt hashes, exported resource IDs).
 */
export interface AuditEvent {
  /** Actor performing the action. Anonymous/system = 'system'. */
  userId: string;
  /** Verb describing the action — e.g. 'consent.grant', 'phi.read', 'ai.symptom.call'. */
  action: string;
  /** Type of resource affected — 'user', 'consent_record', 'health_metric', 'lab_report', etc. */
  resourceType: string;
  /** Optional ID of the specific resource instance. */
  resourceId?: string;
  /** Originating IP, captured from x-forwarded-for when available. */
  ipAddress?: string;
  /** User-Agent string of the calling client. */
  userAgent?: string;
  /** Action-specific structured context. Must be JSON-serializable. */
  metadata?: Record<string, AuditJsonValue>;
}

/**
 * Internal stored record — AuditEvent plus an immutable server-side
 * timestamp and a monotonically increasing sequence number.
 */
interface StoredAuditEntry extends AuditEvent {
  /** ISO-8601 timestamp set by the logger, NOT the caller. */
  timestamp: string;
  /** Monotonic sequence number, useful for ordering across concurrent writes. */
  sequence: number;
}

// --------------------------------------------
// In-memory log + cap
// --------------------------------------------

const MAX_ENTRIES = 1000;
const _auditLog: StoredAuditEntry[] = [];
let _sequence = 0;

// --------------------------------------------
// logAuditEvent
// --------------------------------------------

/**
 * Append an audit event to the log.
 *
 * This function NEVER throws — if anything goes wrong (e.g. the value
 * cannot be serialized, the backing store is unreachable), it logs a
 * warning to stderr and returns silently. Audit logging is best-effort
 * and must never break the request path of the action being audited.
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    // Defensive copy of metadata to avoid caller mutation after logging.
    const stored: StoredAuditEntry = {
      ...event,
      metadata: event.metadata ? { ...event.metadata } : undefined,
      timestamp: new Date().toISOString(),
      sequence: ++_sequence,
    };

    // FIFO eviction — once we hit the cap, drop the oldest entry
    // before pushing the new one so we stay at exactly MAX_ENTRIES.
    if (_auditLog.length >= MAX_ENTRIES) {
      _auditLog.shift();
    }
    _auditLog.push(stored);
  } catch (error) {
    // NEVER rethrow — caller's request must not fail because of audit.
    console.warn(
      '[audit-logger] failed to record audit event:',
      event.action,
      error instanceof Error ? error.message : String(error),
    );
  }
}

// --------------------------------------------
// getAuditLog
// --------------------------------------------

/**
 * Read-only accessor for the in-memory audit log. Returns a shallow
 * copy so callers can iterate / filter without mutating the source.
 *
 * Intended for testing, debugging, and admin dashboards. NOT exposed
 * to untrusted clients — wrap behind an authenticated admin route.
 */
export function getAuditLog(): StoredAuditEntry[] {
  // Return a copy so callers can sort/filter freely without touching
  // the internal array.
  return [..._auditLog];
}

/**
 * Clear the in-memory audit log. Test-only helper.
 */
export function clearAuditLogForTesting(): void {
  _auditLog.length = 0;
  _sequence = 0;
}

/**
 * Current entry count — useful for capacity monitoring.
 */
export function getAuditLogSize(): number {
  return _auditLog.length;
}
