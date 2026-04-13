'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WatchlistModal({ open, onClose }: Props) {
  const { watchlist, remove, email, saveEmail, clearEmail } = useWatchlist();
  const [emailInput, setEmailInput] = useState(email);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleEmailSave() {
    const trimmed = emailInput.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Voer een geldig e-mailadres in');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveEmail(trimmed);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Opslaan mislukt — probeer opnieuw');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{ background: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
            🔔 Mijn domein-alerts
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm"
            style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}
          >
            ×
          </button>
        </div>

        {/* Email notification setup */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
            📧 E-mailmelding ontvangen
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Wij checken dagelijks de beschikbaarheid en sturen een melding als een domein vrijkomt.
          </p>
          {email ? (
            <div className="flex items-center gap-2">
              <span className="text-xs flex-1" style={{ color: 'var(--text)' }}>✓ {email}</span>
              <button
                onClick={() => { clearEmail(); setEmailInput(''); }}
                className="text-xs"
                style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Verwijder
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSave(); }}
                placeholder="jouw@email.nl"
                className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <button
                onClick={handleEmailSave}
                disabled={saving}
                className="text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                {saving ? '…' : saved ? '✓' : 'Opslaan'}
              </button>
            </div>
          )}
          {error && <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>}
          {saved && <p className="text-xs" style={{ color: 'var(--available)' }}>✓ E-mailadres opgeslagen</p>}
        </div>

        {/* Watchlist items */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            Bewaakte domeinen ({watchlist.length})
          </p>

          {watchlist.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Nog geen domeinen bewaakt. Klik het 🔔 icoontje op een bezet domein.
            </p>
          ) : (
            <div className="space-y-2">
              {watchlist.map((item) => (
                <div
                  key={item.full}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}
                >
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {item.name}
                      <span style={{ color: 'var(--primary)' }}>{item.tld}</span>
                    </span>
                    <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                      Bewaakt sinds {new Date(item.addedAt).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.full)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.07)', color: '#EF4444' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          ℹ️ Alerts worden lokaal bewaard. Voeg een e-mailadres toe voor meldingen op andere apparaten.
        </p>
      </div>
    </div>
  );
}
