import { OrderStatus, UserRole } from "./dtoHelper";

/* ========== ADDRESS ========== */
export interface AddressResponse {
  id?: number;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EditAddressResponse {
  id: number;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/* ========== AUTH ========== */
export interface LoginResponse {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  password: string;
  fullName: string;
}

export interface UserEditResponse {
  newEmail?: string;
  newFullName?: string;
}

export interface ChangePasswordResponse {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeRoleResponse {
  role: UserRole;
}

/* ========== CART ========== */
export interface AddItemResponse {
  productSku: string;
  quantity: number;
}

/* ========== CATALOG ========== */
export interface FeatureResponse {
  name: string;
  value: string;
}

export interface CategoryResponse {
  name: string;
  description?: string;
}

export interface CreateProductResponse {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  image: Blob; // o File
  features: FeatureResponse[];
}

export interface EditProductResponse {
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  image?: File;
  features?: FeatureResponse[];
}

/* ========== CHATBOTAI ========== */
export interface ChatResponse {
  message: string;
  sessionId?: string;
}

/* ========== ORDER ========== */
export interface OrderItemResponse {
  productSku: string;
  quantity: number;
}

export interface CreateOrderResponse {
  customerEmail: string;
  isAnonymous: boolean;
  addressDetail: AddressResponse;
  items: OrderItemResponse[];
}

export interface OrderStatusResponse {
  status: OrderStatus;
}