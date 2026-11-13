import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useUIStore } from '../stores/uiStore';

type SideBarLayoutProps = {
  className?: string;
  title: string;
  titleIcon?: ReactNode;
  isSideBarOpen: boolean;
  isFilter?: boolean;
};

export default function SideBarLayout({ children, props }: { children: ReactNode; props: SideBarLayoutProps }) {
  const { closeAll } = useUIStore();
  const { t } = useTranslation('common');
  const open = props.isSideBarOpen;

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeAll(); };
    const previousOverflow = document.body.style.overflow;
    if (window.matchMedia('(max-width: 1279px)').matches) document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onEscape); };
  }, [open, closeAll]);

  return <>
    {open && <button type="button" onClick={closeAll} aria-label={t('nav.close')} className="fixed inset-0 z-50 bg-[#132126]/45 backdrop-blur-[2px] xl:hidden" />}
    <aside
      id={props.isFilter ? 'filter-panel' : 'navigation-panel'}
      aria-hidden={!open}
      inert={!open}
      className={twMerge(
        'fixed inset-y-0 left-0 z-[60] flex w-[min(88vw,22rem)] flex-col overflow-hidden border-r border-[#d8ddd2] bg-[#f8f9f3] text-[#111c1a] shadow-[0_24px_80px_-32px_rgba(17,28,26,.32)] transition-[transform,opacity,top] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none dark:border-[#435547] dark:bg-[#243229] dark:text-[#edf3e7] xl:top-[var(--navbar-height)] xl:w-[19%] xl:min-w-60',
        open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none',
        props.className
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#d8ddd2] px-5 py-5 dark:border-[#435547] xl:px-6">
        <div className="flex min-w-0 items-center gap-3 font-display text-lg font-semibold"><span className="shrink-0">{props.titleIcon}</span><span className="truncate">{props.title}</span></div>
        <button type="button" onClick={closeAll} aria-label={t('nav.close')} className="grid h-10 w-10 shrink-0 place-items-center border border-[#aab6a6] transition-colors hover:bg-[#d1ff52] hover:text-[#111c1a] dark:border-[#526354]"><X className="h-5 w-5" /></button>
      </div>
      <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-6 xl:px-6">{children}</div>
      {props.isFilter && <div className="shrink-0 border-t border-[#d8ddd2] bg-[#f8f9f3] p-4 dark:border-[#435547] dark:bg-[#243229] xl:hidden"><button type="button" onClick={closeAll} className="min-h-12 w-full bg-[#d1ff52] px-4 text-sm font-semibold text-[#111c1a]">{t('nav.show_results')}</button></div>}
    </aside>
  </>;
}
