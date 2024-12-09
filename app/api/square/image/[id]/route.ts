import { squareClient } from '@/lib/square/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(params.id);

    if (!result.object || !result.object.imageData?.url) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Square APIから画像URLを取得してリダイレクト
    return NextResponse.redirect(result.object.imageData.url);
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
