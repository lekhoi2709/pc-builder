import { createBrowserRouter, redirect } from 'react-router';
import Home from './pages/Home';
import Components from './pages/Components';
import Layout from './layouts/Layout';
import getUserLocale from './utils/getUserLocale';
import About from './pages/About';

function redirectToLocale() {
  const locale = getUserLocale();
  return redirect(`/${locale}/`);
}

function redirectToLocalizedPath(path: string) {
  return () => {
    const locale = getUserLocale();
    return redirect(`/${locale}${path}`);
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
    children: [{ index: true, Component: Home }],
  },
  {
    path: '/:lang',
    Component: Layout,
    children: [
      { path: 'components', Component: Components },
      { path: 'about', Component: About },
    ],
  },
]);

export default router;
