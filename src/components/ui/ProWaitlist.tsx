export default function ProWaitlist() {
  return (
    <section
      className="rounded-2xl p-8 text-center"
      style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(6,182,212,0.05) 100%)', border: '1px solid rgba(79,70,229,0.12)' }}
    >
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
        style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
      >
        ✦ Binnenkort: CheckJouwDomein Pro
      </span>
      <h2 className="type-heading mb-2" style={{ color: 'var(--text)' }}>
        Wil je vroeg toegang?
      </h2>
      <p className="text-sm mb-6 mx-auto max-w-md" style={{ color: 'var(--text-muted)' }}>
        Portfolio-monitoring, bulk-RDAP, e-mail alerts en meer — meld je aan voor de wachtlijst.
      </p>

      <form
        name="pro-waitlist"
        method="POST"
        className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
        action="/bedankt"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="jouw@email.nl"
          className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text)', background: 'white' }}
        />
        <button
          type="submit"
          className="btn-primary px-5 py-2.5 text-sm rounded-lg whitespace-nowrap"
        >
          Aanmelden →
        </button>
      </form>
      <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
        Gratis · Geen spam · Uitschrijven wanneer je wilt
      </p>
    </section>
  );
}
