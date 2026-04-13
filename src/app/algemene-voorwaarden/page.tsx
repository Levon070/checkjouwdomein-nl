import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden — CheckJouwDomein.nl',
  description: 'De algemene voorwaarden van CheckJouwDomein.nl. Lees de gebruiksvoorwaarden voor onze gratis domein checker.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '13 april 2026';

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="container mx-auto px-5 max-w-3xl py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="type-label mb-2">Juridisch</p>
        <h1 className="text-3xl font-black mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Algemene Voorwaarden
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
          Laatst bijgewerkt: {LAST_UPDATED}
        </p>
      </div>

      <div className="space-y-10" style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.925rem' }}>

        {/* 1 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>1. Definities</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Dienst</strong>: de website CheckJouwDomein.nl en alle bijbehorende functionaliteit.</li>
            <li><strong>Gebruiker</strong>: iedere persoon die de Dienst bezoekt of gebruikt.</li>
            <li><strong>Beheerder</strong>: de eigenaar en exploitant van CheckJouwDomein.nl.</li>
            <li><strong>Registrar</strong>: een externe aanbieder van domeinregistraties waarnaar wij doorverwijzen.</li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>2. Toepasselijkheid</h2>
          <p>
            Deze algemene voorwaarden zijn van toepassing op elk gebruik van de Dienst. Door de website te bezoeken of te gebruiken
            ga je akkoord met deze voorwaarden. Als je niet akkoord gaat, verzoeken wij je de website niet te gebruiken.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>3. Beschrijving van de Dienst</h2>
          <p>
            CheckJouwDomein.nl biedt een gratis online tool waarmee gebruikers de beschikbaarheid van domeinnamen kunnen controleren.
            De Dienst omvat onder meer:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Real-time domeinbeschikbaarheidscheck via RDAP</li>
            <li>Vergelijking van prijzen bij registrars</li>
            <li>AI-gedreven naamgenerator</li>
            <li>EUIPO handelsmerkcheck (raadplegende functie)</li>
            <li>KVK handelsnaamcheck (raadplegende functie)</li>
            <li>Sociale media handle-check</li>
          </ul>
          <p className="mt-3">
            De Dienst is gratis beschikbaar. Wij behouden het recht voor de Dienst op elk moment te wijzigen,
            uit te breiden of te beëindigen.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>4. Nauwkeurigheid van informatie</h2>
          <p>
            Wij streven naar actuele en correcte beschikbaarheidsdata. De informatie op CheckJouwDomein.nl is echter
            <strong> informatief van aard</strong> en kan afwijken van de werkelijkheid door:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Vertraging in RDAP- of WHOIS-registers</li>
            <li>Domeinen die gelijktijdig worden geregistreerd</li>
            <li>Registrar-specifieke beperkingen of reserveringen</li>
            <li>Tijdelijke onbeschikbaarheid van externe databronnen</li>
          </ul>
          <p className="mt-3">
            Aan de getoonde informatie kunnen geen rechten worden ontleend. De definitieve beschikbaarheid
            en prijs worden vastgesteld door de registrar op het moment van registratie.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>5. Affiliate links en doorverwijzingen</h2>
          <p>
            CheckJouwDomein.nl bevat links naar externe registrars. Sommige van deze links zijn <strong>affiliate-links</strong>:
            wanneer je via een dergelijke link een domein registreert, ontvangen wij een kleine vergoeding van de registrar.
            Dit brengt voor jou <strong>geen extra kosten</strong> met zich mee.
          </p>
          <p className="mt-3">
            De vergoeding heeft geen invloed op de volgorde, beoordeling of presentatie van registrars.
            Wij streven naar objectieve en eerlijke vergelijkingsinformatie.
          </p>
          <p className="mt-3">
            Wij zijn niet verantwoordelijk voor de inhoud, het beleid of de dienstverlening van externe registrars.
            Een domeinregistratie komt uitsluitend tot stand tussen de gebruiker en de betreffende registrar.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>6. Aansprakelijkheid</h2>
          <p>
            CheckJouwDomein.nl is een informatieve dienst. De Beheerder is <strong>niet aansprakelijk</strong> voor:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Schade als gevolg van onjuiste of verouderde beschikbaarheidsinformatie</li>
            <li>Gemiste domeinregistraties</li>
            <li>Handelingen of nalaten van externe registrars</li>
            <li>Tijdelijke of permanente onbeschikbaarheid van de Dienst</li>
            <li>Verlies van gegevens opgeslagen in de browser (localStorage)</li>
            <li>Schade door gebruik van de AI naamgenerator of merkcheck-resultaten</li>
          </ul>
          <p className="mt-3">
            De Beheerder is uitsluitend aansprakelijk voor directe schade als gevolg van opzet of grove nalatigheid,
            tot een maximum van <strong>€ 100</strong> per schadegeval.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>7. Intellectueel eigendom</h2>
          <p>
            Alle rechten op de Dienst, waaronder de broncode, het ontwerp, de teksten, logo&apos;s en het merk
            &quot;CheckJouwDomein.nl&quot;, zijn eigendom van of in licentie bij de Beheerder.
          </p>
          <p className="mt-3">
            Het is niet toegestaan om zonder schriftelijke toestemming van de Beheerder:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>De Dienst of onderdelen daarvan te kopiëren, reproduceren of distribueren</li>
            <li>Geautomatiseerde scraping of bulk-opvraging uit te voeren</li>
            <li>De Dienst commercieel te exploiteren zonder toestemming</li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>8. Toegestaan gebruik</h2>
          <p>Het is <strong>niet</strong> toegestaan de Dienst te gebruiken voor:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Grootschalige geautomatiseerde domeinqueries (crawlen / scraping)</li>
            <li>Cybersquatting of registratie van misleidende domeinnamen</li>
            <li>Activiteiten die in strijd zijn met de Nederlandse of Europese wetgeving</li>
            <li>Het verspreiden van malware, spam of misleidende inhoud</li>
          </ul>
          <p className="mt-3">
            De Beheerder behoudt zich het recht voor om toegang te blokkeren bij misbruik.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>9. Beschikbaarheid</h2>
          <p>
            Wij streven naar een beschikbaarheid van de Dienst van minimaal 99% per jaar. Wij geven echter geen garantie op
            ononderbroken beschikbaarheid. Gepland onderhoud of storingen kunnen leiden tot tijdelijke onbeschikbaarheid.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>10. Wijzigingen van de voorwaarden</h2>
          <p>
            De Beheerder behoudt het recht deze voorwaarden te wijzigen. De meest actuele versie is altijd
            beschikbaar op <Link href="/algemene-voorwaarden" style={{ color: 'var(--primary)' }}>checkjouwdomein.nl/algemene-voorwaarden</Link>.
            Voortgezet gebruik van de Dienst na wijziging geldt als acceptatie van de nieuwe voorwaarden.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>11. Toepasselijk recht en geschillen</h2>
          <p>
            Op deze voorwaarden is <strong>Nederlands recht</strong> van toepassing.
            Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
            Voor consumenten geldt dat zij ook gebruik kunnen maken van de Europese ODR-procedure via{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
              ec.europa.eu/consumers/odr
            </a>.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>12. Contact</h2>
          <p>
            Voor vragen over deze voorwaarden:{' '}
            <a href="mailto:info@checkjouwdomein.nl" style={{ color: 'var(--primary)' }}>
              info@checkjouwdomein.nl
            </a>
          </p>
        </section>

      </div>

      {/* Back link */}
      <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
          ← Terug naar CheckJouwDomein.nl
        </Link>
        <span className="mx-4" style={{ color: 'var(--border)' }}>|</span>
        <Link href="/privacybeleid" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
          Privacybeleid →
        </Link>
      </div>
    </div>
  );
}
