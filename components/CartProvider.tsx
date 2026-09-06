"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ICartItem, IProduct } from "@/types";

interface CartContextType {
  items: ICartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: IProduct) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isOpen: false,
  setIsOpen: () => {},
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

const CART_STORAGE_KEY = "ybt_digital_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load local cart on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    setIsHydrated(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, isHydrated]);

  const addItem = (product: IProduct) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product._id === product._id);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          price: product.salePrice ?? product.price,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
