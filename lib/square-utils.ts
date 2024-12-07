// lib/square.ts
import { Client, Environment } from 'square';

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

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  try {
    const { result } = await squareClient.catalogApi.listCatalog(undefined, 'ITEM');
    if (!result.objects) return [];

    return result.objects.map(item => {
      const itemData = item.itemData;
      if (!itemData) return null;

      const variation = itemData.variations?.[0]?.itemVariationData;
      const price = variation?.priceMoney?.amount ?? 0;

      return {
        id: item.id,
        name: itemData.name ?? '',
        description: itemData.description ?? '',
        price: price / 100,
        imageUrl: itemData.imageIds?.[0] 
          ? `/api/images/${itemData.imageIds[0]}` 
          : undefined,
        variations: itemData.variations?.map(v => ({
          id: v.id,
          name: v.itemVariationData?.name ?? '',
          price: (v.itemVariationData?.priceMoney?.amount ?? 0) / 100
        }))
      };
    }).filter((item): item is CatalogItem => item !== null);

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
