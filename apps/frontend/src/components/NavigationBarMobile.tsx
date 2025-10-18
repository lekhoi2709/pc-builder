import { NavLink } from 'react-router';
import SideBarLayout from '../layouts/SideBarLayout';
import { twMerge } from 'tailwind-merge';
import type { Dispatch, JSX, SetStateAction } from 'react';
import ThemeToggle from './ThemeToggle';

export default function NavigationBarMobile({
  isSideBarOpen,
  setIsSideBarOpen,
  routes,
  locationPage,
  className,
}: {
  isSideBarOpen?: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
  routes: {
    path: string;
    icon: JSX.Element;
    name: string;
  }[];
  locationPage?: string;
  className?: string;
}) {
  return (
    <SideBarLayout
      props={{
        isSideBarOpen: isSideBarOpen!,
        setIsSideBarOpen: setIsSideBarOpen,
        title: locationPage + ' Page' || routes[0].name || 'Home Page',
        className: twMerge(
          'xl:hidden bg-light dark:bg-dark backdrop-blur-sm',
          className
        ),
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <nav className="flex w-full flex-col">
          {routes.map(route => {
            const isAtPage = locationPage === route.name;

            return (
              <NavLink
                to={route.path}
                key={route.path}
                onClick={() => setIsSideBarOpen(false)}
                className={twMerge(
                  'text-primary-600 dark:text-primary-100 group/navlink hover:bg-accent-200 dark:hover:bg-accent-400/80 transition-color flex items-center gap-4 rounded-lg p-3 px-4 duration-300 ease-in-out',
                  isAtPage &&
                    'text-accent-400 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-100'
                )}
              >
                <div
                  className={twMerge(
                    'h-full w-[2px] bg-transparent',
                    isAtPage &&
                      'bg-accent-400 dark:bg-accent-300 group-hover/navlink:bg-primary-600 dark:group-hover/navlink:bg-primary-100 transition-colors ease-in-out'
                  )}
                />
                {route.icon}
                <p className="pt-[2px] font-semibold uppercase">{route.name}</p>
              </NavLink>
            );
          })}
        </nav>
        <ThemeToggle className="bg-accent-200/20 dark:bg-accent-400/20 w-fit self-end" />
      </div>
    </SideBarLayout>
  );
}
