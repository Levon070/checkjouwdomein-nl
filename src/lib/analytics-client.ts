export function trackClientEvent(name: string, value: string): void {
  if (typeof navigator === 'undefined') return;
  try {
    const body = JSON.stringify({ name, value });
    navigator.sendBeacon('/api/analytics/event', new Blob([body], { type: 'application/json' }));
  } catch {
    // fire-and-forget, silently ignore errors
  }
}

/**
 * Track domain extension from a search query (e.g. ".nl", ".com")
 * Call this when a domain search is performed.
 */
export function trackExtension(query: string): void {
  const match = query.match(/\.([a-z]{2,10})$/i);
  if (match) {
    trackClientEvent('ext', '.' + match[1].toLowerCase());
  } else {
    // No extension in query — track as generic
    trackClientEvent('ext', 'geen extensie');
  }
}

/**
 * Initialize scroll depth tracking. Fires once at each 25% milestone.
 * Call once on page load (client-side).
 */
export function initScrollTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        trackClientEvent('scroll', String(m));
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

/**
 * Track session duration on page unload. Call once per page.
 */
export function initSessionDuration(): void {
  if (typeof window === 'undefined') return;
  const start = Date.now();

  const flush = () => {
    const seconds = Math.round((Date.now() - start) / 1000);
    if (seconds < 2) return; // ignore bounces
    // Bucket into readable ranges
    let bucket: string;
    if (seconds < 10) bucket = '<10s';
    else if (seconds < 30) bucket = '10-30s';
    else if (seconds < 60) bucket = '30-60s';
    else if (seconds < 180) bucket = '1-3m';
    else if (seconds < 600) bucket = '3-10m';
    else bucket = '10m+';
    trackClientEvent('duration', bucket);
  };

  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}
