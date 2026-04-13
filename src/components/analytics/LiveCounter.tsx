'use client';

import { useState, useEffect } from 'react';

export default function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = () => {
      fetch('/api/analytics/live')
        .then((r) => r.json())
        .then((d) => setCount(d.count))
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <span className="text-emerald-400 font-semibold text-sm tabular-nums">{count ?? '—'}</span>
      <span className="text-emerald-600 text-xs">live</span>
    </div>
  );
}
