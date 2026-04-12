export type TldKey = '.nl' | '.com' | '.net' | '.be' | '.org' | '.io' | '.shop' | '.online';

export interface DomainSuggestion {
  name: string;
  tld: TldKey;
  full: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  status: DomainStatus;
}

export type DomainStatus = 'available' | 'taken' | 'checking' | 'error';

export interface ScoreBreakdown {
  lengthScore: number;
  tldScore: number;
  keywordScore: number;
  hyphenPenalty: number;
  numberPenalty: number;
}

export interface Registrar {
  id: string;
  name: string;
  logoPath: string;
  baseUrl: string;
  affiliateUrl: (domain: string) => string;
  supportedTlds: TldKey[];
  priceIndicator: 'laag' | 'gemiddeld' | 'hoog';
  rating: number;
  highlight: string;
}

export interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: Array<{ eventAction: string; eventDate: string }>;
  links?: Array<{ rel: string; href: string }>;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  content: string;
}
