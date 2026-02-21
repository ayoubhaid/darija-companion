'use client';

import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Read from localStorage on mount
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored !== null ? stored === 'true' : prefersDark;
    setDarkMode(isDark);
    applyDarkMode(isDark);
  }, []);

  const applyDarkMode = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(enabled));
  };

  const toggle = () => {
    const next = !darkMode;
    setDarkMode(next);
    applyDarkMode(next);
  };

  const setMode = (enabled: boolean) => {
    setDarkMode(enabled);
    applyDarkMode(enabled);
  };

  return { darkMode, toggle, setMode };
}
