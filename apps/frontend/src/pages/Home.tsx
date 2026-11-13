import { ArrowUpRight, SearchIcon, SlidersHorizontalIcon, ScanSearchIcon } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Home/HeroSection';

const steps = [SearchIcon, SlidersHorizontalIcon, ScanSearchIcon];

export default function Home() {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('home');

  return (
    <main id="top" className="w-full bg-[#f2f3eb] text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7]">
      <HeroSection />

      <section
        className="px-5 py-24 md:px-10 lg:px-16 lg:py-32"
        data-moment="iris-opens"
        data-moment-opts='{"from":"base"}'
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[.2em] text-[#5e8121] dark:text-[#d1ff52]">02 / {t('page.section_eyebrow')}</p>
              <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl">
                {t('page.section_title')}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-[#536056] dark:text-[#b5c5b6] lg:col-span-5 lg:col-start-8">
              {t('page.section_desc')}
            </p>
          </div>

          <div className="mt-20 grid border-t border-[#a9b5a4] dark:border-[#506353] md:grid-cols-3">
            {steps.map((Icon, index) => (
              <article key={index} className="group min-h-72 border-b border-[#a9b5a4] px-1 py-7 dark:border-[#506353] md:border-b-0 md:border-r md:px-8 first:md:pl-0 last:md:border-r-0">
                <div className="flex items-start justify-between"><p className="font-mono text-xs text-[#668033] dark:text-[#d1ff52]">0{index + 1}</p><Icon className="h-7 w-7 text-[#658338] dark:text-[#d1ff52]" strokeWidth={1.4} /></div>
                <h3 className="mt-16 font-display text-2xl font-semibold tracking-[-0.04em]">{t(`page.steps.${index}.title`)}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[#536056] dark:text-[#b5c5b6]">
                  {t(`page.steps.${index}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-[65svh] items-center bg-[#d1ff52] px-5 py-24 text-[#111c1a] md:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[.2em]">03 / {t('page.close_eyebrow')}</p>
            <h2 className="max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-[-0.065em] sm:text-6xl">
              {t('page.close_title')}
            </h2>
          </div>
          <NavLink
            className="group inline-flex h-14 shrink-0 items-center gap-6 bg-[#111c1a] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#34483c]"
            to={`/${lang}/components`}
          >
            {t('page.primary_btn')}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </NavLink>
        </div>
      </section>
    </main>
  );
}
