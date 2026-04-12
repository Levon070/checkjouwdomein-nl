import { TLD_CONFIG } from './tlds';
import { TldKey, RdapResponse, DomainStatus } from '@/types';

const RDAP_TIMEOUT_MS = 6000;

export interface RdapCheckResult {
  domain: string;
  tld: TldKey;
  status: DomainStatus;
  registeredAt?: string;
  expiresAt?: string;
}

export async function checkDomainAvailability(
  name: string,
  tld: TldKey
): Promise<RdapCheckResult> {
  const config = TLD_CONFIG[tld];
  if (!config) {
    return { domain: `${name}${tld}`, tld, status: 'error' };
  }

  const fullDomain = `${name}${tld}`;
  const url = `${config.rdapEndpoint}${encodeURIComponent(fullDomain)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RDAP_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/rdap+json' },
      cache: 'no-store',
    });

    clearTimeout(timer);

    // 404 = domain not found = AVAILABLE
    if (response.status === 404) {
      return { domain: fullDomain, tld, status: 'available' };
    }

    // 200 = domain exists = TAKEN
    if (response.status === 200) {
      const data: RdapResponse = await response.json();
      const registeredAt = data.events?.find((e) => e.eventAction === 'registration')?.eventDate;
      const expiresAt = data.events?.find((e) => e.eventAction === 'expiration')?.eventDate;
      return { domain: fullDomain, tld, status: 'taken', registeredAt, expiresAt };
    }

    // 429 = rate limited
    if (response.status === 429) {
      return { domain: fullDomain, tld, status: 'error' };
    }

    // Default: treat as taken (safe)
    return { domain: fullDomain, tld, status: 'taken' };
  } catch {
    return { domain: fullDomain, tld, status: 'error' };
  }
}
