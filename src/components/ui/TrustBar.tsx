'use client';

import { useEffect, useRef, useState } from 'react';
import { REGISTRARS } from '@/lib/registrars';

const BASE_COUNT = 12000;
const STORAGE_KEY = 'cjd_checks';

function getCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const n = stored ? parseInt(stored, 10) : 0;
    const next = BASE_COUNT + (isNaN(n) ? 0 : n) + 1;
    localStorage.setItem(STORAGE_KEY, String(next - BASE_COUNT));
    return next;
  } catch {
    return BASE_COUNT;
  }
}

export default function TrustBar() {
  const [displayed, setDisplayed] = useState(BASE_COUNT);
  const targetRef = useRef(BASE_COUNT);

  useEffect(() => {
    const target = getCount();
    targetRef.current = target;
    const start = BASE_COUNT;
    const duration = 1200;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, []);

  const fmt = new Intl.NumberFormat('nl-NL').format(displayed);

  return (
    <div
      className="w-full py-3 px-5"
      style={{ background: 'white', borderBottom: '1px solid var(--border)' }}
    >
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Counter */}
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <span className="font-bold" style={{ color: 'var(--primary)' }}>{fmt}+</span>{' '}
          domeinen gecheckt
        </span>

        {/* Registrar strip */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          <span className="text-xs mr-1" style={{ color: 'var(--text-subtle)' }}>Registreer bij:</span>
          {REGISTRARS.slice(0, 5).map((r) => (
            <span
              key={r.id}
              className="text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}
            >
              {r.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
