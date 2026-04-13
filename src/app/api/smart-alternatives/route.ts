import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sanitizeKeyword } from '@/lib/domain-generator';

const client = new Anthropic();

const cache = new Map<string, { names: string[]; expiresAt: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

function isValidCandidate(name: string): boolean {
  if (!/^[a-z][a-z0-9-]{1,12}$/.test(name)) return false;
  if (name.endsWith('nl')) return false;
  const vowels = (name.replace(/-/g, '').match(/[aeiou]/g) ?? []).length;
  if (vowels < 2) return false;
  return true;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI niet geconfigureerd' }, { status: 503 });
  }

  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken. Probeer later opnieuw.' }, { status: 429 });
  }

  let keyword: string;
  let seed: number;
  try {
    const body = await request.json();
    keyword = body.keyword;
    seed = typeof body.seed === 'number' ? Math.min(5, Math.max(1, body.seed)) : 1;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
    return NextResponse.json({ error: 'Trefwoord te kort' }, { status: 400 });
  }

  const clean = sanitizeKeyword(keyword).slice(0, 60);
  const cacheKey = `${clean}::smart::${seed}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json({ names: cached.names, cached: true });
  }

  const seedInstruction = seed > 1
    ? `\nVariatie ${seed}: genereer een andere set dan de standaard — focus meer op ${seed % 2 === 0 ? 'synoniemen en semantische alternatieven' : 'creatieve merknamen en Engelse opties'}.`
    : '';

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `Je bent een expert domeinnaam-adviseur voor Nederlandse bedrijven.
Je antwoordt ALTIJD met geldige JSON en niets anders.`,
      messages: [
        {
          role: 'user',
          content: `Het domein "${clean}.nl" is bezet. Genereer 20 domeinnaam-kandidaten
(alleen de naam, zonder extensie) die een echte ondernemer zou overwegen
als serieus alternatief.${seedInstruction}

Criteria in volgorde van prioriteit:
1. Exact trefwoord + één sterk woord: de${clean}, ${clean}groep,
   ${clean}expert — totaallengte ≤ 13
2. Synoniemen of semantisch verwante namen in dezelfde branche
3. Creatieve, uitsprekbare merknamen die het concept oproepen
4. Engelse alternatieven als het trefwoord dat toelaat

Regels:
- Alleen lowercase a-z, eventueel koppeltekens (geen cijfers)
- Elke naam: minimaal 2 klinkers, maximaal 13 tekens
- GEEN mechanische varianten (${clean}nl, ${clean}direct, get${clean})
- GEEN afkortingen of klinkerloze vormen
- GEEN naam die eindigt op "nl" (verwarring met .nl TLD)
- GEEN namen langer dan 13 tekens

Geef terug als JSON: {"names": ["naam1", "naam2", ...]}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Geen JSON in antwoord');

    const parsed = JSON.parse(jsonMatch[0]) as { names: unknown };
    const raw = Array.isArray(parsed.names) ? parsed.names : [];
    const names = raw
      .filter((n): n is string => typeof n === 'string')
      .map((n) => n.toLowerCase().trim())
      .filter(isValidCandidate)
      .slice(0, 20);

    cache.set(cacheKey, { names, expiresAt: Date.now() + CACHE_TTL });

    return NextResponse.json({ names, cached: false });
  } catch (err) {
    console.error('[smart-alternatives]', err);
    return NextResponse.json({ error: 'AI tijdelijk niet beschikbaar' }, { status: 500 });
  }
}
