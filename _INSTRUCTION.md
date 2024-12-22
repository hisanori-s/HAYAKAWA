# Square ECサイト開発 - カート商品の在庫確認機能

## 現在の状況
1. 在庫管理機能の実装が完了
   - Square Inventory APIによる在庫数取得
   - 商品詳細での在庫数表示
   - 在庫数に基づく購入数制限

2. カート機能の現状
   - LocalStorageによる永続化
   - 商品の追加・削除
   - 数量変更機能
   - 決済処理連携

## 実装すべき機能
1. カート内商品の在庫確認機能
   - 決済ボタンクリック時に在庫確認
   - 在庫不足時のアラート表示
   - ユーザーによる数量調整の促進

2. 確認すべき条件
   - 在庫数 < 注文数：在庫不足
   - 在庫数 = 0：在庫切れ
   - 在庫管理していない商品：チェック不要

## 実装手順
1. 在庫確認ロジックの実装
   ```typescript
   // 実装すべき関数例
   async function validateCartInventory(cartItems: CartItem[]): Promise<{
     isValid: boolean;
     invalidItems: Array<{
       item: CartItem;
       availableQuantity: number;
     }>;
   }> {
     // 在庫管理している商品のIDを抽出
     // Square Inventory APIで在庫数を取得
     // カート内数量と在庫数を比較
     // 結果を返却
   }
   ```

2. アラート表示の実装
   ```typescript
   // アラートメッセージの例
   function getInventoryAlertMessage(invalidItems: InvalidItem[]): string {
     return `以下の商品の在庫が不足しています：\n
     ${invalidItems.map(item =>
       `・${item.name}: 在庫数 ${item.availableQuantity}個（注文数 ${item.quantity}個）`
     ).join('\n')}
     \n数量を調整してください。`;
   }
   ```

## 技術的な注意点
1. 在庫確認のタイミング
   - 決済ボタンクリック時に実行
   - 確認中はローディング表示
   - エラー時は決済処理に進まない

2. ユーザー体験の考慮
   - 明確なエラーメッセージ
   - 在庫数の表示
   - 数量調整への誘導

3. エラーハンドリング
   - API通信エラーの処理
   - タイムアウト処理
   - リトライロジック

## 修正が必要なファイル
1. `components/cart/cart-provider.tsx`
   - 在庫確認ロジックの追加
   - 決済前の確認処理

2. `components/cart/cart-items.tsx`
   - エラーメッセージ表示
   - 在庫状態の表示

3. `lib/square/client.ts`
   - 在庫確認用の関数追加
   - バッチ処理の最適化

## 参考情報
1. 現在の在庫確認API
   ```typescript
   // app/api/square/inventory/route.ts
   export async function POST(request: Request) {
     const { catalogItemVariationIds } = await request.json();
     // ... 在庫数取得ロジック
   }
   ```

2. カートのコンテキスト
   ```typescript
   // components/cart/cart-provider.tsx
   export function CartProvider({ children }: { children: React.ReactNode }) {
     // ... カート状態管理
   }
   ```

## 完了条件
1. 決済ボタンクリック時に在庫確認が実行されること
2. 在庫不足時に適切なアラートが表示されること
3. ユーザーが手動で数量を調整できること
4. 在庫確認中のローディング表示があること
5. エラーハンドリングが適切に実装されていること

## 次のAIへの引き継ぎ事項
1. 実装の優先順位
   a. まず在庫確認ロジックの実装
   b. 次にアラート表示の実装
   c. 最後にユーザー体験の改善

2. 注意点
   - 在庫数の自動調整は行わない
   - ユーザーの手動調整を促す
   - 決済処理は在庫確認が成功するまで開始しない

3. 必要なファイル
   - `components/cart/cart-provider.tsx`
   - `components/cart/cart-items.tsx`
   - `app/api/square/inventory/route.ts`
   - `lib/square/client.ts`
