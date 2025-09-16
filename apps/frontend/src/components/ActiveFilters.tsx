import { CircleXIcon, ArrowUpAzIcon, ArrowDownAZIcon } from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'react-router';

const langToCurrency: Record<string, string> = {
  vn: 'VND',
  en: 'USD',
};

const langToLocale: Record<string, string> = {
  vn: 'vi-VN',
  en: 'en-US',
};

export const ActiveFilters = () => {
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
      <div className="font-saira flex w-full justify-end">
        <div className="flex items-center gap-2 self-end">
          <SortingIndicator content="Default Sorting" />
        </div>
      </div>
    );

  return (
    <div className="font-saira flex justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map(({ key, value }) =>
          key === 'max_price' || key === 'min_price' ? (
            <span
              key={key}
              className="bg-primary-100/50 border-primary-300 dark:text-primary-50 dark:hover:bg-primary-600/50 dark:bg-primary-800/50 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded border px-2 py-1 dark:border-transparent"
            >
              {key}:{' '}
              {priceFormatter(
                parseInt(value as string),
                langToLocale[lang || 'vn'] || 'vi-VN',
                'currency'
              )}
              <CircleXIcon
                className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => removeFilter(key)}
              />
            </span>
          ) : (
            <span
              key={key}
              className="bg-primary-100/50 border-primary-300 dark:text-primary-50 dark:hover:bg-primary-600/50 dark:bg-primary-800/50 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded border px-2 py-1 dark:border-transparent"
            >
              {key}: {String(value)}
              <CircleXIcon
                className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => removeFilter(key)}
              />
            </span>
          )
        )}
        <button
          onClick={clearFilter}
          className="text-primary-700 dark:text-primary-200 ml-2 cursor-pointer text-xs hover:underline"
        >
          Clear All
        </button>
      </div>
      <div className="flex items-center gap-2">
        {/* <p>Default Sorting</p>
        <div className="border-primary-950 h-[50%] w-fit border-l" /> */}
        <SortingIndicator content={activeFilters[0].key} />
      </div>
    </div>
  );
};

function SortingIndicator({
  content = '',
  containerCN,
  textCN,
}: {
  content?: string;
  containerCN?: string;
  textCN?: string;
}) {
  const { filters, setFilters } = useComponentStore();

  return (
    <span
      className={twMerge(
        'text-primary-950 dark:text-primary-50 hover:bg-primary-100 dark:hover:bg-primary-600/50 flex cursor-pointer items-center gap-1 rounded p-2 capitalize',
        containerCN
      )}
      onClick={() =>
        setFilters({
          ...filters,
          sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
        })
      }
    >
      <p className={twMerge('', textCN)}>{content}</p>
      {filters.sort_order === 'asc' ? (
        <ArrowDownAZIcon className="h-4 w-4" />
      ) : (
        <ArrowUpAzIcon className="h-4 w-4" />
      )}
    </span>
  );
}
