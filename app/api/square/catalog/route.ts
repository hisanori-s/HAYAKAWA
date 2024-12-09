import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting Square API request...');
    console.log('Environment:', process.env.SQUARE_ENVIRONMENT);
    console.log('Access Token:', process.env.SQUARE_ACCESS_TOKEN ? 'Present' : 'Missing');

    console.log('Fetching Square catalog items...');
    const response = await squareClient.catalogApi.searchCatalogItems({
      productTypes: ['REGULAR'],
      limit: 100
    });

    // 生のレスポンスをログ出力
    console.log('Raw Square API Response:', JSON.stringify(response, null, 2));

    if (!response.result || !response.result.items) {
      console.log('No items found in Square catalog');
      return NextResponse.json({
        items: [],
        debug: {
          message: 'No items found',
          response: response
        }
      });
    }

    const items = response.result.items.map(item => ({
      type: item.type,
      id: item.id,
      version: item.version || 1,
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
          version: v.version || 1,
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
    }));

    console.log('Converted items:', JSON.stringify(items, null, 2));

    return NextResponse.json({
      items,
      cursor: response.result.cursor,
      debug: {
        rawResponse: response,
        convertedItems: items
      }
    });

  } catch (error) {
    console.error('Square API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch catalog items',
        debug: {
          error: error,
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}
