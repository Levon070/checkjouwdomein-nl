export function parseUserAgent(ua: string): { device: string; browser: string } {
  const s = ua.toLowerCase();

  // Device
  let device = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'tablet';
  } else if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  }

  // Browser
  let browser = 'other';
  if (s.includes('edg/') || s.includes('edge/')) browser = 'Edge';
  else if (s.includes('opr/') || s.includes('opera')) browser = 'Opera';
  else if (s.includes('firefox/')) browser = 'Firefox';
  else if (s.includes('samsungbrowser')) browser = 'Samsung';
  else if (s.includes('chrome/')) browser = 'Chrome';
  else if (s.includes('safari/')) browser = 'Safari';

  return { device, browser };
}
