'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CartItem, TldKey } from '@/types';

const STORAGE_KEY = 'cjd_cart';
const CART_EVENT = 'cjd-cart-change';

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (items.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function useDomainCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Initial load
    setItems(readStorage());

    // Stay in sync with other useDomainCart instances on the same page
    function onCartChange() {
      setItems(readStorage());
    }
    window.addEventListener(CART_EVENT, onCartChange);
    return () => window.removeEventListener(CART_EVENT, onCartChange);
  }, []);

  const add = useCallback((item: { full: string; name: string; tld: TldKey; score: number }) => {
    setItems((prev) => {
      if (prev.find((c) => c.full === item.full)) return prev;
      const next = [{ ...item, addedAt: new Date().toISOString() }, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const remove = useCallback((full: string) => {
    setItems((prev) => {
      const next = prev.filter((c) => c.full !== full);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  const isInCart = useCallback(
    (full: string) => items.some((c) => c.full === full),
    [items]
  );

  return { items, add, remove, clear, isInCart, count: items.length };
}
