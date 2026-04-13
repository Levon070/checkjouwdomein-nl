import { NextRequest, NextResponse } from 'next/server';
import { parseUserAgent } from '@/lib/ua-parser';
import { hashIpEdge, trackPageViewEdge } from '@/lib/analytics-edge';

export const config = {
  // Match all routes (including admin) to set x-pathname header, but skip internals/static
  matcher: ['/((?!api|_next/static|_next/image|favicon|robots|sitemap|og|icons|images).*)'],
};

export async function middleware(request: NextRequest) {
  // Fire-and-forget analytics (don't block the response)
  void recordPageView(request).catch(() => {});

  // Pass pathname to root layout for conditional Header/Footer rendering
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

async function recordPageView(request: NextRequest): Promise<void> {
  const url = request.nextUrl;

  // Don't track admin pages of jezelf als beheerder
  if (url.pathname.startsWith('/admin')) return;
  const adminToken = request.cookies.get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (secret && adminToken === secret) return;

  const path = url.pathname + (url.search ? url.search : '');

  // Extract referrer domain (external only)
  const rawRef = request.headers.get('referer') ?? '';
  let referrer = '';
  if (rawRef) {
    try {
      const ref = new URL(rawRef);
      if (ref.hostname !== url.hostname) {
        referrer = ref.hostname.replace(/^www\./, '');
      }
    } catch {
      // ignore invalid referrer
    }
  }

  // Geo data van Netlify (geen IP opslag nodig)
  let country = '';
  let city = '';
  const geoHeader = request.headers.get('x-nf-geo');
  if (geoHeader) {
    try {
      // Netlify stuurt x-nf-geo als base64-encoded JSON
      const decoded = atob(geoHeader);
      const geo = JSON.parse(decoded) as {
        city?: string;
        country?: { code?: string; name?: string };
        subdivision?: { name?: string };
      };
      city = [geo.city, geo.subdivision?.name].filter(Boolean).join(', ');
      country = geo.country?.name ?? geo.country?.code ?? '';
    } catch {
      country = request.headers.get('x-country') ?? request.headers.get('x-nf-country') ?? '';
    }
  } else {
    country = request.headers.get('x-country') ?? request.headers.get('x-nf-country') ?? request.headers.get('cf-ipcountry') ?? '';
  }

  // Hash IP for privacy
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const hashedIp = await hashIpEdge(rawIp);

  // User-agent → device + browser
  const ua = request.headers.get('user-agent') ?? '';
  const { device, browser } = parseUserAgent(ua);

  await trackPageViewEdge({ path, referrer, country, city, device, browser, hashedIp });
}
