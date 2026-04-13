import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// --- Rate limiter: max 10 AI-verzoeken per minuut per IP ---
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

export interface AiSuggestion {
  name: string;
  rationale: string;
}

async function fetchAiSuggestions(clean: string, mode: string): Promise<AiSuggestion[]> {
  const userPrompt = mode === 'closeness'
    ? `Het domein "${clean}.nl" is al bezet.
Bedenk 8 domeinnamen (zonder extensie) die zo dicht mogelijk bij "${clean}" liggen —
namen waarbij een ondernemer zich meteen thuis voelt als alternatief.

Regels:
- Alleen lowercase letters a-z en eventueel koppeltekens (geen cijfers tenzij echt passend)
- Maximaal 15 tekens
- Goed uitsprekbaar in het Nederlands
- Prioriteit: "${clean}" met een klein prefix of suffix (de, mijn, jouw, nl, online, nu, direct, hub)
- Geen totaal andere concepten — blijf zo dicht mogelijk bij het origineel
- Vermijd de meest voor de hand liggende varianten (mijn${clean}, de${clean}, ${clean}online) — bedenk subtielere of elegantere varianten

Geef terug als JSON:
{"suggestions":[{"name":"naam","rationale":"1-regel uitleg in het Nederlands"},...]}`.trim()
    : `Bedenk 8 creatieve domeinnamen (zonder extensie) voor: "${clean}".

Regels:
- Alleen lowercase letters a-z en eventueel koppeltekens (geen cijfers tenzij echt passend)
- Maximaal 15 tekens
- Goed uitsprekbaar in het Nederlands
- Memorabel en merkwaardig
- Varieer: exact trefwoord, combinaties, creatieve varianten, Engelse opties

Geef terug als JSON:
{"suggestions":[{"name":"naam","rationale":"1-regel uitleg"},...]}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: `Je bent een expert in het bedenken van domeinnamen voor Nederlandse bedrijven.
Je antwoordt ALTIJD met geldige JSON en nooit iets anders.`,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Geen JSON in antwoord');

  const parsed = JSON.parse(jsonMatch[0]) as { suggestions: AiSuggestion[] };
  return (parsed.suggestions ?? [])
    .filter(
      (s) =>
        typeof s.name === 'string' &&
        /^[a-z][a-z0-9-]{0,14}$/.test(s.name) &&
        typeof s.rationale === 'string'
    )
    .slice(0, 8);
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
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer later opnieuw.' },
      { status: 429 }
    );
  }

  let keyword: string;
  let mode: 'creative' | 'closeness';
  try {
    const body = await request.json();
    keyword = body.keyword;
    mode = body.mode === 'closeness' ? 'closeness' : 'creative';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
    return NextResponse.json({ error: 'Trefwoord te kort' }, { status: 400 });
  }

  const clean = keyword.trim().toLowerCase().slice(0, 80);
  const cacheKey = `${clean}::${mode}`;

  try {
    const getCached = unstable_cache(
      () => fetchAiSuggestions(clean, mode),
      ['ai-suggestions', cacheKey],
      { revalidate: 86400 }
    );

    const suggestions = await getCached();
    return NextResponse.json({ suggestions, cached: false });
  } catch (err) {
    console.error('[ai-suggestions]', err);
    return NextResponse.json(
      { error: 'AI-suggesties tijdelijk niet beschikbaar' },
      { status: 500 }
    );
  }
}
