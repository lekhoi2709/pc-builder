import { NavLink, useLocation, useParams } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useHoverIndicator } from '../hooks/useHoverIndicator';
import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useExclusivePanel } from '../stores/exclusivePanelStore';

const StickyNavbar = memo(
  ({
    className,
    isAtComponentPage,
  }: {
    className?: string;
    isAtComponentPage: boolean;
  }) => {
    const location = useLocation();
    const routes = [
      {
        path: '/',
        name: 'Home',
      },
      {
        path: '/components',
        name: 'Components',
      },
      {
        path: '/about',
        name: 'About',
      },
    ];

    const { lang } = useParams();
    const { isSideBarOpen } = useExclusivePanel();
    console.log('StickyNavbar Sidebar', isSideBarOpen);

    const activeIndex = routes.findIndex(
      val => val.path == location.pathname.replace(`/${lang}`, '')
    );

    const {
      navRef,
      itemRefs,
      indicatorStyle,
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
          'text-primary-600 dark:text-primary-100 border-secondary-300 dark:border-secondary-500 font-saira max-w-screen border-1 bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400 z-50 items-center justify-between rounded-full px-4 font-bold shadow-md backdrop-blur-sm transition-colors duration-300 ease-in-out xl:flex',
          className
        )}
        variants={navbarVariants}
        animate={
          isSideBarOpen && isAtComponentPage ? 'withSidebar' : 'noSidebar'
        }
        initial="noSidebar"
      >
        <span>Logo</span>
        <nav
          ref={navRef}
          className="relative flex h-fit transform gap-20 bg-transparent py-2"
        >
          <div
            className="bg-accent-200 dark:bg-accent-400/80 backdrop-blur-xs rounded-4xl pointer-events-none absolute inset-0 top-1/2 -translate-y-1/2 transform transition-all duration-500 ease-in-out"
            style={{
              ...indicatorStyle,
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
                {route.name}
              </p>
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </motion.header>
    );
  }
);

export default StickyNavbar;
