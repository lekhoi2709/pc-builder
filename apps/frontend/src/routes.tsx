import { createBrowserRouter, redirect } from 'react-router';
import getUserLocationFromIP from './utils/getUserLocale';
import Layout from './layouts/Layout';
import i18n from './locales/i18n/config';

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
    children: [
      {
        id: 'not-found-global',
        path: '*',
        lazy: async () => ({
          Component: (await import('./pages/NotFound')).default,
        }),
      },
    ],
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
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/Home')).default,
        }),
      },
      {
        path: 'components',
        lazy: async () => ({
          Component: (await import('./pages/Components')).default,
        }),
      },
      {
        path: 'components/:componentId',
        lazy: async () => ({
          Component: (await import('./pages/ComponentDetails'))
            .ComponentDetails,
        }),
      },
      {
        path: 'about',
        lazy: async () => ({
          Component: (await import('./pages/About')).default,
        }),
      },
      {
        id: 'not-found-local',
        path: '*',
        lazy: async () => ({
          Component: (await import('./pages/NotFound')).default,
        }),
      },
    ],
  },
]);

export default router;
