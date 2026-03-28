import { useCallback, useRef, useState } from 'react';

export function useCooldown(cooldownMs = 10_000) {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trigger = useCallback(() => {
    setRemaining(Math.ceil(cooldownMs / 1000));

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [cooldownMs]);

  return { isCooling: remaining > 0, remaining, trigger };
}
