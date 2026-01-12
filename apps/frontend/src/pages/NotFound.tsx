import { CpuIcon, MoveRightIcon, TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <main className="font-saira max-w-screen -600 dark:-100 relative z-0 flex h-full min-h-screen w-screen flex-1 flex-col items-center justify-center bg-transparent p-8 px-4 py-12 md:px-16">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
        <h1 className="text-[25rem] font-black tracking-tighter">404</h1>
      </div>
      <div className="max-w-275 z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-8 text-center lg:order-1 lg:text-left">
          <div className="flex flex-col gap-4">
            <span className="text-accent-400 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest lg:justify-start">
              <TriangleAlertIcon className="h-4 w-4" />
              Error Connection Lost
            </span>
            <h1 className="text-5xl font-black leading-tight tracking-[-0.03em] md:text-6xl">
              Circuit Interrupted
            </h1>
            <p className="mx-auto max-w-lg text-lg font-normal leading-relaxed text-[#4c669a] md:text-xl lg:mx-0 dark:text-gray-400">
              It seems we've hit a dead end in the circuit. The page you are
              looking for has been moved, dismantled, or never existed in this
              build.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/"
              className="min-w-45 bg-accent-400 shadow-accent-400/20 hover:bg-accent-300 flex h-14 cursor-pointer items-center justify-center rounded-xl px-8 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Return Home
            </Link>
            <Link
              to="#"
              className="min-w-45 flex h-14 cursor-pointer items-center justify-center rounded-xl border border-[#e7ebf3] bg-white px-8 text-lg font-bold transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Build Guide
            </Link>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#4c669a] dark:text-gray-500">
              Quick Recovery Links
            </p>
            <div className="text-accent-400 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:justify-start">
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline"
                to="#"
              >
                Browse GPUs <MoveRightIcon className="h-4 w-4" />
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline"
                to="#"
              >
                CPU Benchmarks <MoveRightIcon className="h-4 w-4" />
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline"
                to="#"
              >
                Recent Builds <MoveRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="md:aspect-4/3 group relative aspect-square w-full lg:aspect-square">
            <div className="border-accent-400 pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-tr-3xl border-r-2 border-t-2"></div>
            <div className="border-accent-400 pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-bl-3xl border-b-2 border-l-2"></div>
            <div className="h-full w-full overflow-hidden rounded-2xl border-4 border-white bg-[#e7ebf3] shadow-2xl dark:border-gray-900 dark:bg-gray-800">
              <span className="flex h-full w-full flex-col justify-end bg-cover bg-center bg-no-repeat">
                <img
                  alt="Modern minimalist workspace with high-key lighting and a premium white PC case"
                  src="/home/404.avif"
                  className="h-full w-full transform bg-cover bg-center transition-transform duration-700 ease-out"
                />
                <div className="dark:bg-dark-elevated p-6">
                  <p className="text-xs uppercase italic tracking-widest opacity-80">
                    Status: System_Not_Found
                  </p>
                </div>
              </span>
            </div>
            <div className="max-w-50 absolute -bottom-6 -right-6 hidden rounded-xl border border-[#e7ebf3] bg-white p-4 shadow-xl sm:block md:right-8 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-accent-200/10 flex size-8 items-center justify-center rounded-full">
                  <CpuIcon className="text-accent-400 h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#4c669a] dark:text-gray-400">
                    Error Logic
                  </p>
                  <p className="dark: text-xs font-bold">Pin-Out Mismatch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
