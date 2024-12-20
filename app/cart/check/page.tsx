'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useCartStore } from '@/lib/store/cart';
import { type Toast } from '@/components/ui/use-toast';

export default function CheckoutCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // すべてのクエリパラメータをログ出力
    const params = Object.fromEntries(searchParams.entries());
    console.log('Checkout completion parameters:', params);

    const checkPaymentStatus = () => {
      try {
        // Square Payment Formからのパラメータを取得
        const orderId = searchParams.get('orderId');
        const checkoutId = searchParams.get('checkoutId');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('error_message');

        // エラーチェック
        if (error || errorMessage) {
          throw new Error(errorMessage || error || '決済処理中にエラーが発生しました');
        }

        // 必須パラメータの存在チェック
        if (!orderId && !checkoutId) {
          throw new Error('注文情報が見つかりません');
        }

        // 決済成功時の処理
        clearCart();
        toast({
          title: '決済完了',
          description: 'ご注文ありがとうございます。',
        } as Toast);

        // 完了ページへリダイレクト
        router.push(`/cart/complete?orderId=${orderId}`);

      } catch (error) {
        console.error('Payment verification error:', error);

        // エラーメッセージをトースト表示
        toast({
          title: 'エラーが発生しました',
          description: error instanceof Error ? error.message : '決済の確認中にエラーが発生しました',
          variant: 'destructive',
        } as Toast);

        // カートページへリダイレクト（エラーメッセージ付き）
        router.push(`/cart?error=${encodeURIComponent(error instanceof Error ? error.message : '決済エラー')}`);
      }
    };

    checkPaymentStatus();
  }, [router, searchParams, toast, clearCart]);

  // ローディング表示
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">決済結果を確認しています...</p>
      </div>
    </div>
  );
}
