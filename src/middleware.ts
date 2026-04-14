import { NextRequest, NextResponse } from 'next/server';
import { parseUserAgent } from '@/lib/ua-parser';
import { hashIpEdge, trackPageViewEdge } from '@/lib/analytics-edge';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|robots|sitemap|og|icons|images).*)'],
};

const RV_COOKIE = 'cjd_rv'; // returning visitor cookie

export async function middleware(request: NextRequest) {
  // Detect returning visitor before building response
  const isReturning = request.cookies.has(RV_COOKIE);

  // Pass pathname as REQUEST header so Server Components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Set returning visitor cookie if first visit (1 year)
  if (!isReturning) {
    response.cookies.set(RV_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }

  // Fire-and-forget analytics (non-blocking)
  void recordPageView(request, isReturning).catch(() => {});

  return response;
}

async function recordPageView(request: NextRequest, isReturning: boolean): Promise<void> {
  const url = request.nextUrl;

  // Don't track admin pages
  if (url.pathname.startsWith('/admin')) return;

  // Don't track logged-in admins
  const adminToken = request.cookies.get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (secret && adminToken === secret) return;

  const path = url.pathname + (url.search ? url.search : '');

  // UTM parameters
  const utmSource = url.searchParams.get('utm_source') ?? undefined;
  const utmMedium = url.searchParams.get('utm_medium') ?? undefined;
  const utmCampaign = url.searchParams.get('utm_campaign') ?? undefined;

  // Referrer (external only)
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

  // Geo data via Netlify headers
  let country = '';
  let city = '';
  const geoHeader = request.headers.get('x-nf-geo');
  if (geoHeader) {
    try {
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
    country =
      request.headers.get('x-country') ??
      request.headers.get('x-nf-country') ??
      request.headers.get('cf-ipcountry') ??
      '';
  }

  // Hash IP for privacy
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const hashedIp = await hashIpEdge(rawIp);

  // User-agent → device + browser + OS
  const ua = request.headers.get('user-agent') ?? '';
  const { device, browser, os } = parseUserAgent(ua);

  await trackPageViewEdge({
    path,
    referrer,
    country,
    city,
    device,
    browser,
    os,
    hashedIp,
    isReturning,
    utmSource,
    utmMedium,
    utmCampaign,
  });
}
