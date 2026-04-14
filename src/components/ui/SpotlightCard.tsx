'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  spotlightColor?: string;
  id?: string;
}

export function SpotlightCard({
  children,
  className,
  style,
  spotlightColor = 'rgba(79,70,229,0.10)',
  id,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      id={id}
      className={cn('relative overflow-hidden p-6 sm:p-8', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      {/* Spotlight overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 100%)`,
        }}
      />
      {children}
    </div>
  );
}
