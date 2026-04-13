import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

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

async function fetchNames(sector: string, style: string, maxLen: number): Promise<GeneratedName[]> {
  const styleDesc: Record<string, string> = {
    professioneel: 'professioneel en zakelijk — vertrouwen uitstralen',
    speels:        'speels en vriendelijk — laagdrempelig en leuk',
    modern:        'modern en tech-forward — strak en innovatief',
    lokaal:        'lokaal en Nederlands — herkenbaar en vertrouwd',
    internationaal:'internationaal — werkt in meerdere talen',
  };
  const styleLabel = styleDesc[style] ?? 'professioneel';

  const prompt = `Bedenk 12 unieke merknamen (zonder extensie) voor een ${sector}-bedrijf.

Stijl: ${styleLabel}
Maximale lengte: ${maxLen} tekens
Taal: Nederlands of Engels, maar altijd uitsprekbaar voor Nederlanders
Formaat: alleen lowercase letters a-z en eventueel één koppelteken

Eisen:
- Memorabel en merkwaardig
- Niet te generiek (geen "beste${sector}" of "${sector}online")
- Mix van: woordcombinaties, samengestelde woorden, creatieve afkortingen
- Vermijd cijfers tenzij ze echt passen bij het merk

Geef terug als JSON — niets anders:
{"names":[{"name":"naam","rationale":"1-zin uitleg waarom dit werkt voor ${sector}"},...]}`;

  const res = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 700,
    system: 'Je bent een expert brand naming consultant voor Nederlandse bedrijven. Antwoord ALTIJD met geldige JSON en niets anders.',
    messages: [{ role: 'user', content: prompt }],
  });

  const text = res.content[0].type === 'text' ? res.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];
  const parsed = JSON.parse(match[0]);
  return (parsed.names ?? []).slice(0, 12) as GeneratedName[];
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector')?.trim().slice(0, 50) ?? '';
  const style  = searchParams.get('style')?.trim() ?? 'professioneel';
  const maxLen = Math.min(Number(searchParams.get('maxLen') ?? 15), 20);

  if (!sector || sector.length < 2) {
    return NextResponse.json({ error: 'Ongeldige sector' }, { status: 400 });
  }

  const getCached = unstable_cache(
    () => fetchNames(sector, style, maxLen),
    ['generate-names', sector, style, String(maxLen)],
    { revalidate: 3600 }
  );

  const names = await getCached();
  return NextResponse.json({ names });
}
