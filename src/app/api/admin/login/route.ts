import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  const secret = process.env.ANALYTICS_SECRET;

  if (!secret || password !== secret) {
    return NextResponse.json({ error: 'Ongeldig wachtwoord' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', secret, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 uur
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
