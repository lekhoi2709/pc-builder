import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useUIStore();
  const { t } = useTranslation('common');
  const isDark = theme === 'Dark' || (theme === 'System' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return <button type="button" onClick={() => setTheme(isDark ? 'Light' : 'Dark')} aria-label={t(isDark ? 'preferences.light' : 'preferences.dark')} title={t(isDark ? 'preferences.light' : 'preferences.dark')} className={`inline-flex h-11 w-11 items-center justify-center border border-[#aab6a6] text-[#3d5b10] transition-colors hover:bg-[#e5f3c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7caa18] dark:border-[#526155] dark:text-[#d1ff52] dark:hover:bg-[#34483c] ${className}`}>
    {isDark ? <Sun className="h-5 w-5" strokeWidth={1.8} /> : <Moon className="h-5 w-5" strokeWidth={1.8} />}
  </button>;
}
