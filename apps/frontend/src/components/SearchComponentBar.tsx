import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useComponentStore } from '../stores/componentStore';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from './Icons/XIcon';

export default function SearchComponentBar() {
  const { filters, setFilters } = useComponentStore();
  const [term, setTerm] = useState(filters.search ?? '');
  const { t } = useTranslation('component');

  useEffect(() => {
    setTerm(filters.search ?? '');
  }, [filters.search]);

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
        placeholder={t('filter.action.search')}
        className="border-light-elevated dark:border-dark-elevated bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 placeholder:text-primary-600/50 dark:placeholder:text-primary-100/50 rounded-4xl w-full border px-4 py-2 pl-10 focus:outline-none focus:ring-1"
      />
      {term && (
        <DeleteIcon
          className="m-0! absolute right-3 top-1/2 z-10 h-5 w-5 translate-y-[-50%] cursor-pointer"
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
