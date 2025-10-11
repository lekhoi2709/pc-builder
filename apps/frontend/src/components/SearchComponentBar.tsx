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
    <div className="text-primary-600 dark:text-primary-100 relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 mr-2 inline-block h-5 w-5 -translate-y-[50%]" />
      <input
        type="text"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Search..."
        className="border-light-elevated dark:border-dark-elevated border-1 bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 placeholder:text-primary-600/50 dark:placeholder:text-primary-100/50 rounded-4xl w-full px-4 py-2 pl-10 focus:outline-none focus:ring-1"
      />
      {term && (
        <CircleXIcon
          className="text-border dark:text-border-dark hover:fill-accent-200 absolute right-3 top-1/2 z-10 ml-2 h-5 w-5 translate-y-[-50%] cursor-pointer dark:hover:fill-gray-500"
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
