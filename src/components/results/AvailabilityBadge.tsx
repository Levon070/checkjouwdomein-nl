import { DomainStatus } from '@/types';

interface Props {
  status: DomainStatus;
}

export default function AvailabilityBadge({ status }: Props) {
  if (status === 'checking') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(0,0,0,0.04)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--text-subtle)' }}
        />
        Controleren…
      </span>
    );
  }

  if (status === 'available') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(5, 150, 105, 0.08)',
          color: 'var(--available)',
          border: '1px solid rgba(5, 150, 105, 0.18)',
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--available)' }}
        />
        Beschikbaar
      </span>
    );
  }

  if (status === 'taken') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(220, 38, 38, 0.06)',
          color: 'var(--taken)',
          border: '1px solid rgba(220, 38, 38, 0.12)',
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--taken)' }}
        />
        Bezet
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.04)',
        color: 'var(--text-subtle)',
        border: '1px solid var(--border)',
      }}
    >
      Onbekend
    </span>
  );
}
