// 決済中継処理（決済後にリダイレクトされるページ。問題なければ完了ページへ、問題あればエラーページへ自動遷移）
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { useCartStore } from '@/lib/store/cart';

export default function CheckoutCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // すべてのクエリパラメータをログ出力
        const params = Object.fromEntries(searchParams.entries());
        console.log('All URL parameters:', params);

        // Square Payment Formからのパラメータを取得
        const orderId = searchParams.get('orderId');
        const checkoutId = searchParams.get('checkoutId');
        const referenceId = searchParams.get('referenceId');
        const transactionId = searchParams.get('transactionId');
        const status = searchParams.get('status');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('error_message');

        console.log('Payment status check:', {
          orderId,
          checkoutId,
          referenceId,
          transactionId,
          status,
          error,
          errorMessage,
          currentUrl: window.location.href
        });

        // エラーチェック
        if (error || errorMessage) {
          throw new Error(`決済エラー: ${errorMessage || error || '不明なエラー'}`);
        }

        // 注文IDまたはチェックアウトIDのいずれかが必要
        if (!orderId && !checkoutId) {
          throw new Error('注文情報が見つかりません');
        }

        // ステータスの確認
        if (status === 'ok' || transactionId) {
          // 決済成功時はカートをクリア
          clearCart();
          router.push('/cart/complete');
        } else if (status === 'cancelled') {
          throw new Error('決済がキャンセルされました');
        } else {
          console.error('Unexpected state:', { status, transactionId });
          throw new Error('決済の状態が不明です');
        }
      } catch (error) {
        console.error('Payment verification error:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });

        toast({
          title: 'エラーが発生しました',
          description: error instanceof Error ? error.message : '決済の確認中にエラーが発生しました',
          variant: 'destructive',
        });

        // エラー時はカートページに戻る
        router.push('/cart');
      }
    };

    checkPaymentStatus();
  }, [router, searchParams, toast, clearCart]);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <LoadingAnimation />
      <p className="mt-4 text-lg">決済結果を確認しています...</p>
    </div>
  );
}
