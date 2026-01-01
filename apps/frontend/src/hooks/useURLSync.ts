import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useComponentStore } from '../stores/componentStore';

export function useURLSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, pagination, initializeFromURL } = useComponentStore();

  useEffect(() => {
    initializeFromURL(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (pagination.current_page > 1) {
      params.set('page', pagination.current_page.toString());
    }
    if (pagination.page_size && pagination.page_size !== 12) {
      params.set('page_size', pagination.page_size.toString());
    }

    if (filters.category_id && filters.category_id.length > 0) {
      params.set('category_id', filters.category_id.join(','));
    }
    if (filters.brand_id && filters.brand_id.length > 0) {
      params.set('brand_id', filters.brand_id.join(','));
    }
    if (filters.min_price) {
      params.set('min_price', filters.min_price.toString());
    }
    if (filters.max_price) {
      params.set('max_price', filters.max_price.toString());
    }
    if (filters.search) {
      params.set('search', filters.search);
    }
    if (filters.sort_by && filters.sort_by !== 'name') {
      params.set('sort_by', filters.sort_by);
    }
    if (filters.sort_order && filters.sort_order !== 'asc') {
      params.set('sort_order', filters.sort_order);
    }
    if (filters.currency) {
      params.set('currency', filters.currency);
    }

    setSearchParams(params, { replace: true });
  }, [filters, pagination, setSearchParams]);

  return { searchParams };
}
