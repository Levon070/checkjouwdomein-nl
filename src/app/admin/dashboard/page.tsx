import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStats, DashboardStats, ZEntry } from '@/lib/analytics';
import LiveCounter from '@/components/analytics/LiveCounter';
import { DailyChart, HourlyChart, FunnelViz } from '@/components/analytics/DashboardCharts';

interface Props {
  searchParams: { days?: string };
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: Props) {
  // Auth check
  const token = cookies().get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || token !== secret) redirect('/admin');

  const days = Math.min(Math.max(parseInt(searchParams.days ?? '7', 10) || 7, 1), 30);
  const stats = await getStats(days);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg tracking-tight">Analytics</h1>
          <p className="text-slate-500 text-xs">CheckJouwDomein.nl</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveCounter />
          <a href="/admin" className="text-slate-500 hover:text-white text-sm transition-colors">
            Uitloggen
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Date range */}
        <div className="flex gap-2">
          {[{ label: 'Vandaag', value: 1 }, { label: '7 dagen', value: 7 }, { label: '30 dagen', value: 30 }].map(
            ({ label, value }) => (
              <a
                key={value}
                href={`/admin/dashboard?days=${value}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  days === value ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {label}
              </a>
            )
          )}
        </div>

        {/* Stat cards with comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Paginaweergaven"
            value={stats.totalPageviews}
            change={stats.comparison.pageviewsChange}
          />
          <StatCard
            label="Unieke bezoekers"
            value={stats.uniqueVisitors}
            change={stats.comparison.visitorsChange}
          />
          <StatCard
            label="Zoekopdrachten"
            value={stats.funnel.searches}
          />
          <StatCard
            label="Registrar klikken"
            value={stats.funnel.clicks}
          />
        </div>

        {/* Daily trend + Hourly distribution */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-4">
              Paginaweergaven per dag
              {days > 1 && (
                <span className="ml-2 text-slate-600">
                  — vs vorige {days} dagen
                </span>
              )}
            </p>
            <DailyChart
              dailyData={stats.dailyData}
              previousDailyData={stats.previousDailyData}
              days={days}
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-4">Bezoeken per uur (UTC+1)</p>
            <HourlyChart data={stats.hourlyData} />
          </div>
        </div>

        {/* Funnel + Top searches + Top clicks */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-4">Conversie trechter</p>
            <FunnelViz funnel={stats.funnel} />
          </div>
          <TopTable title="Top zoekopdrachten" entries={stats.topSearches} />
          <TopTable title="Registrar klikken" entries={stats.topClicks} />
        </div>

        {/* Top pages + Referrers */}
        <div className="grid md:grid-cols-2 gap-4">
          <TopTable title="Top pagina's" entries={stats.topPages} />
          <TopTable title="Referrers" entries={stats.topReferrers} formatMember={(m) => m || 'direct'} />
        </div>

        {/* Breakdown row */}
        <div className="grid md:grid-cols-3 gap-4">
          <BreakdownCard title="Apparaten" entries={stats.devices} />
          <BreakdownCard title="Browsers" entries={stats.browsers} />
          <BreakdownCard title="Landen" entries={stats.countries} />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change?: number | null;
}) {
  const isPositive = change !== null && change !== undefined && change > 0;
  const isNegative = change !== null && change !== undefined && change < 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold">{value.toLocaleString('nl-NL')}</p>
      {change !== null && change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
          isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-500'
        }`}>
          <span>{isPositive ? '↑' : isNegative ? '↓' : '→'}</span>
          <span>{Math.abs(change)}% vs vorige periode</span>
        </div>
      )}
    </div>
  );
}

function TopTable({
  title,
  entries,
  formatMember = (m) => m,
}: {
  title: string;
  entries: ZEntry[];
  formatMember?: (m: string) => string;
}) {
  const max = entries[0]?.score ?? 1;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-400 text-xs mb-3">{title}</p>
      {entries.length === 0 ? (
        <p className="text-slate-600 text-sm">Geen data</p>
      ) : (
        <div className="space-y-2.5">
          {entries.map((e) => (
            <div key={e.member}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs text-white font-mono truncate max-w-[75%]">
                  {formatMember(e.member)}
                </span>
                <span className="text-slate-400 text-xs flex-shrink-0">{e.score.toLocaleString('nl-NL')}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(e.score / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BreakdownCard({ title, entries }: { title: string; entries: ZEntry[] }) {
  const total = entries.reduce((s, e) => s + e.score, 0) || 1;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-400 text-xs mb-3">{title}</p>
      {entries.length === 0 ? (
        <p className="text-slate-600 text-sm">Geen data</p>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.member} className="flex items-center gap-2">
              <span className="text-sm text-white w-20 truncate">{e.member}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(e.score / total) * 100}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs w-8 text-right">
                {Math.round((e.score / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
