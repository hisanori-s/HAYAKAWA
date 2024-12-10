import { fetchImageUrl } from '@/lib/square/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    console.log('Fetching image for ID:', params.imageId);

    const imageUrl = await fetchImageUrl(params.imageId);
    console.log('Retrieved image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      debug: {
        imageId: params.imageId,
        hasUrl: !!imageUrl,
        retrievedUrl: imageUrl,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        imageId: params.imageId,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 });
  }
}
