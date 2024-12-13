import { NextResponse } from 'next/server';
import { fetchMultipleImageUrls } from '@/lib/square/client';

export async function POST(request: Request) {
  try {
    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds)) {
      return NextResponse.json({
        success: false,
        error: '無効なリクエスト形式です'
      }, { status: 400 });
    }

    const urls = await fetchMultipleImageUrls(imageIds);

    return NextResponse.json({
      success: true,
      urls
    });
  } catch (error) {
    console.error('Batch image fetch error:', error);
    return NextResponse.json({
      success: false,
      error: '画像URLの取得に失敗しました'
    }, { status: 500 });
  }
}
