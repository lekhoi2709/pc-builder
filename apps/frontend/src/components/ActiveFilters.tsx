import {
  ArrowUpAzIcon,
  ArrowDownAZIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  X,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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
        <div className="flex w-full justify-end">
          <div className="flex items-center gap-2 self-end">
            <SortingIndicator t={t} content={'default'} />
            <div className="h-5 w-fit border-l border-[#aab6a6] dark:border-[#506353]" />
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

  return (
    <div className="mb-2 flex flex-wrap content-end items-center justify-between gap-6 xl:mb-0">
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter, index) => {
          const key = `${filter.key}-${filter.value}-${index}`;

          if (filter.key === 'min_price' || filter.key === 'max_price') {
            return (
              <span
                key={key}
                className="inline-flex min-h-8 w-fit items-center gap-2 border border-[#bdc9b5] bg-[#e5f3c9] px-2.5 py-1 text-xs text-[#263b16] dark:border-[#526354] dark:bg-[#314437] dark:text-[#edf3e7]"
              >
                <p>
                  {t(`filter.active.active_${filter.key.split('_')[0]}`)}
                  {priceFormatter(
                    parseInt(filter.value as string),
                    langToLocale[lang || 'vn'] || 'vi-VN',
                    'currency'
                  )}
                </p>
                <button type="button" aria-label={t('filter.action.remove')} className="grid h-11 w-11 shrink-0 place-items-center hover:bg-white dark:hover:bg-[#425942]" onClick={() => removeFilter(filter.key)}><X className="h-3 w-3 text-[#3d5b10] dark:text-[#d1ff52]" /></button>
              </span>
            );
          }

          return (
            <span
              key={key}
              className="inline-flex min-h-8 w-fit items-center gap-2 border border-[#bdc9b5] bg-[#e5f3c9] px-2.5 py-1 text-xs text-[#263b16] dark:border-[#526354] dark:bg-[#314437] dark:text-[#edf3e7]"
            >
              <p className="capitalize">
                {t(`filter.active.active_${filter.key.replace('_id', '')}`)}
                {filter.display || filter.value}
              </p>
              <button type="button" aria-label={t('filter.action.remove')} className="grid h-11 w-11 shrink-0 place-items-center hover:bg-white dark:hover:bg-[#425942]" onClick={() => removeFilter(filter.key, String(filter.value))}><X className="h-3 w-3 text-[#3d5b10] dark:text-[#d1ff52]" /></button>
            </span>
          );
        })}
        <button
          className="min-h-11 cursor-pointer px-3 py-1 text-xs text-[#8d3e35] transition-colors hover:bg-[#f8eeec] hover:underline dark:text-[#f2bdb4] dark:hover:bg-[#4a3833]"
          onClick={clearFilters}
        >
          {t('filter.action.clear')}
        </button>
      </div>
      {isHavingSort && (
        <div className="ml-auto flex items-center gap-2">
          <SortingIndicator t={t} content="default" />
      <div className="h-5 w-fit border-l border-[#aab6a6] dark:border-[#506353]" />
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
    <button
      type="button"
      aria-pressed={isActive}
      className={twMerge(
        'flex min-h-11 cursor-pointer items-center gap-1 border border-transparent px-3 py-2 text-xs text-[#536056] transition-colors hover:border-[#658338] hover:bg-white dark:text-[#b5c5b6] dark:hover:border-[#d1ff52] dark:hover:bg-[#314437]',
        isActive &&
          'border-[#8da881] bg-[#e5f3c9] text-[#3d5b10] dark:border-[#d1ff52] dark:bg-[#314437] dark:text-[#d1ff52]',
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
    </button>
  );
}
