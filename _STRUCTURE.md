# プロジェクト構造

## ディレクトリツリー
```tree
project-root/
├── .cursorrules
├── .editorconfig
├── .eslintrc.json
├── .git
├── .gitignore
├── .next
├── .vscode
├── .workbench
│   ├── SDKで画像IDからURL取得.md
│   ├── Square Checkout日本語化要件と実装ガイド.md
│   └── スクエアSDK.md
├── _DEVELOPMENT_LOG.md
├── _INSTRUCTION.md
├── _STRUCTURE.md
├── app
│   ├── api
│   │   ├── email
│   │   │   └── auto-reply
│   │   │       └── route.ts
│   │   └── square
│   │       ├── catalog
│   │       │   ├── api-routes.ts
│   │       │   └── route.ts
│   │       ├── checkout
│   │       │   └── route.ts
│   │       ├── env-check
│   │       │   └── route.ts
│   │       ├── image
│   │       │   ├── batch
│   │       │   │   └── route.ts
│   │       │   └── [id]
│   │       │       └── route.ts
│   │       ├── inventory
│   │       │   └── route.ts
│   │       └── test
│   │           └── route.ts
│   ├── cart
│   │   ├── done
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── cart
│   │   └── cart-provider.tsx
│   ├── payment
│   │   └── square-payment.tsx
│   ├── receipt
│   │   └── receipt-notice.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── loading-animation.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── use-toast.ts
│   ├── delivery-date.tsx
│   ├── delivery-info.tsx
│   ├── ec-page.tsx
│   ├── header.tsx
│   └── product-list.tsx
├── components.json
├── env
│   ├── .env.example
│   ├── .env.local.product
│   ├── .env.local.sandbox
│   └── .env.product
├── lib
│   ├── constants
│   │   ├── demo-products.ts
│   │   ├── email.ts
│   │   └── order.ts
│   ├── square
│   │   ├── client.ts
│   │   └── types.ts
│   ├── store
│   │   └── cart.ts
│   ├── square-utils.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.mjs
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── animations
│   │   └── loading-spinner.webm
│   └── images
│       ├── global
│       └── placeholders
│           └── product-placeholder.jpg
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── types
    └── dotlottie.d.ts
```

