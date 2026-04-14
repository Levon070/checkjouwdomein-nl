import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStats, type ZEntry } from '@/lib/analytics';
import LiveCounter from '@/components/analytics/LiveCounter';
import { DailyChart, HourlyChart, FunnelViz, DowChart } from '@/components/analytics/DashboardCharts';

interface Props {
  searchParams: { days?: string };
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: Props) {
  const token = cookies().get('admin_token')?.value;
  const secret = process.env.ANALYTICS_SECRET;
  if (!secret || token !== secret) redirect('/admin');

  const days = Math.min(Math.max(parseInt(searchParams.days ?? '7', 10) || 7, 1), 30);
  const stats = await getStats(days);

  // New vs returning
  const newV = stats.visitorTypes.find((e) => e.member === 'new')?.score ?? 0;
  const retV = stats.visitorTypes.find((e) => e.member === 'returning')?.score ?? 0;
  const totalVT = newV + retV || 1;
  const returningPct = Math.round((retV / totalVT) * 100);

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Header */}
      <div className="border-b border-slate-800/60 px-6 py-3.5 flex items-center justify-between bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight text-white">Analytics</h1>
            <p className="text-slate-500 text-xs">CheckJouwDomein.nl</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LiveCounter />
          <a
            href={`/api/admin/export?days=${days}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </a>
          <a href="/admin" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            Uitloggen →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* Date range tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          {[{ label: 'Vandaag', value: 1 }, { label: '7 dagen', value: 7 }, { label: '30 dagen', value: 30 }].map(
            ({ label, value }) => (
              <a
                key={value}
                href={`/admin/dashboard?days=${value}`}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  days === value
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </a>
            )
          )}
        </div>

        {/* ── Stat cards row 1 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Paginaweergaven"
            value={stats.totalPageviews}
            change={stats.comparison.pageviewsChange}
            icon={<EyeIcon />}
            accent="blue"
          />
          <StatCard
            label="Unieke bezoekers"
            value={stats.uniqueVisitors}
            change={stats.comparison.visitorsChange}
            icon={<UsersIcon />}
            accent="violet"
          />
          <StatCard
            label="Zoekopdrachten"
            value={stats.funnel.searches}
            icon={<SearchIcon />}
            accent="emerald"
            sub={`${stats.conversionRate}% conversie`}
          />
          <StatCard
            label="Registrar klikken"
            value={stats.funnel.clicks}
            icon={<CursorIcon />}
            accent="amber"
          />
        </div>

        {/* ── Stat cards row 2 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniCard
            label="Terugkerende bezoekers"
            value={`${returningPct}%`}
            sub={`${retV.toLocaleString('nl-NL')} van ${(newV + retV).toLocaleString('nl-NL')}`}
            icon="🔁"
            color="text-cyan-400"
          />
          <MiniCard
            label="Nieuwe bezoekers"
            value={`${100 - returningPct}%`}
            sub={`${newV.toLocaleString('nl-NL')} bezoekers`}
            icon="✨"
            color="text-indigo-400"
          />
          <MiniCard
            label="Populairste extensie"
            value={stats.topExtensions[0]?.member ?? '—'}
            sub={stats.topExtensions[0] ? `${stats.topExtensions[0].score}× gezocht` : 'nog geen data'}
            icon="🌐"
            color="text-emerald-400"
          />
          <MiniCard
            label="Scroll completie"
            value={
              stats.scrollDepth.find((e) => e.member === '100')
                ? `${Math.round(
                    ((stats.scrollDepth.find((e) => e.member === '100')?.score ?? 0) /
                      Math.max(stats.scrollDepth.find((e) => e.member === '25')?.score ?? 1, 1)) *
                      100
                  )}%`
                : '—'
            }
            sub="bereikt 100% scroll"
            icon="📜"
            color="text-pink-400"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white">Paginaweergaven</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Afgelopen {days === 1 ? 'dag' : `${days} dagen`}
                  {days > 1 && <span className="ml-1 text-slate-600">vs vorige periode</span>}
                </p>
              </div>
            </div>
            <DailyChart
              dailyData={stats.dailyData}
              previousDailyData={stats.previousDailyData}
              days={days}
            />
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-1">Bezoeken per uur</p>
            <p className="text-xs text-slate-500 mb-4">UTC lokale tijd</p>
            <HourlyChart data={stats.hourlyData} />
          </div>
        </div>

        {/* ── Funnel + day of week ── */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-1">Conversietrechter</p>
            <p className="text-xs text-slate-500 mb-4">Bezoeker → zoek → klik</p>
            <FunnelViz funnel={stats.funnel} />
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-1">Drukste dag van de week</p>
            <p className="text-xs text-slate-500 mb-4">Cumulatief over geselecteerde periode</p>
            <DowChart data={stats.dowData} />
          </div>
        </div>

        {/* ── Top searches + clicks + extensions ── */}
        <div className="grid md:grid-cols-3 gap-3">
          <TopTable title="Top zoekopdrachten" subtitle="populairste queries" entries={stats.topSearches} accentColor="#8b5cf6" />
          <TopTable title="Registrar klikken" subtitle="meest geklikt" entries={stats.topClicks} accentColor="#10b981" />
          <TopTable title="Domein extensies" subtitle="meest gezocht" entries={stats.topExtensions} accentColor="#06b6d4" />
        </div>

        {/* ── Pages + referrers ── */}
        <div className="grid md:grid-cols-2 gap-3">
          <TopTable title="Top pagina's" subtitle="meest bezochte pagina's" entries={stats.topPages} accentColor="#3b82f6" />
          <TopTable
            title="Referrers"
            subtitle="herkomst bezoekers"
            entries={stats.topReferrers}
            accentColor="#f59e0b"
            formatMember={(m) => m || 'direct / geen'}
          />
        </div>

        {/* ── Landing pages ── */}
        {stats.topLandingPages.length > 0 && (
          <TopTable
            title="Landingspagina's"
            subtitle="eerste pagina die bezoekers bezoeken (geen interne navigatie)"
            entries={stats.topLandingPages}
            accentColor="#a78bfa"
          />
        )}

        {/* ── UTM tracking ── */}
        {(stats.utmSources.length > 0 || stats.utmCampaigns.length > 0) && (
          <div className="grid md:grid-cols-3 gap-3">
            {stats.utmSources.length > 0 && (
              <TopTable title="UTM Sources" subtitle="traffic bronnen" entries={stats.utmSources} accentColor="#f472b6" />
            )}
            {stats.utmMediums.length > 0 && (
              <TopTable title="UTM Mediums" subtitle="kanaaltype" entries={stats.utmMediums} accentColor="#fb923c" />
            )}
            {stats.utmCampaigns.length > 0 && (
              <TopTable title="UTM Campagnes" subtitle="campagnenamen" entries={stats.utmCampaigns} accentColor="#facc15" />
            )}
          </div>
        )}

        {/* ── Cities ── */}
        {stats.cities.length > 0 && (
          <TopTable title="Steden" subtitle="herkomst op locatie" entries={stats.cities} accentColor="#06b6d4" />
        )}

        {/* ── Scroll depth ── */}
        {stats.scrollDepth.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-1">Scroll diepte</p>
            <p className="text-xs text-slate-500 mb-5">Hoever scrollen bezoekers door de pagina</p>
            <ScrollDepthViz entries={stats.scrollDepth} />
          </div>
        )}

        {/* ── Breakdown row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <BreakdownCard title="Apparaten" entries={stats.devices} colors={['#3b82f6', '#8b5cf6', '#10b981']} />
          <BreakdownCard title="Browsers" entries={stats.browsers} colors={['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6']} />
          <BreakdownCard title="Besturingssystemen" entries={stats.os} colors={['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']} />
          <BreakdownCard title="Landen" entries={stats.countries} colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']} />
        </div>

        {/* ── Visitor type ── */}
        {stats.visitorTypes.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
            <p className="text-sm font-medium text-white mb-4">Nieuw vs terugkerend</p>
            <BreakdownInline
              entries={stats.visitorTypes}
              colors={{ new: '#6366f1', returning: '#10b981' }}
              labels={{ new: 'Nieuwe bezoekers', returning: 'Terugkerend' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const ACCENT_COLORS: Record<string, { border: string; bg: string; icon: string; glow: string }> = {
  blue:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    icon: 'text-blue-400',    glow: 'shadow-blue-900/30' },
  violet:  { border: 'border-violet-500/30',  bg: 'bg-violet-500/10',  icon: 'text-violet-400',  glow: 'shadow-violet-900/30' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'shadow-emerald-900/30' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   icon: 'text-amber-400',   glow: 'shadow-amber-900/30' },
};

function StatCard({
  label,
  value,
  change,
  icon,
  accent = 'blue',
  sub,
}: {
  label: string;
  value: number;
  change?: number | null;
  icon?: React.ReactNode;
  accent?: string;
  sub?: string;
}) {
  const c = ACCENT_COLORS[accent] ?? ACCENT_COLORS.blue;
  const isPositive = change !== null && change !== undefined && change > 0;
  const isNegative = change !== null && change !== undefined && change < 0;

  return (
    <div className={`relative bg-slate-900/60 border ${c.border} rounded-xl p-4 shadow-lg ${c.glow} overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-px ${c.bg.replace('/10', '/60')}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.icon} flex items-center justify-center`}>
          {icon}
        </div>
        {change !== null && change !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' :
            isNegative ? 'bg-red-500/10 text-red-400' :
            'bg-slate-800 text-slate-500'
          }`}>
            {isPositive ? '↑' : isNegative ? '↓' : '→'}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tabular-nums tracking-tight">{value.toLocaleString('nl-NL')}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function MiniCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <p className="text-slate-500 text-xs leading-tight">{label}</p>
      </div>
      <p className={`text-xl font-bold tabular-nums tracking-tight ${color}`}>{value}</p>
      <p className="text-slate-600 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

