import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dateRange(days: number, offsetDays = 0): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i - offsetDays);
    out.push(toDateStr(d));
  }
  return out;
}

export async function trackEvent(name: string, value: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const d = toDateStr(new Date());
  const TTL = 90 * 24 * 3600;
  await redis.zincrby(`${name}:${d}`, 1, value || 'unknown');
  await redis.expire(`${name}:${d}`, TTL);
}

export interface ZEntry {
  member: string;
  score: number;
}

export interface DashboardStats {
  totalPageviews: number;
  uniqueVisitors: number;
  dailyData: Array<{ date: string; views: number; visitors: number }>;
  previousDailyData: Array<{ date: string; views: number; visitors: number }>;
  topPages: ZEntry[];
  topLandingPages: ZEntry[];
  topSearches: ZEntry[];
  topClicks: ZEntry[];
  topReferrers: ZEntry[];
  topExtensions: ZEntry[];
  devices: ZEntry[];
  browsers: ZEntry[];
  os: ZEntry[];
  countries: ZEntry[];
  cities: ZEntry[];
  visitorTypes: ZEntry[];
  utmSources: ZEntry[];
  utmMediums: ZEntry[];
  utmCampaigns: ZEntry[];
  dowData: Array<{ day: string; count: number }>;
  comparison: {
    prevPageviews: number;
    prevVisitors: number;
    pageviewsChange: number | null;
    visitorsChange: number | null;
  };
  hourlyData: Array<{ hour: string; count: number }>;
  funnel: { visitors: number; searches: number; clicks: number };
  conversionRate: number;
  scrollDepth: ZEntry[];
}

function parseZRange(raw: unknown[]): ZEntry[] {
  const result: ZEntry[] = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    result.push({ member: String(raw[i]), score: Number(raw[i + 1]) });
  }
  return result;
}

