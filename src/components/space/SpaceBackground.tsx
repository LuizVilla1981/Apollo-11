import { Starfield } from './Starfield';
import { Nebulas } from './Nebulas';
import { Constellations } from './Constellations';

export function SpaceBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#030305] pointer-events-none [contain:strict]">
        <Nebulas />
        <Starfield />
      </div>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [contain:strict]">
        <Constellations />
      </div>
    </>
  );
}
