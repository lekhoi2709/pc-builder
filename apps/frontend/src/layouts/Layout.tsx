import { Outlet } from 'react-router';
import StickyNavbar from '../components/StickyNavbar';

export default function Layout() {
  return (
    <main className="max-w-screen dark:bg-light-dark dark:text-primary-50 min-h-screen w-screen bg-transparent transition-colors duration-500 ease-in-out">
      <StickyNavbar />
      <Outlet />
    </main>
  );
}
