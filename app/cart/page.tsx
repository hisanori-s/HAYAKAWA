'use client';

import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CartItems } from '@/components/cart/cart-items';
import { useSearchParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from '@/components/cart/cart-provider';

export default function CartPage() {
  const { items } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { handleAddToCart } = useCart();
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<Array<{
    id: string;
    name: string;
    variations: Array<{
      id: string;
      name: string;
      trackInventory: boolean;
      soldOut: boolean;
      inventoryCount: number;
    }>;
  }>>([]);
  const [needsInventoryCheck, setNeedsInventoryCheck] = useState(false);
  const [isValidatingInventory, setIsValidatingInventory] = useState(false);

  // 在庫管理商品の情報を取得する関数
  const fetchInventoryItems = useCallback(async () => {
    const itemsRequiringInventory = items.filter(item => item.requiresInventory);
    if (itemsRequiringInventory.length === 0) {
      setInventoryItems([]);
      return null;
    }

    setIsValidatingInventory(true);
    try {
      const response = await fetch('/api/square/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          catalogItemVariationIds: itemsRequiringInventory.map(item => item.id)
        })
      });

      if (!response.ok) {
        throw new Error('在庫情報の取得に失敗しました');
      }

      const { counts } = await response.json();
      console.log('Fetched inventory:', counts); // デバッグ用

      // 在庫情報をマップに変換
      const inventoryMap = counts.reduce((acc: { [key: string]: number }, count: { catalogObjectId: string; quantity: number }) => {
        acc[count.catalogObjectId] = count.quantity;
        return acc;
      }, {});

      const inventoryItemsData = itemsRequiringInventory.map(item => ({
        id: item.id,
        name: item.name,
        variations: [{
          id: item.id,
          name: item.name,
          trackInventory: item.requiresInventory,
          soldOut: (inventoryMap[item.id] ?? 0) === 0,
          inventoryCount: inventoryMap[item.id] ?? 0
        }]
      }));
      console.log('Processed inventory items:', inventoryItemsData); // デバッグ用
      setInventoryItems(inventoryItemsData);
      return inventoryMap;
    } catch (error) {
      console.error('Inventory fetch error:', error);
      toast({
        title: 'エラー',
        description: '在庫情報の取得に失敗しました',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsValidatingInventory(false);
    }
  }, [items, toast]);

  // ページロード時に在庫確認の必要性を判定し、必要な場合は在庫確認を実行
  useEffect(() => {
    const checkInventoryOnLoad = async () => {
      const hasItemsRequiringInventory: boolean = items.some(item => item.requiresInventory);
      setNeedsInventoryCheck(hasItemsRequiringInventory);

      if (hasItemsRequiringInventory) {
        const inventoryMap = await fetchInventoryItems();
        if (inventoryMap) {
          // 在庫不足のアイテムをチェック
          const invalidItems = items
            .filter(item => item.requiresInventory)
            .filter(item => {
              const stock = inventoryMap[item.id] ?? 0;
              return stock < item.quantity;
            })
            .map(item => ({
              item,
              availableQuantity: inventoryMap[item.id] ?? 0
            }));

          if (invalidItems.length > 0) {
            const errorMessage = invalidItems
              .map(({ item, availableQuantity }) =>
                `${item.name}: 在庫数 ${availableQuantity}個（注文数 ${item.quantity}個）`
              )
              .join('\n');
            setInventoryError(`以下の商品の在庫が不足しています：\n${errorMessage}\n数量を調整してください。`);
          } else {
            // 在庫が十分にある場合はエラーをクリア
            setInventoryError(null);
          }
        }
      } else {
        // 在庫管理対象商品がない場合はエラーをクリア
        setInventoryError(null);
      }
    };

    void checkInventoryOnLoad();
  }, [items, fetchInventoryItems, toast]);

  // エラーメッセージの確認と表示
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast({
        title: 'エラー',
        description: decodeURIComponent(error),
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!needsInventoryCheck) {
      // 在庫確認が不要な場合は直接チェックアウトへ
      await proceedToCheckout();
      return;
    }

    try {
      setIsLoading(true);
      setInventoryError(null);

      // 最新の在庫情報を取得
      const inventoryMap = await fetchInventoryItems();
      if (!inventoryMap) {
        throw new Error('在庫情報の取得に失敗しました');
      }

      // 在庫不足のアイテムをチェック
      const invalidItems = items
        .filter(item => item.requiresInventory)
        .filter(item => {
          const stock = inventoryMap[item.id] ?? 0;
          return stock < item.quantity;
        })
        .map(item => ({
          item,
          availableQuantity: inventoryMap[item.id] ?? 0
        }));

      if (invalidItems.length > 0) {
        const errorMessage = invalidItems
          .map(({ item, availableQuantity }) =>
            `${item.name}: 在庫数 ${availableQuantity}個（注文数 ${item.quantity}個）`
          )
          .join('\n');
        setInventoryError(`以下の商品の在庫が不足しています：\n${errorMessage}\n数量を調整してください。`);
        return;
      }

      await proceedToCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'チェックアウトに失敗しました。もう一度お試しください。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/square/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('チェックアウトに失敗しました');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'チェックアウトに失敗しました。もう一度お試しください。',
        variant: 'destructive',
      });
      throw error; // エラーを再スローして上位のハンドラーでも処理できるようにする
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">カート</h1>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">カートに商品がありません</p>
          <Link href="/">
            <Button>商品一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* デバッグ情報 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="debug-info">
              <AccordionTrigger className="bg-gray-100 p-4 rounded-t">
                <h3 className="font-bold">カートデバッグ情報</h3>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-100 p-4 rounded-b">
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">カート内容:</h4>
                    <pre className="text-xs overflow-auto bg-white p-2 rounded">
                      {JSON.stringify(items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        hasVariations: item.hasVariations,
                        requiresInventory: item.requiresInventory,
                        maxStock: item.maxStock,
                      })), null, 2)}
                    </pre>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">在庫管理商品情報:</h4>
                    <pre className="text-xs overflow-auto bg-white p-2 rounded">
                      {JSON.stringify(inventoryItems, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">在庫確認状態:</h4>
                    <pre className="text-xs overflow-auto bg-white p-2 rounded">
                      {JSON.stringify({
                        needsInventoryCheck,
                        isValidatingInventory,
                        hasInventoryError: !!inventoryError
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">カート</h1>
        <Link href="/">
          <Button variant="outline">商品一覧に戻る</Button>
        </Link>
      </div>

      {inventoryError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="whitespace-pre-wrap">{inventoryError}</div>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CartItems />
        </div>
        <div>
          <Card className="p-4 sticky top-4">
            <h2 className="font-medium mb-4">注文内容</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity}円</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-medium">
                  <span>合計</span>
                  <span>{total}円</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  (税込)
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleCheckout}
              disabled={isLoading || isValidatingInventory || !!inventoryError}
            >
              {isLoading || isValidatingInventory ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isValidatingInventory ? '在庫確認中...' : '処理中...'}
                </>
              ) : (
                '注文手続きへ'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
