export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  AFFILIATE = 'AFFILIATE',
}

export enum ProductCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isEmailVerified?: boolean;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  userId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  rating: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  size?: string;
  sizes?: ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL' | string)[];
  gender?: 'Male' | 'Female' | 'Unisex';
  neckSize?: string;
  waistSize?: string;
  bodyTypeFit?: ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL')[];
  condition: ProductCondition;
  material?: string;
  color?: string;
  brand?: string;
  quantity: number;
  sold: number;
  rating: number;
  trending: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  trackingNumber?: string;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripeId?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload extends AuthPayload {
  name: string;
  role?: UserRole;
}
