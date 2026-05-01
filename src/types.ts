/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'customer';
  points: number;
  createdAt: number;
}

export interface BabyProfile {
  id: string;
  userId: string;
  name: string;
  dob: string; // ISO string
  weight: number; // in kg
  skinType: 'normal' | 'sensitive' | 'prone_to_rash';
}

export type BabyAgeRange = '0-3m' | '3-6m' | '6-12m' | '1-2t' | '2-3t';

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earn, negative for burn
  type: 'order' | 'manual' | 'redeem';
  description: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Bỉm sữa" | "Đồ dùng sơ sinh" | "Thực phẩm ăn dặm" | "Đồ dùng cho mẹ bầu và sau sinh";
  size?: 'NB' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  skinType?: 'all' | 'sensitive';
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  description: string;
  features: string[];
  specs: { [key: string]: string };
  rating: number;
  reviewCount: number;
  isSubscribeable?: boolean;
  promotionType?: 'none' | 'percent' | 'fixed';
  promotionValue?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  paymentMethod: 'cod' | 'vnpay' | 'momo' | 'card';
  shippingAddress: string;
  createdAt: number;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  frequency: '2_weeks' | '1_month' | '6_weeks';
  nextDelivery: number; // timestamp
  status: 'active' | 'paused' | 'cancelled';
  discount: number;
  pricePerCycle: number;
}
