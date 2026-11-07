"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import { storeConfig } from "@/data/config";
import { slugify } from "@/lib/images";

export interface CartItem {
  /** Identifica a combinação exata (produto + tamanho + escolhas + adicionais) */
  lineId: string;
  productId: string;
  name: string;
  /** Ex: "500 ml", "Combo com batata e Guaracamp" */
  variantLabel?: string;
  /** Linhas extras mostradas no pedido: sabores, caldas, adicionais... */
  details: string[];
  /** Preço de UMA unidade (já com os adicionais) */
  price: number;
  quantity: number;
}

type NewCartLine = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; line: NewCartLine; quantity: number }
  | { type: "INCREMENT"; lineId: string }
  | { type: "DECREMENT"; lineId: string }
  | { type: "REMOVE"; lineId: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

// v2: o formato do carrinho mudou (tamanhos, sabores e adicionais).
// A chave inclui o nome da loja para lojas diferentes não dividirem o carrinho.
const STORAGE_KEY = `${slugify(storeConfig.name) || "loja"}-cart-v2`;

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.lineId === action.line.lineId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.lineId === action.line.lineId
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { ...action.line, quantity: action.quantity }],
      };
    }
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.lineId === action.lineId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.lineId === action.lineId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "REMOVE":
      return { items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
    default:
      return state;
  }
}

function isValidItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.lineId === "string" &&
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    Array.isArray(item.details)
  );
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addLine: (line: NewCartLine, quantity?: number) => void;
  increment: (lineId: string) => void;
  decrement: (lineId: string) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  /** Quantidade total de um produto no carrinho (somando todas as variações) */
  getProductQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Hidrata do localStorage uma vez no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed.filter(isValidItem) });
        }
      }
    } catch {
      // ignora erros de parse
    }
  }, []);

  // Persiste no localStorage a cada mudança
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignora
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = state.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );
    return {
      items: state.items,
      totalItems,
      totalPrice,
      addLine: (line, quantity = 1) =>
        dispatch({ type: "ADD", line, quantity }),
      increment: (lineId) => dispatch({ type: "INCREMENT", lineId }),
      decrement: (lineId) => dispatch({ type: "DECREMENT", lineId }),
      removeItem: (lineId) => dispatch({ type: "REMOVE", lineId }),
      clear: () => dispatch({ type: "CLEAR" }),
      getProductQuantity: (productId) =>
        state.items
          .filter((i) => i.productId === productId)
          .reduce((s, i) => s + i.quantity, 0),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
