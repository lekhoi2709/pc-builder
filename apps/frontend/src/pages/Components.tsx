import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetCatalogStats, GetComponents } from '../services/api';
import { ComponentCard } from '../components/ComponentCard';
import { memo, useEffect } from 'react';
import React from 'react';
import ActiveFilters from '../components/ActiveFilters';
import { useParams } from 'react-router';
import ComponentFilter from '../components/ComponentFilter';
import type {
  ComponentFilter as CatalogFilters,
  ComponentResponse,
  PaginationMeta,
} from '../types/components';
import { twMerge } from 'tailwind-merge';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SideBarButton from '../components/SideBarButton';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { CardSkeleton } from '../components/Skeleton';
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';
import { useUIStore } from '../stores/uiStore';
import SearchComponentBar from '../components/SearchComponentBar';

const componentPageQuery = (
  filters: CatalogFilters,
  pagination: PaginationMeta,
  lang?: string,
  after?: string
) =>
  queryOptions({
    // Prefetch fills the numbered page cache so navigation can reuse it.
    queryKey: ['components', filters, pagination, lang],
    queryFn: () => GetComponents(filters, pagination, lang, after),
    staleTime: 5 * 60 * 1000,
  });

export default function Components() {
  const { lang } = useParams();
  const { t } = useTranslation('component');
  const { filters, pagination, clearFilters } = useFiltersFromURL();
  const queryClient = useQueryClient();
  const { pageSize } = useResponsivePagination();

  const statsFilters = { ...filters, sort_by: undefined, sort_order: undefined };
  const statsQuery = useQuery({
    queryKey: ['component-stats', statsFilters, lang],
    queryFn: ({ signal }) => GetCatalogStats(statsFilters, lang, signal),
  });

  const componentQuery = useQuery({
    ...componentPageQuery(filters, { ...pagination, page_size: pageSize }, lang),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });

  useEffect(() => {
    const current = componentQuery.data?.pagination;
    if (
      componentQuery.isPlaceholderData ||
      !current?.has_next
    ) {
      return;
    }

    void queryClient.prefetchQuery(
      componentPageQuery(
        filters,
        { current_page: current.current_page + 1, page_size: pageSize },
        lang,
        current.next_cursor
      )
    );
  }, [componentQuery.data, componentQuery.isPlaceholderData, filters, pageSize, lang, queryClient]);

  if (componentQuery.isLoading && !componentQuery.data) {
    return (
      <ComponentPageLayout
        props={{
          data: undefined,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </ComponentPageLayout>
    );
  }

  if (componentQuery.isError || statsQuery.isError) {
    return (
      <ComponentPageLayout
        props={{
          data: undefined,
        }}
      >
        <div className="z-0 col-span-full flex min-h-80 w-full flex-col items-center justify-center gap-4 border border-[#cfaaa4] bg-[#fff9f5] p-8 text-center text-[#94483f] dark:bg-[#302722] dark:text-[#f2bdb4]">
          <p className="text-lg font-medium">{t('page.load_error')}</p>
          <button type="button" onClick={() => {
            if (componentQuery.isError) void componentQuery.refetch();
            if (statsQuery.isError) void statsQuery.refetch();
          }} className="mt-2 min-h-11 bg-[#111c1a] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#34483c] dark:bg-[#d1ff52] dark:text-[#111c1a] dark:hover:bg-[#e1ff91]">{t('page.retry')}</button>
        </div>
      </ComponentPageLayout>
    );
  }

  const page = componentQuery.data;
  const stats = statsQuery.data;
  const data: ComponentResponse | undefined = page && stats
    ? {
        ...page,
        summary: stats.summary,
        pagination: {
          ...page.pagination,
          total_records: stats.total_records,
          total_pages: Math.ceil(stats.total_records / pageSize),
        },
      }
    : undefined;
  const hasFilters = Boolean(filters.search || filters.category_id?.length || filters.brand_id?.length || filters.min_price || filters.max_price);

  return (
    <ComponentPageLayout
      props={{
        data: data,
      }}
    >
      {page && page.components.length
        ? page.components.map(component => (
            <ComponentCard key={component.id} component={component} />
          ))
        : <div className="col-span-full flex min-h-80 flex-col items-start justify-center border border-[#aab6a6] bg-[#e8ebdf] px-8 py-12 dark:border-[#506353] dark:bg-[#243229] sm:px-12">
            <span className="font-mono text-xs uppercase tracking-[.2em] text-[#658338] dark:text-[#d1ff52]">00 / {t('page.results_title')}</span>
            <h3 className="mt-7 max-w-xl font-display text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{t(hasFilters ? 'page.empty_title' : 'page.empty_catalog_title')}</h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#536056] dark:text-[#b5c5b6]">{t(hasFilters ? 'page.empty' : 'page.empty_catalog')}</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="mt-8 min-h-11 bg-[#111c1a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#34483c] dark:bg-[#d1ff52] dark:text-[#111c1a] dark:hover:bg-[#e1ff91]">{t('filter.action.clear')}</button>}
          </div>}
    </ComponentPageLayout>
  );
}

const useResponsivePagination = () => {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  if (isDesktop) return { delta: 3, pageSize: 12 };
  if (isTablet) return { delta: 1, pageSize: 6 };
  return { delta: 0, pageSize: 4 };
};

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  delta: number;
  setPagination: (pagination: Partial<PaginationMeta>) => void;
};

