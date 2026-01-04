import { CheckCircle2Icon, HammerIcon } from 'lucide-react';

export default function BuilderSection() {
  return (
    <section className="lg:px-30 py-12">
      <div className="dark:bg-[#151c2a]/98 relative overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800">
        <div className="bg-size-[40px_40px] absolute inset-0 w-full bg-[linear-gradient(#232f48_1px,transparent_1px),linear-gradient(90deg,#232f48_1px,transparent_1px)] opacity-10 dark:bg-[linear-gradient(#cad5e2_1px,transparent_1px),linear-gradient(90deg,#cad5e2_1px,transparent_1px)]"></div>
        <div className="relative z-10 grid grid-cols-1 items-center gap-10 p-8 md:grid-cols-2 md:p-16">
          <div className="order-2 md:order-1">
            <div className="mb-6 flex items-center gap-4">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-700 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-700"></span>
              </span>
              <span className="font-mono text-sm uppercase tracking-widest text-blue-700">
                System Online
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-5xl">
              Engineering The Future
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-400">
              Our bespoke PC builder tool, 'The Studio', allows you to validate
              compatibility in real-time. Visualize your rig with CAD-like
              precision before you buy.
            </p>
            <ul className="mb-10 space-y-4">
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
                <CheckCircle2Icon className="w-5 text-blue-700" />
                <span>Real-time wattage calculation</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
                <CheckCircle2Icon className="w-5 text-blue-700" />
                <span>AI-assisted bottleneck detection</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
                <CheckCircle2Icon className="w-5 text-blue-700" />
                <span>Automatic cooling optimization</span>
              </li>
            </ul>
            <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-4 font-bold text-[#111722] transition-colors hover:bg-gray-100 dark:border-0">
              <HammerIcon className="fill-dark w-5" />
              Open The Builder
            </button>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <div className="border-accent-400 dark:border-accent-500 relative flex aspect-square w-full max-w-md items-center justify-center rounded-full border bg-transparent backdrop-blur-sm md:p-8">
              <svg
                className="absolute inset-0 h-full w-full animate-[spin_10s_linear_infinite]"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 100, 20
               C 120, 20, 140, 30, 155, 45
               C 170, 60, 180, 80, 180, 100
               C 180, 120, 170, 140, 155, 155
               C 140, 170, 120, 180, 100, 180
               C 80, 180, 60, 170, 45, 155
               C 30, 140, 20, 120, 20, 100
               C 20, 80, 30, 60, 45, 45
               C 60, 30, 80, 20, 100, 20 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-accent-200 z-0"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
                  }}
                />
              </svg>
              <div className="border-accent-300 dark:border-accent-400 absolute inset-4 rounded-full border border-dashed"></div>
              <img
                alt="Abstract representation of a PC internal component layout"
                className="h-4/4 w-4/4 object-contain opacity-80 mix-blend-screen grayscale"
                data-alt="Abstract stylized diagram of computer parts floating in a circular layout"
                src="/home/case.png"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
