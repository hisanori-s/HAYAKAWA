export function DeliveryDate() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">お届け日について</h2>
      <p className="mb-4">ご注文いただいた商品は、以下のスケジュールでお届けいたします：</p>
      <ul className="list-disc list-inside mb-4">
        <li>平日14時までのご注文：翌営業日出荷</li>
        <li>平日14時以降のご注文：翌々営業日出荷</li>
        <li>土日祝日のご注文：翌営業日出荷</li>
      </ul>
      <p>※天候や交通状況により、お届けが遅れる場合があります。</p>
    </div>
  )
}

