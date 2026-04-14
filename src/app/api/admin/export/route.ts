import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStats } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  // Auth check
  const token = cookies().get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const days = parseInt(request.nextUrl.searchParams.get('days') ?? '7', 10);
  const stats = await getStats(days);

  // Build CSV sections
  const rows: string[] = [];

  rows.push('=== DAGELIJKSE DATA ===');
  rows.push('Datum,Paginaweergaven,Bezoekers');
  for (const d of stats.dailyData) {
    rows.push(`${d.date},${d.views},${d.visitors}`);
  }

  rows.push('');
  rows.push('=== TOP PAGINAS ===');
  rows.push('Pagina,Weergaven');
  for (const e of stats.topPages) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== TOP ZOEKOPDRACHTEN ===');
  rows.push('Query,Aantal');
  for (const e of stats.topSearches) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== REGISTRAR KLIKKEN ===');
  rows.push('Registrar,Klikken');
  for (const e of stats.topClicks) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== REFERRERS ===');
  rows.push('Bron,Bezoeken');
  for (const e of stats.topReferrers) {
    rows.push(`"${e.member || 'direct'}",${e.score}`);
  }

  rows.push('');
  rows.push('=== LANDEN ===');
  rows.push('Land,Bezoeken');
  for (const e of stats.countries) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== STEDEN ===');
  rows.push('Stad,Bezoeken');
  for (const e of stats.cities) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== APPARATEN ===');
  rows.push('Apparaat,Sessies');
  for (const e of stats.devices) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== BROWSERS ===');
  rows.push('Browser,Sessies');
  for (const e of stats.browsers) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== BESTURINGSSYSTEMEN ===');
  rows.push('OS,Sessies');
  for (const e of stats.os) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== UTM BRONNEN ===');
  rows.push('UTM Source,Sessies');
  for (const e of stats.utmSources) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== DOMEIN EXTENSIES ===');
  rows.push('Extensie,Zoekopdrachten');
  for (const e of stats.topExtensions) {
    rows.push(`"${e.member}",${e.score}`);
  }

  rows.push('');
  rows.push('=== SCROLL DIEPTE ===');
  rows.push('Diepte,Aantal');
  for (const e of stats.scrollDepth) {
    rows.push(`"${e.member}%",${e.score}`);
  }

  const csv = rows.join('\n');
  const filename = `analytics-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
