import { NextResponse } from 'next/server';
import { squareClient } from '@/lib/square/client';

export async function GET() {
  try {
    const response = await squareClient.locationsApi.listLocations();

    return NextResponse.json({
      success: true,
      rawResponse: response.result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
