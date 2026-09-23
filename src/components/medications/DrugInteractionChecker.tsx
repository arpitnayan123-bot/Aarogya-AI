'use client';

// ============================================
// DrugInteractionChecker — Live medication interaction dashboard
//
// Props:
//   medications: string[]  — list of drug names in the patient's regimen
//
// Behavior:
//   • useEffect on `medications` change → POST /api/medications/check-interactions
//   • Loading skeleton while in-flight
//   • Green panel if zero interactions detected
//   • Color-coded cards: red=major, yellow=moderate, blue=minor
//   • Disclaimer pinned at the bottom
// ============================================

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'major' | 'moderate' | 'minor' | 'unknown';
  description: string;
  source?: string;
}

interface DrugInteractionCheckerProps {
  medications: string[];
}

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; interactions: DrugInteraction[] }
  | { status: 'error'; message: string };

const SEVERITY_STYLES: Record<
  DrugInteraction['severity'],
  { card: string; pill: string; label: string; icon: string }
> = {
  major: {
    card: 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40',
    pill: 'bg-red-600 text-white',
    label: 'Major',
    icon: '!',
  },
  moderate: {
    card:
      'border-yellow-300 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/40',
    pill: 'bg-yellow-500 text-white',
    label: 'Moderate',
    icon: '!',
  },
  minor: {
    card: 'border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40',
    pill: 'bg-blue-500 text-white',
    label: 'Minor',
    icon: 'i',
  },
  unknown: {
    card: 'border-gray-300 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40',
    pill: 'bg-gray-500 text-white',
    label: 'Unknown',
    icon: '?',
  },
};

export function DrugInteractionChecker({
  medications,
}: DrugInteractionCheckerProps) {
  const [state, setState] = React.useState<LoadState>({ status: 'idle' });

  React.useEffect(() => {
    if (!medications || medications.length < 2) {
      setState({ status: 'success', interactions: [] });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      try {
        const res = await fetch('/api/medications/check-interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medications }),
        });
        const data = (await res.json()) as
          | { success: true; interactions: DrugInteraction[] }
          | { success: false; error: string };

        if (cancelled) return;
        if (!res.ok || !data.success) {
          setState({
            status: 'error',
            message:
              (data as { success: false; error?: string }).error ??
              'Failed to check interactions',
          });
          return;
        }
        setState({
          status: 'success',
          interactions: data.interactions ?? [],
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          message:
            err instanceof Error ? err.message : 'Network error — please retry',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [medications]);

  const isLoading = state.status === 'loading';
  const isError = state.status === 'error';
  const interactions =
    state.status === 'success' ? state.interactions : [];
  const hasInteractions = interactions.length > 0;
  const majorCount = interactions.filter((i) => i.severity === 'major').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Drug Interactions</CardTitle>
          {state.status === 'success' && (
            <span
              className={
                'rounded-full px-3 py-1 text-xs font-semibold ' +
                (hasInteractions
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300')
              }
            >
              {hasInteractions
                ? `${interactions.length} found`
                : 'No interactions'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {medications.length < 2 && (
          <p className="text-sm text-muted-foreground">
            Add at least two medications to check for interactions.
          </p>
        )}

        {isLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {state.status === 'error' ? state.message : ''}
          </div>
        )}

        {state.status === 'success' && !hasInteractions && medications.length >= 2 && (
          <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                No interactions detected
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300">
                Cross-checked {medications.length} medications against RxNorm.
              </span>
            </div>
          </div>
        )}

        {state.status === 'success' && hasInteractions && (
          <div className="flex flex-col gap-2">
            {majorCount > 0 && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                {majorCount} major interaction{majorCount > 1 ? 's' : ''} require immediate clinical review.
              </div>
            )}
            {interactions.map((ix, idx) => {
              const styles = SEVERITY_STYLES[ix.severity];
              return (
                <div
                  key={`${ix.drug1}-${ix.drug2}-${idx}`}
                  className={
                    'flex flex-col gap-2 rounded-md border px-3 py-3 ' +
                    styles.card
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                      <span className="rounded bg-white/60 px-2 py-0.5 dark:bg-black/20">
                        {ix.drug1}
                      </span>
                      <span className="text-muted-foreground">+</span>
                      <span className="rounded bg-white/60 px-2 py-0.5 dark:bg-black/20">
                        {ix.drug2}
                      </span>
                    </div>
                    <span
                      className={
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ' +
                        styles.pill
                      }
                    >
                      <span className="h-4 w-4 rounded-full bg-white/30 text-center text-[10px] font-bold leading-4">
                        {styles.icon}
                      </span>
                      {styles.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ix.description}
                  </p>
                  {ix.source && (
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                      Source: {ix.source}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-1 border-t pt-3 text-[11px] text-muted-foreground">
          Always confirm with your pharmacist or doctor.
        </p>
      </CardContent>
    </Card>
  );
}

export default DrugInteractionChecker;
