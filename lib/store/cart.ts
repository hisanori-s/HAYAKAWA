import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

// カートに保存される商品情報の型定義
export type CartItem = {
  id: string;                  // 内部管理用ID
  catalogObjectId: string;     // Square CatalogのバリエーションID
  name: string;               // 商品名
  price: number;              // 価格
  quantity: number;           // 数量
  hasVariations: boolean;     // バリエーション（色・サイズなど）の有無
  requiresInventory: boolean; // 在庫管理が必要な商品かどうか
};

// 在庫情報の型定義
export interface InventoryItem {
  id: string;
  name: string;
  variations: Array<{
    id: string;
    name: string;
    trackInventory: boolean;
    soldOut: boolean;
    inventoryCount: number;
  }>;
}

// カートの永続化対象の状態
interface CartPersistState {
  items: CartItem[];
}

// カートの状態管理インターフェース
interface CartState extends CartPersistState {
  addItem: (item: CartItem) => void;              // 商品をカートに追加
  removeItem: (id: string) => void;               // 商品をカートから削除
  updateQuantity: (id: string, quantity: number) => void;  // 商品の数量を更新
  clearCart: () => void;                          // カートを空にする
  // 在庫確認関連の状態
  isValidatingInventory: boolean;
  needsInventoryCheck: boolean;
  inventoryError: string | null;
  inventoryItems: InventoryItem[];
  // 在庫確認関連の関数
  setInventoryValidating: (isValidating: boolean) => void;
  setInventoryItems: (items: InventoryItem[]) => void;
  setInventoryError: (error: string | null) => void;
  validateInventory: () => Promise<void>;
}

// 古いデータを新しい形式に変換する関数
const migrateCartItem = (item: Partial<CartItem>): CartItem => {
  const hasNameWithVariation = typeof item.name === 'string' && item.name.includes(' - ') && item.name.split(' - ')[1] !== '';
  return {
    id: item.id || '',
    catalogObjectId: item.catalogObjectId || item.id || '', // 後方互換性のため、idをフォールバックとして使用
    name: item.name || '',
    price: item.price || 0,
    quantity: item.quantity || 0,
    hasVariations: item.hasVariations !== undefined ? item.hasVariations : hasNameWithVariation,
    requiresInventory: item.requiresInventory || false,
  };
};

type CartPersist = (
  config: StateCreator<CartState, [], [], CartPersistState>,
  options: PersistOptions<CartState, CartPersistState>
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
    (set, get) => ({
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
        set((state: CartState) => {
          // 商品を削除
          const newItems = state.items.filter((item: CartItem) => item.id !== id);
          // 在庫管理商品が残っているかチェック
          const hasInventoryItems = newItems.some(item => item.requiresInventory);

          if (!hasInventoryItems) {
            // 在庫管理商品がない場合は在庫関連の状態をリセット
            return {
              items: newItems,
              inventoryItems: [],
              inventoryError: null,
              isValidatingInventory: false,
              needsInventoryCheck: false
            };
          }

          return {
            items: newItems,
            // 在庫エラーが削除した商品に関するものだった場合はクリア
            inventoryError: state.inventoryError?.includes(id) ? null : state.inventoryError
          };
        }),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({
        items: [],
        inventoryItems: [],
        inventoryError: null,
        isValidatingInventory: false,
        needsInventoryCheck: false
      }),
      // 在庫確認関連の初期状態
      isValidatingInventory: false,
      needsInventoryCheck: false,
      inventoryError: null,
      inventoryItems: [],
      // 在庫確認関連の関数
      setInventoryValidating: (isValidating: boolean) =>
        set({ isValidatingInventory: isValidating }),
      setInventoryItems: (items: InventoryItem[]) =>
        set({ inventoryItems: items }),
      setInventoryError: (error: string | null) =>
        set({ inventoryError: error }),
      validateInventory: async () => {
        const state = get();
        const itemsRequiringInventory = state.items.filter(item => item.requiresInventory);

        if (itemsRequiringInventory.length === 0) {
          set({
            inventoryItems: [],
            inventoryError: null,
            isValidatingInventory: false,
            needsInventoryCheck: false
          });
          return;
        }

        // 既に在庫確認中の場合は処理をスキップ
        if (state.isValidatingInventory) {
          return;
        }

        set({
          isValidatingInventory: true,
          inventoryError: null // 在庫確認開始時にエラーをクリア
        });

        try {
          const response = await fetch('/api/square/inventory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              catalogItemVariationIds: itemsRequiringInventory.map(item => item.id)
            })
          });

          if (!response.ok) {
            throw new Error('在庫情報の取得に失敗しました');
          }

          const { counts } = await response.json();

          // 在庫情報をマップに変換
          const inventoryMap = counts.reduce((acc: { [key: string]: number }, count: { catalogObjectId: string; quantity: number }) => {
            acc[count.catalogObjectId] = count.quantity;
            return acc;
          }, {});

          // 現在のカート内容を再取得（非同期処理中に変更されている可能性があるため）
          const currentState = get();
          const currentItems = currentState.items.filter(item => item.requiresInventory);

          // 現在のカートに存在する商品の在庫情報のみを保持
          const inventoryItemsData = currentItems.map(item => ({
            id: item.id,
            name: item.name,
            variations: [{
              id: item.id,
              name: item.name,
              trackInventory: item.requiresInventory,
              soldOut: (inventoryMap[item.id] ?? 0) === 0,
              inventoryCount: inventoryMap[item.id] ?? 0
            }]
          }));

          // 在庫不足のアイテムをチェック（カート内の商品数と在庫数を比較）
          const invalidItems = currentItems
            .filter(item => {
              const stock = inventoryMap[item.id] ?? 0;
              // カート内の数量が在庫数を超えている場合のみエラーとする
              return item.quantity > stock;
            })
            .map(item => ({
              item,
              availableQuantity: inventoryMap[item.id] ?? 0
            }));

          // 状態を一括で更新
          set({
            inventoryItems: inventoryItemsData,
            inventoryError: invalidItems.length > 0
              ? `以下の商品は在庫が不足しているため、数量を調整してください：\n${
                  invalidItems
                    .map(({ item, availableQuantity }) =>
                      `${item.name}: 在庫数 ${availableQuantity}個（注文数 ${item.quantity}個）`
                    )
                    .join('\n')
                }`
              : null,
            isValidatingInventory: false,
            needsInventoryCheck: false
          });

        } catch (error) {
          console.error('Inventory fetch error:', error);
          set({
            inventoryError: '在庫情報の取得に失敗しました。ページを更新してもう一度お試しください。',
            isValidatingInventory: false,
            needsInventoryCheck: false
          });
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      storage,
      // LocalStorageから読み込んだデータを変換
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = state.items.map(migrateCartItem);
          // 在庫関連の状態を初期化
          state.isValidatingInventory = false;
          state.needsInventoryCheck = false;
          state.inventoryError = null;
          state.inventoryItems = [];
        }
      },
      // 永続化する状態を制限
      partialize: (state) => ({
        items: state.items
      }),
    }
  )
);
