import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type CartItem = {
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

export const useCartStore = create<CartState>()(
  (persist as CartPersist)(
    (set) => ({
      items: [],
      addItem: (item: CartItem) =>
        set((state: CartState) => ({
          items: [...state.items, item]
        })),
      removeItem: (id: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.id !== id)
        })),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          )
        })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage'
    }
  )
);
