import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import { CategoryNode } from '@/lib/square/types';

export async function GET() {
  try {
    console.log('Square API呼び出し開始');

    // すべてのカテゴリを取得
    const { result: catalogResult } = await squareClient.catalogApi.listCatalog(undefined, 'CATEGORY');

    if (!catalogResult?.objects) {
      console.log('カタログ結果が空です:', catalogResult);
      return NextResponse.json({
        error: 'カタログデータを取得できません',
        debug: { catalogResult }
      }, { status: 404 });
    }

    // すべてのカテゴリをログ出力
    const allCategories = catalogResult.objects.filter(obj => obj.type === 'CATEGORY');
    console.log('取得したカテゴリ一覧:', allCategories.map(cat => ({
      id: cat.id,
      name: cat.categoryData?.name,
      parentId: cat.categoryData?.parentCategory?.id
    })));

    // ECカテゴリを検索
    const ecCategory = allCategories.find(cat => {
      const categoryName = cat.categoryData?.name?.trim().toUpperCase();
      return categoryName === 'EC';
    });

    if (!ecCategory) {
      console.log('利用可能なカテゴリ:', allCategories.map(cat => cat.categoryData?.name));
      return NextResponse.json({
        error: 'ECカテゴリが見つかりません',
        debug: {
          availableCategories: allCategories.map(cat => cat.categoryData?.name)
        }
      }, { status: 404 });
    }

    // ECカテゴリ配下のカテゴリを取得
    const childCategories = allCategories.filter(cat =>
      cat.categoryData?.parentCategory?.id === ecCategory.id
    );

    if (childCategories.length === 0) {
      return NextResponse.json({
        error: 'ECカテゴリ配下にカテゴリが見つかりません',
        debug: {
          ecCategory: {
            id: ecCategory.id,
            name: ecCategory.categoryData?.name
          }
        }
      }, { status: 404 });
    }

    // 商品を取得
    const { result: itemsResult } = await squareClient.catalogApi.searchCatalogItems({
      categoryIds: childCategories.map(cat => cat.id)
    });

    // カテゴリツリーの構築
    const categoryTree: Record<string, CategoryNode> = {};
    childCategories.forEach(category => {
      if (category.id && category.categoryData?.name) {
        categoryTree[category.id] = {
          id: category.id,
          name: category.categoryData.name,
          items: [],
        };
      }
    });

    // 商品をカテゴリに割り当て
    const items = itemsResult.items || [];
    items.forEach((item) => {
      if (item.itemData?.categories?.[0]?.id && item.id && categoryTree[item.itemData.categories[0].id]) {
        categoryTree[item.itemData.categories[0].id].items.push(item);
      }
    });

    return NextResponse.json({
      categories: Object.values(categoryTree),
    });

  } catch (error) {
    console.error('Catalog API error:', error);
    return NextResponse.json({
      error: 'カタログ情報の取得に失敗しました',
      details: process.env.NODE_ENV === 'development' ? {
        message: error instanceof Error ? error.message : '不明なエラー'
      } : undefined
    }, { status: 500 });
  }
}
