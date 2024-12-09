import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';

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
        item => item.type === 'ITEM' && item.itemData
      );

      console.log(`Found ${catalogItems.length} catalog items`);

      return NextResponse.json({
        items: catalogItems,
        cursor: response.result.cursor
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
