import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DEMO_PRODUCTS } from '@/lib/constants/demo-products'
import { CatalogObject } from 'square'
import { CartItem, ExtendedCatalogObject, ProductGroup } from '@/lib/square/types'
import { useCart } from '@/components/cart/cart-provider'

// 金額を表示用の文字列に変換（日本円表示用）
const formatPrice = (amount: number | bigint | null | undefined): string => {
  if (amount == null) return '0';
  // BigIntの場合はNumberに変換
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return Math.floor(numericAmount / 100).toLocaleString();
};

interface SquareApiResponse {
  items: CatalogObject[];
  cursor?: string;
  error?: string;
  details?: unknown;
}

export function ProductList() {
  const [products, setProducts] = useState<CatalogObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productGroups = DEMO_PRODUCTS;
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

        console.log('API Response:', await response.clone().json());
        const data: SquareApiResponse = await response.json();

        if (data.error) {
          console.error('API Error:', data.error);
          setError('商品の取得に失敗しました。');
          return;
        }

        console.log('Fetched products:', data.items);
        setProducts(data.items || []);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('商品の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // デバッグ情報の表示
  console.log('Current state:', {
    products,
    error,
    isLoading,
    mockProducts: productGroups
  });

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
      {/* デバッグ情報表示 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="col-span-2 mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              mockProductsCount: productGroups.reduce((acc, group) => acc + group.items.length, 0),
              apiProductsCount: products.length,
              error,
              isLoading
            }, null, 2)}
          </pre>
        </div>
      )}

      {/* デバ商品の表示 */}
      {productGroups.map((group: ProductGroup) => (
        <section key={group.name}>
          <h2 className="text-lg tracking-wide text-muted-foreground mb-4">{group.name}</h2>
          <div className="space-y-4">
            {group.items.map((item: CatalogObject) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
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
                  <ProductModal product={item} onAddToCart={handleAddToCart} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      ))}

      {/* Square商品の表示 */}
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

      {!isLoading && !error && products.length > 0 && (
        <section>
          <h2 className="text-lg tracking-wide text-muted-foreground mb-4">Square商品</h2>
          <div className="space-y-4">
            {products.map((item: CatalogObject) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
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
                  <ProductModal product={item} onAddToCart={handleAddToCart} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      )}
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
      price: price / 100, // 単位を円に変換
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      {product.imageUrl && (
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.itemData?.name || '商品画像'}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
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

