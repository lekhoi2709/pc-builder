import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useFiltersFromURL } from '../hooks/useFiltersFromURL';

type SearchComponentBarProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  translation_page?: string;
};

export default function SearchComponentBar({ className, inputClassName, placeholder = 'filter.action.search', translation_page = 'component' }: SearchComponentBarProps) {
  const { filters, setFilters } = useFiltersFromURL();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const { t } = useTranslation(translation_page);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    if (inputRef.current) inputRef.current.value = filters.search ?? '';
  }, [filters.search]);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleChange = (value: string) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setFilters({ search: value.trim() || undefined }), 350);
  };

  return <div role="search" className={twMerge('relative flex min-h-12 w-full items-center border border-[#aab6a6] bg-white text-[#111c1a] transition-colors focus-within:border-[#658338] dark:border-[#506353] dark:bg-[#243229] dark:text-[#edf3e7] dark:focus-within:border-[#d1ff52]', className)}>
    <Search className="ml-4 h-5 w-5 shrink-0 text-[#658338] dark:text-[#d1ff52]" strokeWidth={1.8} aria-hidden="true" />
    <input ref={inputRef} type="text" aria-label={t(placeholder)} defaultValue={filters.search ?? ''} onChange={event => handleChange(event.target.value)} placeholder={t(placeholder)} className={twMerge('peer min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-inherit outline-none placeholder:text-[#7b8c7e] dark:placeholder:text-[#9eafa2]', inputClassName)} />
    <button type="button" onClick={() => { window.clearTimeout(timerRef.current); if (inputRef.current) { inputRef.current.value = ''; inputRef.current.focus(); } setFilters({ search: undefined }); }} aria-label={t('filter.action.clear_search')} className="mr-2 grid h-10 w-10 shrink-0 cursor-pointer place-items-center text-[#536056] transition-colors hover:bg-[#e5f3c9] hover:text-[#111c1a] peer-placeholder-shown:invisible dark:text-[#b5c5b6] dark:hover:bg-[#425942]"><X className="h-4 w-4" /></button>
  </div>;
}
