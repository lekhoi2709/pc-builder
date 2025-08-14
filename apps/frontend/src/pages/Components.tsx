import { useQuery } from '@tanstack/react-query';
import {
  GetAvailableFilters,
  GetComponents,
  type ComponentFilter,
  type ComponentResponse,
  type PaginationMeta,
} from '../services/api';
import ComponentCard from '../components/ComponentCard';
import { CircleXIcon, ArrowBigLeftIcon, ArrowBigRightIcon } from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';

export default function Components() {
  const { filters, setFilters, pagination, setPagination, clearFilter } =
    useComponentStore();

  const componentQuery = useQuery({
    queryKey: ['components', filters, pagination],
    queryFn: () => GetComponents(filters, pagination),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filterQuery = useQuery({
    queryKey: ['available-filters'],
    queryFn: () => GetAvailableFilters(),
    refetchOnWindowFocus: false,
  });

  // Handle filter changes
  const handleFilterChange = (
    key: keyof ComponentFilter,
    value: string | number | undefined
  ) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, current_page: 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // // Handle pagination
  // const handlePageChange = (page: number) => {
  //   setPagination(prev => ({ ...prev, page }));
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  if (
    (componentQuery.isLoading && !componentQuery.data) ||
    (filterQuery.isLoading && !filterQuery.data)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading components...</p>
        </div>
      </div>
    );
  }

  if (componentQuery.isError || filterQuery.isError) {
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
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">No components found</p>
      </div>
    );
  }

  return (
    <section className="z-0 flex min-h-screen w-full flex-col items-center bg-transparent">
      <h1 className="mb-4 text-2xl font-bold">Components</h1>
      <main className="flex w-full">
        <section className="flex w-1/4 flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p>Total Components: {data.summary.total_components}</p>
          <span>
            Categories:{' '}
            <div className="flex flex-wrap gap-2">
              {filterQuery.data &&
                filterQuery.data.categories.map(category => (
                  <span
                    key={category}
                    className="line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                    onClick={() => handleFilterChange('category', category)}
                  >
                    <p>
                      {category} ({data.summary.by_category[category] || 0})
                    </p>
                    {filters.category === category && (
                      <CircleXIcon
                        className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={event => {
                          event.stopPropagation();
                          handleFilterChange('category', undefined);
                        }}
                      />
                    )}
                  </span>
                ))}
            </div>
          </span>
          <span>
            Brands:{' '}
            <div className="flex flex-wrap gap-2">
              {filterQuery.data &&
                filterQuery.data.brands.map(brand => {
                  const isBrandAvailable = data.summary.by_brand[brand] != null;
                  if (isBrandAvailable) {
                    return (
                      <span
                        key={brand}
                        className="line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        onClick={() => handleFilterChange('brand', brand)}
                      >
                        <p>
                          {brand}
                          {isBrandAvailable &&
                            ` (${data.summary.by_brand[brand]})`}
                        </p>
                        {filters.brand === brand && (
                          <CircleXIcon
                            className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                            onClick={event => {
                              event.stopPropagation();
                              handleFilterChange('brand', undefined);
                            }}
                          />
                        )}
                      </span>
                    );
                  }
                })}
            </div>
          </span>
          <button
            onClick={clearFilter}
            className="cursor-pointer rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </section>
        <section className="flex w-3/4 flex-wrap justify-start gap-8 p-4">
          {data.components.map(component => (
            <ComponentCard key={component.id} component={component} />
          ))}
          {data.pagination && (
            <div className="w-full">
              <p className="text-sm text-gray-500">
                Page {data.pagination.current_page} of{' '}
                {data.pagination.total_pages}
              </p>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      current_page: Math.max(1, pagination.current_page - 1),
                    })
                  }
                  disabled={pagination.current_page <= 1}
                  className="cursor-pointer rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
                >
                  <ArrowBigLeftIcon className="inline stroke-[1.5]" />
                </button>
                <div className="flex gap-1">
                  {renderPageNumbers(data, pagination, setPagination)}
                </div>
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
                  className="cursor-pointer rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
                >
                  <ArrowBigRightIcon className="inline stroke-[1.5]" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </section>
  );
}

const renderPageNumbers = (
  data: ComponentResponse,
  pagination: PaginationMeta,
  setPagination: (pagination: Partial<PaginationMeta>) => void
) => {
  const totalPages = data.pagination.total_pages || 0;
  const currentPage = pagination.current_page;
  const pages: (number | string)[] = [];

  const delta = 1; // how many pages to show around current
  const range = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  let prev: number | null = null;
  for (const page of range) {
    if (prev && page - prev > 1) {
      pages.push('...');
    }
    pages.push(page);
    prev = page;
  }

  return pages.map((page, idx) =>
    page === '...' ? (
      <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
        ...
      </span>
    ) : (
      <button
        key={page}
        onClick={() =>
          setPagination({ ...pagination, current_page: page as number })
        }
        className={`cursor-pointer rounded px-4 py-2 ${
          pagination.current_page === page
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {page}
      </button>
    )
  );
};
