'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useCartStore } from '@/lib/store/cart';

export default function CheckoutCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const checkoutResult = searchParams.get('result');
    const errorMessage = searchParams.get('error');

    if (checkoutResult === 'success') {
      // カートをクリア
      clearCart();

      // 成功メッセージを表示
      toast({
        title: '決済完了',
        description: 'ご注文ありがとうございます。',
      });

      // 完了ページへリダイレクト
      router.push('/cart/complete');
    } else if (errorMessage) {
      // エラーメッセージを表示
      toast({
        title: 'エラー',
        description: errorMessage || '決済の確認中にエラーが発生しました',
        variant: 'destructive',
      });

      // カートページへリダイレクト
      router.push('/cart');
    }
  }, [searchParams, router, clearCart, toast]);

  return null;
}
