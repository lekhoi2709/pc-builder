import { twMerge } from 'tailwind-merge';
import SideBarButton from '../components/SideBarButton';
import HeroSection from '../components/Home/HeroSection';
import SearchComponentBar from '../components/SearchComponentBar';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from '../components/Home/AnimatedCounter';
import WorkflowSection from '../components/Home/WorkflowSection';
import GallerySection from '../components/Home/GallerySection';
import { useUIStore } from '../stores/uiStore';

export default function Home() {
  const { isSideBarOpen, toggleSidebar } = useUIStore();
  const { t } = useTranslation('home');
  const stats = t('page.stats', { returnObjects: true });

  return (
    <main
      className={twMerge(
        'font-saira max-w-screen text-primary-600 dark:text-primary-100 z-0 flex h-full min-h-screen w-screen flex-col items-center bg-transparent p-8 md:px-16'
      )}
    >
      <section className="flex w-full items-center justify-between xl:hidden">
        <span className="flex items-center gap-2">
          <img
            src={'/logo/pc-builder-logo-transparent.png'}
            className="prevent-select w-10 object-contain"
            loading="lazy"
            alt="PC Builder"
          />
          <p className="font-saira text-accent-400">PC Builder</p>
        </span>
        <SideBarButton
          isSideBarOpen={isSideBarOpen}
          toggleSidebar={toggleSidebar}
          isNavbar={true}
        />
      </section>
      <HeroSection />
      <section className="z-0 flex w-full flex-1 flex-col items-center justify-center gap-4 lg:py-8">
        <SearchComponentBar
          translation_page="home"
          placeholder="page.search_placeholder"
          inputClassName="py-6 rounded-md bg-gray-200 text-ellipsis"
        />
      </section>
      <section className="grid w-full grid-cols-2 gap-6 py-8 text-center md:grid-cols-4 md:text-left">
        {Array.isArray(stats) &&
          stats.map(item => (
            <div
              key={item.label}
              className="flex flex-col items-center md:items-start"
            >
              <AnimatedCounter
                value={item.value}
                suffix={item.suffix}
                damping={30}
                className="text-dark text-2xl will-change-transform lg:text-4xl dark:text-white"
              />
              <p className="text-gray-400 lg:text-lg dark:text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
      </section>
      <span className="my-8 h-0.5 w-full bg-gray-200 dark:bg-gray-800" />
      <WorkflowSection />
      <span className="my-8 h-0.5 w-full bg-gray-200 dark:bg-gray-800" />
      <GallerySection />
    </main>
  );
}
