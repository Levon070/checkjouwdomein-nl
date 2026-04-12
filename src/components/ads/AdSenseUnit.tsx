'use client';

import { useEffect } from 'react';

interface Props {
  slot: string;
  format?: 'leaderboard' | 'rectangle' | 'responsive';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseUnit({ slot, format = 'responsive', className }: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <div className={`adsense-wrapper my-4 ${className ?? ''}`} aria-label="Advertentie">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-JOUW_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  );
}
