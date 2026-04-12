'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeKeyword } from '@/lib/domain-generator';

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

interface Props {
  initialKeyword?: string;
}

export default function SearchHero({ initialKeyword = '' }: Props) {
  const [value, setValue] = useState(initialKeyword);
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const keywords = trimmed
      .split(/[,;]+/)
      .map((k) => sanitizeKeyword(k))
      .filter(Boolean);
    if (keywords.length === 0) return;
    const slug = keywords.join(',');
    saveRecentSearch(trimmed);
    setRecent(getRecentSearches());
    router.push(`/zoek/${encodeURIComponent(slug)}`);
  }

  function navigateSearch(raw: string) {
    const keywords = raw.split(/[,;]+/).map((k) => sanitizeKeyword(k)).filter(Boolean);
    if (keywords.length === 0) return;
    const slug = keywords.join(',');
    saveRecentSearch(raw);
    setRecent(getRecentSearches());
    router.push(`/zoek/${encodeURIComponent(slug)}`);
  }

  const popularKeywords = ['webshop', 'restaurant', 'freelancer', 'app', 'blog', 'coach'];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #EEF2FF 0%, #F6F8FC 50%, #ECFEFF 100%)',
        paddingTop: '72px',
        paddingBottom: '80px',
      }}
    >
      <div className="ambient-blob blob-hero-1" aria-hidden="true" />
      <div className="ambient-blob blob-hero-2" aria-hidden="true" />

      <div className="relative z-10 container mx-auto px-5 max-w-2xl text-center">

        <div className="inline-flex items-center gap-2 mb-5">
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(79,70,229,0.08)',
              color: 'var(--primary)',
              border: '1px solid rgba(79,70,229,0.15)',
              letterSpacing: '0.02em',
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

        <p className="type-lead mb-8 mx-auto max-w-xl">
          Voer één of meerdere keywords in, gescheiden door een komma — wij combineren ze slim en tonen alle beschikbare domeinen.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-3">
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
              placeholder="bijv. bakker  of  bakker, amsterdam"
              autoFocus
              className="flex-1 bg-transparent px-5 py-4 text-base outline-none"
              style={{ color: 'var(--text)' }}
            />
            <div className="p-1.5">
              <button type="submit" className="btn-primary h-full">
                Zoeken →
              </button>
            </div>
          </div>
          <p className="text-xs mt-2 text-left pl-1" style={{ color: 'var(--text-subtle)' }}>
            Meerdere keywords? Gebruik een komma — bijv. <em>bakker, amsterdam</em>
          </p>
        </form>

        {recent.length > 0 && (
          <div className="mb-5">
            <p className="text-xs mb-2" style={{ color: 'var(--text-subtle)' }}>Eerder gezocht:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {recent.map((kw) => (
                <button
                  key={kw}
                  onClick={() => { setValue(kw); navigateSearch(kw); }}
                  className="chip-ghost"
                  style={{ fontSize: '12px' }}
                >
                  ↩ {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => { setValue(kw); navigateSearch(kw); }}
              className="chip-ghost"
            >
              {kw}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
