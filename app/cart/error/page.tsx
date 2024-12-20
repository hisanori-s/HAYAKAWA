'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CheckoutErrorPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold text-red-600 mb-4">決済処理に失敗しました</h1>
      <p className="text-gray-600 mb-8">
        申し訳ありませんが、決済処理中にエラーが発生しました。<br />
        もう一度お試しいただくか、しばらく時間をおいてからお試しください。
      </p>
      <Button
        onClick={() => router.push('/cart')}
        className="bg-primary hover:bg-primary/90"
      >
        カートに戻る
      </Button>
    </div>
  );
}
