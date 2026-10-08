import type { Product, User, Order } from "../types";

/**
 * Base URL for the backend API.
 * In development, defaults to http://localhost:5000.
 * In production (e.g. deployed on Vercel), set VITE_API_URL to the deployed Render backend URL.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * Constructs a full API endpoint URL using API_BASE_URL.
 * Supports relative endpoints like "/api/products" or "api/products".
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;
  const url = getApiUrl(endpoint);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Fallback to generic message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  /** Health check endpoint */
  health: () =>
    apiFetch<{ ok: boolean; status?: string; service?: string; database?: string; uptime?: number; timestamp?: string }>(
      "/api/health"
    ),

  /** Products endpoints */
  getProducts: (params?: { q?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.category) searchParams.set("category", params.category);
    const queryString = searchParams.toString();
    return apiFetch<{ products: Product[]; total: number }>(
      `/api/products${queryString ? `?${queryString}` : ""}`
    );
  },

  getProductById: (id: string) =>
    apiFetch<Product>(`/api/products/${encodeURIComponent(id)}`),

  /** Authentication endpoints */
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiFetch<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    apiFetch<{ user: User }>("/api/me", { token }),

  /** Cart endpoints */
  getCart: (token: string) =>
    apiFetch<{ items: Array<{ productId: string; quantity: number }> }>("/api/cart", { token }),

  updateCart: (token: string, items: Array<{ productId: string; quantity: number }>) =>
    apiFetch<{ items: Array<{ productId: string; quantity: number }> }>("/api/cart", {
      method: "PUT",
      token,
      body: JSON.stringify({ items }),
    }),

  /** Order endpoints */
  createOrder: (token: string, items: Array<{ productId: string; quantity: number }>) =>
    apiFetch<Order>("/api/orders", {
      method: "POST",
      token,
      body: JSON.stringify({ items }),
    }),

  getOrders: (token: string) =>
    apiFetch<{ orders: Order[] }>("/api/orders", { token }),
};
