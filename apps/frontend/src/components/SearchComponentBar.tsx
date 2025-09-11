import { CircleXIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useComponentStore } from '../stores/componentStore';

export default function SearchComponentBar() {
  const { filters, setFilters } = useComponentStore();
  const [term, setTerm] = useState(filters.search ?? '');

  useEffect(() => {
    setTerm(filters.search ?? '');
  }, [filters.search]);

  // debounce search
  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters({ search: term || undefined });
    }, 400);
    return () => clearTimeout(debounce);
  }, [term, setFilters]);

  const clearSearch = () => {
    setTerm('');
    setFilters({ search: undefined });
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 mr-2 inline-block h-5 w-5 -translate-y-[50%]" />
      <input
        type="text"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Search..."
        className="border-primary-600/50 dark:border-primary-400/50 dark:focus:border-primary-500 dark:focus:ring-primary-500 focus:border-primary-600 focus:ring-primary-600 dark:bg-light-dark placeholder:text-primary-900/50 dark:placeholder:text-primary-50/50 w-full rounded border-[0.5px] bg-white px-4 py-2 pl-10 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1"
      />
      {term && (
        <CircleXIcon
          className="absolute right-3 top-1/2 z-10 ml-2 h-5 w-5 translate-y-[-50%] cursor-pointer fill-gray-400 text-white hover:fill-gray-500"
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
