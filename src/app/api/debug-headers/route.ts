import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = process.env.ANALYTICS_SECRET;
  const token = request.headers.get('x-debug-token');
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key.includes('nf') || key.includes('country') || key.includes('city') || key.includes('geo') || key.includes('ip') || key.includes('forward')) {
      headers[key] = value;
    }
  });

  return NextResponse.json(headers);
}
