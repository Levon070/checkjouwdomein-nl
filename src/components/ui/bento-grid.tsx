import React from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoCardProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface BentoTitleProps {
  children?: React.ReactNode;
  className?: string;
}

interface BentoDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

interface BentoContentProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoFeature {
  id: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  className?: string;
}

interface BentoGridWithFeaturesProps {
  features: BentoFeature[];
  className?: string;
}

const BentoGrid = ({ children, className }: BentoGridProps) => (
  <div
    className={cn(
      'grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-0 rounded-2xl border overflow-hidden',
      className,
    )}
    style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
  >
    {children}
  </div>
);

const BentoCard = ({ id, children, className, style }: BentoCardProps) => (
  <div
    id={id}
    className={cn('relative overflow-hidden p-6 sm:p-8', className)}
    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', ...style }}
  >
    {children}
  </div>
);

const BentoTitle = ({ children, className }: BentoTitleProps) => {
  if (!children) return null;
  return (
    <h3
      className={cn('text-left text-base font-bold tracking-tight mb-2', className)}
      style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
    >
      {children}
    </h3>
  );
};

const BentoDescription = ({ children, className }: BentoDescriptionProps) => {
  if (!children) return null;
  return (
    <p
      className={cn('text-sm leading-relaxed', className)}
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  );
};

const BentoContent = ({ children, className }: BentoContentProps) => (
  <div className={cn('h-full w-full', className)}>{children}</div>
);

const BentoGridWithFeatures = ({ features, className }: BentoGridWithFeaturesProps) => (
  <div className="relative">
    <BentoGrid className={className}>
      {features.map((feature) => (
        <BentoCard
          key={feature.id}
          id={feature.id}
          className={feature.className}
        >
          <BentoTitle>{feature.title}</BentoTitle>
          <BentoDescription>{feature.description}</BentoDescription>
          <BentoContent>{feature.content}</BentoContent>
        </BentoCard>
      ))}
    </BentoGrid>
  </div>
);

export {
  BentoGrid,
  BentoCard,
  BentoTitle,
  BentoDescription,
  BentoContent,
  BentoGridWithFeatures,
  type BentoFeature,
};
