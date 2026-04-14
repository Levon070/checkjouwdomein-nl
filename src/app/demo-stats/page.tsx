'use client';

import { useEffect, useState, useRef } from 'react';

/* ── Optie 1: Shimmer sweep + pen-vinkje ─────────────────────────── */
function Optie1() {
  return (
    <div
      className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-60">Optie 1 — Shimmer + pen-vinkje</p>
      <div className="flex flex-col items-center gap-1">
        {/* Shimmer number */}
        <div className="relative inline-block">
          <span
            className="text-5xl font-black"
            style={{ letterSpacing: '-0.04em', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
          >
            100%
          </span>
          <span
            className="absolute inset-0 rounded"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s ease-in-out infinite',
            }}
          />
        </div>
        {/* Pen-vinkje SVG */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginTop: 4 }}>
          <polyline
            points="7,20 15,28 30,10"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 0,
              animation: 'drawCheck 0.8s ease 0.3s both',
            }}
          />
        </svg>
        <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>gratis</div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Optie 2: Glow pulse + optellen ──────────────────────────────── */
function Optie2() {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let n = 0;
    const interval = setInterval(() => {
      n += 4;
      if (n >= 100) { setCount(100); clearInterval(interval); return; }
      setCount(n);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-60">Optie 2 — Glow + optellen</p>
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-5xl font-black"
          style={{
            letterSpacing: '-0.04em',
            animation: count === 100 ? 'glowPulse 2s ease-in-out infinite' : 'none',
          }}
        >
          {count}%
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polyline points="20 6 9 17 4 12" strokeWidth="2.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>gratis</div>
        </div>
      </div>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.4), 0 2px 12px rgba(0,0,0,0.15); }
          50% { text-shadow: 0 0 24px rgba(255,255,255,0.9), 0 2px 20px rgba(255,255,255,0.3); }
        }
      `}</style>
    </div>
  );
}

/* ── Optie 3: Progressbalk → vinkje ──────────────────────────────── */
function Optie3() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let n = 0;
    const interval = setInterval(() => {
      n += 2;
      setProgress(n);
      if (n >= 100) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 300);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-60">Optie 3 — Progressbalk → vinkje</p>
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl font-black" style={{ letterSpacing: '-0.04em' }}>100%</span>

        {!done ? (
          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'white',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                transition: 'width 0.02s linear',
              }}
            />
          </div>
        ) : (
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <circle cx="18" cy="18" r="15" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2"/>
            <polyline points="10,19 16,25 27,12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 30, animation: 'drawCheck2 0.5s ease 0.1s both' }}
            />
          </svg>
        )}
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>gratis</div>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck2 {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Optie 4: Highlight sweep (subtiel) ──────────────────────────── */
function Optie4() {
  return (
    <div
      className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-60">Optie 4 — Highlight sweep (subtiel)</p>
      <div className="flex flex-col items-center gap-1">
        <div className="relative inline-block">
          <span
            className="text-5xl font-black"
            style={{ letterSpacing: '-0.04em', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
          >
            100%
          </span>
          {/* Sweep light */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.65) 50%, transparent 65%)',
              backgroundSize: '300% 100%',
              animation: 'sweep 3s ease-in-out infinite',
            }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>gratis</div>
        </div>
      </div>
      <style>{`
        @keyframes sweep {
          0% { background-position: 200% 0; }
          50% { background-position: -100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Optie 5: Pen tekent vinkje, dan getal fade-in ───────────────── */
function Optie5() {
  const [showNum, setShowNum] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowNum(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-2xl p-8 text-center text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-60">Optie 5 — Pen tekent, dan getal</p>
      <div className="flex flex-col items-center gap-2">
        {/* Animated pen path checkmark */}
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          {/* Circle draws itself */}
          <circle
            cx="28" cy="28" r="22"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2.5"
            fill="none"
            style={{
              strokeDasharray: 138,
              strokeDashoffset: 0,
              animation: 'drawCircle 0.7s ease both',
            }}
          />
          {/* Check draws itself after */}
          <polyline
            points="16,29 24,37 40,20"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 42,
              strokeDashoffset: 0,
              animation: 'drawCheck3 0.6s ease 0.5s both',
            }}
          />
          {/* Pen tip dot */}
          <circle
            cx="40" cy="20" r="2.5"
            fill="white"
            style={{ animation: 'penTip 0.6s ease 0.5s both' }}
          />
        </svg>

        <span
          className="text-5xl font-black"
          style={{
            letterSpacing: '-0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.15)',
            opacity: showNum ? 1 : 0,
            transform: showNum ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            animation: showNum ? 'glowOnce 1s ease 0.2s both' : 'none',
          }}
        >
          100%
        </span>
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.85)', opacity: showNum ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>gratis</div>
      </div>
      <style>{`
        @keyframes drawCircle {
          from { stroke-dashoffset: 138; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck3 {
          from { stroke-dashoffset: 42; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes penTip {
          0% { opacity: 0; r: 0; }
          50% { opacity: 1; r: 4; }
          100% { opacity: 0; r: 2.5; }
        }
        @keyframes glowOnce {
          0% { text-shadow: 0 0 24px rgba(255,255,255,0.9); }
          100% { text-shadow: 0 2px 12px rgba(0,0,0,0.15); }
        }
      `}</style>
    </div>
  );
}

/* ── Pagina ───────────────────────────────────────────────────────── */
export default function DemoStats() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', padding: '48px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
          Demo — 5 opties voor &quot;100%&quot;
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: 40 }}>
          Refresh de pagina om de animaties opnieuw te zien.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Optie1 />
          <Optie2 />
          <Optie3 />
          <Optie4 />
          <Optie5 />
        </div>
      </div>
    </div>
  );
}
