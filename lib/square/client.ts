import { Client, Environment, CatalogObject } from 'square';

// 環境変数の存在チェック
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error('SQUARE_LOCATION_ID is not defined');
}

if (!process.env.SQUARE_ENVIRONMENT) {
  throw new Error('SQUARE_ENVIRONMENT is not defined');
}

// クライアントの設定をログ出力
console.log('Initializing Square client with:', {
  environment: process.env.SQUARE_ENVIRONMENT,
  hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
});

// Square クライアントのインスタンスを作成
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? Environment.Sandbox
    : Environment.Production,
  userAgentDetail: 'hayakawa-ec'
});

// 環境変数の値をエクスポート（必要な場合に使用）
export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

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

        products.push({
          id: item.id,
          name: item.itemData.name || 'Unnamed Product',
          description: item.itemData.description || null,
          categoryId: categoryId,
          variations: (item.itemData.variations || []).map((v) => ({
            id: v.id,
            name: v.itemVariationData?.name || 'Default Variation',
            price: v.itemVariationData?.priceMoney?.amount ? Number(v.itemVariationData.priceMoney.amount) : 0
          })),
          imageIds: item.itemData.imageIds || []
        });
      }
    });

  return { categories, products };
}

// カタログ情報取得用の関数
export async function fetchCatalogWithCategories() {
  try {
    console.log('Fetching complete catalog data...');

    // 全てのカタログオブジェクトを取得
    const { result } = await squareClient.catalogApi.listCatalog();

    if (!result || !result.objects) {
      console.log('No catalog data found');
      return { categories: {}, products: [] };
    }

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

// 画像情報取得用の関数
export async function fetchImageUrl(imageId: string) {
  console.log('fetchImageUrl called with imageId:', imageId);

  try {
    console.log('Calling Square API to retrieve catalog object...');
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(
      imageId,
      true // includeRelatedObjects
    );

    console.log('Square API Response:', {
      hasResult: !!result,
      objectType: result.object?.type,
      hasImageData: !!result.object?.imageData,
      imageUrl: result.object?.imageData?.url,
      relatedObjectsCount: result.relatedObjects?.length
    });

    if (!result.object) {
      throw new Error('No catalog object found');
    }

    if (result.object.type !== 'IMAGE') {
      throw new Error(`Invalid object type: ${result.object.type}`);
    }

    if (!result.object.imageData?.url) {
      throw new Error('Image URL not found in response');
    }

    console.log('Successfully retrieved image URL');
    return result.object.imageData.url;
  } catch (error) {
    console.error('Error in fetchImageUrl:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      imageId,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

// 複数画像の一括取得用の関数
export async function fetchMultipleImageUrls(imageIds: string[]) {
  try {
    const { result } = await squareClient.catalogApi.batchRetrieveCatalogObjects({
      objectIds: imageIds,
      includeRelatedObjects: true,
    });

    if (!result.objects) {
      return [];
    }

    return result.objects
      .filter(obj => obj.type === 'IMAGE' && obj.imageData?.url)
      .map(obj => obj.imageData!.url!);
  } catch (error) {
    console.error('Error fetching multiple images:', error);
    return [];
  }
}
