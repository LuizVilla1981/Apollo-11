import { motion } from 'motion/react';

import { usePageVisibility } from '../../hooks/usePageVisibility';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Nebulas() {
  const isPageVisible = usePageVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = isPageVisible && !prefersReducedMotion;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        animate={shouldAnimate ? { scale: [1, 1.03, 1], opacity: [0.12, 0.18, 0.12] } : undefined}
        transition={shouldAnimate ? { duration: 24, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="absolute top-[-10%] left-[-10%] h-[60vw] w-[60vw] rounded-full bg-[#0a1930] blur-[80px] md:blur-[110px]"
      />
      
      <motion.div 
        animate={shouldAnimate ? { scale: [1, 1.04, 1], opacity: [0.08, 0.14, 0.08] } : undefined}
        transition={shouldAnimate ? { duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 } : undefined}
        className="absolute top-[30%] right-[-20%] h-[70vw] w-[70vw] rounded-full bg-[#1a0b2e] blur-[90px] md:blur-[130px]"
      />
      
      <motion.div 
        animate={shouldAnimate ? { scale: [1, 1.03, 1], opacity: [0.04, 0.1, 0.04] } : undefined}
        transition={shouldAnimate ? { duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 10 } : undefined}
        className="absolute bottom-[10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#3d1c00] blur-[85px] md:blur-[115px]"
      />
    </div>
  );
}
