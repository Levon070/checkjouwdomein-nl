'use client';

import { useEffect, useRef } from 'react';

interface LightParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  brightness: number;
  gridLine: 'horizontal' | 'vertical';
  progress: number;
}

interface GridHeroBackgroundProps {
  className?: string;
  gridColor?: string;
  particleColor?: string;
  gridSize?: number;
}

export function GridHeroBackground({
  className,
  gridColor = 'rgba(79,70,229,0.07)',
  particleColor = '79,70,229',
  gridSize = 48,
}: GridHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lights: LightParticle[] = [];
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createLight = (): LightParticle => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const horiz = Math.random() > 0.5;
      if (horiz) {
        const y = Math.floor(Math.random() * (h / gridSize)) * gridSize;
        return { x: 0, y, targetX: w, targetY: y, speed: 0.3 + Math.random() * 1.0, brightness: 0.5 + Math.random() * 0.5, gridLine: 'horizontal', progress: 0 };
      } else {
        const x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
        return { x, y: 0, targetX: x, targetY: h, speed: 0.3 + Math.random() * 1.0, brightness: 0.5 + Math.random() * 0.5, gridLine: 'vertical', progress: 0 };
      }
    };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Particles
      lights.forEach((light) => {
        const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 14);
        grad.addColorStop(0, `rgba(${particleColor},${light.brightness * 0.9})`);
        grad.addColorStop(0.4, `rgba(${particleColor},${light.brightness * 0.3})`);
        grad.addColorStop(1, `rgba(${particleColor},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${particleColor},${light.brightness})`;
        ctx.beginPath();
        ctx.arc(light.x, light.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      for (let i = lights.length - 1; i >= 0; i--) {
        const l = lights[i];
        l.progress += l.speed * dt * 0.001;
        if (l.gridLine === 'horizontal') l.x = l.progress * l.targetX;
        else l.y = l.progress * l.targetY;
        if (l.progress >= 1) lights.splice(i, 1);
      }

      if (Math.random() < 0.018 && lights.length < 7) lights.push(createLight());

      draw();
      animRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gridColor, particleColor, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ''}`}
    />
  );
}
