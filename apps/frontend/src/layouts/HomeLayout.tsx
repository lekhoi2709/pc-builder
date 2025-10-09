import { Outlet } from 'react-router';
import StickyNavbar from '../components/StickyNavbar';

export default function HomeLayout() {
  return (
    <main className="max-w-screen dark:bg-light-dark dark:text-primary-50 text-primary-900 relative h-full min-h-screen w-screen bg-transparent transition-colors duration-500 ease-in-out">
      <StickyNavbar className="fixed right-4 top-4 z-50 hidden h-fit xl:flex" />
      <Outlet />
    </main>
  );
}
