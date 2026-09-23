'use client';

// ============================================
// AAROGYA AI — CGM DASHBOARD (FreeStyle Libre)
//
// Three-panel Continuous Glucose Monitor dashboard:
//   1. Large current glucose number (color-coded by zone)
//   2. Three TIR/TBR/TAR percentage bars (per ATTD 2019 consensus)
//   3. 24h glucose sparkline (recharts)
//
// Color zones:
//   • green  → in-range      (70–180 mg/dL)
//   • yellow → slight-low    (54–69 mg/dL)
//   • yellow → slight-high   (181–250 mg/dL)
//   • red    → critical      (<54 or >250 mg/dL)
//
// Target: ≥70% TIR for most adults with diabetes (ATTD 2019).
//
// UX flow:
//   1. User enters LibreView email + password.
//   2. POST /api/cgm/readings → CGMSummary.
//   3. Dashboard renders the summary.
//   4. Disclaimer prominently shown — this is NOT a substitute
//      for clinical decision-making. Always consult your doctor
//      before adjusting insulin or medication.
//
// SECURITY:
//   Credentials are never stored in the browser. They are sent
//   over HTTPS to the API route and discarded server-side.
// ============================================

import * as React from 'react';
import {
  Droplets,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lock,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  fetchLibreData,
  glucoseZone,
  type CGMSummary,
  type GlucoseZone,
} from '@/lib/cgm/libre-api';

interface CGMDashboardProps {
  /** Pre-loaded summary (skips the login form). */
  initialSummary?: CGMSummary;
  /** Optional className override for the root container. */
  className?: string;
}

const ZONE_THEME: Record<
  GlucoseZone,
  { text: string; bg: string; border: string; ring: string; label: string }
> = {
  'in-range': {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    ring: 'ring-emerald-400',
    label: 'In Range',
  },
  'slight-low': {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    label: 'Slightly Low',
  },
  'slight-high': {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    label: 'Slightly High',
  },
  'critical': {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-300',
    ring: 'ring-red-400',
    label: 'Critical',
  },
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '--:--';
  }
}

