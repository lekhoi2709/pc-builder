import { ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { lang = 'en' } = useParams();
  const { t } = useTranslation('common');

  return (
    <main id="top" className="flex min-h-[calc(100svh-77px)] items-center bg-[#f2f3eb] px-5 pb-20 pt-32 text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7] md:px-10 xl:px-16 xl:py-20">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <div aria-hidden="true" className="font-display text-[clamp(9rem,23vw,25rem)] font-semibold leading-none tracking-[-.13em] text-[#d5e6b9] dark:text-[#3e5840]">404</div>
        <div className="border-t border-[#aab6a6] pt-8 dark:border-[#506353] lg:pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#658338] dark:text-[#d1ff52]">{t('not_found.eyebrow')}</p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(3rem,5vw,5.5rem)] font-semibold leading-[1.03] tracking-[-.07em]">{t('not_found.title')}</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#536056] dark:text-[#b5c5b6]">{t('not_found.description')}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to={`/${lang}/`} className="group inline-flex min-h-12 items-center gap-7 bg-[#111c1a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#34483c] dark:bg-[#d1ff52] dark:text-[#111c1a] dark:hover:bg-[#e1ff91]">{t('not_found.home')} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
            <Link to={`/${lang}/components`} className="inline-flex min-h-12 items-center border border-[#aab6a6] px-5 text-sm font-semibold transition-colors hover:border-[#658338] hover:bg-[#e5f3c9] dark:border-[#506353] dark:hover:border-[#d1ff52] dark:hover:bg-[#314437]">{t('not_found.components')}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
