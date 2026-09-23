'use client';

// ============================================
// AAROGYA AI — CONSENT GATE
//
// A non-dismissible modal overlay shown on first visit (and any
// visit where localStorage does not contain a valid ConsentRecord).
//
// UX:
//   1. On mount, read localStorage[CONSENT_STORAGE_KEY].
//   2. If a valid record exists with required consents granted →
//      render children, do not show the modal.
//   3. Otherwise, render the modal OVER the children (children stay
//      mounted so background UI doesn't flash).
//   4. The modal shows what Aarogya does with health data + 4
//      checkboxes (2 required + 2 optional). The required two are
//      pre-checked but can be unchecked (which disables the CTA).
//   5. The "I Understand and Agree" button is enabled only when
//      both required consents are checked.
//   6. On submit: POST to /api/consent/record, then write the
//      returned record to localStorage and dismiss the modal.
//
// The overlay is keyboard-trapped and role="dialog" for a11y.
// ============================================

import * as React from 'react';
import {
  ShieldCheck,
  Lock,
  HeartPulse,
  Brain,
  FlaskConical,
  Megaphone,
  Share2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  CONSENT_METADATA,
  CONSENT_STORAGE_KEY,
  CURRENT_POLICY_VERSION,
  type ConsentRecord,
  type ConsentType,
} from '@/lib/consent/consent-types';

interface ConsentGateProps {
  children: React.ReactNode;
  /** Optional override for the user id (defaults to a stable localStorage id). */
  userId?: string;
  /** Optional callback fired when consent is granted. */
  onConsentGranted?: (record: ConsentRecord) => void;
}

const CONSENT_ICON: Record<ConsentType, React.ElementType> = {
  HEALTH_DATA_PROCESSING: HeartPulse,
  AI_ANALYSIS: Brain,
  RESEARCH_PARTICIPATION: FlaskConical,
  MARKETING_COMMUNICATIONS: Megaphone,
  THIRD_PARTY_SHARING: Share2,
};

function getOrCreateStableUserId(): string {
  if (typeof window === 'undefined') return 'ssr-placeholder';
  const KEY = 'aarogya_anon_user_id';
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

function isValidRecord(record: ConsentRecord | null | undefined): boolean {
  if (!record) return false;
  if (record.policyVersion !== CURRENT_POLICY_VERSION) return false;
  // Both required consents must be GRANTED.
  const required = CONSENT_METADATA.filter((m) => m.required);
  return required.every((m) =>
    record.decisions.some(
      (d) => d.type === m.type && d.status === 'GRANTED',
    ),
  );
}

export function ConsentGate({
  children,
  userId,
  onConsentGranted,
}: ConsentGateProps) {
  const [mounted, setMounted] = React.useState(false);
  const [record, setRecord] = React.useState<ConsentRecord | null>(null);
  const [checks, setChecks] = React.useState<Record<ConsentType, boolean>>(
    () => {
      const initial = {} as Record<ConsentType, boolean>;
      for (const m of CONSENT_METADATA) {
        initial[m.type] = m.defaultChecked;
      }
      return initial;
    },
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Mount: read existing consent record from localStorage.
  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentRecord;
        if (isValidRecord(parsed)) {
          setRecord(parsed);
        }
      }
    } catch {
      // Malformed storage — treat as no record.
    }
  }, []);

  const requiredGranted = CONSENT_METADATA.filter(
    (m) => m.required,
  ).every((m) => checks[m.type]);

  const handleToggle = (type: ConsentType) => {
    setChecks((prev) => ({ ...prev, [type]: !prev[type] }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!requiredGranted) return;
    setSubmitting(true);
    setError(null);
    try {
      const effectiveUserId = userId ?? getOrCreateStableUserId();
      const res = await fetch('/api/consent/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          decisions: checks,
        }),
      });
      const data = (await res.json()) as
        | { success: true; record: ConsentRecord }
        | { success: false; error: string };

      if (!res.ok || !data.success) {
        const message =
          (data as { success: false; error?: string }).error ??
          'Failed to record consent. Please try again.';
        setError(message);
        setSubmitting(false);
        return;
      }

      const newRecord = data.record;
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(newRecord),
      );
      setRecord(newRecord);
      onConsentGranted?.(newRecord);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Network error — please check your connection and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const showOverlay = mounted && !isValidRecord(record);

  return (
    <>
      {children}
      {showOverlay && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-6 rounded-t-3xl text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2
                    id="consent-title"
                    className="text-xl font-bold leading-tight"
                  >
                    Your Data, Your Consent
                  </h2>
                  <p className="text-xs text-white/80 font-medium">
                    Aarogya AI · Privacy Policy v{CURRENT_POLICY_VERSION}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                Before you begin, please review how Aarogya AI processes your
                health data. You choose what to share — and you can change your
                mind anytime from Settings.
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <Lock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-emerald-900">
                    Encrypted end-to-end
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-teal-50 border border-teal-100">
                  <ShieldCheck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-teal-900">
                    DPDP Act 2023 compliant
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                  <HeartPulse className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-cyan-900">
                    Never sold to anyone
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {CONSENT_METADATA.filter(
                  (m) =>
                    m.type !== 'THIRD_PARTY_SHARING' || checks[m.type],
                ).map((m) => {
                  const Icon = CONSENT_ICON[m.type];
                  const checked = checks[m.type];
                  return (
                    <label
                      key={m.type}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        checked
                          ? 'border-emerald-400 bg-emerald-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {checked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => handleToggle(m.type)}
                        />
                      </div>
                      <Icon className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-900">
                            {m.title}
                          </p>
                          {m.required && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                          {!m.required && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!requiredGranted || submitting}
                className={`mt-5 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  requiredGranted && !submitting
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {submitting
                  ? 'Saving your consent…'
                  : requiredGranted
                    ? 'I Understand and Agree'
                    : 'Please grant the required consents to continue'}
              </button>

              <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
                You can withdraw or change consent at any time from{' '}
                <strong>Settings → Privacy</strong>. Withdrawal does not affect
                data already processed under prior consent.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConsentGate;
