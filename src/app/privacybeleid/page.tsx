import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacybeleid — CheckJouwDomein.nl',
  description: 'Lees hoe CheckJouwDomein.nl omgaat met jouw persoonsgegevens, cookies en privacy conform de AVG/GDPR.',
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '13 april 2026';

export default function PrivacybeleidPage() {
  return (
    <div className="container mx-auto px-5 max-w-3xl py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="type-label mb-2">Juridisch</p>
        <h1 className="text-3xl font-black mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Privacybeleid
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
          Laatst bijgewerkt: {LAST_UPDATED}
        </p>
      </div>

      <div className="prose-legal space-y-10" style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.925rem' }}>

        {/* 1 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>1. Wie zijn wij</h2>
          <p>
            CheckJouwDomein.nl is een gratis online dienst waarmee je de beschikbaarheid van domeinnamen kunt controleren.
            De website is bereikbaar via <strong>https://www.checkjouwdomein.nl</strong>.
          </p>
          <p className="mt-3">
            Voor vragen over dit privacybeleid kun je contact opnemen via:{' '}
            <a href="mailto:privacy@checkjouwdomein.nl" style={{ color: 'var(--primary)' }}>
              privacy@checkjouwdomein.nl
            </a>
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>2. Welke gegevens verzamelen wij</h2>
          <p>Wij verzamelen uitsluitend de volgende (geanonimiseerde) gegevens:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li><strong>Zoekopdrachten</strong>: de door jou ingevulde zoekwoorden om domeinnamen te checken. Deze worden niet gekoppeld aan een persoon.</li>
            <li><strong>Paginabezoeken</strong>: geanonimiseerde statistieken over welke pagina's bezocht worden (via onze eigen analytics op basis van Upstash Redis). Geen cookies van derden voor analytics.</li>
            <li><strong>Technische gegevens</strong>: IP-adres (geanonimiseerd na verwerking), browser-type en besturingssysteem — uitsluitend voor technisch beheer en misbruikpreventie.</li>
            <li><strong>Cookievoorkeur</strong>: jouw keuze in de cookiebanner wordt opgeslagen in <code>localStorage</code> op jouw eigen apparaat.</li>
            <li><strong>Waitlist-aanmeldingen</strong>: als je je aanmeldt voor de Pro-waitlist, slaan wij je e-mailadres op.</li>
          </ul>
          <p className="mt-3">
            Wij verzamelen <strong>geen</strong> namen, adressen, betalingsgegevens of andere directe persoonsgegevens, tenzij je deze zelf actief invult (bijv. bij de Pro-waitlist).
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>3. Doel en grondslag van verwerking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-2" style={{ border: '1px solid var(--border)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)' }}>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Doel</th>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Grondslag (AVG)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Domeinbeschikbaarheid controleren', 'Uitvoering overeenkomst (art. 6 lid 1 sub b)'],
                  ['Technisch beheer & beveiliging', 'Gerechtvaardigd belang (art. 6 lid 1 sub f)'],
                  ['Geanonimiseerde gebruiksstatistieken', 'Gerechtvaardigd belang (art. 6 lid 1 sub f)'],
                  ['Advertenties via Google AdSense', 'Toestemming (art. 6 lid 1 sub a) — alleen na acceptatie cookiebanner'],
                  ['Pro-waitlist e-maillijst', 'Toestemming (art. 6 lid 1 sub a)'],
                ].map(([doel, grondslag]) => (
                  <tr key={doel} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3">{doel}</td>
                    <td className="p-3" style={{ color: 'var(--text-subtle)' }}>{grondslag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>4. Cookies</h2>
          <p>CheckJouwDomein.nl gebruikt de volgende cookies en vergelijkbare technieken:</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse" style={{ border: '1px solid var(--border)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)' }}>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Cookie</th>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Type</th>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Doel</th>
                  <th className="text-left p-3 font-semibold" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Bewaartijd</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['cjd_cookie_consent', 'Functioneel (localStorage)', 'Slaat jouw cookievoorkeur op', 'Onbeperkt (lokaal apparaat)'],
                  ['cjd_favorites', 'Functioneel (localStorage)', 'Opgeslagen favoriete domeinen', 'Onbeperkt (lokaal apparaat)'],
                  ['cjd_cart', 'Functioneel (localStorage)', 'Inhoud van je domeinwinkelmand', 'Sessie'],
                  ['Google AdSense cookies', 'Marketing (alleen na toestemming)', 'Gepersonaliseerde advertenties via Google', 'Tot 13 maanden'],
                ].map(([cookie, type, doel, bewaar]) => (
                  <tr key={cookie} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-3 font-mono text-xs">{cookie}</td>
                    <td className="p-3" style={{ color: 'var(--text-subtle)' }}>{type}</td>
                    <td className="p-3">{doel}</td>
                    <td className="p-3" style={{ color: 'var(--text-subtle)' }}>{bewaar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Je kunt jouw cookievoorkeur op elk moment wijzigen door de opslag te wissen via je browserinstellingen.
            Google AdSense cookies worden <strong>alleen</strong> geplaatst als je &quot;Alles accepteren&quot; klikt in onze cookiebanner.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>5. Derden en doorgifte</h2>
          <p>Wij delen gegevens met de volgende derde partijen:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <strong>Google AdSense / Google LLC</strong> — advertentienetwerk (alleen na toestemming).
              Google kan deze gegevens buiten de EU verwerken. Google is gecertificeerd onder het EU-VS Data Privacy Framework.
              Zie: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Google Privacybeleid</a>.
            </li>
            <li>
              <strong>Tradedoubler / affiliate netwerken</strong> — bij klikken op registrar-knoppen worden UTM-parameters en affiliate-ID&apos;s doorgegeven aan de betreffende registrar.
              Er worden geen persoonsgegevens van onze kant doorgegeven.
            </li>
            <li>
              <strong>Upstash (Redis)</strong> — geanonimiseerde gebruiksstatistieken worden opgeslagen via Upstash Redis, gehost in de EU (Frankfurt).
            </li>
            <li>
              <strong>Vercel</strong> — de website is gehost op Vercel Inc. Vercel verwerkt technische loggegevens.
              Zie: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Vercel Privacybeleid</a>.
            </li>
            <li>
              <strong>Groq / Anthropic</strong> — bij gebruik van de AI Naamgenerator worden zoekwoorden verwerkt via een AI API. Er worden geen persoonsgegevens verstuurd.
            </li>
          </ul>
          <p className="mt-3">
            Wij verkopen of verhuren jouw gegevens <strong>nooit</strong> aan derden.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>6. Bewaartermijnen</h2>
          <p>
            Geanonimiseerde statistieken worden maximaal <strong>90 dagen</strong> bewaard.
            E-mailadressen van de Pro-waitlist worden bewaard totdat je je uitschrijft of de dienst wordt gelanceerd.
            Technische logs worden maximaal <strong>30 dagen</strong> bewaard.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>7. Jouw rechten (AVG)</h2>
          <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je de volgende rechten:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li><strong>Recht op inzage</strong> — je kunt opvragen welke gegevens wij over jou verwerken.</li>
            <li><strong>Recht op rectificatie</strong> — onjuiste gegevens laten corrigeren.</li>
            <li><strong>Recht op verwijdering</strong> — je kunt verzoeken om verwijdering van jouw gegevens (&quot;recht op vergetelheid&quot;).</li>
            <li><strong>Recht op beperking</strong> — verwerking laten beperken in bepaalde gevallen.</li>
            <li><strong>Recht op dataportabiliteit</strong> — jouw gegevens in een gestructureerd formaat ontvangen.</li>
            <li><strong>Recht van bezwaar</strong> — bezwaar maken tegen verwerking op basis van gerechtvaardigd belang.</li>
            <li><strong>Recht om toestemming in te trekken</strong> — eerder gegeven toestemming op elk moment intrekken.</li>
          </ul>
          <p className="mt-3">
            Stuur een verzoek naar{' '}
            <a href="mailto:privacy@checkjouwdomein.nl" style={{ color: 'var(--primary)' }}>
              privacy@checkjouwdomein.nl
            </a>.
            Wij reageren binnen <strong>30 dagen</strong>.
          </p>
          <p className="mt-3">
            Heb je een klacht? Dan kun je deze indienen bij de{' '}
            <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
              Autoriteit Persoonsgegevens
            </a>.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>8. Beveiliging</h2>
          <p>
            Wij nemen passende technische en organisatorische maatregelen om jouw gegevens te beveiligen, waaronder:
            HTTPS-versleuteling, beveiligde serveromgeving (Vercel), geen opslag van wachtwoorden (geen accounts),
            en periodieke beoordeling van ons beveiligingsbeleid.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>9. Wijzigingen</h2>
          <p>
            Wij behouden het recht om dit privacybeleid te wijzigen. De datum van de laatste update staat bovenaan deze pagina vermeld.
            Bij ingrijpende wijzigingen informeren wij actieve gebruikers via de website.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>10. Contact</h2>
          <p>
            Voor vragen, verzoeken of klachten over dit privacybeleid:{' '}
            <a href="mailto:privacy@checkjouwdomein.nl" style={{ color: 'var(--primary)' }}>
              privacy@checkjouwdomein.nl
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
        <Link href="/algemene-voorwaarden" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
          Algemene Voorwaarden →
        </Link>
      </div>
    </div>
  );
}
