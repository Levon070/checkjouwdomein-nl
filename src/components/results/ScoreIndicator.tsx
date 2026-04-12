interface Props {
  score: number;
}

export default function ScoreIndicator({ score }: Props) {
  const pct = Math.min(100, Math.max(0, score));
  const label =
    pct >= 80 ? 'Uitstekend' : pct >= 60 ? 'Goed' : pct >= 40 ? 'Redelijk' : 'Matig';
  const color =
    pct >= 80 ? 'var(--available)' : pct >= 60 ? '#0891B2' : 'var(--primary)';

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div
        className="flex-1 max-w-[72px] h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.07)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--primary), ${color})`,
          }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
