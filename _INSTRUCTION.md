# Square Checkout APIの改善とリダイレクト処理の実装

## 現在の状態
1. Square Checkout APIの在庫管理連携が完了
   - カタログ商品IDを使用した決済リンク生成
   - Square側での自動在庫管理の有効化
   - 余分な在庫確認処理の削除

2. 課題点
   - 決済後のリダイレクトページが真っ白で表示されない
   - リダイレクト時のSquareからのパラメータ確認が未実装

## 確認・実装項目
1. リダイレクト処理の確認
   - `app/cart/complete/page.tsx`の実装状態
   - `app/cart/error/page.tsx`の実装状態
   - リダイレクトURLの設定確認（`app/api/square/checkout/route.ts`）

2. デバッグ情報の実装
   ```typescript
   // リダイレクトページでのデバッグ情報表示
   console.log('Square redirect parameters:', {
     searchParams,
     orderId: searchParams.get('orderId'),
     referenceId: searchParams.get('referenceId'),
     status: searchParams.get('status')
   });
   ```

3. デバッグ用UI実装
   - 成功・失敗両方のUIを実装
   - トグルボタンで表示切替可能に
   - 現在のステータスに基づいて、本来表示されるべきUIを明示
   ```typescript
   // デバッグ用トグル実装例
   const [showSuccessUI, setShowSuccessUI] = useState(true);
   const actualStatus = searchParams.get('status');

   return (
     <div>
       <div className="debug-panel">
         <p>実際のステータス: {actualStatus}</p>
         <p>本来の表示: {actualStatus === 'ok' ? '成功UI' : 'エラーUI'}</p>
         <button onClick={() => setShowSuccessUI(!showSuccessUI)}>
           {showSuccessUI ? 'エラーUIを表示' : '成功UIを表示'}
         </button>
       </div>
       {showSuccessUI ? <SuccessUI /> : <ErrorUI />}
     </div>
   );
   ```

## 必要なファイル
1. `app/cart/complete/page.tsx`
   - 決済完了ページの実装確認
   - Squareからのパラメータ処理の実装
   - デバッグ用トグルUIの実装

2. `app/cart/error/page.tsx`
   - エラーページの実装確認
   - エラー情報の表示実装
   - デバッグ用トグルUIの実装

3. `app/api/square/checkout/route.ts`
   - リダイレクトURL設定の確認
   - 環境変数の設定確認

## 完了条件
1. 決済完了後、適切なページが表示されること
2. Squareからのリダイレクトパラメータがコンソールに表示されること
3. エラー時も適切なページに遷移し、エラー情報が表示されること
4. デバッグ用トグルUIで成功・エラー両方の表示を確認できること

## 次のAIへの指示
1. まず、各リダイレクトページの実装状態を確認してください
2. リダイレクトページにデバッグ情報の表示を実装してください
3. デバッグ用のトグルUIを実装してください：
   - 成功・エラー両方のUIを用意
   - トグルボタンで切り替え可能に
   - 実際のステータスと本来の表示を明示
4. 必要に応じて、以下の実装を行ってください：
   - 決済完了ページの表示実装
   - エラーページの表示実装
   - リダイレクトURLの設定確認と修正

## 参考情報
Square Checkout APIのリダイレクト時のパラメータ：
- `orderId`: 注文ID
- `referenceId`: 参照ID
- `status`: 決済状態（'ok' または 'error'）
