import { Client, Environment } from 'square';

// 環境変数の存在チェック
if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not defined');
}

if (!process.env.SQUARE_ENVIRONMENT) {
  throw new Error('SQUARE_ENVIRONMENT is not defined');
}

// クライアントの設定をログ出力
console.log('Initializing Square client with:', {
  environment: process.env.SQUARE_ENVIRONMENT,
  hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
});

export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox,
  userAgentDetail: 'hayakawa-ec' // アプリケーション識別用
});
