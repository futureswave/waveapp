"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { notifyCreditsChanged } from "@/lib/credits-events";

export type JobStatus = "idle" | "submitting" | "processing" | "done" | "failed";

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_MS = 5 * 60 * 1000; // give up after 5 minutes

/**
 * Submits an async generation and polls /api/generate/status until it finishes,
 * times out, or errors. Cleans up its interval on unmount and between runs.
 */
export function useGenerationJob() {
  const [status, setStatus] = useState<JobStatus>("idle");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const poll = useCallback(
    (id: string) => {
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(async () => {
        if (Date.now() - startedAtRef.current > MAX_POLL_MS) {
          clear();
          setError("Timed out. Check your Library later — it may still finish.");
          setStatus("failed");
          return;
        }
        try {
          const res = await fetch(`/api/generate/status/${id}`);
          const data = await res.json();
          if (data.status === "DONE") {
            clear();
            setOutputUrl(data.outputUrl);
            setStatus("done");
          } else if (data.status === "FAILED") {
            clear();
            setError("Generation failed.");
            setStatus("failed");
            notifyCreditsChanged(); // credits were refunded
          }
        } catch {
          // transient network error — keep polling until timeout
        }
      }, POLL_INTERVAL_MS);
    },
    [clear]
  );

  /** endpoint e.g. "/api/generate/image"; body is the JSON payload. */
  const start = useCallback(
    async (endpoint: string, body: unknown) => {
      clear();
      setStatus("submitting");
      setError(null);
      setOutputUrl(null);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Request failed");
        notifyCreditsChanged(); // credits were spent on submit
        setStatus("processing");
        poll(data.generationId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submission failed");
        setStatus("failed");
      }
    },
    [clear, poll]
  );

  return { status, outputUrl, error, start };
}
