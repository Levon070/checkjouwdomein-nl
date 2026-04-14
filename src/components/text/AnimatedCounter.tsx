'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SlotDigitProps {
  digit: string;
  delay?: number;
  duration?: number;
  className?: string;
}

function SlotDigit({ digit, delay = 0, duration = 0.9, className }: SlotDigitProps) {
  if (!/\d/.test(digit)) {
    return <span className={className}>{digit}</span>;
  }

  const d = parseInt(digit, 10);

  return (
    <span
      className={`inline-block overflow-hidden align-top ${className ?? ''}`}
      style={{ height: '1.15em' }}
    >
      <motion.span
        className="inline-flex flex-col"
        style={{ lineHeight: '1.15em' }}
        initial={{ y: 0 }}
        animate={{ y: `${-d * 1.15}em` }}
        transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="inline-block" style={{ height: '1.15em', lineHeight: '1.15em' }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  digitClassName?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  className,
  digitClassName,
  duration = 0.9,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  const formatted = value.toLocaleString('nl-NL');
  const digits = formatted.split('');

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className ?? ''}`}>
      {prefix && <span>{prefix}</span>}
      {inView
        ? digits.map((d, i) => (
            <SlotDigit
              key={i}
              digit={d}
              delay={i * 0.06}
              duration={duration}
              className={digitClassName}
            />
          ))
        : <span style={{ opacity: 0 }}>{formatted}</span>
      }
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
