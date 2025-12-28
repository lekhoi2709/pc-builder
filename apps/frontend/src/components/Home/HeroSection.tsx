import { twMerge } from 'tailwind-merge';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ className }: { className?: string }) {
  return (
    <section
      className={twMerge(
        'overflow-x-hidden py-12 lg:py-20 xl:px-8 xl:pt-40',
        className
      )}
    >
      <div className="xl:grid-cols-15 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 xl:px-4">
        <div className="flex flex-col gap-8 lg:col-span-5 xl:col-span-7">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tighter md:text-6xl lg:text-7xl dark:text-white">
              Precision.
              <br />
              <span className="text-accent-500">Performance.</span>
              <br />
              Perfection.
            </h1>
            <p className="max-w-md text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
              Crafting bespoke workstations for the discerning enthusiast.
              Experience the art of PC building with architectural precision.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary bg-accent-400 hover:bg-accent-500 flex h-12 cursor-pointer items-center justify-center rounded-lg px-8 text-sm font-bold tracking-wide text-white shadow-[0_0_20px_rgba(17,82,212,0.3)] transition-all">
              Enter the Studio
            </button>
            <button className="bg-dark-elevated flex h-12 cursor-pointer items-center justify-center rounded-lg px-8 text-sm font-bold tracking-wide text-white transition-all">
              View Gallery
            </button>
          </div>
        </div>
        <div className="group relative lg:col-span-7 xl:col-span-8">
          <div className="bg-primary/20 pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full blur-[100px]"></div>
          <div className="aspect-4/3 relative w-full overflow-hidden rounded-xl border border-[#232f48]/50 shadow-2xl">
            <img
              className="h-full w-full transform bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              alt="Close up of a high-end custom PC build with vibrant RGB lighting and liquid cooling tubes in a dark environment"
              src="/home/tao-yuan-pc-image.jpg"
            />
            <div className="bg-light-elevated/80 dark:border-dark-elevated dark:bg-dark/80 absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-lg border border-transparent p-4 backdrop-blur-md">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Featured Build
                </p>
                <p className="text-dark font-medium dark:text-white">
                  Obsidian Flow / RTX 4090
                </p>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
