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
│   │   ├── check
│   │   │   └── page.tsx
│   │   ├── complete
│   │   │   └── page.tsx
│   │   ├── error
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
│   │   ├── cart-provider.tsx
│   │   └── cart-items.tsx
│   ├── payment
│   │   └── square-payment.tsx
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
├── lib
│   ├── constants
│   │   ├── demo-products.ts
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
      square:
        "catalog/route.ts":
          dependencies:
            - "@/lib/square/client"
            - "@/lib/square/types"
        "checkout/route.ts":
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
          - 在庫確認機能の実装
          - 在庫状態に基づく購入制限
          - 在庫確認中の表示制御
        exports:
          - "CartPage | カート内商品の表示と在庫確認機能を提供"
        dependencies:
          - "@/components/cart/cart-items"
          - "@/lib/store/cart"
          - "@/lib/square/client"
          - "@/lib/constants/order"
      "check/page.tsx":
        dependencies:
          - "@/components/payment/square-payment"
      "complete/page.tsx": {}
      "error/page.tsx": {}

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
      "cart-items.tsx":
        content: "カート内商品一覧表示コンポーネント"
        dependencies:
          - "@/lib/store/cart"
          - "@/lib/constants/order"

    payment:
      "square-payment.tsx":
        dependencies:
          - "@/lib/square/client"

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
      content: "商品一覧表示と在庫管理機能を含むコンポーネント"
      exports:
        - "ProductList | 商品一覧と在庫状態を表示"
      dependencies:
        - "@/components/ui/dialog"
        - "@/components/ui/button"
        - "@/lib/constants/order"
        - "@/lib/square/types"
        - "@/lib/square/client"

  lib:
    constants:
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
          - 在庫確認機能の統合
          - 在庫状態に基づく購入制限
          - 状態更新の最適化
        exports:
          - "CartItem | カート内商品の型定義"
          - "useCartStore | カート操作用Zustandストア"
          - "InventoryState | 在庫状態の型定義"
        dependencies:
          - "@/lib/constants/order"

    "square-utils.ts":
      content: "Square API関連のユーティリティ関数"
      exports:
        - "formatPrice | 価格フォーマット関数"
    "utils.ts": {}
```
