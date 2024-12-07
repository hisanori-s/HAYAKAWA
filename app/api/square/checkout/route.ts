import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import type { CartItem } from '@/lib/store/cart';

interface CheckoutRequest {
  items: CartItem[];
  redirectUrl?: string;
}

export async function POST(request: Request) {
  try {
    const { items, redirectUrl }: CheckoutRequest = await request.json();

    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
        lineItems: items.map((item) => ({
          quantity: item.quantity.toString(),
          catalogObjectId: item.id,
          // Square APIの要件に合わせて追加のフィールドが必要な場合はここに追加
        })),
      },
      checkoutOptions: {
        redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
        askForShippingAddress: true,
      },
    });

    return NextResponse.json(response.result);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'チェックアウトの作成に失敗しました' },
      { status: 500 }
    );
  }
}