const Pagination = React.memo(
  ({ totalPages, currentPage, delta, setPagination }: PaginationProps) => {
    return (
      <div className="flex gap-1">
        {renderPageNumbers(totalPages, currentPage, setPagination, delta)}
      </div>
    );
  }
);

const renderPageNumbers = (
  totalPages: number,
  currentPage: number,
  setPagination: (pagination: Partial<PaginationMeta>) => void,
  delta: number = 2
) => {
  const startPage = Math.max(2, currentPage - delta);
  const endPage = Math.min(totalPages - 1, currentPage + delta);

  const pages: (number | string)[] = [1];

  if (startPage > 2) pages.push('...');
  for (let i = startPage; i <= endPage; i++) pages.push(i);
  if (endPage < totalPages - 1) pages.push('...');

  if (totalPages > 1) pages.push(totalPages);
  return pages.map((page, idx) =>
    page === '...' ? (
      <span
        key={`ellipsis-${idx}`}
        className="px-2 text-[#718188]"
      >
        ...
      </span>
    ) : (
      <button
        key={page}
        onClick={() => {
          setPagination({ current_page: page as number });
        }}
        className={twMerge(
          'min-h-11 min-w-11 cursor-pointer border px-4 py-2 font-mono text-sm transition-colors hover:border-[#111c1a] hover:bg-[#e1f2b5] dark:hover:border-[#d1ff52] dark:hover:bg-[#314437]',
          currentPage === page
            ? 'border-[#111c1a] bg-[#111c1a] text-[#d1ff52] dark:border-[#d1ff52] dark:bg-[#314437]'
            : 'border-[#bac6b5] bg-transparent text-[#111c1a] dark:border-[#506353] dark:text-[#edf3e7]'
        )}
      >
        {page}
      </button>
    )
  );
};

type ComponentPageLayoutProps = {
  data?: ComponentResponse;
};

