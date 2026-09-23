'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Initialize from localStorage on mount — apply directly to DOM
  useEffect(() => {
    let initial: Theme = 'light';
    try {
      const saved = localStorage.getItem('aarogya-theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initial = saved || (prefersDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
    // Apply to DOM directly
    const root = document.documentElement;
    if (initial === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    // Update state via functional update (linter-safe: conditional)
    setThemeState(prev => (prev !== initial ? initial : prev));
  }, []);

  // Apply theme changes to DOM + persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('aarogya-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: (_: Theme) => {},
    };
  }
  return ctx;
}
