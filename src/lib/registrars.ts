import { Registrar, RegistrarFeature, TldKey } from '@/types';

// ─── AFFILIATE LINK BUILDERS ─────────────────────────────────────────────────
// Vervang de placeholder IDs met jouw eigen affiliate-IDs.

const buildTransipUrl = (domain: string) =>
  `https://www.transip.nl/domein-registreren/?domain=${domain}`;

const buildMijndomeinUrl = (domain: string) =>
  `https://www.mijndomein.nl/domeinnamen?search=${domain}`;

const buildAntagonistUrl = (domain: string) =>
  `https://www.antagonist.nl/domeinen.php?domain=${domain}`;

const buildNamecheapUrl = (domain: string) =>
  `https://www.namecheap.com/domains/registration/results/?domain=${domain}`;

const buildGodaddyUrl = (domain: string) =>
  `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domain}`;

const buildHostnetUrl = (domain: string) =>
  `https://www.hostnet.nl/domeinnaam/?domain=${domain}`;

// ─── FEATURE TEMPLATES ───────────────────────────────────────────────────────

function features(config: {
  whoisPrivacy: true | false | 'paid';
  freeSsl: boolean;
  emailForwarding: boolean;
  dnsManagement: boolean;
  autoRenew: boolean;
  transferLock: boolean;
  twoFactor: boolean;
  support: string;
  apiAccess: boolean;
  controlPanel: string;
}): RegistrarFeature[] {
  return [
    {
      key: 'whoisPrivacy',
      label: 'WHOIS-privacy',
      tooltip: 'Verbergt je persoonlijke gegevens in het WHOIS-register',
      value: config.whoisPrivacy,
    },
    {
      key: 'freeSsl',
      label: 'Gratis SSL',
      tooltip: "Let's Encrypt SSL inbegrepen",
      value: config.freeSsl,
    },
    {
      key: 'emailForwarding',
      label: 'E-mail doorsturen',
      tooltip: 'Stel emailadressen in die doorsturen naar je inbox',
      value: config.emailForwarding,
    },
    {
      key: 'dnsManagement',
      label: 'DNS-beheer',
      tooltip: 'Volledige DNS-controle via controlepaneel',
      value: config.dnsManagement,
    },
    {
      key: 'autoRenew',
      label: 'Automatisch verlengen',
      value: config.autoRenew,
    },
    {
      key: 'transferLock',
      label: 'Transferslot',
      tooltip: 'Domein beveiligd tegen ongewenste overdracht',
      value: config.transferLock,
    },
    {
      key: 'twoFactor',
      label: '2FA-beveiliging',
      tooltip: 'Twee-factor authenticatie voor je account',
      value: config.twoFactor,
    },
    {
      key: 'support',
      label: 'Support',
      value: config.support,
    },
    {
      key: 'apiAccess',
      label: 'API-toegang',
      tooltip: 'Beheer domeinen via een REST/EPP API',
      value: config.apiAccess,
    },
    {
      key: 'controlPanel',
      label: 'Controlepaneel',
      value: config.controlPanel,
    },
  ];
}

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
    prices: {
      '.nl': '±€4/jr',
      '.com': '±€9/jr',
      '.net': '±€11/jr',
      '.be': '±€6/jr',
      '.org': '±€12/jr',
      '.io': '±€30/jr',
      '.shop': '±€20/jr',
      '.online': '±€15/jr',
    },
    detailedPrices: {
      '.nl':     { firstYear: '€3,99',  renewal: '€3,99',  firstYearRaw: 3.99,  renewalRaw: 3.99  },
      '.com':    { firstYear: '€8,99',  renewal: '€8,99',  firstYearRaw: 8.99,  renewalRaw: 8.99  },
      '.net':    { firstYear: '€10,99', renewal: '€10,99', firstYearRaw: 10.99, renewalRaw: 10.99 },
      '.be':     { firstYear: '€5,99',  renewal: '€5,99',  firstYearRaw: 5.99,  renewalRaw: 5.99  },
      '.org':    { firstYear: '€11,99', renewal: '€11,99', firstYearRaw: 11.99, renewalRaw: 11.99 },
      '.io':     { firstYear: '€29,99', renewal: '€29,99', firstYearRaw: 29.99, renewalRaw: 29.99 },
      '.shop':   { firstYear: '€19,99', renewal: '€19,99', firstYearRaw: 19.99, renewalRaw: 19.99 },
      '.online': { firstYear: '€14,99', renewal: '€14,99', firstYearRaw: 14.99, renewalRaw: 14.99 },
    },
    rating: 4.8,
    reviewCount: 12400,
    highlight: 'Meest populair in NL',
    panelLanguage: 'nl',
    features: features({
      whoisPrivacy: true,
      freeSsl: true,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: true,
      support: 'Chat & e-mail (NL)',
      apiAccess: true,
      controlPanel: 'Eigen dashboard (NL)',
    }),
  },
  {
    id: 'mijndomein',
    name: 'Mijndomein.nl',
    logoPath: '/registrars/mijndomein.svg',
    baseUrl: 'https://www.mijndomein.nl',
    affiliateUrl: buildMijndomeinUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.shop', '.online'],
    priceIndicator: 'laag',
    prices: {
      '.nl': '±€3/jr',
      '.com': '±€10/jr',
      '.net': '±€12/jr',
      '.be': '±€6/jr',
      '.org': '±€12/jr',
      '.shop': '±€20/jr',
      '.online': '±€15/jr',
    },
    detailedPrices: {
      '.nl':     { firstYear: '€2,99',  renewal: '€3,49',  firstYearRaw: 2.99,  renewalRaw: 3.49  },
      '.com':    { firstYear: '€9,99',  renewal: '€10,99', firstYearRaw: 9.99,  renewalRaw: 10.99 },
      '.net':    { firstYear: '€11,99', renewal: '€12,49', firstYearRaw: 11.99, renewalRaw: 12.49 },
      '.be':     { firstYear: '€5,49',  renewal: '€6,49',  firstYearRaw: 5.49,  renewalRaw: 6.49  },
      '.org':    { firstYear: '€11,49', renewal: '€12,49', firstYearRaw: 11.49, renewalRaw: 12.49 },
      '.shop':   { firstYear: '€18,99', renewal: '€21,99', firstYearRaw: 18.99, renewalRaw: 21.99 },
      '.online': { firstYear: '€13,99', renewal: '€15,99', firstYearRaw: 13.99, renewalRaw: 15.99 },
    },
    rating: 4.3,
    reviewCount: 5800,
    highlight: 'Laagste prijs .nl',
    panelLanguage: 'nl',
    features: features({
      whoisPrivacy: false,
      freeSsl: true,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: false,
      support: 'E-mail & forum (NL)',
      apiAccess: false,
      controlPanel: 'Eigen dashboard (NL)',
    }),
  },
  {
    id: 'antagonist',
    name: 'Antagonist',
    logoPath: '/registrars/antagonist.svg',
    baseUrl: 'https://www.antagonist.nl',
    affiliateUrl: buildAntagonistUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.io'],
    priceIndicator: 'gemiddeld',
    prices: {
      '.nl': '±€4/jr',
      '.com': '±€10/jr',
      '.net': '±€11/jr',
      '.be': '±€6/jr',
      '.org': '±€12/jr',
      '.io': '±€35/jr',
    },
    detailedPrices: {
      '.nl':  { firstYear: '€4,00',  renewal: '€4,00',  firstYearRaw: 4.00,  renewalRaw: 4.00  },
      '.com': { firstYear: '€9,50',  renewal: '€10,00', firstYearRaw: 9.50,  renewalRaw: 10.00 },
      '.net': { firstYear: '€10,50', renewal: '€11,00', firstYearRaw: 10.50, renewalRaw: 11.00 },
      '.be':  { firstYear: '€6,00',  renewal: '€6,00',  firstYearRaw: 6.00,  renewalRaw: 6.00  },
      '.org': { firstYear: '€11,50', renewal: '€12,00', firstYearRaw: 11.50, renewalRaw: 12.00 },
      '.io':  { firstYear: '€34,00', renewal: '€35,00', firstYearRaw: 34.00, renewalRaw: 35.00 },
    },
    rating: 4.6,
    reviewCount: 3200,
    highlight: 'Beste klantenservice NL',
    panelLanguage: 'nl',
    features: features({
      whoisPrivacy: true,
      freeSsl: true,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: true,
      support: 'Telefoon, chat & e-mail (NL)',
      apiAccess: true,
      controlPanel: 'DirectAdmin (NL)',
    }),
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    logoPath: '/registrars/namecheap.svg',
    baseUrl: 'https://www.namecheap.com',
    affiliateUrl: buildNamecheapUrl,
    supportedTlds: ['.com', '.net', '.org', '.io', '.shop', '.online'],
    priceIndicator: 'laag',
    prices: {
      '.com': '±€8/jr',
      '.net': '±€10/jr',
      '.org': '±€9/jr',
      '.io': '±€25/jr',
      '.shop': '±€15/jr',
      '.online': '±€11/jr',
    },
    detailedPrices: {
      '.com':    { firstYear: '€7,99',  renewal: '€12,99', firstYearRaw: 7.99,  renewalRaw: 12.99 },
      '.net':    { firstYear: '€9,99',  renewal: '€12,99', firstYearRaw: 9.99,  renewalRaw: 12.99 },
      '.org':    { firstYear: '€8,99',  renewal: '€11,99', firstYearRaw: 8.99,  renewalRaw: 11.99 },
      '.io':     { firstYear: '€24,99', renewal: '€29,99', firstYearRaw: 24.99, renewalRaw: 29.99 },
      '.shop':   { firstYear: '€14,99', renewal: '€19,99', firstYearRaw: 14.99, renewalRaw: 19.99 },
      '.online': { firstYear: '€10,99', renewal: '€14,99', firstYearRaw: 10.99, renewalRaw: 14.99 },
    },
    rating: 4.5,
    reviewCount: 42000,
    highlight: 'Goedkoopste .com wereldwijd',
    panelLanguage: 'en',
    features: features({
      whoisPrivacy: true,
      freeSsl: true,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: true,
      support: 'Live chat & e-mail (EN)',
      apiAccess: true,
      controlPanel: 'Eigen dashboard (EN)',
    }),
  },
  {
    id: 'godaddy',
    name: 'GoDaddy',
    logoPath: '/registrars/godaddy.svg',
    baseUrl: 'https://www.godaddy.com',
    affiliateUrl: buildGodaddyUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org', '.io', '.shop', '.online'],
    priceIndicator: 'gemiddeld',
    prices: {
      '.nl': '±€10/jr',
      '.com': '±€12/jr',
      '.net': '±€14/jr',
      '.be': '±€9/jr',
      '.org': '±€14/jr',
      '.io': '±€40/jr',
      '.shop': '±€25/jr',
      '.online': '±€20/jr',
    },
    detailedPrices: {
      '.nl':     { firstYear: '€1,99',  renewal: '€9,99',  firstYearRaw: 1.99,  renewalRaw: 9.99  },
      '.com':    { firstYear: '€1,99',  renewal: '€12,99', firstYearRaw: 1.99,  renewalRaw: 12.99 },
      '.net':    { firstYear: '€3,99',  renewal: '€13,99', firstYearRaw: 3.99,  renewalRaw: 13.99 },
      '.be':     { firstYear: '€2,99',  renewal: '€8,99',  firstYearRaw: 2.99,  renewalRaw: 8.99  },
      '.org':    { firstYear: '€3,99',  renewal: '€13,99', firstYearRaw: 3.99,  renewalRaw: 13.99 },
      '.io':     { firstYear: '€9,99',  renewal: '€39,99', firstYearRaw: 9.99,  renewalRaw: 39.99 },
      '.shop':   { firstYear: '€4,99',  renewal: '€24,99', firstYearRaw: 4.99,  renewalRaw: 24.99 },
      '.online': { firstYear: '€2,99',  renewal: '€19,99', firstYearRaw: 2.99,  renewalRaw: 19.99 },
    },
    rating: 4.0,
    reviewCount: 89000,
    highlight: 'Laagste introprijs — let op verlenging!',
    panelLanguage: 'nl/en',
    features: features({
      whoisPrivacy: 'paid',
      freeSsl: false,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: true,
      support: 'Telefoon, chat & e-mail (NL/EN)',
      apiAccess: false,
      controlPanel: 'Eigen dashboard (NL)',
    }),
  },
  {
    id: 'hostnet',
    name: 'Hostnet',
    logoPath: '/registrars/hostnet.svg',
    baseUrl: 'https://www.hostnet.nl',
    affiliateUrl: buildHostnetUrl,
    supportedTlds: ['.nl', '.com', '.net', '.be', '.org'],
    priceIndicator: 'hoog',
    prices: {
      '.nl': '±€7/jr',
      '.com': '±€15/jr',
      '.net': '±€15/jr',
      '.be': '±€10/jr',
      '.org': '±€15/jr',
    },
    detailedPrices: {
      '.nl':  { firstYear: '€6,95',  renewal: '€6,95',  firstYearRaw: 6.95,  renewalRaw: 6.95  },
      '.com': { firstYear: '€14,95', renewal: '€14,95', firstYearRaw: 14.95, renewalRaw: 14.95 },
      '.net': { firstYear: '€14,95', renewal: '€14,95', firstYearRaw: 14.95, renewalRaw: 14.95 },
      '.be':  { firstYear: '€9,95',  renewal: '€9,95',  firstYearRaw: 9.95,  renewalRaw: 9.95  },
      '.org': { firstYear: '€14,95', renewal: '€14,95', firstYearRaw: 14.95, renewalRaw: 14.95 },
    },
    rating: 4.4,
    reviewCount: 7100,
    highlight: 'Betrouwbaar Nederlands bedrijf',
    panelLanguage: 'nl',
    features: features({
      whoisPrivacy: true,
      freeSsl: true,
      emailForwarding: true,
      dnsManagement: true,
      autoRenew: true,
      transferLock: true,
      twoFactor: false,
      support: 'Telefoon & e-mail (NL)',
      apiAccess: false,
      controlPanel: 'DirectAdmin (NL)',
    }),
  },
];

export function getRegistrarsForTld(tld: TldKey): Registrar[] {
  return REGISTRARS.filter((r) => r.supportedTlds.includes(tld));
}
