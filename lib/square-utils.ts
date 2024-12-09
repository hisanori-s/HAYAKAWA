// lib/square.ts
import { Client, Environment, CatalogObject } from 'square';

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error('SQUARE_LOCATION_ID is not defined');
}

export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox
});

export type CatalogItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  variations?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
};

// Square APIのレスポンスを型安全に変換する
export const convertSquareResponse = (item: CatalogObject) => {
  if (!item.itemData) {
    throw new Error('Invalid catalog item: missing itemData');
  }

  return {
    id: item.id,
    type: item.type,
    version: Number(item.version || 0),
    updatedAt: item.updatedAt || new Date().toISOString(),
    isDeleted: item.isDeleted || false,
    presentAtAllLocations: item.presentAtAllLocations || true,
    itemData: {
      name: item.itemData.name || '',
      description: item.itemData.description,
      isTaxable: item.itemData.isTaxable || false,
      variations: item.itemData.variations?.map(v => ({
        type: v.type,
        id: v.id,
        version: Number(v.version || 0),
        updatedAt: v.updatedAt || new Date().toISOString(),
        isDeleted: v.isDeleted || false,
        presentAtAllLocations: v.presentAtAllLocations || true,
        itemVariationData: {
          itemId: v.itemVariationData?.itemId || '',
          name: v.itemVariationData?.name || '',
          ordinal: v.itemVariationData?.ordinal,
          pricingType: v.itemVariationData?.pricingType || 'FIXED_PRICING',
          priceMoney: {
            amount: Number(v.itemVariationData?.priceMoney?.amount || 0),
            currency: v.itemVariationData?.priceMoney?.currency || 'JPY'
          },
          trackInventory: v.itemVariationData?.trackInventory,
          sellable: v.itemVariationData?.sellable,
          stockable: v.itemVariationData?.stockable
        }
      })) || [],
      productType: item.itemData.productType || 'REGULAR',
      categories: item.itemData.categories?.map(c => ({
        id: c.id || '',
        ordinal: c.ordinal
      })) || [],
      descriptionHtml: item.itemData.descriptionHtml || undefined,
      descriptionPlaintext: item.itemData.descriptionPlaintext || undefined,
      isArchived: item.itemData.isArchived || false
    }
  };
};

export async function fetchCatalogItems(): Promise<CatalogObject[]> {
  try {
    const { result } = await squareClient.catalogApi.listCatalog(undefined, 'ITEM');

    if (!result.objects) return [];

    return result.objects;
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    throw error;
  }
}

export async function createPayment(paymentData: {
  sourceId: string;
  amount: number;
  currency: string;
}) {
  try {
    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId: paymentData.sourceId,
      amountMoney: {
        amount: BigInt(paymentData.amount * 100),
        currency: paymentData.currency
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()
    });

    return result.payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}
