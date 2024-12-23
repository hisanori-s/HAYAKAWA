import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { DEFAULT_MAX_ORDER_QUANTITY } from '@/lib/constants/order';

// カートに保存される商品情報の型定義
export type CartItem = {
  id: string;                  // 商品ID
  name: string;               // 商品名
  price: number;              // 価格
  quantity: number;           // 数量
  hasVariations: boolean;     // バリエーション（色・サイズなど）の有無
  requiresInventory: boolean; // 在庫管理が必要な商品かどうか
  maxStock: number;          // 在庫の最大数
};

// カートの状態管理インターフェース
interface CartState {
  items: CartItem[];                              // カート内の商品リスト
  addItem: (item: CartItem) => void;              // 商品をカートに追加
  removeItem: (id: string) => void;               // 商品をカートから削除
  updateQuantity: (id: string, quantity: number) => void;  // 商品の数量を更新
  clearCart: () => void;                          // カートを空にする
}

// 古いデータを新しい形式に変換する関数
const migrateCartItem = (item: Partial<CartItem>): CartItem => {
  const hasNameWithVariation = typeof item.name === 'string' && item.name.includes(' - ') && item.name.split(' - ')[1] !== '';
  return {
    id: item.id || '',
    name: item.name || '',
    price: item.price || 0,
    quantity: item.quantity || 0,
    hasVariations: item.hasVariations !== undefined ? item.hasVariations : hasNameWithVariation,
    requiresInventory: item.requiresInventory || false,
    maxStock: item.maxStock || DEFAULT_MAX_ORDER_QUANTITY,
  };
};

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
          // 同じ商品がカートに存在するかチェック
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            // 既存の商品の場合、数量を加算
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      // 新しいデータで更新
                      hasVariations: item.hasVariations,
                      requiresInventory: item.requiresInventory,
                      maxStock: item.maxStock,
                    }
                  : i
              ),
            };
          }
          // 新規商品の場合、そのままカートに追加
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
      // LocalStorageから読み込んだデータを変換
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = state.items.map(migrateCartItem);
        }
      },
    }
  )
);
