import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { GetBrands } from '../../services/api';

const brandOptions = { limit: 12, withLogo: true };

export default function ComponentBanner() {
  const { t } = useTranslation('home');
  const [paused, setPaused] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ['brands', brandOptions],
    queryFn: () => GetBrands(brandOptions),
  });
  const brands = data?.filter(brand => brand.is_active && brand.logo_url?.trim()).slice(0, brandOptions.limit) ?? [];
  const action = t(paused ? 'banner.resume' : 'banner.pause');
  const Icon = paused ? Play : Pause;

  if (isPending) return <div aria-hidden="true" className="h-20 border-y border-[#c7d1c3] bg-[#e8ebdf] dark:border-[#526354] dark:bg-[#26352d]" />;
  if (!brands.length) return null;

  return (
    <section aria-label={t('banner.label')} className="flex min-h-20 items-center border-y border-[#c7d1c3] bg-[#e8ebdf] text-[#3d5b10] dark:border-[#526354] dark:bg-[#26352d] dark:text-[#d1ff52]">
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="home-banner-track flex w-max" data-m-loop data-paused={paused}>
          {[false, true].map(copy => (
            <ul
              key={String(copy)}
              aria-hidden={copy || undefined}
              className="home-banner-row flex min-w-[100vw] shrink-0 items-center justify-around gap-3 px-3 py-3"
            >
              {brands.map(brand => (
                <li key={brand.id} className="grid h-14 w-28 shrink-0 place-items-center px-3">
                  <img src={brand.logo_url} alt={copy ? '' : brand.display_name || brand.name} className="home-brand-logo h-9 w-full object-contain text-xs text-[#111c1a] dark:text-[#edf3e7]" decoding="async" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused(value => !value)}
        aria-label={action}
        title={action}
        className="mx-2 grid size-11 shrink-0 place-items-center border border-current transition-colors hover:bg-[#d1ff52] hover:text-[#111c1a] focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:hidden sm:mx-4"
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
    </section>
  );
}
