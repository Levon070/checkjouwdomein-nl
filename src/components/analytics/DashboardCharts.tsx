'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { DashboardStats } from '@/lib/analytics';

const TOOLTIP_STYLE = {
  backgroundColor: '#0d1424',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
};
const TICK = { fill: '#475569', fontSize: 10 };
const GRID = 'rgba(148, 163, 184, 0.06)';

// ── Daily trend chart ────────────────────────────────────────────────────────

export function DailyChart({
  dailyData,
  previousDailyData,
  days,
}: {
  dailyData: DashboardStats['dailyData'];
  previousDailyData: DashboardStats['previousDailyData'];
  days: number;
}) {
  const data = dailyData.map((d, i) => ({
    label: days === 1 ? d.date : d.date.slice(5),
    views: d.views,
    prev: previousDailyData[i]?.views ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#475569" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#475569" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} width={32} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
          itemStyle={{ color: '#e2e8f0' }}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="prev"
          name="Vorige periode"
          stroke="#334155"
          fill="url(#gPrev)"
          strokeDasharray="3 3"
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="views"
          name="Paginaweergaven"
          stroke="#3b82f6"
          fill="url(#gViews)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6', stroke: '#1e3a5f', strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Hourly distribution chart ────────────────────────────────────────────────

export function HourlyChart({ data }: { data: DashboardStats['hourlyData'] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey="hour"
          tick={TICK}
          tickLine={false}
          axisLine={false}
          interval={5}
        />
        <YAxis tick={TICK} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
          formatter={(v) => [v, 'Weergaven']}
          cursor={{ fill: 'rgba(99,102,241,0.08)' }}
          isAnimationActive={false}
        />
        <Bar dataKey="count" name="Weergaven" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.count === maxCount ? '#818cf8' : '#6366f1'}
              opacity={entry.count === 0 ? 0.2 : 0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Day-of-week chart ────────────────────────────────────────────────────────

export function DowChart({ data }: { data: DashboardStats['dowData'] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={TICK} tickLine={false} axisLine={false} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
          formatter={(v) => [v, 'Weergaven']}
          cursor={{ fill: 'rgba(16,185,129,0.08)' }}
          isAnimationActive={false}
        />
        <Bar dataKey="count" name="Weergaven" radius={[3, 3, 0, 0]} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.count === maxCount ? '#34d399' : '#10b981'}
              opacity={entry.count === 0 ? 0.2 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Conversion funnel ────────────────────────────────────────────────────────

export function FunnelViz({ funnel }: { funnel: DashboardStats['funnel'] }) {
  const steps = [
    { label: 'Bezoekers', value: funnel.visitors, color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    { label: 'Zoekopdrachten', value: funnel.searches, color: '#8b5cf6', bg: 'bg-violet-500/10', text: 'text-violet-400' },
    { label: 'Registrar klikken', value: funnel.clicks, color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  ];
  const max = steps[0].value || 1;

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const pct = Math.round((step.value / max) * 100);
        const convPct =
          i > 0 && steps[i - 1].value > 0
            ? Math.round((step.value / steps[i - 1].value) * 100)
            : null;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${step.bg} ${step.text}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{step.label}</span>
                {convPct !== null && (
                  <span className="text-xs text-slate-600 ml-1">→ {convPct}%</span>
                )}
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {step.value.toLocaleString('nl-NL')}
              </span>
            </div>
            <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: step.color,
                  boxShadow: `0 0 8px ${step.color}60`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
