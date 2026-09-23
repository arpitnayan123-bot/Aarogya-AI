# Task 3b — full-stack-developer

## Task
Build 3 premium Aarogya AI components in `/home/z/my-project/src/components/aarogya/`:
1. **AIChat.tsx** — AI Companion chat (real AI via `/api/ai/chat`, multi-session, localStorage, emerald/teal)
2. **SymptomChecker.tsx** — Clinical symptom analysis (real AI via `/api/ai/symptom`, bilingual, scan animation)
3. **CommandPalette.tsx** — Cmd+K palette (glass-morphism, keyboard nav)

## Context Review
- Read `/home/z/my-project/worklog.md` — foundation laid by Agent 1 (design system in globals.css, types in `@/types/aarogya`, AI orchestrator, Prisma, 7 AI API routes). Agent 3a delivered Landing/Dashboard/AarogyaLogo/DNABackground.
- Read original Vite sources in `/home/z/my-project/upload/aarogya-source/src/components/` for design intent.
- Read `@/types/aarogya.ts`, `@/data/aiSimulator.ts`, `@/data/symptomDatabase.ts`, `@/app/api/ai/{chat,symptom}/route.ts`, `@/lib/ai/safety.ts`, `@/app/globals.css` for available primitives.
- Available CSS utilities: `animate-fadeIn`, `animate-fadeInScale`, `animate-spinRing`, `animate-pulseGlow`, `gradient-text-emerald`, `glass`, `scan-line`, `scrollbar-slim`, urgency-*, status-* badges.

## Work Log

### CommandPalette.tsx (~11 KB)
- `'use client'`, props `{ open, onClose, items, onSelect }`, `CommandItem` exported interface `{ id, label, group, emoji, icon?, keywords? }`.
- Premium glass-morphism overlay: `bg-white/80 backdrop-blur-2xl` with emerald/teal gradient blobs and a 0.18s `animate-fadeInScale`.
- **Grouped results**: filtered items are bucketed by `group` and rendered with section headers — far nicer than the flat list in the original Vite source.
- **Keyboard nav**: ArrowUp/Down wraps around, Enter selects active item, Escape closes. Active item gets gradient highlight + ring + auto-scroll into view via `[data-idx]` selector.
- **Render-time state sync** (not setState-in-effect) — fixes the `react-hooks/set-state-in-effect` lint error using the official React pattern (`prevOpen` / `prevQuery` tracking).
- Body scroll lock while open + restored on close.
- Footer bar shows kbd hints (↑/↓ navigate, ⏎ select, ESC close).

### AIChat.tsx (~26 KB)
- `'use client'`, props `{ metrics, setTab }`.
- **Multi-session chat**: default welcome session, "New Consultation" button, per-session delete (keeps at least one). Sessions persisted to `localStorage` under `aarogya_chat_sessions_v1`.
- **SSR-safe**: initial state seeded with default session, hydrates from localStorage in `useEffect` (no `window` access during render — no hydration mismatch).
- **Real AI integration** via `fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, context: { metrics, age, gender, conversationHistory } }) })`. Builds a 6-message rolling context window from the active session for conversational memory.
- **Graceful fallback**: on any API failure (network, non-OK status, empty `data.response`), falls back to `simulateHealthChatReply(message, metrics)` from `@/data/aiSimulator` and stamps the message with an "Offline mode" badge + 70% confidence so the user is never blocked.
- **Confidence badge**: every AI message renders `{confidence}% confidence` pill (emerald) when `data.confidence` is present.
- **Emergency disclaimer**: when `safetyFlags` includes `emergency_symptom`, a red `AlertTriangle` banner is shown below the AI bubble with emergency numbers (112 India / 911 US).
- **Suggestion chips**: welcome message ships 4 suggestions; clicking smart-routes via `setTab('diet_plan' | 'appointments' | 'symptom_checker' | 'mental_health' | 'lab_report')` or sends as a new message.
- **Emerald/teal theme**: replaced the original indigo/violet user bubbles with `from-emerald-600 to-teal-700`. AI bubbles use white with teal icon avatars. Chat header is `from-emerald-600 via-teal-600 to-cyan-700`.
- **Multi-line input**: textarea with auto-grow (min 48px, max 140px). Enter sends, Shift+Enter for newline — documented in placeholder.
- **Auto-scroll** to bottom on new messages / typing indicator.
- **Lite Markdown renderer** (no deps): bold `**text**` becomes emerald-bold; bullet lines get a `•` prefix. Avoids pulling in a markdown lib.
- **Mobile responsive**: sidebar hidden on mobile, replaced with a "Sessions" dropdown in the chat header.
- **Typing indicator**: 3 bouncing emerald dots + "Aarogya AI is thinking…" caption.

