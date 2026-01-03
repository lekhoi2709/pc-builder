import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { ComponentFilter, PaginationMeta } from '../types/components';

export function useFiltersFromURL() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo((): ComponentFilter => {
    const categoryParams = searchParams.get('category_id');
    const brandParams = searchParams.get('brand_id');
    const minPriceParam = searchParams.get('min_price');
    const maxPriceParam = searchParams.get('max_price');

    return {
      category_id: categoryParams ? categoryParams.split(',') : undefined,
      brand_id: brandParams ? brandParams.split(',') : undefined,
      min_price: minPriceParam ? Number(minPriceParam) : undefined,
      max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
      search: searchParams.get('search') || undefined,
      sort_by:
        (searchParams.get('sort_by') as ComponentFilter['sort_by']) || 'name',
      sort_order:
        (searchParams.get('sort_order') as ComponentFilter['sort_order']) ||
        'asc',
      currency: searchParams.get('currency') || undefined,
    };
  }, [searchParams]);

  const pagination = useMemo((): PaginationMeta => {
    return {
      current_page: parseInt(searchParams.get('page') || '1'),
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<ComponentFilter>) => {
      setSearchParams(
        prev => {
          if (newFilters.category_id !== undefined) {
            if (newFilters.category_id && newFilters.category_id.length > 0) {
              prev.set('category_id', newFilters.category_id.join(','));
            } else {
              prev.delete('category_id');
            }
          }

          if (newFilters.brand_id !== undefined) {
            if (newFilters.brand_id && newFilters.brand_id.length > 0) {
              prev.set('brand_id', newFilters.brand_id.join(','));
            } else {
              prev.delete('brand_id');
            }
          }

          if (newFilters.min_price !== undefined) {
            if (newFilters.min_price) {
              prev.set('min_price', newFilters.min_price.toString());
            } else {
              prev.delete('min_price');
            }
          }

          if (newFilters.max_price !== undefined) {
            if (newFilters.max_price) {
              prev.set('max_price', newFilters.max_price.toString());
            } else {
              prev.delete('max_price');
            }
          }

          if (newFilters.search !== undefined) {
            if (newFilters.search) {
              prev.set('search', newFilters.search.toString());
            } else {
              prev.delete('search');
            }
          }

          if (newFilters.sort_by) {
            prev.set('sort_by', newFilters.sort_by);
          }

          if (newFilters.sort_order) {
            prev.set('sort_order', newFilters.sort_order);
          }

          if (newFilters.currency) {
            prev.set('currency', newFilters.currency);
          }

          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setPagination = useCallback(
    (newPagination: Partial<PaginationMeta>) => {
      setSearchParams(
        prev => {
          if (newPagination.current_page) {
            prev.set('page', newPagination.current_page.toString());
          }

          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      prev => {
        prev.delete('category_id');
        prev.delete('brand_id');
        prev.delete('min_price');
        prev.delete('max_price');
        prev.delete('search');
        prev.set('sort_by', 'name');
        prev.set('sort_order', 'asc');
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const toggleCategoryFilter = useCallback(
    (categoryId: string) => {
      setSearchParams(
        prev => {
          const current =
            prev.get('category_id')?.split(',').filter(Boolean) || [];
          const newCategories = current.includes(categoryId)
            ? current.filter(id => id !== categoryId)
            : [...current, categoryId];

          if (newCategories.length > 0) {
            prev.set('category_id', newCategories.join(','));
          } else {
            prev.delete('category_id');
          }

          prev.set('page', '1');
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleBrandFilter = useCallback(
    (brandId: string) => {
      setSearchParams(
        prev => {
          const current =
            prev.get('brand_id')?.split(',').filter(Boolean) || [];
          const newBrands = current.includes(brandId)
            ? current.filter(id => id !== brandId)
            : [...current, brandId];

          if (newBrands.length > 0) {
            prev.set('brand_id', newBrands.join(','));
          } else {
            prev.delete('brand_id');
          }

          prev.set('page', '1');
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const removeFilter = useCallback(
    (key: keyof ComponentFilter, value?: string) => {
      setSearchParams(
        prev => {
          if (key === 'category_id' || key === 'brand_id') {
            if (value) {
              const current = prev.get(key)?.split(',').filter(Boolean) || [];
              const newValues = current.filter(v => v !== value);
              if (newValues.length > 0) {
                prev.set(key, newValues.join(','));
              } else {
                prev.delete(key);
              }
            } else {
              prev.delete(key);
            }
          }

          prev.set('page', '1');
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return {
    filters,
    pagination,
    setFilters,
    setPagination,
    clearFilters,
    toggleCategoryFilter,
    toggleBrandFilter,
    removeFilter,
  };
}
