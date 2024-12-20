import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import { randomUUID } from 'crypto';
import { CreatePaymentLinkRequest } from 'square';

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
    console.log('Environment config:', {
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      redirectUrl: process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URL,
      environment: process.env.SQUARE_ENVIRONMENT,
    });

    const requestBody: CreatePaymentLinkRequest = {
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
        locale: "ja-JP"
      }
    };

    console.log('Square API request:', JSON.stringify(requestBody, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));

    const response = await squareClient.checkoutApi.createPaymentLink(requestBody);

    if (!response.result?.paymentLink?.url) {
      console.error('Invalid Square API response:', response);
      throw new Error('決済リンクの生成に失敗しました');
    }

    console.log('Square API response:', {
      paymentLink: response.result.paymentLink,
      url: response.result.paymentLink.url
    });

    return NextResponse.json({ url: response.result.paymentLink.url });

  } catch (error) {
    console.error('Checkout error details:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
      timestamp: new Date().toISOString(),
      environment: process.env.SQUARE_ENVIRONMENT,
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'チェックアウトに失敗しました',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
