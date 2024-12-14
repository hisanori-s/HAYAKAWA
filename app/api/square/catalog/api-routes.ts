// Square Catalog API routes
import { NextResponse } from 'next/server';
import { fetchCatalogWithCategories } from '@/lib/square/client';

export async function GET() {
  try {
    const items = await fetchCatalogWithCategories();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in catalog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog items' },
      { status: 500 }
    );
  }
}
