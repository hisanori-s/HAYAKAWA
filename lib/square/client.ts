import { Client, Environment, CatalogObject } from 'square';

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

// カタログデータの型定義
interface CategoryData {
  id: string;
  name: string;
  parentId?: string | null;
}

interface ProductData {
  id: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  variations: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  imageIds?: string[];
}

// カタログデータの処理関数
function processCatalogData(catalogData: { objects?: CatalogObject[] }) {
  const categories: { [key: string]: CategoryData } = {};
  const products: ProductData[] = [];

  // カテゴリー情報の抽出
  catalogData.objects
    ?.filter((obj: CatalogObject) => obj.type === 'CATEGORY')
    .forEach((category: CatalogObject) => {
      if (category.categoryData) {
        categories[category.id] = {
          id: category.id,
          name: category.categoryData.name || 'Unknown Category',
          parentId: category.categoryData.parentCategory?.id || null
        };
      }
    });

  // 商品情報の抽出（カテゴリー情報を含む）
  catalogData.objects
    ?.filter((obj: CatalogObject) => obj.type === 'ITEM')
    .forEach((item: CatalogObject) => {
      if (item.itemData) {
        // カテゴリIDの取得（categories配列の最初の要素のIDを使用）
        const categoryId = item.itemData.categories?.[0]?.id || item.itemData.categoryId || null;

        // デバッグ情報の出力
        console.log('Processing item:', {
          id: item.id,
          name: item.itemData.name,
          categoryId,
          imageIds: item.itemData.imageIds,
          rawCategories: item.itemData.categories,
          rawCategoryId: item.itemData.categoryId
        });

        products.push({
          id: item.id,
          name: item.itemData.name || 'Unnamed Product',
          description: item.itemData.description || null,
          categoryId: categoryId,
          variations: (item.itemData.variations || []).map((v) => ({
            id: v.id,
            name: v.itemVariationData?.name || 'Default Variation',
            price: Number(v.itemVariationData?.priceMoney?.amount || 0)
          })),
          imageIds: item.itemData.imageIds || []
        });
      }
    });

  return { categories, products };
}

// カタログ情報取得用の関数を修正
export async function fetchCatalogWithCategories() {
  try {
    console.log('Fetching complete catalog data...');

    // 全てのカタログオブジェクトを取得
    const { result } = await squareClient.catalogApi.listCatalog();

    if (!result || !result.objects) {
      console.log('No catalog data found');
      return { categories: {}, products: [] };
    }

    // 画像データの確認用デバッグログ
    const imageObjects = result.objects.filter(obj => obj.type === 'IMAGE');
    console.log('Found image objects:', imageObjects.map(img => ({
      id: img.id,
      type: img.type,
      hasImageData: !!img.imageData,
      url: img.imageData?.url
    })));

    // カタログデータを処理
    const processedData = processCatalogData(result);

    console.log('Processed catalog data:', {
      categoriesCount: Object.keys(processedData.categories).length,
      productsCount: processedData.products.length,
      productsWithImages: processedData.products.filter(p => p.imageIds && p.imageIds.length > 0).length
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }
}
