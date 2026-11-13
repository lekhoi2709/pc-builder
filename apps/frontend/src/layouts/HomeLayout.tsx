import { Outlet } from 'react-router';
import StickyNavbar from '../components/StickyNavbar';

export default function HomeLayout() {
  return (
    <main className="relative min-h-screen w-full bg-[#f2f3eb] text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7]">
      <StickyNavbar className="sticky top-0 hidden xl:block" />
      <Outlet />
    </main>
  );
}
