import { TldKey } from '@/types';
import { ORDERED_TLDS } from './tlds';

const NL_PREFIXES = [
  'mijn', 'de', 'het', 'jouw', 'uw', 'onze', 'pro', 'top', 'best',
  'snel', 'slim', 'easy', 'super', 'mega', 'direct', 'online', 'goed',
];

const NL_SUFFIXES = [
  'online', 'direct', 'nu', 'shop', 'dienst', 'hub', 'pro', 'plus',
  'groep', 'team', 'bureau', 'studio', 'centrum', 'punt', 'nl',
];

const EN_PREFIXES = ['get', 'use', 'try', 'go', 'my', 'the', 'best', 'top', 'pro', 'ez', 'fast', 'smart'];
const EN_SUFFIXES = ['app', 'hq', 'pro', 'hub', 'base', 'labs', 'co', 'spot', 'zone'];

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
    names.add(`${prefix}${clean}`);
    if (clean.length >= 4) names.add(`${prefix}-${clean}`);
  }

  for (const suffix of NL_SUFFIXES) {
    names.add(`${clean}${suffix}`);
    if (clean.length >= 4) names.add(`${clean}-${suffix}`);
  }

  for (const prefix of EN_PREFIXES) {
    names.add(`${prefix}${clean}`);
  }
  for (const suffix of EN_SUFFIXES) {
    names.add(`${clean}${suffix}`);
  }

  if (clean.length > 6) {
    const abbr = abbreviate(clean);
    if (abbr) {
      names.add(abbr);
      names.add(`${abbr}nl`);
    }
  }

  const vowelDrop = dropVowels(clean);
  if (vowelDrop && vowelDrop.length >= 4 && vowelDrop !== clean) {
    names.add(vowelDrop);
  }

  const words = clean.split('-');
  if (words.length > 1) {
    names.add(words.join(''));
    names.add(words[0] + words[words.length - 1]);
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
      names.add(`${keywords[i]}${keywords[j]}`);
      names.add(`${keywords[i]}-${keywords[j]}`);
    }
  }

  // All keywords joined
  if (keywords.length >= 3) {
    names.add(keywords.join(''));
    names.add(keywords.join('-'));
  }

  // Each keyword individually
  for (const kw of keywords) {
    names.add(kw);
  }

  // Primary keyword with prefixes/suffixes
  for (const prefix of NL_PREFIXES.slice(0, 6)) {
    names.add(`${prefix}${primary}`);
  }
  for (const suffix of NL_SUFFIXES.slice(0, 6)) {
    names.add(`${primary}${suffix}`);
  }

  // Abbreviation of combination
  const combined = keywords.join('');
  if (combined.length > 6) {
    const abbr = abbreviate(combined);
    if (abbr) names.add(abbr);
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

function isValidDomainName(name: string): boolean {
  if (name.length < 2 || name.length > 63) return false;
  if (name.startsWith('-') || name.endsWith('-')) return false;
  if (!/^[a-z0-9-]+$/.test(name)) return false;
  return true;
}

function abbreviate(word: string): string | null {
  const consonants = word.replace(/[aeiou]/g, '');
  return consonants.length >= 3 ? consonants.slice(0, 5) : null;
}

function dropVowels(word: string): string {
  return word[0] + word.slice(1).replace(/[aeiou]/g, '');
}

function deriveStrategy(name: string, original: string): string {
  if (name === original) return 'exact';
  if (name.startsWith(original)) return 'suffix';
  if (name.endsWith(original)) return 'prefix';
  return 'variation';
}
