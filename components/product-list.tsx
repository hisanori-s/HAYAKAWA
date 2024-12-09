import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DEMO_PRODUCTS } from '@/lib/constants/demo-products'
import { CatalogObject } from 'square'
import type { CartItem, ExtendedCatalogObject } from '@/lib/square/types'
import { useCart } from '@/components/cart/cart-provider'

// 金額を表示用の文字列に変換（日本円表示用）
const formatPrice = (amount: number | bigint | null | undefined): string => {
  if (amount == null) return '0';
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return Math.floor(numericAmount / 100).toLocaleString();
};

// デバッグデータの型定義を更新
interface SquareApiDebugData {
  categories?: CatalogObject[];
  items?: CatalogObject[];
  parentCategory?: CatalogObject;
  error?: string;
  details?: unknown;
}

interface CategoryGroup {
  category: CatalogObject;
  items: CatalogObject[];
}

export function ProductList() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [uncategorizedItems, setUncategorizedItems] = useState<CatalogObject[]>([]);
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

        if (data.error) {
          setError('商品の取得に失敗しました。');
          return;
        }

        // カテゴリとアイテムを分離
        const categories: CatalogObject[] = data.categories || [];
        const items: CatalogObject[] = data.items || [];

        console.log('Categories:', categories.map(cat => ({
          id: cat.id,
          name: cat.categoryData?.name,
          parentCategory: cat.categoryData?.parentCategory
        })));

        // カテゴリごとに商品をグループ化
        const groups = categories
          .filter(category => category.categoryData?.name)
          .map((category: CatalogObject) => ({
            category,
            items: items.filter((item: CatalogObject) =>
              item.type === 'ITEM' &&
              item.itemData?.categoryId === category.id
            )
          }))
          .filter((group: CategoryGroup) => group.items.length > 0);

        // カテゴリなし商品の抽出
        const uncategorized = items.filter((item: CatalogObject) =>
          item.type === 'ITEM' &&
          !item.itemData?.categoryId
        );

        setCategoryGroups(groups);
        setUncategorizedItems(uncategorized);
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
                  categories: debugData.categories?.map(cat => ({
                    id: cat.id,
                    name: cat.categoryData?.name,
                    type: cat.type,
                    parentCategory: cat.categoryData?.parentCategory
                  }))
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">カテゴリ別商品数:</h4>
              <pre className="text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify(categoryGroups.map(g => ({
                  name: g.category.categoryData?.name,
                  itemCount: g.items.length,
                  items: g.items.map(item => ({
                    name: item.itemData?.name,
                    categoryId: item.itemData?.categoryId,
                    imageIds: item.itemData?.imageIds
                  }))
                })), null, 2)}
              </pre>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">未分類商品:</h4>
            <pre className="text-xs overflow-auto bg-white p-2 rounded">
              {JSON.stringify(uncategorizedItems.map(item => ({
                name: item.itemData?.name,
                categoryId: item.itemData?.categoryId,
                imageIds: item.itemData?.imageIds,
                type: item.type
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
              <ProductGroupView items={group.items} onAddToCart={handleAddToCart} />
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
                {group.category.categoryData?.name}
              </h2>
              <ProductGroupView items={group.items} onAddToCart={handleAddToCart} />
            </section>
          ))}

          {uncategorizedItems.length > 0 && (
            <section>
              <h2 className="text-lg tracking-wide text-muted-foreground mb-4">その他</h2>
              <ProductGroupView items={uncategorizedItems} onAddToCart={handleAddToCart} />
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
  items: CatalogObject[],
  onAddToCart: (item: CartItem) => void
}) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{item.itemData?.name}</h3>
              </div>
              <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
              <p className="font-medium">
                {formatPrice(item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount)}円
              </p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{item.itemData?.name}</DialogTitle>
            </DialogHeader>
            <ProductModal product={item} onAddToCart={onAddToCart} />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

interface ProductModalProps {
  product: ExtendedCatalogObject;
  onAddToCart: (item: CartItem) => void;
}

function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const priceAmount = product.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount;
  const price = priceAmount ? (typeof priceAmount === 'bigint' ? Number(priceAmount) : priceAmount) : 0;

  const handleAddToCart = () => {
    if (!product.itemData?.name) return;

    onAddToCart({
      id: product.id || '',
      name: product.itemData.name,
      price: price / 100,
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full">
        <Image
          src={product.itemData?.imageIds?.[0]
            ? `/api/square/image/${product.itemData.imageIds[0]}`
            : '/images/placeholders/product-placeholder.jpg'}
          alt={product.itemData?.name || '商品画像'}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <p className="text-lg font-semibold">{formatPrice(price)}円</p>
      <p className="text-sm text-gray-500">{product.itemData?.description}</p>
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

