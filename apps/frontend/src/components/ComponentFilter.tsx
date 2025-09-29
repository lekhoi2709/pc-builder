import { ListFilterPlusIcon } from 'lucide-react';
import { GetAvailableFilters } from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
import SearchComponentBar from './SearchComponentBar';
import PriceRangeSlider from './PriceRangeSlider';
import { useParams } from 'react-router';
import { memo } from 'react';
import type { ComponentResponse, ComponentFilter } from '../types/components';

const ComponentFilters = memo(({ data }: { data?: ComponentResponse }) => {
  const { filters, setFilters } = useComponentStore();
  const { lang } = useParams();

  const handleFilterChange = (
    key: keyof ComponentFilter,
    value: string | number | undefined
  ) => {
    setFilters({ ...filters, [key]: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterQuery = useQuery({
    queryKey: ['available-filters', lang],
    queryFn: () => GetAvailableFilters(lang || 'vn'),
    refetchOnWindowFocus: false,
  });

  if ((filterQuery.isLoading && !filterQuery.data) || !data) {
    return (
      <aside className="border-primary-600/50 dark:border-primary-400/50 fixed z-10 hidden h-full min-h-screen w-[20vw] flex-col items-center justify-center gap-4 border-r-[0.5px] bg-transparent p-4 px-6 md:flex">
        <div className="border-primary-600/50 dark:border-primary-400/50 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="mt-4 text-lg">Loading components...</p>
      </aside>
    );
  }

  return (
    <aside className="border-primary-600/50 dark:border-primary-400/50 font-saira pt-22 scrollbar-hidden fixed inset-y-0 z-10 hidden h-full min-h-screen w-[20vw] gap-4 overflow-y-auto border-r-[0.5px] bg-transparent p-4 px-6 backdrop-blur-sm xl:flex xl:flex-col">
      <span className="my-4 flex items-center text-xl font-semibold">
        <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
        Filters
      </span>
      <SearchComponentBar />
      <section>
        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {filterQuery.data &&
            filterQuery.data.categories.map(category => {
              const categoryCount =
                data.summary.by_category[category.display_name] || 0;
              const isAvailable = categoryCount > 0;

              return (
                <button
                  key={category.id}
                  className="bg-primary-100 dark:hover:bg-primary-600/50 hover:bg-primary-200 border-primary-600/50 dark:border-primary-400/50 dark:bg-primary-800/50 group line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleFilterChange('category_id', category.id)}
                  disabled={!isAvailable}
                >
                  <span className="flex items-center gap-1">
                    {category.display_name}
                    <p className="text-sm opacity-50 group-disabled:hidden">
                      {categoryCount}
                    </p>
                  </span>
                </button>
              );
            })}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-lg font-semibold">Brands</h3>
        <div className="flex flex-wrap gap-2">
          {filterQuery.data &&
            filterQuery.data.brands.map(brand => {
              const brandCount = data.summary.by_brand[brand.display_name] || 0;
              const isBrandAvailable = brandCount > 0;

              if (isBrandAvailable) {
                return (
                  <span
                    key={brand.id}
                    className="bg-primary-100 hover:bg-primary-200 border-primary-600/50 dark:border-primary-400/50 dark:hover:bg-primary-600/50 dark:bg-primary-800/50 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
                    onClick={() => handleFilterChange('brand_id', brand.id)}
                  >
                    <span className="flex items-center gap-1">
                      <span className="flex items-center gap-2">
                        <img
                          src={brand.logo_url}
                          alt=""
                          className="h-full w-[50px] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                        {brand.display_name}
                      </span>
                      <p className="text-sm opacity-50">{brandCount}</p>
                    </span>
                  </span>
                );
              }
              return null;
            })}
        </div>
      </section>
      <section className="w-full">
        <h3 className="mb-2 text-lg font-semibold">Price</h3>
        <PriceRangeSlider
          min={filterQuery.data?.price_range.min_price || 0}
          max={filterQuery.data?.price_range.max_price || 1000}
          currency={filterQuery.data?.price_range.currency || 'VND'}
        />
      </section>
    </aside>
  );
});

export default ComponentFilters;
