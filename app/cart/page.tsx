'use client';

import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CartItems } from '@/components/cart/cart-items';

export default function CartPage() {
  const { items } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
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
        description: 'チェックアウトに失敗しま�。もう一度お試しください。',
        variant: 'destructive',
      });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">カート</h1>
        <Link href="/">
          <Button variant="outline">商品一覧に戻る</Button>
        </Link>
      </div>
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
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  処理中...
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
