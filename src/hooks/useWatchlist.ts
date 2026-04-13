'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cjd_watchlist';
const EMAIL_KEY = 'cjd_watchlist_email';

export interface WatchItem {
  full: string;
  name: string;
  tld: string;
  addedAt: string;
  expiresAt?: string;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);
  const [email, setEmailState] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWatchlist(JSON.parse(raw));
      const storedEmail = localStorage.getItem(EMAIL_KEY);
      if (storedEmail) setEmailState(storedEmail);
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback((item: Omit<WatchItem, 'addedAt'>) => {
    setWatchlist((prev) => {
      if (prev.find((w) => w.full === item.full)) return prev;
      const next = [{ ...item, addedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    // Sync to server if email is set
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    if (storedEmail) {
      fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, domain: item.full }),
      }).catch(() => {});
    }
  }, []);

  const remove = useCallback((full: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((w) => w.full !== full);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    const storedEmail = localStorage.getItem(EMAIL_KEY);
    if (storedEmail) {
      fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, domain: full }),
      }).catch(() => {});
    }
  }, []);

  const isWatched = useCallback(
    (full: string) => watchlist.some((w) => w.full === full),
    [watchlist]
  );

  const saveEmail = useCallback(async (newEmail: string) => {
    localStorage.setItem(EMAIL_KEY, newEmail);
    setEmailState(newEmail);

    // Sync all current watchlist items to server
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as WatchItem[];
    for (const item of current) {
      try {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newEmail, domain: item.full }),
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const clearEmail = useCallback(() => {
    localStorage.removeItem(EMAIL_KEY);
    setEmailState('');
  }, []);

  return { watchlist, add, remove, isWatched, email, saveEmail, clearEmail };
}
