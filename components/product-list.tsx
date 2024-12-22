import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import type { CartItem, ECCategory, ECProduct, CategoryTree, ECProductVariation } from '@/lib/square/types'
import { useCart } from '@/components/cart/cart-provider'

// 金額を表示用の文字列に変換（日本円表示用）
const formatPrice = (amount: number | bigint | null | undefined): string => {
  if (amount == null) return '0';
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return numericAmount.toLocaleString();
};

// デバッグデータの型定義を更新
interface SquareApiDebugData {
  categoryTree: CategoryTree;
  ecProducts: ECProduct[];
}

interface CategoryGroup {
  category: ECCategory;
  products: ECProduct[];
}

// 商品表示用の共通インターフェース
interface DisplayProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string;
  category: ECCategory;
  imageIds?: string[];
  variations: ECProductVariation[];
  trackInventory: boolean;
  isSoldOut: boolean;
}

// 型定義を追加
interface ImageBatchResponse {
  success: boolean;
  urls: string[];
}

/**
 * メイン商品リストコンポーネント
 * Square APIから商品情報を取得し、カテゴリごとに商品を表示する
 */
export function ProductList() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
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

        if (!data.categoryTree || !data.ecProducts) {
          setError('商品の取得に失敗しました。');
          return;
        }

        // カテゴリごとに商品をグループ化
        const groups = Object.values(data.categoryTree.allCategories)
          .map((category) => ({
            category,
            products: data.ecProducts.filter(product => product.category.id === category.id)
          }))
          .filter((group) => group.products.length > 0);

        setCategoryGroups(groups);

        // 商品��覧取得後、すべての画像IDを収集して一括プリフェッチ
        const allImageIds = data.ecProducts
          .flatMap(product => product.itemData?.imageIds || [])
          .filter(Boolean);

        if (allImageIds.length > 0) {
          console.log('Starting batch image prefetch for', allImageIds.length, 'images');
          try {
            const response = await fetch('/api/square/image/batch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageIds: allImageIds }),
            });
            const imageData = await response.json() as ImageBatchResponse;
            if (imageData.success) {
              // プリフェッチのためにURLを取得
              imageData.urls.forEach((url: string) => {
                const img = document.createElement('img');
                img.src = url;
              });
              console.log('Successfully prefetched', imageData.urls.length, 'images');
            }
          } catch (error) {
            console.error('Error prefetching images:', error);
          }
        }

      } catch (error) {
        console.error('Fetch error:', error);
        setError('商品の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="col-span-2 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="col-span-2 text-center">
        商品を読み込み中...
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-8">
      {/* デバッグ情報の詳細表示 */}
      {process.env.NODE_ENV === 'development' && debugData && (
        <div className="col-span-2 mb-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="debug-info">
              <AccordionTrigger className="bg-gray-100 p-4 rounded-t">
                <h3 className="font-bold">Debug Info</h3>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-100 p-4 rounded-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">カテゴリ構造:</h4>
                    <pre className="text-xs overflow-auto bg-white p-2 rounded">
                      {JSON.stringify({
                        root: debugData.categoryTree.root,
                        allCategories: Object.values(debugData.categoryTree.allCategories).map(cat => ({
                          id: cat.id,
                          name: cat.name,
                          parentId: cat.parentId,
                          isECCategory: cat.isECCategory,
                          children: cat.children?.map(child => ({
                            id: child.id,
                            name: child.name,
                            parentId: child.parentId
                          }))
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
                          name: product.itemData?.name,
                          category: {
                            id: product.category.id,
                            name: product.category.name
                          },
                          imageIds: product.itemData?.imageIds
                        }))
                      })), null, 2)}
                    </pre>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">APIレスポンス (生データ):</h4>
                  <pre className="text-xs overflow-auto bg-white p-2 rounded">
                    {JSON.stringify(debugData, null, 2)}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* 商品一覧 */}
      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-6">商品一覧</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {categoryGroups.map((group) => (
            <section key={group.category.id}>
              <h2 className="text-lg tracking-wide text-muted-foreground mb-4">
                {group.category.name}
              </h2>
              <ProductGroupView
                items={group.products.map(product => {
                  const firstVariation = product.itemData?.variations?.[0]?.itemVariationData;
                  return {
                    id: product.id,
                    name: product.itemData?.name || '',
                    description: product.itemData?.description,
                    price: Number(firstVariation?.priceMoney?.amount || 0),
                    imageUrl: product.itemData?.imageIds?.[0]
                      ? `/api/square/image/${product.itemData.imageIds[0]}`
                      : '/images/placeholders/product-placeholder.jpg',
                    category: product.category,
                    imageIds: product.itemData?.imageIds || [],
                    variations: (product.itemData?.variations || []).map(variation => ({
                      id: variation.id,
                      name: variation.itemVariationData?.name || '',
                      sku: variation.itemVariationData?.sku,
                      price: Number(variation.itemVariationData?.priceMoney?.amount || 0),
                      ordinal: variation.itemVariationData?.ordinal || 0,
                      trackInventory: variation.itemVariationData?.trackInventory || false,
                      soldOut: variation.itemVariationData?.locationOverrides?.some(override => override.soldOut) || false
                    })),
                    trackInventory: firstVariation?.trackInventory || false,
                    isSoldOut: firstVariation?.locationOverrides?.some(override => override.soldOut) || false
                  };
                })}
                onAddToCart={handleAddToCart}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// ProductGroupViewコンポーネントの型定義を更新
interface ProductGroupViewProps {
  items: DisplayProduct[];
  onAddToCart: (item: CartItem) => void;
}

/**
 * カテゴリごとの商品グループを表示するコンポーネント
 * @param items 表示する商品リスト
 * @param onAddToCart カートに商品を追加する関数
 */
function ProductGroupView({ items, onAddToCart }: ProductGroupViewProps) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <div className={`flex justify-between items-baseline cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors duration-200 ${
              item.trackInventory && item.isSoldOut ? 'text-gray-400' : ''
            }`}>
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{item.name}</h3>
              </div>
              <div className="border-b border-dotted border-muted-foreground flex-grow mx-4" />
              <div className="flex items-center gap-2">
                {item.trackInventory && item.isSoldOut && (
                  <span className="text-red-500 text-sm whitespace-nowrap">売切御免</span>
                )}
                <p className={`font-medium ${item.trackInventory && item.isSoldOut ? 'text-gray-400' : ''}`}>
                  {formatPrice(item.price)}円
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-sm text-gray-500">
                {item.category.name.replace('EC_', '')} &gt; {item.name}
              </DialogTitle>
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

/**
 * 商品詳細モーダルコンポーネント
 * 商品の詳細情報、画像、バリエーション選択、数量選択を表示する
 * @param product 表示する商品情報
 * @param onAddToCart カートに商品を追加する関数
 */
function ProductModal({ product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ECProductVariation | null>(
    product.variations && product.variations.length === 1 ? product.variations[0] : null
  );

  // バリエーションが選択されているかと数量が有効かをチェック
  const hasVariations = product.variations && product.variations.length > 1;
  const isValidSelection = !hasVariations || selectedVariation !== null;
  const isValidQuantity = quantity > 0 && quantity <= 10;
  const isSoldOut = product.trackInventory && product.isSoldOut;
  const canAddToCart = isValidSelection && isValidQuantity && !isSoldOut;

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const fetchImages = async () => {
      if (product.imageIds && product.imageIds.length > 0) {
        try {
          const response = await fetch('/api/square/image/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageIds: product.imageIds }),
          });
          const data = await response.json();
          if (data.success) {
            setImageUrls(data.urls);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
    };

    fetchImages();
  }, [product.imageIds]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full">
        {product.imageIds && product.imageIds.length > 0 ? (
          <div className="relative w-full h-full">
            <Carousel className="w-full h-full" setApi={setApi}>
              <CarouselContent>
                {imageUrls.map((url: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square w-full">
                      <Image
                        src={url}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {imageUrls.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {imageUrls.map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === current
                            ? 'bg-white'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </Carousel>
          </div>
        ) : (
          <Image
            src="/images/placeholders/product-placeholder.jpg"
            alt={product.name || '商品画像'}
            fill
            className="object-cover rounded-md"
            priority
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">{product.name}</h3>
        <p className={`text-lg font-semibold text-right ${isSoldOut ? 'text-gray-400' : ''}`}>
          {formatPrice(selectedVariation?.price || product.price)}円
        </p>
      </div>

      {product.description && (
        <p className="text-sm text-gray-500">{product.description}</p>
      )}

      {hasVariations && (
        <div className="space-y-2">
          <label htmlFor="variation" className="text-sm font-medium">
            バリエーション
          </label>
          <select
            id="variation"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={selectedVariation?.id || ''}
            onChange={(e) => {
              const selected = product.variations.find(v => v.id === e.target.value);
              setSelectedVariation(selected || null);
            }}
          >
            <option value="">選択してください</option>
            {product.variations.map((variation) => {
              const priceDiff = variation.price - product.price;
              return (
                <option
                  key={variation.id}
                  value={variation.id}
                >
                  {variation.name}
                  {priceDiff !== 0 ? ` (+${formatPrice(priceDiff)}円)` : ''}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-end items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-medium whitespace-nowrap">
            注文数
          </label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={10}
            className="w-20"
            disabled={isSoldOut}
          />
        </div>

        <Button
          onClick={() => onAddToCart({
            id: selectedVariation?.id || product.id,
            name: `${product.name}${selectedVariation ? ` - ${selectedVariation.name}` : ''}`,
            price: selectedVariation?.price || product.price,
            quantity,
          })}
          className="w-full"
          disabled={!canAddToCart}
        >
          {isSoldOut ? '売り切れ' : 'カートに追加'}
        </Button>
      </div>
    </div>
  );
}

