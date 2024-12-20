// 決済中継処理（決済後にリダイレクトされるページ。問題なければ完了ページへ、問題あればエラーページへ自動遷移）
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { LoadingAnimation } from '@/components/ui/loading-animation';

export default function CheckoutCheckPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Square Payment Formからのパラメータを取得
        const checkoutId = searchParams.get('checkoutId');
        const status = searchParams.get('status');

        if (!checkoutId || !status) {
          throw new Error('必要なパラメータが不足しています');
        }

        // statusはcheckout.complete（成功）またはcheckout.cancelled（キャンセル）
        if (status === 'checkout.complete') {
          router.push('/cart/complete');
        } else {
          throw new Error('決済が完了しませんでした');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: 'エラーが発生しました',
          description: error instanceof Error ? error.message : '決済の確認中にエラーが発生しました',
          variant: 'destructive',
        });
        router.push('/cart/error');
      }
    };

    checkPaymentStatus();
  }, [router, searchParams, toast]);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <LoadingAnimation />
      <p className="mt-4 text-lg">決済結果を確認しています...</p>
    </div>
  );
}
