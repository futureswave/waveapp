// Single source of truth for every AI model in the app.
// Credits, provider fal ids, kind (image/video) and UI labels all derive from here.
// Adding or repricing a model = edit this file only.

export type ModelKind = "image" | "video";

export interface ModelDef {
  key: string;
  label: string;
  provider: string;
  falId: string;
  credits: number;
  kind: ModelKind;
}

export const MODELS = {
  // ---- Image ----
  "imagen-4-fast": {
    key: "imagen-4-fast",
    label: "Imagen 4 Fast",
    provider: "Google",
    falId: "fal-ai/imagen4/preview/fast",
    credits: 3,
    kind: "image",
  },
  "ideogram-v3-turbo": {
    key: "ideogram-v3-turbo",
    label: "Ideogram v3 Turbo",
    provider: "Ideogram",
    falId: "fal-ai/ideogram/v3/turbo",
    credits: 4,
    kind: "image",
  },
  "flux-kontext-max": {
    key: "flux-kontext-max",
    label: "FLUX Kontext Max",
    provider: "Black Forest Labs",
    falId: "fal-ai/flux-pro/kontext/max",
    credits: 5,
    kind: "image",
  },
  // ---- Video ----
  "kling-2.1-5s": {
    key: "kling-2.1-5s",
    label: "Kling 2.1",
    provider: "Kuaishou",
    falId: "fal-ai/kling-video/v2.1/standard/text-to-video",
    credits: 20,
    kind: "video",
  },
  "veo-3.1-fast": {
    key: "veo-3.1-fast",
    label: "Veo 3.1 Fast",
    provider: "Google",
    falId: "fal-ai/veo3/fast",
    credits: 25,
    kind: "video",
  },
  "hailuo-02": {
    key: "hailuo-02",
    label: "Hailuo 02",
    provider: "MiniMax",
    falId: "fal-ai/minimax/video-01",
    credits: 28,
    kind: "video",
  },
  "sora-2": {
    key: "sora-2",
    label: "Sora 2",
    provider: "OpenAI",
    falId: "fal-ai/sora",
    credits: 40,
    kind: "video",
  },
  "seedance-1-pro": {
    key: "seedance-1-pro",
    label: "Seedance 1 Pro",
    provider: "ByteDance",
    falId: "fal-ai/bytedance/seedance-1-pro",
    credits: 60,
    kind: "video",
  },
} as const satisfies Record<string, ModelDef>;

export type ModelKey = keyof typeof MODELS;

const ALL_MODELS: ModelDef[] = Object.values(MODELS);

export const IMAGE_MODELS = ALL_MODELS.filter((m) => m.kind === "image");
export const VIDEO_MODELS = ALL_MODELS.filter((m) => m.kind === "video");

export function getModel(key: string): ModelDef | undefined {
  return (MODELS as Record<string, ModelDef>)[key];
}

export function isModelKind(key: string, kind: ModelKind): boolean {
  return getModel(key)?.kind === kind;
}
