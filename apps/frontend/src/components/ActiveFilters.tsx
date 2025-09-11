import { CircleXIcon } from 'lucide-react';
import { useComponentStore } from '../stores/componentStore';

export const ActiveFilters = () => {
  const { activeFilters, removeFilter, clearFilter } = useComponentStore();

  if (activeFilters.length === 0) return null;

  return (
    <div className="my-4 flex flex-wrap items-center gap-2">
      {activeFilters.map(({ key, value }) => (
        <span
          key={key}
          className="bg-primary-100/50 border-primary-300 dark:border-primary-300/30 dark:text-primary-50 dark:bg-primary-300/30 line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded border px-2 py-1"
        >
          {key}: {String(value)}
          <CircleXIcon
            className="z-10 ml-2 h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => removeFilter(key)}
          />
        </span>
      ))}
      <button
        onClick={clearFilter}
        className="text-primary-700 ml-2 cursor-pointer text-xs hover:underline"
      >
        Clear All
      </button>
    </div>
  );
};
