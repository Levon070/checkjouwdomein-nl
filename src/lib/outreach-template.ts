export function generateOutreachEmail(domain: string): { subject: string; body: string } {
  const subject = `Interesse in aankoop van domeinnaam ${domain}`;

  const body = `Geachte eigenaar van ${domain},

Mijn naam is [UW NAAM] en ik ben op zoek naar een passende domeinnaam voor mijn bedrijf/project.
Bij mijn zoektocht ben ik uw domeinnaam ${domain} tegengekomen.

Ik vraag me af of u bereid bent om ${domain} te verkopen. Mochten de juiste voorwaarden overeenkomen,
dan sta ik open voor een gesprek over een overname.

Zou u mij kunnen laten weten:
- Of ${domain} beschikbaar is voor aankoop?
- Welk bedrag u in gedachten heeft?

U kunt mij bereiken via [UW EMAIL] of telefonisch via [UW TELEFOONNUMMER].

Ik zie uw reactie graag tegemoet.

Met vriendelijke groet,
[UW NAAM]
[UW BEDRIJF]`;

  return { subject, body };
}
