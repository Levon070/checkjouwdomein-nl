import { TldKey } from '@/types';

export interface TldConfig {
  tld: TldKey;
  rdapEndpoint: string;
  label: string;
  description: string;
  averagePrice: string;
  scoreWeight: number;
  flag?: string;
}

export const TLD_CONFIG: Record<TldKey, TldConfig> = {
  '.nl': {
    tld: '.nl',
    rdapEndpoint: 'https://rdap.sidn.nl/domain/',
    label: 'Nederland',
    description: 'De Nederlandse extensie. Meest vertrouwd door Nederlandse bezoekers.',
    averagePrice: '€ 6–10/jaar',
    scoreWeight: 35,
    flag: '🇳🇱',
  },
  '.com': {
    tld: '.com',
    rdapEndpoint: 'https://rdap.verisign.com/com/v1/domain/',
    label: 'Internationaal',
    description: 'De meest bekende extensie wereldwijd.',
    averagePrice: '€ 10–15/jaar',
    scoreWeight: 30,
    flag: '🌍',
  },
  '.net': {
    tld: '.net',
    rdapEndpoint: 'https://rdap.verisign.com/net/v1/domain/',
    label: 'Netwerk',
    description: 'Goed alternatief voor .com, populair voor technische projecten.',
    averagePrice: '€ 10–14/jaar',
    scoreWeight: 15,
  },
  '.be': {
    tld: '.be',
    rdapEndpoint: 'https://rdap.dns.be/domain/',
    label: 'België',
    description: 'Voor Belgische bedrijven en websites.',
    averagePrice: '€ 8–12/jaar',
    scoreWeight: 20,
    flag: '🇧🇪',
  },
  '.org': {
    tld: '.org',
    rdapEndpoint: 'https://rdap.publicinterestregistry.org/rdap/domain/',
    label: 'Organisatie',
    description: 'Veelgebruikt door non-profits en organisaties.',
    averagePrice: '€ 10–14/jaar',
    scoreWeight: 10,
  },
  '.io': {
    tld: '.io',
    rdapEndpoint: 'https://rdap.nic.io/domain/',
    label: 'Tech / Startup',
    description: 'Populair bij tech-startups en apps.',
    averagePrice: '€ 35–50/jaar',
    scoreWeight: 12,
  },
  '.shop': {
    tld: '.shop',
    rdapEndpoint: 'https://rdap.nic.shop/domain/',
    label: 'Webshop',
    description: 'Ideaal voor webshops en e-commerce.',
    averagePrice: '€ 20–30/jaar',
    scoreWeight: 8,
  },
  '.online': {
    tld: '.online',
    rdapEndpoint: 'https://rdap.nic.online/domain/',
    label: 'Online',
    description: 'Modern en beschrijvend voor online diensten.',
    averagePrice: '€ 20–35/jaar',
    scoreWeight: 5,
  },
};

export const ORDERED_TLDS: TldKey[] = ['.nl', '.com', '.be', '.net', '.org', '.io', '.shop', '.online'];
