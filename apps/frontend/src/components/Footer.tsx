import { ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { GetHealth } from '../services/api';

export default function Footer() {
  const { lang = 'vn' } = useParams();
  const { t } = useTranslation('common');
  const health = useQuery({
    queryKey: ['health'],
    queryFn: GetHealth,
    retry: false,
    refetchInterval: 60_000,
  });
  const status = health.isPending ? 'checking' : health.isError ? 'unavailable' : 'online';

  return (
    <footer className="bg-[#111c1a] pb-7 pt-16 text-[#f1f4e9]">
      <div className="catalog-content mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-16 border-b border-[#3c4c44] pb-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d1ff52]">PC BUILDER / {t('footer.label')}</p>
            <h2 className="mt-7 max-w-4xl font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.97] tracking-[-0.07em]">{t('footer.title')}</h2>
          </div>
          <Link to={`/${lang}/components`} className="group flex h-16 w-fit items-center gap-8 bg-[#d1ff52] px-7 font-bold text-[#111c1a] transition-colors hover:bg-white">
            {t('nav.cta')} <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-10 py-10 md:flex-row">
          <div className="max-w-sm">
            <Link to={`/${lang}/`} className="font-display text-xl font-bold tracking-[-0.06em]">PC BUILDER<span className="text-[#d1ff52]">.</span></Link>
            <p className="mt-4 text-sm leading-7 text-[#aab9af]">{t('footer.description')}</p>
          </div>
          <nav className="flex flex-wrap items-start gap-x-8 gap-y-4 text-sm font-medium" aria-label={t('footer.navigation')}>
            <Link to={`/${lang}/`} className="hover:text-[#d1ff52]">{t('nav.home')}</Link>
            <Link to={`/${lang}/components`} className="hover:text-[#d1ff52]">{t('nav.components')}</Link>
            <Link to={`/${lang}/about`} className="hover:text-[#d1ff52]">{t('nav.about')}</Link>
            <a href="https://github.com/lekhoi2709/pc-builder" target="_blank" rel="noopener noreferrer" className="inline-flex gap-1 hover:text-[#d1ff52]">GitHub <ArrowUpRight className="h-3 w-3" /></a>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-[#3c4c44] pt-6 font-mono text-xs text-[#889a8d]">
          <span>© {new Date().getFullYear()} PC BUILDER</span>
          <span>{t('footer.note')}</span>
          <span className="inline-flex items-center gap-2 text-[#c1d0c4]" role="status">
            <span className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-[#d1ff52]' : status === 'unavailable' ? 'bg-[#f4a99d]' : 'bg-[#aab9af]'}`} aria-hidden="true" />
            {t(`footer.status.${status}`)}
          </span>
        </div>
      </div>
    </footer>
  );
}
