import { NavLink } from 'react-router';
import SideBarLayout from '../layouts/SideBarLayout';
import { twMerge } from 'tailwind-merge';
import type { JSX } from 'react';
import ThemeToggle from './ThemeToggle';
import { useExclusivePanel } from '../stores/exclusivePanelStore';

export default function NavigationBarMobile({
  routes,
  locationPage,
  className,
}: {
  routes: {
    path: string;
    icon: JSX.Element;
    name: string;
  }[];
  locationPage?: string;
  className?: string;
}) {
  const { isSideBarOpen, toggleSidebar } = useExclusivePanel();
  return (
    <SideBarLayout
      props={{
        isSideBarOpen: isSideBarOpen!,
        title: locationPage + ' Page' || routes[0].name || 'Home Page',
        titleIcon: (
          <img
            src="/logo/pc-builder-logo-transparent.png"
            className="prevent-select w-8 object-contain"
          />
        ),
        className: twMerge('xl:hidden', className),
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
                onClick={toggleSidebar}
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
        <ThemeToggle className="bg-accent-200/20 dark:bg-accent-400/20 w-fit self-start" />
      </div>
    </SideBarLayout>
  );
}
