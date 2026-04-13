'use client';

import { useState } from 'react';

interface Props {
  score: number;
}

export default function ScoreIndicator({ score }: Props) {
  const pct = Math.min(100, Math.max(0, score));
  const label =
    pct >= 80 ? 'Uitstekend' : pct >= 60 ? 'Goed' : pct >= 40 ? 'Redelijk' : 'Matig';
  const color =
    pct >= 80 ? 'var(--available)' : pct >= 60 ? '#0891B2' : 'var(--primary)';

  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div
        className="flex-1 max-w-[72px] h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--primary), ${color})`,
          }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>

      {/* Tooltip trigger */}
      <div className="relative">
        <button
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
          aria-label="Uitleg score"
          className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-xs leading-none transition-colors"
          style={{
            background: 'rgba(0,0,0,0.08)',
            color: 'var(--text-subtle)',
            fontSize: '0.6rem',
            fontWeight: 700,
          }}
        >
          ?
        </button>

        {showTip && (
          <div
            className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-lg p-3 text-xs leading-relaxed"
            style={{
              background: 'var(--text)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              pointerEvents: 'none',
            }}
          >
            <p className="font-semibold mb-1.5">Hoe wordt de score berekend?</p>
            <ul className="space-y-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <li>📏 <strong>Lengte</strong> — korter scoort beter</li>
              <li>🌍 <strong>Extensie</strong> — .nl en .com scoren het hoogst</li>
              <li>🔑 <strong>Trefwoord</strong> — domein bevat je zoekopdracht</li>
              <li>☎ <strong>Uitspraak</strong> — goed uitsprekbaar</li>
              <li>➖ <strong>Koppelteken</strong> — kleine straf voor streepjes</li>
            </ul>
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `5px solid var(--text)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
