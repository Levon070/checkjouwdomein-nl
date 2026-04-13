'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import WatchlistModal from './WatchlistModal';

export default function WatchlistButton() {
  const [open, setOpen] = useState(false);
  const { watchlist } = useWatchlist();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Mijn domein-alerts"
        className="link-nav flex items-center gap-1"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        🔔{watchlist.length > 0 && (
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#D97706', fontSize: '0.6rem' }}
          >
            {watchlist.length}
          </span>
        )}
      </button>
      <WatchlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
