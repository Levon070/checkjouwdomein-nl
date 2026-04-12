'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cjd_favorites';

export interface FavoriteItem {
  full: string;
  name: string;
  tld: string;
  score: number;
  savedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.full === item.full)) return prev;
      const next = [{ ...item, savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((full: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.full !== full);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (full: string) => favorites.some((f) => f.full === full),
    [favorites]
  );

  return { favorites, save, remove, isFavorite };
}
