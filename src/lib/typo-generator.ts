// QWERTY adjacency map — keys adjacent on a standard keyboard
const ADJACENT: Record<string, string> = {
  a: 'qwsz', b: 'vghn', c: 'xdfv', d: 'ersfxc', e: 'rdsw', f: 'rtgdcv',
  g: 'tyhfvb', h: 'yugjbn', i: 'uojk', j: 'uihknm', k: 'iojlm',
  l: 'opk', m: 'jkn', n: 'hjmb', o: 'iplk', p: 'ol', q: 'wa',
  r: 'etdf', s: 'weadzx', t: 'ryfg', u: 'yihjk', v: 'cfgb',
  w: 'qase', x: 'zsdc', y: 'tugh', z: 'asx',
};

// Common Dutch spelling swaps
const DUTCH_SWAPS: Array<[string, string]> = [
  ['ij', 'y'], ['y', 'ij'],
  ['oe', 'u'], ['u', 'oe'],
  ['ei', 'e'], ['aai', 'ai'],
  ['ou', 'au'], ['au', 'ou'],
  ['c', 'k'], ['k', 'c'],
  ['sch', 'sk'], ['ph', 'f'],
];

function dedupe(arr: string[], original: string): string[] {
  const seen = new Set<string>([original]);
  return arr.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
}

function isValidName(name: string): boolean {
  return /^[a-z0-9-]{2,63}$/.test(name) && !name.startsWith('-') && !name.endsWith('-');
}

export function generateTypos(keyword: string): string[] {
  const lower = keyword.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (lower.length < 2) return [];

  const candidates: string[] = [];

  // 1. Adjacent key substitutions (first 8 chars, max 1 per char position)
  for (let i = 0; i < Math.min(lower.length, 8); i++) {
    const adjacent = ADJACENT[lower[i]];
    if (!adjacent) continue;
    // Pick the first 2 adjacent keys to keep output small
    for (const replacement of adjacent.slice(0, 2)) {
      candidates.push(lower.slice(0, i) + replacement + lower.slice(i + 1));
    }
  }

  // 2. Missing letter (drop each character)
  for (let i = 0; i < lower.length; i++) {
    candidates.push(lower.slice(0, i) + lower.slice(i + 1));
  }

  // 3. Doubled letter (duplicate each character)
  for (let i = 0; i < lower.length; i++) {
    candidates.push(lower.slice(0, i) + lower[i] + lower[i] + lower.slice(i + 1));
  }

  // 4. Dutch spelling swaps
  for (const [from, to] of DUTCH_SWAPS) {
    if (lower.includes(from)) {
      candidates.push(lower.replace(from, to));
    }
  }

  // 5. Transposed adjacent characters
  for (let i = 0; i < lower.length - 1; i++) {
    const chars = lower.split('');
    [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
    candidates.push(chars.join(''));
  }

  return dedupe(candidates, lower)
    .filter(isValidName)
    .filter((s) => s.length >= 2 && s.length <= 63)
    .slice(0, 10);
}
