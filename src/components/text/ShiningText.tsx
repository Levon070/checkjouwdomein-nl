'use client';

import { motion } from 'framer-motion';

interface ShiningTextProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  from?: string;
  to?: string;
}

export function ShiningText({
  children,
  className,
  duration = 2.5,
  from = '#4F46E5',
  to = '#06B6D4',
}: ShiningTextProps) {
  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from} 0%, ${to} 30%, #fff 50%, ${from} 70%, ${to} 100%)`,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{ backgroundPosition: ['100% 0%', '-100% 0%'] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.span>
  );
}
