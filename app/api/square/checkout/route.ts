import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import { randomUUID } from 'crypto';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
}

export async function POST(request: Request) {
  try {
    const { items }: CheckoutRequest = await request.json();

    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: items.map((item) => ({
          quantity: item.quantity.toString(),
          catalogObjectId: item.id,
        })),
      },
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart/complete`,
      },
    });

    if (!result.paymentLink) {
      throw new Error('Failed to create payment link');
    }

    return NextResponse.json({
      url: result.paymentLink.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'チェックアウトに失敗しました' },
      { status: 500 }
    );
  }
}
