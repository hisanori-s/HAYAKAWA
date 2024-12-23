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
          dependencies:
            - "@/lib/square/client"

    cart:
      "page.tsx":
        dependencies:
          - "@/components/cart/cart-items"
          - "@/lib/store/cart"
      "check/page.tsx":
        dependencies:
          - "@/components/payment/square-payment"
      "complete/page.tsx": {}
      "error/page.tsx": {}

  components:
    cart:
      "cart-provider.tsx":
        exports:
          - "useCart"
        dependencies:
          - "@/lib/store/cart"
      "cart-items.tsx":
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
      exports:
        - "ProductList"
      dependencies:
        - "@/components/ui/dialog"
        - "@/components/ui/button"
        - "@/lib/constants/order"
        - "@/lib/square/types"

  lib:
    constants:
      "order.ts":
        exports:
          - "DEFAULT_MAX_ORDER_QUANTITY"
          - "ORDER_SETTINGS"
      "mockData/demo-products.ts":
        exports:
          - "DEMO_PRODUCTS"

    square:
      "client.ts":
        exports:
          - "squareClient"
      "types.ts":
        exports:
          - "ECProduct"
          - "ECCategory"
          - "ECProductVariation"

    store:
      "cart.ts":
        exports:
          - "CartItem"
          - "useCartStore"
        dependencies:
          - "@/lib/constants/order"

    "square-utils.ts":
      exports:
        - "formatPrice"
    "utils.ts": {}
```
