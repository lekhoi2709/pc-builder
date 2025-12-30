import { twMerge } from 'tailwind-merge';
import SideBarButton from '../components/SideBarButton';
import { useExclusivePanel } from '../stores/exclusivePanelStore';
import HeroSection from '../components/Home/HeroSection';
import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';
import SearchComponentBar from '../components/SearchComponentBar';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from '../components/Home/AnimatedCounter';
import { BadgeCheckIcon, CpuIcon, PuzzleIcon } from 'lucide-react';

export default function Home() {
  const { isSideBarOpen, toggleSidebar } = useExclusivePanel();
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
    </main>
  );
}

function WorkflowSection() {
  const workflowRef = useRef(null);
  const workflowInView = useInView(workflowRef, {
    once: true,
    amount: 0.2,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };
  return (
    <motion.section
      ref={workflowRef}
      variants={containerVariants}
      initial="hidden"
      animate={workflowInView ? 'visible' : 'hidden'}
      className="font-saira border-b border-gray-200 py-12 will-change-transform md:py-20 dark:border-gray-800"
    >
      <motion.div
        variants={itemVariants}
        className="mb-10 text-center will-change-transform md:mb-16"
      >
        <h2 className="text-dark dark:text-light mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          The Workflow
        </h2>
        <p className="mx-auto max-w-2xl px-4 text-gray-500 will-change-transform dark:text-gray-400">
          From concept to creation, our process ensures your build meets the
          highest standards of engineering.
        </p>
      </motion.div>
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 md:grid-cols-3 md:gap-8 md:px-0">
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-r via-accent-400 dark:via-accent-100 absolute left-[16%] right-[16%] top-12 z-0 hidden h-px from-transparent to-transparent will-change-transform md:block"
        ></motion.div>
        <motion.div
          variants={itemVariants}
          className="relative z-10 flex flex-col items-center text-center will-change-transform"
        >
          <div className="dark:hover:border-primary-500 hover:border-primary-200 bg-light-elevated group mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 shadow-lg transition-colors duration-300 md:mb-6 md:h-24 md:w-24 dark:border-[#232f48] dark:bg-[#151c2a]">
            <span className="material-symbols-outlined group-hover:text-primary text-3xl text-gray-300 transition-colors md:text-4xl">
              <CpuIcon className="dark:text-accent-100 text-accent-400" />
            </span>
          </div>
          <h3 className="text-dark dark:text-light mb-2 text-xl font-bold md:mb-3">
            Specification
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Select components from our curated gallery. Our system validates
            compatibility in real-time.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="relative z-10 flex flex-col items-center text-center will-change-transform"
        >
          <div className="dark:hover:border-primary-500 hover:border-primary-200 bg-light-elevated group mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 shadow-lg transition-colors duration-300 md:mb-6 md:h-24 md:w-24 dark:border-[#232f48] dark:bg-[#151c2a]">
            <span className="material-symbols-outlined group-hover:text-primary text-3xl text-gray-300 transition-colors md:text-4xl">
              <PuzzleIcon className="dark:text-accent-100 text-accent-400" />
            </span>
          </div>
          <h3 className="text-dark dark:text-light mb-2 text-xl font-bold md:mb-3">
            Assembly
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Certified technicians assemble your rig with white-glove precision
            and cable management.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="relative z-10 flex flex-col items-center text-center will-change-transform"
        >
          <div className="dark:hover:border-primary-500 hover:border-primary-200 bg-light-elevated group mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 shadow-lg transition-colors duration-300 md:mb-6 md:h-24 md:w-24 dark:border-[#232f48] dark:bg-[#151c2a]">
            <span className="material-symbols-outlined group-hover:text-primary text-3xl text-gray-300 transition-colors md:text-4xl">
              <BadgeCheckIcon className="dark:text-accent-100 text-accent-400" />
            </span>
          </div>
          <h3 className="text-dark dark:text-light mb-2 text-xl font-bold md:mb-3">
            Stress Testing
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Every system undergoes a 24-hour burn-in process to guarantee
            stability under load.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
