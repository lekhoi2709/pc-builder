import {
  ArrowUpAzIcon,
  ArrowDownAZIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { XIcon } from './Icons/XIcon';
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';
import { useComponentStore } from '../stores/componentStore';
import { useMemo } from 'react';

const langToCurrency: Record<string, string> = {
  vn: 'VND',
  en: 'USD',
};

const langToLocale: Record<string, string> = {
  vn: 'vi-VN',
  en: 'en-US',
};

export default function ActiveFilters({
  isHavingSort = true,
}: {
  isHavingSort?: boolean;
}) {
  const { filters, clearFilters, removeFilter } = useFiltersFromURL();
  const { categories, brands } = useComponentStore();
  const { lang } = useParams();
  const { t } = useTranslation('component');
  const currency = langToCurrency[lang || 'vn'] || 'VND';

  const activeFilters = useMemo(() => {
    const active: Array<{
      key: string;
      value: string | number;
      display?: string;
    }> = [];

    if (filters.category_id && filters.category_id.length > 0) {
      filters.category_id.forEach(id => {
        const category = categories.find(c => c.id === id);
        active.push({
          key: 'category_id',
          value: id,
          display: category?.display_name || id,
        });
      });
    }

    if (filters.brand_id && filters.brand_id.length > 0) {
      filters.brand_id.forEach(id => {
        const brand = brands.find(b => b.id === id);
        active.push({
          key: 'brand_id',
          value: id,
          display: brand?.display_name || id,
        });
      });
    }

    if (filters.min_price) {
      active.push({ key: 'min_price', value: filters.min_price });
    }

    if (filters.max_price) {
      active.push({ key: 'max_price', value: filters.max_price });
    }

    if (filters.search) {
      active.push({ key: 'search', value: filters.search });
    }

    return active;
  }, [filters, categories, brands]);

  const priceFormatter = (
    value: number,
    locale: string,
    style: 'decimal' | 'currency' | 'percent' | 'unit' = 'currency'
  ) => {
    const formatter = new Intl.NumberFormat(locale, {
      style: style,
      currency,
    });
    return formatter.format(value);
  };

  if (activeFilters.length === 0)
    return (
      isHavingSort && (
        <div className="font-saira flex w-full justify-end">
          <div className="flex items-center gap-2 self-end">
            <SortingIndicator t={t} content={'default'} />
            <div className="border-primary-950 dark:border-primary-50 h-5 w-fit border-l" />
            <SortingIndicator
              t={t}
              content="price"
              sort_by="price"
              IconUp={ArrowUp01Icon}
              IconDown={ArrowDown01Icon}
            />
          </div>
        </div>
      )
    );

  const activeFilterStringFormatted = ({
    isSortingFilter = false,
    str,
  }: {
    isSortingFilter?: boolean;
    str: string;
  }): string => {
    const strArr = str.split('_');
    if (strArr[1] === 'id' || !strArr[1]) {
      return strArr[0];
    } else if (strArr[0] === 'storage') {
      return strArr[1];
    } else if (strArr[0] === 'min' || strArr[0] === 'max') {
      if (!isSortingFilter) {
        return strArr[0];
      } else return 'default';
    }
    return strArr[0] + ' ' + strArr[1];
  };

  return (
    <div className="font-saira mb-2 flex flex-wrap content-end items-center justify-between gap-6 xl:mb-0">
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter, index) => {
          const key = `${filter.key}-${filter.value}-${index}`;

          if (filter.key === 'min_price' || filter.key === 'max_price') {
            return (
              <span
                key={key}
                className="bg-accent-200 dark:bg-accent-400/80 prevent-select w-fit! line-clamp-1 flex cursor-pointer items-center justify-between break-keep rounded px-2 py-1"
              >
                <p>
                  {t(`filter.active.active_${filter.key.split('_')[0]}`)}
                  {priceFormatter(
                    parseInt(filter.value as string),
                    langToLocale[lang || 'vn'] || 'vi-VN',
                    'currency'
                  )}
                </p>
                <XIcon onClick={() => removeFilter(filter.key)} />
              </span>
            );
          }

          return (
            <span
              key={key}
              className="bg-accent-200 dark:bg-accent-400/80 prevent-select line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
            >
              <p className="capitalize">
                {t(`filter.active.active_${filter.key.replace('_id', '')}`)}
                {filter.display || filter.value}
              </p>
              <XIcon
                onClick={() => removeFilter(filter.key, String(filter.value))}
              />
            </span>
          );
        })}
        <button
          className="cursor-pointer rounded border border-red-200/50 bg-red-200/50 px-4 py-2 text-xs text-red-600 transition-colors duration-300 ease-in-out hover:border-red-400 hover:bg-red-300/50 hover:underline xl:ml-2 xl:border-0 xl:bg-transparent xl:p-0 xl:hover:bg-transparent dark:border-red-500 dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-400/50 xl:dark:bg-transparent xl:dark:hover:bg-transparent"
          onClick={clearFilters}
        >
          {t('filter.action.clear')}
        </button>
      </div>
      {isHavingSort && (
        <div className="ml-auto flex items-center gap-2">
          <SortingIndicator
            t={t}
            content={activeFilterStringFormatted({
              str: String(activeFilters[0].key),
              isSortingFilter: true,
            })}
          />
          <div className="border-primary-950 dark:border-primary-50 h-5 w-fit border-l" />
          <SortingIndicator
            t={t}
            content="price"
            sort_by="price"
            IconUp={ArrowUp01Icon}
            IconDown={ArrowDown01Icon}
          />
        </div>
      )}
    </div>
  );
}

function SortingIndicator({
  content = '',
  containerCN,
  textCN,
  IconUp = ArrowUpAzIcon,
  IconDown = ArrowDownAZIcon,
  sort_by = 'name',
  t,
}: {
  content?: string;
  containerCN?: string;
  textCN?: string;
  IconUp?: React.ElementType;
  IconDown?: React.ElementType;
  sort_by?:
    | 'name'
    | 'price'
    | 'created_at'
    | 'updated_at'
    | 'brand'
    | 'category';
  t: TFunction<'component', undefined>;
}) {
  const { filters, setFilters } = useFiltersFromURL();
  const isActive = filters.sort_by === sort_by;
  const showIcon = isActive;
  const isAscending = filters.sort_order === 'asc';

  return (
    <span
      className={twMerge(
        'hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 flex cursor-pointer items-center gap-1 rounded border border-transparent p-2 transition-colors duration-300 ease-in-out',
        isActive &&
          'border-accent-200/50 dark:border-secondary-500 bg-accent-200/50 dark:bg-secondary-600/20',
        containerCN
      )}
      onClick={() => {
        if (filters.sort_by === sort_by) {
          setFilters({
            ...filters,
            sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
            sort_by: sort_by,
          });
        } else {
          setFilters({
            ...filters,
            sort_by: sort_by,
            sort_order: 'asc',
          });
        }
      }}
    >
      <p className={twMerge('prevent-select', textCN)}>
        {isActive && sort_by === 'price'
          ? t('action.sorting.sorted', {
              context: sort_by,
              count: isAscending ? 1 : 0,
            })
          : t('action.sorting.sorted', { context: content })}
      </p>
      {showIcon && (
        <>
          {isAscending ? (
            <IconUp className="h-4 w-4" />
          ) : (
            <IconDown className="h-4 w-4" />
          )}
        </>
      )}
    </span>
  );
}
