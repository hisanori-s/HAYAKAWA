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

    console.log('Creating payment link with items:', items);
    console.log('Environment:', process.env.SQUARE_ENVIRONMENT);
    console.log('Location ID:', process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID);
    console.log('Redirect URL:', process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URL);

    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
        lineItems: items.map((item) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: BigInt(item.price),
            currency: "JPY"
          }
        })),
      },
      checkoutOptions: {
        redirectUrl: process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URL,
        askForShippingAddress: true,
      },
    });

    if (!result.paymentLink) {
      console.error('No payment link in response');
      throw new Error('Failed to create payment link');
    }

    console.log('Payment link created:', result.paymentLink.url);
    return NextResponse.json({
      url: result.paymentLink.url,
    });
  } catch (error) {
    console.error('Checkout error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { error: 'チェックアウトに失敗しました' },
      { status: 500 }
    );
  }
}
