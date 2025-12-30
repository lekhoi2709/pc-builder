import { useInView, motion, type Variants } from 'framer-motion';
import { CpuIcon, PuzzleIcon, BadgeCheckIcon } from 'lucide-react';
import { useRef } from 'react';

export default function WorkflowSection() {
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
      className="font-saira py-12 will-change-transform md:py-20"
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
