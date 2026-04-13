import { TldKey, ValuationResult } from '@/types';

// High-value Dutch business keywords — generic single words command premium prices
const HIGH_VALUE_KEYWORDS = new Set([
  'auto', 'huis', 'woning', 'geld', 'bank', 'werk', 'baan', 'zorg', 'arts',
  'eten', 'drank', 'hotel', 'reis', 'sport', 'mode', 'kleding', 'school',
  'cursus', 'coach', 'huur', 'koop', 'hypotheek', 'lening', 'verzekering',
  'energie', 'gas', 'stroom', 'internet', 'webshop', 'winkel', 'kapper',
  'tandarts', 'advocaat', 'notaris', 'accountant', 'tuinier', 'schilder',
  'restaurant', 'bakkerij', 'slager', 'garage', 'fiets', 'motor', 'boot',
]);

const TLD_MULTIPLIERS: Partial<Record<TldKey, number>> = {
  '.com': 2.2,
  '.nl':  1.6,
  '.io':  1.3,
  '.net': 1.1,
  '.org': 1.0,
  '.be':  0.9,
  '.shop': 0.8,
  '.online': 0.7,
};

export function estimateDomainValue(
  name: string,
  tld: TldKey,
  score: number
): ValuationResult {
  const factors: Array<{ label: string; impact: number }> = [];
  let base = 30;

  // Length bonus
  const len = name.length;
  let lengthImpact = 0;
  if (len <= 4)       lengthImpact = 200;
  else if (len <= 6)  lengthImpact = 100;
  else if (len <= 8)  lengthImpact = 50;
  else if (len <= 10) lengthImpact = 20;
  if (lengthImpact > 0) factors.push({ label: `Korte naam (${len} tekens)`, impact: lengthImpact });
  base += lengthImpact;

  // Keyword value bonus
  const lower = name.toLowerCase().replace(/-/g, '');
  let kwImpact = 0;
  if (HIGH_VALUE_KEYWORDS.has(lower)) {
    kwImpact = 120;
    factors.push({ label: 'Generiek zakelijk trefwoord', impact: kwImpact });
  } else {
    const kwList = Array.from(HIGH_VALUE_KEYWORDS);
    for (const kw of kwList) {
      if (lower.includes(kw)) { kwImpact = 40; break; }
    }
    if (kwImpact > 0) factors.push({ label: 'Bevat zakelijk trefwoord', impact: kwImpact });
  }
  base += kwImpact;

  // Score bonus
  const scoreImpact = Math.floor(score / 10) * 5;
  if (scoreImpact > 0) factors.push({ label: `Domeinscore (${score}/100)`, impact: scoreImpact });
  base += scoreImpact;

  // Hyphen penalty
  if (name.includes('-')) {
    factors.push({ label: 'Koppelteken (min)', impact: -15 });
    base -= 15;
  }

  // TLD multiplier
  const mult = TLD_MULTIPLIERS[tld] ?? 1.0;
  const tldImpact = Math.round(base * (mult - 1));
  if (tldImpact !== 0) {
    factors.push({ label: `TLD waarde (${tld})`, impact: tldImpact });
  }
  base = Math.round(base * mult);

  const low  = Math.max(10, Math.floor(base * 0.6 / 5) * 5);
  const high = Math.ceil(base * 1.8 / 5) * 5;

  return { low, high, factors };
}
