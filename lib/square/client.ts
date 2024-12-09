import { Client, Environment } from 'square';

// 環境変数の存在チェック
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.SQUARE_ENVIRONMENT) {
  throw new Error('SQUARE_ENVIRONMENT is not defined');
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error('SQUARE_LOCATION_ID is not defined');
}

// クライアントの設定をログ出力
console.log('Initializing Square client with:', {
  environment: process.env.SQUARE_ENVIRONMENT,
  hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
});

// Square クライアントのインスタンスを作成
export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  userAgentDetail: 'hayakawa-ec'
});

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
      locationId: process.env.SQUARE_LOCATION_ID,
      idempotencyKey: crypto.randomUUID()
    });

    return result.payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}
