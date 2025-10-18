import { motion, type Variants } from 'framer-motion';
import { PanelLeftDashedIcon, PanelLeftIcon } from 'lucide-react';
import {
  memo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { twMerge } from 'tailwind-merge';

type SideBarLayoutProps = {
  className?: string;
  title: string;
  titleIcon?: ReactNode;
  isSideBarOpen: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBarLayout = memo(
  ({ children, props }: { children: ReactNode; props: SideBarLayoutProps }) => {
    const listVariants: Variants = {
      collapse: {
        x: 'var(--sidebar-move-from)',
        opacity: 'var(--sidebar-opacity-from)',
        pointerEvents: 'none',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
      expand: {
        x: 'var(--sidebar-move-to)',
        opacity: 'var(--sidebar-opacity-to)',
        pointerEvents: 'auto',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
    };

    return (
      <motion.aside
        className={twMerge(
          'font-saira scrollbar-hidden xl:border-1 border-primary-700 xl:border-secondary-300 xl:hover:border-secondary-400 xl:dark:border-secondary-500 xl:bg-secondary-500/20 xl:dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 bg-light dark:bg-dark fixed left-0 top-0 z-50 flex h-screen w-full min-w-[15rem] flex-col gap-4 overflow-y-auto p-4 px-8 transition-colors duration-300 ease-in-out xl:left-4 xl:top-4 xl:h-[calc(100vh-2rem)] xl:w-[20%] xl:rounded-[36px] xl:px-6 xl:backdrop-blur-sm',
          '[--sidebar-move-from:-100%] [--sidebar-move-to:0%] [--sidebar-opacity-from:0] [--sidebar-opacity-to:1]',
          props.className
        )}
        variants={listVariants}
        animate={props.isSideBarOpen ? 'expand' : 'collapse'}
        initial="collapse"
      >
        <span className="my-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xl font-semibold">
            {props.titleIcon}
            <p>{props.title}</p>
          </span>
          <button
            className={twMerge(
              'border-accent-200/50 hover:border-secondary-400 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 dark:hover:bg-secondary-600/50 hover:bg-accent-300/50 border-1 cursor-pointer rounded-full p-2 px-3 transition-all duration-300 ease-in-out xl:hidden'
            )}
            onClick={() => props.setIsSideBarOpen(prev => !prev)}
          >
            {props.isSideBarOpen ? (
              <PanelLeftDashedIcon className="w-5" />
            ) : (
              <PanelLeftIcon className="w-5" />
            )}
          </button>
        </span>
        {children}
      </motion.aside>
    );
  }
);

export default SideBarLayout;
