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
import { DefaultMaxOrderQuantity } from '@/lib/constants/order';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    isValidatingInventory,
    inventoryError,
    inventoryItems,
    validateInventory
  } = useCartStore((state) => ({
    items: state.items,
    updateQuantity: state.updateQuantity,
    removeItem: state.removeItem,
    isValidatingInventory: state.isValidatingInventory,
    inventoryError: state.inventoryError,
    inventoryItems: state.inventoryItems,
    validateInventory: state.validateInventory
  }));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // 小計の計算
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // 消費税の計算（10%）
  const tax = Math.floor(subtotal * 0.1);
  // 合計金額の計算
  const total = subtotal + tax;

  // 初回ロウント時の在庫確認
  useEffect(() => {
    // 初回ページロード時のみ在庫確認を実行（在庫数を超える注文が存在するかの確認）
    const hasItemsRequiringInventory = items.some(item => item.requiresInventory);
    const isInitialLoad = !inventoryItems.length;
    if (hasItemsRequiringInventory && !isValidatingInventory && isInitialLoad) {
      void validateInventory();
    }
  }, [items, isValidatingInventory, inventoryItems.length, validateInventory]);

  // 数量変更のハンドラー
  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const inventoryItem = inventoryItems.find(inv => inv.id === itemId);
    const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
    const isCurrentlyOverStock = item.requiresInventory && item.quantity > currentStock;

    updateQuantity(itemId, newQuantity);

    // ローカルでの在庫状態チェック
    const hasInventoryIssue = items.some(cartItem => {
      if (!cartItem.requiresInventory) return false;
      const inv = inventoryItems.find(i => i.id === cartItem.id);
      const stock = inv?.variations[0]?.inventoryCount ?? 0;
      return stock === 0 || (cartItem.id === itemId ? newQuantity > stock : cartItem.quantity > stock);
    });

    if (!hasInventoryIssue) {
      // 在庫に問題がなければエラー状態をクリア
      useCartStore.setState({ inventoryError: null });
    } else if (isCurrentlyOverStock && !isValidatingInventory) {
      // 在庫オーバー状態の場合は従来通り在庫確認を実行
      void validateInventory();
    }
  }, [items, updateQuantity, validateInventory, isValidatingInventory, inventoryItems]);

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
    const hasItemsRequiringInventory = items.some(item => item.requiresInventory);
    if (!hasItemsRequiringInventory) {
      // 在庫確認が不要な場合は直接チェックアウトへ
      await proceedToCheckout();
      return;
    }

    try {
      setIsLoading(true);
      // 最新の在庫情報を取得
      await validateInventory();

      // エラーがなければチェックアウトへ進む
      if (!inventoryError) {
        await proceedToCheckout();
      }
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
        description: error instanceof Error ? error.message : 'チェックアウトに失敗��ました。もう一度お試しください。',
        variant: 'destructive',
      });
      throw error; // エラーを再スローして上位ハンドラーでも処理できるようにする
    } finally {
      setIsLoading(false);
    }
  };

  // 商品削除のハンドラー
  const handleRemoveItem = useCallback((itemId: string) => {
    removeItem(itemId);

    // 削除後の在庫状態チェック
    const hasInventoryIssue = items
      .filter(item => item.id !== itemId) // 削除する商品を除外
      .some(cartItem => {
        if (!cartItem.requiresInventory) return false;
        const inv = inventoryItems.find(i => i.id === cartItem.id);
        const stock = inv?.variations[0]?.inventoryCount ?? 0;
        return stock === 0 || cartItem.quantity > stock;
      });

    if (!hasInventoryIssue) {
      // 在庫に問題がなければエラー状態をクリア
      useCartStore.setState({ inventoryError: null });
    }
  }, [items, removeItem, inventoryItems]);

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
      {isValidatingInventory && (
        <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-gray-700">在庫確認中...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">ショッピングカート</h1>
      <p className="text-gray-600 mb-8">{items.length}点の商品</p>

      {items.some(item => {
        const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
        const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
        return item.requiresInventory && (currentStock === 0 || currentStock < item.quantity);
      }) && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <div>以下の商品は在庫の在庫数に変更がありました。お手数ですがご注文数の調整をお願いいたします：</div>
              <ul className="list-disc ml-6 mt-2">
                {items.map(item => {
                  const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
                  const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
                  const isOutOfStock = item.requiresInventory && currentStock === 0;
                  const isQuantityExceed = item.requiresInventory && currentStock > 0 && currentStock < item.quantity;

                  if (isOutOfStock || isQuantityExceed) {
                    return (
                      <li key={item.id}>
                        {item.name}：
                        {isOutOfStock
                          ? '在庫切れのため、カートから削除してください。'
                          : `在庫数が${currentStock}個となりました。在庫数以下に数量を調整してください。`}
                      </li>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            // 在庫不足かどうかをチェック
            const inventoryItem = inventoryItems.find(inv => inv.id === item.id);
            const currentStock = inventoryItem?.variations[0]?.inventoryCount ?? 0;
            const isOutOfStock = item.requiresInventory && currentStock === 0;
            const isQuantityExceed = item.requiresInventory && currentStock > 0 && currentStock < item.quantity;

            // 商品の最大注文可能数を計算
            const maxOrderQuantity = item.requiresInventory
              ? Math.min(currentStock || DefaultMaxOrderQuantity, DefaultMaxOrderQuantity)
              : DefaultMaxOrderQuantity;

            return (
              <Card
                key={item.id}
                className={`p-4 ${(isOutOfStock || isQuantityExceed) ? 'bg-red-50 border-red-200' : ''}`}
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
                      disabled={isOutOfStock || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newQuantity = item.quantity + 1;
                        if (newQuantity <= maxOrderQuantity) {
                          handleQuantityChange(item.id, newQuantity);
                        }
                      }}
                      disabled={isOutOfStock || item.quantity >= maxOrderQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
