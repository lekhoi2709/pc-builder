import { ListFilterPlusIcon } from 'lucide-react';
import {
  type ComponentResponse,
  type ComponentFilter,
  GetAvailableFilters,
} from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
import SearchComponentBar from './SearchComponentBar';
import PriceRangeSlider from './PriceRangeSlider';

export default function ComponentFilter({ data }: { data: ComponentResponse }) {
  const { filters, setFilters } = useComponentStore();

  const handleFilterChange = (
    key: keyof ComponentFilter,
    value: string | number | undefined
  ) => {
    setFilters({ ...filters, [key]: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterQuery = useQuery({
    queryKey: ['available-filters'],
    queryFn: () => GetAvailableFilters(),
    refetchOnWindowFocus: false,
  });

  if (filterQuery.isLoading && !filterQuery.data) {
    return (
      <aside className="border-primary-600/50 dark:border-primary-400/50 fixed z-0 hidden h-full min-h-screen w-[20vw] flex-col items-center justify-center gap-4 border-r-[0.5px] bg-transparent p-4 px-6 md:flex">
        <div className="border-primary-600/50 dark:border-primary-400/50 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="mt-4 text-lg">Loading components...</p>
      </aside>
    );
  }

  return (
    <aside className="border-primary-600/50 dark:border-primary-400/50 font-saira fixed inset-y-0 top-16 z-0 hidden h-full min-h-screen w-[20vw] flex-col gap-4 overflow-y-auto border-r-[0.5px] bg-transparent p-4 px-6 pt-6 md:flex">
      <span className="my-4 flex items-center text-xl font-semibold">
        <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
        Filters
      </span>
      <SearchComponentBar />
      <section>
        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {filterQuery.data &&
            filterQuery.data.categories.map(category => (
              <button
                key={category}
                className="bg-primary-100 dark:hover:bg-primary-600/50 hover:bg-primary-200 border-primary-600/50 dark:border-primary-400/50 dark:bg-primary-800/50 group line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleFilterChange('category', category)}
                disabled={!data.summary.by_category[category]}
              >
                <link
                  type="image/png"
                  sizes="16x16"
                  rel="icon"
                  href="https://icons8.com/icon/osQ0ttYWdlt-/motherboard"
                />
                <span className="flex items-center gap-1">
                  {category}
                  <p className="text-sm opacity-50 group-disabled:hidden">
                    {data.summary.by_category[category] || 0}
                  </p>
                </span>
              </button>
            ))}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-lg font-semibold">Brands</h3>
        <div className="flex flex-wrap gap-2">
          {filterQuery.data &&
            filterQuery.data.brands.map(brand => {
              const isBrandAvailable = data.summary.by_brand[brand] != null;
              if (isBrandAvailable) {
                return (
                  <span
                    key={brand}
                    className="bg-primary-100 hover:bg-primary-200 border-primary-600/50 dark:border-primary-400/50 dark:hover:bg-primary-600/50 dark:bg-primary-800/50 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
                    onClick={() => handleFilterChange('brand', brand)}
                  >
                    <span className="flex items-center gap-1">
                      {brand}
                      <p className="text-sm opacity-50">
                        {isBrandAvailable && data.summary.by_brand[brand]}
                      </p>
                    </span>
                  </span>
                );
              }
            })}
        </div>
      </section>
      <section className="w-full">
        <h3 className="mb-2 text-lg font-semibold">Price</h3>
        <PriceRangeSlider
          min={data.summary.price_range.min_price}
          max={data.summary.price_range.max_price}
          currency={data.summary.price_range.currency}
        />
      </section>
    </aside>
  );
}
