# Square ECサイト開発 - 商品画像表示の問題解決

## 現在の状況
1. Square商品データの取得と表示は完了
2. 商品画像の表示機能を実装中
3. 画像IDは取得できているが、画像の表示に失敗している

## 直近の実装内容
1. `app/api/square/image/[imageId]/route.ts`でSquare APIから画像URLを取得
2. `components/product-list.tsx`のモーダル内で画像表示を実装
3. エラーハンドリングとフォールバック処理を追加

## 現在の問題点
1. 画像の読み込みに失敗している
2. デバッグ情報が不十分で原因特定が困難
3. APIレスポンスの詳細が確認できない

## 次のステップ
1. デバッグ情報の強化
   - APIレスポンスの詳細表示
   - 画像URLの取得状況の確認
   - エラー情報の詳細化

2. 画像表示機能の修正
   - Square APIからの画像URL取得プロセスの確認
   - 画像表示コンポーネントの動作確認
   - エラーハンドリングの改善

## 参照すべきファイル
1. `components/product-list.tsx`
   - 商品モーダルの実装
   - 画像表示ロジック

2. `app/api/square/image/[imageId]/route.ts`
   - 画像URL取得API
   - デバッグ情報の出力

3. `lib/square/client.ts`
   - Square API連携
   - 画像取得関数

## 技術的な注意点
1. Square APIの仕様
   - 画像URLの取得方法
   - APIレスポンスの構造

2. デバッグ対応
   - ネットワークリクエストの確認
   - レスポンスデータの検証
   - エラーログの確認

## 次のチャットでの作業指示
1. デバッグ情報の強化から着手
2. APIレスポンスの詳細を確認
3. 問題箇所を特定して修正

## コードブロック
```typescript
// components/product-list.tsx の ProductModal コンポーネント
function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // 画像URLを取得
    const fetchImage = async () => {
      if (product.imageIds?.[0]) {
        try {
          const response = await fetch(`/api/square/image/${product.imageIds[0]}`);
          const data = await response.json();
          if (data.success && data.url) {
            setImageUrl(data.url);
          } else {
            setImageError(true);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          setImageError(true);
        }
      }
    };

    fetchImage();
  }, [product.imageIds]);

  // ... 残りのコード
}
```

```typescript
// app/api/square/image/[imageId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    console.log('Fetching image for ID:', params.imageId);

    const imageUrl = await fetchImageUrl(params.imageId);
    console.log('Retrieved image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      debug: {
        imageId: params.imageId,
        hasUrl: !!imageUrl,
        retrievedUrl: imageUrl,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        imageId: params.imageId,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
```
