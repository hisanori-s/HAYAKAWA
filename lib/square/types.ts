import { Money } from 'square';

export interface SquareProductVariation {
  id: string;
  type: string;
  version: number;
  itemVariationData: {
    itemId: string;
    name: string;
    priceMoney: Money;
    pricing_type: string;
    available: boolean;
    ordinal?: number;
  };
}

export interface SquareProduct {
  id: string;
  type: 'ITEM';
  version: number;
  isDeleted: boolean;
  presentAtAllLocations: boolean;
  itemData: {
    name: string;
    description?: string;
    abbreviation?: string;
    labelColor?: string;
    availableOnline?: boolean;
    availableForPickup?: boolean;
    availableElectronically?: boolean;
    categoryId?: string;
    taxIds?: string[];
    variations: SquareProductVariation[];
    imageIds?: string[];
    productType?: 'REGULAR' | 'GIFT_CARD' | 'APPOINTMENTS_SERVICE';
    skipModifierScreen?: boolean;
    ecomEnabled?: boolean;
  };
  // UI表示用の追加フィールド
  imageUrl?: string;
  price?: number; // 最初のバリエーションの価格をキャッシュ
}

export interface CheckoutSession {
  id: string;
  url: string;
  expiresAt: string;
  order: {
    id: string;
    locationId: string;
    customerId?: string;
    lineItems: Array<{
      quantity: string;
      catalogObjectId: string;
      modifiers?: Array<{
        catalogObjectId: string;
      }>;
      appliedTaxes?: Array<{
        taxUid: string;
      }>;
    }>;
    taxes?: Array<{
      uid: string;
      catalogObjectId: string;
    }>;
  };
}
