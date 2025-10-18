import { useEffect, useState } from 'react';

export type Theme = 'Light' | 'Dark' | 'System';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('Light');

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    document.documentElement.classList.toggle('dark', theme === 'Dark');
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    const storedTheme: Theme =
      (localStorage.getItem('theme') as Theme) || 'System';
    setTheme(storedTheme);
    document.documentElement.classList.toggle(
      'dark',
      storedTheme === 'Dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [theme]);

  return {
    toggleTheme,
    theme,
  };
}
