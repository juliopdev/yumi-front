import { Intent, OrderStatus, UserRole } from "./dtoHelper";

/* ========== ABOUT ========== */
export interface FaqRequest {
  question: string;
  answer: string;
}

export interface PolicyRequest {
  title: string;
  content: string;
}

export interface CardRequest {
  icon: string;
  title: string;
  description: string;
}

export interface AboutRequest {
  key: string;
  title: string;
  subtitle: string;
  cards: CardRequest[];
}

/* ========== ADDRESS ========== */
export interface AddressRequest {
  id: number;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  updatedAt: string; // ISO instant
}

/* ========== AUTH ========== */
export interface UserRequest {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthRequest {
  token: string;
  user: UserRequest;
}

/* ========== CART ========== */
export interface CartItemRequest {
  id: number;
  productSku: string;
  productName: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
}

export interface CartRequest {
  cartId: number;
  ownerEmail: string;
  items: CartItemRequest[];
  baseImponible: number;
  igv: number;
  igv_rate: number;
  totalConIGV: number;
}


/* ========== CATALOG ========== */
export interface FeatureRequest {
  id: number;
  name: string;
  value: string;
}

export interface CategoryRequest {
  id: number;
  name: string;
  slug: string;
  description?: string;
  visible?: boolean;
}

export interface CategoryWithProductsRequest {
  id: number;
  name: string;
  slug: string;
  description?: string;
  products: ProductRequest[];
  totalProducts: number;
}

export interface ProductRequest {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  visible?: boolean;
  imageUrl?: string;
  category: CategoryRequest;
  features: FeatureRequest[];
}

export interface FeatureSearchRequest {
  feature: FeatureRequest;
  products: ProductRequest[];
}

/* ========== CHATBOT ========== */
export interface ChatContentRequest {
  reply: string;
  products?: ProductRequest[];
  addToCart: boolean;
  isUserAuthenticated: boolean;
}

export interface ChatRequest {
  type: Intent;
  content: ChatContentRequest;
  isResolved: boolean;
}

/* ========== ORDER ========== */
export interface OrderItemRequest {
  id: number;
  productSku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface UserInOrderRequest {
  id: number;
  email: string;
  fullName: string;
}


export interface OrderRequest {
  id: number;
  orderSku: string;
  customerEmail: string;
  status: OrderStatus;
  addressDetail: AddressRequest;
  items: OrderItemRequest[];
  total: number;
  createdAt: string; // ISO instant
}

/* ========== AUDIT ========== */
export interface AdminAuditLogRequest {
  id: string;
  adminEmail: string;
  role: string;
  action: string;
  createdAt: string; // ISO instant
}