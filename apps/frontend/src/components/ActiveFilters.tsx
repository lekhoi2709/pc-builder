import {
  ArrowUpAzIcon,
  ArrowDownAZIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'react-router';
import type { ComponentFilter } from '../types/components';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { XIcon } from './Icons/XIcon';

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
  const { activeFilters, removeFilter, clearFilter, categories, brands } =
    useComponentStore();
  const { lang } = useParams();
  const { t } = useTranslation('component');
  const currency = langToCurrency[lang || 'vn'] || 'VND';

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

  const getDisplayName = (
    key: keyof ComponentFilter,
    value: string
  ): string => {
    if (key === 'category_id') {
      const category = categories.find(c => c.id === value);
      return category?.display_name || value;
    }
    if (key === 'brand_id') {
      const brand = brands.find(b => b.id === value);
      return brand?.display_name || value;
    }
    return value;
  };

  return (
    <div className="font-saira mb-2 flex flex-wrap content-end items-center justify-between gap-6 xl:mb-0">
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map(({ key, value }) => {
          if (key === 'max_price' || key === 'min_price') {
            return (
              <span
                key={key}
                className="bg-accent-200 dark:bg-accent-400/80 prevent-select line-clamp-1 flex !w-fit cursor-pointer items-center justify-between break-keep rounded px-2 py-1"
              >
                <p>
                  {t('filter.active.active', {
                    context: activeFilterStringFormatted({
                      str: String(key),
                    }),
                  })}
                  {priceFormatter(
                    parseInt(value as string),
                    langToLocale[lang || 'vn'] || 'vi-VN',
                    'currency'
                  )}
                </p>

                <XIcon onClick={() => removeFilter(key)} />
              </span>
            );
          }
          if (Array.isArray(value)) {
            return value.map(val => (
              <span
                key={`${key}-${val}`}
                className="bg-accent-200 dark:bg-accent-400/80 prevent-select line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
              >
                <p>
                  {t('filter.active.active', {
                    context: activeFilterStringFormatted({
                      str: String(key),
                    }),
                  })}
                  {getDisplayName(key, val)}
                </p>
                <XIcon onClick={() => removeFilter(key, val)} />
              </span>
            ));
          }

          return (
            <span
              key={key}
              className="bg-accent-200 dark:bg-accent-400/80 prevent-select line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
            >
              <p className="capitalize">
                {activeFilterStringFormatted({ str: String(key) })}:
                {activeFilterStringFormatted({ str: String(value) })}
              </p>
              <XIcon onClick={() => removeFilter(key)} />
            </span>
          );
        })}
        <button
          onClick={clearFilter}
          className="border-1 cursor-pointer rounded border-red-200/50 bg-red-200/50 px-4 py-2 text-xs text-red-600 transition-colors duration-300 ease-in-out hover:border-red-400 hover:bg-red-300/50 hover:underline xl:ml-2 xl:border-0 xl:bg-transparent xl:p-0 xl:hover:bg-transparent dark:border-red-500 dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600/50 xl:dark:bg-transparent xl:dark:hover:bg-transparent"
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
  const { filters, setFilters } = useComponentStore();
  const isActive = filters.sort_by === sort_by;
  const showIcon = isActive;
  const isAscending = filters.sort_order === 'asc';

  return (
    <span
      className={twMerge(
        'hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 flex cursor-pointer items-center gap-1 rounded border-transparent p-2 transition-colors duration-300 ease-in-out',
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
