import type {
  ApiResponse,
  AvailableFilters,
  Brand,
  Category,
  Component,
  ComponentFilter,
  ComponentResponse,
  ComponentWithRelations,
  PaginationMeta,
} from '../types/components';

const langToCurrency: Record<string, string> = {
  en: 'USD',
  vn: 'VND',
  es: 'EUR',
  fr: 'EUR',
  de: 'EUR',
  zh: 'CNY',
  ja: 'JPY',
};

function buildQueryParams(filters: ComponentFilter & PaginationMeta): string {
  const params = new URLSearchParams();

  // Add pagination params
  if (filters.current_page)
    params.append('page', filters.current_page.toString());
  if (filters.page_size)
    params.append('page_size', filters.page_size.toString());

  // Add filter params
  if (filters.category_id && filters.category_id.length > 0) {
    params.append('category_id', filters.category_id.join(','));
  }

  if (filters.brand_id && filters.brand_id.length > 0) {
    params.append('brand_id', filters.brand_id.join(','));
  }

  if (filters.min_price)
    params.append('min_price', filters.min_price.toString());
  if (filters.max_price)
    params.append('max_price', filters.max_price.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.sort_order) params.append('sort_order', filters.sort_order);
  if (filters.currency) params.append('currency', filters.currency);

  // Add dynamic spec filters
  const specKeys = [
    'socket',
    'form_factor',
    'memory_type',
    'storage_type',
    'interface',
    'generation',
    'process_size',
  ];
  for (const key of specKeys) {
    const value = filters[key];
    if (value && typeof value === 'string') {
      params.append(key, value);
    }
  }

  return params.toString();
}

const API_VERSION = 'v1';
const API_BASE = import.meta.env.VITE_API_URL + API_VERSION;

export async function GetHealth() {
  const response = await fetch(API_BASE + '/health', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('HTTP error! status: ' + response.status);
  }

  const json = await response.json();
  return json;
}

export async function GetCategories(): Promise<Category[]> {
  const response = await fetch(API_BASE + '/categories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('HTTP error! status: ' + response.status);
  }

  const json = await response.json();
  return json.response as Category[];
}

export async function GetBrands(): Promise<Brand[]> {
  const response = await fetch(API_BASE + '/brands', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('HTTP error! status: ' + response.status);
  }

  const json = await response.json();
  return json.response as Brand[];
}

export async function GetAllComponents(): Promise<Component[]> {
  const response = await fetch(API_BASE + '/components/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await response.json();
  return json.response as Component[];
}

export async function GetComponents(
  filters: ComponentFilter = {},
  pagination: PaginationMeta,
  lang: string = 'vn'
): Promise<ComponentResponse> {
  if (lang && !filters.currency) {
    filters.currency = langToCurrency[lang];
  }

  const queryParams = buildQueryParams({ ...filters, ...pagination });
  const url = `${API_BASE}/components${queryParams ? `?${queryParams}` : ''}`;

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

  return json.response as ComponentResponse;
}

export async function GetComponentById(
  id: string
): Promise<ComponentWithRelations> {
  const response = await fetch(`${API_BASE}/components/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Component not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return json.response as Component;
}

export async function GetAvailableFilters(
  lang: string
): Promise<AvailableFilters> {
  const response = await fetch(`${API_BASE}/components/filters`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: ApiResponse<AvailableFilters> = await response.json();
  if (!json.response) {
    throw new Error(json.message || 'No data received');
  }

  return json.response;
}
