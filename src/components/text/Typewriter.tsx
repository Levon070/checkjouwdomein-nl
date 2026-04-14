'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayAfterType?: number;
  className?: string;
}

export function Typewriter({
  strings,
  typeSpeed = 80,
  deleteSpeed = 40,
  delayAfterType = 1800,
  className,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = strings[stringIndex];

    if (phase === 'typing') {
      if (charIndex < current.length) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, typeSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), delayAfterType);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'deleting') {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setStringIndex((i) => (i + 1) % strings.length);
        setPhase('typing');
      }
    }
  }, [phase, charIndex, stringIndex, strings, typeSpeed, deleteSpeed, delayAfterType]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] ml-[2px] align-middle bg-current"
        style={{ animation: 'blink 1s step-end infinite' }}
        aria-hidden="true"
      />
    </span>
  );
}
