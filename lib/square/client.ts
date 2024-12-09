import { Client, Environment } from 'square';

// 環境変数の存在チェック
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
  throw new Error('NEXT_PUBLIC_SQUARE_LOCATION_ID is not defined');
}

// クライアントの設定をログ出力
console.log('Initializing Square client with:', {
  environment: process.env.NODE_ENV,
  hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
});

// Square クライアントのインスタンスを作成
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  userAgentDetail: 'hayakawa-ec'
});

// 環境変数の値をエクスポート（必要な場合に使用）
export const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

// 支払い作成用の関数
export async function createPayment(paymentData: {
  sourceId: string;
  amount: number;
  currency: string;
}) {
  try {
    const { result } = await squareClient.paymentsApi.createPayment({
      sourceId: paymentData.sourceId,
      amountMoney: {
        amount: BigInt(paymentData.amount * 100),
        currency: paymentData.currency
      },
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()
    });

    return result.payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}
