import { twMerge } from 'tailwind-merge';

export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={twMerge('animate-pulse bg-[#e0e6d9] motion-reduce:animate-none dark:bg-[#314238]', className)} />;
}

export function SkeletonText({ lines = 1, className = '', boxClassName = '' }: { lines?: number; className?: string; boxClassName?: string }) {
  return <div className={twMerge('space-y-2', className)}>{Array.from({ length: lines }, (_, i) => <SkeletonBox key={i} className={twMerge(`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`, boxClassName)} />)}</div>;
}

export function CardSkeleton() {
  return <div className="flex w-full flex-col overflow-hidden border border-[#c7d1c3] bg-white p-4 dark:border-[#435547] dark:bg-[#243229]">
    <SkeletonBox className="h-48 w-full sm:h-56" />
    <SkeletonText lines={2} className="mt-4" />
    <SkeletonBox className="mt-5 h-4 w-24 self-end" />
  </div>;
}

export function ListFilterSkeleton() {
  return <div className="flex w-full flex-col gap-4">
    <SkeletonBox className="h-5 w-32" />
    <div className="flex flex-wrap gap-2">{Array.from({ length: 5 }, (_, i) => <SkeletonBox key={i} className="h-10 w-20" />)}</div>
    <SkeletonBox className="mt-4 h-5 w-24" />
    <div className="flex flex-wrap gap-2">{Array.from({ length: 6 }, (_, i) => <SkeletonBox key={i} className="h-10 w-20" />)}</div>
    <SkeletonBox className="mt-4 h-10 w-full" />
  </div>;
}
