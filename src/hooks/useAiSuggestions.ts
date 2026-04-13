'use client';

import { useState, useCallback, useRef } from 'react';

export interface AiSuggestion {
  name: string;
  rationale: string;
}

const STORAGE_KEY = 'cjd_ai_usage';
const MAX_PER_HOUR = 5;
const ONE_HOUR = 60 * 60 * 1000;

function getUsageTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    const now = Date.now();
    return parsed.filter((ts) => now - ts < ONE_HOUR);
  } catch {
    return [];
  }
}

function recordUsage(): void {
  const timestamps = getUsageTimestamps();
  timestamps.push(Date.now());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // ignore storage errors
  }
}

export function getRateLimitInfo(): { remaining: number; resetInMs: number } {
  const timestamps = getUsageTimestamps();
  const remaining = Math.max(0, MAX_PER_HOUR - timestamps.length);
  const oldest = timestamps[0];
  const resetInMs = oldest ? Math.max(0, ONE_HOUR - (Date.now() - oldest)) : 0;
  return { remaining, resetInMs };
}

export function useAiSuggestions() {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [resetInMs, setResetInMs] = useState(0);
  const [activeMode, setActiveMode] = useState<'creative' | 'closeness' | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (keyword: string, mode: 'creative' | 'closeness' = 'creative') => {
    // Client-side rate limit check
    const { remaining, resetInMs: reset } = getRateLimitInfo();
    if (remaining === 0) {
      setRateLimited(true);
      setResetInMs(reset);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setRateLimited(false);
    setSuggestions([]);
    setActiveMode(mode);

    recordUsage();

    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, mode }),
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
    setRateLimited(false);
    setActiveMode(null);
  }, []);

  return { suggestions, isLoading, error, rateLimited, resetInMs, activeMode, generate, clear };
}
