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

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (process.env.ANALYTICS_SECRET ?? 'cjd-salt'));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export async function trackPageView(data: {
  path: string;
  referrer: string;
  country: string;
  device: string;
  browser: string;
  hashedIp: string;
}): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const d = toDateStr(new Date());
  const TTL = 90 * 24 * 3600;
  const cmds: Promise<unknown>[] = [
    redis.incr(`pv:${d}`).then(() => redis.expire(`pv:${d}`, TTL)),
    redis.pfadd(`uv:${d}`, data.hashedIp).then(() => redis.expire(`uv:${d}`, TTL)),
    redis.zincrby(`pages:${d}`, 1, data.path || '/').then(() => redis.expire(`pages:${d}`, TTL)),
  ];
  if (data.referrer)
    cmds.push(redis.zincrby(`ref:${d}`, 1, data.referrer).then(() => redis.expire(`ref:${d}`, TTL)));
  if (data.country)
    cmds.push(redis.zincrby(`country:${d}`, 1, data.country).then(() => redis.expire(`country:${d}`, TTL)));
  if (data.device)
    cmds.push(redis.zincrby(`device:${d}`, 1, data.device).then(() => redis.expire(`device:${d}`, TTL)));
  if (data.browser)
    cmds.push(redis.zincrby(`browser:${d}`, 1, data.browser).then(() => redis.expire(`browser:${d}`, TTL)));
  await Promise.all(cmds);
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
  topSearches: ZEntry[];
  topClicks: ZEntry[];
  topReferrers: ZEntry[];
  devices: ZEntry[];
  browsers: ZEntry[];
  countries: ZEntry[];
  cities: ZEntry[];
  comparison: {
    prevPageviews: number;
    prevVisitors: number;
    pageviewsChange: number | null;
    visitorsChange: number | null;
  };
  hourlyData: Array<{ hour: string; count: number }>;
  funnel: { visitors: number; searches: number; clicks: number };
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
    topSearches: [],
    topClicks: [],
    topReferrers: [],
    devices: [],
    browsers: [],
    countries: [],
    cities: [],
    comparison: { prevPageviews: 0, prevVisitors: 0, pageviewsChange: null, visitorsChange: null },
    hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i.toString().padStart(2, '0'), count: 0 })),
    funnel: { visitors: 0, searches: 0, clicks: 0 },
  };

  if (!redis) return empty;

  const [
    pvArr, uvArr,
    prevPvArr, prevUvArr,
    topPages, topSearches, topClicks, topReferrers,
    devices, browsers, countries, cities,
    hourEntries,
    searchTotal, clickTotal,
  ] = await Promise.all([
    Promise.all(dates.map((d) => redis.get<number>(`pv:${d}`))),
    Promise.all(dates.map((d) => redis.pfcount(`uv:${d}`))),
    Promise.all(prevDates.map((d) => redis.get<number>(`pv:${d}`))),
    Promise.all(prevDates.map((d) => redis.pfcount(`uv:${d}`))),
    mergeTopN(redis, dates.map((d) => `pages:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `search:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `clicks:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `ref:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `device:${d}`), 5),
    mergeTopN(redis, dates.map((d) => `browser:${d}`), 5),
    mergeTopN(redis, dates.map((d) => `country:${d}`), 10),
    mergeTopN(redis, dates.map((d) => `city:${d}`), 20),
    mergeTopN(redis, dates.map((d) => `hours:${d}`), 24),
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

  return {
    totalPageviews,
    uniqueVisitors,
    dailyData: dates.map((date, i) => ({ date, views: pvArr[i] ?? 0, visitors: uvArr[i] ?? 0 })),
    previousDailyData: prevDates.map((date, i) => ({ date, views: prevPvArr[i] ?? 0, visitors: prevUvArr[i] ?? 0 })),
    topPages,
    topSearches,
    topClicks,
    topReferrers,
    devices,
    browsers,
    countries,
    cities,
    comparison: {
      prevPageviews,
      prevVisitors,
      pageviewsChange: prevPageviews > 0 ? Math.round(((totalPageviews - prevPageviews) / prevPageviews) * 100) : null,
      visitorsChange: prevVisitors > 0 ? Math.round(((uniqueVisitors - prevVisitors) / prevVisitors) * 100) : null,
    },
    hourlyData,
    funnel: { visitors: uniqueVisitors, searches: searchTotal, clicks: clickTotal },
  };
}
