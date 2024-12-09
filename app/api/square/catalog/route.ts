import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';
import { CatalogObject } from 'square';

// Square APIのレスポンスオブジェクトの型定義
type SquareObject = {
  [key: string]: string | number | boolean | bigint | null | undefined | SquareObject | SquareObject[];
};

// BigInt値を含むオブジェクトを通常のJSONシリアライズ可能な形式に変換する関数
function convertBigIntToString(obj: SquareObject): SquareObject {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item as SquareObject));
  }

  if (typeof obj === 'object') {
    const converted: SquareObject = {};
    for (const key in obj) {
      converted[key] = convertBigIntToString(obj[key] as SquareObject);
    }
    return converted;
  }

  return obj;
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
      const serializedItems = convertBigIntToString(catalogItems as unknown as SquareObject) as unknown as CatalogObject[];
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