async function mergeTopN(redis: Redis, keys: string[], n: number): Promise<ZEntry[]> {
  const results = await Promise.all(
    keys.map((k) => redis.zrange(k, 0, n - 1, { rev: true, withScores: true }))
  );
  const map = new Map<string, number>();
  for (const raw of results) {
    for (const { member, score } of parseZRange(raw as unknown[])) {
      map.set(member, (map.get(member) ?? 0) + score);
    }
  }
  return Array.from(map.entries())
    .map(([member, score]) => ({ member, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

async function totalScoreSum(redis: Redis, keys: string[]): Promise<number> {
  const results = await Promise.all(
    keys.map((k) => redis.zrange(k, 0, -1, { withScores: true }))
  );
  let total = 0;
  for (const raw of results) {
    for (const { score } of parseZRange(raw as unknown[])) total += score;
  }
  return total;
}

export async function getLiveCount(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  await redis.zremrangebyscore('live_visitors', 0, fiveMinAgo);
  return redis.zcard('live_visitors');
}

const DOW_LABELS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

export async function getStats(days: number): Promise<DashboardStats> {
  const redis = getRedis();
  const dates = dateRange(days);
  const prevDates = dateRange(days, days);

  const empty: DashboardStats = {
    totalPageviews: 0,
    uniqueVisitors: 0,
    dailyData: dates.map((d) => ({ date: d, views: 0, visitors: 0 })),
    previousDailyData: prevDates.map((d) => ({ date: d, views: 0, visitors: 0 })),
    topPages: [],
    topLandingPages: [],
    topSearches: [],
    topClicks: [],
    topReferrers: [],
    topExtensions: [],
    devices: [],
    browsers: [],
    os: [],
    countries: [],
    cities: [],
    visitorTypes: [],
    utmSources: [],
    utmMediums: [],
    utmCampaigns: [],
    dowData: DOW_LABELS.map((day) => ({ day, count: 0 })),
    comparison: { prevPageviews: 0, prevVisitors: 0, pageviewsChange: null, visitorsChange: null },
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: i.toString().padStart(2, '0') + ':00',
      count: 0,
    })),
    funnel: { visitors: 0, searches: 0, clicks: 0 },
    conversionRate: 0,
    scrollDepth: [],
  };

  if (!redis) return empty;

  const [
    pvArr, uvArr,
    prevPvArr, prevUvArr,
    topPages, topLandingPages,
    topSearches, topClicks, topReferrers, topExtensions,
    devices, browsers, os, countries, cities,
    visitorTypes,
    utmSources, utmMediums, utmCampaigns,
    hourEntries, dowEntries,
    scrollDepth,
    searchTotal, clickTotal,
  ] = await Promise.all([
    Promise.all(dates.map((d) => redis.get<number>(`pv:${d}`))),
    Promise.all(dates.map((d) => redis.pfcount(`uv:${d}`))),
    Promise.all(prevDates.map((d) => redis.get<number>(`pv:${d}`))),
    Promise.all(prevDates.map((d) => redis.pfcount(`uv:${d}`))),
    mergeTopN(redis, dates.map((d) => `pages:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `landing:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `search:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `clicks:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `ref:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `ext:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `device:${d}`), 5),
    mergeTopN(redis, dates.map((d) => `browser:${d}`), 5),
    mergeTopN(redis, dates.map((d) => `os:${d}`), 6),
    mergeTopN(redis, dates.map((d) => `country:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `city:${d}`), 20),
    mergeTopN(redis, dates.map((d) => `visitor_type:${d}`), 2),
    mergeTopN(redis, dates.map((d) => `utm_source:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `utm_medium:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `utm_campaign:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `hours:${d}`), 24),
    mergeTopN(redis, dates.map((d) => `dow:${d}`), 7),
    mergeTopN(redis, dates.map((d) => `scroll:${d}`), 4),
    totalScoreSum(redis, dates.map((d) => `search:${d}`)),
    totalScoreSum(redis, dates.map((d) => `clicks:${d}`)),
  ]);

  const totalPageviews = pvArr.reduce((s: number, v) => s + (v ?? 0), 0);
  const uniqueVisitors = uvArr.reduce((s: number, v) => s + (v ?? 0), 0);
  const prevPageviews = prevPvArr.reduce((s: number, v) => s + (v ?? 0), 0);
  const prevVisitors = prevUvArr.reduce((s: number, v) => s + (v ?? 0), 0);

  // Build full 24-hour array
  const hourMap = new Map(hourEntries.map((e) => [e.member, e.score]));
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return { hour: `${h}:00`, count: hourMap.get(h) ?? 0 };
  });

  // Build day-of-week array
  const dowMap = new Map(dowEntries.map((e) => [e.member, e.score]));
  const dowData = DOW_LABELS.map((day, i) => ({
    day,
    count: dowMap.get(String(i)) ?? 0,
  }));

  const conversionRate =
    uniqueVisitors > 0 ? Math.round((searchTotal / uniqueVisitors) * 100) : 0;

  return {
    totalPageviews,
    uniqueVisitors,
    dailyData: dates.map((date, i) => ({ date, views: pvArr[i] ?? 0, visitors: uvArr[i] ?? 0 })),
    previousDailyData: prevDates.map((date, i) => ({
      date,
      views: prevPvArr[i] ?? 0,
      visitors: prevUvArr[i] ?? 0,
    })),
    topPages,
    topLandingPages,
    topSearches,
    topClicks,
    topReferrers,
    topExtensions,
    devices,
    browsers,
    os,
    countries,
    cities,
    visitorTypes,
    utmSources,
    utmMediums,
    utmCampaigns,
    dowData,
    comparison: {
      prevPageviews,
      prevVisitors,
      pageviewsChange:
        prevPageviews > 0
          ? Math.round(((totalPageviews - prevPageviews) / prevPageviews) * 100)
          : null,
      visitorsChange:
        prevVisitors > 0
          ? Math.round(((uniqueVisitors - prevVisitors) / prevVisitors) * 100)
          : null,
    },
    hourlyData,
    funnel: { visitors: uniqueVisitors, searches: searchTotal, clicks: clickTotal },
    conversionRate,
    scrollDepth,
  };
}
