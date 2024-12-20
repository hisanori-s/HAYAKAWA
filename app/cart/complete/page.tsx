'use client';

import { useSearchParams } from 'next/navigation';

export default function CheckoutCompletePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const isTestMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox';

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="mt-8 space-x-4">
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
