import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value } = body as { name?: string; value?: string };

    if (!name || typeof name !== 'string' || !/^[a-z_]+$/.test(name)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await trackEvent(name, String(value ?? '').slice(0, 200));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
