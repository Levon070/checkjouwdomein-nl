export function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
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

  // OS
  let os = 'other';
  if (s.includes('windows')) os = 'Windows';
  else if (s.includes('iphone') || s.includes('ipad') || s.includes('ipod')) os = 'iOS';
  else if (s.includes('mac os x') || s.includes('macos')) os = 'macOS';
  else if (s.includes('android')) os = 'Android';
  else if (s.includes('linux')) os = 'Linux';
  else if (s.includes('cros')) os = 'ChromeOS';

  return { device, browser, os };
}
