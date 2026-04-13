'use client';

import { useState, useCallback, useRef } from 'react';
import { generateDomainSuggestions, sanitizeKeyword } from '@/lib/domain-generator';
import { scoreDomain } from '@/lib/domain-scorer';
import { DomainSuggestion, DomainStatus, TldKey } from '@/types';
import { ORDERED_TLDS } from '@/lib/tlds';

const CONCURRENT_CHECKS = 12;

export function useDomainSearch() {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [selectedTlds, setSelectedTlds] = useState<TldKey[]>([...ORDERED_TLDS]);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (kw: string, tlds?: TldKey[]) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    const activeTlds = tlds ?? selectedTlds;

    setIsLoading(true);
    setCheckedCount(0);
    setKeyword(kw);

    const generated = generateDomainSuggestions(kw, activeTlds);

    const initial: DomainSuggestion[] = generated.map((g) => {
      const { score, breakdown, pronunciationScore } = scoreDomain(g.name, g.tld, g.primaryKeyword);
      return {
        name: g.name,
        tld: g.tld as TldKey,
        full: g.full,
        score,
        scoreBreakdown: breakdown,
        pronunciationScore,
        status: 'checking' as DomainStatus,
        wasDropped: false,
        socialHandleAvailable: null,
      };
    });

    setSuggestions(initial);

    const chunks = chunkArray(initial, CONCURRENT_CHECKS);

    for (const chunk of chunks) {
      if (signal.aborted) break;

      await Promise.all(
        chunk.map(async (s) => {
          if (signal.aborted) return;
          try {
            const res = await fetch(
              `/api/check-domain?name=${encodeURIComponent(s.name)}&tld=${encodeURIComponent(s.tld)}`,
              { signal }
            );
            const data = await res.json();
            setSuggestions((prev) =>
              prev.map((item) =>
                item.full === s.full
                  ? {
                      ...item,
                      status: data.status as DomainStatus,
                      wasDropped: data.wasDropped ?? false,
                      expiresAt: data.expiresAt ?? undefined,
                      hasMx: data.hasMx,
                      wayback: data.wayback ?? undefined,
                    }
                  : item
              )
            );
          } catch {
            if (!signal.aborted) {
              setSuggestions((prev) =>
                prev.map((item) =>
                  item.full === s.full ? { ...item, status: 'error' as DomainStatus } : item
                )
              );
            }
          }
          setCheckedCount((c) => c + 1);
        })
      );
    }

    setIsLoading(false);
  }, [selectedTlds]);

  /** Fetch social media availability for a single domain name (lazy, on demand) */
  const checkSocial = useCallback(async (name: string) => {
    try {
      const res = await fetch(`/api/check-social?handle=${encodeURIComponent(name)}`);
      if (!res.ok) return null;
      const data = await res.json();
      setSuggestions((prev) =>
        prev.map((item) =>
          item.name === name
            ? {
                ...item,
                socialHandleAvailable:
                  data.instagram === 'available' || data.twitter === 'available',
              }
            : item
        )
      );
      return data;
    } catch {
      return null;
    }
  }, []);

  const updateSelectedTlds = useCallback((tlds: TldKey[]) => {
    setSelectedTlds(tlds);
  }, []);

  // Quality-filtered available results (no hyphens, score >= 55)
  const availableResults = suggestions
    .filter((s) => s.status === 'available' && !s.name.includes('-') && s.score >= 55)
    .sort((a, b) => b.score - a.score);

  // Tier grouping for progressive disclosure
  const topResults = availableResults.filter((s) => s.score >= 80);
  const goodResults = availableResults.filter((s) => s.score >= 60 && s.score < 80);
  const moreResults = [
    ...availableResults.filter((s) => s.score < 60),
    ...suggestions
      .filter((s) => s.status === 'available' && s.name.includes('-'))
      .sort((a, b) => b.score - a.score),
  ];

  const takenResults = suggestions.filter((s) => s.status === 'taken');
  const checkingResults = suggestions.filter((s) => s.status === 'checking');

  const cleanKeyword = sanitizeKeyword(keyword);

  const exactTakenTlds = suggestions
    .filter((s) => s.name === cleanKeyword && s.status === 'taken')
    .map((s) => s.tld);

  return {
    suggestions,
    availableResults,
    topResults,
    goodResults,
    moreResults,
    takenResults,
    checkingResults,
    isLoading,
    checkedCount,
    total: suggestions.length,
    keyword,
    selectedTlds,
    updateSelectedTlds,
    search,
    checkSocial,
    exactTakenTlds,
  };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}
