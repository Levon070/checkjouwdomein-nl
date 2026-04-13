'use client';

import { useState } from 'react';
import { useDomainCart } from '@/hooks/useDomainCart';
import CartModal from '@/components/results/CartModal';

export default function CartButton() {
  const { items, count, remove, clear } = useDomainCart();
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        style={{
          background: 'var(--primary)',
          color: '#fff',
          minHeight: 36,
        }}
        aria-label={`Domeinwinkelmand (${count} domeinen)`}
      >
        <span>🛒</span>
        <span
          className="absolute -top-1.5 -right-1.5 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
          style={{ background: '#EF4444', color: '#fff', fontSize: '10px' }}
        >
          {count}
        </span>
      </button>

      {open && (
        <CartModal
          items={items}
          onClose={() => setOpen(false)}
          onRemove={remove}
          onClear={() => { clear(); setOpen(false); }}
        />
      )}
    </>
  );
}
