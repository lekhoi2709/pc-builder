import {
  CircleXIcon,
  ArrowUpAzIcon,
  ArrowDownAZIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'react-router';
import { memo } from 'react';

const langToCurrency: Record<string, string> = {
  vn: 'VND',
  en: 'USD',
};

const langToLocale: Record<string, string> = {
  vn: 'vi-VN',
  en: 'en-US',
};

export const ActiveFilters = memo(
  ({ isHavingSort = true }: { isHavingSort?: boolean }) => {
    const { activeFilters, removeFilter, clearFilter } = useComponentStore();
    const { lang } = useParams();
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
              <SortingIndicator content="Default Sorting" />
              <div className="border-primary-950 dark:border-primary-50 h-5 w-fit border-l" />
              <SortingIndicator
                content="Price"
                sort_by="price"
                IconUp={ArrowUp01Icon}
                IconDown={ArrowDown01Icon}
              />
            </div>
          </div>
        )
      );

    const activeFilterStringFormatted = (str: string): string => {
      const strArr = str.split('_');
      if (strArr[1] === 'id' || !strArr[1]) {
        return strArr[0];
      } else if (strArr[0] === 'storage') {
        return strArr[1];
      }
      return strArr[0] + ' ' + strArr[1];
    };

    return (
      <div className="font-saira mb-2 flex flex-wrap content-end items-center justify-between gap-6 xl:mb-0">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(({ key, value }) =>
            key === 'max_price' || key === 'min_price' ? (
              <span
                key={key}
                className="bg-accent-200 dark:bg-accent-400/80 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
              >
                <span className="flex flex-wrap gap-1">
                  <p className="capitalize">
                    {activeFilterStringFormatted(key)}:
                  </p>
                  <p>
                    {priceFormatter(
                      parseInt(value as string),
                      langToLocale[lang || 'vn'] || 'vi-VN',
                      'currency'
                    )}
                  </p>
                </span>

                <CircleXIcon
                  className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => removeFilter(key)}
                />
              </span>
            ) : (
              <span
                key={key}
                className="bg-accent-200 dark:bg-accent-400/80 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded px-2 py-1"
              >
                <span className="flex flex-wrap gap-1">
                  <p className="capitalize">
                    {activeFilterStringFormatted(String(key))}:
                  </p>
                  <p className="capitalize">
                    {activeFilterStringFormatted(String(value))}
                  </p>
                </span>
                <CircleXIcon
                  className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => removeFilter(key)}
                />
              </span>
            )
          )}
          <button
            onClick={clearFilter}
            className="border-1 cursor-pointer rounded border-red-200/50 bg-red-200/50 px-4 py-2 text-xs text-red-600 transition-colors duration-300 ease-in-out hover:border-red-400 hover:bg-red-300/50 hover:underline xl:ml-2 xl:border-0 xl:bg-transparent xl:p-0 xl:hover:bg-transparent dark:border-red-500 dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600/50 xl:dark:bg-transparent xl:dark:hover:bg-transparent"
          >
            Clear All
          </button>
        </div>
        {isHavingSort && (
          <div className="ml-auto flex items-center gap-2">
            <SortingIndicator
              content={activeFilterStringFormatted(
                String(activeFilters[0].key)
              )}
            />
            <div className="border-primary-950 dark:border-primary-50 h-5 w-fit border-l" />
            <SortingIndicator
              content="Price"
              sort_by="price"
              IconUp={ArrowUp01Icon}
              IconDown={ArrowDown01Icon}
            />
          </div>
        )}
      </div>
    );
  }
);

function SortingIndicator({
  content = '',
  containerCN,
  textCN,
  IconUp = ArrowUpAzIcon,
  IconDown = ArrowDownAZIcon,
  sort_by = 'name',
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
}) {
  const { filters, setFilters } = useComponentStore();

  const isActive = filters.sort_by === sort_by;
  const showIcon = isActive;
  const isAscending = filters.sort_order === 'asc';

  return (
    <span
      className={twMerge(
        'hover:bg-accent-300/50 hover:border-secondary-400 dark:hover:bg-secondary-600/50 border-1 flex cursor-pointer items-center gap-1 rounded border-transparent p-2 capitalize transition-colors duration-300 ease-in-out',
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
      <p className={twMerge('prevent-select', textCN)}>{content}</p>
      {showIcon && (
        <>
          {isAscending ? (
            <IconDown className="h-4 w-4" />
          ) : (
            <IconUp className="h-4 w-4" />
          )}
        </>
      )}
    </span>
  );
}
