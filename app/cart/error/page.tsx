'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CheckoutErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const referenceId = searchParams.get('referenceId');
  const status = searchParams.get('status');
  const errorMessage = searchParams.get('error');
  const isTestMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox';
  const [showErrorUI, setShowErrorUI] = useState(true);

  // デバッグ情報をコンソールに出力
  console.log('Square error parameters:', {
    searchParams: Object.fromEntries(searchParams.entries()),
    orderId,
    referenceId,
    status,
    errorMessage
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* デバッグパネル */}
      {isTestMode && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="debug">
            <AccordionTrigger>デバッグ情報</AccordionTrigger>
            <AccordionContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>実際のステータス: {status}</p>
                <p>本来の表示: エラーUI</p>
                <Button
                  onClick={() => setShowErrorUI(!showErrorUI)}
                  variant="outline"
                  className="mt-2"
                >
                  {showErrorUI ? '成功UIを表示' : 'エラーUIを表示'}
                </Button>
                <dl className="mt-4 grid grid-cols-2 gap-2">
                  <dt className="text-gray-600">Order ID:</dt>
                  <dd className="font-mono">{orderId || 'なし'}</dd>
                  <dt className="text-gray-600">Reference ID:</dt>
                  <dd className="font-mono">{referenceId || 'なし'}</dd>
                  <dt className="text-gray-600">Status:</dt>
                  <dd className="font-mono">{status || 'なし'}</dd>
                  <dt className="text-gray-600">Error:</dt>
                  <dd className="font-mono break-all">{errorMessage || 'なし'}</dd>
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* メインコンテンツ */}
      {showErrorUI ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold text-red-600 mb-4">決済処理に失敗しました</h1>
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              申し訳ありませんが、決済処理中にエラーが発生しました。<br />
              もう一度お試しいただくか、しばらく時間をおいてからお試しください。
            </p>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-800 text-sm">エラー詳細: {errorMessage}</p>
              </div>
            )}
          </div>
          <Button
            onClick={() => router.push('/cart')}
            className="bg-primary hover:bg-primary/90"
          >
            カートに戻る
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold text-green-600 mb-4">決済完了</h1>
          <p className="text-gray-600 mb-8">
            ご注文ありがとうございます。決済が正常に完了しました。
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90"
          >
            トップページに戻る
          </Button>
        </div>
      )}
    </div>
  );
}
