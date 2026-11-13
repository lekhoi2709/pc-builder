import { useQuery } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Search } from 'lucide-react';
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetComponents } from '../../services/api';
import getLocalizedPrice from '../../utils/getLocalizedPrice';

export default function HeroSection() {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('home');
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') ?? '');
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-catalog-preview', lang],
    queryFn: () => GetComponents({}, { current_page: 1, page_size: 4 }, lang),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const nextParams = new URLSearchParams(searchParams);
  if (term.trim()) nextParams.set('search', term.trim());
  else nextParams.delete('search');
  const query = nextParams.toString();
  const componentsPath = `/${lang}/components${query ? `?${query}` : ''}`;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#111c1a] px-5 pb-0 pt-28 text-[#f2f4e9] md:px-10 xl:min-h-[calc(100svh-76px)] xl:px-16 xl:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(#4b5e502e_1px,transparent_1px),linear-gradient(90deg,#4b5e502e_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="relative mx-auto grid max-w-[1600px] gap-10 xl:min-h-[calc(100svh-156px)] xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div className="relative z-10 pb-14 xl:py-20">
            <p className="mb-8 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[#d1ff52]"><span className="h-2 w-2 bg-[#d1ff52]" />{t('page.eyebrow')}</p>
            <h1 className="max-w-3xl font-display text-[clamp(3.4rem,7.2vw,8.3rem)] font-semibold leading-[.97] tracking-[-.075em]">{t('page.headline')}</h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-[#becbbf] md:text-lg">{t('page.desc')}</p>
            <form onSubmit={event => { event.preventDefault(); navigate(componentsPath); }} role="search" className="mt-9 max-w-xl">
              <label htmlFor="home-search" className="mb-3 block font-mono text-[11px] uppercase tracking-[.18em] text-[#d1ff52]">{t('page.search_label')}</label>
              <div className="flex min-h-16 items-center border border-[#667566] bg-[#26352d] transition-colors focus-within:border-[#d1ff52]">
                <Search className="ml-5 h-5 w-5 shrink-0 text-[#d1ff52]" strokeWidth={1.8} />
                <input id="home-search" type="search" value={term} onChange={event => setTerm(event.target.value)} placeholder={t('page.search_placeholder')} className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-[#9eafa2]" />
                <button type="submit" aria-label={t('page.search_action')} className="mr-2 grid h-12 w-12 shrink-0 place-items-center bg-[#d1ff52] text-[#111c1a] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ArrowUpRight className="h-5 w-5" /></button>
              </div>
            </form>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <NavLink to={componentsPath} className="group inline-flex min-h-14 w-fit items-center gap-8 bg-[#d1ff52] px-6 text-sm font-bold text-[#111c1a] transition-colors hover:bg-white">
                {t('page.primary_btn')} <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </NavLink>
              <span className="font-mono text-xs text-[#9eafa2]">{t('page.fact')}</span>
            </div>
          </div>
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden xl:h-full" aria-hidden="true">
            <div className="absolute h-[75%] w-[75%] rounded-full bg-[#b6e13f]/20 blur-[100px]" />
            <span className="absolute right-0 top-4 font-mono text-[10px] uppercase tracking-[.22em] text-[#9eafa2] xl:top-16">HARDWARE / 001</span>
            <img src="/home/gpu.png" alt="" className="relative z-10 w-[105%] max-w-none rotate-[-12deg] drop-shadow-[0_45px_35px_rgba(0,0,0,.6)] transition-transform duration-700 hover:rotate-[-8deg] xl:w-[135%]" />
            <span className="absolute bottom-5 right-0 font-mono text-[10px] uppercase tracking-[.22em] text-[#9eafa2]">EXPLORE THE PARTS <ArrowDownRight className="ml-2 inline h-4 w-4" /></span>
          </div>
        </div>
      </section>
      <section className="border-b border-[#d1d8c9] bg-[#e8ebdf] px-5 py-8 dark:border-[#506353] dark:bg-[#223128] md:px-10 lg:px-16" aria-label={t('page.preview_title')}>
        <div className="mx-auto grid max-w-[1600px] gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
          <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#668033]">01 / {t('page.preview_label')}</p><h2 className="mt-2 font-display text-xl font-semibold tracking-tight">{t('page.preview_title')}</h2></div>
          <div className="grid gap-px bg-[#bdc8b7] dark:bg-[#506353] sm:grid-cols-2 xl:grid-cols-4">
            {isLoading && Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse bg-[#f2f3eb] dark:bg-[#18251e]" />)}
            {!isLoading && !isError && data?.components.map(component => (
              <NavLink key={component.id} to={`/${lang}/components/${component.id}`} className="group flex min-w-0 items-center gap-3 bg-[#f2f3eb] p-3 transition-colors hover:bg-[#d1ff52] hover:text-[#111c1a] dark:bg-[#18251e]">
                <div className="grid h-20 w-20 shrink-0 place-items-center bg-white p-2">{component.image_url[0] && <img src={component.image_url[0]} alt="" className="h-full w-full object-contain" loading="lazy" />}</div>
                <span className="min-w-0"><span className="line-clamp-2 text-xs font-semibold leading-5">{component.name}</span><span className="mt-2 block font-mono text-[11px]">{getLocalizedPrice(component.price, lang).price}</span></span>
              </NavLink>
            ))}
            {!isLoading && (isError || !data?.components.length) && <div className="col-span-full flex min-h-24 items-center justify-between gap-4 bg-[#f2f3eb] px-5 text-sm text-[#506050] dark:bg-[#18251e] dark:text-[#b5c5b6]"><span>{t(isError ? 'page.preview_unavailable' : 'page.preview_empty')}</span><NavLink to={componentsPath} className="shrink-0 text-[#3a5c05] underline underline-offset-4 dark:text-[#d1ff52]">{t('page.primary_btn')}</NavLink></div>}
          </div>
        </div>
      </section>
    </>
  );
}
