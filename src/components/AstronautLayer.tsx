import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react';

const STUCK_COLLISION_THRESHOLD = 4;
const STUCK_COLLISION_WINDOW_MS = 1400;

type CollisionBurstState = {
  count: number;
  lastAt: number;
};

export function AstronautLayer() {
  const shouldReduceMotion = useReducedMotion();
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [bounds, setBounds] = useState({ x: 0, y: 0, size: 96 });
  const astronautRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const scale = useMotionValue(1);
  const velocityRef = useRef({ x: 0.13, y: 0.1, rotation: 0.05 });
  const travelSpeedRef = useRef(Math.hypot(0.13, 0.1));
  const phaseRef = useRef(0);
  const lastObstacleHitRef = useRef<{ id: string; at: number } | null>(null);
  const collisionBurstRef = useRef<CollisionBurstState>({ count: 0, lastAt: 0 });

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const update = () => setIsLargeDesktop(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const updateBounds = () => {
      const size = window.innerWidth >= 1280 ? 160 : 144;
      setBounds({
        size,
        x: Math.max(window.innerWidth - size, 0),
        y: Math.max(window.innerHeight - size, 0),
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    const nextVelocity = {
      x: shouldReduceMotion ? 0.05994 : isLargeDesktop ? 0.10449 : 0.08991,
      y: shouldReduceMotion ? 0.04455 : isLargeDesktop ? 0.08262 : 0.07128,
      rotation: shouldReduceMotion ? 0.025 : isLargeDesktop ? 0.06 : 0.05,
    };

    x.set(Math.min(x.get() || bounds.x * 0.15, bounds.x));
    y.set(Math.min(y.get() || bounds.y * 0.2, bounds.y));
    velocityRef.current = nextVelocity;
    travelSpeedRef.current = Math.hypot(nextVelocity.x, nextVelocity.y);
  }, [bounds.x, bounds.y, isLargeDesktop, shouldReduceMotion, x, y]);

  useAnimationFrame((time, delta) => {
    if (shouldReduceMotion) return;

    const velocity = velocityRef.current;
    const minSpeed = shouldReduceMotion ? 0.08 : isLargeDesktop ? 0.15 : 0.125;
    const constantSpeed = Math.max(travelSpeedRef.current, minSpeed);
    const reflectVelocity = (normalX: number, normalY: number) => {
      const dot = velocity.x * normalX + velocity.y * normalY;
      let reflectedX = velocity.x - 2 * dot * normalX;
      let reflectedY = velocity.y - 2 * dot * normalY;

      if (dot >= 0 || Math.hypot(reflectedX, reflectedY) < 0.001) {
        reflectedX = normalX;
        reflectedY = normalY;
      }

      const reflectedMagnitude = Math.hypot(reflectedX, reflectedY) || 1;
      velocity.x = (reflectedX / reflectedMagnitude) * constantSpeed;
      velocity.y = (reflectedY / reflectedMagnitude) * constantSpeed;
    };

    const triggerEscape = (normalX: number, normalY: number, currentX: number, currentY: number) => {
      const toCenterX = bounds.x * 0.5 - currentX;
      const toCenterY = bounds.y * 0.5 - currentY;
      const toCenterMagnitude = Math.hypot(toCenterX, toCenterY) || 1;
      const steerX = toCenterX / toCenterMagnitude;
      const steerY = toCenterY / toCenterMagnitude;
      const escapeX = normalX * 0.72 + steerX * 0.28;
      const escapeY = normalY * 0.72 + steerY * 0.28;
      const escapeMagnitude = Math.hypot(escapeX, escapeY) || 1;

      velocity.x = (escapeX / escapeMagnitude) * constantSpeed;
      velocity.y = (escapeY / escapeMagnitude) * constantSpeed;
      velocity.rotation = -velocity.rotation * 0.72 + (normalX - normalY) * 0.08;
      collisionBurstRef.current = { count: 0, lastAt: time };
    };

    const registerCollision = (normalX: number, normalY: number, currentX: number, currentY: number) => {
      const burst = collisionBurstRef.current;
      burst.count = time - burst.lastAt <= STUCK_COLLISION_WINDOW_MS ? burst.count + 1 : 1;
      burst.lastAt = time;

      if (burst.count > STUCK_COLLISION_THRESHOLD) {
        triggerEscape(normalX, normalY, currentX, currentY);
      }
    };

    let nextX = x.get() + velocity.x * delta;
    let nextY = y.get() + velocity.y * delta;
    let nextRotation = rotate.get() + velocity.rotation * delta;
    let bounced = false;

    if (nextX <= 0 || nextX >= bounds.x) {
      const normalX = nextX <= 0 ? 1 : -1;
      nextX = nextX <= 0 ? 0 : bounds.x;
      reflectVelocity(normalX, 0);
      velocity.rotation = -velocity.rotation * 0.92 + velocity.x * 0.12;
      registerCollision(normalX, 0, nextX, nextY);
      bounced = true;
    }

    if (nextY <= 0 || nextY >= bounds.y) {
      const normalY = nextY <= 0 ? 1 : -1;
      nextY = nextY <= 0 ? 0 : bounds.y;
      reflectVelocity(0, normalY);
      velocity.rotation = -velocity.rotation * 0.9 + velocity.y * 0.14;
      registerCollision(0, normalY, nextX, nextY);
      bounced = true;
    }

    const astronautElement = astronautRef.current;
    if (astronautElement) {
      const astronautRect = astronautElement.getBoundingClientRect();
      const astronautCenterX = astronautRect.left + astronautRect.width / 2;
      const astronautCenterY = astronautRect.top + astronautRect.height / 2;
      const astronautRadius = Math.min(astronautRect.width, astronautRect.height) * 0.34;
      const obstacles = document.querySelectorAll<HTMLElement>('[data-space-obstacle]');

      obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (obstacleRect.width === 0 || obstacleRect.height === 0) return;

        const obstacleType = obstacle.dataset.spaceObstacle ?? 'planet';
        const obstacleScale = Number(obstacle.dataset.collisionScale ?? (obstacleType === 'rocket' ? '0.26' : '0.42'));
        const obstacleRadius = Math.min(obstacleRect.width, obstacleRect.height) * obstacleScale;
        const obstacleCenterX = obstacleRect.left + obstacleRect.width / 2;
        const obstacleCenterY = obstacleRect.top + obstacleRect.height / 2;
        const deltaX = astronautCenterX - obstacleCenterX;
        const deltaY = astronautCenterY - obstacleCenterY;
        const distance = Math.hypot(deltaX, deltaY) || 0.001;
        const overlap = astronautRadius + obstacleRadius - distance;
        const obstacleId = obstacle.dataset.collisionId ?? 'planet';
        const lastHit = lastObstacleHitRef.current;

        if (overlap <= 0) return;
        if (lastHit && lastHit.id === obstacleId && time - lastHit.at < 120) return;

        const normalX = deltaX / distance;
        const normalY = deltaY / distance;
        const pushBack = overlap + (obstacleType === 'rocket' ? 10 : 6);

        nextX += normalX * pushBack;
        nextY += normalY * pushBack;

        reflectVelocity(normalX, normalY);

        velocity.rotation = -velocity.rotation * 0.88 + (normalX + normalY) * 0.03;
        lastObstacleHitRef.current = { id: obstacleId, at: time };
        registerCollision(normalX, normalY, nextX, nextY);
        bounced = true;
      });
    }

    phaseRef.current += delta * 0.0014;
    driftX.set(Math.sin(phaseRef.current * 1.7) * 6);
    driftY.set(Math.cos(phaseRef.current * 1.25) * 8);
    scale.set(1 + Math.sin(phaseRef.current * 2.1) * 0.02);

    if (bounced) {
      nextRotation += velocity.rotation * delta * 0.6;
    }

    x.set(nextX);
    y.set(nextY);
    rotate.set(nextRotation);
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 opacity-[0.42] sm:opacity-[0.46] md:opacity-[0.50] lg:opacity-[0.56]"
        style={{ x, y, willChange: 'transform' }}
      >
        <motion.div
          className="relative"
          style={{ willChange: 'transform' }}
        >
          <motion.div
            className="relative h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36 xl:h-40 xl:w-40"
            ref={astronautRef}
            style={{ rotate, x: driftX, y: driftY, scale, willChange: 'transform' }}
          >
            <div className="absolute left-[6%] top-[50%] h-px w-8 sm:w-10 lg:w-14 bg-gradient-to-l from-white/16 to-transparent" />
            <div className="absolute left-[10%] top-[50%] h-2 w-5 sm:w-6 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),rgba(255,255,255,0.02)_60%,rgba(255,255,255,0)_80%)] blur-[2px]" />
            <img
              src="/space/astronauta.webp"
              alt="Astronauta perdido no espaco"
              className="h-full w-full object-contain select-none drop-shadow-[0_18px_36px_rgba(4,8,18,0.18)]"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}