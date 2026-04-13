'use client';

import { useEffect, useState, Fragment } from 'react';
import { useDomainSearch } from '@/hooks/useDomainSearch';
import { useAiSuggestions } from '@/hooks/useAiSuggestions';
import { useSmartAlternatives } from '@/hooks/useSmartAlternatives';
import DomainCard from './DomainCard';
import TypoPanel from './TypoPanel';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { TldKey } from '@/types';
import { ORDERED_TLDS, TLD_CONFIG } from '@/lib/tlds';
import { matchIndustry, getRelatedKeywords } from '@/lib/industry-matcher';

interface Props {
  keyword: string;
}

export default function ResultsGrid({ keyword }: Props) {
  const {
    availableResults,
    topResults,
    goodResults,
    moreResults,
    takenResults,
    isLoading,
    checkedCount,
    total,
    search,
    updateSelectedTlds,
    checkSocial,
    exactTakenTlds,
  } = useDomainSearch();

  const { suggestions: aiSuggestions, isLoading: aiLoading, rateLimited, resetInMs, generate: generateAi } = useAiSuggestions();

  const [localTlds, setLocalTlds] = useState<TldKey[]>([...ORDERED_TLDS]);

  // Industry keyword suggestions
  const matchedIndustry = matchIndustry(keyword);
  const relatedKeywords = matchedIndustry ? getRelatedKeywords(matchedIndustry) : [];

  useEffect(() => {
    if (keyword) search(keyword);
  }, [keyword, search]);

  // Derive banner state
  const isSearchFarEnough = total > 0 && (checkedCount / total >= 0.8 || !isLoading);
  const primaryTakenTld = exactTakenTlds.includes('.nl' as TldKey) ? '.nl'
    : exactTakenTlds.includes('.com' as TldKey) ? '.com'
    : exactTakenTlds[0] ?? null;
  const showExactTakenBanner = isSearchFarEnough && primaryTakenTld !== null;

  const {
    availableResults: smartResults,
    isLoadingAi: smartLoadingAi,
    isCheckingDomains: smartChecking,
    checkedCount: smartChecked,
    totalToCheck: smartTotal,
    canRetry: smartCanRetry,
    retrySmartSearch,
  } = useSmartAlternatives(keyword, localTlds, showExactTakenBanner);

  function toggleTld(tld: TldKey) {
    const next = localTlds.includes(tld)
      ? localTlds.filter((t) => t !== tld)
      : [...localTlds, tld];
    if (next.length === 0) return;
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

      {/* Industry keyword chips */}
      {relatedKeywords.length > 0 && !showExactTakenBanner && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Zoek ook op:</span>
          {relatedKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => search(kw, localTlds)}
              className="text-xs px-2.5 py-1 rounded-lg transition-all duration-150"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.07)' }}
              onMouseEnter={(e) => { (e.currentTarget).style.color = 'var(--primary)'; (e.currentTarget).style.borderColor = 'rgba(79,70,229,0.25)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.color = 'var(--text-muted)'; (e.currentTarget).style.borderColor = 'rgba(0,0,0,0.07)'; }}
            >
              {kw}
            </button>
          ))}
        </div>
      )}

      {/* AI Suggestions — subtle row (only in normal/creative mode) */}
      {!showExactTakenBanner && (
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>✨</span>
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            AI-namen:
          </span>

          {aiSuggestions.length === 0 && !rateLimited && (
            <button
              onClick={() => generateAi(keyword)}
              disabled={aiLoading}
              className="text-xs transition-colors duration-150"
              style={{
                color: aiLoading ? 'var(--text-subtle)' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: aiLoading ? 'default' : 'pointer',
                textDecoration: aiLoading ? 'none' : 'underline',
                textDecorationStyle: 'dotted',
                textUnderlineOffset: '3px',
              }}
            >
              {aiLoading ? 'bezig…' : 'suggesties genereren'}
            </button>
          )}

          {rateLimited && (
            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              limiet bereikt — probeer over {Math.ceil(resetInMs / 60000)} min opnieuw
            </span>
          )}

          {aiSuggestions.length > 0 && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {aiSuggestions.map((s) => (
                  <button
                    key={s.name}
                    title={s.rationale}
                    onClick={() => search(s.name, localTlds)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(0,0,0,0.03)',
                      color: 'var(--text-muted)',
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(79,70,229,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.08)';
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              {!rateLimited && (
                <button
                  onClick={() => generateAi(keyword)}
                  className="text-xs transition-colors duration-150"
                  style={{
                    color: 'var(--text-subtle)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dotted',
                    textUnderlineOffset: '3px',
                  }}
                >
                  ↻
                </button>
              )}
            </>
          )}
        </div>
      )}

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

      {/* Exact domain taken banner */}
      {showExactTakenBanner && (
        <div
          role="alert"
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.18)' }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>🔒</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--taken)' }}>
              {keyword}{primaryTakenTld} is al bezet
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Bekijk hieronder de dichtstbijzijnde beschikbare alternatieven.
            </p>
          </div>
        </div>
      )}

      {/* Smart alternatives section (AI-curated + RDAP-verified) */}
      {showExactTakenBanner && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              Dichtstbijzijnde beschikbare opties
            </span>
            {(smartLoadingAi || smartChecking) && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {smartLoadingAi ? 'AI denkt na…' : `${smartChecked}/${smartTotal} gecontroleerd`}
              </span>
            )}
            {smartResults.length > 0 && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)' }}
              >
                {smartResults.length}
              </span>
            )}
            {smartCanRetry && (
              <button
                onClick={retrySmartSearch}
                className="text-xs transition-colors"
                style={{
                  color: 'var(--text-subtle)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'dotted',
                  textUnderlineOffset: '3px',
                }}
              >
                ↻ Meer zoeken
              </button>
            )}
          </div>

          {/* Skeleton while AI is generating */}
          {smartLoadingAi && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          )}

          {/* Domain cards */}
          {smartResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {smartResults.map((s) => (
                <DomainCard key={s.full} suggestion={s} onCheckSocial={checkSocial} />
              ))}
            </div>
          )}

          {/* No results yet but checking */}
          {!smartLoadingAi && smartChecking && smartResults.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          )}

          {/* No results at all */}
          {!smartLoadingAi && !smartChecking && smartResults.length === 0 && !smartCanRetry && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Geen dichtstbijzijnde alternatieven gevonden voor de geselecteerde extensies.
            </p>
          )}
        </section>
      )}

      {/* Tier 1 — Beste keuze (score ≥ 80) */}
      {topResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--available)' }}>
              Beste keuze
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--available)' }}
            >
              {topResults.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topResults.map((s, i) => (
              <Fragment key={s.full}>
                <DomainCard suggestion={s} onCheckSocial={checkSocial} />
                {i === 5 && (
                  <div className="md:col-span-2">
                    <AdSenseUnit slot="IN_FEED_AD_SLOT" format="responsive" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {/* Tier 2 — Goed alternatief (score 60–79) */}
      {goodResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Goed alternatief
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}
            >
              {goodResults.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goodResults.map((s) => (
              <DomainCard key={s.full} suggestion={s} onCheckSocial={checkSocial} />
            ))}
          </div>
        </section>
      )}

      {/* Tier 3 — Meer opties (score < 60 or hyphenated, collapsed) */}
      {moreResults.length > 0 && !isLoading && (
        <details className="mt-1">
          <summary
            className="cursor-pointer text-sm font-medium select-none w-fit"
            style={{ color: 'var(--text-subtle)' }}
          >
            Meer opties ({moreResults.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {moreResults.map((s) => (
              <DomainCard key={s.full} suggestion={s} onCheckSocial={checkSocial} />
            ))}
          </div>
        </details>
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

      {/* Typosquatting panel — shown when there are available results */}
      {availableResults.length > 0 && !isLoading && (
        <TypoPanel keyword={keyword} />
      )}
    </div>
  );
}
