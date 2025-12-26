import { ListFilterPlusIcon } from 'lucide-react';
import { GetAvailableFilters } from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
import SearchComponentBar from './SearchComponentBar';
import PriceRangeSlider from './PriceRangeSlider';
import { useParams } from 'react-router';
import { memo, useEffect } from 'react';
import type { ComponentResponse } from '../types/components';

import SideBarLayout from '../layouts/SideBarLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ActiveFilters from './ActiveFilters';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ListFilterSkeleton } from './Skeleton';

const ComponentFilters = memo(
  ({
    data,
    isSideBarOpen,
  }: {
    data?: ComponentResponse;
    isSideBarOpen: boolean;
  }) => {
    const {
      filters,
      toggleBrandFilter,
      toggleCategoryFilter,
      setCategories,
      setBrands,
    } = useComponentStore();
    const { lang } = useParams();
    const isMobile = useMediaQuery('(max-width: 1280px)');
    const { t } = useTranslation('component');

    const filterQuery = useQuery({
      queryKey: ['available-filters', lang],
      queryFn: () => GetAvailableFilters(lang || 'vn'),
      placeholderData: previousData => previousData,
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      if (filterQuery.status === 'success') {
        setCategories(filterQuery.data.categories);
        setBrands(filterQuery.data.brands);
      }
    }, [
      filterQuery.data?.brands,
      filterQuery.data?.categories,
      filterQuery.status,
      setBrands,
      setCategories,
    ]);

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
            title: t('filter.title'),
            titleIcon: (
              <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
            ),
          }}
        >
          <ListFilterSkeleton />
        </SideBarLayout>
      );
    }

    return (
      <SideBarLayout
        props={{
          isSideBarOpen: isSideBarOpen,
          title: t('filter.title'),
          titleIcon: (
            <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
          ),
        }}
      >
        <SearchComponentBar />
        <section className="text-primary-900 dark:text-primary-50">
          {isMobile && <ActiveFilters isHavingSort={false} />}
          <h3 className="mb-2 text-lg font-semibold">{t('filter.category')}</h3>
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
          <h3 className="mb-2 text-lg font-semibold">{t('filter.brand')}</h3>
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
                            className="w-12.5 h-full object-contain"
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
          <h3 className="mb-2 text-lg font-semibold">
            {t('filter.price.title')}
          </h3>
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
    <motion.button
      className={twMerge(
        'bg-accent-200/50 dark:bg-accent-400/80 hover:bg-accent-300/50 dark:hover:bg-accent-400 hover:shadow-accent-500 dark:hover:shadow-primary-200 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1 backdrop-blur-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_0px] active:-translate-y-0.5 active:translate-x-0.5 active:shadow-[-2px_2px] disabled:cursor-not-allowed disabled:opacity-50',
        isSelected &&
          'dark:outline-primary-100 outline outline-dashed xl:outline-double'
      )}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center gap-1">{children}</span>
    </motion.button>
  );
}

export default ComponentFilters;
