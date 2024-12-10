import { fetchImageUrl } from '@/lib/square/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Image API endpoint called:', {
    imageId: params.id,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers)
  });

  try {
    console.log('Attempting to fetch image URL for ID:', params.id);

    const imageUrl = await fetchImageUrl(params.id);
    console.log('Successfully retrieved image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      debug: {
        imageId: params.id,
        hasUrl: !!imageUrl,
        retrievedUrl: imageUrl,
        timestamp: new Date().toISOString(),
        requestHeaders: Object.fromEntries(request.headers)
      }
    });
  } catch (error) {
    console.error('Error in image API endpoint:', {
      imageId: params.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        imageId: params.id,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString(),
        requestHeaders: Object.fromEntries(request.headers)
      }
    }, { status: 500 });
  }
}
