import { ArrowRightIcon } from 'lucide-react';

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
          <a
            href="#"
            className="text-accent-400 dark:text-accent-300 flex items-center gap-2 text-base md:text-sm"
          >
            <p>View full catalog</p>
            <ArrowRightIcon className="w-4 stroke-1" />
          </a>
        </div>
      </div>
      <div className="grid w-full auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <figure className="bg-linear-to-br relative col-span-1 row-span-1 flex w-full items-center justify-center overflow-hidden rounded-xl from-gray-600 via-gray-800 to-black md:col-span-2 md:row-span-2">
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
            <button className="decoration-primary hover:text-primary text-sm font-bold text-white underline underline-offset-4 transition-colors">
              Explore Motherboards
            </button>
          </div>
        </figure>
        <figure className="bg-linear-to-b relative flex items-center justify-center overflow-hidden rounded-xl from-gray-700 to-gray-900">
          <div className="bg-linear-to-t absolute inset-0 z-10 from-[#111722] to-transparent"></div>
          <div className="absolute bottom-0 left-0 z-10 p-6">
            <p className="text-lg font-bold text-white">GPU Powerhouses</p>
            <p className="mt-1 text-xs text-gray-400">RTX 5090</p>
          </div>
          <img
            src="/home/gpu.png"
            alt="Motherboard"
            className="rounded-xl object-cover object-center drop-shadow-2xl"
          />
        </figure>
        <figure className="bg-dark-elevated relative overflow-hidden rounded-xl">
          <div className="bg-linear-to-t absolute inset-0 z-10 from-[#111722] to-transparent"></div>
          <div className="absolute bottom-0 left-0 z-10 p-6">
            <p className="text-lg font-bold text-white">Thermal Solutions</p>
            <p className="mt-1 text-xs text-gray-400">
              Custom loops &amp; AIOs
            </p>
          </div>
          <img
            src="/home/aio.png"
            alt="Motherboard"
            className="rounded-xl object-cover object-center drop-shadow-2xl"
          />
        </figure>
        <figure className="relative overflow-hidden rounded-xl bg-transparent">
          <div className="bg-linear-to-t absolute inset-0 z-10 from-[#111722] to-transparent"></div>
          <div className="absolute bottom-0 left-0 z-10 p-6">
            <p className="text-lg font-bold text-white">Processors</p>
            <p className="mt-1 text-xs text-gray-400">
              Intel Core i9 &amp; AMD Ryzen 9 series available for pre-order.
            </p>
          </div>
          <img
            src="/home/cpu.jpg"
            alt="CPU"
            className="h-full rounded-xl object-cover object-center drop-shadow-2xl"
          />
        </figure>
        <figure className="bg-linear-to-br relative overflow-hidden rounded-xl from-gray-600 via-gray-800 to-black">
          <div className="bg-linear-to-t absolute inset-0 z-10 from-[#111722] to-transparent"></div>
          <div className="absolute bottom-0 left-0 z-10 p-6">
            <p className="text-lg font-bold text-white">Memory &amp; Storage</p>
            <p className="mt-1 text-xs text-gray-400">DDR5 High Speed Kits</p>
          </div>
          <img
            src="/home/ram.webp"
            alt="Motherboard"
            className="h-full w-full rounded-xl object-cover object-center drop-shadow-2xl"
          />
        </figure>
      </div>
    </section>
  );
}
