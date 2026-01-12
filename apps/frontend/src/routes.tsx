import { createBrowserRouter, redirect } from 'react-router';
import Home from './pages/Home';
import Components from './pages/Components';
import getUserLocationFromIP from './utils/getUserLocale';
import About from './pages/About';
import Layout from './layouts/Layout';
import i18n from './locales/i18n/config';
import { ComponentDetails } from './pages/ComponentDetails';
import NotFound from './pages/NotFound';

async function redirectToLocale() {
  try {
    const locale = await getUserLocationFromIP();
    return redirect(`/${locale}/`);
  } catch (error) {
    console.error('Error getting user locale:', error);
    return redirect('/en/');
  }
}

function redirectToLocalizedPath(path: string) {
  return async () => {
    try {
      const locale = await getUserLocationFromIP();
      return redirect(`/${locale}${path}`);
    } catch (error) {
      console.error('Error getting user locale:', error);
      return redirect(`/en${path}`);
    }
  };
}

const router = createBrowserRouter([
  {
    path: '*',
    Component: Layout,
    children: [{ path: '*', Component: NotFound }],
  },
  // Root redirect to localized home
  {
    path: '/',
    loader: redirectToLocale,
  },
  // Non-localized routes that should redirect to localized versions
  {
    path: '/components',
    loader: redirectToLocalizedPath('/components'),
  },
  {
    path: '/about',
    loader: redirectToLocalizedPath('/about'),
  },
  {
    path: '/:lang',
    Component: Layout,
    loader: ({ params }) => {
      const lang = params.lang;
      if (lang === 'en' || lang === 'vn') {
        i18n.changeLanguage(lang);
      }
      return null;
    },
    children: [
      { index: true, Component: Home },
      { path: 'components', Component: Components },
      { path: 'components/:componentId', Component: ComponentDetails },
      { path: 'about', Component: About },
    ],
  },
]);

export default router;
