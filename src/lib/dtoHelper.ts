import { AdminAuditLogRequest, CategoryRequest, OrderRequest, ProductRequest, UserRequest } from "./dtoRequest";

export const DEFAULT_PAGE = { page: 0, size: 12 };

export enum UserRole {
  ADMIN = 'ADMIN',
  INVENTORYMANAGER = 'INVENTORYMANAGER',
  SHIPPINGMANAGER = 'SHIPPINGMANAGER',
  CUSTOMER = 'CUSTOMER'
}

export interface ProductSnapshot {
  sku: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
}

export enum Intent {
  GREETING = 'GREETING',
  PRODUCT_SEARCH = 'PRODUCT_SEARCH',
  ORDER_TRACKING = 'ORDER_TRACKING',
  CART_HELP = 'CART_HELP',
  UNKNOWN = 'UNKNOWN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

/* ========== PAGE<T> ========== */
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

/* ========== FORMDATA ========== */
export const toFormData = (dto: Record<string, unknown>): FormData => {
  const fd = new FormData();
  Object.entries(dto).forEach(([k, v]) => {
    if (v instanceof File) fd.append(k, v);
    else if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
    else if (v != null) fd.append(k, String(v));
  });
  return fd;
};

/* ========== INTERFACES ========== */
export interface AdminSetters {
  setProducts: (p: ProductRequest[]) => void;
  setCategories: (c: CategoryRequest[]) => void;
  setOrders: (o: OrderRequest[]) => void;
}
export interface InventorySetters {
  setProducts: (p: ProductRequest[]) => void;
  setCategories: (c: CategoryRequest[]) => void;
}
export interface ShippingSetters {
  setOrders: (o: OrderRequest[]) => void;
}