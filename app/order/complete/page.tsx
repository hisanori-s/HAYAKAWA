'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

export default function OrderCompletePage() {
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-4">ご注文ありがとうございます</h1>
        <p className="text-center text-gray-600 mb-6">
          ご注文の確認メールをお送りしました。
          商品の発送準備が整い次第、発送のご連絡をさせていただきます。
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button>トップページへ戻る</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
