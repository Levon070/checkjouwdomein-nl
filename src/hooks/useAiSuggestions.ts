'use client';

import { useState, useCallback, useRef } from 'react';

export interface AiSuggestion {
  name: string;
  rationale: string;
}

export function useAiSuggestions() {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (keyword: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Onbekende fout');
        return;
      }

      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('AI-suggesties tijdelijk niet beschikbaar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { suggestions, isLoading, error, generate, clear };
}
