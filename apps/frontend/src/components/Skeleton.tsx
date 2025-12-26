import { motion } from 'framer-motion';

function SkeletonBox({ className = '' }) {
  return (
    <motion.div
      className={`dark:bg-accent-100/50 bg-accent-400/20 rounded ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      className="border-secondary-300 hover:border-secondary-400 dark:border-secondary-500 bg-secondary-500/20 dark:bg-secondary-600/20 flex h-96 w-[18rem] max-w-[18rem] flex-col justify-between rounded-2xl border p-4 backdrop-blur-xl hover:cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SkeletonBox className="h-60 min-h-60 w-full rounded-xl" />
      <SkeletonText lines={2} />
      <div className="mt-4 flex gap-2 self-end">
        <SkeletonBox className="h-4 w-36" />
      </div>
    </motion.div>
  );
}

export function ListFilterSkeleton() {
  return (
    <motion.div
      className="flex w-full flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <SkeletonBox className="rounded-4xl mb-4 h-10 w-full" />
      <SkeletonBox className="my-2 h-4 w-32" />
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-8 w-20 rounded" />
        ))}
      </div>
      <SkeletonBox className="mb-2 mt-6 h-4 w-20" />
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox key={i} className="w-22 h-8 rounded" />
        ))}
      </div>
      <SkeletonBox className="mb-2 mt-6 h-4 w-36" />
      <SkeletonBox className="mb-2 h-10 w-full" />
      <div className="mb-2 flex items-center gap-2">
        <SkeletonBox className="h-8 w-full" />
        <SkeletonBox className="h-8 w-full" />
      </div>
      <SkeletonBox className="h-8 w-full" />
    </motion.div>
  );
}
