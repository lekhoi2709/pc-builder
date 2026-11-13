import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Cpu } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetComponentById } from '../services/api';
import getLocalizedPrice from '../utils/getLocalizedPrice';

export function ComponentDetails() {
  const { componentId, lang = 'vn' } = useParams();
  const { t } = useTranslation('component');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const query = useQuery({
    queryKey: ['component', componentId],
    queryFn: () => GetComponentById(componentId!),
    enabled: Boolean(componentId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
  const component = query.data;
  const images = component?.image_url ?? [];
  const price = component ? getLocalizedPrice(component.price, lang).price : '';

  return (
    <main id="top" className="min-h-screen bg-[#f2f3eb] px-5 pb-24 pt-28 text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7] md:px-10 xl:px-16 xl:pt-16">
      <div className="mx-auto max-w-[1600px]">
        <Link to={`/${lang}/components`} className="group inline-flex min-h-11 items-center gap-3 font-mono text-xs uppercase tracking-[.15em] text-[#4c681c] hover:underline hover:underline-offset-4"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{t('page.back_to_catalog')}</Link>
        {query.isLoading && <div className="mt-10 grid animate-pulse gap-10 lg:grid-cols-2"><div className="aspect-square bg-[#e0e6d9] dark:bg-[#2c3a30]" /><div className="space-y-6"><div className="h-4 w-32 bg-[#e0e6d9] dark:bg-[#2c3a30]" /><div className="h-20 w-3/4 bg-[#e0e6d9] dark:bg-[#2c3a30]" /><div className="h-40 bg-[#e0e6d9] dark:bg-[#2c3a30]" /></div></div>}
        {query.isError && <div className="mt-10 flex min-h-80 flex-col items-center justify-center gap-6 border border-[#c7d1c3] bg-white p-8 text-center dark:border-[#435547] dark:bg-[#243229]"><p>{t('page.detail_load_error')}</p><button type="button" onClick={() => query.refetch()} className="min-h-11 bg-[#111c1a] px-6 text-sm font-semibold text-white hover:bg-[#34483c] dark:bg-[#d1ff52] dark:text-[#111c1a]">{t('page.retry')}</button></div>}
        {component && <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="grid aspect-square place-items-center border border-[#c7d1c3] bg-[#e8ece2] p-8 dark:border-[#435547] dark:bg-[#243229]">{images[selectedImageIndex] ? <img src={images[selectedImageIndex]} alt={component.name} className="h-full w-full object-contain" /> : <Cpu className="h-20 w-20 text-[#879a81]" strokeWidth={1} />}</div>
            {images.length > 1 && <div className="mt-3 flex flex-wrap gap-3" aria-label={t('page.images')}>
              {images.map((image, index) => <button key={image + index} type="button" onClick={() => setSelectedImageIndex(index)} aria-label={`${t('page.image')} ${index + 1}`} aria-pressed={selectedImageIndex === index} className={`grid h-20 w-20 place-items-center border bg-white p-2 transition-colors dark:bg-[#243229] ${selectedImageIndex === index ? 'border-[#111c1a] dark:border-[#d1ff52]' : 'border-[#c7d1c3] hover:border-[#658338] dark:border-[#435547]'}`}><img src={image} alt="" className="h-full w-full object-contain" loading="lazy" /></button>)}
            </div>}
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#658338] dark:text-[#d1ff52]">{t('page.detail_eyebrow')}</p>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,4.5vw,5.5rem)] font-semibold leading-[1.05] tracking-[-.065em]">{component.name}</h1>
            <div className="mt-9 flex flex-wrap items-end justify-between gap-4 border-y border-[#aab6a6] py-6 dark:border-[#506353]"><p className="font-mono text-2xl font-semibold text-[#3d5b10] dark:text-[#d1ff52] md:text-3xl">{price}</p><span className={`px-3 py-2 text-xs font-semibold ${component.in_stock ? 'bg-[#dff1bc] text-[#36560c]' : 'bg-[#f2d9d4] text-[#8d3e35]'}`}>{t(component.in_stock ? 'page.in_stock' : 'page.out_of_stock')}</span></div>
            {component.specs_map && Object.keys(component.specs_map).length > 0 && <section className="mt-12" aria-labelledby="specs-title"><h2 id="specs-title" className="font-display text-2xl font-semibold tracking-[-.04em]">{t('page.specifications')}</h2><dl className="mt-6 border-t border-[#aab6a6] dark:border-[#506353]">{Object.entries(component.specs_map).map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5 border-b border-[#cbd4c6] py-4 text-sm dark:border-[#435547]"><dt className="capitalize text-[#536056] dark:text-[#b5c5b6]">{key.replace(/_/g, ' ')}</dt><dd className="break-words font-medium">{String(value)}</dd></div>)}</dl></section>}
          </div>
        </div>}
      </div>
    </main>
  );
}
