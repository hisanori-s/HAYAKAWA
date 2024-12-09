import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';

// BigInt型のシリアライズエラーを回避するための変換関数
const safeStringify = (obj: unknown): string => {
  return JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

// オブジェクトをシリアライズ可能な形式に変換
const convertToSerializable = (obj: unknown) => {
  return JSON.parse(safeStringify(obj));
};

export async function POST(request: Request) {
  try {
    console.log('=== Starting Square API request ===');
    console.log('Environment variables:', {
      SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT,
      hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    });

    // リクエストボディを取得
    const body = await request.json().catch(() => ({}));
    console.log('Incoming request body:', body);

    try {
      console.log('Attempting to call Square API...');
      const requestParams = {
        productTypes: ['REGULAR'],
        limit: 100,
        ...body
      };
      console.log('Square API request parameters:', requestParams);

      const response = await squareClient.catalogApi.searchCatalogItems(requestParams);
      console.log('Square API call successful');

      // レスポンスの構造を確認
      console.log('Response structure:', {
        hasResult: !!response.result,
        hasItems: !!(response.result?.items),
        itemCount: response.result?.items?.length || 0
      });

      // 生のレスポンスをログ出力（エラー回避のため文字列化）
      console.log('Raw Square API Response:', safeStringify(response));

      if (!response.result || !response.result.items) {
        console.log('No items found in Square catalog');
        const safeResponse = convertToSerializable(response);
        console.log('Serializable response:', safeResponse);

        return NextResponse.json({
          items: [],
          debug: {
            message: 'No items found',
            response: safeResponse
          }
        });
      }

      console.log('Processing items...');
      const items = response.result.items.map(item => {
        console.log('Processing item:', item.id);
        return {
          type: item.type,
          id: item.id,
          version: typeof item.version === 'bigint' ? item.version.toString() : item.version || '1',
          updated_at: item.updatedAt || new Date().toISOString(),
          created_at: item.updatedAt || new Date().toISOString(),
          is_deleted: Boolean(item.isDeleted),
          present_at_all_locations: Boolean(item.presentAtAllLocations),
          item_data: {
            name: item.itemData?.name || '',
            description: item.itemData?.description,
            is_taxable: true,
            variations: item.itemData?.variations?.map(v => ({
              type: v.type,
              id: v.id,
              version: typeof v.version === 'bigint' ? v.version.toString() : v.version || '1',
              updated_at: v.updatedAt || new Date().toISOString(),
              created_at: v.updatedAt || new Date().toISOString(),
              is_deleted: Boolean(v.isDeleted),
              present_at_all_locations: Boolean(v.presentAtAllLocations),
              item_variation_data: {
                item_id: v.itemVariationData?.itemId,
                name: v.itemVariationData?.name || '',
                pricing_type: "FIXED_PRICING",
                price_money: {
                  amount: v.itemVariationData?.priceMoney?.amount || 0,
                  currency: v.itemVariationData?.priceMoney?.currency || 'JPY'
                }
              }
            })),
            product_type: "REGULAR"
          }
        };
      });

      console.log('Items processed successfully');
      console.log('Preparing response...');

      const serializableResponse = {
        items,
        cursor: response.result.cursor,
        debug: {
          rawResponse: convertToSerializable(response),
          convertedItems: items
        }
      };

      console.log('Sending response...');
      return NextResponse.json(serializableResponse);

    } catch (apiError) {
      console.error('Square API call failed:', apiError);
      if (apiError instanceof Error) {
        console.error('API Error details:', {
          name: apiError.name,
          message: apiError.message,
          stack: apiError.stack
        });
      }
      throw apiError; // 外側のcatchブロックで処理
    }

  } catch (error) {
    console.error('Square API Error:', error);
    const errorResponse = {
      error: 'Failed to fetch catalog items',
      debug: {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : convertToSerializable(error)
      }
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
