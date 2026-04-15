'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { REGISTRARS } from '@/lib/registrars';
import type { TldKey } from '@/types';
import { GridHeroBackground } from '@/components/ui/GridHeroBackground';
import { ShinyButton } from '@/components/ui/ShinyButton';

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckStatus = 'idle' | 'checking' | 'done';
type Availability = 'available' | 'taken' | 'unknown';

interface DomainResult { tld: string; status: Availability }
interface SocialResult { platform: string; icon: string; status: Availability; url: string }
interface KvkResult { found: boolean | null; count: number | null; kvkUrl: string }
interface EuipoResult { hasMatch: boolean; matches: Array<{ trademark: string; status: string; owner: string }>; detailUrl: string }

interface BrandResults {
  domains: DomainResult[];
  social: SocialResult[];
  kvk: KvkResult | null;
  euipo: EuipoResult | null;
  score: number;
  scoreLabel: string;
  scoreColor: string;
}

// ─── Brand Score calculation ──────────────────────────────────────────────────

function calcScore(results: Omit<BrandResults, 'score' | 'scoreLabel' | 'scoreColor'>): number {
  let score = 100;

  // Domains: .nl + .com together worth 40 pts
  const nl = results.domains.find(d => d.tld === '.nl');
  const com = results.domains.find(d => d.tld === '.com');
  if (nl?.status === 'taken') score -= 25;
  if (com?.status === 'taken') score -= 15;

  // Social: Instagram, TikTok, Twitter — 10 pts each
  for (const s of results.social) {
    if (s.status === 'taken') score -= 10;
  }

  // KVK: 10 pts if name taken
  if (results.kvk?.found === true) score -= 10;

  // EUIPO: 20 pts if trademark found
  if (results.euipo?.hasMatch) score -= 20;

  return Math.max(0, score);
}

