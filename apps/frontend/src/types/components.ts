export interface Category {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  display_name: string;
  logo_url: string;
  website: string;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  name: string;
  category_id: string;
  brand_id: string;
  models: string;
  price: PriceItem[];
  image_url: string[];
  is_active: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComponentSpec {
  id: number;
  component_id: string;
  spec_key: string;
  spec_value: string;
  spec_type: string;
  is_filterable: boolean;
  created_at: string;
}

export interface ComponentWithRelations extends Component {
  category_name?: string;
  category_display?: string;
  brand_name?: string;
  brand_display?: string;
  specs_map?: Record<string, string>;
}

export interface PriceItem {
  currency: string;
  amount: number;
  symbol: string;
}

export interface FilterOption {
  key: string;
  value: string;
  display_name?: string;
  count: number;
}

export interface ComponentStats {
  total_components: number;
  by_category: Record<string, number>;
  by_brand: Record<string, number>;
  price_range: {
    min_price: number;
    max_price: number;
    currency: string;
  };
}

export interface AvailableFilters {
  categories: Category[];
  brands: Brand[];
  specs: Record<string, FilterOption[]>;
  price_range: {
    min_price: number;
    max_price: number;
    currency: string;
  };
}

export interface ComponentFilter {
  category_id?: string[];
  brand_id?: string[];
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
  currency?: string;
  // Spec filters - dynamic based on available specs
  [key: string]: string | number | string[] | undefined;
}

export interface PaginationMeta {
  current_page: number;
  page_size?: number;
  total_pages?: number;
  total_records?: number;
}

export interface ComponentResponse {
  components: ComponentWithRelations[];
  pagination: PaginationMeta;
  filters: ComponentFilter;
  summary: ComponentStats;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  response?: T;
}
