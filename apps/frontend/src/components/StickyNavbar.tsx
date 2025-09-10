import { motion } from 'framer-motion';
import useScrollPosition from '../hooks/useScrollPosition';
import { NavLink, useLocation, useParams } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useHoverIndicator } from '../hooks/useHoverIndicator';
import { useTheme, type Theme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function StickyNavbar() {
  const scrolled = useScrollPosition(100);
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

  return (
    <header className="fixed z-50 hidden w-full items-center justify-between rounded-full bg-transparent pt-4 md:flex">
      <motion.nav
        ref={navRef}
        className="bg-primary-400/20 dark:bg-primary-300/20 relative left-1/2 top-1/2 flex h-fit -translate-x-1/2 transform gap-20 rounded-[4rem] p-1 backdrop-blur-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={
          scrolled
            ? {
                y: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }
            : { y: -100, opacity: 0, transition: { duration: 0.5 } }
        }
        transition={{ duration: 0.5 }}
      >
        <div
          className="bg-primary-600/20 backdrop-blur-xs pointer-events-none absolute inset-0 top-1/2 -translate-y-1/2 transform rounded-[5rem] transition-all duration-500 ease-in-out"
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
            className={twMerge(
              `hover:text-primary-800 text-primary-950 dark:hover:text-primary-200 dark:text-primary-100 group/navlink z-50 w-fit cursor-pointer p-5`
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <p className="transition-all duration-500 ease-in-out group-hover/navlink:scale-110">
              {route.name}
            </p>
          </NavLink>
        ))}
      </motion.nav>
      <ThemeToggle />
    </header>
  );
}

function ThemeToggle() {
  const scrolled = useScrollPosition(100);
  const { toggleTheme } = useTheme();

  const themeIcons = [
    {
      name: 'Light' as Theme,
      icon: <SunIcon />,
    },
    {
      name: 'Dark' as Theme,
      icon: <MoonIcon />,
    },
  ];

  const activeIndex = themeIcons.findIndex(
    val =>
      val.name ==
      ((localStorage.getItem('theme') as Theme) ?? ('Light' as Theme))
  );

  const {
    navRef,
    itemRefs,
    indicatorStyle,
    handleMouseEnter,
    handleMouseLeave,
  } = useHoverIndicator({
    activeIndex,
  });

  return (
    <motion.nav
      ref={navRef}
      className="bg-primary-400/20 rounded-4xl relative flex -translate-x-1/2 p-1 backdrop-blur-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={
        scrolled
          ? {
              y: 0,
              opacity: 1,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }
          : { y: -100, opacity: 0, transition: { duration: 0.5 } }
      }
      transition={{ duration: 0.5 }}
    >
      <div
        className="bg-primary-600/20 backdrop-blur-xs pointer-events-none absolute inset-0 top-1/2 -translate-y-1/2 transform rounded-[5rem] transition-all duration-500 ease-in-out"
        style={{
          ...indicatorStyle,
        }}
      />
      {themeIcons.map((item, index: number) => (
        <span
          ref={(el: HTMLSpanElement | null) => {
            itemRefs.current[index] = el;
          }}
          key={item.name}
          className={twMerge(
            `z-50 h-fit w-fit cursor-pointer p-3 transition-all duration-500 ease-in-out`
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => toggleTheme(item.name)}
        >
          <i
            className={twMerge(
              'text-primary-950 dark:text-primary-100 transition-all duration-500 ease-in-out',
              activeIndex == index
                ? '!text-amber-600 dark:!text-amber-400/70'
                : ''
            )}
          >
            {item.icon}
          </i>
        </span>
      ))}
    </motion.nav>
  );
}
