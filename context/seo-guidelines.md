# SEO Guidelines — Checkjouwdomein.nl

## Taal & Localisatie
- **Schrijftaal**: Nederlands (NL-BE varianten acceptabel waar gangbaar)
- **Doelmarkt**: Nederland primair, België secundair
- **Lokale context**: Verwijs naar SIDN (beheerder .nl), NL-wetgeving, NL-registrars
- **Hreflang**: nl-NL als primaire tag

## Content Lengte

| Type | Streeflengte |
|------|-------------|
| Standaard blogpost | 1.500–2.500 woorden |
| Pillar content / gids | 2.500–4.000 woorden |
| How-To artikel | 1.000–2.000 woorden |
| Registrar review | 1.200–2.000 woorden |
| Vergelijkingsartikel | 1.500–3.000 woorden |

## Keyword Optimalisatie

### Keyword Plaatsing (verplicht)
- [ ] H1 — primair keyword (bij voorkeur vooraan)
- [ ] Eerste 100 woorden
- [ ] Minimaal 2–3 H2-koppen
- [ ] Laatste alinea / conclusie
- [ ] Meta title (max 60 tekens)
- [ ] Meta description (max 160 tekens)
- [ ] URL slug

### Keyword Dichtheid
- Primair keyword: 1–2% (20–40x in 2.000 woorden)
- Secundaire keywords: 0,5–1%
- Gebruik variaties: "domeinnaam registreren" → "domein registreren" → "een domein aanmaken"

## Structuur

### Heading Hiërarchie
```
H1: Primair keyword — titel (slechts 1 per artikel)
  H2: Hoofdsectie 1 — inclusief keyword variatie
    H3: Subsectie
  H2: Hoofdsectie 2
    H3: Subsectie
  H2: Conclusie / Samenvatting
```

### Artikel Structuur Template
```markdown
# [H1: Keyword in Titre — Voordeel voor lezer]

[Directe antwoord op zoekvraag in 1-2 zinnen — voor AI-scrapers]

> **Kernpunten**
> - [Kernbevinding 1]
> - [Kernbevinding 2]
> - [Kernbevinding 3]

## Inleiding (100–200 woorden)
- Hook: wat is het probleem
- Belofte: wat leert de lezer
- Keyword in eerste 100 woorden

## [H2: Sectie 1 met keyword variatie]
## [H2: Sectie 2]
## [H2: Sectie 3 met keyword variatie]
## Conclusie (100–200 woorden)
- 3–5 takeaways
- Duidelijke call-to-action naar domeinchecker
```

## Meta Elementen

### Meta Title
- **Lengte**: 50–60 tekens
- **Formaat**: `[Keyword]: [Belofte] | Checkjouwdomein.nl`
- **Voorbeelden**:
  - ✅ "Goedkoopste .nl Domein 2026: Vergelijk 9 Registrars"
  - ✅ "TransIP Review 2026: Eerlijk & Onafhankelijk"
  - ❌ "Domein registreren tips" (te vaag)

### Meta Description
- **Lengte**: 150–160 tekens
- **Bevat**: primair keyword + voordeel + CTA
- **Formaat**: `[Probleem/Vraag]? [Oplossing]. [Uniek voordeel]. [CTA].`
- **Voorbeeld**: "Zoek je het goedkoopste .nl-domein? Wij vergelijken 9 registrars op prijs én kwaliteit. Check nu beschikbaarheid en registreer direct."

### URL Slug
- Lowercase, koppeltekens
- 3–5 woorden
- Primair keyword erin
- `/blog/[keyword-slug]`

## Interne Linking

- **Minimum**: 3 interne links per artikel
- **Optimaal**: 4–5 interne links
- Verwijs altijd naar:
  - De domeinchecker (/) bij elk relevant artikel
  - Bestaande blogposts (zie context/internal-links-map.md)
  - Registrars-pagina (/registrars) bij prijsvergelijking
- Gebruik beschrijvende ankertekst (niet "klik hier")

## Externe Linking
- **Minimum**: 2 externe links
- Link naar: SIDN.nl, betrouwbare registrars, officiële bronnen
- Affiliate/gesponsorde links: altijd `rel="sponsored"`

## Registrar Affiliate Links (Kritiek)

Bij het vermelden van registrars in content, gebruik de links uit `src/lib/registrars.ts`:

| Registrar | Affiliate? | Link patroon |
|-----------|-----------|-------------|
| mijn.host | Ja (tt=31112...) | Directe affiliate URL |
| Temblit | Ja (deals.temblit.com) | Directe affiliate URL |
| STRATO | Ja (acn.strato.nl) | Directe affiliate URL |
| TransIP | Nee (UTM only) | utm_source=checkjouwdomein |
| Mijndomein.nl | Nee (UTM only) | utm_source=checkjouwdomein |
| Antagonist | Nee (UTM only) | utm_source=checkjouwdomein |
| Namecheap | Nee (UTM only) | utm_source=checkjouwdomein |
| GoDaddy | Nee (UTM only) | utm_source=checkjouwdomein |
| Hostnet | Nee (UTM only) | utm_source=checkjouwdomein |

Alle gesponsorde/affiliate links krijgen `rel="sponsored"` attribuut.

## AI Search Optimalisatie (GEO)

### Direct-Answer Principe
- Beantwoord de zoekvraag in de **eerste 1–2 zinnen** van het artikel
- Niet begraven na 200+ woorden context
- Voorbeeld: "De goedkoopste .nl-registraar in 2026 is mijn.host (€2,99/jr) — hier vergelijken we alle opties."

### TL;DR Blok
Elke blogpost bevat na de inleiding een Key Takeaways blok:
```markdown
> **Kernpunten**
> - mijn.host is de goedkoopste .nl-registraar (€2,99/jr)
> - TransIP scoort het beste op klantenservice (4,8★)
> - Namecheap is het voordeligst voor .com-domeinen
```

### FAQ Sectie
- Elke blogpost: 4–6 FAQ-vragen
- Schrijf zoals mensen daadwerkelijk zoeken/vragen
- Beantwoord direct in eerste zin, dan uitleggen

## Leesbaarheid

- **Leesniveau**: B1-B2 (iedereen begrijpt het)
- **Zinlengte**: 15–20 woorden gemiddeld
- **Alinea's**: 2–4 zinnen
- **Subkoppen**: elke 300–400 woorden
- **Actieve zin**: >80%

## Checklist voor Publicatie

### Inhoud
- [ ] Keyword in eerste 100 woorden
- [ ] Direct antwoord in eerste 1–2 zinnen
- [ ] TL;DR / Kernpunten blok aanwezig
- [ ] 4–6 FAQ-vragen met directe antwoorden
- [ ] Affiliate links correct (rel="sponsored")

### SEO-elementen
- [ ] H1 met primair keyword
- [ ] 2–3 H2's met keywordvariaties
- [ ] Meta title 50–60 tekens
- [ ] Meta description 150–160 tekens met CTA
- [ ] URL-slug met primair keyword

### Links
- [ ] Minimaal 3 interne links (incl. link naar /)
- [ ] Minimaal 2 externe links (betrouwbare bronnen)
- [ ] Affiliate links gemarkeerd

### Kwaliteit
- [ ] Nederlandse spelling correct
- [ ] Prijzen actueel (controleer registrars.ts)
- [ ] Brand voice: eerlijk, praktisch, direct
- [ ] CTA naar domeinchecker aanwezig

---

**Onthoud**: Schrijf voor de Nederlandse zoekopdracht, niet de Engelse. Google.nl is onze prioriteit.
