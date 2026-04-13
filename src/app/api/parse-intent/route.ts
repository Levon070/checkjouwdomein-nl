import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sanitizeKeyword } from '@/lib/domain-generator';

const client = new Anthropic();

const cache = new Map<string, { result: IntentResult; expiresAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const rateMap = new Map<string, { count: number; resetAt: number }>();

interface IntentResult {
  keyword: string;
  location: string | null;
  industry: string | null;
}

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

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI niet geconfigureerd' }, { status: 503 });
  }

  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  let input: string;
  try {
    const body = await request.json();
    input = body.input?.trim() ?? '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!input || input.length < 3) {
    return NextResponse.json({ error: 'Invoer te kort' }, { status: 400 });
  }

  // If no spaces — treat as single keyword, no AI needed
  if (!input.includes(' ')) {
    const keyword = sanitizeKeyword(input);
    return NextResponse.json({ keyword, location: null, industry: null });
  }

  const cacheKey = input.toLowerCase().slice(0, 120);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.result);
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 150,
      system: `Je bent een Nederlandse zoekopdracht-analyseur.
Extraheer uit de tekst: het hoofd-trefwoord voor een domeinnaam, een eventuele locatie, en een eventuele branche.
Antwoord ALLEEN met geldige JSON en niets anders.`,
      messages: [
        {
          role: 'user',
          content: `Analyseer deze zoekopdracht en geef JSON terug:
"${input.slice(0, 200)}"

Formaat: {"keyword": "hoofdwoord", "location": "stad of null", "industry": "branche of null"}
- keyword: het meest relevante enkelvoudige woord voor een domeinnaam (lowercase, geen spaties)
- location: stad/regio als vermeld, anders null
- industry: branchetype als duidelijk, anders null`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Geen JSON in antwoord');

    const parsed = JSON.parse(jsonMatch[0]) as IntentResult;
    const result: IntentResult = {
      keyword: sanitizeKeyword(parsed.keyword ?? input.split(' ')[0]),
      location: typeof parsed.location === 'string' ? parsed.location.toLowerCase() : null,
      industry: typeof parsed.industry === 'string' ? parsed.industry.toLowerCase() : null,
    };

    cache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(result);
  } catch (err) {
    console.error('[parse-intent]', err);
    // Fallback: use first word as keyword
    const fallback = sanitizeKeyword(input.split(' ')[0]);
    return NextResponse.json({ keyword: fallback, location: null, industry: null });
  }
}
