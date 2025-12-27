import { twMerge } from 'tailwind-merge';
import { HideSidebarIcon, ShowSidebarIcon } from './Icons/SidebarIcon';
import { MenuIcon } from 'lucide-react';

type SideBarButtonProps = {
  className?: string;
  isSideBarOpen: boolean;
  toggleSidebar: () => void;
  isNavbar?: boolean;
};

export default function SideBarButton({
  isNavbar = false,
  className,
  isSideBarOpen,
  toggleSidebar,
}: SideBarButtonProps) {
  return (
    <button
      className={twMerge(
        'border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 cursor-pointer rounded-lg border px-4 py-2 transition-all duration-300 ease-in-out xl:mr-0',
        className
      )}
      onClick={toggleSidebar}
    >
      {!isNavbar && (isSideBarOpen ? <HideSidebarIcon /> : <ShowSidebarIcon />)}
      {isNavbar && (
        <MenuIcon
          strokeWidth={1}
          className="stroke-primary-600 dark:stroke-primary-100 w-5"
        />
      )}
    </button>
  );
}
