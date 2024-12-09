import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';
import { CatalogObject } from 'square';

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
      console.log('Attempting to call Square API...');
      const response = await squareClient.catalogApi.listCatalog();
      console.log('Square API call successful');

      // レスポンスの構造を確認
      console.log('Response structure:', {
        hasResult: !!response.result,
        hasObjects: !!(response.result?.objects),
        objectCount: response.result?.objects?.length || 0
      });

      if (!response.result || !response.result.objects) {
        console.log('No items found in Square catalog');
        return NextResponse.json({
          items: [],
          message: 'No items found in catalog'
        });
      }

      // カタログアイテムのみをフィルタリング
      const catalogItems = response.result.objects.filter(
        (item: CatalogObject) => item.type === 'ITEM' && item.itemData
      );

      console.log(`Found ${catalogItems.length} catalog items`);

      // BigInt値を含むデータを変換してからJSONレスポンスを返す
      const serializedItems = convertBigIntToString(catalogItems);
      const serializedCursor = response.result.cursor;

      return NextResponse.json({
        items: serializedItems,
        cursor: serializedCursor
      });

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
