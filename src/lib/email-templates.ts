export function domainAvailableEmail(domain: string): { subject: string; html: string; text: string } {
  const subject = `🎉 ${domain} is nu beschikbaar!`;

  const registrarUrl = `https://www.transip.nl/domein-registreren/?domain=${encodeURIComponent(domain)}`;
  const searchUrl = `https://checkjouwdomein.nl/zoek/${encodeURIComponent(domain.split('.')[0])}`;

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f8fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#4F46E5 0%,#06B6D4 100%);padding:32px 32px 24px">
      <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase">CheckJouwDomein.nl</p>
      <h1 style="margin:8px 0 0;color:white;font-size:24px;font-weight:700">Goed nieuws! 🎉</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 16px;font-size:15px;color:#374151">
        Het domein dat je in de gaten hield is nu beschikbaar:
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0;font-size:20px;font-weight:700;color:#059669">${domain}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#6b7280">Beschikbaar voor registratie</p>
      </div>
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6">
        Wees snel — populaire domeinen worden snel geregistreerd. Klik hieronder om direct te registreren.
      </p>
      <a href="${registrarUrl}" style="display:inline-block;background:#4F46E5;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">
        Registreer ${domain} →
      </a>
      <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">
        Of <a href="${searchUrl}" style="color:#4F46E5">bekijk alle beschikbare opties</a> op CheckJouwDomein.nl
      </p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #f3f4f6;background:#fafafa">
      <p style="margin:0;font-size:12px;color:#9ca3af">
        Je ontvangt deze melding omdat je dit domein hebt opgeslagen als alert.<br>
        <a href="${searchUrl}" style="color:#6b7280">Beheer je alerts</a> op CheckJouwDomein.nl
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `${domain} is nu beschikbaar!\n\nRegistreer snel via: ${registrarUrl}\n\nOf bekijk alle opties: ${searchUrl}\n\n---\nCheckJouwDomein.nl — Domein alerts`;

  return { subject, html, text };
}
