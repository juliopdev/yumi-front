import { ApiRequest } from "./dtoApi";
import { DEFAULT_PAGE, Page } from "./dtoHelper";
import * as dto from "./dtoRequest";
import * as res from "./dtoResponse";
import { tokenManager } from "./tokenManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://yumi-back.onrender.com';

async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: unknown | null,
  extraHeaders: Record<string, string> = {},
  json = true,
  options: { signal?: AbortSignal } = {}
): Promise<T> {
  const thisHeaders = tokenManager.getToken() ?
    {
      'Authorization': `Bearer ${tokenManager.getToken()}`,
      'X-Session-ID': tokenManager.getAnonimous()
    } : {
      'X-Session-ID': tokenManager.getAnonimous()
    };
  const credentialsHeader = {
    method,
    headers: { ...thisHeaders, ...(json ? { 'Content-Type': 'application/json' } : {}), ...extraHeaders },
    signal: options?.signal,
  }
  credentialsHeader["body"] = body;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, credentialsHeader);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const fetchApi = {
  get: {
    about: () => request<ApiRequest<dto.AboutRequest[]>>('/api/about'),
    faqs: () => request<ApiRequest<dto.FaqRequest[]>>('/api/faqs'),
    policies: () => request<ApiRequest<dto.PolicyRequest[]>>('/api/policies'),
    address: () => request<ApiRequest<dto.AddressRequest[]>>('/api/addresses'),
    myProfile: () => request<ApiRequest<dto.UserRequest>>('/api/me'),
    myCart: () => request<ApiRequest<dto.CartRequest>>('/api/cart'),
    categories: (
      name?: string,
      page: number = DEFAULT_PAGE.page,
      size: number = DEFAULT_PAGE.size
    ) => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      if (name) params.set('name', name);
      const query = params.toString();
      return request<ApiRequest<Page<dto.CategoryRequest>>>(`/api/categories?${query}`);
    },
    category: (slug: string) => request<ApiRequest<dto.CategoryRequest>>(`/api/categories/${slug}`),
    categoryWithProducts: (slug: string) => request<ApiRequest<dto.CategoryWithProductsRequest>>(`/api/categories/${slug}/products`),
    features: (name?: string) => request<ApiRequest<Page<dto.FeatureRequest[]>>>(`/api/features${name ? "?name=" + name : ""}`),
    feature: (id: number) => request<ApiRequest<dto.FeatureRequest>>(`/api/features/${id}`),
    featureWithProducts: (id: number) => request<ApiRequest<dto.FeatureSearchRequest>>(`/api/features/${id}/products`),
    products: (
      category?: string,
      feature?: string,
      search?: string,
      min: number = 0,
      max: number = 99999,
      page: number = DEFAULT_PAGE.page,
      size: number = DEFAULT_PAGE.size,
      options: { signal?: AbortSignal } = {}
    ) => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      if (category) params.set('category', category);
      if (feature) params.set('feature', feature);
      if (search) params.set('search', search);
      if (min) params.set('minPrice', min.toString());
      if (max && max !== 99999) params.set('maxPrice', max.toString());
      const query = params.toString();
      return request<ApiRequest<Page<dto.ProductRequest>>>(`/api/products?${query}`, 'GET', null, {}, true, options);
    },
    product: (id: number) => request<ApiRequest<dto.ProductRequest>>(`/api/products/${id}`),
    myOrders: () => request<ApiRequest<Page<dto.OrderRequest>>>('/api/orders'),
    myOrder: (sku: string) => request<ApiRequest<dto.OrderRequest>>(`/api/orders/${sku}`),
  },

  post: {
    address: (data: res.AddressResponse) => request<ApiRequest<dto.AddressRequest>>('/api/addresses', 'POST', JSON.stringify(data)),
    register: (data: res.RegisterResponse) => request<ApiRequest<dto.AuthRequest>>('/api/auth/register', 'POST', JSON.stringify(data)),
    login: (data: res.LoginResponse) => request<ApiRequest<dto.AuthRequest>>('/api/auth/login', 'POST', JSON.stringify(data)),
    mergeCart: (items: res.AddItemResponse[]) => request<ApiRequest<dto.CartRequest>>('/api/cart/merge', 'POST', JSON.stringify(items)),
    addItemToCart: (item: res.AddItemResponse) => request<ApiRequest<dto.CartRequest>>('/api/cart/items', 'POST', JSON.stringify(item)),
    initChat: () => request<ApiRequest<{ sessionId: string }>>('/api/chat/init', 'POST'),
    yumiBot: (msg: res.ChatResponse) => request<ApiRequest<dto.ChatRequest>>('/api/chat', 'POST', JSON.stringify(msg)),
    order: (newOrder: res.CreateOrderResponse) => {
      const isAuth = !!tokenManager.getToken();
      const endpoint = isAuth ? '/api/orders' : '/api/orders/anonymous';
      return request<ApiRequest<dto.OrderRequest>>(endpoint, 'POST', JSON.stringify(newOrder));
    },
  },

  put: {
    address: (data: res.AddressResponse) => request<ApiRequest<dto.AddressRequest>>(`/api/address/${data.id}`, 'PUT', JSON.stringify(data)),
    changePassword: (data: res.ChangePasswordResponse) => request<ApiRequest<dto.AuthRequest>>('/api/auth/password', 'PUT', JSON.stringify(data)),
    profileUser: (data: res.UserEditResponse) => request<ApiRequest<dto.UserRequest>>('/api/me', 'PUT', JSON.stringify(data)),
  },

  delete: {
    address: (id: number) => request<ApiRequest<string>>(`/api/address/${id}`, 'DELETE'),
    removeItemToCart: (id: number) => request<ApiRequest<dto.CartRequest>>(`/api/cart/items/${id}`, 'DELETE'),
    clearCart: () => request<ApiRequest<string>>('/api/cart', 'DELETE'),
  },

  patch: {
    updateItemQuantity: (itemId: number, quantity: number) =>
      request<ApiRequest<dto.CartRequest>>(`/api/cart/items/${itemId}?quantity=${quantity}`, 'PATCH'),
  }
};

