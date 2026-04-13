'use client';

import { useState } from 'react';
import { generateOutreachEmail } from '@/lib/outreach-template';

interface Props {
  domain: string;
}

export default function OutreachModal({ domain }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { subject, body } = generateOutreachEmail(domain);

  function handleCopy() {
    navigator.clipboard.writeText(`Onderwerp: ${subject}\n\n${body}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const mailtoHref = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium transition-colors"
        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
      >
        ✉️ {open ? 'Verberg contacttemplate' : 'Neem contact op met eigenaar'}
      </button>

      {open && (
        <div
          className="mt-3 rounded-xl p-4 space-y-3"
          style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}
        >
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Onderwerp</p>
            <p className="text-xs" style={{ color: 'var(--text)' }}>{subject}</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Bericht</p>
            <pre
              className="text-xs whitespace-pre-wrap leading-relaxed"
              style={{ color: 'var(--text)', fontFamily: 'inherit' }}
            >
              {body}
            </pre>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)' }}
            >
              {copied ? '✓ Gekopieerd!' : '⎘ Kopieer tekst'}
            </button>
            <a
              href={mailtoHref}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(5,150,105,0.08)', color: 'var(--available)' }}
            >
              ✉️ Openen in e-mail
            </a>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            Vervang [UW NAAM], [UW EMAIL] en [UW TELEFOONNUMMER] voordat je verstuurt.
          </p>
        </div>
      )}
    </div>
  );
}
