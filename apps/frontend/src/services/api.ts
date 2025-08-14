import type { Component } from '../types/components';

export interface AvailableFilter {
  categories: string[];
  brands: string[];
}
export interface ComponentFilter {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?:
    | 'name'
    | 'price'
    | 'created_at'
    | 'updated_at'
    | 'brand'
    | 'category';
  sort_order?: 'asc' | 'desc';

  // Spec filters
  socket?: string;
  memory?: string;
  storage?: string;
  form_factor?: string;
  interface?: string;
  wattage?: string;
  generation?: string;
  process_size?: string;
}

export interface PaginationMeta {
  current_page: number;
  page_size?: number;
  total_pages?: number;
  total_records?: number;
}

export interface ComponentSummary {
  total_components: number;
  by_category: Record<string, number>;
  by_brand: Record<string, number>;
  price_range: {
    min_price: number;
    max_price: number;
    currency: string;
  };
}

export interface ComponentResponse {
  components: Component[];
  pagination: PaginationMeta;
  filters: ComponentFilter;
  summary: ComponentSummary;
}

export interface ApiResponse<T> {
  status: number;
  response?: T;
  message?: string;
}

function buildQueryParams(filters: ComponentFilter & PaginationMeta): string {
  const params = new URLSearchParams();

  // Add pagination params
  if (filters.current_page)
    params.append('page', filters.current_page.toString());
  if (filters.page_size)
    params.append('page_size', filters.page_size.toString());

  // Add filter params
  if (filters.category) params.append('category', filters.category);
  if (filters.brand) params.append('brand', filters.brand);
  if (filters.min_price)
    params.append('min_price', filters.min_price.toString());
  if (filters.max_price)
    params.append('max_price', filters.max_price.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.sort_order) params.append('sort_order', filters.sort_order);

  // Add spec filters
  if (filters.socket) params.append('socket', filters.socket);
  if (filters.memory) params.append('memory', filters.memory);
  if (filters.storage) params.append('storage', filters.storage);
  if (filters.form_factor) params.append('form_factor', filters.form_factor);
  if (filters.interface) params.append('interface', filters.interface);
  if (filters.wattage) params.append('wattage', filters.wattage);
  if (filters.generation) params.append('generation', filters.generation);
  if (filters.process_size) params.append('process_size', filters.process_size);

  return params.toString();
}

export async function GetAllComponents(): Promise<Component[]> {
  const response = await fetch(
    import.meta.env.VITE_API_URL + '/components/all',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  return json.components as Component[];
}

export async function GetComponents(
  filters: ComponentFilter = {},
  pagination: PaginationMeta = { current_page: 1, page_size: 12 }
): Promise<ComponentResponse> {
  const queryParams = buildQueryParams({ ...filters, ...pagination });
  const url = `${import.meta.env.VITE_API_URL}/components${queryParams ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: ApiResponse<ComponentResponse> = await response.json();

  if (!json.response) {
    throw new Error(json.message || 'No data received');
  }

  return json.response;
}

export async function GetComponentById(id: string): Promise<Component> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/components/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Component not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.component as Component;
}

export async function GetAvailableFilters(): Promise<AvailableFilter> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/components/filters`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  return json.response as AvailableFilter;
}
