'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  always?: boolean;
}

export function AnimatedUnderline({
  children,
  className,
  color = 'var(--primary)',
  always = false,
}: AnimatedUnderlineProps) {
  const [hovered, setHovered] = useState(false);
  const active = always || hovered;

  return (
    <span
      className={`relative inline-block ${always ? '' : 'cursor-pointer'} ${className ?? ''}`}
      onMouseEnter={() => !always && setHovered(true)}
      onMouseLeave={() => !always && setHovered(false)}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute left-0 w-full overflow-visible pointer-events-none"
        style={{ bottom: '-4px', height: '8px' }}
      >
        <svg
          viewBox="0 0 200 8"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <motion.path
            d="M 0 4 Q 25 0 50 4 Q 75 8 100 4 Q 125 0 150 4 Q 175 8 200 4"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </svg>
      </span>
    </span>
  );
}
