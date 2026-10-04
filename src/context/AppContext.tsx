import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { CartItem, WishlistItem, User, Order, Toast, Product } from "../types";

interface State {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: User | null;
  orders: Order[];
  toasts: Toast[];
  recentlyViewed: Product[];
}

type Action =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_WISHLIST"; product: Product }
  | { type: "TOGGLE_WISHLIST"; product: Product }
  | { type: "MOVE_TO_CART"; productId: string }
  | { type: "SET_USER"; user: User | null }
  | { type: "ADD_ORDER"; order: Order }
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "ADD_RECENTLY_VIEWED"; product: Product };

const loadState = (): State => {
  try {
    const saved = localStorage.getItem("buykart_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, toasts: [] };
    }
  } catch {}
  return { cart: [], wishlist: [], user: null, orders: [], toasts: [], recentlyViewed: [] };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.product.id === action.product.id);
      if (existing) {
        return { ...state, cart: state.cart.map((i) => i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      return { ...state, cart: state.cart.map((i) => i.product.id === action.productId ? { ...i, quantity: action.quantity } : i) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "ADD_TO_WISHLIST": {
      const exists = state.wishlist.some((i) => i.product.id === action.product.id);
      return exists ? state : { ...state, wishlist: [...state.wishlist, { product: action.product }] };
    }
    case "TOGGLE_WISHLIST": {
      const exists = state.wishlist.some((i) => i.product.id === action.product.id);
      if (exists) return { ...state, wishlist: state.wishlist.filter((i) => i.product.id !== action.product.id) };
      return { ...state, wishlist: [...state.wishlist, { product: action.product }] };
    }
    case "MOVE_TO_CART": {
      const item = state.wishlist.find((i) => i.product.id === action.productId);
      if (!item) return state;
      const inCart = state.cart.some((i) => i.product.id === action.productId);
      return {
        ...state,
        wishlist: state.wishlist.filter((i) => i.product.id !== action.productId),
        cart: inCart ? state.cart.map((i) => i.product.id === action.productId ? { ...i, quantity: i.quantity + 1 } : i) : [...state.cart, { product: item.product, quantity: 1 }],
      };
    }
    case "SET_USER":
      return { ...state, user: action.user };
    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "ADD_RECENTLY_VIEWED": {
      const filtered = state.recentlyViewed.filter((p) => p.id !== action.product.id);
      return { ...state, recentlyViewed: [action.product, ...filtered].slice(0, 8) };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  showToast: (message: string, type?: Toast["type"]) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const { toasts, ...persisted } = state;
    localStorage.setItem("buykart_state", JSON.stringify(persisted));
  }, [state, hydrated]);

  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: "ADD_TOAST", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), 3000);
  };

  const isInCart = (productId: string) => state.cart.some((i) => i.product.id === productId);
  const isInWishlist = (productId: string) => state.wishlist.some((i) => i.product.id === productId);

  const cartTotal = state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast, isInCart, isInWishlist, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
