import { createBrowserRouter } from 'react-router';
import HomeLayout from './layout/HomeLayout';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: () => <div>About Page</div> },
    ],
  },
]);

export default router;
