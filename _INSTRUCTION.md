# Square API接続問題の解決

## 現状の問題
1. Square APIへの接続が確立できていない
   - APIリクエストがSquareサーバーに到達していない
   - ローカル環境からの接続に問題の可能性
   - 環境変数は正しく設定されている

2. デバッグ情報が不足
   - エラーの具体的な原因が特定できていない
   - 接続試行の詳細が不明確

## 実装すべきテストエンドポイント

1. 環境変数確認用エンドポイント
```typescript
// app/api/square/env-check/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.SQUARE_ENVIRONMENT,
    hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
  });
}
```

2. Square API基本接続テスト
```typescript
// app/api/square/test/route.ts
import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Square API connection...');
    const response = await squareClient.locationsApi.listLocations();

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      locations: response.result.locations
    });
  } catch (error) {
    console.error('Square API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
```

3. 直接HTTPリクエストテスト
```typescript
// app/api/square/direct-test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://connect.squareupsandbox.com/v2/locations',
      {
        headers: {
          'Square-Version': '2024-11-20',
          'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    return NextResponse.json({
      success: true,
      rawResponse: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

## 実装手順
1. 上記3つのテストエンドポイントを作成
2. 各エンドポイントを順番にテスト
3. 結果を分析してSquare API接続の問題を特定

## 確認すべきポイント
1. 環境変数の読み込み状態
2. Square SDKの初期化パラメータ
3. ネットワーク接続状態
4. エラーメッセージの詳細

## 必要なファイル
1. `.env.local` - 環境変数の設定確認
2. `lib/square/client.ts` - Square SDKの設定確認

## 注意点
- 各テストエンドポイントで十分なログ出力を行う
- エラーハンドリングを適切に実装する
- 環境変数の機密情報が露出しないよう注意する

## 次のステップ
1. テストエンドポイントの実装
2. POSTMANでの動作確認
3. エラー原因の特定と修正
4. 本来のカタログAPIの修正
