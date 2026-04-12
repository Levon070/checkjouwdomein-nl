'use client';

import { useState } from 'react';
import { DomainSuggestion } from '@/types';
import AvailabilityBadge from './AvailabilityBadge';
import ScoreIndicator from './ScoreIndicator';
import RegistrarButtons from './RegistrarButtons';
import { useFavorites } from '@/hooks/useFavorites';
import { pronunciationLabel } from '@/lib/domain-scorer';

interface Props {
  suggestion: DomainSuggestion;
  onCheckSocial?: (name: string) => Promise<unknown>;
}

export default function DomainCard({ suggestion, onCheckSocial }: Props) {
  const { full, name, tld, score, status, pronunciationScore, wasDropped } = suggestion;
  const { save, remove, isFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  type SocialData = { instagram: string; twitter: string; instagramUrl: string; twitterUrl: string };
  const [socialData, setSocialData] = useState<SocialData | null>(null);

  const favorited = isFavorite(full);

  function handleCopy() {
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function handleFavorite() {
    if (favorited) {
      remove(full);
    } else {
      save({ full, name, tld, score });
    }
  }

  async function handleSocialCheck() {
    if (!onCheckSocial || socialData) return;
    setSocialLoading(true);
    const data = await onCheckSocial(name);
    if (data) setSocialData(data as SocialData);
    setSocialLoading(false);
  }

  const showPronunciation = pronunciationScore !== undefined && pronunciationScore >= 75;

  return (
    <div className={`card p-4 ${status === 'available' ? 'available' : status === 'taken' ? 'taken' : ''}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="domain-name font-bold text-base break-all"
              style={{ color: 'var(--text)' }}
            >
              {name}
              <span style={{ color: 'var(--primary)' }}>{tld}</span>
            </span>
            <AvailabilityBadge status={status} />
            {wasDropped && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706', border: '1px solid rgba(245,158,11,0.2)' }}
                title="Dit domein had eerder DNS-records — mogelijk eerder geregistreerd"
              >
                ⚡ Eerder actief
              </span>
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
          {status === 'available' && <ScoreIndicator score={score} />}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Copy */}
          <button
            onClick={handleCopy}
            title={copied ? 'Gekopieerd!' : 'Kopieer domeinnaam'}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
            style={{
              background: copied ? 'rgba(5,150,105,0.1)' : 'rgba(0,0,0,0.04)',
              color: copied ? 'var(--available)' : 'var(--text-muted)',
            }}
          >
            {copied ? '✓' : '⎘'}
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            title={favorited ? 'Verwijder uit favorieten' : 'Sla op als favoriet'}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
            style={{
              background: favorited ? 'rgba(239,68,68,0.08)' : 'rgba(0,0,0,0.04)',
              color: favorited ? '#EF4444' : 'var(--text-muted)',
            }}
          >
            {favorited ? '♥' : '♡'}
          </button>

          {/* Social check */}
          {status === 'available' && onCheckSocial && !socialData && (
            <button
              onClick={handleSocialCheck}
              disabled={socialLoading}
              title="Check social media beschikbaarheid"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 text-sm"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: socialLoading ? 'var(--text-subtle)' : 'var(--text-muted)',
              }}
            >
              {socialLoading ? '…' : '@'}
            </button>
          )}
        </div>
      </div>

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

      {status === 'available' && <RegistrarButtons domain={full} tld={tld} />}
    </div>
  );
}
