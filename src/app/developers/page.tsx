// ============================================
// AAROGYA AI — DEVELOPERS / OPEN-SOURCE AYURVEDA API
//
// Server component (no 'use client'). Static SSR.
// Sections:
//   • Hero — "Build with the open Ayurveda API"
//   • Endpoint + sample curl command
//   • Request & response format
//   • Rate limits
//   • GitHub repo link + contribution call-to-action
// ============================================

import type { Metadata } from 'next';
import {
  Code2,
  Terminal,
  Github,
  BookOpen,
  Gauge,
  ShieldCheck,
  HeartPulse,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developers — Aarogya AI Open Ayurveda API',
  description:
    'India\'s first open-source Ayurvedic intelligence API. POST a query + optional Prakriti, receive a classical-grounded answer. 10 requests/hour, Apache-2.0.',
};

const GITHUB_URL = 'https://github.com/aarogyaai/ayurveda-api';
const API_ENDPOINT = '/api/public/ayurveda';

const sampleCurl = `curl -X POST https://aarogya.ai${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What does Charaka say about managing early-stage Type 2 diabetes (Prameha)?",
    "prakriti": "kapha"
  }'`;

const sampleResponse = `{
  "success": true,
  "response": "Charaka Samhita, Chikitsa Sthana 6, classifies Prameha ...",
  "disclaimer": "This is educational Ayurvedic information, not medical advice. Consult a BAMS doctor for personal treatment.",
  "powered_by": "Aarogya AI Open Ayurveda API v1.0",
  "rate_limit": "10 requests/hour"
}`;

const knowledgeSources = [
  'Charaka Samhita',
  'Sushruta Samhita',
  'Ashtanga Hridayam',
  'CCRAS Clinical Guidelines',
  'AYUSH Ministry Protocols',
];

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              Aarogya AI · Developers
            </h1>
            <p className="text-xs text-slate-500">
              Open-source Ayurvedic intelligence API
            </p>
          </div>
          <a
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
          >
            ← Back to app
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Open Source · Apache 2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Build with the{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              open Ayurveda API
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            India&apos;s first open-source Ayurvedic intelligence API. POST a
            question and an optional <strong>Prakriti</strong> constitution,
            receive a classical-grounded answer trained on Charaka Samhita,
            Sushruta Samhita, and Ashtanga Hridayam. Free, self-hostable, and
            built for Bharat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 transition"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#quickstart"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Terminal className="h-4 w-4" />
              Quick start
            </a>
          </div>
        </section>

        {/* Knowledge sources strip */}
        <section className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Knowledge sources
            </div>
            <div className="flex flex-wrap gap-2">
              {knowledgeSources.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section id="quickstart" className="space-y-5 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Endpoint &amp; quick start
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                Endpoint
              </p>
              <code className="mt-1 block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-mono text-emerald-300">
                POST {API_ENDPOINT}
              </code>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                Sample request (cURL)
              </p>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm font-mono leading-relaxed text-slate-100">
                <code>{sampleCurl}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                Sample response (200 OK)
              </p>
              <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-50 p-4 text-sm font-mono leading-relaxed text-slate-700 ring-1 ring-emerald-100">
                <code>{sampleResponse}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Request & response schema */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Request &amp; response schema
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Request body</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <p className="font-mono text-emerald-700">query</p>
                  <p className="text-slate-600">
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                      required
                    </span>{' '}
                    · string · Your Ayurvedic question (≥ 3 characters, up to
                    1500 chars used).
                  </p>
                </li>
                <li>
                  <p className="font-mono text-emerald-700">prakriti</p>
                  <p className="text-slate-600">
                    <span className="rounded bg-sky-100 px-1.5 py-0.5 text-xs font-semibold text-sky-800">
                      optional
                    </span>{' '}
                    · string · One of:{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      vata
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      pitta
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      kapha
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      vata-pitta
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      pitta-kapha
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      vata-kapha
                    </code>
                    ,{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      tridosha
                    </code>
                    . Personalizes the recommendation.
                  </p>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Response (200)</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <p className="font-mono text-emerald-700">success</p>
                  <p className="text-slate-600">boolean · true on success.</p>
                </li>
                <li>
                  <p className="font-mono text-emerald-700">response</p>
                  <p className="text-slate-600">
                    string · Ayurvedic answer in the user&apos;s language.
                  </p>
                </li>
                <li>
                  <p className="font-mono text-emerald-700">disclaimer</p>
                  <p className="text-slate-600">
                    string · Fixed educational disclaimer (always present).
                  </p>
                </li>
                <li>
                  <p className="font-mono text-emerald-700">powered_by</p>
                  <p className="text-slate-600">
                    string ·{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      Aarogya AI Open Ayurveda API v1.0
                    </code>
                    . Required attribution in derivative apps.
                  </p>
                </li>
                <li>
                  <p className="font-mono text-emerald-700">rate_limit</p>
                  <p className="text-slate-600">
                    string ·{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                      10 requests/hour
                    </code>
                    .
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rate limits */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Rate limits
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-emerald-600">10</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 font-semibold">
                  Requests / hour / IP
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">429</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 font-semibold">
                  HTTP status when exceeded
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">1 h</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400 font-semibold">
                  Sliding window
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Rate-limit info is also surfaced via the{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                X-RateLimit-Limit
              </code>
              ,{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                X-RateLimit-Remaining
              </code>
              , and{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                Retry-After
              </code>{' '}
              response headers. Higher quotas are available to authenticated
              partners —{' '}
              <a
                href="mailto:research@aarogyaai.in?subject=Ayurveda%20API%20—%20higher%20rate%20limit"
                className="text-emerald-700 underline"
              >
                contact us
              </a>
              .
            </p>
          </div>
        </section>

        {/* Safety & license */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-semibold">Safety &amp; scope</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-amber-900 leading-relaxed list-disc pl-5">
              <li>Educational only — never prescribe or dose-treat serious illness.</li>
              <li>Herb-drug interactions are flagged automatically.</li>
              <li>Acute emergencies are routed to 112 before any Ayurvedic commentary.</li>
              <li>
                Every response ships with a fixed disclaimer directing users to
                a BAMS doctor.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
              <HeartPulse className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold">License &amp; attribution</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Released under the{' '}
              <strong className="text-emerald-700">Apache License 2.0</strong>.
              Derivative apps must preserve the{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                powered_by
              </code>{' '}
              attribution string and the educational disclaimer. Built for
              Bharat.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Github className="h-4 w-4" />
              github.com/aarogyaai/ayurveda-api
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-100 pt-6 text-xs text-slate-500 text-center">
          <p>
            Aarogya AI Open Ayurveda API v1.0 · Apache 2.0 · Built for Bharat ·{' '}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline"
            >
              contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
