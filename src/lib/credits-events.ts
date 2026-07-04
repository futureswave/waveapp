"use client";

// Lightweight cross-component signal so the navbar credit badge refreshes
// after a generation spends credits, without a global state library.
export const CREDITS_REFRESH_EVENT = "wave:credits-refresh";

export function notifyCreditsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CREDITS_REFRESH_EVENT));
  }
}
