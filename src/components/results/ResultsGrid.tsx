'use client';

import { useEffect, useState } from 'react';
import { useDomainSearch } from '@/hooks/useDomainSearch';
import DomainCard from './DomainCard';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { TldKey } from '@/types';
import { ORDERED_TLDS, TLD_CONFIG } from '@/lib/tlds';

interface Props {
  keyword: string;
}

export default function ResultsGrid({ keyword }: Props) {
  const {
    availableResults,
    takenResults,
    isLoading,
    checkedCount,
    total,
    search,
    updateSelectedTlds,
    checkSocial,
  } = useDomainSearch();

  const [localTlds, setLocalTlds] = useState<TldKey[]>([...ORDERED_TLDS]);

  useEffect(() => {
    if (keyword) search(keyword);
  }, [keyword, search]);

  function toggleTld(tld: TldKey) {
    const next = localTlds.includes(tld)
      ? localTlds.filter((t) => t !== tld)
      : [...localTlds, tld];
    if (next.length === 0) return; // always keep at least one
    setLocalTlds(next);
    updateSelectedTlds(next);
    search(keyword, next);
  }

  if (total === 0 && !isLoading) return null;

  const progressPct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* TLD Filter */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
      >
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Extensies filteren
        </p>
        <div className="flex flex-wrap gap-2">
          {ORDERED_TLDS.map((tld) => {
            const active = localTlds.includes(tld);
            const cfg = TLD_CONFIG[tld];
            return (
              <button
                key={tld}
                onClick={() => toggleTld(tld)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? 'rgba(79,70,229,0.1)' : 'rgba(0,0,0,0.04)',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  border: active ? '1.5px solid rgba(79,70,229,0.3)' : '1.5px solid transparent',
                }}
              >
                {cfg.flag && <span aria-hidden="true">{cfg.flag}</span>}
                {tld}
              </button>
            );
          })}
          <button
            onClick={() => {
              setLocalTlds([...ORDERED_TLDS]);
              updateSelectedTlds([...ORDERED_TLDS]);
              search(keyword, [...ORDERED_TLDS]);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ color: 'var(--text-subtle)', background: 'transparent' }}
          >
            Alles selecteren
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isLoading && (
        <div className="space-y-2">
          <div
            className="flex justify-between text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>Beschikbaarheid controleren…</span>
            <span>{checkedCount} / {total}</span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.07)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 progress-glow"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              }}
            />
          </div>
        </div>
      )}

      {/* Available domains */}
      {availableResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--available)' }}>
              Beschikbare domeinen
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(5, 150, 105, 0.08)', color: 'var(--available)' }}
            >
              {availableResults.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableResults.map((s, i) => (
              <>
                <DomainCard key={s.full} suggestion={s} onCheckSocial={checkSocial} />
                {i === 5 && (
                  <div key="ad-infeed" className="md:col-span-2">
                    <AdSenseUnit slot="IN_FEED_AD_SLOT" format="responsive" />
                  </div>
                )}
              </>
            ))}
          </div>
        </section>
      )}

      {/* Skeletons while loading */}
      {isLoading && availableResults.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      )}

      {/* Taken domains (collapsed) */}
      {takenResults.length > 0 && !isLoading && (
        <details className="mt-2">
          <summary
            className="cursor-pointer text-sm font-medium select-none w-fit"
            style={{ color: 'var(--text-muted)' }}
          >
            Toon bezette domeinen ({takenResults.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {takenResults.map((s) => (
              <DomainCard key={s.full} suggestion={s} onCheckSocial={checkSocial} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
