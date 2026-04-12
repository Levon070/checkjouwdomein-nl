import { TldKey, ScoreBreakdown } from '@/types';
import { TLD_CONFIG } from './tlds';

export interface ScoringResult {
  score: number;
  breakdown: ScoreBreakdown;
  pronunciationScore: number;
}

export function scoreDomain(name: string, tld: TldKey, originalKeyword: string): ScoringResult {
  const pronunciationScore = calcPronunciationScore(name);

  const breakdown: ScoreBreakdown = {
    lengthScore: calcLengthScore(name),
    tldScore: TLD_CONFIG[tld]?.scoreWeight ?? 0,
    keywordScore: calcKeywordScore(name, originalKeyword),
    hyphenPenalty: name.includes('-') ? -10 : 0,
    numberPenalty: /\d/.test(name) ? -5 : 0,
    pronunciationScore,
  };

  const raw =
    breakdown.lengthScore +
    breakdown.tldScore +
    breakdown.keywordScore +
    breakdown.hyphenPenalty +
    breakdown.numberPenalty;

  return { score: Math.max(0, Math.min(100, raw)), breakdown, pronunciationScore };
}

function calcLengthScore(name: string): number {
  const len = name.length;
  if (len <= 4) return 25;
  if (len <= 6) return 22;
  if (len <= 8) return 18;
  if (len <= 10) return 14;
  if (len <= 13) return 10;
  if (len <= 16) return 6;
  return 3;
}

function calcKeywordScore(name: string, keyword: string): number {
  const clean = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n = name.toLowerCase();
  if (n === clean) return 40;
  if (n.startsWith(clean)) return 25;
  if (n.endsWith(clean)) return 20;
  if (n.includes(clean)) return 15;
  return 0;
}

/**
 * Pronunciation score (0–100): how easy is the name to say out loud?
 * Higher = more pronounceable.
 *
 * Factors:
 * - Consonant cluster penalty: consecutive consonants without vowels
 * - Alternating vowel/consonant bonus
 * - Length (shorter = easier)
 * - No numbers/hyphens bonus
 */
export function calcPronunciationScore(name: string): number {
  // Only letters for phonetic analysis
  const letters = name.replace(/[^a-z]/g, '');
  if (letters.length === 0) return 0;

  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
  let score = 100;

  // Consonant cluster penalty
  let clusterLen = 0;
  for (const ch of letters) {
    if (!vowels.has(ch)) {
      clusterLen++;
      if (clusterLen >= 3) score -= 10; // e.g. "str", "scht"
      if (clusterLen >= 4) score -= 15; // very hard to pronounce
    } else {
      clusterLen = 0;
    }
  }

  // Vowel ratio: ideal is ~35–45% vowels
  const vowelCount = letters.split('').filter((c) => vowels.has(c)).length;
  const vowelRatio = vowelCount / letters.length;
  if (vowelRatio < 0.2) score -= 20; // almost no vowels (e.g. "rdap")
  else if (vowelRatio < 0.3) score -= 10;
  else if (vowelRatio >= 0.35 && vowelRatio <= 0.55) score += 5; // sweet spot

  // Length penalty
  if (letters.length > 12) score -= 10;
  if (letters.length > 16) score -= 10;

  // Hyphen or number penalty
  if (name.includes('-')) score -= 8;
  if (/\d/.test(name)) score -= 8;

  // Bonus: starts with a vowel (easy to say)
  if (vowels.has(letters[0])) score += 3;

  return Math.max(0, Math.min(100, score));
}

export function pronunciationLabel(score: number): string {
  if (score >= 80) return 'Makkelijk uit te spreken';
  if (score >= 60) return 'Redelijk uit te spreken';
  return 'Lastig uit te spreken';
}

export function scoreToStars(score: number): number {
  if (score >= 80) return 5;
  if (score >= 65) return 4;
  if (score >= 50) return 3;
  if (score >= 35) return 2;
  return 1;
}

export function scoreToColorClass(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-orange-500';
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return 'Uitstekend';
  if (score >= 65) return 'Goed';
  if (score >= 50) return 'Redelijk';
  if (score >= 35) return 'Matig';
  return 'Minder';
}
