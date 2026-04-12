'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { getRegistrarsForTld } from '@/lib/registrars';
import { TldKey } from '@/types';
import Link from 'next/link';

export default function FavorietenPage() {
  const { favorites, remove } = useFavorites();

  return (
    <div className="container mx-auto px-5 max-w-3xl py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium link-muted mb-4 inline-block">
          ← Terug naar zoeken
        </Link>
        <h1 className="type-heading" style={{ color: 'var(--text)' }}>
          Mijn favoriete domeinen
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Domeinen die je hebt opgeslagen. Klik op een registrar om direct te registreren.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'white', border: '1px solid var(--border)' }}
        >
          <div className="text-4xl mb-4">♡</div>
          <p className="font-medium" style={{ color: 'var(--text)' }}>Nog geen favorieten opgeslagen</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Klik op het hartje op een domeinkaart om hem hier te bewaren.
          </p>
          <Link href="/" className="btn-primary inline-block mt-5 px-6 py-2.5 text-sm rounded-lg">
            Ga zoeken
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => {
            const registrars = getRegistrarsForTld(fav.tld as TldKey);
            return (
              <div
                key={fav.full}
                className="card p-4 available"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="domain-name font-bold text-base" style={{ color: 'var(--text)' }}>
                      {fav.name}
                      <span style={{ color: 'var(--primary)' }}>{fav.tld}</span>
                    </span>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      Opgeslagen op {new Date(fav.savedAt).toLocaleDateString('nl-NL')}
                      &nbsp;·&nbsp; Score: {fav.score}/100
                    </p>
                  </div>
                  <button
                    onClick={() => remove(fav.full)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(239,68,68,0.07)', color: '#EF4444' }}
                  >
                    ✕ Verwijder
                  </button>
                </div>

                {registrars.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {registrars.map((r) => (
                      <a
                        key={r.id}
                        href={r.affiliateUrl(fav.full)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="registrar-btn text-xs"
                      >
                        {r.name} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 flex gap-3">
            <button
              onClick={() => {
                const text = favorites.map((f) => f.full).join('\n');
                navigator.clipboard.writeText(text);
              }}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)' }}
            >
              ⎘ Kopieer alle domeinen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
