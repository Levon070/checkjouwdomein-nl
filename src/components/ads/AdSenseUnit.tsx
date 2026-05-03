'use client';

import { useEffect, useRef } from 'react';

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
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — publisher ID not configured
    }
  }, []);

  return (
    <div className={`adsense-wrapper my-4 ${className ?? ''}`} aria-label="Advertentie">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8874800268655239"
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  );
}
