'use client';

// ============================================
// AAROGYA AI — COMMAND PALETTE
// Cmd+K quick navigation with premium glass-morphism
// ============================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronRight, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  onSelect: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Adjust state when `open` prop changes (React-recommended render-time sync).
  // Avoids setState-in-effect cascading renders.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  // Focus input when opening (side-effect only — no setState)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Group + filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hay = `${item.label} ${item.group} ${item.keywords ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, items]);

  // Group filtered items by `group` for premium sectioned layout
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Flat list for keyboard navigation
  const flatList = filtered;

  // Reset active index when query changes (render-time sync)
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (flatList.length === 0 ? 0 : (i + 1) % flatList.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) =>
          flatList.length === 0 ? 0 : (i - 1 + flatList.length) % flatList.length,
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatList[activeIndex];
        if (item) {
          onSelect(item.id);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, onSelect, flatList, activeIndex]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-md animate-fadeIn" />

      {/* Palette — glass morphism */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-2xl shadow-emerald-900/20 backdrop-blur-2xl animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: '0.18s' }}
      >
        {/* Decorative gradient ring */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />

        {/* Search row */}
        <div className="relative flex items-center gap-3 border-b border-slate-200/70 px-4 py-3.5">
          <Search className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, actions, reports..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="relative max-h-[min(60vh,420px)] overflow-y-auto scrollbar-slim p-2"
        >
          {flatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No matches found</p>
              <p className="mt-0.5 text-xs text-slate-400">Try a different keyword</p>
            </div>
          ) : (
            grouped.map(([group, groupItems]) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group}
                </div>
                <div className="space-y-0.5">
                  {groupItems.map((item) => {
                    const flatIdx = flatList.findIndex((f) => f.id === item.id);
                    const isActive = flatIdx === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        data-idx={flatIdx}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        onClick={() => {
                          onSelect(item.id);
                          onClose();
                        }}
                        className={`group flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm ring-1 ring-emerald-200/60'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base transition-colors ${
                              isActive
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-slate-100'
                            }`}
                          >
                            {Icon ? <Icon className="h-4 w-4" /> : <span className="text-xs font-bold">•</span>}
                          </span>
                          <div className="min-w-0">
                            <div
                              className={`truncate text-sm font-semibold ${
                                isActive ? 'text-emerald-800' : 'text-slate-700'
                              }`}
                            >
                              {item.label}
                            </div>
                            <div className="truncate text-[11px] font-medium text-slate-400">
                              {item.group}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <kbd className="hidden items-center gap-1 rounded-md border border-emerald-200 bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 sm:inline-flex">
                              <CornerDownLeft className="h-3 w-3" />
                            </kbd>
                          )}
                          <ChevronRight
                            className={`h-4 w-4 transition-colors ${
                              isActive ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-500'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer hint bar */}
        <div className="flex items-center justify-between border-t border-slate-200/70 bg-white/60 px-4 py-2 text-[11px] text-slate-400 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                <ArrowUp className="h-2.5 w-2.5" />
              </kbd>
              <kbd className="inline-flex items-center justify-center rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                <ArrowDown className="h-2.5 w-2.5" />
              </kbd>
              <span className="ml-1">navigate</span>
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="inline-flex items-center justify-center rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              <span className="ml-1">select</span>
            </span>
          </div>
          <span className="font-semibold text-emerald-600">Aarogya AI</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
