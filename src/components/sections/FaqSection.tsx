'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    id: 'item-1',
    question: 'Hoe controleer ik of een domeinnaam beschikbaar is?',
    answer:
      'Voer je gewenste keyword in de zoekbalk in. CheckJouwDomein.nl controleert automatisch de beschikbaarheid van tientallen domeinnamen met jouw keywords via het RDAP-protocol, de officiële standaard voor domeinregistraties.',
  },
  {
    id: 'item-2',
    question: 'Wat is het verschil tussen .nl en .com?',
    answer:
      '.nl is de Nederlandse landcode-extensie en geeft vertrouwen aan Nederlandse bezoekers. .com is de meest bekende internationale extensie. Voor een Nederlands bedrijf dat zich richt op de Nederlandse markt raden wij .nl aan. Wil je internationaal? Kies .com.',
  },
  {
    id: 'item-3',
    question: 'Wat kost een domeinnaam registreren?',
    answer:
      'Een .nl domein kost gemiddeld € 6–10 per jaar. Een .com domein kost € 10–15 per jaar. Prijzen verschillen per registrar. Via onze vergelijkingsknoppen zie je direct waar je het goedkoopst terecht kunt.',
  },
  {
    id: 'item-4',
    question: 'Kan ik een domein direct registreren via deze website?',
    answer:
      'Nee, CheckJouwDomein.nl is een gratis checker. Wanneer je op een registrar-knop klikt, word je doorgestuurd naar die registrar om het domein te registreren. Wij ontvangen hiervoor een kleine affiliate-vergoeding, zonder extra kosten voor jou.',
  },
  {
    id: 'item-5',
    question: 'Wat is een goede domeinnaam?',
    answer:
      'Een goede domeinnaam is kort (maximaal 15 tekens), makkelijk te onthouden, bevat geen koppeltekens of cijfers, en eindigt bij voorkeur op .nl of .com. Onze score-indicator helpt je de beste keuze te maken.',
  },
  {
    id: 'item-6',
    question: 'Hoe snel is de beschikbaarheidscheck?',
    answer:
      'De check duurt gemiddeld 10–30 seconden afhankelijk van het aantal suggesties en de snelheid van de domeinregisters. Beschikbare domeinen verschijnen bovenaan zodra ze gevonden worden.',
  },
];

export default function FaqSection() {
  return (
    <section className="py-2">
      <div className="grid gap-8 md:grid-cols-5 md:gap-12">
        {/* Left column — title */}
        <div className="md:col-span-2">
          <p className="type-label mb-2">Veelgestelde vragen</p>
          <h2
            className="type-heading mb-4"
            style={{ color: 'var(--text)' }}
          >
            Alles wat je wilt weten
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            Staat je vraag er niet bij? Neem gerust contact op via onze{' '}
            <Link href="/over-ons" className="font-semibold" style={{ color: 'var(--primary)' }}>
              over ons pagina
            </Link>
            .
          </p>
        </div>

        {/* Right column — accordion */}
        <div className="md:col-span-3">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Accordion type="single" collapsible className="px-6">
              {FAQS.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <AccordionTrigger
                    className="text-sm text-left"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
