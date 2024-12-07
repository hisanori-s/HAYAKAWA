// app/api/catalog/route.ts
import { NextResponse } from 'next/server';
import { fetchCatalogItems } from '@/lib/square';

export async function GET() {
  try {
    const items = await fetchCatalogItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in catalog API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog items' },
      { status: 500 }
    );
  }
}

// app/api/payments/route.ts
import { NextResponse } from 'next/server';
import { createPayment } from '@/lib/square';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, amount, currency } = body;

    if (!sourceId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payment = await createPayment({ sourceId, amount, currency });
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
