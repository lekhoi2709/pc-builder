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
        className="w-full rounded border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {term && (
        <CircleXIcon
          className="absolute right-3 top-1/2 z-10 ml-2 h-4 w-4 translate-y-[-50%] cursor-pointer text-gray-600 hover:text-red-700"
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
