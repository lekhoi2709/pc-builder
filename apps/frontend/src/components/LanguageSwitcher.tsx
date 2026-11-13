import { Languages } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang = 'vn' } = useParams();
  const location = useLocation();
  const { t } = useTranslation('common');
  const closeAll = useUIStore(state => state.closeAll);
  const next = lang === 'vn' ? 'en' : 'vn';
  const path = location.pathname.replace(/^\/(vn|en)(?=\/|$)/, `/${next}`);

  return <Link to={`${path}${location.search}${location.hash}`} onClick={closeAll} aria-label={t('preferences.language', { language: next === 'vn' ? 'Tiếng Việt' : 'English' })} title={t('preferences.language', { language: next === 'vn' ? 'Tiếng Việt' : 'English' })} className={`inline-flex h-11 items-center gap-2 border border-[#aab6a6] px-3 font-mono text-xs font-semibold text-[#3d5b10] transition-colors hover:bg-[#e5f3c9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7caa18] dark:border-[#526155] dark:text-[#d1ff52] dark:hover:bg-[#34483c] ${className}`}>
    <Languages className="h-4 w-4" strokeWidth={1.8} /><span>{lang === 'vn' ? 'VI' : 'EN'}</span>
  </Link>;
}
