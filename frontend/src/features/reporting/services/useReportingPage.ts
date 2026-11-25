import { useEffect, useState } from "react";
import type { PageQuery } from "./reportingService";

export function useReportingPage<Q extends PageQuery, T>(
  query: Q, loader: (query: Q, signal: AbortSignal) => Promise<T>,
) {
  const [result, setResult] = useState<{ query: Q; data?: T; error?: string }>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loader(query, controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ query, data });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ query, error: error instanceof TypeError
            ? "Could not connect to the reporting service. Check that the backend is running."
            : error instanceof Error ? error.message : "Could not load this page." });
        }
      },
    );
    return () => controller.abort();
  }, [query, loader, attempt]);

  const current = result?.query === query ? result : undefined;
  return {
    data: current?.data,
    error: current?.error,
    loading: !current,
    retry: () => { setResult(undefined); setAttempt((value) => value + 1); },
  };
}
