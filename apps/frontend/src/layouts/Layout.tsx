import { useEffect, useState, type CSSProperties } from 'react';
import {
  Outlet,
  Link,
  ScrollRestoration,
  useLocation,
  useMatches,
  useMatch,
  useParams,
} from 'react-router';
import StickyNavbar from '../components/StickyNavbar';
import { Boxes, House, Info, Menu } from 'lucide-react';
import NavigationBarMobile from '../components/NavigationBarMobile';
import ProgressBar from '../components/ProgressBar';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';

export default function Layout() {
  const location = useLocation();
  const isCatalog = Boolean(useMatch('/:lang/components'));
  const isDesktopFilterOpen = useUIStore(state => state.isSideBarOpen);
  const matches = useMatches();
  const isNotFound = matches[matches.length - 1]?.id.startsWith('not-found');
  const locationPath = location.pathname.split('/')[2];
  const { lang = 'en' } = useParams();
  const { t: aboutT } = useTranslation('about');
  const { t: homeT } = useTranslation('home');
  const { t: componentT } = useTranslation('component');
  const { t: commonT } = useTranslation('common');
  const { isSideBarOpen, toggleSidebar, closeAll } = useUIStore();
  const [navbarVisible, setNavbarVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 77) {
        setNavbarVisible(true);
      } else if (Math.abs(currentScrollY - lastScrollY) >= 6) {
        setNavbarVisible(currentScrollY < lastScrollY);
      } else {
        return;
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { closeAll(); }, [location.pathname, closeAll]);

  const routes = [
    {
      path: '/',
      icon: <House className="inline-block h-5 w-5" strokeWidth={1.8} />,
      name: 'Home',
      t: 'nav.home',
    },
    {
      path: '/components',
      icon: <Boxes className="inline-block h-5 w-5" strokeWidth={1.8} />,
      name: 'Components',
      t: 'nav.components',
    },
    {
      path: '/about',
      icon: <Info className="inline-block h-5 w-5" strokeWidth={1.8} />,
      name: 'About',
      t: 'nav.about',
    },
  ];

  const locationPage = routes.find(
    route => route.path.replace('/', '') === locationPath
  )?.name;

  useEffect(() => {
    const title = isNotFound
      ? commonT('not_found.meta_title')
      : locationPath === 'about'
      ? aboutT('page.meta.title')
      : locationPath === 'components'
        ? componentT('page.meta_title')
        : homeT('page.meta_title');
    const description = isNotFound
      ? commonT('not_found.meta_description')
      : locationPath === 'about'
      ? aboutT('page.meta.description')
      : locationPath === 'components'
        ? componentT('page.meta_description')
        : homeT('page.meta_description');
    const pageType = document.querySelector<HTMLMetaElement>('meta[name="page-type"]');
    const pageDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    document.title = title;
    document.documentElement.lang = lang === 'vn' ? 'vi' : lang;
    document.documentElement.dataset.type = 'software';
    if (pageType) pageType.content = 'software';
    if (pageDescription) pageDescription.content = description;
    document.documentElement.dataset.radius = 'soft';
    document.documentElement.dataset.buttons = 'solid';
    document.documentElement.dataset.motion = '';
  }, [aboutT, commonT, componentT, homeT, isNotFound, lang, locationPath]);

  return (
    <div className="relative min-h-screen w-full bg-[#f2f3eb] text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7]" data-catalog-filter-open={isCatalog && isDesktopFilterOpen ? '' : undefined} style={{ '--navbar-height': navbarVisible ? '77px' : '0px' } as CSSProperties}>
      <a className="absolute left-[-9999px] top-2 z-[100] rounded bg-white px-4 py-3 text-slate-900 focus-visible:left-4" href="#top">
        {commonT('accessibility.skip')}
      </a>
      <ProgressBar />
      <header aria-hidden={!navbarVisible} inert={!navbarVisible} className={`fixed inset-x-0 top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#c7d1c3] bg-[#f2f3eb] px-5 text-[#111c1a] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none dark:border-[#34443b] dark:bg-[#111c1a] dark:text-white xl:hidden ${navbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link to={`/${lang}/`} className="flex items-center gap-2 font-display text-lg font-bold tracking-[-0.06em]">
          <span className="grid h-9 w-9 place-items-center bg-[#d1ff52] text-sm font-black text-[#111c1a]">PC</span>
          PC BUILDER<span className="-ml-2 text-[#658338] dark:text-[#d1ff52]">.</span>
        </Link>
        <button type="button" onClick={toggleSidebar} aria-expanded={isSideBarOpen} aria-controls="navigation-panel" aria-label={commonT('nav.menu')} className="grid h-11 w-11 place-items-center border border-[#aab6a6] text-[#3d5b10] dark:border-[#526155] dark:text-[#d1ff52]"><Menu className="h-5 w-5" strokeWidth={1.8} /></button>
      </header>
      <StickyNavbar visible={navbarVisible} className="sticky top-0 hidden xl:block" />
      <NavigationBarMobile routes={routes} locationPage={locationPage} />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
