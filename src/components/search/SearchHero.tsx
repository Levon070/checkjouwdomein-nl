'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeKeyword } from '@/lib/domain-generator';

interface ParsedIntent {
  keyword: string;
  location: string | null;
  industry: string | null;
  original: string;
}

const RECENT_KEY = 'cjd_recent';
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(kw: string) {
  try {
    const existing = getRecentSearches().filter((k) => k !== kw);
    const next = [kw, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function BrowserMockup() {
  const results = [
    { domain: 'bakkerij.nl', available: true, price: '€ 3,99' },
    { domain: 'bakkerij.com', available: false },
    { domain: 'bakkerij.be', available: true, price: '€ 4,99' },
    { domain: 'debakkerij.nl', available: true, price: '€ 3,99' },
  ];
  return (
    <div
      aria-hidden="true"
      style={{
        width: 300,
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 32px 80px rgba(0,0,0,0.14), 0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
        transform: 'rotate(1deg)',
        userSelect: 'none',
      }}
    >
      {/* Browser chrome */}
      <div style={{ background: '#F3F4F6', padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41', display: 'inline-block', flexShrink: 0 }} />
        <div style={{ flex: 1, background: 'white', borderRadius: 20, padding: '3px 10px', marginLeft: 4, fontSize: 9, color: '#9BA4B5', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          checkjouwdomein.nl/zoek/bakkerij
        </div>
      </div>

      {/* Header bar */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', padding: '10px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Resultaten voor &ldquo;bakkerij&rdquo;
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '12px 14px' }}>
        {results.map((r) => (
          <div key={r.domain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', borderRadius: 8, marginBottom: 4, background: r.available ? 'rgba(5,150,105,0.07)' : 'rgba(0,0,0,0.03)', border: r.available ? '1px solid rgba(5,150,105,0.12)' : '1px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: r.available ? '#059669' : '#DC2626' }} />
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: r.available ? '#0A0C14' : '#9BA4B5', fontWeight: r.available ? 600 : 400 }}>
                {r.domain}
              </span>
            </div>
            {'price' in r && r.price
              ? <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>{r.price}</span>
              : <span style={{ fontSize: 10, color: '#DC2626', background: 'rgba(220,38,38,0.08)', padding: '2px 7px', borderRadius: 8 }}>Bezet</span>
            }
          </div>
        ))}

        <div style={{ marginTop: 10, padding: '9px 11px', borderRadius: 9, background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.12)' }}>
          <div style={{ fontSize: 9, color: '#4F46E5', fontWeight: 700, marginBottom: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>✦ AI Suggesties</div>
          <div style={{ fontSize: 11, color: '#5B6070' }}>jouwbakkerij.nl &nbsp;·&nbsp; bakkershop.nl</div>
        </div>

        <div style={{ marginTop: 6, padding: '7px 11px', borderRadius: 9, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 11 }}>🏛️</span>
          <div style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>Geen Europees merk gevonden</div>
        </div>

        <div style={{ marginTop: 6, padding: '7px 11px', borderRadius: 9, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 11 }}>🐦</span>
          <div style={{ fontSize: 10, color: '#0891B2', fontWeight: 600 }}>@bakkerij vrij op X & Instagram</div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 14px 14px' }}>
        <div style={{ background: '#4F46E5', borderRadius: 9, padding: '9px 14px', textAlign: 'center', cursor: 'default' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>Registreer bij TransIP — € 3,99/jaar →</span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  initialKeyword?: string;
}

export default function SearchHero({ initialKeyword = '' }: Props) {
  const [value, setValue] = useState(initialKeyword);
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent | null>(null);
  const [parsingIntent, setParsingIntent] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    if (trimmed.includes(' ') && !trimmed.includes(',') && process.env.NEXT_PUBLIC_HAS_AI === '1') {
      setParsingIntent(true);
      try {
        const res = await fetch('/api/parse-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: trimmed }),
        });
        if (res.ok) {
          const data = await res.json();
          setParsedIntent({ ...data, original: trimmed });
          saveRecentSearch(trimmed);
          setRecent(getRecentSearches());
          router.push(`/zoek/${encodeURIComponent(data.keyword)}`);
          setParsingIntent(false);
          return;
        }
      } catch {
        // fall through
      }
      setParsingIntent(false);
    }

    const keywords = trimmed.split(/[,;\s]+/).map((k) => sanitizeKeyword(k)).filter(Boolean);
    if (keywords.length === 0) return;
    const slug = trimmed.includes(' ') && !trimmed.includes(',') ? keywords[0] : keywords.join(',');
    saveRecentSearch(trimmed);
    setRecent(getRecentSearches());
    router.push(`/zoek/${encodeURIComponent(slug)}`);
  }

  function navigateSearch(raw: string) {
    const keywords = raw.split(/[,;]+/).map((k) => sanitizeKeyword(k)).filter(Boolean);
    if (keywords.length === 0) return;
    saveRecentSearch(raw);
    setRecent(getRecentSearches());
    router.push(`/zoek/${encodeURIComponent(keywords.join(','))}`);
  }

  const popularKeywords = ['webshop', 'restaurant', 'freelancer', 'app', 'blog', 'coach'];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #EEF2FF 0%, #F6F8FC 50%, #ECFEFF 100%)',
        paddingTop: '64px',
        paddingBottom: '72px',
      }}
    >
      {/* Background textures */}
      <div className="dot-grid" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }} />
      <div className="ambient-blob blob-hero-1" aria-hidden="true" />
      <div className="ambient-blob blob-hero-2" aria-hidden="true" />
      <div className="ambient-blob blob-hero-3" aria-hidden="true" />

      {/* Floating pills — visible on md/lg, hidden on xl (replaced by 2-col grid) */}
      <div aria-hidden="true" className="hidden md:block xl:hidden">
        <div className="float-pill float-pill-available" style={{ top: '20%', left: '4%', '--r': '-8deg', animation: 'floatA 5s ease-in-out infinite' } as React.CSSProperties}>
          <span style={{ fontSize: '0.6rem' }}>●</span> bakkerij.nl
        </div>
        <div className="float-pill float-pill-available" style={{ top: '60%', left: '3%', '--r': '5deg', animation: 'floatB 6.5s ease-in-out infinite 1s' } as React.CSSProperties}>
          <span style={{ fontSize: '0.6rem' }}>●</span> mijncoach.nl
        </div>
        <div className="float-pill float-pill-checking" style={{ top: '15%', right: '5%', '--r': '-3deg', animation: 'floatB 8s ease-in-out infinite 1.5s' } as React.CSSProperties}>
          ✦ .nl .com .be .io
        </div>
        <div className="float-pill float-pill-available" style={{ top: '65%', right: '4%', '--r': '-4deg', animation: 'floatA 5.5s ease-in-out infinite 2s' } as React.CSSProperties}>
          <span style={{ fontSize: '0.6rem' }}>●</span> webshop-pro.nl
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-5 max-w-6xl">
        <div className="xl:grid xl:gap-16 xl:items-center" style={{ gridTemplateColumns: '1fr 320px' } as React.CSSProperties}>

          {/* Left: search content */}
          <div className="text-center xl:text-left">
            <div className="inline-flex items-center gap-2 mb-5">
              <span
                className="text-sm font-semibold px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(79,70,229,0.08)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(79,70,229,0.15)',
                  letterSpacing: '0.02em',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                ✦ Gratis &nbsp;·&nbsp; Geen account &nbsp;·&nbsp; Direct resultaat
              </span>
            </div>

            <h1 className="type-display mb-4" style={{ color: 'var(--text)' }}>
              Vind de perfecte{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                domeinnaam
              </span>
            </h1>

            <p className="type-lead mb-8 mx-auto xl:mx-0 max-w-xl">
              Voer één of meerdere keywords in, gescheiden door een komma — wij combineren ze slim en tonen alle beschikbare domeinen.
            </p>

            {parsedIntent && (
              <div
                className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(79,70,229,0.07)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
              >
                <span>✨ Zoeken op: <strong>{parsedIntent.keyword}</strong>
                  {parsedIntent.location && <> · {parsedIntent.location}</>}
                  {parsedIntent.industry && <> · {parsedIntent.industry}</>}
                </span>
                <button onClick={() => setParsedIntent(null)} style={{ opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto xl:mx-0 mb-3">
              <div
                className="flex rounded-xl overflow-hidden bg-white transition-all duration-200"
                style={{
                  border: focused ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                  boxShadow: focused ? 'var(--shadow-input), var(--shadow-md)' : 'var(--shadow-md)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="bijv. bakker · of · ik wil een bakkerij in amsterdam"
                  autoFocus
                  className="flex-1 bg-transparent px-5 py-4 text-base outline-none"
                  style={{ color: 'var(--text)' }}
                />
                <div className="p-1.5">
                  <button type="submit" className="btn-primary h-full" disabled={parsingIntent}>
                    {parsingIntent ? 'Analyseren…' : 'Zoeken →'}
                  </button>
                </div>
              </div>
              <p className="text-xs mt-2 text-left pl-1" style={{ color: 'var(--text-subtle)' }}>
                Typ een zin zoals <em>&ldquo;ik wil een bakkerij in amsterdam&rdquo;</em> — wij extraheren het juiste trefwoord.
              </p>
            </form>

            {recent.length > 0 && (
              <div className="mb-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>Eerder gezocht:</p>
                <div className="flex flex-wrap justify-center xl:justify-start gap-2">
                  {recent.map((kw) => (
                    <button key={kw} onClick={() => { setValue(kw); navigateSearch(kw); }} className="chip-ghost" style={{ fontSize: '12px' }}>
                      ↩ {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center xl:justify-start gap-2 mb-6">
              {popularKeywords.map((kw) => (
                <button key={kw} onClick={() => { setValue(kw); navigateSearch(kw); }} className="chip-ghost">
                  {kw}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-subtle)' }}>
              <span className="flex items-center gap-1.5"><span style={{ color: '#059669' }}>✓</span> Real-time RDAP-check</span>
              <span className="flex items-center gap-1.5"><span style={{ color: '#059669' }}>✓</span> EUIPO merkencheck</span>
              <span className="flex items-center gap-1.5"><span style={{ color: '#059669' }}>✓</span> 5 registrars vergeleken</span>
            </div>
          </div>

          {/* Right: browser mockup — xl only */}
          <div className="hidden xl:flex xl:justify-center xl:items-center">
            <BrowserMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
