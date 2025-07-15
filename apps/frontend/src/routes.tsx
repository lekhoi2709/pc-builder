import { createBrowserRouter } from 'react-router';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home';
import Components from './pages/Components';
import Layout from './layouts/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'components', Component: Components },
      { path: 'about', Component: () => <div>About Page</div> },
    ],
  },
]);

export default router;
