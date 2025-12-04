// src/context/CartContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  [key: string]: any;
};

type CartEntry = {
  service: ServiceItem;
  qty: number;
};

type CartState = {
  items: CartEntry[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: ServiceItem }
  | { type: "REMOVE_ITEM"; payload: string } // service id
  | { type: "INCREASE_QTY"; payload: string }
  | { type: "DECREASE_QTY"; payload: string }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  items: CartEntry[];
  addItem: (s: ServiceItem) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
} | null>(null);

const initialState: CartState = { items: [] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (e) => e.service.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          qty: items[existingIndex].qty + 1,
        };
        return { items };
      }
      return { items: [...state.items, { service: action.payload, qty: 1 }] };
    }
    case "REMOVE_ITEM": {
      return { items: state.items.filter((i) => i.service.id !== action.payload) };
    }
    case "INCREASE_QTY": {
      return {
        items: state.items.map((i) =>
          i.service.id === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    }
    case "DECREASE_QTY": {
      return {
        items: state.items
          .map((i) => (i.service.id === action.payload ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
          .filter(Boolean),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = (s: ServiceItem) => dispatch({ type: "ADD_ITEM", payload: s });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const increaseQty = (id: string) => dispatch({ type: "INCREASE_QTY", payload: id });
  const decreaseQty = (id: string) => dispatch({ type: "DECREASE_QTY", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const total = state.items.reduce((acc, cur) => acc + cur.qty * Number(cur.service.price || 0), 0);
  const count = state.items.reduce((acc, cur) => acc + cur.qty, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, increaseQty, decreaseQty, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
