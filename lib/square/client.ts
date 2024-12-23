import { Client, Environment, CatalogObject } from 'square';
import { ECCategory, ECProduct, CategoryTree, ECProductVariation } from './types';

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

// Square クライアントのインスタンスを作成
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? Environment.Sandbox
    : Environment.Production,
  userAgentDetail: 'hayakawa-ec'
});

// 環境変数の値をエクスポート
export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// EC関連のカテゴリ名
const EC_CATEGORY_NAME = "EC";

function isECCategory(categories: { [key: string]: { id: string; name: string; parentId?: string | null } },
                     category: { id: string; name: string; parentId?: string | null }): boolean {
  if (category.name === EC_CATEGORY_NAME) return true;
  if (!category.parentId) return false;
  const parentCategory = categories[category.parentId];
  return parentCategory ? parentCategory.name === EC_CATEGORY_NAME : false;
}

// カテゴリツリーを構築る関数
function buildCategoryTree(categories: { [key: string]: { id: string; name: string; parentId?: string | null } }): CategoryTree {
  // ECルートカテゴリを探す
  const rootCategory = Object.values(categories).find(cat => cat.name === EC_CATEGORY_NAME);
  if (!rootCategory) {
    throw new Error('EC root category not found');
  }

  const ecCategories: { [key: string]: ECCategory } = {};

  // まずすべてのカテゴリをECCategory形式に変換
  Object.values(categories).forEach(category => {
    if (isECCategory(categories, category)) {
      ecCategories[category.id] = {
        ...category,
        isECCategory: true,
        children: []
      };
    }
  });

  // 親子関係を構築
  Object.values(ecCategories).forEach(category => {
    if (category.parentId && ecCategories[category.parentId]) {
      ecCategories[category.parentId].children = ecCategories[category.parentId].children || [];
      ecCategories[category.parentId].children!.push(category);
    }
  });

  return {
    root: ecCategories[rootCategory.id],
    allCategories: ecCategories
  };
}

// カタログデータの処理関数を更新
function processCatalogData(catalogData: { objects?: CatalogObject[] }) {
  const categories: { [key: string]: { id: string; name: string; parentId?: string | null } } = {};

  // テゴリー情報の抽出
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

  // EC関連のカテゴリツリーを構築
  const categoryTree = buildCategoryTree(categories);

  // 商品情報の抽出（ECカテゴリに属する商品のみ）
  const ecProducts: ECProduct[] = [];

  // 有効な商品のみをフィルタリング
  const validProducts = (catalogData.objects || []).filter((obj): obj is CatalogObject & {
    type: 'ITEM';
    itemData: NonNullable<CatalogObject['itemData']> & {
      categories: Array<{ id: string }>;
    };
  } => {
    if (obj.type !== 'ITEM' || !obj.itemData?.categories) {
      return false;
    }
    // 商品の全てのカテゴリをチェック
    return obj.itemData.categories.some(category =>
      category?.id && category.id in categoryTree.allCategories
    );
  });

  // 有効な商品をECProduct形式に変換
  validProducts.forEach((item) => {
    // ECカテゴリに属する��テゴリを探す
    const ecCategory = item.itemData.categories.find(category =>
      category?.id && category.id in categoryTree.allCategories
    );
    if (!ecCategory?.id) return; // 念のためのチェック

    // バリエーションの処理
    const variations: ECProductVariation[] = [];
    if (item.itemData.variations) {
      item.itemData.variations.forEach(variation => {
        if (variation.itemVariationData) {
          variations.push({
            id: variation.id,
            name: variation.itemVariationData.name || '',
            sku: variation.itemVariationData.sku || null,
            price: Number(variation.itemVariationData.priceMoney?.amount || 0),
            ordinal: variation.itemVariationData.ordinal || 0,
            trackInventory: variation.itemVariationData.trackInventory || false,
            soldOut: variation.itemVariationData.sellable === false
          });
        }
      });
    }

    const product: ECProduct = {
      ...item,
      type: 'ITEM',
      itemData: item.itemData,
      category: categoryTree.allCategories[ecCategory.id],
      imageUrl: undefined,
      variations
    };
    ecProducts.push(product);
  });

  return { categoryTree, ecProducts };
}

// カタログ情報取得用の関数を更新
export async function fetchCatalogWithCategories() {
  try {
    console.log('Fetching EC catalog data...');

    const { result } = await squareClient.catalogApi.listCatalog();

    if (!result || !result.objects) {
      console.log('No catalog data found');
      return { categoryTree: null, ecProducts: [] };
    }

    // カタログデータを処理
    const processedData = processCatalogData(result);

    console.log('Processed EC catalog data:', {
      categoriesCount: Object.keys(processedData.categoryTree.allCategories).length,
      productsCount: processedData.ecProducts.length,
      productsWithImages: processedData.ecProducts.filter(p =>
        p.itemData?.imageIds && p.itemData.imageIds.length > 0
      ).length
    });

    return processedData;
  } catch (error) {
    console.error('Error fetching EC catalog:', error);
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
