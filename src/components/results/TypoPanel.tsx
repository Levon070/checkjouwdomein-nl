'use client';

import { useRef } from 'react';
import { useTypoCheck } from '@/hooks/useTypoCheck';

interface Props {
  keyword: string;
}

export default function TypoPanel({ keyword }: Props) {
  const { result, isLoading, error, check } = useTypoCheck();
  const checked = useRef(false);

  function handleOpen() {
    if (!checked.current) {
      checked.current = true;
      check(keyword);
    }
  }

  return (
    <details className="mt-2" onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) handleOpen(); }}>
      <summary
        className="cursor-pointer text-sm font-medium select-none w-fit flex items-center gap-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>🛡️ Controleer typovarianten</span>
        {result && (
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: result.taken.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(5,150,105,0.08)', color: result.taken.length > 0 ? '#EF4444' : 'var(--available)' }}
          >
            {result.taken.length} risico
          </span>
        )}
      </summary>

      <div className="mt-3 space-y-4">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Spelvarianten van <strong>{keyword}</strong> — bezet = merkbeschermingsrisico, vrij = kans om zelf te registreren.
        </p>

        {isLoading && (
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-7 w-24 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>
        )}

        {result && (
          <>
            {result.taken.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#EF4444' }}>
                  Bezette typovarianten — risico voor jouw merk
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.taken.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: 'rgba(239,68,68,0.07)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.available.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--available)' }}>
                  Vrije typovarianten — bescherm je merk
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.available.map((d) => (
                    <a
                      key={d}
                      href={`https://www.transip.nl/domein-registreren/?domain=${d}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                      style={{ background: 'rgba(5,150,105,0.07)', color: 'var(--available)', border: '1px solid rgba(5,150,105,0.2)' }}
                    >
                      {d} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            {result.taken.length === 0 && result.available.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Geen relevante typovarianten gevonden.</p>
            )}
          </>
        )}
      </div>
    </details>
  );
}
