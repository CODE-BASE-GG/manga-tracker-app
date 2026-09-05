import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllSeries } from '../api/seriesApi';
import type { Series, SeriesStatus } from '../types';

interface UseSeriesResult {
  series: Series[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSeries(
  status?: SeriesStatus,
): UseSeriesResult {
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const currentRequestId = ++requestId.current;

    try {
      const data = await getAllSeries(status);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setSeries(data);
      setError(null);
    } catch (err) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load series',
      );
    }
  }, [status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    void refetch().finally(() => {
      setIsLoading(false);
    });
  }, [refetch]);

  return {
    series,
    isLoading,
    error,
    refetch,
  };
}