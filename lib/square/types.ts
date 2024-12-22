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
};

export type ProductGroup = {
  name: string;
  items: CatalogObject[];
};

// Square APIの拡張型定義
export interface ExtendedCheckoutOptions {
  redirectUrl?: string;
  askForShippingAddress?: boolean;
  requireBillingAddress?: boolean;
  merchantSupportEmail?: string;
  enableCoupon?: boolean;
  enableLoyalty?: boolean;
  locale?: string;
  country?: string;
  currency?: string;
}

// 型定義のマージ
declare module 'square' {
  interface CheckoutOptions extends ExtendedCheckoutOptions {}
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
}

// EC専用の商品型を更新
export interface ECProduct extends CatalogObject {
  type: 'ITEM';
  itemData: CatalogItem;
  category: ECCategory;
  imageUrl?: string;
  variations: ECProductVariation[];  // バリエーション情報を追加
}

// カテゴリツリー用の型
export interface CategoryTree {
  root: ECCategory;
  allCategories: { [key: string]: ECCategory };
}