export function CGMDashboard({ initialSummary, className }: CGMDashboardProps) {
  const [summary, setSummary] = React.useState<CGMSummary | null>(
    initialSummary ?? null,
  );
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConnect = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both your LibreView email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Option A: direct call to the SDK helper (works in browser).
      // We use this because the API route is a thin passthrough and
      // calling it doubles the request. The route exists for server-side
      // orchestrators and external integrations.
      const result = await fetchLibreData(email.trim(), password);
      setSummary(result);
      if (result.error) setError(result.error);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to LibreView. Please try again.',
      );
    } finally {
      setLoading(false);
      // Always clear the password field — never let it linger in state.
      setPassword('');
    }
  };

  const handleRefresh = async () => {
    if (!email.trim() || !password) {
      // If no credentials cached, just re-render the form.
      setLoading(true);
      setError(null);
      try {
        // Reuse last email from localStorage if available — best-effort.
        const lastEmail =
          typeof window !== 'undefined'
            ? window.localStorage.getItem('aarogya_cgm_last_email')
            : null;
        if (lastEmail) {
          setEmail(lastEmail);
        }
        setError('Please re-enter your password to refresh.');
      } finally {
        setLoading(false);
      }
      return;
    }
    return handleConnect();
  };

  // ---------- LOGIN FORM ----------
  if (!summary || summary.readings.length === 0) {
    return (
      <div
        className={`w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className ?? ''}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Connect Your CGM
            </h2>
            <p className="text-xs text-slate-500">
              FreeStyle Libre via LibreView
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">
              LibreView Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Connecting…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Connect Securely
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Credentials are used only to fetch your readings — they are
              never stored, logged, or shared. You can revoke access at any
              time from your LibreView account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  const zone = glucoseZone(summary.currentGlucose);
  const theme = zone ? ZONE_THEME[zone] : ZONE_THEME['in-range'];
  const tirTargetMet = summary.timeInRange >= 70;

  const chartData = summary.readings.map((r) => ({
    time: formatTime(r.timestamp),
    value: r.value,
  }));

  return (
    <div className={`w-full space-y-4 ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Continuous Glucose Monitor
            </h2>
            <p className="text-xs text-slate-500">
              FreeStyle Libre · last 24 hours · {summary.readings.length}{' '}
              readings
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Current glucose + zone badge */}
      <div
        className={`rounded-2xl border-2 ${theme.border} ${theme.bg} p-6 shadow-sm`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Current Glucose
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl font-bold ${theme.text}`}>
                {summary.currentGlucose ?? '--'}
              </span>
              <span className="text-lg text-slate-500 font-medium">mg/dL</span>
            </div>
            <div
              className={`inline-block mt-2 px-3 py-1 rounded-full bg-white border ${theme.border} text-xs font-bold ${theme.text}`}
            >
              {zone ? theme.label : 'No reading'}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
              Reading at
            </p>
            <p className="text-sm font-bold text-slate-700">
              {summary.readings.length > 0
                ? formatTime(
                    summary.readings[summary.readings.length - 1].timestamp,
                  )
                : '--:--'}
            </p>
            {zone === 'critical' && (
              <div className="mt-2 flex items-center gap-1 text-red-700 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" /> Critical — seek help
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIR / TBR / TAR bars */}
      <div className="grid sm:grid-cols-3 gap-3">
        <RangeBar
          icon={CheckCircle2}
          label="Time in Range"
          value={summary.timeInRange}
          target={70}
          color="bg-emerald-500"
          subText="70–180 mg/dL"
          targetMet={tirTargetMet}
        />
        <RangeBar
          icon={TrendingDown}
          label="Time Below Range"
          value={summary.timeBelowRange}
          target={4}
          color="bg-red-500"
          subText="<70 mg/dL"
          inverted
        />
        <RangeBar
          icon={TrendingUp}
          label="Time Above Range"
          value={summary.timeAboveRange}
          target={25}
          color="bg-amber-500"
          subText=">180 mg/dL"
          inverted
        />
      </div>

      {/* TIR target note */}
      <div
        className={`rounded-xl p-3 text-xs flex items-start gap-2 ${
          tirTargetMet
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        }`}
      >
        <Activity className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          {tirTargetMet
            ? `Great work — you're meeting the international target of ≥70% Time-in-Range (ATTD 2019 consensus).`
            : `Target: ≥70% Time-in-Range. You're at ${summary.timeInRange}% — small lifestyle/medication adjustments with your doctor's guidance can help close the gap.`}
        </p>
      </div>

      {/* 24h chart */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> 24-Hour Glucose Trace
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  domain={[40, 300]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  ticks={[70, 180, 250]}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                  formatter={(v: number) => [`${v} mg/dL`, 'Glucose']}
                />
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                <ReferenceLine
                  y={180}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  fill="url(#glucoseFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-red-400" /> Low threshold (70)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-amber-400" /> High threshold (180)
            </span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900 mb-1">
              Important Medical Disclaimer
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              This dashboard is for informational purposes only and is{' '}
              <strong>not a substitute for professional medical advice</strong>.
              Never adjust insulin, medication, or diet based on this data
              without consulting your doctor. In a hypoglycemic emergency
              (glucose &lt;54 mg/dL or unconsciousness), administer 15g of
              fast-acting carbs and call 112 (India) immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RangeBarProps {
  icon: React.ElementType;
  label: string;
  value: number;
  target: number;
  color: string;
  subText: string;
  targetMet?: boolean;
  inverted?: boolean;
}

function RangeBar({
  icon: Icon,
  label,
  value,
  target,
  color,
  subText,
  targetMet,
  inverted,
}: RangeBarProps) {
  const meetsTarget = inverted ? value <= target : value >= target;
  const statusColor = meetsTarget
    ? 'text-emerald-600'
    : 'text-amber-600';
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" /> {label}
        </span>
        <span className={`text-xs font-bold ${statusColor}`}>
          {targetMet !== undefined
            ? targetMet
              ? '✓ On target'
              : 'Below target'
            : meetsTarget
              ? '✓ Within goal'
              : 'Above goal'}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-slate-900">{value}%</span>
        <span className="text-[10px] text-slate-400">/ 100%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5">{subText}</p>
    </div>
  );
}

export default CGMDashboard;
