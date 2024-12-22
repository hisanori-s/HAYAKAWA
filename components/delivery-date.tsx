import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, Clock, Truck, AlertCircle } from 'lucide-react'

export function DeliveryDate() {
  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light tracking-tight mb-8">お届けについて</h1>

      {/* 重要なお知らせ */}
      <Card className="mb-8 border-2 border-primary bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            配送に関する重要なお知らせ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-disc list-inside text-sm">
            <li>最短でのお届けを実現するため、配送日時のご指定はできかねます</li>
            <li>商品はクール便でお届けいたします</li>
            <li>お受け取りが難しい日時がございましたら、必ず事前にお知らせくださいませ</li>
            <li>ご注文の際は消費期限を考慮した上でご検討をお願いいたします</li>
          </ul>
        </CardContent>
      </Card>

      {/* 出荷スケジュール */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            出荷スケジュール
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm">通常注文の場合、ご注文日翌日から数えて3営業日以内に出荷を行います</p>
            <div className="pl-4 border-l-2 border-primary/20 space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">ジビエ肉などの特殊食材を使用する商品について</p>
                <p className="text-sm text-muted-foreground">調達に時間を要する場合がございます。これらの商品については、通常より出荷までにお時間をいただく可能性がございます。</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">最高品質の餃子をお届けするために</p>
                <p className="text-sm text-muted-foreground">一般的な店舗より準備に時間を要します。パーティーなど、特定の日までに商品をご希望の場合は、2週間以上前からのご注文をお勧めいたします。</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 消費期限について */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            消費期限について
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm font-medium">商品は製造日から4日以内にお召し上がりください</p>
            <div className="bg-destructive/10 p-4 rounded-lg space-y-2">
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>重要な注意事項</span>
              </p>
              <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
                <li>消費期限を過ぎた商品は腐敗の可能性がございますので、必ず廃棄してください</li>
                <li>冷凍保存をしても消費期限は変わりません。品質・衛生面から冷凍保存は絶対におやめください</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* お届け日の調整について */}
      <Card className="mb-8 bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            お届け日の調整について
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>ご注文日から7日以上先の発送となる場合、到着希望日から逆算した発送日のリクエストを承ります。</p>
            <p>店舗の都合により、ご希望の発送日に対応できない場合は、メールにてご連絡の上、全額返金させていただきます。</p>
            <p className="font-medium">上記以外での注文確定後のキャンセルにつきましては、承っておりません（商品代金・送料を含め、一切返金いたしかねます）</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

