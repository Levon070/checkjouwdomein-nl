'use client';

import React from 'react';

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShinyButton({ children, className = '', ...props }: ShinyButtonProps) {
  return (
    <button className={`shiny-btn ${className}`} {...props}>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
