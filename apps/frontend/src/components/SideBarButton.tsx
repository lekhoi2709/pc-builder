import { PanelLeftDashedIcon, PanelLeftIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type SideBarButtonProps = {
  className?: string;
  isSideBarOpen: boolean;
  setIsSideBarOpen: (value: (prev: boolean) => boolean) => void;
};

export default function SideBarButton(props: SideBarButtonProps) {
  return (
    <button
      className={twMerge(
        'border-accent-200/50 hover:border-secondary-400 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 dark:hover:bg-secondary-600/50 hover:bg-accent-300/50 border-1 cursor-pointer rounded-full p-2 px-3 transition-all duration-300 ease-in-out xl:mr-0 xl:hidden',
        props.className
      )}
      onClick={() => props.setIsSideBarOpen(prev => !prev)}
    >
      {props.isSideBarOpen ? (
        <PanelLeftDashedIcon className="w-5" />
      ) : (
        <PanelLeftIcon className="w-5" />
      )}
    </button>
  );
}
