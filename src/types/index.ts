export type TldKey = '.nl' | '.com' | '.net' | '.be' | '.org' | '.io' | '.shop' | '.online';

export interface WaybackInfo {
  snapshots: number;
  firstYear: number;
  oldestUrl: string;
}

export interface ValuationResult {
  low: number;
  high: number;
  factors: Array<{ label: string; impact: number }>;
}

export interface DomainSuggestion {
  name: string;
  tld: TldKey;
  full: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  status: DomainStatus;
  pronunciationScore?: number;
  wasDropped?: boolean;
  socialHandleAvailable?: boolean | null;
  expiresAt?: string;    // ISO date from RDAP — only set for taken domains
  hasMx?: boolean;       // has MX records — proxy for "actively used"
  wayback?: WaybackInfo; // Wayback Machine archive data — only for dropped domains
}

export type DomainStatus = 'available' | 'taken' | 'checking' | 'error';

export interface ScoreBreakdown {
  lengthScore: number;
  tldScore: number;
  keywordScore: number;
  hyphenPenalty: number;
  numberPenalty: number;
  pronunciationScore?: number;
}

export type FeatureValue = true | false | 'paid' | string;

export interface RegistrarFeature {
  key: string;
  label: string;
  tooltip?: string;
  value: FeatureValue;
}

export interface RegistrarPricing {
  firstYear: string;        // eerste jaar (incl. promo)
  renewal: string;          // verlengingsprijs
  firstYearRaw?: number;    // numeriek voor sortering
  renewalRaw?: number;
}

export interface Registrar {
  id: string;
  name: string;
  logoPath: string;
  baseUrl: string;
  affiliateUrl: (domain: string) => string;
  supportedTlds: TldKey[];
  priceIndicator: 'laag' | 'gemiddeld' | 'hoog';
  prices: Partial<Record<TldKey, string>>;
  /** Gedetailleerde prijzen per TLD: eerste jaar + verlenging */
  detailedPrices: Partial<Record<TldKey, RegistrarPricing>>;
  rating: number;
  reviewCount?: number;
  highlight: string;
  /** Taal van het controlepaneel */
  panelLanguage: 'nl' | 'en' | 'nl/en';
  /** Kenmerken van de registrar */
  features: RegistrarFeature[];
}

export interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: Array<{ eventAction: string; eventDate: string }>;
  links?: Array<{ rel: string; href: string }>;
}

export interface CartItem {
  full: string;
  name: string;
  tld: TldKey;
  score: number;
  addedAt: string;
}

export interface EuipoResult {
  hasMatch: boolean;
  matches: Array<{ trademark: string; status: string; owner: string }>;
  detailUrl: string;
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
