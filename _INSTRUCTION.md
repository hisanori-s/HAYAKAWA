# Square商品表示機能の実装における型エラーの解決

## 目指す方向
1. POSTMANで取得した実際のSquare APIレスポンス形式に完全に合わせた実装
2. デモデータとSquare商品の両方が正しく表示される状態の実現
3. 型安全性を保ちながらのデータ変換の実装

## 現状の問題点
1. 型の不一致
   - `CatalogObject[]` と 期待される型の不一致
   - `itemVariationData` の型構造の不一致
   - `pricing_type` プロパティの型定義の問題

2. APIエンドポイントの500エラー
   - `/api/square/catalog` が Internal Server Error を返している
   - データ変換処理での型エラーが原因

## 参照すべきファイル
1. `app/api/square/catalog/route.ts`
   - APIエンドポイントの実装
   - データ変換ロジック

2. `lib/square/types.ts`
   - 型定義ファイル
   - `SquareProduct` インターフェース

3. `lib/constants/demo-products.ts`
   - デモデータの構造
   - 型エラーが発生している箇所

4. `components/product-list.tsx`
   - 商品表示コンポーネント
   - データの使用箇所

## 提供された情報
1. POSTMANで取得した実際のSquare APIレスポンス:
```json
{
    "items": [
        {
            "type": "ITEM",
            "id": "YFXLXTAUE4IUC6NGM2O642ND",
            "version": 1733645237575,
            "item_data": {
                "name": "HAYAKAWA",
                "description": "ベーシックな薄皮餃子",
                "variations": [
                    {
                        "type": "ITEM_VARIATION",
                        "id": "VDSZ42UAI2CFMLKZCSAJBGPE",
                        "item_variation_data": {
                            "item_id": "YFXLXTAUE4IUC6NGM2O642ND",
                            "name": "Regular",
                            "price_money": {
                                "amount": 15000,
                                "currency": "JPY"
                            }
                        }
                    }
                ]
            }
        }
    ]
}
```

2. 現在発生している型エラー:
```typescript
// route.ts のエラー
型 'CatalogObject[]' を型 '{ type: string; id: string; itemVariationData: { itemId: string; name: string; priceMoney: { amount: number; currency: string; }; }; }[]' に割り当てることはできません。

// demo-products.ts のエラー
オブジェクト リテラルは既知のプロパティのみ指定できます。'pricing_type' は型 '{ itemId: string; name: string; priceMoney: { amount: number; currency: string; }; }' に存在しません。
```

## 解決のステップ
1. 型定義の修正
   - POSTMANレスポンスの構造に完全に合わせた型定義の作成
   - `CatalogObject` と独自の型定義の整合性確保

2. データ変換ロジックの修正
   - APIレスポンスからフロントエンド用のデータ構造への変換処理の修正
   - 必要なプロパティの適切なマッピング

3. デモデータの構造修正
   - Square APIのレスポンス形式に合わせたデモデータの構造変更
   - 不要なプロパティの削除または必要なプロパティの追加

## 必要な追加情報
1. `lib/square/client.ts` の実装内容
2. デモデータの完全な構造
3. Square APIの型定義ファイル（`square`パッケージの型定義）

## 注意点
- 型の安全性を最優先すること
- POSTMANのレスポンス形式を正としてすべての型を合わせること
- デバッグ情報を十分に出力すること
