# Square ECサイト開発 - カート商品の在庫確認機能

## 現在の状況
1. 在庫管理機能の実装が完了
   - Square Inventory APIによる在庫数取得
   - 商品詳細での在庫数表示
   - 在庫数に基づく購入数制限
   - 商品ごとの在庫管理要否フラグの実装

2. カート機能の現状
   - LocalStorageによる永続化
   - 商品の追加・削除
   - 数量変更機能
   - 決済処理連携

## セキュリティ要件

### 環境変数の取り扱い
- Square APIのアクセストークン（`SQUARE_ACCESS_TOKEN`）は必ずサーバーサイドでのみ使用すること
- 機密情報（APIキー、トークン）は絶対にクライアントサイドで使用しないこと

### API通信の制約
- 在庫確認は必ずサーバーサイドのAPIエンドポイントを経由して行うこと
- Square APIへの直接的なアクセスは全てサーバーサイドで行い、クライアントサイドからは内部APIを経由すること
- クライアントサイドでは、内部APIエンドポイント（`/api/square/*`）のみを使用すること

### 実装方針
- 環境変数のチェックは`lib/square/client.ts`内の`getSquareClient()`関数でのみ行うこと
- クライアントコンポーネントでは、環境変数を直接参照せず、APIエンドポイントを介して必要な情報を取得すること

## 実装すべき機能
1. カート内商品の在庫確認機能
   - 在庫管理フラグ（`requiresInventory`）に基づく確認要否の判定
   - 決済ボタンクリック時に在庫確認
   - 在庫不足時のアラート表示
   - ユーザーによる数量調整の促進

2. 確認すべき条件
   - 在庫管理フラグ（`requiresInventory`）= false：チェック不要
   - 在庫管理フラグ（`requiresInventory`）= true の場合：
     - 在庫数 < 注文数：在庫不足
     - 在庫数 = 0：在庫切れ

## 在庫チェックの動作フロー
1. ページの表示
2. 在庫チェックが必要な商品の有無を確認
3. チェックが必要な場合のみ在庫照会を実行
4. 不足がある場合はアラートエリアに表示
5. 在庫不足が解決するまで注文手続きボタンを無効化

## 実装手順
1. カートアイテムの型定義
   ```typescript
   interface CartItem {
     id: string;           // Square カタログアイテムID
     name: string;         // 商品名
     price: number;        // 価格
     quantity: number;     // 数量
     hasVariations: boolean; // バリエーションの有無
     requiresInventory: boolean; // 在庫管理の要否
     maxStock: number;     // 最大在庫数
   }
   ```

2. 在庫確認ロジックの実装
   ```typescript
   // 実装すべき関数例
   async function validateCartInventory(cartItems: CartItem[]): Promise<{
     isValid: boolean;
     invalidItems: Array<{
       item: CartItem;
       availableQuantity: number;
     }>;
   }> {
     // 在庫管理が必要な商品のみを抽出
     const itemsRequiringInventory = cartItems.filter(item => item.requiresInventory);

     // 在庫管理が必要な商品がない場合は早期リターン
     if (itemsRequiringInventory.length === 0) {
       return {
         isValid: true,
         invalidItems: []
       };
     }

     // Square Inventory APIで在庫数を取得
     const inventoryResponse = await fetch('/api/square/inventory', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         catalogItemVariationIds: itemsRequiringInventory.map(item => item.id)
       })
     });

     const inventory = await inventoryResponse.json();

     // 在庫不足アイテムの抽出
     const invalidItems = itemsRequiringInventory.filter(item => {
       const stock = inventory[item.id] ?? 0;
       return stock < item.quantity;
     }).map(item => ({
       item,
       availableQuantity: inventory[item.id] ?? 0
     }));

     return {
       isValid: invalidItems.length === 0,
       invalidItems
     };
   }
   ```

3. アラート表示の実装
   ```typescript
   // アラートメッセージの例
   function getInventoryAlertMessage(invalidItems: Array<{
     item: CartItem;
     availableQuantity: number;
   }>): string {
     return `以下の商品の在庫が不足しています：\n
     ${invalidItems.map(({ item, availableQuantity }) =>
       `・${item.name}: 在庫数 ${availableQuantity}個（注文数 ${item.quantity}個）`
     ).join('\n')}
     \n数量を調整してください。`;
   }
   ```

## UI仕様
- カート内の基本的なUIは既存を維持
- アラートメッセージは商品リストの上部（カートの文字の下）に表示
- 在庫不足時は注文手続きボタンを無効化

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
   - アラートエリアの追加

3. `lib/square/client.ts`
   - 在庫確認用の関数追加
   - バッチ処理の最適化
   - 環境変数チェックの実装

## 参考情報
1. 現在の在庫確認API
   ```typescript
   // app/api/square/inventory/route.ts
   export async function POST(request: Request) {
     const { catalogItemVariationIds } = await request.json();

     // 在庫管理が必要なIDのみを処理
     const inventoryResponse = await squareClient.inventoryApi.batchRetrieveInventoryCounts({
       catalogObjectIds: catalogItemVariationIds
     });

     // IDごとの在庫数をマッピング
     const inventoryMap = inventoryResponse.counts.reduce((acc, count) => {
       acc[count.catalogObjectId] = parseInt(count.quantity);
       return acc;
     }, {});

     return Response.json(inventoryMap);
   }
   ```

2. カートのコンテキスト
   ```typescript
   // components/cart/cart-provider.tsx
   export function CartProvider({ children }: { children: React.ReactNode }) {
     const [cartItems, setCartItems] = useState<CartItem[]>([]);
     const [inventoryStatus, setInventoryStatus] = useState<{
       isChecking: boolean;
       invalidItems: Array<{
         item: CartItem;
         availableQuantity: number;
       }>;
     }>({
       isChecking: false,
       invalidItems: []
     });

     // ... カート状態管理
   }
   ```

## 完了条件
1. 在庫管理フラグに基づいて適切に在庫確認が実行されること
2. 決済ボタンクリック時に在庫確認が実行されること
3. 在庫不足時に適切なアラートが表示されること
4. ユーザーが手動で数量を調整できること
5. 在庫確認中のローディング表示があること
6. エラーハンドリングが適切に実装されていること
7. セキュリティ要件が満たされていること

## 次のAIへの引き継ぎ事項
1. 実装の優先順位
   a. まず在庫確認ロジックの実装
   b. 次にアラート表示の実装
   c. 最後にユーザー体験の改善

2. 注意点
   - 在庫管理フラグに基づく処理の分岐を確実に行う
   - 在庫数の自動調整は行わない
   - ユーザーの手動調整を促す
   - 決済処理は在庫確認が成功するまで開始しない
   - セキュリティ要件の厳守

3. 必要なファイル
   - `components/cart/cart-provider.tsx`
   - `components/cart/cart-items.tsx`
   - `app/api/square/inventory/route.ts`
   - `lib/square/client.ts`
