import { motion, useScroll, useTransform } from 'motion/react';

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Constellations() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  if (prefersReducedMotion || isMobile) {
    return null;
  }
  
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['20%', '-40%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
      {/* Constellation 1 */}
      <motion.svg style={{ y: y1 }} className="absolute top-[10%] left-[10%] w-64 h-64 text-white" viewBox="0 0 100 100">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          d="M10,20 L40,50 L30,80 L70,60 L90,10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.2" 
        />
        <circle cx="10" cy="20" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="40" cy="50" r="0.8" fill="currentColor" className="opacity-50" />
        <circle cx="30" cy="80" r="1.2" fill="currentColor" className="opacity-50" />
        <circle cx="70" cy="60" r="0.8" fill="currentColor" className="opacity-50" />
        <circle cx="90" cy="10" r="1.5" fill="currentColor" className="opacity-80" />
      </motion.svg>

      {/* Constellation 2 */}
      <motion.svg style={{ y: y2 }} className="absolute top-[45%] right-[5%] w-80 h-80 text-primary" viewBox="0 0 100 100">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
          d="M20,80 L50,60 L80,90 L70,30 L40,10" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.2" 
        />
        <circle cx="20" cy="80" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="50" cy="60" r="1.5" fill="currentColor" className="opacity-80" />
        <circle cx="80" cy="90" r="0.8" fill="currentColor" className="opacity-50" />
        <circle cx="70" cy="30" r="1.2" fill="currentColor" className="opacity-50" />
        <circle cx="40" cy="10" r="1" fill="currentColor" className="opacity-50" />
      </motion.svg>

      {/* Constellation 3 */}
      <motion.svg style={{ y: y3 }} className="absolute top-[75%] left-[20%] w-72 h-72 text-white" viewBox="0 0 100 100">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          d="M15,50 L45,20 L75,40 L60,80 L30,70 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.2" 
        />
        <circle cx="15" cy="50" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="45" cy="20" r="1.2" fill="currentColor" className="opacity-50" />
        <circle cx="75" cy="40" r="0.8" fill="currentColor" className="opacity-50" />
        <circle cx="60" cy="80" r="1.5" fill="currentColor" className="opacity-80" />
        <circle cx="30" cy="70" r="1" fill="currentColor" className="opacity-50" />
      </motion.svg>
    </div>
  );
}
