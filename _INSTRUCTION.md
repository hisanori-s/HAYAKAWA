# Square ECサイト開発 - カテゴリ取得の改善

## 現在の状況
1. 金額表示の修正が完了
   - Square APIからの金額をそのまま使用するように修正
   - デモ商品の金額も円単位に統一
   - 不要な金額変換処理を削除

2. カテゴリ取得の課題
   - 現状はすべてのカテゴリを取得している
   - 親カテゴリ「EC」の子カテゴリのみに限定したい
   - カテゴリ構造の整理が必要

## 確認済みの実装状況
1. カタログ情報の取得
   ```typescript
   // lib/square/client.ts
   export async function fetchCatalogWithCategories() {
     // 現状はすべてのカテゴリを取得
     const { result } = await squareClient.catalogApi.listCatalog();
     // ...
   }
   ```

2. カテゴリデータの構造（現在の取得データ）
   ```typescript
   // ECカテゴリとその子カテゴリの情報
   const EC_CATEGORY = {
     id: "RZFU2VEHUVDIZKMR4OUVBLMW",
     name: "EC",
     parentId: null
   };

   const EC_CHILD_CATEGORIES = [
     {
       id: "65DGOSQZ3YRXUCIAPWA2DZH7",
       name: "EC_餃子",
       parentId: "RZFU2VEHUVDIZKMR4OUVBLMW"
     },
     {
       id: "QYRJZCJKYYEHSJKN5PKG74RB",
       name: "EC_デザート",
       parentId: "RZFU2VEHUVDIZKMR4OUVBLMW"
     },
     {
       id: "E2VNV4T6M2BQ6T2WHLHUUE2Y",
       name: "EC_グッズ",
       parentId: "RZFU2VEHUVDIZKMR4OUVBLMW"
     }
   ];
   ```

## 次のステップ
1. カテゴリフィルタリングの実装
   - ECカテゴリ（id: RZFU2VEHUVDIZKMR4OUVBLMW）の子カテゴリのみを抽出
   - 対象外のカテゴリ（店舗用カテゴリ等）を除外
   - 商品データもEC関連カテゴリに属するもののみに限定

2. データ構造の最適化
   ```typescript
   // 追加すべき型定義の例
   interface ECCategory extends CategoryData {
     isECCategory: boolean;
     children?: ECCategory[];
   }

   interface ECProduct extends ProductData {
     category: ECCategory;
   }
   ```

3. 実装手順
   a. `lib/square/client.ts`の修正
      - カテゴリフィルタリング関数の実装
      - EC関連商品のみを取得する処理の追加

   b. `lib/square/types.ts`の更新
      - EC用の型定義の追加
      - カテゴリ階層構造の型の追加

   c. `components/product-list.tsx`の調整
      - フィルタリング済みデータの表示対応
      - デバッグ表示の改善

## 技術的な注意点
1. Square API
   - カテゴリ取得時のフィルタリング
   - 親子関係の効率的な取得方法
   - 不要なデータの除外による最適化

2. パフォーマンス
   - カテゴリフィルタリングのタイミング（API取得時）
   - 必要なデータのみを取得する仕組み
   - キャッシュの活用

## 次のチャットでの作業指示
1. `lib/square/client.ts`の修正
   - ECカテゴリフィルタリング関数の実装
   - 商品データのフィルタリング処理の追加

2. 型定義の更新
   - EC専用の型定義の追加
   - カテゴリ階層構造の型の実装

3. 表示コンポーネントの調整
   - フィルタリング済みデータの表示対応
   - デバッグ情報の改善

## 参考情報
1. ECカテゴリID: "RZFU2VEHUVDIZKMR4OUVBLMW"
2. EC子カテゴリ数: 3（EC_餃子、EC_デザート、EC_グッズ）
3. 現在のデータ構造は`components/product-list.tsx`のデバッグ表示で確認可能

## 作業の引き継ぎ事項
1. 実装の優先順位
   a. まず`lib/square/types.ts`でEC用の型定義を実装
      ```typescript
      // 実装すべき型定義
      interface CategoryData {
        id: string;
        name: string;
        parentId?: string | null;
      }

      interface ECCategory extends CategoryData {
        isECCategory: boolean;
        children?: ECCategory[];
      }

      interface ECProduct extends ProductData {
        category: ECCategory;
      }
      ```

   b. 次に`lib/square/client.ts`の修正
      ```typescript
      // 実装すべき関数例
      function isECCategory(category: CategoryData): boolean {
        return category.id === "RZFU2VEHUVDIZKMR4OUVBLMW" ||
               category.parentId === "RZFU2VEHUVDIZKMR4OUVBLMW";
      }

      async function fetchECCatalog() {
        const { result } = await squareClient.catalogApi.listCatalog();
        // ECカテゴリとその子カテゴリのみをフィルタリング
        // 関連する商品のみを抽出
      }
      ```

2. データ構造の変更点
   - カテゴリは必ずECカテゴリまたはその子カテゴリのみを扱う
   - 商品データは必ずECカテゴリに属するもののみを返す
   - デバッグ情報は維持しつつ、EC関連のみに限定

3. 実装時の注意点
   - Square APIの呼び出しは最小限に抑える
   - カテゴリのフィルタリングはAPI取得時に行う
   - 不要なカテゴリや商品データは早期に除外

4. デバッグ情報の取り扱い
   - 現在の`components/product-list.tsx`のデバッグ表示は維持
   - EC関連のカテゴリと商品のみに表示を限定
   - カテゴリ階層構造を視覚的に表示

5. 確認済みの情報
   - ECカテゴリID: "RZFU2VEHUVDIZKMR4OUVBLMW"
   - EC子カテゴリ:
     - EC_餃子: "65DGOSQZ3YRXUCIAPWA2DZH7"
     - EC_デザート: "QYRJZCJKYYEHSJKN5PKG74RB"
     - EC_グッズ: "E2VNV4T6M2BQ6T2WHLHUUE2Y"

6. 次のAIへの引き継ぎ事項
   - 型定義から着手することで、以降の実装がスムーズになります
   - カテゴリフィルタリングは取得時に行うことで、パフォーマンスを最適化できます
   - デバッグ情報は開発環境でのみ表示され、本番環境では非表示となります
   - 現在のデータ構造は`SDK取得情報サンプル.md`で確認できます

## 完了条件
1. EC関連のカテゴリと商品のみが表示されること
2. カテゴリ階層構造が適切に表現されていること
3. 型安全性が保たれていること
4. パフォーマンスが最適化されていること
5. デバッグ情報が適切に表示されること
