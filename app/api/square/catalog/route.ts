import { fetchCatalogWithCategories } from '@/lib/square/client';
import { NextResponse } from 'next/server';

// Square APIのレスポンスオブジェクトの型定義
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

// オブジェクトのキー参照用の型
type ObjectWithStringKeys = {
  [key: string]: unknown;
};

// BigInt値を含むオブジェクトを通常のJSONシリアライズ可能な形式に変換する関数
function convertBigIntToString(obj: unknown): JsonValue {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }

  if (typeof obj === 'object') {
    const converted: JsonObject = {};
    const objWithKeys = obj as ObjectWithStringKeys;
    for (const key in objWithKeys) {
      if (Object.prototype.hasOwnProperty.call(objWithKeys, key)) {
        converted[key] = convertBigIntToString(objWithKeys[key]);
      }
    }
    return converted;
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    console.log('=== Starting Square API request ===');

    // リクエストボディを取得
    const body = await request.json().catch(() => ({}));
    console.log('Incoming request body:', body);

    try {
      // カタログデータを取得して処理
      const processedData = await fetchCatalogWithCategories();
      console.log('Processed catalog data:', {
        categoriesCount: Object.keys(processedData.categories || {}).length,
        productsCount: processedData.products?.length || 0
      });

      // BigInt値を含むデータを変換
      const serializedData = convertBigIntToString(processedData);
      return NextResponse.json(serializedData);

    } catch (apiError) {
      console.error('Square API call failed:', apiError);
      throw apiError;
    }

  } catch (error) {
    console.error('Error in catalog endpoint:', error);
    return NextResponse.json({
      error: 'Failed to fetch catalog items',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
