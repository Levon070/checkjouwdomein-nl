'use client';

import { useState, useCallback } from 'react';

interface TypoResult {
  taken: string[];
  available: string[];
}

export function useTypoCheck() {
  const [result, setResult] = useState<TypoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (keyword: string) => {
    if (!keyword) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/check-typos?keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Fout bij ophalen');
      } else {
        setResult(data as TypoResult);
      }
    } catch {
      setError('Verbindingsfout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, check, reset };
}
