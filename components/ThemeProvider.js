'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const item = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.split('=')[1]) : null;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const saved = readCookie('phoneme-theme');
    const next = saved === 'dark' ? 'dark' : 'light';
    setThemeState(next);
    document.documentElement.dataset.theme = next;
  }, []);

  const setTheme = (nextTheme) => {
    const safe = nextTheme === 'dark' ? 'dark' : 'light';
    setThemeState(safe);
    document.documentElement.dataset.theme = safe;
    document.cookie = `phoneme-theme=${safe}; max-age=31536000; path=/; samesite=lax`;
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}
