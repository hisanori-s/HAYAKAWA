import { CatalogObject } from 'square';

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
