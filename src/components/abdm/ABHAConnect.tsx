'use client';

// ============================================
// ABHAConnect — Patient ABHA number connect card
//
// UX flow:
//   1. Patient enters 14-digit ABHA number
//   2. POST /api/abdm/connect → verifies via ABDM gateway
//   3. Success: patient name + ABHA badge
//   4. Error: friendly message
//
// Uses shadcn/ui primitives for design consistency.
// ============================================

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ABHAPatientProfile {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  gender?: string;
  yearOfBirth?: number;
  district?: string;
  state?: string;
  healthIdStatus?: string;
}

type ConnectState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; profile: ABHAPatientProfile }
  | { status: 'error'; message: string };

export function ABHAConnect() {
  const [abhaNumber, setAbhaNumber] = React.useState('');
  const [state, setState] = React.useState<ConnectState>({ status: 'idle' });

  const handleConnect = async () => {
    const trimmed = abhaNumber.trim();
    if (!trimmed) {
      setState({ status: 'error', message: 'Please enter your ABHA number' });
      return;
    }

    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/abdm/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abhaNumber: trimmed }),
      });
      const data = (await res.json()) as
        | { success: true; profile: ABHAPatientProfile }
        | { success: false; error: string };

      if (!res.ok || !data.success) {
        const message =
          (data as { success: false; error?: string }).error ??
          'Failed to verify ABHA number';
        setState({ status: 'error', message });
        return;
      }

      setState({ status: 'success', profile: data.profile });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Network error — please retry';
      setState({ status: 'error', message });
    }
  };

  const handleReset = () => {
    setAbhaNumber('');
    setState({ status: 'idle' });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect ABHA</CardTitle>
        <CardDescription>
          Link your Ayushman Bharat Health Account to import records securely
          via ABDM.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {state.status === 'success' ? (
          <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  ABHA Connected
                </span>
                <span className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  {state.profile.name || 'Patient'}
                </span>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                ABHA Verified
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-emerald-800 dark:text-emerald-200">
              <span className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/60">
                {state.profile.abhaAddress || state.profile.abhaNumber}
              </span>
              {state.profile.gender && (
                <span className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/60">
                  {state.profile.gender}
                </span>
              )}
              {state.profile.yearOfBirth && (
                <span className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/60">
                  YOB: {state.profile.yearOfBirth}
                </span>
              )}
              {state.profile.district && (
                <span className="rounded-md bg-emerald-100 px-2 py-1 dark:bg-emerald-900/60">
                  {state.profile.district}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-1 self-start"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="abha-input"
                className="text-sm font-medium text-foreground"
              >
                ABHA Number
              </label>
              <Input
                id="abha-input"
                placeholder="14-digit ABHA number"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                disabled={state.status === 'loading'}
                inputMode="numeric"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Find your ABHA on the ABDM app or via abdm.gov.in.
              </p>
            </div>

            {state.status === 'error' && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {state.message}
              </div>
            )}

            <Button
              onClick={handleConnect}
              disabled={state.status === 'loading'}
            >
              {state.status === 'loading' ? 'Verifying…' : 'Connect ABHA'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ABHAConnect;