### SymptomChecker.tsx (~45 KB)
- `'use client'`, props `{ onBookDoctor?, age?, gender? }` (age/gender default to 30/'unspecified' since the task spec calls for `context: { age, gender }` but only `onBookDoctor` is in the original props).
- **Real AI integration** via `fetch('/api/ai/symptom', { method: 'POST', body: JSON.stringify({ symptoms, context: { age, gender } }) })`. Response is defensively normalized to the `SymptomAnalysis` type from `@/types/aarogya` (every field has a fallback) so partial AI outputs don't crash the UI.
- **Scan animation during analysis**: uses the existing `.scan-line` class from globals.css plus a `from-emerald-50/50 via-transparent to-teal-50/50 animate-pulseGlow` overlay, a spinning emerald/teal ring (`.animate-spinRing`) wrapping a pulsing `Activity` icon, and a 3-stage checklist (NER Extraction / Clinical Reasoning / Safety Check) that pops in with staggered delays via a scoped `nxStagePop` keyframe.
- **Minimum 900ms delay** via `Promise.all([fetch, minDelay])` so even fast AI responses get the scan animation presence — feels clinical and intentional, not jumpy.
- **Local NER display**: inline `extractEntities()` function detects symptom / body_part / severity / duration / medication entities with deterministic (non-random) confidence scores so SSR matches client. Entities rendered as color-coded chips with mini progress bars showing confidence %.
- **Local database matching**: `findSymptomEntry(symptomText)` from `@/data/symptomDatabase` powers a premium dark "Matched Symptom · Indian Healthcare Dataset" card with severity badge, avg duration, region, language count, disease count, and condition chips.
- **Bilingual summaries**: side-by-side English (emerald) + Hindi (teal) cards. Hindi card has a show/hide toggle and `lang="hi"` for proper rendering.
- **Urgency banner** with 4 levels (routine/within_week/urgent/emergency) using the `URGENCY_CONFIG` map — color-coded badges with appropriate icons (CheckCircle2/AlertCircle/AlertTriangle/ShieldAlert).
- **Emergency banner**: when `urgency === 'emergency'` OR `safetyFlags.includes('emergency_symptom')`, a prominent red banner with emergency numbers is shown at the top of the analysis card.
- **Structured results sections**: Possible Conditions (with `low/moderate/high` probability pills + reasoning), Red Flags (red grid), Home Care (emerald grid with 🌿), When to See a Doctor (emerald checklist), Suggested Tests (cyan checklist), Recommended Specialty (gradient card with Book Doctor button calling `onBookDoctor`).
- **Confidence badge**: color-coded (emerald ≥85%, amber ≥70%, red <70%) next to the urgency badge in the analysis header.
- **Medical disclaimer** prominently displayed in an amber card at the bottom alongside a "Check New Symptoms" reset button.
- **Error retry**: on API failure, an inline red panel with a "Retry analysis" button — no full-state reset, user keeps their input.
- **Model info panel**: collapsible emerald/teal card showing IndicNER metadata (languages, base model, training data, license).
- **Emerald/teal primary throughout** (per spec — no indigo/blue). Red/amber/orange only used for clinically meaningful urgency/warning indicators.

### Verification
- `ls -la /home/z/my-project/src/components/aarogya/` confirms all 3 files exist (AIChat 26KB, CommandPalette 11KB, SymptomChecker 45KB).
- `bun run lint` — clean, zero errors (after fixing 2 `react-hooks/set-state-in-effect` violations in CommandPalette via render-time state sync).
- `dev.log` — dev server compiling successfully (`✓ Compiled in ~5s`), no errors.

## Stage Summary
3 production-quality Aarogya components delivered:

| File | Size | Real AI | Theme | Key features |
|---|---|---|---|---|
| `CommandPalette.tsx` | 11 KB | n/a | Glass + emerald/teal accents | Grouped results, full keyboard nav, render-time state sync, body scroll lock |
| `AIChat.tsx` | 26 KB | `/api/ai/chat` | Emerald/teal gradient | Multi-session + localStorage, simulator fallback, confidence badge, emergency disclaimer, multi-line input, markdown-lite |
| `SymptomChecker.tsx` | 45 KB | `/api/ai/symptom` | Emerald/teal + clinical urgency colors | Local NER + DB matching, scan animation, bilingual summaries, 4-level urgency, red flags, home care, suggested tests, book-doctor CTA, retry on error |

- All 3 are `'use client'`, use `lucide-react` icons, import from `@/types/aarogya` / `@/data/*` only (no new dependencies).
- All `fetch` calls use **relative paths** (`/api/ai/chat`, `/api/ai/symptom`) — no absolute URLs, no port hardcoding.
- **Zero modifications to `globals.css`** — every custom animation (`nxStagePop`) is in a scoped `<style jsx>` block, eliminating merge conflicts with parallel agents.
- SSR-safe: no `window`/`localStorage` access during render; deterministic entity confidence scores (no `Math.random()` in render path).
- Ready to be composed by the main page: `import { AIChat } from '@/components/aarogya/AIChat'`, `import { SymptomChecker } from '@/components/aarogya/SymptomChecker'`, `import { CommandPalette } from '@/components/aarogya/CommandPalette'`.
