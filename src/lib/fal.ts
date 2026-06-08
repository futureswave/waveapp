import { fal } from "@fal-ai/client";

function getConfiguredFal() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  fal.config({ credentials: key });
  return fal;
}

export const IMAGE_MODELS = {
  "flux-kontext-max": {
    id: "fal-ai/flux-pro/kontext/max",
    label: "FLUX Kontext Max",
    credits: 5,
  },
  "imagen-4-fast": {
    id: "fal-ai/imagen4/preview/fast",
    label: "Imagen 4 Fast",
    credits: 3,
  },
  "ideogram-v3-turbo": {
    id: "fal-ai/ideogram/v3/turbo",
    label: "Ideogram v3 Turbo",
    credits: 4,
  },
} as const;

export type ImageModelKey = keyof typeof IMAGE_MODELS;

export async function generateImage(
  modelKey: ImageModelKey,
  prompt: string,
  options: { width?: number; height?: number; negativePrompt?: string } = {}
): Promise<string> {
  const client = getConfiguredFal();
  const model = IMAGE_MODELS[modelKey];
  const result = await client.run(model.id, {
    input: {
      prompt,
      negative_prompt: options.negativePrompt,
      image_size: {
        width: options.width ?? 1024,
        height: options.height ?? 1024,
      },
    },
  });
  const output = result as { images?: Array<{ url: string }> };
  const url = output.images?.[0]?.url;
  if (!url) throw new Error("No image returned from model");
  return url;
}
