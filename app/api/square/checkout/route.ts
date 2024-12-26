import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import { randomUUID } from 'crypto';
import { ApiError, CreatePaymentLinkRequest } from 'square';

interface CartItem {
  id: string;
  catalogObjectId: string;
  name: string;
  price: number;
  quantity: number;
  requiresInventory: boolean;
}

interface CheckoutRequest {
  items: CartItem[];
}

export async function POST(request: Request) {
  try {
    const { items }: CheckoutRequest = await request.json();

    console.log('Creating payment link with items:', items);

    // 環境変数の検証
    if (!process.env.SQUARE_LOCATION_ID) {
      throw new Error('Location ID is not configured');
    }

    // サンドボックス環境かどうかを確認
    const isSandbox = process.env.SQUARE_ENVIRONMENT === 'sandbox';
    console.log('Environment:', {
      isSandbox,
      environment: process.env.SQUARE_ENVIRONMENT,
      applicationId: process.env.SQUARE_APPLICATION_ID,
      locationId: process.env.SQUARE_LOCATION_ID
    });

    const requestBody: CreatePaymentLinkRequest = {
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: items.map((item) => ({
          catalogObjectId: item.catalogObjectId || item.id,
          quantity: item.quantity.toString()
        })),
        taxes: [{
          name: "消費税",
          percentage: "10",
          scope: "ORDER"
        }]
      },
      checkoutOptions: {
        redirectUrl: process.env.SQUARE_REDIRECT_URL,
        askForShippingAddress: true,
        requireBillingAddress: true,
        enableLoyalty: false,
        enableCoupon: false,
        locale: "ja-JP",
        country: "JP",
        currency: "JPY",
        ...(isSandbox && {
          acceptedPaymentMethods: {
            applePay: false,
            googlePay: false,
            cashAppPay: false,
            afterpayClearpay: false
          }
        })
      },
      prePopulatedData: {
        buyerAddress: {
          country: "JP"
        }
      }
    };

    // リクエストの詳細なデバッグ情報
    console.log('Square API request details:', {
      locationId: process.env.SQUARE_LOCATION_ID,
      redirectUrl: process.env.SQUARE_REDIRECT_URL,
      itemsCount: items.length,
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });

    console.log('Full request body:', JSON.stringify(requestBody, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v
    ));

    try {
      const response = await squareClient.checkoutApi.createPaymentLink(requestBody);

      if (!response.result?.paymentLink?.url) {
        console.error('Invalid Square API response:', response);
        throw new Error('決済リンクの生成に失敗しました');
      }

      console.log('Payment link created successfully:', {
        id: response.result.paymentLink.id,
        url: response.result.paymentLink.url,
        orderId: response.result.paymentLink.orderId,
        longUrl: response.result.paymentLink.longUrl
      });

      // サンドボックス環境では長いURLを使用
      const checkoutUrl = isSandbox ?
        response.result.paymentLink.longUrl :
        response.result.paymentLink.url;

      return NextResponse.json({
        url: checkoutUrl,
        id: response.result.paymentLink.id,
        orderId: response.result.paymentLink.orderId
      });

    } catch (apiError) {
      if (apiError instanceof ApiError) {
        // APIエラーの詳細なログ
        console.error('Square API Error Details:', {
          statusCode: apiError.statusCode,
          errors: apiError.errors,
          message: apiError.message,
          request: {
            locationId: process.env.SQUARE_LOCATION_ID,
            itemsCount: items.length,
            firstItemPrice: items[0]?.price
          }
        });

        // APIエラーの種類に応じたメッセージを返す
        let errorMessage = 'チェックアウトに失敗しました';
        if (apiError.statusCode === 400) {
          errorMessage = 'リクエストの内容が不正です';
          // 400エラーの詳細を追加
          console.error('Bad Request Details:', {
            validationErrors: apiError.errors,
            requestBody: JSON.stringify(requestBody, (_, v) =>
              typeof v === 'bigint' ? v.toString() : v
            )
          });
        } else if (apiError.statusCode === 401) {
          errorMessage = '認証に失敗しました';
        } else if (apiError.statusCode === 403) {
          errorMessage = 'アクセスが拒否されました';
        }

        return NextResponse.json(
          {
            error: errorMessage,
            details: apiError.errors,
            timestamp: new Date().toISOString()
          },
          { status: apiError.statusCode }
        );
      }
      throw apiError;
    }

  } catch (error) {
    console.error('Checkout error details:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack,
      } : error,
      timestamp: new Date().toISOString(),
      environment: process.env.SQUARE_ENVIRONMENT,
      locationId: process.env.SQUARE_LOCATION_ID
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
