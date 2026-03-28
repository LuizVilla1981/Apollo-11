import { useEffect, useRef } from 'react';

import { usePageVisibility } from '../../hooks/usePageVisibility';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hasGlow: boolean;
};

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPageVisible = usePageVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    let stars: Star[] = [];
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const resize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, viewportWidth < 768 ? 1.5 : 2);

      canvas.width = Math.floor(viewportWidth * devicePixelRatio);
      canvas.height = Math.floor(viewportHeight * devicePixelRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initStars();
    };

    const initStars = () => {
      stars = [];
      const isMobile = viewportWidth < 768;
      const numStars = prefersReducedMotion ? 60 : isMobile ? 120 : 220;

      for (let i = 0; i < numStars; i++) {
        const hasGlow = Math.random() < (isMobile ? 0.12 : 0.18);
        stars.push({
          x: Math.random() * viewportWidth,
          y: Math.random() * viewportHeight,
          size: isMobile
            ? (hasGlow ? Math.random() * 1.2 + 0.8 : Math.random() * 0.7 + 0.3)
            : (hasGlow ? Math.random() * 1.6 + 1.0 : Math.random() * 1.0 + 0.35),
          speed: prefersReducedMotion ? 0.015 : isMobile ? Math.random() * 0.06 + 0.015 : Math.random() * 0.1 + 0.02,
          baseOpacity: isMobile
            ? (hasGlow ? Math.random() * 0.3 + 0.5 : Math.random() * 0.3 + 0.25)
            : (hasGlow ? Math.random() * 0.3 + 0.55 : Math.random() * 0.35 + 0.25),
          twinkleSpeed: Math.random() * 0.003 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2,
          hasGlow,
        });
      }
    };

    const drawStar = (star: Star, time: number) => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const opacity = star.baseOpacity + twinkle * 0.18;

      if (star.hasGlow) {
        // Outer glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3.5);
        gradient.addColorStop(0, `rgba(220, 230, 255, ${opacity * 0.9})`);
        gradient.addColorStop(0.3, `rgba(200, 215, 255, ${opacity * 0.35})`);
        gradient.addColorStop(0.7, `rgba(180, 200, 255, ${opacity * 0.08})`);
        gradient.addColorStop(1, 'rgba(180, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star cross spikes (4-point)
      ctx.strokeStyle = `rgba(235, 240, 255, ${opacity * 0.4})`;
      ctx.lineWidth = 0.5;
      const spikeLen = star.size * (star.hasGlow ? 2.8 : 1.6);
      ctx.beginPath();
      ctx.moveTo(star.x - spikeLen, star.y);
      ctx.lineTo(star.x + spikeLen, star.y);
      ctx.moveTo(star.x, star.y - spikeLen);
      ctx.lineTo(star.x, star.y + spikeLen);
      ctx.stroke();

      // Core dot
      ctx.fillStyle = `rgba(245, 248, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.55, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (time: number) => {
      const isMobile = viewportWidth < 768;
      const targetFrameTime = prefersReducedMotion ? 1000 / 14 : isMobile ? 1000 / 28 : 1000 / 40;

      if (time - lastFrameTime < targetFrameTime) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = time;
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      for (const star of stars) {
        drawStar(star, time);

        star.y -= star.speed;
        if (star.y < -star.size * 4) {
          star.y = viewportHeight + star.size * 4;
          star.x = Math.random() * viewportWidth;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    if (isPageVisible) {
      animationFrameId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPageVisible, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full [contain:strict]" />;
}
