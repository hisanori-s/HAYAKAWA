## ツリー表示
```tree
.
├── app
│   ├── api
│   │   ├── catalog
│   │   │   ├── api-routes.js
│   │   │   └── route.ts
│   │   └── square
│   │       ├── checkout
│   │       │   └── route.ts
│   │       ├── env-check
│   │       │   └── route.ts
│   │       ├── test
│   │       │   └── route.ts
│   │       ├── catalog
│   │       │   └── route.ts
│   │       ├── image
│   │       │   └── [imageId]
│   │       │       └── route.ts
│   │       └── direct-test
│   │           └── route.ts
│   ├── cart
│   │   └── page.tsx
│   ├── order
│   │   └── complete
│   │       └── page.tsx
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ui
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── use-toast.ts
│   ├── cart
│   │   ├── cart-provider.tsx
│   │   └── cart-items.tsx
│   ├── delivery-date.tsx
│   ├── delivery-info.tsx
│   ├── ec-page.tsx
│   ├── header.tsx
│   └── product-list.tsx
├── lib
│   ├── constants
│   │   └── demo-products.ts
│   ├── square
│   │   ├── client.ts
│   │   └── types.ts
│   ├── square-utils.ts
│   ├── store
│   │   └── cart.ts
│   └── utils.ts
├── public
│   └── images
│       ├── global
│       └── placeholders
│           └── product-placeholder.jpg
├── .cursorrules
├── .editorconfig
├── .env.local
├── .eslintrc.json
├── .gitignore
├── _DEVELOPMENT_LOG.md
├── _INSTRUCTION.md
├── _STRUCTURE.md
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## YAML形式での構造説明
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

directories:
  app:
    description: "Next.js App Routerのメインディレクトリ"
    api:
      description: "APIエンドポイント群"
      catalog:
        description: "商品カタログ関連のAPI"
        files:
          route.ts: "カタログデータ取得エンドポイント"
          api-routes.js: "API定義とルーティング"
      square:
        description: "Square API関連のエンドポイント"
        endpoints:
          checkout: "決済処理とチェックアウトセッション"
          catalog: "商品カタログデータの取得"
          image: "商品画像の取得"
          env-check: "環境変数の検証"
          test: "APIテスト用エンドポイント"
    pages:
      cart: "ショッピングカートページ"
      order/complete: "注文完了ページ"
      layout: "共通レイアウト"
      page: "トップページ/商品一覧"

  components:
    description: "再利用可能なコンポーネント"
    ui:
      description: "shadcn/uiベースの基本UIコンポーネント"
      components:
        - "button: ボタンコンポーネント"
        - "dialog: モーダルダイアログ"
        - "input: 入力フォーム"
        - "tabs: タブナビゲーション"
        - "toast: 通知表示"
    cart:
      description: "カート関連のコンポーネント"
      components:
        cart-provider: "カート状態管理のコンテキストプロバイダー"
        cart-items: "カート内商品表示"
    product:
      description: "商品表示関連"
      components:
        product-list: "商品一覧表示"
        delivery-info: "配送情報表示"
        delivery-date: "配送日設定"

  lib:
    description: "ユーティリティと共通ロジック"
    square:
      description: "Square API連携"
      files:
        client.ts: "Square APIクライアントの設定と共通関数"
        types.ts: "Square関連の型定義"
    store:
      description: "状態管理"
      files:
        cart.ts: "カートのZustand store"
    constants:
      description: "定数定義"
      files:
        demo-products.ts: "開発用モックデータ"

  public:
    description: "静的ファイル"
    images:
      description: "画像ファイル"
      directories:
        global: "サイト共通の画像"
        placeholders: "プレースホルダー画像"

current_features:
  implemented:
    - "商品一覧表示（カテゴリ別）"
    - "商品詳細モーダル"
    - "カート機能（追加・削除・数量変更）"
    - "Square決済連携"
    - "商品画像表示"
    - "配送情報入力"

  in_progress:
    - "カテゴリ情報の取得改善"
    - "画像表示の最適化"
    - "エラーハンドリングの強化"
    - "デバッグ機能の拡充"

development_status:
  square_integration:
    catalog: "実装済み - 商品データの取得"
    checkout: "実装済み - 決済フロー"
    images: "実装中 - 画像表示の改善"
    categories: "実装中 - カテゴリ管理の強化"

  ui_components:
    base: "実装済み - shadcn/uiの導入"
    cart: "実装済み - カート機能"
    product: "実装済み - 商品表示"
    delivery: "実装中 - 配送機能の拡充"
```
