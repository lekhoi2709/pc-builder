import { twMerge } from 'tailwind-merge';
import SideBarButton from '../components/SideBarButton';
import { useExclusivePanel } from '../stores/exclusivePanelStore';
import HeroSection from '../components/Home/HeroSection';
// import { motion, useInView, type Variants } from 'framer-motion';
// import { useRef } from 'react';
import SearchComponentBar from '../components/SearchComponentBar';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from '../components/Home/AnimatedCounter';

export default function Home() {
  const { isSideBarOpen, toggleSidebar } = useExclusivePanel();
  const { t } = useTranslation('home');
  // const figureRef = useRef(null);
  // const figureInView = useInView(figureRef, {
  //   once: true,
  //   amount: 0.3,
  // });

  // const containerVariants: Variants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2,
  //       delayChildren: 0.1,
  //     },
  //   },
  // };

  // const itemVariants: Variants = {
  //   hidden: {
  //     y: 100,
  //     opacity: 0,
  //   },
  //   visible: {
  //     y: 0,
  //     opacity: 1,
  //     transition: {
  //       type: 'spring',
  //       damping: 12,
  //       stiffness: 100,
  //     },
  //   },
  // };

  const stats = t('page.stats', { returnObjects: true });

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
        <span className="ml-2 flex items-center gap-2">
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
      <section className="z-0 flex w-full flex-1 flex-col items-center justify-center gap-4 lg:p-8 xl:px-12">
        <SearchComponentBar
          translation_page="home"
          placeholder="page.search_placeholder"
          inputClassName="py-6 rounded-md bg-gray-200 text-ellipsis"
        />
      </section>
      <section className="grid w-full grid-cols-2 gap-6 py-8 text-center md:grid-cols-4 md:p-8 md:text-left xl:px-12">
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
                className="text-dark text-2xl lg:text-4xl dark:text-white"
              />
              <p className="text-gray-400 lg:text-lg dark:text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
      </section>
    </main>
  );
}
