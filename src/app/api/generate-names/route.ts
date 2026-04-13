import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

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

export interface GeneratedName {
  name: string;
  rationale: string;
}

async function fetchNames(
  sector: string,
  style: string,
  maxLen: number,
  keywords: string,
  location: string,
): Promise<GeneratedName[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const styleDesc: Record<string, string> = {
    professioneel:  'professioneel en zakelijk — vertrouwen en expertise uitstralen',
    speels:         'speels en vriendelijk — laagdrempelig, warm en benaderbaar',
    modern:         'modern en tech-forward — strak, innovatief en schaalbaar',
    lokaal:         'lokaal en Nederlands — herkenbaar, buurtgebonden en authentiek',
    internationaal: 'internationaal — werkt in meerdere talen, geen typisch Nederlandse woorden',
  };
  const styleLabel = styleDesc[style] ?? 'professioneel en zakelijk';

  const contextLines = [
    keywords ? `Kernwoorden/USP van dit bedrijf: ${keywords}` : '',
    location ? `Locatie/regio: ${location}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `Je bent een expert brand naming consultant voor Nederlandse MKB-bedrijven.
Bedenk 15 unieke, merkwaardige bedrijfsnamen (zonder domeinextensie) voor een ${sector}-bedrijf.

${contextLines}
Stijl: ${styleLabel}
Maximale naamlengte: ${maxLen} tekens
Formaat: alleen lowercase letters a-z, eventueel één koppelteken — geen cijfers tenzij echt onderscheidend

STRIKTE VERBODEN — genereer NOOIT namen die starten met:
mijn, jouw, uw, onze, de, het, top, best, beste, super, mega, direct, online, goed, snel

STRIKTE VERBODEN — genereer NOOIT namen die eindigen op:
online, direct, info, dienst, service

GOEDE namen zijn: kort (≤12 tekens), memorabel, eigen karakter, makkelijk te spellen.
Voorbeelden van GOEDE namen: boulangerie, verscraft, bakwise, panenco, ambachtco
Voorbeelden van SLECHTE namen: mijnbakkerij, topbakker, bakkerijdirect, onlinebakker

Mix verplicht: samengestelde woorden, creatieve afkortingen, nieuwgevormde woorden, of Nl/En-mix.

Geef terug als JSON — NIETS anders:
{"names":[{"name":"naam","rationale":"1-zin NL uitleg waarom dit werkt voor ${sector}"},...]}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 900,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Je bent een expert brand naming consultant. Antwoord ALTIJD met geldige JSON en nooit iets anders.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];
  let parsed: { names?: GeneratedName[] };
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return [];
  }

  const BANNED_PREFIXES = ['mijn', 'jouw', 'uw', 'onze', 'de', 'het', 'top', 'best', 'super', 'mega', 'direct', 'online', 'goed', 'snel'];
  const BANNED_SUFFIXES = ['online', 'direct', 'info', 'dienst', 'service'];
  const filtered = (parsed.names ?? []).filter((n: GeneratedName) => {
    const name = (n.name ?? '').toLowerCase();
    if (!name || name.length < 3 || name.length > maxLen) return false;
    if (BANNED_PREFIXES.some(p => name.startsWith(p) && name.length > p.length)) return false;
    if (BANNED_SUFFIXES.some(s => name.endsWith(s))) return false;
    return true;
  });

  return filtered.slice(0, 15) as GeneratedName[];
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const sector   = searchParams.get('sector')?.trim().slice(0, 60) ?? '';
  const style    = searchParams.get('style')?.trim() ?? 'professioneel';
  const maxLen   = Math.min(Number(searchParams.get('maxLen') ?? 15), 20);
  const keywords = (searchParams.get('keywords') ?? '').trim().slice(0, 100);
  const location = (searchParams.get('location') ?? '').trim().slice(0, 60);

  if (!sector || sector.length < 2) {
    return NextResponse.json({ error: 'Ongeldige sector' }, { status: 400 });
  }

  const getCached = unstable_cache(
    () => fetchNames(sector, style, maxLen, keywords, location),
    ['generate-names-v3', sector, style, String(maxLen), keywords, location],
    { revalidate: 3600 }
  );

  try {
    const names = await getCached();
    return NextResponse.json({ names });
  } catch (err) {
    console.error('[generate-names] error:', err);
    return NextResponse.json({ error: 'Genereren mislukt' }, { status: 500 });
  }
}
