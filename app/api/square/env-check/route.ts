import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.SQUARE_ENVIRONMENT,
    hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
  });
}
