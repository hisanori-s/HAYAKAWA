'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CheckoutDonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);
  const isTestMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox';

  // Square Checkoutからのパラメータを取得
  const transactionId = searchParams.get('transactionId');
  const orderId = searchParams.get('orderId');
  const isSuccess = transactionId && orderId;

  // デバッグ情報をコンソールに出力（開発時のみ）
  if (isTestMode) {
    console.log('Square redirect parameters:', {
      searchParams: Object.fromEntries(searchParams.entries()),
      transactionId,
      orderId
    });
  }

  useEffect(() => {
    if (isSuccess) {
      // 成功時の処理
      clearCart();
      toast({
        title: '決済完了',
        description: 'ご注文ありがとうございます。',
      });
    }
  }, [isSuccess, clearCart, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* デバッグパネル - テストモード時のみ表示 */}
      {isTestMode && (
        <Accordion type="single" collapsible className="mb-4 max-w-2xl mx-auto">
          <AccordionItem value="debug">
            <AccordionTrigger>デバッグ情報</AccordionTrigger>
            <AccordionContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="grid grid-cols-2 gap-2">
                  <dt className="text-gray-600">Transaction ID:</dt>
                  <dd className="font-mono">{transactionId || 'なし'}</dd>
                  <dt className="text-gray-600">Order ID:</dt>
                  <dd className="font-mono">{orderId || 'なし'}</dd>
                  <dt className="text-gray-600">ステータス:</dt>
                  <dd className="font-mono">{isSuccess ? '成功' : 'エラー'}</dd>
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="max-w-2xl mx-auto">
        {isSuccess ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              決済完了 {isTestMode ? '(テストモード)' : ''}
            </h1>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                ご注文ありがとうございます。決済が正常に完了しました。
                {isTestMode && (
                  <span className="block text-sm mt-2 text-gray-600">
                    ※これはテスト環境での決済です。実際の請求は発生しません。
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">注文情報</h2>
              <dl className="grid grid-cols-2 gap-4">
                <dt className="text-gray-600">注文ID</dt>
                <dd className="font-mono">{orderId}</dd>

                <dt className="text-gray-600">注文ステータス</dt>
                <dd className="font-semibold text-green-600">COMPLETED</dd>

                {isTestMode && (
                  <>
                    <dt className="text-gray-600">テストモード</dt>
                    <dd className="text-amber-600">Sandbox Environment</dd>
                  </>
                )}
              </dl>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">決済処理に失敗しました</h1>
            <p className="text-gray-600 mb-8">
              申し訳ありませんが、決済処理中にエラーが発生しました。<br />
              もう一度お試しいただくか、しばらく時間をおいてからお試しください。
            </p>
          </div>
        )}

        <div className="mt-8 space-x-4 text-center">
          <Button
            onClick={() => router.push(isSuccess ? '/' : '/cart')}
            className="bg-primary hover:bg-primary/90"
          >
            {isSuccess ? 'トップページに戻る' : 'カートに戻る'}
          </Button>
        </div>
      </div>
    </div>
  );
}
