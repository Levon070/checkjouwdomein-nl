'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DomainSuggestion, DomainStatus, TldKey } from '@/types';
import { scoreDomain } from '@/lib/domain-scorer';

const CONCURRENT_CHECKS = 12;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

export function useSmartAlternatives(
  keyword: string,
  selectedTlds: TldKey[],
  enabled: boolean
) {
  const [results, setResults] = useState<DomainSuggestion[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isCheckingDomains, setIsCheckingDomains] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalToCheck, setTotalToCheck] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const abortRef = useRef<AbortController | null>(null);

  const checkAvailability = useCallback(async (
    names: string[],
    tlds: TldKey[],
    signal: AbortSignal
  ) => {
    const pairs: Array<{ name: string; tld: TldKey; full: string }> = [];
    for (const name of names) {
      for (const tld of tlds) {
        pairs.push({ name, tld, full: `${name}${tld}` });
      }
    }

    setIsCheckingDomains(true);
    setCheckedCount(0);
    setTotalToCheck(pairs.length);

    // Initialise all as 'checking'
    const initial: DomainSuggestion[] = pairs.map(({ name, tld, full }) => {
      const { score, breakdown, pronunciationScore } = scoreDomain(name, tld, keyword);
      return {
        name,
        tld,
        full,
        score,
        scoreBreakdown: breakdown,
        pronunciationScore,
        status: 'checking' as DomainStatus,
        wasDropped: false,
        socialHandleAvailable: null,
      };
    });
    setResults(initial);

    const chunks = chunkArray(pairs, CONCURRENT_CHECKS);

    for (const chunk of chunks) {
      if (signal.aborted) break;

      await Promise.all(
        chunk.map(async ({ name, tld, full }) => {
          if (signal.aborted) return;
          try {
            const res = await fetch(
              `/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`,
              { signal }
            );
            const data = await res.json();
            setResults((prev) =>
              prev.map((item) =>
                item.full === full
                  ? { ...item, status: data.status as DomainStatus, wasDropped: data.wasDropped ?? false }
                  : item
              )
            );
          } catch {
            if (!signal.aborted) {
              setResults((prev) =>
                prev.map((item) =>
                  item.full === full ? { ...item, status: 'error' as DomainStatus } : item
                )
              );
            }
          }
          setCheckedCount((c) => c + 1);
        })
      );
    }

    setIsCheckingDomains(false);
  }, [keyword]);

  const fetchCandidates = useCallback(async (currentSeed: number) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setIsLoadingAi(true);
    setError(null);
    setResults([]);
    setCandidates([]);

    try {
      const res = await fetch('/api/smart-alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, seed: currentSeed }),
        signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Onbekende fout');
        setIsLoadingAi(false);
        return;
      }

      const names: string[] = data.names ?? [];
      setCandidates(names);
      setIsLoadingAi(false);

      if (names.length > 0) {
        await checkAvailability(names, selectedTlds, signal);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('AI tijdelijk niet beschikbaar');
      setIsLoadingAi(false);
    }
  }, [keyword, selectedTlds, checkAvailability]);

  // Trigger when enabled flips to true or keyword changes
  useEffect(() => {
    if (!enabled || !keyword) return;
    setSeed(1);
    fetchCandidates(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, keyword]);

  // Re-check availability when TLD selection changes (but don't re-ask Claude)
  useEffect(() => {
    if (!enabled || candidates.length === 0 || isLoadingAi) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    checkAvailability(candidates, selectedTlds, abortRef.current.signal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTlds]);

  const retrySmartSearch = useCallback(() => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    fetchCandidates(nextSeed);
  }, [seed, fetchCandidates]);

  const availableResults = results
    .filter((r) => r.status === 'available')
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const canRetry = !isLoadingAi && !isCheckingDomains && availableResults.length < 3 && seed < 5;

  return {
    results,
    availableResults,
    isLoadingAi,
    isCheckingDomains,
    checkedCount,
    totalToCheck,
    canRetry,
    retrySmartSearch,
    error,
  };
}
