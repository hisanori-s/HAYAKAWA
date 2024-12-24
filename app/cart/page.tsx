'use client';

import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, AlertTriangle, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DEFAULT_MAX_ORDER_QUANTITY } from '@/lib/constants/order';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore((state) => ({
    items: state.items,
    updateQuantity: state.updateQuantity,
    removeItem: state.removeItem
  }));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
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

  // 小計の計算
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // 消費税の計算（10%）
  const tax = Math.floor(subtotal * 0.1);
  // 合計金額の計算
  const total = subtotal + tax;

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

  // 初回ロード時の全体在庫チェック
  useEffect(() => {
    const checkInitialInventory = async () => {
      const hasItemsRequiringInventory = items.some(item => item.requiresInventory);
      setNeedsInventoryCheck(hasItemsRequiringInventory);

      if (hasItemsRequiringInventory) {
        setIsValidatingInventory(true);
        try {
          await fetchInventoryItems();
        } finally {
          setIsValidatingInventory(false);
        }
      } else {
        setInventoryError(null);
        setIsValidatingInventory(false);
      }
    };

    const isInitialLoad = !inventoryItems.length && items.some(item => item.requiresInventory);
    if (isInitialLoad) {
      void checkInitialInventory();
    }
  }, [items, fetchInventoryItems, inventoryItems]); // 必要な依存配列を追加

  // 在庫管理対象商品の数量変更監視
  useEffect(() => {
    // 初回ロード時は実行しない
    if (!inventoryItems.length) return;

    // 在庫管理対象商品の数量変更のみを監視
    const hasInventoryItemChanged = items
      .filter(item => item.requiresInventory)
      .some(item => {
        const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
        // 在庫情報がまだ取得されていない場合はスキップ
        if (!inventoryItem) return false;
        // 現在の注文数と在庫数を比較
        return item.quantity !== inventoryItem.variations[0]?.inventoryCount;
      });

    if (hasInventoryItemChanged) {
      setIsValidatingInventory(true);
      void fetchInventoryItems().finally(() => {
        setIsValidatingInventory(false);
      });
    }
  }, [items, inventoryItems, fetchInventoryItems]);

  // 数量変更のハンドラー
  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  }, [updateQuantity]);

  // 在庫情報が更新されたときのエラーチェック
  useEffect(() => {
    if (!items.some(item => item.requiresInventory)) {
      setInventoryError(null);
      return;
    }

    if (inventoryItems.length === 0) return;

    // キャッシュされた在庫情報を使用してチェック
    const invalidItems = items
      .filter(item => item.requiresInventory)
      .filter(item => {
        const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
        const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
        return currentStock < item.quantity;
      })
      .map(item => {
        const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
        const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
        return {
          item,
          availableQuantity: currentStock
        };
      });

    if (invalidItems.length > 0) {
      const errorMessage = invalidItems
        .map(({ item, availableQuantity }) =>
          `${item.name}: 在庫数 ${availableQuantity}個（注文数 ${item.quantity}個）`
        )
        .join('\n');
      setInventoryError(`以下の商品の在庫が不足しています：\n${errorMessage}\n数量を調整してください。`);
    } else {
      setInventoryError(null);
    }
  }, [items, inventoryItems]);

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
      throw error; // エラーを再スローして上位ハンドラーでも処理できるようにする
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
    <div className="container mx-auto px-4 py-8 relative">
      {/* 初回在庫チェック中のオーバーレイ */}
      {isValidatingInventory && !inventoryItems.length && (
        <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-gray-700">在庫確認中...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">ショッピングカート</h1>
      <p className="text-gray-600 mb-8">{items.length}点の商品</p>

      {inventoryError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="whitespace-pre-wrap">{inventoryError}</div>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            // 在庫不足かどうかをチェック
            const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
            const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
            const isOutOfStock = item.requiresInventory && currentStock < item.quantity;

            // 商品の最大注文可能数を計算
            const maxOrderQuantity = item.requiresInventory
              ? Math.min(currentStock || DEFAULT_MAX_ORDER_QUANTITY, DEFAULT_MAX_ORDER_QUANTITY)
              : DEFAULT_MAX_ORDER_QUANTITY;

            return (
              <Card
                key={item.id}
                className={`p-4 ${isOutOfStock ? 'bg-red-50 border-red-200' : ''}`}
                data-inventory-check={item.requiresInventory}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.price}円</p>
                    {item.requiresInventory && (
                      <p className="text-xs text-gray-500">
                        在庫数: {currentStock}個
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newQuantity = Math.max(1, item.quantity - 1);
                        handleQuantityChange(item.id, newQuantity);
                      }}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newQuantity = item.quantity + 1;
                        const maxQuantity = item.requiresInventory ? maxOrderQuantity : DEFAULT_MAX_ORDER_QUANTITY;
                        if (newQuantity <= maxQuantity) {
                          handleQuantityChange(item.id, newQuantity);
                        }
                      }}
                      disabled={item.quantity >= (item.requiresInventory ? maxOrderQuantity : DEFAULT_MAX_ORDER_QUANTITY)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div>
          <Card className="p-4 sticky top-4">
            <h2 className="font-medium mb-4">注文内容</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>小計</span>
                <span>{subtotal.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>消費税 (10%)</span>
                <span>{tax.toLocaleString()}円</span>
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-medium">
                  <span>合計</span>
                  <span>{total.toLocaleString()}円</span>
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
                '注文手続きへ進む'
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              安全な決済システムで処理されます
            </p>
          </Card>
        </div>
      </div>

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
    </div>
  );
}
