// Edge-runtime-compatible analytics using Upstash REST API directly (no npm package)
async function upstashPipeline(commands: (string | number)[][]): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;

  await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const TTL = 90 * 24 * 3600;

export async function hashIpEdge(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (process.env.ANALYTICS_SECRET ?? 'cjd-salt'));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export async function trackPageViewEdge(data: {
  path: string;
  referrer: string;
  country: string;
  device: string;
  browser: string;
  hashedIp: string;
}): Promise<void> {
  const d = todayKey();

  const hour = new Date().getUTCHours().toString().padStart(2, '0');
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  const cmds: (string | number)[][] = [
    ['INCR', `pv:${d}`],
    ['EXPIRE', `pv:${d}`, TTL],
    ['PFADD', `uv:${d}`, data.hashedIp],
    ['EXPIRE', `uv:${d}`, TTL],
    ['ZINCRBY', `pages:${d}`, 1, data.path || '/'],
    ['EXPIRE', `pages:${d}`, TTL],
    // Hour-of-day tracking
    ['ZINCRBY', `hours:${d}`, 1, hour],
    ['EXPIRE', `hours:${d}`, TTL],
    // Live visitor tracking (sorted set: member=hashedIp, score=timestamp)
    ['ZREMRANGEBYSCORE', 'live_visitors', 0, fiveMinAgo],
    ['ZADD', 'live_visitors', Date.now(), data.hashedIp],
    ['EXPIRE', 'live_visitors', 3600],
  ];

  if (data.referrer) {
    cmds.push(['ZINCRBY', `ref:${d}`, 1, data.referrer]);
    cmds.push(['EXPIRE', `ref:${d}`, TTL]);
  }
  if (data.country) {
    cmds.push(['ZINCRBY', `country:${d}`, 1, data.country]);
    cmds.push(['EXPIRE', `country:${d}`, TTL]);
  }
  if (data.device) {
    cmds.push(['ZINCRBY', `device:${d}`, 1, data.device]);
    cmds.push(['EXPIRE', `device:${d}`, TTL]);
  }
  if (data.browser) {
    cmds.push(['ZINCRBY', `browser:${d}`, 1, data.browser]);
    cmds.push(['EXPIRE', `browser:${d}`, TTL]);
  }

  await upstashPipeline(cmds);
}
