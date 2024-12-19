'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cart';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function OrderCompletePage() {
  const clearCart = useCartStore((state) => state.clearCart);

  // カートをクリア
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">ご注文ありがとうございます</h1>
          <div className="text-gray-600 mb-8 space-y-2">
            <p>注文が正常に完了しました。</p>
            <p>ご注文内容の確認メールをお送りしましたので、ご確認ください。</p>
            <p>商品の発送準備が整い次第、発送のご連絡をさせていただきます。</p>
          </div>
          <Link href="/">
            <Button size="lg">
              商品一覧に戻る
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
