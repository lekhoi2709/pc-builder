import { useQuery } from '@tanstack/react-query';
import { GetComponents } from '../services/api';
import { ComponentCard } from '../components/ComponentCard';
import {
  ArrowBigLeftIcon,
  ArrowBigRightIcon,
  PanelLeftDashedIcon,
  PanelLeftIcon,
} from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';
import { useEffect, useState } from 'react';
import React from 'react';
import { ActiveFilters } from '../components/ActiveFilters';
import { useParams } from 'react-router';
import ComponentFilter from '../components/ComponentFilter';
import type { PaginationMeta } from '../types/components';
import { twMerge } from 'tailwind-merge';
import { motion, type Variants } from 'framer-motion';
import { useSideBarOpen } from '../hooks/useSideBarOpen';

export default function Components() {
  const { lang } = useParams();
  const { filters, pagination, setPagination } = useComponentStore();
  const delta = useResponsivePagination(setPagination);
  const { isSideBarOpen, setIsSideBarOpen } = useSideBarOpen();

  const componentQuery = useQuery({
    queryKey: ['components', filters, pagination, lang],
    queryFn: () => GetComponents(filters, pagination, lang),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (componentQuery.isLoading && !componentQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading components...</p>
        </div>
      </div>
    );
  }

  if (componentQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg">Error loading components</p>
          <p className="text-sm">{componentQuery.error?.message}</p>
        </div>
      </div>
    );
  }

  const data = componentQuery.data;
  const listVariants: Variants = {
    collapse: {
      paddingLeft: '2.5rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    expand: {
      paddingLeft: '22.5%',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <main className="font-saira max-w-screen text-primary-600 dark:text-primary-100 z-0 flex min-h-screen w-screen flex-col items-center bg-transparent md:block">
      <ComponentFilter
        data={data}
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        className="fixed left-0 top-0 z-40 h-screen xl:left-4 xl:top-4 xl:h-[calc(100vh-2rem)] xl:rounded-[36px]"
      />
      <motion.div
        className={twMerge(
          'z-0 flex h-full min-h-screen w-screen flex-col gap-4 p-8 md:pt-28'
        )}
        variants={listVariants}
        animate={isSideBarOpen ? 'expand' : 'collapse'}
        initial="collapse"
      >
        <span className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Components</h1>
          <button
            className={twMerge(
              'border-accent-200/50 hover:border-secondary-400 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 dark:hover:bg-secondary-600/50 hover:bg-accent-300/50 border-1 cursor-pointer rounded-full p-2 px-3 transition-all duration-300 ease-in-out',
              isSideBarOpen ? 'hidden xl:block' : ''
            )}
            onClick={() => setIsSideBarOpen(prev => !prev)}
          >
            {isSideBarOpen ? (
              <PanelLeftDashedIcon className="w-5" />
            ) : (
              <PanelLeftIcon className="w-5" />
            )}
          </button>
        </span>
        <ActiveFilters />
        <section
          className={twMerge(
            'flex w-full justify-center',
            isSideBarOpen ? 'md:justify-start' : ''
          )}
        >
          <div className="flex flex-wrap justify-center gap-8 xl:justify-start">
            {data && data.components
              ? data.components.map(component => (
                  <ComponentCard key={component.id} component={component} />
                ))
              : 'No Component Found'}
          </div>
        </section>
        <section className="mt-auto w-full self-center">
          {data && data.pagination && (
            <div className="w-full">
              <p className="text-sm text-gray-500">
                Page {data.pagination.current_page} of{' '}
                {data.pagination.total_pages}
              </p>
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
                  <ArrowBigLeftIcon className="inline stroke-[1.5]" />
                </button>
                <Pagination
                  totalPages={data.pagination.total_pages!}
                  currentPage={data.pagination.current_page}
                  delta={delta}
                  setPagination={setPagination}
                />
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      current_page: Math.min(
                        data.pagination.total_pages!,
                        pagination.current_page + 1
                      ),
                    })
                  }
                  disabled={
                    pagination.current_page >= data.pagination.total_pages!
                  }
                  className="border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 cursor-pointer rounded px-4 py-2 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent"
                >
                  <ArrowBigRightIcon className="inline stroke-[1.5]" />
                </button>
              </div>
            </div>
          )}
        </section>
      </motion.div>
    </main>
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
