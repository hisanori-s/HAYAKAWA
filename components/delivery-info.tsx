export function DeliveryInfo() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">配送料について</h2>
      <p className="mb-4">当店の配送料金は以下の通りです：</p>
      <ul className="list-disc list-inside mb-4">
        <li>3,000円以上のご注文：無料</li>
        <li>3,000円未満のご注文：全国一律500円</li>
      </ul>
      <p>※離島・一部地域は追加料金がかかる場合があります。</p>
    </div>
  )
}

