import { motion, type Variants } from 'framer-motion';
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
          'font-saira scrollbar-hidden xl:border-1 border-secondary-300 hover:border-secondary-400 dark:border-secondary-500 bg-secondary-500/20 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 dark:border-primary-700/50 fixed left-0 top-0 z-50 flex h-full max-h-dvh w-[65%] flex-col gap-4 overflow-y-auto p-4 px-8 shadow-2xl backdrop-blur-3xl transition-colors duration-300 ease-in-out xl:left-4 xl:top-4 xl:h-[calc(100vh-2rem)] xl:w-[20%] xl:min-w-[15rem] xl:rounded-[36px] xl:px-6 xl:backdrop-blur-sm',
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
        </span>
        {children}
      </motion.aside>
    );
  }
);

export default SideBarLayout;
