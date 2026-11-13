import { ArrowUpRight } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('about');

  return (
    <main id="top" className="overflow-hidden bg-[#f2f3eb] text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7]">
      <section className="relative overflow-hidden bg-[#d1ff52] px-5 pb-0 pt-32 text-[#111c1a] dark:bg-[#243229] dark:text-[#edf3e7] md:px-10 xl:px-16 xl:pt-24">
        <div className="mx-auto grid max-w-[1600px] gap-12 xl:min-h-[680px] xl:grid-cols-[1.2fr_.8fr] xl:items-end">
          <div className="relative z-10 pb-16 xl:pb-24">
            <p className="font-mono text-[11px] uppercase tracking-[.22em] dark:text-[#d1ff52]">01 / {t('page.hero.eyebrow')}</p>
            <h1 className="mt-10 max-w-5xl font-display text-[clamp(3.4rem,7.3vw,8.5rem)] font-semibold leading-[.98] tracking-[-.08em]">{t('page.hero.title')}</h1>
            <p className="mt-9 max-w-xl text-base leading-8 md:text-lg">{t('page.hero.description')}</p>
            <NavLink to={`/${lang}/components`} className="group mt-10 inline-flex min-h-14 items-center gap-8 bg-[#111c1a] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#34483c] dark:bg-[#d1ff52] dark:text-[#111c1a] dark:hover:bg-[#e1ff91]">{t('page.hero.cta')} <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></NavLink>
          </div>
          <div className="relative flex min-h-72 items-end justify-center xl:h-full">
            <div className="absolute inset-0 rounded-full bg-white/25 blur-[90px] dark:bg-[#d1ff52]/10" />
            <img src="/home/mainboard.png" alt="" className="relative z-10 w-full max-w-[620px] translate-y-9 rotate-[-8deg] drop-shadow-[0_42px_30px_rgba(17,28,26,.3)]" />
            <span className="absolute bottom-8 right-0 z-20 bg-[#111c1a] px-4 py-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#d1ff52]">IDEA → REALITY</span>
          </div>
        </div>
      </section>
      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-32" aria-labelledby="story-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.65fr_1fr]">
          <div><p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#658338] dark:text-[#d1ff52]">02 / {t('page.story.eyebrow')}</p><h2 id="story-title" className="mt-7 max-w-lg font-display text-4xl font-semibold leading-[1.08] tracking-[-.06em] md:text-6xl">{t('page.story.title')}</h2></div>
          <div className="border-t border-[#aab6a6] dark:border-[#506353] lg:pt-0"><p className="border-b border-[#aab6a6] py-8 text-lg leading-9 dark:border-[#506353] md:text-2xl md:leading-10">{t('page.story.beginning')}</p><p className="py-8 text-base leading-8 text-[#536056] dark:text-[#b5c5b6] md:text-lg">{t('page.story.return')}</p></div>
        </div>
      </section>
      <section className="bg-[#111c1a] px-5 py-24 text-[#f2f4e9] md:px-10 lg:px-16 lg:py-32" aria-labelledby="today-title">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#d1ff52]">03 / {t('page.today.eyebrow')}</p><h2 id="today-title" className="mt-7 max-w-3xl font-display text-4xl font-semibold leading-[1.07] tracking-[-.06em] md:text-6xl">{t('page.today.title')}</h2></div><p className="max-w-lg text-base leading-8 text-[#b8c8b9]">{t('page.today.description')}</p></div>
          <div className="mt-20 grid border-t border-[#5a6b5c] md:grid-cols-3">{[0, 1, 2].map(index => <div key={index} className="min-h-64 border-b border-[#5a6b5c] py-8 md:border-b-0 md:border-r md:px-8 first:md:pl-0 last:md:border-r-0"><span className="font-mono text-xs text-[#d1ff52]">0{index + 1}</span><h3 className="mt-16 font-display text-2xl font-semibold tracking-[-.04em]">{t(`page.today.items.${index}.title`)}</h3><p className="mt-4 max-w-sm text-sm leading-7 text-[#b8c8b9]">{t(`page.today.items.${index}.description`)}</p></div>)}</div>
        </div>
      </section>
      <section className="px-5 py-24 md:px-10 lg:px-16 lg:py-32" aria-labelledby="future-title">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.8fr_1fr]">
          <div><p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#658338] dark:text-[#d1ff52]">04 / {t('page.future.eyebrow')}</p><h2 id="future-title" className="mt-7 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-[-.06em] md:text-6xl">{t('page.future.title')}</h2><p className="mt-7 max-w-lg text-base leading-8 text-[#536056] dark:text-[#b5c5b6]">{t('page.future.description')}</p></div>
          <ol className="border-t border-[#aab6a6] dark:border-[#506353]">{[0, 1, 2, 3].map(index => <li key={index} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#aab6a6] py-7 dark:border-[#506353]"><span className="font-mono text-xs text-[#658338] dark:text-[#d1ff52]">0{index + 1}</span><span className="font-display text-lg font-semibold tracking-[-.03em] md:text-2xl">{t(`page.future.items.${index}`)}</span></li>)}</ol>
        </div>
      </section>
    </main>
  );
}