function scoreLabel(s: number): { label: string; color: string } {
  if (s >= 80) return { label: 'Uitstekende keuze', color: 'var(--available)' };
  if (s >= 60) return { label: 'Goede keuze', color: '#059669' };
  if (s >= 40) return { label: 'Matig — let op conflicten', color: '#D97706' };
  return { label: 'Riskant — veel bezet', color: '#EF4444' };
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function StatusPill({ status, label }: { status: Availability; label: string }) {
  const cfg = {
    available: { bg: 'rgba(5,150,105,0.08)', color: 'var(--available)', border: 'rgba(5,150,105,0.2)', icon: '✓' },
    taken:     { bg: 'rgba(220,38,38,0.07)', color: '#EF4444', border: 'rgba(220,38,38,0.18)', icon: '✗' },
    unknown:   { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-subtle)', border: 'var(--border)', icon: '?' },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon} {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MerkCheckContent() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [results, setResults] = useState<BrandResults | null>(null);
  const [checkedName, setCheckedName] = useState('');

  // Pre-fill from ?name= query param (e.g. coming from naam-generator)
  useEffect(() => {
    const name = searchParams.get('name');
    if (name) setInput(name);
  }, [searchParams]);

  const handleCheck = useCallback(async () => {
    const name = input.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!name || name.length < 2) return;

    setCheckStatus('checking');
    setResults(null);
    setCheckedName(name);

    const TLDS = ['.nl', '.com', '.be', '.io'];

    // Fire everything in parallel
    const [domainResults, socialResult, kvkResult, euipoResult] = await Promise.allSettled([
      // All TLDs in parallel
      Promise.all(
        TLDS.map(async (tld): Promise<DomainResult> => {
          try {
            const res = await fetch(`/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`);
            const data = await res.json();
            return { tld, status: data.status === 'available' ? 'available' : data.status === 'taken' ? 'taken' : 'unknown' };
          } catch {
            return { tld, status: 'unknown' };
          }
        })
      ),
      // Social (Instagram, X, TikTok)
      fetch(`/api/check-social?handle=${encodeURIComponent(name)}`).then(r => r.json()).catch(() => null),
      // KVK
      fetch(`/api/check-kvk?name=${encodeURIComponent(name)}`).then(r => r.json()).catch(() => null),
      // EUIPO
      fetch(`/api/check-euipo?name=${encodeURIComponent(name)}`).then(r => r.json()).catch(() => null),
    ]);

    const domains: DomainResult[] = domainResults.status === 'fulfilled' ? domainResults.value : TLDS.map(tld => ({ tld, status: 'unknown' as Availability }));
    const social: SocialResult[] = [];
    if (socialResult.status === 'fulfilled' && socialResult.value) {
      const s = socialResult.value;
      social.push({ platform: 'Instagram', icon: '📸', status: s.instagram ?? 'unknown', url: s.instagramUrl });
      social.push({ platform: 'TikTok', icon: '🎵', status: s.tiktok ?? 'unknown', url: s.tiktokUrl });
      social.push({ platform: 'X / Twitter', icon: '𝕏', status: s.twitter ?? 'unknown', url: s.twitterUrl });
    }
    const kvk: KvkResult | null = kvkResult.status === 'fulfilled' ? kvkResult.value : null;
    const euipo: EuipoResult | null = euipoResult.status === 'fulfilled' ? euipoResult.value : null;

    const raw = { domains, social, kvk, euipo };
    const score = calcScore(raw);
    const { label, color } = scoreLabel(score);

    setResults({ ...raw, score, scoreLabel: label, scoreColor: color });
    setCheckStatus('done');
  }, [input]);

  // Best available domain for CTA
  const bestDomain = results?.domains.find(d => d.status === 'available');
  const cheapestRegistrar = bestDomain
    ? REGISTRARS.filter(r => r.supportedTlds.includes(bestDomain.tld as TldKey))
        .sort((a, b) => {
          const pa = a.detailedPrices[bestDomain.tld as TldKey]?.firstYearRaw ?? 99;
          const pb = b.detailedPrices[bestDomain.tld as TldKey]?.firstYearRaw ?? 99;
          return pa - pb;
        })[0]
    : null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="text-center px-4 pt-16 pb-10" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(99,102,241,0.03) 100%)', borderBottom: '1px solid var(--border)' }}>
        <GridHeroBackground />
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
          style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}>
          ✦ Uniek in Nederland &amp; België
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Volledige <span style={{ color: 'var(--primary)' }}>merknaamcheck</span>
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Domein · Instagram · TikTok · X/Twitter · KVK handelsnaam · EUIPO trademark — alles tegelijk, in één klik.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-2xl pb-20">
        {/* Search bar */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCheck(); }}
            placeholder="bijv. bakkersbram of techhub"
            className="flex-1 px-4 py-3 rounded-xl text-base"
            style={{ border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }}
          />
          <ShinyButton
            onClick={handleCheck}
            disabled={checkStatus === 'checking' || !input.trim()}
            className="px-6 py-3 font-bold text-sm"
          >
            {checkStatus === 'checking' ? 'Checken…' : 'Check merk →'}
          </ShinyButton>
        </div>

        {/* Checking skeleton */}
        {checkStatus === 'checking' && (
          <div className="rounded-2xl p-6 space-y-3 animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className="h-8 rounded-lg" style={{ background: 'var(--bg)', width: `${60 + (i * 7) % 35}%` }} />
            ))}
          </div>
        )}

        {/* Results */}
        {checkStatus === 'done' && results && (
          <div className="space-y-4">
            {/* Brand Score */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: 'var(--surface)', border: `2px solid ${results.scoreColor}22` }}
            >
              <div className="text-5xl font-black mb-1" style={{ color: results.scoreColor }}>
                {results.score}
                <span className="text-2xl" style={{ color: 'var(--text-subtle)' }}>/100</span>
              </div>
              <div className="text-sm font-semibold" style={{ color: results.scoreColor }}>{results.scoreLabel}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Brand Score voor &ldquo;{checkedName}&rdquo;</div>
            </div>

            {/* Domains */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-subtle)' }}>🌐 Domeinnamen</h2>
              <div className="grid grid-cols-2 gap-2">
                {results.domains.map(d => (
                  <div key={d.tld} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'var(--bg)' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{checkedName}{d.tld}</span>
                    <StatusPill status={d.status} label={d.status === 'available' ? 'Vrij' : d.status === 'taken' ? 'Bezet' : '?'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            {results.social.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-subtle)' }}>📱 Social media handles</h2>
                <div className="flex flex-col gap-2">
                  {results.social.map(s => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: 'var(--bg)', textDecoration: 'none' }}
                    >
                      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.icon} {s.platform} @{checkedName}</span>
                      <StatusPill status={s.status} label={s.status === 'available' ? 'Vrij' : s.status === 'taken' ? 'Bezet' : '?'} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* KVK + EUIPO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.kvk && (
                <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-subtle)' }}>💼 KVK Handelsnaam</h2>
                  {results.kvk.found === true && (
                    <a href={results.kvk.kvkUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: '#D97706', textDecoration: 'none' }}>
                      ⚠️ {results.kvk.count}× gevonden in KVK →
                    </a>
                  )}
                  {results.kvk.found === false && (
                    <span className="text-sm font-medium" style={{ color: 'var(--available)' }}>✓ Naam vrij in KVK</span>
                  )}
                  {results.kvk.found === null && (
                    <a href={results.kvk.kvkUrl} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--text-subtle)', textDecoration: 'none' }}>
                      Controleer bij KVK →
                    </a>
                  )}
                </div>
              )}
              {results.euipo && (
                <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-subtle)' }}>🏛️ EUIPO Trademark</h2>
                  {results.euipo.hasMatch ? (
                    <a href={results.euipo.detailUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: '#D97706', textDecoration: 'none' }}>
                      ⚠️ Merk gevonden: &ldquo;{results.euipo.matches[0]?.trademark}&rdquo; →
                    </a>
                  ) : (
                    <span className="text-sm font-medium" style={{ color: 'var(--available)' }}>✓ Geen Europees merk gevonden</span>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            {bestDomain && cheapestRegistrar && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.15)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                  🎉 {checkedName}{bestDomain.tld} is beschikbaar!
                </p>
                <a
                  href={cheapestRegistrar.affiliateUrl(`${checkedName}${bestDomain.tld}`)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
                  style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}
                >
                  Registreer bij {cheapestRegistrar.name} voor {cheapestRegistrar.detailedPrices[bestDomain.tld as TldKey]?.firstYear ?? '—'}/jr →
                </a>
              </div>
            )}

            {/* Try another */}
            <div className="text-center pt-2">
              <button
                onClick={() => { setInput(''); setCheckStatus('idle'); setResults(null); }}
                className="text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Andere naam checken
              </button>
            </div>
          </div>
        )}

        {/* Idle state — visual brand score preview + feature cards */}
        {checkStatus === 'idle' && (
          <div className="mt-4 space-y-4">
            {/* Visual brand score mockup */}
            <div className="rounded-2xl p-5 opacity-70 pointer-events-none select-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-4 text-center" style={{ color: 'var(--text-subtle)' }}>
                Voorbeeld — Brand Score voor &ldquo;coolbuns&rdquo;
              </p>
              {/* Score */}
              <div className="text-center mb-4">
                <div className="text-5xl font-black" style={{ color: '#059669', letterSpacing: '-0.04em' }}>
                  82<span className="text-2xl" style={{ color: 'var(--text-subtle)' }}>/100</span>
                </div>
                <div className="text-sm font-semibold mt-1" style={{ color: '#059669' }}>Uitstekende keuze</div>
              </div>
              {/* Mini domain + social grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'coolbuns.nl',  status: 'available' },
                  { label: 'coolbuns.com', status: 'available' },
                  { label: 'coolbuns.be',  status: 'taken' },
                  { label: 'coolbuns.io',  status: 'available' },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <span className="text-xs font-mono" style={{ color: 'var(--text)' }}>{d.label}</span>
                    <span className="text-xs font-semibold" style={{ color: d.status === 'available' ? '#059669' : '#EF4444' }}>
                      {d.status === 'available' ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {['📸 Instagram: Vrij', '🎵 TikTok: Vrij', '🏛️ EUIPO: Geen merk'].map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg flex-1 text-center"
                    style={{ background: 'rgba(5,150,105,0.07)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: '🌐', title: 'Domeincheck', desc: '.nl, .com, .be en .io tegelijk', accent: 'rgba(79,70,229,0.06)', iconBg: 'rgba(79,70,229,0.10)' },
                { icon: '📱', title: 'Social handles', desc: 'Instagram, TikTok en X/Twitter', accent: 'rgba(6,182,212,0.06)', iconBg: 'rgba(6,182,212,0.10)' },
                { icon: '🏛️', title: 'Merk & KVK', desc: 'EUIPO Europees merk + KVK handelsnaam', accent: 'rgba(245,158,11,0.06)', iconBg: 'rgba(245,158,11,0.12)' },
              ].map(f => (
                <div key={f.title} className="rounded-xl p-4 text-center" style={{ background: f.accent, border: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2" style={{ background: f.iconBg }}>
                    {f.icon}
                  </div>
                  <div className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{f.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-3">
          <Link href="/" className="text-center text-sm font-semibold py-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Domeincheck
          </Link>
          <Link href="/naam-generator" className="text-center text-sm font-semibold py-3 rounded-xl"
            style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', color: 'var(--primary)', textDecoration: 'none' }}>
            Naamgenerator →
          </Link>
        </div>

        {/* Why section */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: 'var(--text-subtle)' }}>
            Waarom een merknaamcheck?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '⚖️', title: 'Juridische zekerheid', desc: 'Voorkom dat je een naam kiest die al als Europees merk geregistreerd is bij het EUIPO — dat kan leiden tot dwingende naamsverandering.' },
              { icon: '📱', title: 'Consistente branding', desc: 'Hetzelfde handle op Instagram, TikTok en X geeft vertrouwen en maakt je merk direct herkenbaar op alle kanalen.' },
              { icon: '🌐', title: 'Domein veiligstellen', desc: 'Je .nl én .com tegelijk beschikbaar? Registreer ze allebei — zo voorkom je dat een concurrent ze oppikt.' },
              { icon: '🏢', title: 'KVK handelsnaam', desc: 'Controleer of de naam al in gebruik is als handelsnaam bij de Kamer van Koophandel, voordat je je inschrijft.' },
            ].map(tip => (
              <div key={tip.title} className="flex gap-3 rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xl shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{tip.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 space-y-12" style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Waarom een merknaamcheck uitvoeren?
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Een merknaam kiezen zonder check is een risico. Bedrijven die later ontdekken dat hun naam al als Europees merk geregistreerd staat, kunnen gedwongen worden hun naam te wijzigen — inclusief alle kosten voor herbranding, nieuwe domeinen, nieuwe visitekaartjes en nieuwe social media profielen.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              De merknaamcheck van CheckJouwDomein.nl controleert in één overzicht alle plekken waar je naam uniek moet zijn: het domeinregister, sociale media, de Kamer van Koophandel en het Europees handelsmerkenregister (EUIPO). Dit zijn de vier pijlers van een sterke merkpositie.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Heb je nog geen naam? Gebruik dan eerst onze{' '}
              <a href="/naam-generator" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>AI naamgenerator</a>{' '}
              om unieke merknaamideeën te genereren, inclusief directe beschikbaarheidscheck.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Wat betekent elk onderdeel van de check?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Domeinnaam (.nl, .com, .be)', desc: 'Checkt of jouw merknaam beschikbaar is als domeinnaam in de meest relevante extensies via het officiële RDAP-protocol. Beschikbaar = je kunt het direct registreren bij een registrar.' },
                { title: 'Instagram, TikTok & X/Twitter', desc: 'Controleert of de username beschikbaar is op de drie grootste sociale mediaplatformen. Consistente branding over alle kanalen verhoogt herkenbaarheid en vertrouwen.' },
                { title: 'KVK handelsnaam', desc: 'Zoekt in het KVK-register of de naam al door een ander bedrijf in Nederland gebruikt wordt. Een identieke handelsnaam is niet verboden maar kan juridische discussies opleveren.' },
                { title: 'EUIPO trademark', desc: 'Controleert het Europees Merkenbureau (EUIPO) op geregistreerde handelsmerken. Een ingeschreven merk geeft de houder exclusief recht op gebruik in alle EU-landen. Een conflict met een geregistreerd merk kan leiden tot een gedwongen naamswijziging.' },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Veelgestelde vragen
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Hoe weet ik of mijn merknaam beschermd is?', a: 'Via de EUIPO-check zie je direct of de naam als Europees handelsmerk staat geregistreerd. Is de naam vrij? Dan kun je zelf een aanvraag indienen via euipo.europa.eu. Een merkinschrijving geldt voor 10 jaar en is verlengbaar.' },
                { q: 'Wat als de naam al bezet is als domein maar vrij als merk?', a: 'Dan kun je de naam eventueel nog als merk beschermen, maar heb je een domeinprobleem. Overweeg dan een variatie of andere extensie. Gebruik onze domeinchecker voor alternatieven.' },
                { q: 'Hoe snel is de check klaar?', a: 'De merknaamcheck duurt 3-10 seconden. We bevragen tegelijkertijd het RDAP-protocol (domeinen), de social media platforms, het KVK-register en de EUIPO-database.' },
                { q: 'Is de check 100% betrouwbaar?', a: 'We gebruiken officiële databronnen (RDAP, EUIPO API). Social media beschikbaarheid is een benadering — platforms wijzigen soms handles. Voor juridische zekerheid raden we altijd aan een merkengemachtigde te raadplegen voordat je een merk inschrijft.' },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>{q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default function MerkCheckPage() {
  return (
    <Suspense>
      <MerkCheckContent />
    </Suspense>
  );
}
