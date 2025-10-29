import { useQuery } from '@tanstack/react-query';
import { GetComponents } from '../services/api';
import { ComponentCard } from '../components/ComponentCard';
import { useComponentStore } from '../stores/componentStore';
import { memo, useEffect, useState } from 'react';
import React from 'react';
import ActiveFilters from '../components/ActiveFilters';
import { useParams } from 'react-router';
import ComponentFilter from '../components/ComponentFilter';
import type { ComponentResponse, PaginationMeta } from '../types/components';
import { twMerge } from 'tailwind-merge';
import { motion, type Variants } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import SideBarButton from '../components/SideBarButton';
import { useExclusivePanel } from '../stores/exclusivePanelStore';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowIcon } from '../components/Icons/ArrowIcon';

export default function Components() {
  const { lang } = useParams();
  const { filters, pagination } = useComponentStore();

  const componentQuery = useQuery({
    queryKey: ['components', filters, pagination, lang],
    queryFn: () => GetComponents(filters, pagination, lang),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const listVariants: Variants = {
    collapse: {
      paddingLeft: 'var(--padding-left-from)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    expand: {
      paddingLeft: 'var(--padding-left-to)',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (componentQuery.isLoading && !componentQuery.data) {
    return (
      <ComponentPageLayout
        props={{
          data: undefined,
          listVariants: listVariants,
        }}
      >
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="mt-4 text-lg">Loading components...</p>
          </div>
        </div>
      </ComponentPageLayout>
    );
  }

  if (componentQuery.isError) {
    return (
      <ComponentPageLayout
        props={{
          data: undefined,
          listVariants: listVariants,
        }}
      >
        <div className="z-0 flex h-full w-full flex-col gap-4 p-8 text-center text-red-500">
          <p className="text-lg">Error loading components</p>
          <p className="text-sm">{componentQuery.error?.message}</p>
        </div>
      </ComponentPageLayout>
    );
  }

  const data = componentQuery.data;

  return (
    <ComponentPageLayout
      props={{
        data: data,
        listVariants: listVariants,
      }}
    >
      {data && data.components
        ? data.components.map(component => (
            <ComponentCard key={component.id} component={component} />
          ))
        : 'No Component Found'}
    </ComponentPageLayout>
  );
}

const useResponsivePagination = (
  setPagination: (p: Partial<PaginationMeta>) => void
) => {
  const [delta, setDelta] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) {
        setDelta(0);
        setPagination({ page_size: 4, current_page: 1 });
      } else if (window.innerWidth < 1024) {
        setDelta(1);
        setPagination({ page_size: 6, current_page: 1 });
      } else {
        setDelta(3);
        setPagination({ page_size: 12, current_page: 1 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [setPagination]);

  return delta;
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
        {renderPageNumbers(
          totalPages,
          { current_page: currentPage },
          setPagination,
          delta
        )}
      </div>
    );
  }
);

const renderPageNumbers = (
  totalPages: number,
  pagination: PaginationMeta,
  setPagination: (pagination: Partial<PaginationMeta>) => void,
  delta: number = 2
) => {
  const currentPage = pagination.current_page;

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
        className="text-primary-600 dark:text-primary-100 px-2"
      >
        ...
      </span>
    ) : (
      <button
        key={page}
        onClick={() =>
          setPagination({ ...pagination, current_page: page as number })
        }
        className={twMerge(
          'text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 cursor-pointer rounded border-transparent px-4 py-2 transition-all duration-300 ease-in-out hover:scale-105',
          pagination.current_page === page
            ? 'bg-accent-200 dark:bg-accent-400/80 hover:bg-accent-200 hover:dark:bg-accent-400/80 hover:border-transparent'
            : 'border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20'
        )}
      >
        {page}
      </button>
    )
  );
};

type ComponentPageLayoutProps = {
  data?: ComponentResponse;
  listVariants: Variants;
};

const ComponentPageLayout = memo(
  ({
    children,
    props,
  }: {
    props: ComponentPageLayoutProps;
    children: React.ReactNode;
  }) => {
    const { pagination, setPagination } = useComponentStore();
    const delta = useResponsivePagination(setPagination);
    const { isSideBarOpen, isFilterOpen, toggleSidebar, toggleFilter } =
      useExclusivePanel();
    const { t } = useTranslation('component');

    const isDesktop = useMediaQuery('(min-width: 1280px)');

    return (
      <main
        className={twMerge(
          'font-saira max-w-screen text-primary-600 dark:text-primary-100 z-0 flex min-h-screen w-screen flex-col items-center overflow-y-auto bg-transparent [--padding-left-from:2rem] [--padding-left-to:2rem] md:block xl:[--padding-left-to:22.5%]',
          isSideBarOpen
            ? 'h-screen overflow-y-hidden xl:h-full xl:overflow-y-auto'
            : 'overflow-y-auto'
        )}
      >
        <ComponentFilter
          data={props.data}
          isSideBarOpen={isDesktop ? isSideBarOpen : isFilterOpen}
        />
        <motion.div
          className={twMerge(
            'z-0 flex h-full min-h-screen w-screen flex-col gap-4 p-8 xl:pt-28'
          )}
          variants={props.listVariants}
          animate={isSideBarOpen ? 'expand' : 'collapse'}
          initial="collapse"
        >
          <span className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{t('page.title')}</h1>
            <SideBarButton
              isSideBarOpen={isSideBarOpen}
              toggleSidebar={toggleSidebar}
            />
          </span>
          <div className="flex flex-col gap-4">
            <button
              onClick={toggleFilter}
              className="border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 w-full cursor-pointer self-end rounded px-4 py-2 transition-colors duration-300 ease-in-out xl:hidden"
            >
              {t('filter.title')}
            </button>
            <ActiveFilters />
          </div>
          <section
            className={twMerge(
              'flex w-full items-center justify-center xl:justify-start',
              isSideBarOpen ? 'xl:justify-start' : ''
            )}
          >
            <div className="flex w-full flex-wrap justify-center gap-8 xl:justify-start">
              {children}
            </div>
          </section>
          <section className="mt-auto w-full self-center">
            {props.data && props.data.pagination && (
              <div className="w-full">
                <Trans
                  t={t}
                  i18nKey={'action.pagination.page'}
                  className="text-sm text-gray-500"
                >
                  Page {{ page: props.data.pagination.current_page }} of{' '}
                  {{ total: props.data.pagination.total_pages }}
                </Trans>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        current_page: Math.max(1, pagination.current_page - 1),
                      })
                    }
                    disabled={pagination.current_page <= 1}
                    className="border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 cursor-pointer rounded px-4 py-2 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent"
                  >
                    <ArrowIcon className="text-secondary-400 inline -rotate-45 stroke-[1.5]" />
                  </button>
                  <Pagination
                    totalPages={props.data.pagination.total_pages!}
                    currentPage={props.data.pagination.current_page}
                    delta={delta}
                    setPagination={setPagination}
                  />
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        current_page: Math.min(
                          props.data?.pagination.total_pages ?? 0,
                          pagination.current_page + 1
                        ),
                      })
                    }
                    disabled={
                      pagination.current_page >=
                      props.data.pagination.total_pages!
                    }
                    className="border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 cursor-pointer rounded px-4 py-2 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent"
                  >
                    <ArrowIcon className="rotate-135 text-secondary-400 inline stroke-[1.5]" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </motion.div>
      </main>
    );
  }
);
