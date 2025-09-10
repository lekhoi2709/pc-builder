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
          className="line-clamp-1 flex w-fit cursor-pointer items-center justify-between rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
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
        className="ml-2 cursor-pointer text-xs text-blue-600 hover:underline"
      >
        Clear All
      </button>
    </div>
  );
};
