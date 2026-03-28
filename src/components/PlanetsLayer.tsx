import { Planet3D } from './Planet3D';

export function PlanetsLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <Planet3D
        src="/space/terra.webp"
        alt="Terra"
        className="top-[9%] right-[4%] sm:right-[-1%] md:right-[4%] lg:right-[7%] opacity-[0.62] sm:opacity-[0.68] md:opacity-[0.8]"
        sizeClassName="h-24 w-24 sm:h-36 sm:w-36 md:h-52 md:w-52 lg:h-64 lg:w-64"
        rotationFactor={1}
        parallaxRange={[-12, 30]}
        parallaxXRange={[0, -18]}
        imageFitClassName="object-contain"
        containerClassName="overflow-visible"
        showFrame={false}
        showSurfaceEffects={false}
        orbitOffsetX={7}
        orbitOffsetY={4}
        orbitDuration={40}
        orbitDirection={1}
        axisTilt={-3}
        axisWobble={1.8}
        axisWobbleDuration={12}
        collisionId="earth"
        collisionScale={0.44}
      />

      <Planet3D
        src="/space/marte.webp"
        alt="Marte"
        className="top-[28%] left-[4%] sm:left-[-3%] md:left-[1%] lg:left-[4%] opacity-[0.42] sm:opacity-[0.48] md:opacity-[0.66]"
        sizeClassName="h-24 w-24 sm:h-28 sm:w-28 md:h-40 md:w-40 lg:h-48 lg:w-48"
        rotationFactor={1.2}
        parallaxRange={[-6, 24]}
        parallaxXRange={[0, 14]}
        imageFitClassName="object-contain"
        containerClassName="overflow-visible"
        showFrame={false}
        showSurfaceEffects={false}
        orbitOffsetX={6}
        orbitOffsetY={5}
        orbitDuration={24}
        orbitDelay={3}
        orbitDirection={-1}
        axisTilt={4}
        axisWobble={2.6}
        axisWobbleDuration={10}
        collisionId="mars"
        collisionScale={0.42}
        highlightClassName="bg-[radial-gradient(circle_at_30%_28%,rgba(255,234,210,0.28),rgba(255,186,138,0.12)_30%,rgba(255,255,255,0)_56%)]"
      />

      <Planet3D
        src="/space/jupiter.webp"
        alt="Jupiter"
        className="top-[50%] right-[1%] sm:top-[56%] sm:right-[-8%] md:top-[58%] md:right-[-16%] lg:right-[-5%] xl:right-[1%] opacity-[0.34] sm:opacity-[0.4] md:opacity-[0.44] lg:opacity-[0.58]"
        sizeClassName="h-36 w-36 sm:h-44 sm:w-44 md:h-64 md:w-64 lg:h-[20rem] lg:w-[20rem] xl:h-[22rem] xl:w-[22rem]"
        rotationFactor={0.6}
        parallaxRange={[-18, 34]}
        parallaxXRange={[0, -12]}
        imageFitClassName="object-contain"
        containerClassName="overflow-visible"
        showFrame={false}
        showSurfaceEffects={false}
        orbitOffsetX={8}
        orbitOffsetY={4}
        orbitDuration={52}
        orbitDelay={5}
        orbitDirection={1}
        axisTilt={-2}
        axisWobble={1.2}
        axisWobbleDuration={16}
        collisionId="jupiter"
        collisionScale={0.46}
        highlightClassName="bg-[radial-gradient(circle_at_30%_28%,rgba(255,241,220,0.26),rgba(255,208,164,0.12)_32%,rgba(255,255,255,0)_56%)]"
      />

      <Planet3D
        src="/space/saturno.webp"
        alt="Saturno"
        className="top-[70%] left-[22%] sm:top-[64%] sm:left-[5%] md:top-[60%] md:left-[10%] lg:top-[57%] lg:left-[12%] opacity-[0.24] sm:opacity-[0.4] md:opacity-[0.58]"
        sizeClassName="h-28 w-40 sm:h-36 sm:w-52 md:h-52 md:w-72 lg:h-72 lg:w-[26rem] xl:h-80 xl:w-[30rem]"
        rotationFactor={0.7}
        parallaxRange={[-10, 18]}
        parallaxXRange={[0, 12]}
        imageFitClassName="object-contain"
        containerClassName="overflow-visible"
        showFrame={false}
        showSurfaceEffects={false}
        orbitOffsetX={7}
        orbitOffsetY={3}
        orbitDuration={46}
        orbitDelay={2}
        orbitDirection={-1}
        axisTilt={2}
        axisWobble={1.4}
        axisWobbleDuration={14}
        collisionId="saturn"
        collisionScale={0.28}
        highlightClassName="bg-[radial-gradient(circle_at_30%_28%,rgba(255,243,216,0.24),rgba(255,219,166,0.1)_34%,rgba(255,255,255,0)_56%)]"
        shadowClassName="bg-[radial-gradient(circle_at_70%_72%,rgba(3,3,5,0)_24%,rgba(3,3,5,0.1)_56%,rgba(3,3,5,0.4)_100%)]"
      />
    </div>
  );
}