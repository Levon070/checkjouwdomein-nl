import { INDUSTRY_KEYWORDS } from './industry-keywords';

/**
 * Match a search keyword to the closest industry entry.
 * Returns the industry key (e.g. 'bakkerij') or null if no match found.
 */
export function matchIndustry(keyword: string): string | null {
  if (!keyword) return null;
  const lower = keyword.toLowerCase().replace(/-/g, '');

  // Exact match on industry key
  if (INDUSTRY_KEYWORDS[lower]) return lower;

  // Partial match: industry key is contained in keyword or vice versa
  for (const key of Object.keys(INDUSTRY_KEYWORDS)) {
    if (lower.includes(key) || key.includes(lower)) return key;
  }

  // Match against any NL keyword in the map
  for (const [key, { nl }] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (nl.includes(lower)) return key;
  }

  return null;
}

/**
 * Get up to `limit` related keyword suggestions for display as chips.
 */
export function getRelatedKeywords(industry: string, limit = 6): string[] {
  const entry = INDUSTRY_KEYWORDS[industry];
  if (!entry) return [];
  return [...entry.nl, ...entry.en].slice(0, limit);
}
