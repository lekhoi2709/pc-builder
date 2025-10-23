import { ListFilterPlusIcon } from 'lucide-react';
import { GetAvailableFilters } from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
import SearchComponentBar from './SearchComponentBar';
import PriceRangeSlider from './PriceRangeSlider';
import { useParams } from 'react-router';
import { memo } from 'react';
import type { ComponentResponse } from '../types/components';

import SideBarLayout from '../layouts/SideBarLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ActiveFilters } from './ActiveFilters';
import { twMerge } from 'tailwind-merge';

const ComponentFilters = memo(
  ({
    data,
    isSideBarOpen,
  }: {
    data?: ComponentResponse;
    isSideBarOpen: boolean;
  }) => {
    const { filters, toggleBrandFilter, toggleCategoryFilter } =
      useComponentStore();
    const { lang } = useParams();
    const isMobile = useMediaQuery('(max-width: 1280px)');

    const filterQuery = useQuery({
      queryKey: ['available-filters', lang],
      queryFn: () => GetAvailableFilters(lang || 'vn'),
      refetchOnWindowFocus: false,
    });

    const isCategorySelected = (categoryId: string) => {
      return filters.category_id?.includes(categoryId) || false;
    };

    // Helper to check if brand is selected
    const isBrandSelected = (brandId: string) => {
      return filters.brand_id?.includes(brandId) || false;
    };

    if (!filterQuery.data || !data) {
      return (
        <SideBarLayout
          props={{
            isSideBarOpen: isSideBarOpen,
            title: 'Filters',
            titleIcon: (
              <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
            ),
          }}
        >
          <p className="text-lg text-red-500">Error loading filters</p>
          <p className="text-sm text-red-500">{filterQuery.error?.message}</p>
        </SideBarLayout>
      );
    }

    return (
      <SideBarLayout
        props={{
          className:
            'border-secondary-300 dark:border-secondary-500 bg-secondary-500/20 dark:bg-secondary-600/20 hover:border-secondary-400',
          isSideBarOpen: isSideBarOpen,
          title: 'Filters',
          titleIcon: (
            <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
          ),
        }}
      >
        <SearchComponentBar />
        <section className="text-primary-900 dark:text-primary-50">
          {isMobile && <ActiveFilters isHavingSort={false} />}
          <h3 className="mb-2 text-lg font-semibold">Categories</h3>
          <div className="text-primary-700 dark:text-primary-50 flex flex-wrap gap-2">
            {filterQuery.data &&
              filterQuery.data.categories.map(category => {
                const categoryCount =
                  data.summary.by_category[category.display_name] || 0;
                const isCategoryAvailable = categoryCount > 0;
                const isSelected = isCategorySelected(category.id);

                return (
                  <FilterChip
                    key={category.id}
                    isSelected={isSelected}
                    onClick={() => toggleCategoryFilter(category.id)}
                    isDisabled={!isCategoryAvailable}
                  >
                    <span className="flex items-center gap-1">
                      {category.display_name}
                      <p className="text-sm opacity-50 group-disabled:hidden">
                        {categoryCount}
                      </p>
                    </span>
                  </FilterChip>
                );
              })}
          </div>
        </section>
        <section className="text-primary-900 dark:text-primary-50">
          <h3 className="mb-2 text-lg font-semibold">Brands</h3>
          <div className="text-primary-700 dark:text-primary-50 flex flex-wrap gap-2">
            {filterQuery.data &&
              filterQuery.data.brands.map(brand => {
                const brandCount =
                  data.summary.by_brand[brand.display_name] || 0;
                const isBrandAvailable = brandCount > 0;
                const isSelected = isBrandSelected(brand.id);

                if (isBrandAvailable) {
                  return (
                    <FilterChip
                      key={brand.id}
                      isSelected={isSelected}
                      onClick={() => toggleBrandFilter(brand.id)}
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
                    </FilterChip>
                  );
                }
                return null;
              })}
          </div>
        </section>
        <section className="w-full">
          <h3 className="mb-2 text-lg font-semibold">Price</h3>
          <PriceRangeSlider
            min={data.summary.price_range.min_price || 0}
            max={data.summary.price_range.max_price || 1000}
            currency={filterQuery.data?.price_range.currency || 'VND'}
          />
        </section>
      </SideBarLayout>
    );
  }
);

function FilterChip({
  isSelected,
  isDisabled,
  onClick,
  children,
}: {
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={twMerge(
        'bg-accent-200/50 dark:bg-accent-400/80 border-primary-200 border-1 hover:bg-accent-300/50 dark:hover:bg-accent-400 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
        isSelected &&
          'dark:outline-primary-100 border-transparent shadow-2xl outline outline-dashed xl:outline-double'
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      <span className="flex items-center gap-1">{children}</span>
    </button>
  );
}

export default ComponentFilters;
