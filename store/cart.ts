"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartLine {
  productId: string;
  title: string;
  price: number; // Integer PKR
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  stockCount: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

function sameLine(
  a: { productId: string; color?: string; size?: string },
  b: { productId: string; color?: string; size?: string }
): boolean {
  return (
    a.productId === b.productId &&
    (a.color || "").trim().toLowerCase() === (b.color || "").trim().toLowerCase() &&
    (a.size || "").trim().toLowerCase() === (b.size || "").trim().toLowerCase()
  );
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (hydrated: boolean) => set({ _hasHydrated: hydrated }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (line, quantity = 1) =>
        set((state) => {
          const validQty = Math.max(1, Math.floor(quantity));
          const maxStock = typeof line.stockCount === "number" ? line.stockCount : 99;
          const existingIndex = state.lines.findIndex((l) => sameLine(l, line));

          if (existingIndex > -1) {
            const updatedLines = [...state.lines];
            const currentItem = updatedLines[existingIndex];
            const newQty = Math.min(currentItem.quantity + validQty, maxStock);

            updatedLines[existingIndex] = {
              ...currentItem,
              price: Math.round(line.price),
              stockCount: maxStock,
              quantity: newQty,
            };

            return { lines: updatedLines, isOpen: true };
          }

          return {
            lines: [
              ...state.lines,
              {
                ...line,
                price: Math.round(line.price),
                stockCount: maxStock,
                quantity: Math.min(validQty, maxStock),
              },
            ],
            isOpen: true,
          };
        }),

      removeItem: (productId, color, size) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !sameLine(l, { productId, color, size })
          ),
        })),

      updateQuantity: (productId, quantity, color, size) =>
        set((state) => {
          const sanitizedQty = Math.floor(quantity);

          if (sanitizedQty <= 0) {
            return {
              lines: state.lines.filter(
                (l) => !sameLine(l, { productId, color, size })
              ),
            };
          }

          return {
            lines: state.lines.map((l) => {
              if (sameLine(l, { productId, color, size })) {
                const maxStock = typeof l.stockCount === "number" ? l.stockCount : 99;
                return {
                  ...l,
                  quantity: Math.min(sanitizedQty, maxStock),
                };
              }
              return l;
            }),
          };
        }),

      clear: () => set({ lines: [] }),

      subtotal: () =>
        get().lines.reduce((sum, l) => sum + (Number(l.price) || 0) * l.quantity, 0),

      count: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    {
      name: "nocturne-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Custom hook to safely consume cart state without triggering Next.js SSR hydration mismatches.
 */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  const storeHydrated = useCart((state) => state._hasHydrated);

  useEffect(() => {
    setHydrated(storeHydrated);
  }, [storeHydrated]);

  return hydrated;
}