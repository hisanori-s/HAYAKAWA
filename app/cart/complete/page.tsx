'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CheckoutCompletePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const referenceId = searchParams.get('referenceId');
  const status = searchParams.get('status');
  const isTestMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox';
  const [showSuccessUI, setShowSuccessUI] = useState(status === 'ok');

  // デバッグ情報をコンソールに出力
  console.log('Square redirect parameters:', {
    searchParams: Object.fromEntries(searchParams.entries()),
    orderId,
    referenceId,
    status
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* デバッグパネル */}
      {isTestMode && (
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="debug">
            <AccordionTrigger>デバッグ情報</AccordionTrigger>
            <AccordionContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>実際のステータス: {status}</p>
                <p>本来の表示: {status === 'ok' ? '成功UI' : 'エラーUI'}</p>
                <Button
                  onClick={() => setShowSuccessUI(!showSuccessUI)}
                  variant="outline"
                  className="mt-2"
                >
                  {showSuccessUI ? 'エラーUIを表示' : '成功UIを表示'}
                </Button>
                <dl className="mt-4 grid grid-cols-2 gap-2">
                  <dt className="text-gray-600">Order ID:</dt>
                  <dd className="font-mono">{orderId || 'なし'}</dd>
                  <dt className="text-gray-600">Reference ID:</dt>
                  <dd className="font-mono">{referenceId || 'なし'}</dd>
                  <dt className="text-gray-600">Status:</dt>
                  <dd className="font-mono">{status || 'なし'}</dd>
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* メインコンテンツ */}
      {showSuccessUI ? (
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

              <dt className="text-gray-600">参照ID</dt>
              <dd className="font-mono">{referenceId}</dd>

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
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          トップページに戻る
        </a>
      </div>
    </div>
  );
}
