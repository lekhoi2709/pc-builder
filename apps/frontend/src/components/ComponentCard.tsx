import { ArrowUpRightIcon, CpuIcon } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import type { Component } from '../types/components';
import getLocalizedPrice from '../utils/getLocalizedPrice';

export const ComponentCard = ({ component }: { component: Component }) => {
  const { lang = 'vn' } = useParams();
  const { price } = getLocalizedPrice(component.price, lang);

  return (
    <NavLink
      to={component.id}
      aria-label={`${component.name}${price ? `, ${price}` : ''}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden border border-[#c7d1c3] bg-white text-[#111c1a] transition duration-200 hover:-translate-y-1 hover:border-[#111c1a] hover:shadow-[0_22px_40px_-28px_rgba(17,28,26,.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#658338] dark:border-[#435547] dark:bg-[#243229] dark:text-[#edf3e7] dark:hover:border-[#d1ff52] dark:focus-visible:outline-[#d1ff52]"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#eef0e7] p-6 dark:bg-[#1c2921] sm:h-64">
        {component.image_url[0] ? (
          <img
            src={component.image_url[0]}
            alt={component.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <CpuIcon className="h-12 w-12 text-[#859483]" strokeWidth={1.3} />
        )}
        <span className="absolute right-4 top-4 grid h-9 w-9 translate-y-1 place-items-center bg-[#d1ff52] text-[#111c1a] opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex min-h-32 flex-1 flex-col justify-between p-5">
        <h2 className="line-clamp-2 font-display text-sm font-semibold leading-6 sm:text-base">
          {component.name}
        </h2>
        <p className="mt-4 border-t border-[#e0e5db] pt-4 font-mono text-sm font-semibold text-[#415d17] dark:border-[#435547] dark:text-[#d1ff52]">{price}</p>
      </div>
    </NavLink>
  );
};
