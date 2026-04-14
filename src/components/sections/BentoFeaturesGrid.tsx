'use client';

import {
  BentoGrid,
  BentoTitle,
  BentoDescription,
} from '@/components/ui/bento-grid';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const FEATURES = [
  {
    id: 'rdap',
    icon: '🌐',
    title: 'Real-time RDAP',
    desc: 'Directe beschikbaarheidscheck via officiële SIDN-, Verisign- en DNS.be-registers. Geen verouderde data.',
    accent: 'rgba(79,70,229,0.05)',
    iconBg: 'rgba(79,70,229,0.10)',
    className: 'col-span-1 md:col-span-3 lg:col-span-2 border-b md:border-r',
  },
  {
    id: 'euipo',
    icon: '🏛️',
    title: 'EUIPO Merkencheck',
    desc: 'Uniek in Nederland: controleer of jouw merknaam al geregistreerd is als Europees handelsmerk.',
    accent: 'rgba(245,158,11,0.05)',
    iconBg: 'rgba(245,158,11,0.12)',
    className: 'col-span-1 md:col-span-3 lg:col-span-2 border-b lg:border-r',
  },
  {
    id: 'cart',
    icon: '🛒',
    title: 'Domeinwinkelmand',
    desc: 'Selecteer meerdere domeinen tegelijk en zie direct bij welke registrar je het goedkoopst uitbent.',
    accent: 'rgba(5,150,105,0.05)',
    iconBg: 'rgba(5,150,105,0.10)',
    className: 'col-span-1 md:col-span-6 lg:col-span-2 border-b',
  },
  {
    id: 'ai',
    icon: '✦',
    title: 'AI Naamgenerator',
    desc: 'Nog geen naam? Onze AI genereert 12 merknamen op basis van je sector en stijl — en checkt direct de beschikbaarheid.',
    accent: 'rgba(99,102,241,0.05)',
    iconBg: 'rgba(99,102,241,0.10)',
    className: 'col-span-1 md:col-span-2 md:border-r',
  },
  {
    id: 'kvk',
    icon: '💼',
    title: 'KVK Handelsnaam',
    desc: 'Check of je bedrijfsnaam al in gebruik is bij de Kamer van Koophandel — in één klik, naast de domeincheck.',
    accent: 'rgba(6,182,212,0.05)',
    iconBg: 'rgba(6,182,212,0.10)',
    className: 'col-span-1 md:col-span-2 md:border-r',
  },
  {
    id: 'portfolio',
    icon: '📊',
    title: 'Domeinportefeuille',
    desc: 'Houd al je domeinen bij op één plek. Zie wanneer ze verlopen, vergelijk verlengingsprijzen en bespaar geld.',
    accent: 'rgba(16,185,129,0.05)',
    iconBg: 'rgba(16,185,129,0.10)',
    className: 'col-span-1 md:col-span-2',
  },
];

export default function BentoFeaturesGrid() {
  return (
    <BentoGrid>
      {FEATURES.map((f) => (
        <SpotlightCard
          key={f.id}
          id={f.id}
          className={f.className}
          style={{ background: f.accent, borderColor: 'var(--border)' } as React.CSSProperties}
          spotlightColor={f.iconBg}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: f.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
              marginBottom: 12,
            }}
          >
            {f.icon}
          </div>
          <BentoTitle>{f.title}</BentoTitle>
          <BentoDescription>{f.desc}</BentoDescription>
        </SpotlightCard>
      ))}
    </BentoGrid>
  );
}
