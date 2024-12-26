/**
 * メール関連の定数定義
 */

export const EMAIL_MESSAGES = {
  RECEIPT: {
    TITLE: '電子レシートについて',
    DESCRIPTION: '決済完了時に電子レシートが登録済みのメールアドレスに発行されます。',
    NOTICE: '※送信まで少し時間がかかる場合があります。',
    SENDER: '送信元アドレス: messenger@messaging.squareup.com'
  },
  AUTO_REPLY: {
    SUBJECT: 'ご注文ありがとうございます',
    BODY: `この度はご注文いただき、誠にありがとうございます。

ご注文内容の確認メールを送信させていただきました。
Square決済システムより、別途電子レシートが発行されます。

商品の発送準備が整い次第、改めてご連絡させていただきます。

※このメールは自動送信されています。
※本メールに返信いただいてもお答えできない場合がございます。

------------------
早川餃子
https://hayakawa-gyoza.com/
otoiawase@hayakawa-gyoza.com
------------------`
  }
} as const;
