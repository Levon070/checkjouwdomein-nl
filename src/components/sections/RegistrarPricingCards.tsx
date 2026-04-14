'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { REGISTRARS } from '@/lib/registrars';

const TOP_THREE = [
  {
    id: 'transip',
    badge: 'Beste algeheel',
    popular: true,
    inverse: true,
    highlight: ['Gratis WHOIS-privacy', 'Krachtige API', 'Nederlandstalige support', 'Duidelijk controlepaneel', 'Betrouwbaar & groot'],
  },
  {
    id: 'mijndomein',
    badge: 'Goedkoopste .nl',
    popular: false,
    inverse: false,
    highlight: ['Laagste .nl-prijs (±€2,99/jr)', 'Simpel paneel', 'Snel opgezet', 'Geschikt voor starters'],
  },
  {
    id: 'antagonist',
    badge: 'Beste klantenservice',
    popular: false,
    inverse: false,
    highlight: ['Telefoon + chat + e-mail', 'Gratis WHOIS-privacy', 'Transparante pricing', 'DirectAdmin paneel'],
  },
];

export default function RegistrarPricingCards() {
  return (
    <div className="flex flex-col gap-6 items-center lg:flex-row lg:items-end lg:justify-center">
      {TOP_THREE.map(({ id, badge, popular, inverse, highlight }) => {
        const r = REGISTRARS.find((reg) => reg.id === id)!;
        const nlPrice = r.detailedPrices['.nl'];
        const comPrice = r.detailedPrices['.com'];

        return (
          <div
            key={id}
            className="max-w-xs w-full rounded-2xl border overflow-hidden"
            style={{
              background: inverse ? 'linear-gradient(135deg, #4F46E5 0%, #3730a3 100%)' : 'var(--bg-card)',
              borderColor: inverse ? 'transparent' : 'var(--border)',
              boxShadow: inverse ? '0 20px 60px rgba(79,70,229,0.25)' : 'var(--shadow-sm)',
              transform: inverse ? 'scale(1.03)' : 'none',
            }}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-sm font-bold"
                  style={{ color: inverse ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
                >
                  {r.name}
                </span>

                {popular && (
                  <motion.div
                    animate={{ backgroundPositionX: '-100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      background: 'linear-gradient(to right, #a78bfa, #f0abfc, #93c5fd, #a78bfa)',
                      backgroundSize: '200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    {badge}
                  </motion.div>
                )}

                {!popular && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(79,70,229,0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    {badge}
                  </span>
                )}
              </div>

              {/* Prices */}
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-3xl font-black"
                  style={{ color: inverse ? 'white' : 'var(--text)', letterSpacing: '-0.04em' }}
                >
                  {nlPrice?.firstYear ?? '—'}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: inverse ? 'rgba(255,255,255,0.6)' : 'var(--text-subtle)' }}
                >
                  /jaar .nl
                </span>
              </div>
              {nlPrice && (
                <p
                  className="text-xs mb-4"
                  style={{ color: inverse ? 'rgba(255,255,255,0.55)' : 'var(--text-subtle)' }}
                >
                  verlenging {nlPrice.renewal}
                  {comPrice ? ` · .com ${comPrice.firstYear}` : ''}
                </p>
              )}

              <a
                href={r.affiliateUrl('jouwdomein.nl')}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: inverse ? 'rgba(255,255,255,0.15)' : 'var(--primary)',
                  color: inverse ? 'white' : 'white',
                  textDecoration: 'none',
                  border: inverse ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                Naar {r.name} →
              </a>
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${inverse ? 'rgba(255,255,255,0.12)' : 'var(--border)'}` }} />

            {/* Feature list */}
            <ul className="p-6 pt-4 space-y-3">
              {highlight.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check
                    size={13}
                    strokeWidth={3}
                    style={{ color: inverse ? 'rgba(255,255,255,0.7)' : 'var(--available)', flexShrink: 0 }}
                  />
                  <span style={{ color: inverse ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
