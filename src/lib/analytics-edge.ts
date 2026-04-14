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
  city: string;
  device: string;
  browser: string;
  os: string;
  hashedIp: string;
  isReturning: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Promise<void> {
  const d = todayKey();
  const hour = new Date().getUTCHours().toString().padStart(2, '0');
  const dayOfWeek = new Date().getUTCDay().toString(); // 0=Sun … 6=Sat
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  const cmds: (string | number)[][] = [
    // Core
    ['INCR', `pv:${d}`],
    ['EXPIRE', `pv:${d}`, TTL],
    ['PFADD', `uv:${d}`, data.hashedIp],
    ['EXPIRE', `uv:${d}`, TTL],
    ['ZINCRBY', `pages:${d}`, 1, data.path || '/'],
    ['EXPIRE', `pages:${d}`, TTL],
    // Time buckets
    ['ZINCRBY', `hours:${d}`, 1, hour],
    ['EXPIRE', `hours:${d}`, TTL],
    ['ZINCRBY', `dow:${d}`, 1, dayOfWeek],
    ['EXPIRE', `dow:${d}`, TTL],
    // Live visitors
    ['ZREMRANGEBYSCORE', 'live_visitors', 0, fiveMinAgo],
    ['ZADD', 'live_visitors', Date.now(), data.hashedIp],
    ['EXPIRE', 'live_visitors', 3600],
    // New vs returning
    ['ZINCRBY', `visitor_type:${d}`, 1, data.isReturning ? 'returning' : 'new'],
    ['EXPIRE', `visitor_type:${d}`, TTL],
  ];

  // Landing page tracking (no internal referrer = entry point)
  if (!data.referrer) {
    cmds.push(['ZINCRBY', `landing:${d}`, 1, data.path || '/']);
    cmds.push(['EXPIRE', `landing:${d}`, TTL]);
  }

  if (data.referrer) {
    cmds.push(['ZINCRBY', `ref:${d}`, 1, data.referrer]);
    cmds.push(['EXPIRE', `ref:${d}`, TTL]);
  }
  if (data.country) {
    cmds.push(['ZINCRBY', `country:${d}`, 1, data.country]);
    cmds.push(['EXPIRE', `country:${d}`, TTL]);
  }
  if (data.city) {
    cmds.push(['ZINCRBY', `city:${d}`, 1, data.city]);
    cmds.push(['EXPIRE', `city:${d}`, TTL]);
  }
  if (data.device) {
    cmds.push(['ZINCRBY', `device:${d}`, 1, data.device]);
    cmds.push(['EXPIRE', `device:${d}`, TTL]);
  }
  if (data.browser) {
    cmds.push(['ZINCRBY', `browser:${d}`, 1, data.browser]);
    cmds.push(['EXPIRE', `browser:${d}`, TTL]);
  }
  if (data.os) {
    cmds.push(['ZINCRBY', `os:${d}`, 1, data.os]);
    cmds.push(['EXPIRE', `os:${d}`, TTL]);
  }

  // UTM parameters
  if (data.utmSource) {
    cmds.push(['ZINCRBY', `utm_source:${d}`, 1, data.utmSource]);
    cmds.push(['EXPIRE', `utm_source:${d}`, TTL]);
  }
  if (data.utmMedium) {
    cmds.push(['ZINCRBY', `utm_medium:${d}`, 1, data.utmMedium]);
    cmds.push(['EXPIRE', `utm_medium:${d}`, TTL]);
  }
  if (data.utmCampaign) {
    cmds.push(['ZINCRBY', `utm_campaign:${d}`, 1, data.utmCampaign]);
    cmds.push(['EXPIRE', `utm_campaign:${d}`, TTL]);
  }

  await upstashPipeline(cmds);
}
