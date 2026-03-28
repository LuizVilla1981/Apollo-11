import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePageVisibility } from '../hooks/usePageVisibility';

export function RocketLayer() {
  const shouldReduceMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const update = () => setIsLargeDesktop(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  const duration = shouldReduceMotion ? 72 : isLargeDesktop ? 52 : 44;
  const startX = isLargeDesktop ? '-24vw' : '-18vw';
  const endX = isLargeDesktop ? '112vw' : '108vw';
  const startY = isLargeDesktop ? '84vh' : '78vh';
  const endY = isLargeDesktop ? '-12vh' : '-6vh';
  const trailAngle = isLargeDesktop ? -28 : -24;
  const rocketImageAngle = isLargeDesktop ? -5 : -4;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden hidden md:block">
      <motion.div
        className="absolute left-0 top-0 opacity-[0.58] lg:opacity-[0.72]"
        animate={isPageVisible ? {
          x: [startX, endX],
          y: [startY, endY],
        } : undefined}
        transition={isPageVisible ? {
          duration,
          repeat: Infinity,
          ease: 'linear',
        } : undefined}
        style={{ willChange: 'transform' }}
      >
        <div className="relative h-[8rem] w-[12rem] lg:h-[11rem] lg:w-[18rem] xl:h-[12rem] xl:w-[20rem]">
          <div
            className="absolute left-[2%] top-[57%] h-[2px] w-[58%] origin-right"
            style={{ transform: `translateY(-50%) rotate(${trailAngle}deg)` }}
          >
            <div className="absolute inset-y-0 right-0 h-px w-full bg-gradient-to-l from-white/42 via-primary/24 to-transparent" />
            <div className="absolute inset-y-0 right-[8%] h-[2px] w-[62%] bg-gradient-to-l from-primary/28 to-transparent opacity-70" />
            <div className="absolute right-[5%] top-1/2 h-3 w-20 lg:w-28 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,149,0.18),rgba(255,179,131,0.06)_55%,rgba(255,179,131,0)_80%)] blur-[2px]" />
          </div>
          <img
            src="/space/rocket.webp"
            alt="Foguete"
            className="absolute right-0 top-1/2 z-10 h-auto w-32 lg:w-48 xl:w-56 select-none drop-shadow-[0_16px_28px_rgba(7,10,16,0.16)]"
            style={{ transform: `translateY(-50%) rotate(${rocketImageAngle}deg)` }}
            data-space-obstacle="rocket"
            data-collision-id="rocket"
            data-collision-scale="0.26"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}