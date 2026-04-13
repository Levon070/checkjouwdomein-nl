'use client';

import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesButton() {
  const { favorites } = useFavorites();

  return (
    <Link
      href="/favorieten"
      title="Mijn favoriete domeinen"
      className="link-nav flex items-center gap-1"
    >
      ♡
      {favorites.length > 0 && (
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontSize: '0.6rem' }}
        >
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
