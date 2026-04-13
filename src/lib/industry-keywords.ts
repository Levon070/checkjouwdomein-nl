export interface IndustryKeywords {
  nl: string[];
  en: string[];
}

export const INDUSTRY_KEYWORDS: Record<string, IndustryKeywords> = {
  bakkerij:      { nl: ['brood', 'banket', 'patisserie', 'koek', 'gebak', 'ambacht'],          en: ['bakery', 'pastry', 'bread'] },
  restaurant:    { nl: ['eten', 'bistro', 'keuken', 'brasserie', 'horeca', 'diner', 'café'],   en: ['dining', 'food', 'kitchen'] },
  kapper:        { nl: ['haar', 'salon', 'coiffeur', 'knipster', 'barbier'],                    en: ['hair', 'barbershop', 'salon'] },
  bouwbedrijf:   { nl: ['bouw', 'aannemer', 'fundament', 'metsel', 'renovatie', 'verbouw'],    en: ['build', 'construct', 'renovation'] },
  advocaat:      { nl: ['recht', 'juridisch', 'wet', 'juridica', 'advies', 'letsel'],           en: ['legal', 'law', 'counsel'] },
  accountant:    { nl: ['boekhouding', 'fiscaal', 'belasting', 'administratie', 'financieel'],  en: ['accounting', 'finance', 'tax'] },
  webshop:       { nl: ['winkel', 'shop', 'online', 'bestelling', 'levering', 'bestel'],        en: ['store', 'ecommerce', 'shop'] },
  coach:         { nl: ['begeleiding', 'training', 'mentoring', 'groei', 'loopbaan'],           en: ['coaching', 'training', 'growth'] },
  garage:        { nl: ['auto', 'motor', 'reparatie', 'keuring', 'apk', 'service'],            en: ['automotive', 'repair', 'service'] },
  tandarts:      { nl: ['tand', 'mond', 'gebit', 'tandheelkunde', 'zorg'],                     en: ['dental', 'teeth', 'clinic'] },
  tuinier:       { nl: ['tuin', 'groen', 'plant', 'gazon', 'snoei', 'aanleg'],                 en: ['garden', 'landscaping', 'green'] },
  schilder:      { nl: ['verf', 'behang', 'renovatie', 'kleur', 'interieur'],                  en: ['painting', 'decor', 'interior'] },
  fotograaf:     { nl: ['foto', 'portret', 'bruiloft', 'evenement', 'beeld'],                  en: ['photo', 'portrait', 'wedding', 'studio'] },
  notaris:       { nl: ['akte', 'testament', 'vastgoed', 'juridisch', 'officieel'],             en: ['notary', 'legal', 'official'] },
  fysiotherapie: { nl: ['fysio', 'sport', 'beweging', 'herstel', 'behandeling', 'lichaam'],    en: ['physio', 'therapy', 'rehab'] },
  schoonheidssalon: { nl: ['huid', 'beauty', 'nagel', 'massage', 'wax', 'verzorging'],         en: ['beauty', 'skin', 'nail', 'spa'] },
  software:      { nl: ['app', 'digitaal', 'tech', 'development', 'code', 'platform'],         en: ['software', 'tech', 'digital', 'app'] },
  marketing:     { nl: ['reclame', 'campagne', 'social', 'merk', 'strategie'],                  en: ['marketing', 'brand', 'agency'] },
  logistiek:     { nl: ['transport', 'levering', 'bezorging', 'opslag', 'expeditie'],          en: ['logistics', 'transport', 'delivery'] },
  schoonmaak:    { nl: ['schoon', 'rein', 'poetsen', 'hygiene', 'onderhoud'],                  en: ['cleaning', 'hygiene', 'maintenance'] },
  kinderopvang:  { nl: ['kind', 'baby', 'opvang', 'dagopvang', 'oppas', 'crèche'],             en: ['childcare', 'daycare', 'nursery'] },
  vastgoed:      { nl: ['huur', 'koop', 'woning', 'huis', 'appartement', 'makelaar'],          en: ['realestate', 'property', 'housing'] },
  energie:       { nl: ['stroom', 'zon', 'solar', 'duurzaam', 'groen', 'gas'],                 en: ['energy', 'solar', 'sustainable'] },
  catering:      { nl: ['eten', 'evenement', 'buffet', 'lunch', 'hapje', 'dineren'],           en: ['catering', 'events', 'food'] },
  verzekering:   { nl: ['polis', 'schade', 'premie', 'dekking', 'risico'],                     en: ['insurance', 'cover', 'policy'] },
  reizen:        { nl: ['vakantie', 'vlucht', 'hotel', 'trip', 'rondreis', 'bestemming'],      en: ['travel', 'holiday', 'trip', 'tour'] },
  sport:         { nl: ['fitness', 'gym', 'training', 'gezond', 'bewegen', 'club'],            en: ['sport', 'fitness', 'gym', 'health'] },
  mode:          { nl: ['kleding', 'fashion', 'stijl', 'collectie', 'dames', 'heren'],         en: ['fashion', 'style', 'clothing', 'wear'] },
  it:            { nl: ['ict', 'tech', 'computer', 'netwerk', 'security', 'cloud'],            en: ['it', 'tech', 'cloud', 'security'] },
  horeca:        { nl: ['cafe', 'bar', 'kroeg', 'proeverij', 'terras', 'biertje'],             en: ['bar', 'cafe', 'lounge', 'pub'] },
};
