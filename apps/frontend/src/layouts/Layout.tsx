import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import StickyNavbar from '../components/StickyNavbar';

export default function Layout() {
  const location = useLocation();
  const isAtComponentPage = location.pathname.includes('/component');
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  return (
    <main className="max-w-screen dark:bg-dark bg-light text-primary-600 dark:text-primary-100 relative h-full min-h-screen w-screen transition-colors duration-500 ease-in-out">
      <StickyNavbar
        className="fixed right-4 top-4 z-50 hidden h-fit xl:flex"
        isSideBarOpen={isAtComponentPage ? isSideBarOpen : undefined}
      />
      <Outlet context={{ isSideBarOpen, setIsSideBarOpen }} />
    </main>
  );
}
