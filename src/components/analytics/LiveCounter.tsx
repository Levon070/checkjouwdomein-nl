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
    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      <span className="text-emerald-400 font-semibold text-sm">{count ?? '—'}</span>
      <span className="text-slate-400 text-sm">live nu</span>
    </div>
  );
}
