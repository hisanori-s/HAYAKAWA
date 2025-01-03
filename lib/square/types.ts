import { CatalogObject, CatalogItem } from 'square';

// CategoryNode型を追加
export type CategoryNode = {
  id: string;
  name: string;
  items: CatalogObject[];
};

// カスタム型定義（必要な場合のみ）
export type ExtendedCatalogObject = CatalogObject & {
  imageUrl?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number; // 円単位（Square APIの返す銭単位から変換済み）
  quantity: number;
  hasVariations: boolean;     // バリエーション（色・サイズなど）の有無
  requiresInventory: boolean; // 在庫管理が必要な商品かどうか
  maxStock: number;          // 在庫の最大数
};

export type ProductGroup = {
  name: string;
  items: CatalogObject[];
};

// Square APIの拡張型定義
export interface ExtendedCheckoutOptions {
  redirectUrl?: string | null;
  askForShippingAddress?: boolean | null;
  requireBillingAddress?: boolean | null;
  merchantSupportEmail?: string | null;
  enableCoupon?: boolean | null;
  enableLoyalty?: boolean | null;
  locale?: string | null;
  country?: string | null;
  currency?: string | null;
}

// 型定義のマージ
declare module 'square' {
  interface CheckoutOptions {
    redirectUrl?: string | null;
    askForShippingAddress?: boolean | null;
    requireBillingAddress?: boolean | null;
    merchantSupportEmail?: string | null;
    enableCoupon?: boolean | null;
    enableLoyalty?: boolean | null;
    locale?: string | null;
    country?: string | null;
    currency?: string | null;
  }
}

// EC用の基本カテゴリ型
export interface CategoryData {
  id: string;
  name: string;
  parentId?: string | null;
}

// EC専用のカテゴリ型
export interface ECCategory extends CategoryData {
  isECCategory: boolean;
  children?: ECCategory[];
}

// EC専用の商品バリエーション型
export interface ECProductVariation {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  ordinal: number;
  trackInventory?: boolean;
  soldOut?: boolean;
}

// ロケーション固有の在庫設定型
export interface LocationInventoryOverride {
  locationId: string;
  trackInventory?: boolean;
  soldOut?: boolean;
}

// EC専用の商品型を更新
export interface ECProduct extends CatalogObject {
  type: 'ITEM';
  itemData: CatalogItem & {
    trackInventory?: boolean;
    locationOverrides?: LocationInventoryOverride[];
  };
  category: ECCategory;
  imageUrl?: string;
  variations: ECProductVariation[];
}

// カテゴリツリー用の型
export interface CategoryTree {
  root: ECCategory;
  allCategories: { [key: string]: ECCategory };
}
