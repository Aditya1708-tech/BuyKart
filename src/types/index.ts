export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  specifications: Record<string, string>;
  badge?: "Best Seller" | "New" | "Trending" | "Limited";
  inStock: boolean;
  deliveryDays: number;
  offers?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string;
  type: "Home" | "Work" | "Other";
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "Ordered" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  address: Address;
  paymentMethod: string;
  estimatedDelivery: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
