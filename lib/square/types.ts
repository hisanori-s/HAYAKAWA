import { CatalogObject } from 'square';

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
