import { useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

export type Theme = 'Light' | 'Dark' | 'System';

function readStoredTheme(): Theme {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme === 'Light' ||
    storedTheme === 'Dark' ||
    storedTheme === 'System'
    ? storedTheme
    : 'System';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'Dark' || (theme === 'System' && prefersDark);

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return {
    toggleTheme,
    theme,
  };
}
