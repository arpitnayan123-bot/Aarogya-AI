// ============================================
// AAROGYA AI — PWA INSTALL PROMPT
//
// 'use client' component that:
//   • Listens for the browser's 'beforeinstallprompt' event
//   • Shows a bottom banner: "Install Aarogya AI — Works
//     offline, no App Store needed" with Later + Install
//     buttons
//   • Calls deferredPrompt.prompt() on Install click
//   • Hides after the user makes a choice (installs or
//     dismisses)
//   • Does NOT show if the app is already running in
//     standalone mode (i.e. already installed)
//
// Mount this once in the root layout to enable install
// banners across the app.
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { Download, X, WifiOff } from 'lucide-react';

// Minimal shape of the BeforeInstallPromptEvent —
// the DOM lib doesn't ship a stable type for it yet.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

// CSS media feature that returns 'standalone' when the
// page is running as an installed PWA.
function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari uses navigator.standalone
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed — never show the banner.
    if (isRunningStandalone()) return;

    const handler = (e: Event) => {
      // Chrome fires beforeinstallprompt; we prevent the
      // default mini-info-bar so we can show our own.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const installedHandler = () => {
      // appinstalled — hide the banner permanently.
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  // Don't render anything if there's nothing to install.
  if (!visible || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
        // Either way, the browser has now shown its native UI — we
        // must not re-prompt until the page reloads and the browser
        // fires beforeinstallprompt again.
        setVisible(false);
        setDeferredPrompt(null);
      }
    } catch {
      // If the prompt fails (some browsers throw when re-invoked),
      // just hide the banner.
      setVisible(false);
      setDeferredPrompt(null);
    }
  }

  function handleLater() {
    setVisible(false);
    // Keep deferredPrompt so a future in-app "Install" button can
    // still call .prompt() until the page reloads.
  }

  return (
    <div
      role="dialog"
      aria-label="Install Aarogya AI"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:pb-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-emerald-100/40">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              Install Aarogya AI
            </p>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
              <span className="inline-flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Works offline, no App Store needed.
              </span>{' '}
              Add it to your home screen for one-tap access to emergency tools
              and your health score.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Install
              </button>
              <button
                type="button"
                onClick={handleLater}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Later
              </button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss install banner"
            onClick={handleLater}
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
