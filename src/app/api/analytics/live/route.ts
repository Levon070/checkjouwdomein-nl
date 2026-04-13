import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLiveCount } from '@/lib/analytics';

export async function GET() {
  const token = cookies().get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || token !== secret) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }
  const count = await getLiveCount();
  return NextResponse.json({ count });
}
