import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DEMO_PRODUCTS } from '@/lib/constants/demo-products'
import type { CartItem } from '@/lib/square/types'
import { useCart } from '@/components/cart/cart-provider'

// 金額を表示用の文字列に変換（日本円表示用）
const formatPrice = (amount: number | bigint | null | undefined): string => {
  if (amount == null) return '0';
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return Math.floor(numericAmount / 100).toLocaleString();
};

// デバッグデータの型定義を更新
interface CategoryData {
  id: string;
  name: string;
  parentId?: string | null;
}

interface ProductData {
  id: string;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  variations: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  imageIds?: string[];
}

interface SquareApiDebugData {
  categories: { [key: string]: CategoryData };
  products: ProductData[];
}

interface CategoryGroup {
  category: CategoryData;
  products: ProductData[];
}

// 商品表示用の共通インターフェース
interface DisplayProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string;
  categoryId?: string | null;
  imageIds?: string[];
}

export function ProductList() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [uncategorizedProducts, setUncategorizedProducts] = useState<ProductData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugData, setDebugData] = useState<SquareApiDebugData | null>(null);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/square/catalog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data: SquareApiDebugData = await response.json();
        setDebugData(data);

        if (!data.categories || !data.products) {
          setError('商品の取得に失敗しました。');
          return;
        }

        // カテゴリごとに商品をグループ化
        const groups = Object.values(data.categories)
          .map((category) => ({
            category,
            products: data.products.filter(product => product.categoryId === category.id)
          }))
          .filter((group) => group.products.length > 0);

        // カテゴリなし商品の抽出
        const uncategorized = data.products.filter(product => !product.categoryId);

        setCategoryGroups(groups);
        setUncategorizedProducts(uncategorized);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('商品の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
      {/* モバッグ情報の詳細表示 */}
      {process.env.NODE_ENV === 'development' && debugData && (
        <div className="col-span-2 mb-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-4">Debug Info:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">カテゴリ構造:</h4>
              <pre className="text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify({
                  categories: Object.values(debugData.categories || {}).map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    parentId: cat.parentId
                  }))
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">カテゴリ別商品数:</h4>
              <pre className="text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify(categoryGroups.map(g => ({
                  name: g.category.name,
                  itemCount: g.products.length,
                  items: g.products.map(product => ({
                    name: product.name,
                    categoryId: product.categoryId,
                    imageIds: product.imageIds
                  }))
                })), null, 2)}
              </pre>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">未分類商品:</h4>
            <pre className="text-xs overflow-auto bg-white p-2 rounded">
              {JSON.stringify(uncategorizedProducts.map(product => ({
                name: product.name,
                categoryId: product.categoryId,
                imageIds: product.imageIds
              })), null, 2)}
            </pre>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">APIレスポンス (生データ):</h4>
            <pre className="text-xs overflow-auto bg-white p-2 rounded">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* モックデータの表示 */}
      <div className="col-span-2 mb-8">
        <h2 className="text-xl font-bold mb-6">デモ商品</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {DEMO_PRODUCTS.map((group) => (
            <section key={group.name}>
              <h2 className="text-lg tracking-wide text-muted-foreground mb-4">{group.name}</h2>
              <ProductGroupView
                items={group.items.map(item => ({
                  id: item.id,
                  name: item.itemData?.name || '',
                  description: item.itemData?.description,
                  price: Number(item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || 0),
                  imageUrl: item.itemData?.imageIds?.[0]
                    ? `/api/square/image/${item.itemData.imageIds[0]}`
                    : '/images/placeholders/product-placeholder.jpg',
                  categoryId: item.itemData?.categories?.[0]?.id || item.itemData?.categoryId || null,
                  imageIds: item.itemData?.imageIds || []
                }))}
                onAddToCart={handleAddToCart}
              />
            </section>
          ))}
        </div>
      </div>

      {/* Square商品のカテゴリ別表示 */}
      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-6">Square商品</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {categoryGroups.map((group) => (
            <section key={group.category.id}>
              <h2 className="text-lg tracking-wide text-muted-foreground mb-4">
                {group.category.name}
              </h2>
              <ProductGroupView
                items={group.products.map(product => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.variations[0]?.price || 0,
                  imageUrl: product.imageIds?.[0]
                    ? `/api/square/image/${product.imageIds[0]}`
                    : '/images/placeholders/product-placeholder.jpg',
                  categoryId: product.categoryId,
                  imageIds: product.imageIds
                }))}
                onAddToCart={handleAddToCart}
              />
            </section>
          ))}

          {uncategorizedProducts.length > 0 && (
            <section>
              <h2 className="text-lg tracking-wide text-muted-foreground mb-4">その他</h2>
              <ProductGroupView
                items={uncategorizedProducts.map(product => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.variations[0]?.price || 0,
                  imageUrl: product.imageIds?.[0]
                    ? `/api/square/image/${product.imageIds[0]}`
                    : '/images/placeholders/product-placeholder.jpg',
                  categoryId: product.categoryId,
                  imageIds: product.imageIds
                }))}
                onAddToCart={handleAddToCart}
              />
            </section>
          )}
        </div>
      </div>

      {error && (
        <div className="col-span-2 text-red-500 text-center">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="col-span-2 text-center">
          商品を読み込み中...
        </div>
      )}
    </div>
  );
}

// 商品グループコンポーネント
function ProductGroupView({ items, onAddToCart }: {
  items: DisplayProduct[],
  onAddToCart: (item: CartItem) => void
}) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{item.name}</h3>
              </div>
              <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
              <p className="font-medium">
                {formatPrice(item.price)}円
              </p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <ProductModal product={item} onAddToCart={onAddToCart} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

interface ProductModalProps {
  product: DisplayProduct;
  onAddToCart: (item: CartItem) => void;
}

function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price / 100,
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl || '/images/placeholders/product-placeholder.jpg'}
          alt={product.name || '商品画像'}
          fill
          className="object-cover rounded-md"
        />
      </div>
      {(product.categoryId || product.imageIds) && (
        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded">
          {product.categoryId && (
            <p>カテゴリID: {product.categoryId}</p>
          )}
          {product.imageIds && product.imageIds.length > 0 && (
            <p>画像ID: {product.imageIds.join(', ')}</p>
          )}
        </div>
      )}
      <p className="text-lg font-semibold">{formatPrice(product.price)}円</p>
      <p className="text-sm text-gray-500">{product.description}</p>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          max={10}
          className="w-20"
        />
        <Button onClick={handleAddToCart}>
          カートに追加
        </Button>
      </div>
    </div>
  );
}

