import { describe, it, expect } from "vitest";
import { getModel, isModelKind, IMAGE_MODELS, VIDEO_MODELS, MODELS } from "../models";
import { modelCredits } from "../credits";
import { extractOutputUrl, buildFalInput } from "../fal";
import { getMotionPreset, motionPromptPrefix } from "../motion";
import { imageGenerateSchema, videoGenerateSchema, checkoutSchema } from "../validation";

describe("model registry", () => {
  it("resolves known models and rejects unknown", () => {
    expect(getModel("sora-2")?.kind).toBe("video");
    expect(getModel("imagen-4-fast")?.kind).toBe("image");
    expect(getModel("nope")).toBeUndefined();
  });

  it("isModelKind guards image vs video", () => {
    expect(isModelKind("flux-kontext-max", "image")).toBe(true);
    expect(isModelKind("flux-kontext-max", "video")).toBe(false);
    expect(isModelKind("kling-2.1-5s", "video")).toBe(true);
  });

  it("splits models by kind with no overlap", () => {
    expect(IMAGE_MODELS.every((m) => m.kind === "image")).toBe(true);
    expect(VIDEO_MODELS.every((m) => m.kind === "video")).toBe(true);
    expect(IMAGE_MODELS.length + VIDEO_MODELS.length).toBe(Object.keys(MODELS).length);
  });

  it("credits derive from the registry (single source of truth)", () => {
    expect(modelCredits("sora-2")).toBe(getModel("sora-2")!.credits);
    expect(modelCredits("nope")).toBeUndefined();
  });
});

describe("fal helpers", () => {
  it("extracts output url from video or image payloads", () => {
    expect(extractOutputUrl({ video: { url: "v" } })).toBe("v");
    expect(extractOutputUrl({ images: [{ url: "i" }] })).toBe("i");
    expect(extractOutputUrl({})).toBeNull();
    expect(extractOutputUrl(null)).toBeNull();
  });

  it("builds kind-specific input", () => {
    const img = buildFalInput("image", "cat", { width: 768, height: 1344 });
    expect(img.image_size).toEqual({ width: 768, height: 1344 });
    const vid = buildFalInput("video", "cat", { duration: 8 });
    expect(vid.duration).toBe(8);
  });
});

describe("motion presets", () => {
  it("finds preset and builds a prompt prefix", () => {
    const preset = getMotionPreset("dolly-zoom");
    expect(preset?.label).toBe("Dolly Zoom");
    expect(motionPromptPrefix(preset!)).toContain("Dolly Zoom");
    expect(getMotionPreset(null)).toBeUndefined();
  });
});

describe("validation schemas", () => {
  it("accepts valid image request and rejects bad dimension/empty prompt", () => {
    expect(imageGenerateSchema.safeParse({ modelId: "imagen-4-fast", prompt: "hi", width: 1024 }).success).toBe(true);
    expect(imageGenerateSchema.safeParse({ modelId: "imagen-4-fast", prompt: "hi", width: 999 }).success).toBe(false);
    expect(imageGenerateSchema.safeParse({ modelId: "imagen-4-fast", prompt: "" }).success).toBe(false);
  });

  it("bounds video duration and requires prompt", () => {
    expect(videoGenerateSchema.safeParse({ modelId: "sora-2", prompt: "hi", duration: 5 }).success).toBe(true);
    expect(videoGenerateSchema.safeParse({ modelId: "sora-2", prompt: "hi", duration: 99 }).success).toBe(false);
  });

  it("restricts checkout plans", () => {
    expect(checkoutSchema.safeParse({ plan: "pro" }).success).toBe(true);
    expect(checkoutSchema.safeParse({ plan: "enterprise" }).success).toBe(false);
  });
});
