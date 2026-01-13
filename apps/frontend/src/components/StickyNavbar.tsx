import { Link, NavLink, useLocation } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useHoverIndicator } from '../hooks/useHoverIndicator';
import { motion, type Variants } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';
import type { JSX } from 'react';
import { UserCircle2Icon } from 'lucide-react';

const StickyNavbar = ({
  className,
  isAtComponentPage = false,
  routes,
}: {
  className?: string;
  isAtComponentPage?: boolean;
  routes: {
    path: string;
    icon: JSX.Element;
    name: string;
    t: string;
  }[];
}) => {
  const location = useLocation();
  const { isSideBarOpen } = useUIStore();
  const { t } = useTranslation('common');

  const activeIndex = routes.findIndex(
    val => val.path == '/' + location.pathname.split('/')[2]
  );

  const {
    navRef,
    itemRefs,
    width,
    height,
    left,
    opacity,
    handleMouseEnter,
    handleMouseLeave,
  } = useHoverIndicator({ activeIndex });

  const navbarVariants: Variants = {
    withSidebar: {
      width: '77%',
      marginLeft: '0rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    noSidebar: {
      width: '98%',
      marginLeft: '4%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.header
      className={twMerge(
        'text-primary-600 dark:text-primary-100 border-secondary-300 dark:border-secondary-500 font-saira max-w-screen bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 z-50 items-center justify-between rounded-full border px-4 font-bold shadow-md backdrop-blur-sm transition-colors duration-300 ease-in-out xl:flex',
        className
      )}
      variants={navbarVariants}
      animate={isSideBarOpen && isAtComponentPage ? 'withSidebar' : 'noSidebar'}
      initial="noSidebar"
    >
      <span className="ml-2 flex items-center gap-2">
        <img
          src={'/logo/pc-builder-logo-transparent.png'}
          className="prevent-select w-10 object-contain"
          loading="lazy"
          alt="PC Builder"
        />
        <p className="font-saira">PC Builder</p>
      </span>
      <nav
        ref={navRef}
        className="relative flex h-fit transform gap-20 bg-transparent py-2"
      >
        <motion.div
          className="bg-accent-200 dark:bg-accent-400/80 backdrop-blur-xs rounded-4xl outline-accent-200 dark:outline-secondary-300 pointer-events-none absolute inset-0 top-1/2 -translate-y-1/2 transform outline-[0.5px] dark:outline-1"
          style={{
            width,
            height,
            left,
            opacity,
          }}
        />

        {routes.map((route, index: number) => (
          <NavLink
            ref={(el: HTMLAnchorElement | null) => {
              itemRefs.current[index] = el;
            }}
            to={route.path}
            key={route.path}
            className={twMerge(`group/navlink z-50 w-fit cursor-pointer p-5`)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <p className="font-semibold uppercase transition-all duration-500 ease-in-out group-hover/navlink:scale-110">
              {t(route.t)}
            </p>
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link
          to="/auth/signup"
          className="dark:text-primary-100 text-primary-600 bg-accent-200/20 dark:bg-accent-400/20 backdrop-blur-xs hover:bg-accent-200/50 dark:hover:bg-accent-400/50 cursor-pointer rounded-full p-4"
        >
          <UserCircle2Icon className="text-accent-500 dark:text-accent-400" />
        </Link>
        <ThemeToggle />
      </div>
    </motion.header>
  );
};

export default StickyNavbar;
