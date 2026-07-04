"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Refreshes the server-rendered Library while any generation is still
// processing, so results appear without a manual reload.
export function LibraryAutoRefresh({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(t);
  }, [router, intervalMs]);
  return null;
}
