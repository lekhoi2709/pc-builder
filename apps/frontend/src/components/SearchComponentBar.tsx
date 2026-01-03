import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from './Icons/XIcon';
import { twMerge } from 'tailwind-merge';
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';

export default function SearchComponentBar({
  className,
  inputClassName,
  placeholder = 'filter.action.search',
  translation_page = 'component',
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  translation_page?: string;
}) {
  const { filters, setFilters } = useFiltersFromURL();
  const [term, setTerm] = useState(filters.search ?? '');
  const { t } = useTranslation(translation_page);

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
    <div
      className={twMerge(
        'text-primary-600 dark:text-primary-100 relative w-full',
        className
      )}
    >
      <SearchIcon className="absolute left-3 top-1/2 mr-2 inline-block h-5 w-5 -translate-y-[50%]" />
      <input
        type="text"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder={t(placeholder)}
        className={twMerge(
          'border-light-elevated dark:border-dark-elevated bg-light-elevated dark:bg-dark-elevated focus:ring-secondary-300 dark:focus:ring-secondary-500 placeholder:text-primary-600/50 dark:placeholder:text-primary-100/50 rounded-4xl w-full border px-4 py-2 pl-10 focus:outline-none focus:ring-1',
          inputClassName
        )}
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