const ComponentPageLayout = memo(
  ({
    children,
    props,
  }: {
    props: ComponentPageLayoutProps;
    children: React.ReactNode;
  }) => {
    const { pagination, setPagination } = useFiltersFromURL();
    const { delta } = useResponsivePagination();
    const { isSideBarOpen, isFilterOpen, toggleSidebar, toggleFilter } =
      useUIStore();
    const { t } = useTranslation('component');

    const isDesktop = useMediaQuery('(min-width: 1280px)');

    return (
      <main
        id="top"
        className="z-0 min-h-screen w-full bg-[#f2f3eb] text-[#111c1a] dark:bg-[#18251e] dark:text-[#edf3e7]"
      >
        <ComponentFilter
          data={props.data}
          isSideBarOpen={isDesktop ? isSideBarOpen : isFilterOpen}
        />
        <div
          className={twMerge(
            'z-0 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-7 px-5 pb-16 pt-28 sm:px-8 xl:pt-16 xl:transition-[padding] xl:duration-300 xl:ease-out motion-reduce:transition-none',
            isDesktop && isSideBarOpen && 'xl:pl-[22.5%]'
          )}
        >
          <header className="flex flex-col gap-6 border-b border-[#aab6a6] pb-9 dark:border-[#506353] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-[#658338] dark:text-[#d1ff52]">01 / {t('page.eyebrow')}</p>
              <h1 className="font-display text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">{t('page.title')}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#536056] dark:text-[#b5c5b6] sm:text-base">{t('page.description')}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden font-mono text-xs text-[#536056] dark:text-[#b5c5b6] sm:inline">
                {props.data?.summary.total_components ?? '—'} {t('page.count_label')}
              </span>
              <SideBarButton
                isSideBarOpen={isSideBarOpen}
                toggleSidebar={toggleSidebar}
                disabled={!props.data}
                className="hidden border-[#111c1a] bg-[#d1ff52] text-[#111c1a] xl:flex"
              />
            </div>
          </header>
          <div className="flex flex-col gap-4">
            <div className="max-w-2xl">
              <SearchComponentBar
                className="border border-[#aab6a6] bg-white dark:border-[#506353] dark:bg-[#243229] dark:text-[#edf3e7]"
                inputClassName="h-14 rounded-none border-0 bg-transparent px-4 text-sm dark:text-[#edf3e7] dark:placeholder:text-[#aabdaf]"
              />
            </div>
            <button
              onClick={toggleFilter}
              type="button"
              aria-expanded={isFilterOpen}
              aria-controls="filter-panel"
              disabled={!props.data}
              className="inline-flex h-11 w-fit cursor-pointer items-center gap-2 self-end border border-[#111c1a] bg-[#d1ff52] px-5 text-sm font-semibold text-[#111c1a] transition-colors hover:bg-[#e1ff91] disabled:cursor-not-allowed disabled:opacity-45 xl:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />{t('filter.title')}
            </button>
            {props.data ? <ActiveFilters /> : null}
          </div>
          <section className="w-full" aria-labelledby="component-results-title">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="component-results-title" className="font-mono text-[11px] uppercase tracking-[.2em] text-[#536056] dark:text-[#b5c5b6]">{t('page.results_title')}</h2>
              <span className="font-mono text-xs text-[#536056] dark:text-[#b5c5b6] sm:hidden">
                {props.data?.summary.total_components ?? '—'} {t('page.count_label')}
              </span>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {children}
            </div>
          </section>
          <section className="mt-auto w-full self-center">
            {props.data && (props.data.pagination?.total_pages ?? 0) > 1 && (
              <div className="w-full">
                <p className="text-sm text-[#536056] dark:text-[#b5c5b6]">
                  {t('action.pagination.page')} {props.data.pagination.current_page} {t('action.pagination.of')} {props.data.pagination.total_pages}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setPagination({
                        ...pagination,
                        current_page: Math.max(1, pagination.current_page - 1),
                      });
                    }}
                    disabled={pagination.current_page <= 1}
                    aria-label={t('action.pagination.previous')}
                    className="h-11 w-11 cursor-pointer border border-[#bac6b5] bg-white text-[#111c1a] transition-colors hover:border-[#658338] hover:bg-[#e1f2b5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#506353] dark:bg-[#243229] dark:text-[#edf3e7] dark:hover:border-[#d1ff52] dark:hover:bg-[#314437]"
                  >
                    <ArrowLeft className="mx-auto h-4 w-4" strokeWidth={1.8} />
                  </button>
                  <Pagination
                    totalPages={props.data.pagination.total_pages!}
                    currentPage={pagination.current_page}
                    delta={delta}
                    setPagination={setPagination}
                  />
                  <button
                    onClick={() => {
                      setPagination({
                        ...pagination,
                        current_page: Math.min(
                          props.data?.pagination.total_pages ?? 0,
                          pagination.current_page + 1
                        ),
                      });
                    }}
                    disabled={
                      pagination.current_page >=
                      props.data.pagination.total_pages!
                    }
                    aria-label={t('action.pagination.next')}
                    className="h-11 w-11 cursor-pointer border border-[#bac6b5] bg-white text-[#111c1a] transition-colors hover:border-[#658338] hover:bg-[#e1f2b5] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#506353] dark:bg-[#243229] dark:text-[#edf3e7] dark:hover:border-[#d1ff52] dark:hover:bg-[#314437]"
                  >
                    <ArrowRight className="mx-auto h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }
);
