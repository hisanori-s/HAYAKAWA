import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';

export async function POST(request: Request) {
  try {
    const { catalogItemVariationIds } = await request.json();

    if (!Array.isArray(catalogItemVariationIds)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 在庫数を取得（複数の商品の場合は順次取得）
    const inventoryCounts = [];
    for (const id of catalogItemVariationIds) {
      try {
        const response = await squareClient.inventoryApi.retrieveInventoryCount(id);
        if (response.result.counts && response.result.counts.length > 0) {
          const count = response.result.counts[0];
          inventoryCounts.push({
            catalogObjectId: count.catalogObjectId || id,
            quantity: parseInt(count.quantity || '0', 10),
          });
        } else {
          inventoryCounts.push({
            catalogObjectId: id,
            quantity: 0,
          });
        }
      } catch (countError) {
        console.error(`Error fetching inventory for ${id}:`, countError);
        inventoryCounts.push({
          catalogObjectId: id,
          quantity: 0,
        });
      }
    }

    return NextResponse.json({ counts: inventoryCounts });
  } catch (error) {
    console.error('Inventory API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

