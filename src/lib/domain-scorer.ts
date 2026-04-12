import { TldKey, ScoreBreakdown } from '@/types';
import { TLD_CONFIG } from './tlds';

export interface ScoringResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export function scoreDomain(name: string, tld: TldKey, originalKeyword: string): ScoringResult {
  const breakdown: ScoreBreakdown = {
    lengthScore: calcLengthScore(name),
    tldScore: TLD_CONFIG[tld]?.scoreWeight ?? 0,
    keywordScore: calcKeywordScore(name, originalKeyword),
    hyphenPenalty: name.includes('-') ? -10 : 0,
    numberPenalty: /\d/.test(name) ? -5 : 0,
  };

  const raw =
    breakdown.lengthScore +
    breakdown.tldScore +
    breakdown.keywordScore +
    breakdown.hyphenPenalty +
    breakdown.numberPenalty;

  return { score: Math.max(0, Math.min(100, raw)), breakdown };
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
