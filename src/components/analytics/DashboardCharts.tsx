'use client';

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { DashboardStats } from '@/lib/analytics';

const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '12px',
};
const TICK = { fill: '#64748b', fontSize: 11 };
const GRID = '#1e293b';

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
    bezoekers: d.visitors,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        <Area
          type="monotone"
          dataKey="prev"
          name="Vorige periode"
          stroke="#64748b"
          fill="url(#gPrev)"
          strokeDasharray="4 2"
          strokeWidth={1.5}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="views"
          name="Paginaweergaven"
          stroke="#3b82f6"
          fill="url(#gViews)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Hourly distribution chart ────────────────────────────────────────────────

export function HourlyChart({ data }: { data: DashboardStats['hourlyData'] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey="hour"
          tick={TICK}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis tick={TICK} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, 'Weergaven']} />
        <Bar dataKey="count" name="Weergaven" fill="#6366f1" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Conversion funnel ────────────────────────────────────────────────────────

export function FunnelViz({ funnel }: { funnel: DashboardStats['funnel'] }) {
  const steps = [
    { label: 'Bezoekers', value: funnel.visitors, color: '#3b82f6' },
    { label: 'Zoekopdrachten', value: funnel.searches, color: '#8b5cf6' },
    { label: 'Registrar klikken', value: funnel.clicks, color: '#10b981' },
  ];
  const max = steps[0].value || 1;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const pct = Math.round((step.value / max) * 100);
        const convPct =
          i > 0 && steps[i - 1].value > 0
            ? Math.round((step.value / steps[i - 1].value) * 100)
            : null;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs w-4">{i + 1}</span>
                <span className="text-sm text-white">{step.label}</span>
                {convPct !== null && (
                  <span className="text-xs text-slate-500">→ {convPct}%</span>
                )}
              </div>
              <span className="text-sm font-semibold text-white">
                {step.value.toLocaleString('nl-NL')}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: step.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
