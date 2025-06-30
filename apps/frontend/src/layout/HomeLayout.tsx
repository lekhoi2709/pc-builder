import { Outlet } from 'react-router';

export default function HomeLayout() {
  return (
    <main className="max-w-screen min-h-screen w-screen bg-transparent">
      <Outlet />
    </main>
  );
}
