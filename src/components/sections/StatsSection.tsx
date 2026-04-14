'use client';

import { AnimatedCounter } from '@/components/text/AnimatedCounter';

const STATS = [
  { value: 12000, suffix: '+', label: 'domeinen gecheckt' },
  { value: 50,    suffix: '+', label: 'extensies beschikbaar' },
  { value: 5,     suffix: '',  label: 'registrars vergeleken' },
  { value: 100,   suffix: '%', label: 'gratis & open' },
];

export default function StatsSection() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
        padding: '40px 20px',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                animation: 'fadeInUp 0.5s ease both',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="text-4xl font-black"
                style={{ letterSpacing: '-0.04em', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
              >
                <AnimatedCounter value={s.value} suffix={s.suffix} duration={1.0} />
              </div>
              <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
