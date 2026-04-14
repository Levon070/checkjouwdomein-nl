import { cn } from '@/lib/utils';

export type DomainStatus = 'available' | 'taken' | 'checking' | 'unknown';

const STYLES: Record<DomainStatus, { dot: string; bg: string; text: string; border: string; label: string }> = {
  available: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Beschikbaar',
  },
  taken: {
    dot: 'bg-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Bezet',
  },
  checking: {
    dot: 'bg-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Checken…',
  },
  unknown: {
    dot: 'bg-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    label: 'Onbekend',
  },
};

interface StatusBadgeProps {
  status: DomainStatus;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, className, size = 'md' }: StatusBadgeProps) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        s.bg, s.text, s.border,
        className,
      )}
    >
      <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            s.dot,
            status === 'taken' || status === 'unknown' ? 'animate-none opacity-100' : '',
          )}
        />
        <span className={cn('relative inline-flex rounded-full', s.dot)} style={{ width: 8, height: 8 }} />
      </span>
      {label ?? s.label}
    </span>
  );
}
