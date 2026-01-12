import { useEffect } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useParams,
} from 'react-router';
import StickyNavbar from '../components/StickyNavbar';
import { BookIcon, ComponentIcon, HouseIcon } from 'lucide-react';
import NavigationBarMobile from '../components/NavigationBarMobile';
import { twMerge } from 'tailwind-merge';
import ProgressBar from '../components/ProgressBar';
import Footer from '../components/Footer';

export default function Layout() {
  const location = useLocation();
  const locationPath = location.pathname.split('/')[2];
  const { lang } = useParams();
  const isAtComponentPage =
    location.pathname.replace(`/${lang}`, '') === '/components';

  const routes = [
    {
      path: '/',
      icon: <HouseIcon className="inline-block h-5 w-5" />,
      name: 'Home',
      t: 'nav.home',
    },
    {
      path: '/components',
      icon: <ComponentIcon className="inline-block h-5 w-5" />,
      name: 'Components',
      t: 'nav.components',
    },
    {
      path: '/about',
      icon: <BookIcon className="inline-block h-5 w-5" />,
      name: 'About',
      t: 'nav.about',
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
        'max-w-screen dark:bg-dark bg-light text-primary-600 dark:text-primary-100 relative h-full min-h-screen w-screen transition-colors duration-500 ease-in-out'
      )}
    >
      <ProgressBar />
      <StickyNavbar
        className="fixed right-4 top-4 z-50 hidden h-fit xl:flex"
        isAtComponentPage={isAtComponentPage}
        routes={routes}
      />
      <NavigationBarMobile routes={routes} locationPage={locationPage} />
      <Outlet />
      <Footer isAtComponentPage={isAtComponentPage} />
      <ScrollRestoration />
    </main>
  );
}
