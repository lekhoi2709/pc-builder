import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CpuIcon,
  GpuIcon,
  MemoryStickIcon,
  ThermometerIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { twMerge } from 'tailwind-merge';

export default function GallerySection() {
  return (
    <section className="lg:px-30 w-full py-12 md:py-20">
      <div className="mb-10">
        <h2 className="text-dark dark:text-light mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          The Component Gallery
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-xl text-gray-500 dark:text-gray-400">
            Curated hardware treated as modern art objects. Select your palette
            from the world's finest manufacturers.
          </p>
          <NavLink
            to="/components"
            className="text-accent-400 dark:text-accent-300 flex items-center gap-2 text-base underline-offset-4 hover:underline hover:delay-75 md:text-sm"
          >
            <p>View full catalog</p>
            <ArrowRightIcon className="w-4 stroke-1" />
          </NavLink>
        </div>
      </div>
      <div className="grid w-full auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <figure className="bg-linear-to-br relative col-span-1 row-span-1 flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-300 from-gray-600 via-gray-800 to-black md:col-span-2 md:row-span-2 dark:border-slate-800">
          <img
            src="/home/mainboard.png"
            alt="Motherboard"
            className="h-full w-full rounded-xl object-cover object-center drop-shadow-2xl"
          />
          <div className="bg-linear-to-t absolute inset-0 rounded-xl from-[#111722] via-[#111722]/50 to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 w-full rounded-xl p-8">
            <span className="bg-primary-300/20 text-primary-300 mb-3 inline-block rounded px-3 py-1 text-xs font-bold">
              FLAGSHIP
            </span>
            <h3 className="mb-2 text-2xl font-bold text-white">
              Motherboard Architecture
            </h3>
            <p className="mb-4 max-w-sm text-sm text-gray-300">
              The foundation of extreme performance. Explore E-ATX boards with
              reinforced PCIe slots and premium VRM cooling.
            </p>
            <NavLink
              to={{
                pathname: 'components',
                search: '?category_id=mainboard',
              }}
              className="decoration-primary hover:text-primary text-sm font-bold text-white underline underline-offset-4 transition-colors"
            >
              Explore Motherboards
            </NavLink>
          </div>
        </figure>
        <ImageCard
          title="GPU Powerhouses"
          desc="RTX 5090."
          src="/home/gpu.png"
          alt="gpu"
          icon={<GpuIcon className="h-auto w-8 stroke-2 text-blue-700" />}
        />
        <ImageCard
          title="Thermal Solutions"
          desc="Custom loops &amp; AIOs."
          src="/home/aio.png"
          alt="aio"
          icon={
            <ThermometerIcon className="h-auto w-8 stroke-2 text-blue-700" />
          }
        />
        <ImageCard
          title="Processors"
          desc="Intel Core i9 &amp; AMD Ryzen 9 series available for pre-order."
          src="/home/cpu.jpg"
          alt="cpu"
          icon={<CpuIcon className="h-auto w-8 stroke-2 text-blue-700" />}
        />
        <ImageCard
          title="Memory &amp; Storage"
          desc="DDR5 High Speed Kits."
          src="/home/ram.webp"
          alt="ram"
          icon={
            <MemoryStickIcon className="h-auto w-8 stroke-2 text-blue-700" />
          }
        />
      </div>
    </section>
  );
}

type ImageCardProps = {
  className?: string;
  imgClassName?: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
  icon: ReactNode;
};

function ImageCard(props: ImageCardProps) {
  return (
    <motion.figure
      className={twMerge(
        'bg-linear-to-br relative cursor-pointer overflow-hidden rounded-xl border border-slate-300 from-gray-600 via-gray-800 to-black dark:border-slate-800',
        props.className
      )}
      initial="initial"
      whileHover="hover"
    >
      <div className="bg-linear-to-t absolute inset-0 z-10 rounded-xl from-[#111722] to-transparent"></div>
      <div className="absolute bottom-0 left-0 z-10 p-6">
        <p className="text-lg font-bold text-white">{props.title}</p>
        <p className="mt-1 text-xs text-gray-400">{props.desc}</p>
      </div>
      <img
        src={props.src}
        alt={props.alt}
        className={twMerge(
          'h-full w-full rounded-xl object-cover object-center drop-shadow-2xl',
          props.imgClassName
        )}
      />
      <motion.div
        className="bg-zinc-200/98 dark:bg-[#151c2a]/98 absolute inset-0 z-20 m-0 flex h-full w-full flex-col justify-between p-8"
        variants={{
          initial: { y: '100%' },
          hover: {
            y: 0,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          },
        }}
      >
        <div className="flex flex-col gap-6">
          {props.icon}
          <div>
            <h2 className="mb-2 text-lg font-bold text-black dark:text-white">
              {props.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {props.desc}
            </p>
          </div>
        </div>
        <span className="flex w-full items-center justify-between text-gray-400 dark:text-gray-600">
          <p className="text-sm uppercase">Updated today</p>
          <ArrowRightIcon className="w-4" />
        </span>
      </motion.div>
    </motion.figure>
  );
}
