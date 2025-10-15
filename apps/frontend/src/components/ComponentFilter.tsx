import {
  ListFilterPlusIcon,
  PanelLeftDashedIcon,
  PanelLeftIcon,
} from 'lucide-react';
import { GetAvailableFilters } from '../services/api';
import { useComponentStore } from '../stores/componentStore';
import { useQuery } from '@tanstack/react-query';
import SearchComponentBar from './SearchComponentBar';
import PriceRangeSlider from './PriceRangeSlider';
import { useParams } from 'react-router';
import { memo, type Dispatch, type SetStateAction } from 'react';
import type { ComponentResponse, ComponentFilter } from '../types/components';
import { twMerge } from 'tailwind-merge';
import { motion, type Variants } from 'framer-motion';

const ComponentFilters = memo(
  ({
    data,
    className,
    isSideBarOpen,
    setIsSideBarOpen,
  }: {
    data?: ComponentResponse;
    className?: string;
    isSideBarOpen: boolean;
    setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
  }) => {
    const { filters, setFilters, removeFilter } = useComponentStore();
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

    const listVariants: Variants = {
      collapse: {
        x: '-100%',
        opacity: 0,
        pointerEvents: 'none',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
      expand: {
        x: 0,
        opacity: 1,
        pointerEvents: 'auto',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
    };

    if (!filterQuery.data || !data) {
      return (
        <ComponentFilterLayout
          props={{
            className: className,
            isSideBarOpen: isSideBarOpen,
            setIsSideBarOpen: setIsSideBarOpen,
            listVariants: listVariants,
          }}
        >
          <p className="text-lg text-red-500">Error loading filters</p>
          <p className="text-sm text-red-500">{filterQuery.error?.message}</p>
        </ComponentFilterLayout>
      );
    }

    return (
      <ComponentFilterLayout
        props={{
          className: className,
          isSideBarOpen: isSideBarOpen,
          setIsSideBarOpen: setIsSideBarOpen,
          listVariants: listVariants,
        }}
      >
        <SearchComponentBar />
        <section className="text-primary-900 dark:text-primary-50">
          <h3 className="mb-2 text-lg font-semibold">Categories</h3>
          <div className="text-primary-700 dark:text-primary-50 flex flex-wrap gap-2">
            {filterQuery.data &&
              filterQuery.data.categories.map(category => {
                const categoryCount =
                  data.summary.by_category[category.display_name] || 0;
                const isAvailable = categoryCount > 0;

                return (
                  <FilterChip
                    id={category.id}
                    filter_type="category_id"
                    filters={filters}
                    removeFilter={removeFilter}
                    handleFilterChange={handleFilterChange}
                    isDisabled={!isAvailable}
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

                if (isBrandAvailable) {
                  return (
                    <FilterChip
                      id={brand.id}
                      filter_type="brand_id"
                      filters={filters}
                      removeFilter={removeFilter}
                      handleFilterChange={handleFilterChange}
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
      </ComponentFilterLayout>
    );
  }
);

function FilterChip({
  id,
  filter_type,
  filters,
  removeFilter,
  handleFilterChange,
  isDisabled,
  children,
}: {
  id: string;
  filter_type: string;
  filters: ComponentFilter;
  removeFilter: (key: keyof ComponentFilter) => void;
  handleFilterChange: (
    key: keyof ComponentFilter,
    value: string | number | undefined
  ) => void;
  isDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      key={id}
      className="bg-accent-200/50 dark:bg-accent-400/80 border-primary-200 border-1 hover:bg-accent-300/50 dark:hover:bg-accent-400 border-border dark:border-border-dark dark:bg-selected-dark line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      onClick={() =>
        filters.brand_id
          ? removeFilter(filter_type)
          : handleFilterChange(filter_type, id)
      }
      disabled={isDisabled}
    >
      <span className="flex items-center gap-1">{children}</span>
    </button>
  );
}

type ComponentFilterLayout = {
  className?: string;
  listVariants: Variants;
  isSideBarOpen: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
};

const ComponentFilterLayout = memo(
  ({
    children,
    props,
  }: {
    children: React.ReactNode;
    props: ComponentFilterLayout;
  }) => {
    return (
      <motion.aside
        className={twMerge(
          'font-saira scrollbar-hidden xl:border-1 border-primary-700 xl:border-secondary-300 xl:hover:border-secondary-400 xl:dark:border-secondary-500 xl:bg-secondary-500/20 xl:dark:bg-secondary-600/20 text-primary-600 dark:text-primary-100 bg-light dark:bg-dark flex w-full min-w-[15rem] flex-col gap-4 overflow-y-auto p-4 px-6 transition-colors duration-300 ease-in-out xl:w-[20%] xl:backdrop-blur-sm',
          props.className
        )}
        variants={props.listVariants}
        animate={props.isSideBarOpen ? 'expand' : 'collapse'}
        initial="collapse"
      >
        <span className="my-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xl font-semibold">
            <ListFilterPlusIcon className="mr-2 inline-block h-5 w-5" />
            Filters
          </span>
          <button
            className={twMerge(
              'border-accent-200/50 hover:border-secondary-400 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20 dark:hover:bg-secondary-600/50 hover:bg-accent-300/50 border-1 mr-2 cursor-pointer rounded-full p-2 px-3 transition-all duration-300 ease-in-out xl:mr-0 xl:hidden'
            )}
            onClick={() => props.setIsSideBarOpen(prev => !prev)}
          >
            {props.isSideBarOpen ? (
              <PanelLeftDashedIcon className="w-5" />
            ) : (
              <PanelLeftIcon className="w-5" />
            )}
          </button>
        </span>
        {children}
      </motion.aside>
    );
  }
);

export default ComponentFilters;
