import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';
import { CategoryNode, SquareProduct } from '@/lib/square/types';

const PLACEHOLDER_IMAGE = '/images/placeholders/product-placeholder.jpg';

export async function GET() {
  try {
    console.log('Square API呼び出し開始');
    console.log('環境変数:', {
      accessToken: process.env.SQUARE_ACCESS_TOKEN?.slice(0, 5) + '...',
      environment: process.env.SQUARE_ENVIRONMENT,
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    });

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

    // ECカテゴリを検索（大文字小文字を区別せず、空白も無視）
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

    console.log('ECカテゴリ検出:', {
      id: ecCategory.id,
      name: ecCategory.categoryData?.name
    });

    // ECカテゴリ配下のカテゴリを取得
    const childCategories = allCategories.filter(cat =>
      cat.categoryData?.parentCategory?.id === ecCategory.id
    );

    console.log('EC配下のカテゴリ:', childCategories.map(cat => ({
      id: cat.id,
      name: cat.categoryData?.name
    })));

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

    console.log('商品検索結果:', {
      totalItems: itemsResult.items?.length || 0,
      categories: childCategories.map(cat => cat.categoryData?.name)
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
      if (item.itemData?.categoryId && item.id && categoryTree[item.itemData.categoryId]) {
        const product: SquareProduct = {
          id: item.id,
          type: item.type,
          version: Number(item.version || 0),
          itemData: {
            name: item.itemData.name || '',
            description: item.itemData.description || undefined,
            categoryId: item.itemData.categoryId,
            variations: item.itemData.variations || [],
            availableOnline: item.itemData.availableOnline || false,
          },
          imageUrl: item.imageData?.url || PLACEHOLDER_IMAGE,
        };
        categoryTree[item.itemData.categoryId].items.push(product);
      }
    });

    return NextResponse.json({
      categories: Object.values(categoryTree),
    });

  } catch (error) {
    console.error('Catalog API error:', error);

    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors?: Array<{ category?: string; code?: string; detail?: string }> };
      return NextResponse.json({
        error: 'Square APIでエラーが発生しました',
        details: process.env.NODE_ENV === 'development' ? {
          errors: squareError.errors
        } : undefined
      }, { status: 500 });
    }

    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json({
      error: 'カタログ情報の取得に失敗しました',
      details: process.env.NODE_ENV === 'development' ? {
        message: errorMessage
      } : undefined
    }, { status: 500 });
  }
}
