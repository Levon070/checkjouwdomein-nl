'use client';

import { useState, useCallback } from 'react';

interface KvkResult {
  found: boolean | null;
  count: number | null;
  kvkUrl: string;
}

// Module-level cache to avoid re-checking within a session
const sessionCache = new Map<string, KvkResult>();

export function useKvkCheck() {
  const [results, setResults] = useState<Map<string, KvkResult>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const check = useCallback(async (name: string) => {
    if (sessionCache.has(name)) {
      setResults((prev) => new Map(prev).set(name, sessionCache.get(name)!));
      return;
    }

    setLoading((prev) => new Set(prev).add(name));
    try {
      const res = await fetch(`/api/check-kvk?name=${encodeURIComponent(name)}`);
      const data: KvkResult = await res.json();
      sessionCache.set(name, data);
      setResults((prev) => new Map(prev).set(name, data));
    } catch {
      // ignore
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  }, []);

  const getResult = useCallback((name: string) => results.get(name) ?? null, [results]);
  const isLoading = useCallback((name: string) => loading.has(name), [loading]);

  return { check, getResult, isLoading };
}
