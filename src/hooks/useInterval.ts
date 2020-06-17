import { useEffect, useState } from 'react';

export function useInterval(
  callback: () => void,
  intervalMs: number,
  enabled: boolean
): void {
  const [intervalId, setIntervalId] = useState<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (enabled) {
      if (!intervalId) {
        // start an interval
        setIntervalId(setInterval(callback, intervalMs));
      }
    } else if (intervalId) {
      clearTimeout(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [enabled, intervalId]);
}
