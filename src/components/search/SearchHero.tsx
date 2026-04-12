'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeKeyword } from '@/lib/domain-generator';

interface Props {
  initialKeyword?: string;
}

export default function SearchHero({ initialKeyword = '' }: Props) {
  const [value, setValue] = useState(initialKeyword);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = sanitizeKeyword(value);
    if (!clean) return;
    router.push(`/zoek/${encodeURIComponent(clean)}`);
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
      {/* Ambient blobs */}
      <div className="ambient-blob blob-hero-1" aria-hidden="true" />
      <div className="ambient-blob blob-hero-2" aria-hidden="true" />

      <div className="relative z-10 container mx-auto px-5 max-w-2xl text-center">

        {/* Badge */}
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

        {/* Headline */}
        <h1
          className="type-display mb-4"
          style={{ color: 'var(--text)' }}
        >
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
          Voer een keyword in en ontdek alle beschikbare domeinnamen — gesorteerd op kwaliteitsscore.
          Vergelijk direct bij alle registrars.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-5">
          <div
            className="flex rounded-xl overflow-hidden bg-white transition-all duration-200"
            style={{
              border: focused
                ? '1.5px solid var(--primary)'
                : '1.5px solid var(--border)',
              boxShadow: focused
                ? 'var(--shadow-input), var(--shadow-md)'
                : 'var(--shadow-md)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="bijv. bakker, webshop of amsterdam"
              autoFocus
              className="flex-1 bg-transparent px-5 py-4 text-base outline-none"
              style={{
                color: 'var(--text)',
              }}
            />
            <div className="p-1.5">
              <button type="submit" className="btn-primary h-full">
                Zoeken →
              </button>
            </div>
          </div>
        </form>

        {/* Popular keywords */}
        <div className="flex flex-wrap justify-center gap-2">
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => {
                setValue(kw);
                router.push(`/zoek/${kw}`);
              }}
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
