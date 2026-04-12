'use client';

import { useEffect } from 'react';
import { useDomainSearch } from '@/hooks/useDomainSearch';
import DomainCard from './DomainCard';
import AdSenseUnit from '@/components/ads/AdSenseUnit';

interface Props {
  keyword: string;
}

export default function ResultsGrid({ keyword }: Props) {
  const { availableResults, takenResults, isLoading, checkedCount, total, search } =
    useDomainSearch();

  useEffect(() => {
    if (keyword) search(keyword);
  }, [keyword, search]);

  if (total === 0) return null;

  const progressPct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
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
              style={{
                background: 'rgba(5, 150, 105, 0.08)',
                color: 'var(--available)',
              }}
            >
              {availableResults.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableResults.map((s, i) => (
              <>
                <DomainCard key={s.full} suggestion={s} />
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
              <DomainCard key={s.full} suggestion={s} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
