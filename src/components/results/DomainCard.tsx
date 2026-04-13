'use client';

import { useState } from 'react';
import { DomainSuggestion, EuipoResult } from '@/types';
import AvailabilityBadge from './AvailabilityBadge';
import ScoreIndicator from './ScoreIndicator';
import RegistrarButtons from './RegistrarButtons';
import OutreachModal from './OutreachModal';
import PriceCompareModal from './PriceCompareModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useKvkCheck } from '@/hooks/useKvkCheck';
import { useDomainCart } from '@/hooks/useDomainCart';
import { pronunciationLabel } from '@/lib/domain-scorer';
import { estimateDomainValue } from '@/lib/domain-valuation';

interface Props {
  suggestion: DomainSuggestion;
  onCheckSocial?: (name: string) => Promise<unknown>;
}

export default function DomainCard({ suggestion, onCheckSocial }: Props) {
  const { full, name, tld, score, status, pronunciationScore, wasDropped, expiresAt, hasMx, wayback } = suggestion;
  const { save, remove, isFavorite } = useFavorites();
  const { add: addWatch, remove: removeWatch, isWatched } = useWatchlist();
  const { check: checkKvk, getResult: getKvkResult, isLoading: kvkLoading } = useKvkCheck();
  const { add: addToCart, remove: removeFromCart, isInCart } = useDomainCart();

  const [localStatus, setLocalStatus] = useState(status);
  const [retrying, setRetrying] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [watchSaved, setWatchSaved] = useState(false);
  const [showValuation, setShowValuation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [euipoResult, setEuipoResult] = useState<EuipoResult | null>(null);
  const [euipoLoading, setEuipoLoading] = useState(false);
  type SocialData = { instagram: string; twitter: string; instagramUrl: string; twitterUrl: string };
  const [socialData, setSocialData] = useState<SocialData | null>(null);

  const favorited = isFavorite(full);
  const watched = isWatched(full);
  const kvkResult = getKvkResult(name);

  function handleCopy() {
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function handleFavorite() {
    if (favorited) remove(full);
    else save({ full, name, tld, score });
  }

  async function handleSocialCheck() {
    if (!onCheckSocial || socialData) return;
    setSocialLoading(true);
    const data = await onCheckSocial(name);
    if (data) setSocialData(data as SocialData);
    setSocialLoading(false);
  }

  function handleWatch() {
    if (watched) {
      removeWatch(full);
    } else {
      addWatch({ full, name, tld, expiresAt });
      setWatchSaved(true);
      setTimeout(() => setWatchSaved(false), 3000);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await fetch(`/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status) setLocalStatus(data.status);
      }
    } catch {
      // keep error state
    }
    setRetrying(false);
  }

  async function handleEuipoCheck() {
    setEuipoLoading(true);
    try {
      const res = await fetch(`/api/check-euipo?name=${encodeURIComponent(name)}`);
      if (res.ok) setEuipoResult(await res.json());
    } catch {
      // silently ignore
    }
    setEuipoLoading(false);
  }

  function handleCart() {
    if (isInCart(full)) removeFromCart(full);
    else addToCart({ full, name, tld, score });
  }

  const showPronunciation = pronunciationScore !== undefined && pronunciationScore >= 75;

  const expiryFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const daysUntilExpiry = expiresAt
    ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Wayback SEO authority label
  const waybackLabel = wayback
    ? wayback.snapshots >= 1000
      ? { text: 'Goede SEO-autoriteit', color: 'var(--available)' }
      : wayback.snapshots >= 100
      ? { text: 'Matige SEO-autoriteit', color: '#D97706' }
      : { text: 'Beperkte SEO-autoriteit', color: 'var(--text-muted)' }
    : null;

  // Domain valuation (only for available domains)
  const valuation = localStatus === 'available' ? estimateDomainValue(name, tld, score) : null;

  return (
    <div className={`card p-4 ${localStatus === 'available' ? 'available' : localStatus === 'taken' ? 'taken' : ''}`}>
      {/* Error state */}
      {localStatus === 'error' && (
        <div className="flex items-center justify-between gap-2 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>⚠️ Controleren mislukt</span>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="font-medium transition-colors"
            style={{ background: 'none', border: 'none', padding: 0, cursor: retrying ? 'default' : 'pointer', color: 'var(--primary)', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
          >
            {retrying ? 'Bezig…' : '↻ Opnieuw'}
          </button>
        </div>
      )}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="domain-name font-bold text-base break-all" style={{ color: 'var(--text)' }}>
              {name}<span style={{ color: 'var(--primary)' }}>{tld}</span>
            </span>
            <AvailabilityBadge status={localStatus} />

            {wasDropped && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706', border: '1px solid rgba(245,158,11,0.2)' }}
                title="Dit domein had eerder DNS-records — mogelijk eerder geregistreerd"
              >
                ⚡ Eerder actief
              </span>
            )}

            {/* Parked domain badge */}
            {localStatus === 'taken' && hasMx === false && (
              <a
                href={`https://who.is/whois/${full}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-2 py-0.5 rounded-full transition-opacity hover:opacity-80"
                style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.18)', textDecoration: 'none' }}
                title="Geen actieve e-mail gevonden — domein is mogelijk geparkeerd"
              >
                🅿 Waarschijnlijk geparkeerd ↗
              </a>
            )}

            {showPronunciation && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(79,70,229,0.07)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
                title={pronunciationLabel(pronunciationScore!)}
              >
                ☎ Makkelijk uit te spreken
              </span>
            )}
          </div>

          {localStatus === 'available' && <ScoreIndicator score={score} />}

          {/* Expiry info for taken domains */}
          {localStatus === 'taken' && expiryFormatted && (
            <p
              className="text-xs mt-1"
              style={{ color: daysUntilExpiry !== null && daysUntilExpiry <= 60 ? '#D97706' : 'var(--text-muted)' }}
            >
              {daysUntilExpiry !== null && daysUntilExpiry <= 60
                ? `⏰ Verloopt over ${daysUntilExpiry} dagen (${expiryFormatted})`
                : `Verloopt: ${expiryFormatted}`}
            </p>
          )}

          {/* Wayback summary for dropped domains — detail link in ⋯ panel */}
          {wasDropped && wayback && waybackLabel && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.05)', color: waybackLabel.color }}
              >
                {waybackLabel.text}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Copy */}
          <button
            onClick={handleCopy}
            title={copied ? 'Gekopieerd!' : 'Kopieer domeinnaam'}
            className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
            style={{ minWidth: 44, minHeight: 44, background: copied ? 'rgba(5,150,105,0.1)' : 'rgba(0,0,0,0.04)', color: copied ? 'var(--available)' : 'var(--text-muted)' }}
          >
            {copied ? '✓' : '⎘'}
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            title={favorited ? 'Verwijder uit favorieten' : 'Sla op als favoriet'}
            className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
            style={{ minWidth: 44, minHeight: 44, background: favorited ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.04)', color: favorited ? '#EF4444' : 'var(--text-muted)' }}
          >
            {favorited ? '♥' : '♡'}
          </button>

          {/* Social check — available only */}
          {localStatus === 'available' && onCheckSocial && !socialData && (
            <button
              onClick={handleSocialCheck}
              disabled={socialLoading}
              title="Check social media beschikbaarheid"
              className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
              style={{ minWidth: 44, minHeight: 44, background: 'rgba(0,0,0,0.04)', color: socialLoading ? 'var(--text-subtle)' : 'var(--text-muted)' }}
            >
              {socialLoading ? '…' : '@'}
            </button>
          )}

          {/* Cart — available only */}
          {localStatus === 'available' && (
            <button
              onClick={handleCart}
              title={isInCart(full) ? 'Verwijder uit winkelmand' : 'Voeg toe aan winkelmand'}
              className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
              style={{ minWidth: 44, minHeight: 44, background: isInCart(full) ? 'rgba(79,70,229,0.1)' : 'rgba(0,0,0,0.04)', color: isInCart(full) ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              🛒
            </button>
          )}

          {/* Watch / alert — taken only */}
          {localStatus === 'taken' && (
            <button
              onClick={handleWatch}
              title={watched ? 'Verwijder alert' : 'Waarschuw mij als dit domein vrijkomt'}
              className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
              style={{ minWidth: 44, minHeight: 44, background: watched ? 'rgba(245,158,11,0.1)' : 'rgba(0,0,0,0.04)', color: watched ? '#D97706' : 'var(--text-muted)' }}
            >
              🔔
            </button>
          )}

          {/* More details toggle */}
          <button
            onClick={() => setShowDetails((v) => !v)}
            title={showDetails ? 'Verberg details' : 'Meer details'}
            className="flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
            style={{ minWidth: 44, minHeight: 44, background: showDetails ? 'rgba(79,70,229,0.08)' : 'rgba(0,0,0,0.04)', color: showDetails ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            ⋯
          </button>
        </div>
      </div>

      {/* Watch confirmation */}
      {watchSaved && (
        <p className="text-xs mt-2 font-medium" style={{ color: '#D97706' }}>
          🔔 Alert opgeslagen — we checken dit domein elke dag als je een e-mail hebt ingesteld.
        </p>
      )}

      {/* Expandable details */}
      {showDetails && (
        <div className="mt-3 pt-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>

          {/* Domain value estimate — available only */}
          {localStatus === 'available' && valuation && (
            <div>
              <button
                onClick={() => setShowValuation((v) => !v)}
                className="text-xs transition-colors"
                style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
              >
                💰 Geschatte waarde: €{valuation.low} – €{valuation.high}
              </button>
              {showValuation && (
                <div
                  className="mt-2 rounded-lg p-3 text-xs space-y-1"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}
                >
                  <p className="font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Waardebepaling factoren</p>
                  {valuation.factors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                      <span style={{ color: f.impact >= 0 ? 'var(--available)' : '#EF4444', fontWeight: 600 }}>
                        {f.impact >= 0 ? '+' : ''}{f.impact}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs pt-1" style={{ color: 'var(--text-subtle)' }}>
                    Indicatieve marktwaarde — werkelijke prijs varieert sterk.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* KVK check — available only */}
          {localStatus === 'available' && (
            <div>
              {!kvkResult && !kvkLoading(name) && (
                <button
                  onClick={() => checkKvk(name)}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
                >
                  KVK handelsnaam checken
                </button>
              )}
              {kvkLoading(name) && (
                <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>KVK controleren…</span>
              )}
              {kvkResult && kvkResult.found === true && (
                <a
                  href={kvkResult.kvkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ color: '#D97706', textDecoration: 'none' }}
                >
                  ⚠️ Naam mogelijk bezet bij KVK ({kvkResult.count}×) →
                </a>
              )}
              {kvkResult && kvkResult.found === false && (
                <div className="space-y-1.5">
                  <span className="text-xs" style={{ color: 'var(--available)' }}>
                    ✓ Naam vrij in KVK
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <a
                      href={`https://www.legaldesk.nl/bv-oprichten?utm_source=checkjouwdomein&utm_medium=referral&utm_campaign=kvk`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(79,70,229,0.07)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)', textDecoration: 'none' }}
                    >
                      🏢 BV oprichten via Legaldesk →
                    </a>
                    <a
                      href={`https://www.firm24.com/bv-oprichten?utm_source=checkjouwdomein&utm_medium=referral&utm_campaign=kvk`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(6,182,212,0.07)', color: '#0891B2', border: '1px solid rgba(6,182,212,0.15)', textDecoration: 'none' }}
                    >
                      🏢 BV oprichten via Firm24 →
                    </a>
                  </div>
                </div>
              )}
              {kvkResult && kvkResult.found === null && (
                <a
                  href={kvkResult.kvkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs transition-opacity hover:opacity-80"
                  style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}
                >
                  Controleer bij KVK →
                </a>
              )}
            </div>
          )}

          {/* EUIPO trademark check — available only */}
          {localStatus === 'available' && (
            <div>
              {!euipoResult && !euipoLoading && (
                <button
                  onClick={handleEuipoCheck}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
                >
                  🏛️ EUIPO merkcheck (Europa)
                </button>
              )}
              {euipoLoading && (
                <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>🏛️ EUIPO controleren…</span>
              )}
              {euipoResult && euipoResult.hasMatch && (
                <a
                  href={euipoResult.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ color: '#D97706', textDecoration: 'none' }}
                >
                  ⚠️ Merkovereenkomst: &ldquo;{euipoResult.matches[0]?.trademark}&rdquo; ({euipoResult.matches[0]?.status}) →
                </a>
              )}
              {euipoResult && !euipoResult.hasMatch && (
                <span className="text-xs" style={{ color: 'var(--available)' }}>
                  ✓ Geen Europees merk gevonden
                </span>
              )}
            </div>
          )}

          {/* Wayback detail — dropped domains */}
          {wasDropped && wayback && (
            <div className="text-xs space-y-0.5">
              <p style={{ color: 'var(--text-muted)' }}>
                📦 {wayback.snapshots} snapshots · actief sinds {wayback.firstYear}
              </p>
              <a
                href={wayback.oldestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                Bekijk oudste versie in Wayback →
              </a>
            </div>
          )}

          {/* Outreach template — taken only */}
          {localStatus === 'taken' && <OutreachModal domain={full} />}

        </div>
      )}

      {/* Social media results */}
      {socialData && (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={socialData.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: socialData.instagram === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(239,68,68,0.08)',
              color: socialData.instagram === 'available' ? 'var(--available)' : '#EF4444',
              border: `1px solid ${socialData.instagram === 'available' ? 'rgba(5,150,105,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            📸 Instagram {socialData.instagram === 'available' ? 'vrij' : socialData.instagram === 'taken' ? 'bezet' : '?'}
          </a>
          <a
            href={socialData.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: socialData.twitter === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(239,68,68,0.08)',
              color: socialData.twitter === 'available' ? 'var(--available)' : '#EF4444',
              border: `1px solid ${socialData.twitter === 'available' ? 'rgba(5,150,105,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            𝕏 X/Twitter {socialData.twitter === 'available' ? 'vrij' : socialData.twitter === 'taken' ? 'bezet' : '?'}
          </a>
        </div>
      )}

      {localStatus === 'available' && (
        <>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCompare(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              Vergelijk prijzen & registreer →
            </button>
          </div>
          <RegistrarButtons domain={full} tld={tld} />
        </>
      )}

      {showCompare && (
        <PriceCompareModal
          domain={full}
          name={name}
          tld={tld}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
