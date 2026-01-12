import { ChevronDown, HeadsetIcon, MessagesSquareIcon } from 'lucide-react';
import { NavLink } from 'react-router';

export default function CommunitySection() {
  return (
    <section className="lg:px-30 w-full py-12 md:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="mb-4 text-3xl font-bold">Support &amp; Community</h2>
          <p className="mb-8 text-gray-400">
            Join a network of elite builders and get answers from our dedicated
            engineering team.
          </p>
          <div className="flex flex-col gap-4">
            <NavLink
              className="hover:border-primary-200/50 bg-primary-100/50 border-primary-100 group flex items-center rounded-lg border p-4 transition-all dark:border-[#232f48] dark:bg-[#151c2a]"
              to="#"
            >
              <div className="text-primary text-accent-400 group-hover:text-accent-300 dark:bg-dark-elevated bg-primary-100 mr-4 rounded p-2 transition-colors">
                <MessagesSquareIcon />
              </div>
              <div>
                <h4 className="text-sm font-bold">Community Forum</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Discuss builds and specs
                </p>
              </div>
            </NavLink>
            <NavLink
              className="hover:border-primary-200/50 bg-primary-100/50 border-primary-100 group flex items-center rounded-lg border p-4 transition-all dark:border-[#232f48] dark:bg-[#151c2a]"
              to="#"
            >
              <div className="text-primary text-accent-400 group-hover:text-accent-300 dark:bg-dark-elevated bg-primary-100 mr-4 rounded p-2 transition-colors">
                <HeadsetIcon />
              </div>
              <div>
                <h4 className="text-sm font-bold">Priority Support</h4>
                <p className="mt-1 text-xs text-gray-500">
                  24/7 technical assistance
                </p>
              </div>
            </NavLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <h3 className="mb-6 text-xl font-bold">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="[&amp;_summary::-webkit-details-marker]:hidden group rounded-lg border border-gray-300 dark:border-[#232f48] dark:bg-[#151c2a]">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4">
                <h4 className="font-medium">
                  What is the turnaround time for a custom loop build?
                </h4>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm leading-relaxed text-gray-400">
                Standard air-cooled builds ship within 5-7 business days. Custom
                liquid cooling solutions require rigorous leak testing and
                bleeding, typically taking 10-14 business days to ensure
                perfection.
              </div>
            </details>
            <details className="[&amp;_summary::-webkit-details-marker]:hidden group rounded-lg border border-gray-300 dark:border-[#232f48] dark:bg-[#151c2a]">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4">
                <h4 className="font-medium">
                  Do you offer international shipping?
                </h4>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm leading-relaxed text-gray-400">
                Yes, we ship globally using reinforced wooden crates for maximum
                protection. International duties and taxes are calculated at
                checkout.
              </div>
            </details>
            <details className="[&amp;_summary::-webkit-details-marker]:hidden group rounded-lg border border-gray-300 dark:border-[#232f48] dark:bg-[#151c2a]">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4">
                <h4 className="font-medium">
                  Can I send in my own components?
                </h4>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm leading-relaxed text-gray-400">
                Currently, we only build with components sourced directly
                through our partners to guarantee warranty coverage and
                component integrity.
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
