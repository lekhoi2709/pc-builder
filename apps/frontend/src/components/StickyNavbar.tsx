import { ArrowUpRight } from 'lucide-react';
import { Link, NavLink, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function StickyNavbar({ className = '', visible = true }: { className?: string; visible?: boolean }) {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('common');

  return (
    <header aria-hidden={!visible} inert={!visible} className={`z-50 w-full border-b border-[#c7d1c3] bg-[#f2f3eb]/95 px-6 text-[#111c1a] backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none dark:border-[#263430] dark:bg-[#111c1a]/95 dark:text-[#f1f4e9] lg:px-10 ${visible ? 'translate-y-0' : '-translate-y-full'} ${className}`}>
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-8">
        <Link to={`/${lang}/`} className="flex shrink-0 items-center gap-3" aria-label="PC Builder">
          <span className="grid h-10 w-10 place-items-center bg-[#d1ff52] font-display text-xl font-black tracking-[-0.12em] text-[#111c1a]">PC</span>
          <span className="font-display text-lg font-bold tracking-[-0.055em]">PC BUILDER<span className="text-[#658338] dark:text-[#d1ff52]">.</span></span>
        </Link>
        <nav className="flex h-full items-center gap-1" aria-label={t('nav.label')}>
          {['/', '/components', '/about'].map((path, index) => (
            <NavLink key={path} to={`/${lang}${path}`} end={path === '/'}
              className={({ isActive }) => `relative flex h-full items-center px-5 text-sm font-semibold transition-colors after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[3px] after:transition-colors hover:text-[#3d5b10] dark:hover:text-[#d1ff52] ${isActive ? 'text-[#3d5b10] after:bg-[#7caa18] dark:text-[#d1ff52] dark:after:bg-[#d1ff52]' : 'text-[#506050] after:bg-transparent dark:text-[#bac8bf]'}`}>
              {t(['nav.home', 'nav.components', 'nav.about'][index])}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <NavLink to={`/${lang}/components`} className="group ml-2 inline-flex h-11 shrink-0 items-center gap-3 bg-[#d1ff52] px-5 text-sm font-bold text-[#111c1a] transition-colors hover:bg-white">
            {t('nav.cta')} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
