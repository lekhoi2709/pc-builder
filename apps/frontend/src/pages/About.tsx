import { twMerge } from 'tailwind-merge';
import SideBarButton from '../components/SideBarButton';
import { useSideBarOpen } from '../hooks/useSideBarOpen';

export default function About() {
  const { isSideBarOpen, setIsSideBarOpen } = useSideBarOpen();

  return (
    <main
      className={twMerge(
        'font-saira max-w-screen text-primary-600 dark:text-primary-100 z-0 flex h-full min-h-screen w-screen flex-col items-center bg-transparent p-8',
        isSideBarOpen
          ? 'h-screen overflow-y-hidden xl:h-full xl:overflow-y-auto'
          : 'overflow-y-auto'
      )}
    >
      <section className="flex w-full items-center justify-between xl:hidden">
        <h1 className="text-xl font-semibold">Logo</h1>
        <SideBarButton
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      </section>
      <section className="z-0 flex w-full flex-1 flex-col items-center justify-center gap-4 p-8 xl:pt-28">
        <h1 className="mb-4 text-center text-3xl font-bold xl:text-4xl">
          Welcome to the About Page
        </h1>
        <p className="text-center text-lg text-gray-700">
          This is the about page of your application.
        </p>
      </section>
    </main>
  );
}
