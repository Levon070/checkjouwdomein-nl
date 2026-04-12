import { DomainSuggestion } from '@/types';
import AvailabilityBadge from './AvailabilityBadge';
import ScoreIndicator from './ScoreIndicator';
import RegistrarButtons from './RegistrarButtons';

interface Props {
  suggestion: DomainSuggestion;
}

export default function DomainCard({ suggestion }: Props) {
  const { full, name, tld, score, status } = suggestion;

  return (
    <div className={`card p-4 ${status === 'available' ? 'available' : status === 'taken' ? 'taken' : ''}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="domain-name font-bold text-base break-all"
              style={{ color: 'var(--text)' }}
            >
              {name}
              <span style={{ color: 'var(--primary)' }}>{tld}</span>
            </span>
            <AvailabilityBadge status={status} />
          </div>
          {status === 'available' && <ScoreIndicator score={score} />}
        </div>
      </div>

      {status === 'available' && <RegistrarButtons domain={full} tld={tld} />}
    </div>
  );
}
