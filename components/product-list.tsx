import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DEMO_PRODUCTS } from '@/lib/constants/demo-products'
import { SquareProduct } from '@/lib/square/types'
import { useCart } from '@/components/cart/cart-provider'

// 金額を表示用の文字列に変換（日本円表示用）
const formatPrice = (amount: number | null | undefined): string => {
  if (amount == null) return '0';
  // Square APIは金額を最小単位（銭）で返すため、100で割って円に変換
  return Math.floor(amount / 100).toLocaleString();
};

interface SquareApiResponse {
  items: SquareProduct[];
  cursor?: string;
  error?: string;
  details?: unknown;
}

interface SquareVariation {
  type: string;
  id: string;
  version: number;
  updated_at: string;
  created_at: string;
  is_deleted: boolean;
  present_at_all_locations: boolean;
  item_variation_data: {
    item_id: string;
    name: string;
    pricing_type: string;
    price_money: {
      amount: number;
      currency: string;
    };
  };
}

export function ProductList() {
  const [products, setProducts] = useState<SquareProduct[]>([]);
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
          },
          body: JSON.stringify({
            productTypes: ['REGULAR'],
            limit: 100
          })
        });
        const data: SquareApiResponse = await response.json();

        if (data.error) {
          console.error('API Error:', data.error);
          setError('商品の取得に失敗しました。');
          return;
        }

        if (!data.items || data.items.length === 0) {
          console.log('No items found in Square catalog');
          setProducts([]);
          return;
        }

        const convertedProducts: SquareProduct[] = data.items
          .filter((item: SquareProduct) => item.type === 'ITEM' && item.item_data)
          .map((item: SquareProduct) => ({
            id: item.id,
            type: item.type,
            version: item.version,
            updated_at: item.updated_at,
            created_at: item.created_at,
            is_deleted: item.is_deleted,
            present_at_all_locations: item.present_at_all_locations,
            item_data: {
              name: item.item_data?.name || '',
              description: item.item_data?.description,
              is_taxable: true,
              variations: item.item_data?.variations?.map((v: SquareVariation) => ({
                type: v.type,
                id: v.id,
                version: v.version,
                updated_at: v.updated_at,
                created_at: v.created_at,
                is_deleted: v.is_deleted,
                present_at_all_locations: v.present_at_all_locations,
                item_variation_data: {
                  item_id: v.item_variation_data?.item_id,
                  name: v.item_variation_data?.name || '',
                  pricing_type: "FIXED_PRICING",
                  price_money: {
                    amount: v.item_variation_data?.price_money?.amount || 0,
                    currency: v.item_variation_data?.price_money?.currency || 'JPY'
                  }
                }
              })),
              product_type: "REGULAR"
            }
          }));

        console.log('Converted Products:', convertedProducts);
        setProducts(convertedProducts);
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
      {/* デバッグ情報表示 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="col-span-2 mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ products, error, isLoading }, null, 2)}
          </pre>
        </div>
      )}

      {/* デモ商品の表示 */}
      {productGroups.map((group) => (
        <section key={group.name}>
          <h2 className="text-lg tracking-wide text-muted-foreground mb-4">{group.name}</h2>
          <div className="space-y-4">
            {group.items.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
                      <h3 className="font-medium">{item.item_data?.name}</h3>
                    </div>
                    <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
                    <p className="font-medium">
                      {formatPrice(item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount)}円
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.item_data?.name}</DialogTitle>
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
            {products.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                    <div>
                      <h3 className="font-medium">{item.item_data?.name}</h3>
                    </div>
                    <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
                    <p className="font-medium">
                      {formatPrice(item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount)}円
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.item_data?.name}</DialogTitle>
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

interface ExtendedSquareProduct extends SquareProduct {
  imageUrl?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductModalProps {
  product: ExtendedSquareProduct;
  onAddToCart: (item: CartItem) => void;
}

function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const priceAmount = product.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount;
  const price = priceAmount ? Number(priceAmount) : 0;

  const handleAddToCart = () => {
    if (!product.item_data?.name) return;

    onAddToCart({
      id: product.id,
      name: product.item_data.name,
      price,
      quantity,
    });
  };

  return (
    <div className="space-y-4">
      {product.imageUrl && (
        <div className="relative h-64 w-full">
          <Image
            src={product.imageUrl}
            alt={product.item_data?.name || '商品画像'}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
      <p className="text-lg font-semibold">{formatPrice(price)}円</p>
      <p className="text-sm text-gray-500">{product.item_data?.description}</p>
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

