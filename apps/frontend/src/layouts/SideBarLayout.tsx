import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useExclusivePanel } from '../stores/exclusivePanelStore';

type SideBarLayoutProps = {
  className?: string;
  title: string;
  titleIcon?: ReactNode;
  isSideBarOpen: boolean;
};

const SideBarLayout = ({
  children,
  props,
}: {
  children: ReactNode;
  props: SideBarLayoutProps;
}) => {
  const { isSideBarOpen } = props;
  const { isFilterOpen, closeAll } = useExclusivePanel();
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
    <>
      {isSideBarOpen || isFilterOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/20 lg:hidden"
          onClick={closeAll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      ) : undefined}
      <motion.aside
        className={twMerge(
          'border-secondary-300 dark:border-secondary-500 xl:bg-secondary-500/20 bg-secondary-200/20 dark:bg-secondary-600/50 xl:dark:bg-secondary-600/20 hover:border-secondary-400 font-saira scrollbar-hidden xl:border-1 text-primary-600 dark:text-primary-100 z-60 fixed left-0 top-0 flex h-full max-h-dvh w-[65%] flex-col gap-4 overflow-y-auto p-4 px-8 shadow-md backdrop-blur-3xl transition-colors duration-300 ease-in-out xl:left-4 xl:top-4 xl:h-[calc(100vh-2rem)] xl:w-[20%] xl:min-w-[15rem] xl:rounded-[36px] xl:px-6',
          '[--sidebar-move-from:-100%] [--sidebar-move-to:0%] [--sidebar-opacity-from:0] [--sidebar-opacity-to:1]',
          props.className
        )}
        variants={listVariants}
        animate={isSideBarOpen ? 'expand' : 'collapse'}
        initial="collapse"
        onClick={e => e.stopPropagation()}
      >
        <span className="my-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xl font-semibold">
            {props.titleIcon}
            <p>{props.title}</p>
          </span>
        </span>
        {children}
      </motion.aside>
    </>
  );
};

export default SideBarLayout;