function TopTable({
  title,
  subtitle,
  entries,
  formatMember = (m) => m,
  accentColor = '#3b82f6',
}: {
  title: string;
  subtitle?: string;
  entries: ZEntry[];
  formatMember?: (m: string) => string;
  accentColor?: string;
}) {
  const max = entries[0]?.score ?? 1;

  return (
    <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
      <div className="mb-4">
        <p className="text-sm font-medium text-white">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {entries.length === 0 ? (
        <p className="text-slate-600 text-sm py-4 text-center">Nog geen data</p>
      ) : (
        <div className="space-y-3">
          {entries.map((e, i) => (
            <div key={e.member} className="group">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-slate-600 text-xs w-4 tabular-nums">{i + 1}</span>
                <span className="text-xs text-slate-300 font-mono truncate flex-1 group-hover:text-white transition-colors">
                  {formatMember(e.member)}
                </span>
                <span className="text-slate-400 text-xs tabular-nums flex-shrink-0 font-medium">
                  {e.score.toLocaleString('nl-NL')}
                </span>
              </div>
              <div className="h-1 bg-slate-800/80 rounded-full overflow-hidden ml-6">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(e.score / max) * 100}%`, backgroundColor: accentColor, opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BreakdownCard({
  title,
  entries,
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
}: {
  title: string;
  entries: ZEntry[];
  colors?: string[];
}) {
  const total = entries.reduce((s, e) => s + e.score, 0) || 1;

  return (
    <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
      <p className="text-sm font-medium text-white mb-4">{title}</p>
      {entries.length === 0 ? (
        <p className="text-slate-600 text-sm py-4 text-center">Nog geen data</p>
      ) : (
        <>
          <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
            {entries.map((e, i) => (
              <div
                key={e.member}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ width: `${(e.score / total) * 100}%`, backgroundColor: colors[i % colors.length] }}
              />
            ))}
          </div>
          <div className="space-y-2.5">
            {entries.map((e, i) => (
              <div key={e.member} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-xs text-slate-300 flex-1 truncate">{e.member}</span>
                <span className="text-xs text-slate-500 tabular-nums">{Math.round((e.score / total) * 100)}%</span>
                <span className="text-xs text-slate-600 tabular-nums w-8 text-right">{e.score}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ScrollDepthViz({ entries }: { entries: ZEntry[] }) {
  const milestones = ['25', '50', '75', '100'];
  const map = new Map(entries.map((e) => [e.member, e.score]));
  const base = map.get('25') || 1;
  const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="grid grid-cols-4 gap-4">
      {milestones.map((m, i) => {
        const count = map.get(m) ?? 0;
        const pct = Math.round((count / base) * 100);
        return (
          <div key={m} className="text-center">
            <div className="relative w-14 h-14 mx-auto mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke={colors[i]}
                  strokeWidth="3"
                  strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: colors[i] }}>{pct}%</span>
              </div>
            </div>
            <p className="text-slate-300 text-xs font-medium">{m}% scroll</p>
            <p className="text-slate-600 text-xs">{count.toLocaleString('nl-NL')} sess.</p>
          </div>
        );
      })}
    </div>
  );
}

function BreakdownInline({
  entries,
  colors,
  labels,
}: {
  entries: ZEntry[];
  colors: Record<string, string>;
  labels: Record<string, string>;
}) {
  const total = entries.reduce((s, e) => s + e.score, 0) || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-px">
        {entries.map((e) => (
          <div
            key={e.member}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(e.score / total) * 100}%`, backgroundColor: colors[e.member] ?? '#475569' }}
          />
        ))}
      </div>
      <div className="flex gap-6 flex-wrap">
        {entries.map((e) => (
          <div key={e.member} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[e.member] ?? '#475569' }} />
            <div>
              <p className="text-sm font-semibold text-white">{e.score.toLocaleString('nl-NL')}</p>
              <p className="text-xs text-slate-500">{labels[e.member] ?? e.member}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