export const fetchAdminApi = {
  get: {
    audit: (page: number = 0, size: number = 10) => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      return request<ApiRequest<Page<dto.AdminAuditLogRequest>>>(`/api/admin/audit-logs?${params}`);
    },
    users: (page: number = 0, size: number = 10) => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      return request<ApiRequest<Page<dto.UserRequest>>>(`/api/admin/users?${params}`);
    },
    orders: (page: number = 0, size: number = 10) => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      return request<ApiRequest<Page<dto.OrderRequest>>>(`/api/admin/orders?${params}`);
    },
    testOrders: () => request<unknown>('/api/admin/orders/debug/auth'),
  },

  post: {
    category: (data: res.CategoryResponse) => request<ApiRequest<dto.CategoryRequest>>('/api/admin/categories', 'POST', JSON.stringify(data)),
    feature: (data: res.FeatureResponse) => request<ApiRequest<dto.FeatureRequest>>('/api/admin/features', 'POST', JSON.stringify(data)),
    bulkFeature: (data: res.FeatureResponse[]) => request<ApiRequest<dto.FeatureRequest[]>>('/api/admin/features/bulk', 'POST', JSON.stringify(data)),
    product: (data: FormData) => request<ApiRequest<dto.ProductRequest>>('/api/admin/products', 'POST', data, {}, false),
  },

  put: {
    changeRole: (userId: number, data: res.ChangeRoleResponse) => request<ApiRequest<dto.UserRequest>>(`/api/admin/users/${userId}/role`, 'PUT', JSON.stringify(data)),
    category: (slug: string, data: res.CategoryResponse) => request<ApiRequest<dto.CategoryRequest>>(`/api/admin/categories/${slug}`, 'PUT', JSON.stringify(data)),
    feature: (id: number, data: res.FeatureResponse) => request<ApiRequest<dto.FeatureRequest>>(`/api/admin/features/${id}`, 'PUT', JSON.stringify(data)),
    product: (id: number, data: FormData) => request<ApiRequest<dto.ProductRequest>>(`/api/admin/products/${id}`, 'PUT', data, {}, false),
  },

  delete: {
    category: (slug: string) => request<ApiRequest<string>>(`/api/admin/categories/${slug}`, 'DELETE'),
    feature: (id: number) => request<ApiRequest<string>>(`/api/admin/features/${id}`, 'DELETE'),
    product: (id: number) => request<ApiRequest<string>>(`/api/admin/products/${id}`, 'DELETE'),
  },

  patch: {
    product: (id: number) => request<ApiRequest<dto.ProductRequest>>(`/api/admin/products/${id}/restore`, 'PATCH'),
    changeOrderStatus: (sku: string, status: res.OrderStatusResponse) => request<ApiRequest<dto.OrderRequest>>(`/api/admin/orders/${sku}/status`, 'PATCH', JSON.stringify(status)),
  },
};