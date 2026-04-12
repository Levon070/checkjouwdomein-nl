const FAQS = [
  {
    question: 'Hoe controleer ik of een domeinnaam beschikbaar is?',
    answer:
      'Voer je gewenste keyword in de zoekbalk in. CheckJouwDomein.nl controleert automatisch de beschikbaarheid van tientallen domeinnamen met jouw keywords via het RDAP-protocol, de officiële standaard voor domeinregistraties.',
  },
  {
    question: 'Wat is het verschil tussen .nl en .com?',
    answer:
      '.nl is de Nederlandse landcode-extensie en geeft vertrouwen aan Nederlandse bezoekers. .com is de meest bekende internationale extensie. Voor een Nederlands bedrijf dat zich richt op de Nederlandse markt raden wij .nl aan. Wil je internationaal? Kies .com.',
  },
  {
    question: 'Wat kost een domeinnaam registreren?',
    answer:
      'Een .nl domein kost gemiddeld € 6–10 per jaar. Een .com domein kost € 10–15 per jaar. Prijzen verschillen per registrar. Via onze vergelijkingsknoppen zie je direct waar je het goedkoopst terecht kunt.',
  },
  {
    question: 'Kan ik een domein direct registreren via deze website?',
    answer:
      'Nee, CheckJouwDomein.nl is een gratis checker. Wanneer je op een registrar-knop klikt, word je doorgestuurd naar die registrar om het domein te registreren. Wij ontvangen hiervoor een kleine affiliate-vergoeding, zonder extra kosten voor jou.',
  },
  {
    question: 'Wat is een goede domeinnaam?',
    answer:
      'Een goede domeinnaam is kort (maximaal 15 tekens), makkelijk te onthouden, bevat geen koppeltekens of cijfers, en eindigt bij voorkeur op .nl of .com. Onze score-indicator helpt je de beste keuze te maken.',
  },
  {
    question: 'Hoe snel is de beschikbaarheidscheck?',
    answer:
      'De check duurt gemiddeld 10–30 seconden afhankelijk van het aantal suggesties en de snelheid van de domeinregisters. Beschikbare domeinen verschijnen bovenaan zodra ze gevonden worden.',
  },
];

export default function FaqSection() {
  return (
    <section className="max-w-2xl mx-auto">
      <p className="type-label text-center mb-2">Veelgestelde vragen</p>
      <h2
        className="type-heading text-center mb-8"
        style={{ color: 'var(--text)' }}
      >
        Alles wat je wilt weten
      </h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-white overflow-hidden"
            style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
          >
            <summary
              className="font-medium text-sm cursor-pointer list-none flex justify-between items-center px-5 py-4"
              style={{ color: 'var(--text)' }}
            >
              {faq.question}
              <span
                className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-sm"
                style={{ color: 'var(--text-subtle)' }}
              >
                ▾
              </span>
            </summary>
            <div
              className="px-5 pb-4 text-sm leading-relaxed"
              style={{
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                paddingTop: '12px',
              }}
            >
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
