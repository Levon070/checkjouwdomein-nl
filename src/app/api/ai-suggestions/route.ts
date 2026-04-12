import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Simple in-memory rate limiter (resets on cold start)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 20; // max 20 AI requests/min per IP
}

export interface AiSuggestion {
  name: string;
  rationale: string;
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
  try {
    const body = await request.json();
    keyword = body.keyword;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
    return NextResponse.json({ error: 'Trefwoord te kort' }, { status: 400 });
  }

  const clean = keyword.trim().slice(0, 80);

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: `Je bent een expert in het bedenken van domeinnamen voor Nederlandse bedrijven.
Je antwoordt ALTIJD met geldige JSON en nooit iets anders.`,
      messages: [
        {
          role: 'user',
          content: `Bedenk 8 creatieve domeinnamen (zonder extensie) voor: "${clean}".

Regels:
- Alleen lowercase letters a-z en eventueel koppeltekens (geen cijfers tenzij echt passend)
- Maximaal 15 tekens
- Goed uitsprekbaar in het Nederlands
- Memorabel en merkwaardig
- Varieer: exact trefwoord, combinaties, creatieve varianten, Engelse opties

Geef terug als JSON:
{"suggestions":[{"name":"naam","rationale":"1-regel uitleg"},...]}`
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response (model may wrap it in markdown code block)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Geen JSON in antwoord');

    const parsed = JSON.parse(jsonMatch[0]) as { suggestions: AiSuggestion[] };
    const suggestions: AiSuggestion[] = (parsed.suggestions ?? [])
      .filter(
        (s) =>
          typeof s.name === 'string' &&
          /^[a-z][a-z0-9-]{0,14}$/.test(s.name) &&
          typeof s.rationale === 'string'
      )
      .slice(0, 8);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error('[ai-suggestions]', err);
    return NextResponse.json(
      { error: 'AI-suggesties tijdelijk niet beschikbaar' },
      { status: 500 }
    );
  }
}
