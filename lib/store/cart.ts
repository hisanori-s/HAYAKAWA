import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

type CartPersist = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>;

const storage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str);
  },
  setItem: (name: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useCartStore = create<CartState>()(
  (persist as CartPersist)(
    (set) => ({
      items: [],
      addItem: (item: CartItem) =>
        set((state: CartState) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, item],
          };
        }),
      removeItem: (id: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.id !== id),
        })),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage,
    }
  )
);
