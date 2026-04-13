import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'CheckJouwDomein.nl';
  const desc =
    searchParams.get('desc') ||
    'Controleer gratis domeinnaam beschikbaarheid. Real-time RDAP-check op .nl, .com, .be en meer.';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: -200,
            right: -100,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            bottom: -150,
            left: -80,
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 72px',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Top: logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 14,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'white', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Check<span style={{ opacity: 0.85 }}>Jouw</span>Domein<span style={{ opacity: 0.6 }}>.nl</span>
              </span>
            </div>
          </div>

          {/* Middle: title + desc */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 30 ? 52 : 64,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                maxWidth: 860,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 26,
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.45,
                maxWidth: 760,
                fontWeight: 400,
              }}
            >
              {desc}
            </div>
          </div>

          {/* Bottom: stats + domain badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {['.nl', '.com', '.be', '.io', '.shop'].map((tld) => (
                <div
                  key={tld}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 700,
                    display: 'flex',
                  }}
                >
                  {tld}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399', display: 'flex' }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }}>Gratis · Geen account</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
