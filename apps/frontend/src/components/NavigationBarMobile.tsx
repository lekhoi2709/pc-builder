import { NavLink, useParams } from 'react-router';
import SideBarLayout from '../layouts/SideBarLayout';
import { twMerge } from 'tailwind-merge';
import type { JSX } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavigationBarMobile({
  routes,
  locationPage,
  className,
}: {
  routes: {
    path: string;
    icon: JSX.Element;
    name: string;
  }[];
  locationPage?: string;
  className?: string;
}) {
  const { isSideBarOpen, toggleSidebar } = useUIStore();
  const { lang = 'en' } = useParams();
  const { t } = useTranslation('common');
  return (
    <SideBarLayout
      props={{
        isSideBarOpen: isSideBarOpen!,
        title: t('nav.label'),
        titleIcon: (
          <span className="grid h-9 w-9 place-items-center bg-[#d1ff52] text-sm font-black text-[#111c1a]">PC</span>
        ),
        className: twMerge('xl:hidden', className),
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <nav className="flex w-full flex-col">
          {routes.map(route => {
            const isAtPage = locationPage === route.name;

            return (
              <NavLink
                to={`/${lang}${route.path}`}
                key={route.path}
                onClick={toggleSidebar}
                className={twMerge(
                  'group/navlink flex min-h-16 items-center gap-4 border-b border-[#d8ddd2] px-3 text-[#111c1a] transition-colors hover:bg-[#ecf1dc] dark:border-[#435547] dark:text-[#edf3e7] dark:hover:bg-[#314437]',
                  isAtPage &&
                    'bg-[#ecf1dc] dark:bg-[#314437]'
                )}
              >
                <div
                  className={twMerge(
                    'h-6 w-1 bg-transparent',
                    isAtPage &&
                      'bg-[#7caa18]'
                  )}
                />
                {route.icon}
                <p className="pt-0.5 font-semibold">{t(route.path === '/' ? 'nav.home' : route.path === '/components' ? 'nav.components' : 'nav.about')}</p>
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-[#d8ddd2] pt-5 dark:border-[#435547]">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[#75847a]">{t('preferences.title')}</p>
          <div className="flex gap-2"><LanguageSwitcher className="border-[#aab6a6] text-[#3d5b10] dark:border-[#526354] dark:text-[#d1ff52]" /><ThemeToggle className="border-[#aab6a6] text-[#3d5b10] dark:border-[#526354] dark:text-[#d1ff52]" /></div>
        </div>
      </div>
    </SideBarLayout>
  );
}
