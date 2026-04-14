'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up:    { y: 24 },
  down:  { y: -24 },
  left:  { x: -24 },
  right: { x: 24 },
};

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });
  const offset = OFFSET[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(6px)', ...offset }}
      animate={
        inView
          ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }
          : {}
      }
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
