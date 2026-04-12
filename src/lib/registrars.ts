import { Registrar, TldKey } from '@/types';

// ─── AFFILIATE LINK BUILDERS ─────────────────────────────────────────────────
// Vervang de placeholder IDs met jouw eigen affiliate-IDs.
// Alle affiliate-links staan op één plek — dit is het enige bestand dat je hoeft te updaten.

const buildTransipUrl = (domain: string) =>
  `https://www.transip.nl/domein-registreren/?domain=${domain}`;
  // Met affiliate: `https://www.transip.nl/domein-registreren/?domain=${domain}&partner=JOUW_ID`

const buildMijndomeinUrl = (domain: string) =>
  `https://www.mijndomein.nl/domeinnamen?search=${domain}`;
  // Met affiliate: voeg `&ref=JOUW_REF` toe

const buildAntagonistUrl = (domain: string) =>
  `https://www.antagonist.nl/domeinen.php?domain=${domain}`;
  // Met affiliate: voeg `&a_aid=JOUW_ID` toe

const buildNamecheapUrl = (domain: string) =>
  `https://www.namecheap.com/domains/registration/results/?domain=${domain}`;
  // Met affiliate: voeg `&aff=JOUW_ID` toe

const buildGodaddyUrl = (domain: string) =>
  `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domain}`;
  // Met affiliate: voeg GoDaddy referral params toe

const buildHostnetUrl = (domain: string) =>
  `https://www.hostnet.nl/domeinnaam/?domain=${domain}`;
  // Met affiliate: voeg `&partner=JOUW_ID` toe

// ─── REGISTRAR DEFINITIES ────────────────────────────────────────────────────

export const REGISTRARS: Registrar[] = [
  {
    id: 'transip',
    name: 'TransIP',
    logoPath: '/registrars/transip.svg',
    baseUrl: 'https://www.transip.nl',
    affiliateUrl: buildTransipUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.io', '.shop', '.online'],
    priceIndicator: 'gemiddeld',
    rating: 4.8,
    highlight: 'Meest populair in NL',
  },
  {
    id: 'mijndomein',
    name: 'Mijndomein.nl',
    logoPath: '/registrars/mijndomein.svg',
    baseUrl: 'https://www.mijndomein.nl',
    affiliateUrl: buildMijndomeinUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.shop', '.online'],
    priceIndicator: 'laag',
    rating: 4.3,
    highlight: 'Laagste prijs .nl',
  },
  {
    id: 'antagonist',
    name: 'Antagonist',
    logoPath: '/registrars/antagonist.svg',
    baseUrl: 'https://www.antagonist.nl',
    affiliateUrl: buildAntagonistUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.io'],
    priceIndicator: 'gemiddeld',
    rating: 4.6,
    highlight: 'Beste support',
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    logoPath: '/registrars/namecheap.svg',
    baseUrl: 'https://www.namecheap.com',
    affiliateUrl: buildNamecheapUrl,
    supportedTlds: ['.com', '.net', '.org', '.io', '.shop', '.online'],
    priceIndicator: 'laag',
    rating: 4.5,
    highlight: 'Goedkoop internationaal',
  },
  {
    id: 'godaddy',
    name: 'GoDaddy',
    logoPath: '/registrars/godaddy.svg',
    baseUrl: 'https://www.godaddy.com',
    affiliateUrl: buildGodaddyUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.io', '.shop', '.online'],
    priceIndicator: 'gemiddeld',
    rating: 4.0,
    highlight: 'Groot internationaal platform',
  },
  {
    id: 'hostnet',
    name: 'Hostnet',
    logoPath: '/registrars/hostnet.svg',
    baseUrl: 'https://www.hostnet.nl',
    affiliateUrl: buildHostnetUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org'],
    priceIndicator: 'hoog',
    rating: 4.4,
    highlight: 'Betrouwbaar Nederlands bedrijf',
  },
];

export function getRegistrarsForTld(tld: TldKey): Registrar[] {
  return REGISTRARS.filter((r) => r.supportedTlds.includes(tld));
}
