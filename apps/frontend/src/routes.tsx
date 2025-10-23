import { createBrowserRouter, redirect } from 'react-router';
import Home from './pages/Home';
import Components from './pages/Components';
import getUserLocationFromIP from './utils/getUserLocale';
import About from './pages/About';
import Layout from './layouts/Layout';

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
    Component: () => <div>404 Not Found</div>,
    errorElement: <div>Page not found</div>,
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
    children: [
      { index: true, Component: Home },
      { path: 'components', Component: Components },
      { path: 'about', Component: About },
    ],
  },
]);

export default router;
