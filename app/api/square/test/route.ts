import { squareClient } from '@/lib/square/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Square API connection...');
    const response = await squareClient.locationsApi.listLocations();

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      locations: response.result.locations
    });
  } catch (error) {
    console.error('Square API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
