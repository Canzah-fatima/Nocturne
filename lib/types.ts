export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // Stored in cents ($140.00 = 14000)
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  badge?: string | null;
  stockCount: number;
  rating: number;
  reviewCount: number;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  title: string;
  price: number; // Stored in cents
  quantity: number;
  image?: string | null;
  color?: string | null;
  size?: string | null;
}

export interface Order {
  id: string;
  userId?: string | null;
  totalAmount: number; // Stored in cents
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  address: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  productId?: string | null;
  name: string;
  text: string;
  rating: number;
  role: string;
  createdAt?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt?: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  stockCount?: number;
}