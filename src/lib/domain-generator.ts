import { TldKey } from '@/types';
import { ORDERED_TLDS } from './tlds';

// Only brandable/additive prefixes — generic ones (mijn, de, top, best, super…) are
// intentionally excluded because they hurt domain quality scores.
const NL_PREFIXES = ['pro', 'snel', 'slim', 'easy'];

const NL_SUFFIXES = [
  'shop', 'dienst', 'hub', 'pro', 'plus',
  'groep', 'team', 'bureau', 'studio', 'centrum', 'punt',
];

const EN_PREFIXES = ['pro', 'fast', 'smart'];
const EN_SUFFIXES = ['app', 'pro', 'hub', 'base', 'labs', 'co', 'spot', 'zone'];

export interface GeneratedDomain {
  name: string;
  full: string;
  tld: TldKey;
  strategy: string;
  primaryKeyword: string;
}

/** Parse a raw input string into individual keywords (split on comma or semicolon) */
export function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((k) => sanitizeKeyword(k))
    .filter((k) => k.length >= 2)
    .slice(0, 4); // max 4 keywords to keep suggestions manageable
}

export function generateDomainSuggestions(
  keyword: string,
  tlds: TldKey[] = ORDERED_TLDS
): GeneratedDomain[] {
  const keywords = parseKeywords(keyword);
  if (keywords.length === 0) return [];

  if (keywords.length === 1) {
    return generateSingleKeyword(keywords[0], tlds);
  }

  return generateMultiKeyword(keywords, tlds);
}

function generateSingleKeyword(clean: string, tlds: TldKey[]): GeneratedDomain[] {
  const names = new Set<string>();

  names.add(clean);

  for (const prefix of NL_PREFIXES) {
    const candidate = `${prefix}${clean}`;
    if (passesQualityGate(candidate)) names.add(candidate);
    if (clean.length >= 4) {
      const hyphenated = `${prefix}-${clean}`;
      if (passesQualityGate(hyphenated)) names.add(hyphenated);
    }
  }

  for (const suffix of NL_SUFFIXES) {
    const candidate = `${clean}${suffix}`;
    if (passesQualityGate(candidate)) names.add(candidate);
    if (clean.length >= 4) {
      const hyphenated = `${clean}-${suffix}`;
      if (passesQualityGate(hyphenated)) names.add(hyphenated);
    }
  }

  for (const prefix of EN_PREFIXES) {
    const candidate = `${prefix}${clean}`;
    if (passesQualityGate(candidate)) names.add(candidate);
  }
  for (const suffix of EN_SUFFIXES) {
    const candidate = `${clean}${suffix}`;
    if (passesQualityGate(candidate)) names.add(candidate);
  }

  const words = clean.split('-');
  if (words.length > 1) {
    const joined = words.join('');
    if (passesQualityGate(joined)) names.add(joined);
    const firstLast = words[0] + words[words.length - 1];
    if (firstLast !== joined && passesQualityGate(firstLast)) names.add(firstLast);
  }

  const sorted = Array.from(names).sort((a, b) => {
    if (a === clean) return -1;
    if (b === clean) return 1;
    return a.length - b.length;
  });

  const results: GeneratedDomain[] = [];
  for (const name of sorted) {
    if (!isValidDomainName(name)) continue;
    for (const tld of tlds) {
      results.push({ name, full: `${name}${tld}`, tld, strategy: deriveStrategy(name, clean), primaryKeyword: clean });
    }
  }

  return results.slice(0, 200);
}

function generateMultiKeyword(keywords: string[], tlds: TldKey[]): GeneratedDomain[] {
  const names = new Set<string>();
  const primary = keywords[0];

  // All combinations of keyword pairs (both orders)
  for (let i = 0; i < keywords.length; i++) {
    for (let j = 0; j < keywords.length; j++) {
      if (i === j) continue;
      const joined = `${keywords[i]}${keywords[j]}`;
      const hyphenated = `${keywords[i]}-${keywords[j]}`;
      if (passesQualityGate(joined)) names.add(joined);
      if (passesQualityGate(hyphenated)) names.add(hyphenated);
    }
  }

  // All keywords joined
  if (keywords.length >= 3) {
    const joined = keywords.join('');
    const hyphenated = keywords.join('-');
    if (passesQualityGate(joined)) names.add(joined);
    if (passesQualityGate(hyphenated)) names.add(hyphenated);
  }

  // Each keyword individually
  for (const kw of keywords) {
    names.add(kw);
  }

  // Primary keyword with prefixes/suffixes
  for (const prefix of NL_PREFIXES.slice(0, 6)) {
    const candidate = `${prefix}${primary}`;
    if (passesQualityGate(candidate)) names.add(candidate);
  }
  for (const suffix of NL_SUFFIXES.slice(0, 6)) {
    const candidate = `${primary}${suffix}`;
    if (passesQualityGate(candidate)) names.add(candidate);
  }

  const sorted = Array.from(names).sort((a, b) => {
    const aHasAll = keywords.every((k) => a.includes(k));
    const bHasAll = keywords.every((k) => b.includes(k));
    if (aHasAll && !bHasAll) return -1;
    if (!aHasAll && bHasAll) return 1;
    return a.length - b.length;
  });

  const results: GeneratedDomain[] = [];
  for (const name of sorted) {
    if (!isValidDomainName(name)) continue;
    for (const tld of tlds) {
      results.push({ name, full: `${name}${tld}`, tld, strategy: 'multi-keyword', primaryKeyword: primary });
    }
  }

  return results.slice(0, 200);
}

export function sanitizeKeyword(kw: string): string {
  return kw
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function passesQualityGate(name: string): boolean {
  const letters = name.replace(/-/g, '');
  const vowelCount = (letters.match(/[aeiou]/g) ?? []).length;
  if (vowelCount < 2) return false;
  if (name.endsWith('nl')) return false;
  if (name.length > 15) return false;
  return true;
}

function isValidDomainName(name: string): boolean {
  if (name.length < 2 || name.length > 63) return false;
  if (name.startsWith('-') || name.endsWith('-')) return false;
  if (!/^[a-z0-9-]+$/.test(name)) return false;
  return true;
}

function deriveStrategy(name: string, original: string): string {
  if (name === original) return 'exact';
  if (name.startsWith(original)) return 'suffix';
  if (name.endsWith(original)) return 'prefix';
  return 'variation';
}
