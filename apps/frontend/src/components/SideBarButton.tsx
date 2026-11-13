import { twMerge } from 'tailwind-merge';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SideBarButtonProps = {
  className?: string;
  isSideBarOpen: boolean;
  toggleSidebar: () => void;
  isNavbar?: boolean;
  disabled?: boolean;
};

export default function SideBarButton({
  isNavbar = false,
  className,
  isSideBarOpen,
  toggleSidebar,
  disabled = false,
}: SideBarButtonProps) {
  const { t } = useTranslation('component');
  return (
    <button
      type="button"
      aria-label={isNavbar ? 'Open navigation' : t('filter.title')}
      aria-expanded={isSideBarOpen}
      aria-controls={isNavbar ? 'navigation-panel' : 'filter-panel'}
      disabled={disabled}
      className={twMerge(
        'flex min-h-11 cursor-pointer items-center gap-3 border border-[#111c1a] bg-[#d1ff52] px-4 py-2 text-sm font-semibold text-[#111c1a] transition-colors hover:bg-[#e1ff91] disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      onClick={toggleSidebar}
    >
      {!isNavbar && <><SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} /><span>{t('filter.title')}</span></>}
      {isNavbar && (
        <Menu className="h-5 w-5" strokeWidth={1.8} />
      )}
    </button>
  );
}
