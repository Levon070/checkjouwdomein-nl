'use client';

import { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: 'mount' | 'hover';
  scrambleChars?: string;
}

export function TextScramble({
  text,
  className,
  speed = 25,
  trigger = 'mount',
  scrambleChars = CHARS,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(trigger === 'hover' ? text : '');
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterRef = useRef(0);
  const activeRef = useRef(false);

  function scramble() {
    if (activeRef.current) return;
    activeRef.current = true;
    iterRef.current = 0;

    const run = () => {
      setDisplayed(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < iterRef.current) return text[i];
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join(''),
      );
      if (iterRef.current < text.length) {
        iterRef.current += 0.35;
        frameRef.current = setTimeout(run, speed);
      } else {
        setDisplayed(text);
        activeRef.current = false;
      }
    };
    run();
  }

  useEffect(() => {
    if (trigger === 'mount') {
      const t = setTimeout(scramble, 200);
      return () => {
        clearTimeout(t);
        if (frameRef.current) clearTimeout(frameRef.current);
      };
    }
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (trigger === 'hover') {
    return (
      <span
        className={`cursor-pointer font-mono ${className ?? ''}`}
        onMouseEnter={scramble}
        aria-label={text}
      >
        {displayed}
      </span>
    );
  }

  return (
    <span className={`font-mono ${className ?? ''}`} aria-label={text}>
      {displayed}
    </span>
  );
}
