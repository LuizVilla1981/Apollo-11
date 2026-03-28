import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { usePageVisibility } from '../hooks/usePageVisibility';

type Planet3DProps = {
  src: string;
  alt: string;
  className: string;
  sizeClassName: string;
  rotationFactor: number;
  parallaxRange?: [number, number];
  parallaxXRange?: [number, number];
  highlightClassName?: string;
  shadowClassName?: string;
  ringTilt?: number;
  imageFitClassName?: string;
  containerClassName?: string;
  showFrame?: boolean;
  showSurfaceEffects?: boolean;
  orbitOffsetX?: number;
  orbitOffsetY?: number;
  orbitDuration?: number;
  orbitDelay?: number;
  orbitDirection?: 1 | -1;
  axisTilt?: number;
  axisWobble?: number;
  axisWobbleDuration?: number;
  collisionId?: string;
  collisionScale?: number;
};

export function Planet3D({
  src,
  alt,
  className,
  sizeClassName,
  rotationFactor,
  parallaxRange = [-24, 36],
  parallaxXRange = [0, 0],
  highlightClassName = 'bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.34),rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_55%)]',
  shadowClassName = 'bg-[radial-gradient(circle_at_72%_74%,rgba(3,3,5,0)_22%,rgba(3,3,5,0.18)_52%,rgba(3,3,5,0.76)_100%)]',
  ringTilt,
  imageFitClassName = 'object-cover scale-[1.02]',
  containerClassName = 'overflow-hidden rounded-full border border-white/10',
  showFrame = true,
  showSurfaceEffects = true,
  orbitOffsetX = 0,
  orbitOffsetY = 0,
  orbitDuration = 0,
  orbitDelay = 0,
  orbitDirection = 1,
  axisTilt = 0,
  axisWobble = 0,
  axisWobbleDuration = 12,
  collisionId,
  collisionScale = 0.42,
}: Planet3DProps) {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 28,
    damping: 18,
    mass: 0.4,
  });
  const rotateDistance = shouldReduceMotion ? 72 * rotationFactor : 320 * rotationFactor;
  const rotate = useTransform(smoothedProgress, [0, 1], [0, rotateDistance]);
  const y = useTransform(smoothedProgress, [0, 1], parallaxRange);
  const x = useTransform(smoothedProgress, [0, 1], parallaxXRange);
  const orbitXKeyframes = [0, orbitOffsetX * orbitDirection, 0, -orbitOffsetX * orbitDirection, 0];
  const orbitYKeyframes = [orbitOffsetY * orbitDirection, 0, -orbitOffsetY * orbitDirection, 0, orbitOffsetY * orbitDirection];
  const axisRotateKeyframes = [axisTilt - axisWobble, axisTilt + axisWobble, axisTilt - axisWobble];

  return (
    <motion.div
      style={{ rotate, x, y, willChange: 'transform' }}
      className={`absolute ${className}`}
      data-space-obstacle={collisionId ? 'planet' : undefined}
      data-collision-id={collisionId}
      data-collision-scale={collisionScale}
    >
      <motion.div
        animate={shouldReduceMotion || orbitDuration <= 0 || !isPageVisible ? undefined : { x: orbitXKeyframes, y: orbitYKeyframes }}
        transition={
          shouldReduceMotion || orbitDuration <= 0 || !isPageVisible
            ? undefined
            : {
                duration: orbitDuration,
                delay: orbitDelay,
                repeat: Infinity,
                ease: 'linear',
              }
        }
        className="relative"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          animate={shouldReduceMotion || axisWobble <= 0 || !isPageVisible ? undefined : { rotate: axisRotateKeyframes }}
          transition={
            shouldReduceMotion || axisWobble <= 0 || !isPageVisible
              ? undefined
              : {
                  duration: axisWobbleDuration,
                  delay: orbitDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="relative"
          style={{ rotate: shouldReduceMotion || axisWobble > 0 ? undefined : `${axisTilt}deg`, willChange: 'transform' }}
        >
          {typeof ringTilt === 'number' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute h-[24%] w-[165%] rounded-full border border-[#ead7af]/30 bg-[linear-gradient(90deg,rgba(244,229,198,0.04),rgba(248,236,206,0.78),rgba(164,131,96,0.46),rgba(244,229,198,0.04))] shadow-[0_0_30px_rgba(236,211,163,0.1)]"
                style={{ transform: `rotate(${ringTilt}deg)` }}
              />
              <div
                className="absolute h-[11%] w-[112%] rounded-full bg-[#030305]/72"
                style={{ transform: `rotate(${ringTilt}deg)` }}
              />
            </div>
          ) : null}

          <div className={`relative ${sizeClassName} ${containerClassName} ${showSurfaceEffects ? 'shadow-[inset_-18px_-26px_40px_rgba(4,8,18,0.5),inset_10px_12px_24px_rgba(255,255,255,0.08),0_16px_48px_rgba(4,8,18,0.24)]' : ''}`}>
            <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${imageFitClassName}`} />
            {showFrame ? <div className="absolute inset-[2.5%] rounded-full border border-white/8" /> : null}
            {showSurfaceEffects ? <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_42%,rgba(255,255,255,0.08),rgba(255,255,255,0)_40%)] mix-blend-screen" /> : null}
            {showSurfaceEffects ? <div className={`absolute inset-0 ${highlightClassName}`} /> : null}
            {showSurfaceEffects ? <div className={`absolute inset-0 ${shadowClassName}`} /> : null}
          </div>

          {typeof ringTilt === 'number' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute h-[24%] w-[165%] rounded-full border-b border-[#f4e7c6]/55 border-l-transparent border-r-transparent border-t-transparent"
                style={{ transform: `rotate(${ringTilt}deg)` }}
              />
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}