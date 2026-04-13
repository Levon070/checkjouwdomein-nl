export function trackClientEvent(name: string, value: string): void {
  if (typeof navigator === 'undefined') return;
  try {
    const body = JSON.stringify({ name, value });
    navigator.sendBeacon('/api/analytics/event', new Blob([body], { type: 'application/json' }));
  } catch {
    // fire-and-forget, silently ignore errors
  }
}
