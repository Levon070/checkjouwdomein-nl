'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({ words, duration = 2500, className }: FlipWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(timer);
  }, [words.length, duration]);

  const word = words[index];

  return (
    <span className={`relative inline-block ${className ?? ''}`} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span key={word} className="inline-block">
          {word.split('').map((letter, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, filter: 'blur(6px)', y: 10 },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' },
                },
                exit: {
                  opacity: 0,
                  filter: 'blur(4px)',
                  y: -8,
                  transition: { delay: i * 0.02, duration: 0.2 },
                },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {letter === ' ' ? '\u00a0' : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
