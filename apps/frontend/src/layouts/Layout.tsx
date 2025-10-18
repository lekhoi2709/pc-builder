import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import StickyNavbar from '../components/StickyNavbar';
import { BookIcon, ComponentIcon, HouseIcon } from 'lucide-react';
import NavigationBarMobile from '../components/NavigationBarMobile';
import { twMerge } from 'tailwind-merge';

export default function Layout() {
  const location = useLocation();
  const isAtComponentPage = location.pathname.includes('/component');
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  const locationPath = location.pathname.split('/')[2];

  const routes = [
    {
      path: '/',
      icon: <HouseIcon className="inline-block h-5 w-5" />,
      name: 'Home',
    },
    {
      path: '/components',
      icon: <ComponentIcon className="inline-block h-5 w-5" />,
      name: 'Components',
    },
    {
      path: '/about',
      icon: <BookIcon className="inline-block h-5 w-5" />,
      name: 'About',
    },
  ];

  const locationPage = routes.find(
    route => route.path.replace('/', '') === locationPath
  )?.name;

  useEffect(() => {
    document.title = locationPage
      ? `${locationPage} - PC Builder`
      : 'PC Builder';
  }, [locationPage]);

  return (
    <main
      className={twMerge(
        'max-w-screen dark:bg-dark bg-light text-primary-600 dark:text-primary-100 relative h-full min-h-dvh w-screen transition-colors duration-500 ease-in-out'
      )}
    >
      <StickyNavbar
        className="fixed right-4 top-4 z-50 hidden h-fit xl:flex"
        isSideBarOpen={isAtComponentPage ? isSideBarOpen : undefined}
      />
      <NavigationBarMobile
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        routes={routes}
        locationPage={locationPage}
      />
      <Outlet context={{ isSideBarOpen, setIsSideBarOpen }} />
    </main>
  );
}
