'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cjd_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-instellingen"
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(560px, calc(100vw - 32px))',
        background: 'white',
        border: '1px solid rgba(0,0,0,0.10)',
        borderRadius: 16,
        boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
        padding: '20px 24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>🍪</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A0C14', marginBottom: 4 }}>
            Wij gebruiken cookies
          </p>
          <p style={{ fontSize: '0.825rem', color: '#5B6070', lineHeight: 1.55 }}>
            CheckJouwDomein.nl gebruikt functionele cookies en, zodra goedgekeurd, advertentiecookies via Google AdSense.
            Jouw gegevens worden nooit verkocht. Lees ons{' '}
            <a href="/privacybeleid" style={{ color: '#4F46E5', textDecoration: 'underline' }}>privacybeleid</a>.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={decline}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'white',
            color: '#5B6070',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Alleen noodzakelijk
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Alles accepteren
        </button>
      </div>
    </div>
  );
}
