import { fal } from "@fal-ai/client";

/** Configure and return the fal client. Throws if FAL_KEY is missing. */
export function getConfiguredFal() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  fal.config({ credentials: key });
  return fal;
}

/**
 * Build the fal input payload for a given model kind.
 * Image models take image_size + negative_prompt; video models take duration.
 */
export function buildFalInput(
  kind: "image" | "video",
  prompt: string,
  opts: { width?: number; height?: number; negativePrompt?: string; duration?: number } = {}
): Record<string, unknown> {
  if (kind === "image") {
    return {
      prompt,
      negative_prompt: opts.negativePrompt,
      image_size: { width: opts.width ?? 1024, height: opts.height ?? 1024 },
    };
  }
  return { prompt, duration: opts.duration ?? 5 };
}

/** Extract the output URL from a fal result/payload for image or video. */
export function extractOutputUrl(payload: unknown): string | null {
  const p = payload as { video?: { url?: string }; images?: Array<{ url?: string }> };
  return p?.video?.url ?? p?.images?.[0]?.url ?? null;
}
