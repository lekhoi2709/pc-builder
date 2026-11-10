import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteIcon } from './Icons/XIcon';
import { twMerge } from 'tailwind-merge';
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';

type SearchComponentBarProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  translation_page?: string;
};

type SearchInputProps = SearchComponentBarProps & {
  initialTerm: string;
  setFilters: ReturnType<typeof useFiltersFromURL>['setFilters'];
};

export default function SearchComponentBar(props: SearchComponentBarProps) {
  const { filters, setFilters } = useFiltersFromURL();
  const initialTerm = filters.search ?? '';

  return (
    <SearchInput
      key={initialTerm}
      {...props}
      initialTerm={initialTerm}
      setFilters={setFilters}
    />
  );
}

function SearchInput({
  className,
  inputClassName,
  placeholder = 'filter.action.search',
  translation_page = 'component',
  initialTerm,
  setFilters,
}: SearchInputProps) {
  const [term, setTerm] = useState(initialTerm);
  const { t } = useTranslation(translation_page);

  useEffect(() => {
    if (term === initialTerm) return;

    const debounce = window.setTimeout(() => {
      setFilters({ search: term || undefined });
    }, 400);
    return () => window.clearTimeout(debounce);
  }, [initialTerm, setFilters, term]);

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
