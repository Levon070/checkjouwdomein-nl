import React from 'react';

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
}

export function Marquee({
  items,
  speed = 35,
  className,
  itemClassName,
  separator,
}: MarqueeProps) {
  // Duplicate items for seamless looping
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden ${className ?? ''}`}
      style={{
        maskImage:
          'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span className={`flex-shrink-0 inline-flex items-center ${itemClassName ?? ''}`}>
              {item}
            </span>
            {separator && i < doubled.length - 1 && (
              <span className="flex-shrink-0 inline-flex items-center mx-1" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