## 構造定義
```yaml
project:
  name: "Square EC Site"
  description: "Next.js App RouterとSquare APIを利用したECサイト"
  framework: "Next.js 14 (App Router)"
  dependencies:
    - "shadcn/ui: UIコンポーネントライブラリ"
    - "Square API SDK: 商品管理・決済処理"
    - "TypeScript: 型安全性の確保"
    - "Zustand: 状態管理"

project-root:
  app:
    api:
      email:
        "auto-reply/route.ts":
          content: "自動返信メール送信用のAPIエンドポイント"
          exports:
            - "POST /api/email/auto-reply: 注文確認の自動返信メールを送信"
          dependencies:
            - "@/lib/constants/email"

      square:
        "catalog/route.ts":
          dependencies:
            - "@/lib/square/client"
            - "@/lib/square/types"
        "checkout/route.ts":
          content: "Square Checkout APIを使用した決済処理エンドポイント"
          exports:
            - "POST /api/square/checkout: カタログ商品IDを使用した決済リンクの生成"
          dependencies:
            - "@/lib/square/client"
        "image/batch/route.ts":
          dependencies:
            - "@/lib/square/client"
        "inventory/route.ts":
          content: "Square Inventory APIを使用して在庫情報を取得するエンドポイント"
          exports:
            - "POST /api/square/inventory: 指定された商品IDの在庫情報を取得"
          dependencies:
            - "@/lib/square/client"

    cart:
      "page.tsx":
        content: |-
          カートページのメインコンポーネント
          - カート内商品の表示と操作機能
          - 商品の数量変更と削除
          - Square Checkoutへの遷移処理
        exports:
          - "CartPage | カート内商品の表示と操作機能を提供"
        dependencies:
          - "@/lib/store/cart"
          - "@/lib/square/client"
          - "@/lib/constants/order"
      "done/page.tsx":
        content: |-
          Square Checkout完了・エラー画面
          - トランザクションIDとオーダーIDに基づく成功判定
          - 成功/エラー時の適切なUI表示
          - 電子レシートと自動返信メールの案内表示
          - デバッグ情報の表示（テストモード時のみ）
        exports:
          - "CheckoutDonePage | 決済完了・エラー画面コンポーネント"
        dependencies:
          - "@/components/ui/button"
          - "@/lib/store/cart"
          - "@/lib/constants/email"

  components:
    cart:
      "cart-provider.tsx":
        content: "カートの状態管理とコンテキストプロバイダー"
        exports:
          - "useCart | カート操作用フック"
          - "CartProvider | カートコンテキストプロバイダー"
        dependencies:
          - "@/lib/store/cart"
          - "@/lib/square/client"

    payment:
      "square-payment.tsx":
        content: "Square決済処理コンポーネント"
        exports:
          - "SquarePayment | Square Checkout APIを使用した決済コンポーネント"
        dependencies:
          - "@/lib/square/client"

    receipt:
      "receipt-notice.tsx":
        content: "電子レシート通知コンポーネント"
        exports:
          - "ReceiptNotice | 電子レシートと自動返信メールの案内を表示"
        dependencies:
          - "@/lib/constants/email"
          - "@/components/ui/card"

    ui:
      "accordion.tsx": {}
      "button.tsx": {}
      "card.tsx": {}
      "carousel.tsx": {}
      "dialog.tsx": {}
      "input.tsx": {}
      "loading-animation.tsx": {}
      "tabs.tsx": {}
      "toast.tsx": {}
      "toaster.tsx": {}
      "use-toast.ts":
        exports:
          - "useToast"

    "delivery-date.tsx": {}
    "delivery-info.tsx": {}
    "ec-page.tsx":
      dependencies:
        - "@/components/product-list"
    "header.tsx": {}
    "product-list.tsx":
      content: "商品一覧表示コンポーネント"
      exports:
        - "ProductList | 商品一覧と商品詳細を表示"
      dependencies:
        - "@/components/ui/dialog"
        - "@/components/ui/button"
        - "@/lib/constants/order"
        - "@/lib/square/types"
        - "@/lib/square/client"

  env:
    ".env.example":
      content: "環境変数のサンプルファイル"
    ".env.local.product":
      content: "本番環境用の環境変数設定をローカルで試すファイル（一部本番用データを記載）"
    ".env.local.sandbox":
      content: "開発環境用の環境変数設定をローカルで試すファイル"
    ".env.product":
      content: "本番環境用の環境変数設定ファイル（すべて本番用データを記載）"

  lib:
    constants:
      "email.ts":
        content: "メール関連の定数定義"
        exports:
          - "EMAIL_MESSAGES | メールテンプレートと通知メッセージの定義"
      "order.ts":
        content: "注文関連の定数定義"
        exports:
          - "DefaultMaxOrderQuantity | デフォルトの最大注文数"
          - "ORDER_SETTINGS | 注文設定オブジェクト"
      "demo-products.ts":
        exports:
          - "DEMO_PRODUCTS"

    square:
      "client.ts":
        content: "Square APIクライアントの設定と初期化"
        exports:
          - "squareClient | Square APIクライアントインスタンス"
      "types.ts":
        content: "Square関連の型定義"
        exports:
          - "ECProduct | 商品データの型定義"
          - "ECCategory | カテゴリーの型定義"
          - "ECProductVariation | 商品バリエーションの型定義"

    store:
      "cart.ts":
        content: |-
          カートの状態管理ストア
          - カート商品の追加・削除・数量変更
          - カタログ商品IDの管理
          - 状態の永続化（LocalStorage）
        exports:
          - "CartItem | カート内商品の型定義"
          - "useCartStore | カート操作用Zustandストア"
        dependencies:
          - "@/lib/constants/order"

    "square-utils.ts":
      content: "Square API関連のユーティリティ関数"
      exports:
        - "formatPrice | 価格フォーマット関数"
      dependencies:
        - "@/lib/square/types"

    "utils.ts": {}
```
