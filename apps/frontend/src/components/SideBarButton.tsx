import { twMerge } from 'tailwind-merge';
import { HideSidebarIcon, ShowSidebarIcon } from './Icons/SidebarIcon';

type SideBarButtonProps = {
  className?: string;
  isSideBarOpen: boolean;
  toggleSidebar: () => void;
};

export default function SideBarButton(props: SideBarButtonProps) {
  return (
    <button
      className={twMerge(
        'border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 cursor-pointer rounded-lg border px-4 py-2 transition-all duration-300 ease-in-out xl:mr-0',
        props.className
      )}
      onClick={props.toggleSidebar}
    >
      {props.isSideBarOpen ? <HideSidebarIcon /> : <ShowSidebarIcon />}
    </button>
  );
}
