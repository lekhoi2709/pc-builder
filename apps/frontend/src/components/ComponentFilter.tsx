import { SlidersHorizontal } from 'lucide-react';
import { GetAvailableFilters } from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
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
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';

const ComponentFilters = memo(
  ({
    data,
    isSideBarOpen,
  }: {
    data?: ComponentResponse;
    isSideBarOpen: boolean;
  }) => {
    const { filters, toggleBrandFilter, toggleCategoryFilter } =
      useFiltersFromURL();
    const { setCategories, setBrands } = useComponentStore();
    const { lang } = useParams();
    const isMobile = useMediaQuery('(max-width: 1279px)');
    const { t } = useTranslation('component');

    const filterQuery = useQuery({
      queryKey: ['available-filters', lang],
      queryFn: () => GetAvailableFilters(lang || 'vn'),
      placeholderData: previousData => previousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
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
            isFilter: true,
            title: t('filter.title'),
            titleIcon: (
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
            ),
          }}
        >
          {data && filterQuery.isLoading ? <ListFilterSkeleton /> : <p className="text-sm leading-6 text-[#536056] dark:text-[#b5c5b6]">{t('page.load_error')}</p>}
        </SideBarLayout>
      );
    }

    return (
      <SideBarLayout
        props={{
          isSideBarOpen: isSideBarOpen,
          isFilter: true,
          title: t('filter.title'),
          titleIcon: (
            <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
          ),
        }}
      >
        <section className="text-[#111c1a] dark:text-[#edf3e7]">
          {isMobile && <ActiveFilters isHavingSort={false} />}
          <h3 className="mb-2 text-lg font-semibold">{t('filter.category')}</h3>
          <div className="flex flex-wrap gap-2">
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
                    isDisabled={!isCategoryAvailable && !isSelected}
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
        <section className="text-[#111c1a] dark:text-[#edf3e7]">
          <h3 className="mb-2 text-lg font-semibold">{t('filter.brand')}</h3>
          <div className="flex flex-wrap gap-2">
            {filterQuery.data &&
              filterQuery.data.brands.map(brand => {
                const brandCount =
                  data.summary.by_brand[brand.display_name] || 0;
                const isBrandAvailable = brandCount > 0;
                const isSelected = isBrandSelected(brand.id);

                if (isBrandAvailable || isSelected) {
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
                            className="h-7 w-10 object-contain"
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
        'line-clamp-1 flex min-h-11 w-fit cursor-pointer items-center justify-between border border-[#bfcbb8] bg-white px-3 py-1.5 text-sm text-[#314033] transition duration-200 hover:border-[#111c1a] hover:bg-[#e1f2b5] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#526354] dark:bg-[#314437] dark:text-[#edf3e7] dark:hover:border-[#d1ff52] dark:hover:bg-[#425942]',
        isSelected &&
          'border-[#111c1a] bg-[#d1ff52] text-[#111c1a] dark:border-[#d1ff52] dark:bg-[#d1ff52] dark:text-[#111c1a]'
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
