import { Client, Environment } from 'square';

// 環境変数の存在チェック
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
  throw new Error('NEXT_PUBLIC_SQUARE_LOCATION_ID is not defined');
}

// クライアントの設定をログ出力
console.log('Initializing Square client with:', {
  environment: process.env.NODE_ENV,
  hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
});

// Square クライアントのインスタンスを作成
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  userAgentDetail: 'hayakawa-ec'
});

// 環境変数の値をエクスポート（必要な場合に使用）
export const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

// 支払い作成用の関数
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
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()
    });

    return result.payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

// カテゴリ情報のみを取得する関数
export async function fetchCategories() {
  try {
    const { result } = await squareClient.catalogApi.listCatalog(
      undefined,
      'CATEGORY'
    );

    console.log('Categories response:', JSON.stringify(result, null, 2));
    return result.objects || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// カタログ情報取得用の関数を修正
export async function fetchCatalogWithCategories() {
  try {
    // まずカテゴリを取得
    const categories = await fetchCategories();
    console.log('Fetched categories:', categories.map(cat => ({
      id: cat.id,
      name: cat.categoryData?.name
    })));

    // 次に商品を取得
    const { result: itemsResult } = await squareClient.catalogApi.searchCatalogItems({
      limit: 100
    });

    // デバッグ用にログ出力
    console.log('Items result:', JSON.stringify(itemsResult, null, 2));

    return {
      items: itemsResult.items || [],
      categories: categories
    };
  } catch (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }
}
