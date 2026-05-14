import { NextRequest, NextResponse } from 'next/server';
import { getKwsBaseUrl } from '@/lib/kwsServer';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '100';

    const response = await fetch(`${getKwsBaseUrl()}/api/kws-sha256/?limit=${limit}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('KWS SHA256 API Error:', error);
    return NextResponse.json(
      { result: 'error', message: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
