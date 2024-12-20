## ツリー表示
```tree
.
├── .cursorrules
├── .editorconfig
├── .env.local
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
│   ├── ui
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
│   ├── cart
│   │   ├── cart-provider.tsx
│   │   └── cart-items.tsx
│   ├── delivery-date.tsx
│   ├── delivery-info.tsx
│   ├── ec-page.tsx
│   ├── header.tsx
│   └── product-list.tsx
├── components.json
├── lib
│   ├── constants
│   │   └── demo-products.ts
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
      square:
        description: "Square API関連のエンドポイント"
        endpoints:
          catalog: "商品カタログデータの取得"
          checkout: "決済処理とチェックアウトセッション"
          image: "商品画像の取得（単体・バッチ）"
          env-check: "環境変数の検証"
          test: "APIテスト用エンドポイント"
    cart:
      description: "カート関連のページ"
      pages:
        check: "注文確認ページ"
        complete: "注文完了ページ"
        error: "エラーページ"
    fonts:
      description: "フォントファイル"
      files:
        - "GeistMonoVF.woff: モノスペースフォント"
        - "GeistVF.woff: 通常フォント"

  components:
    description: "再利用可能なコンポーネント"
    ui:
      description: "shadcn/uiベースの基本UIコンポーネント"
      components:
        - "button: ボタンコンポーネント"
        - "card: カードコンポーネント"
        - "carousel: カルーセルコンポーネント"
        - "dialog: モーダルダイアログ"
        - "input: 入力フォーム"
        - "loading-animation: ローディングアニメーション"
        - "tabs: タブナビゲーション"
        - "toast: 通知表示"
    cart:
      description: "カート関連のコンポーネント"
      files:
        cart-provider: "カート状態管理のコンテキストプロバイダー"
        cart-items: "カート内商品表示"
    files:
      delivery-date: "配送日に関する伝達事項の記載"
      delivery-info: "配送料に関する伝達事項の記載"
      ec-page: "ECサイトのメインページコンポーネント"
      header: "ヘッダーコンポーネント"
      product-list: "商品一覧コンポーネント"

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
    files:
      square-utils: "Square関連のユーティリティ関数"
      utils: "一般的なユーティリティ関数"

  public:
    description: "静的ファイル"
    animations:
      description: "アニメーションファイル"
      files:
        loading-spinner: "ローディングアニメーション"
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
    - "画像表示の最適化（プリフェッチ・キャッシュ）"

  in_progress:
    - "カテゴリ情報の取得改善"
    - "画像表示のさらなる最適化"
    - "エラーハンドリングの強化"
    - "デバッグ機能の拡充"
    - "無限スライド機能の実装"

development_status:
  square_integration:
    catalog: "実装済み - 商品データの取得"
    checkout: "実装済み - 決済フロー"
    images: "最適化完了 - プリフェッチ・キャッシ���実装"
    categories: "実装中 - カテゴリ管理の強化"

  ui_components:
    base: "実装済み - shadcn/uiの導入"
    cart: "実装済み - カート機能"
    product: "実装済み - 商品表示"
    delivery: "実装中 - 配送機能の拡充"
```
