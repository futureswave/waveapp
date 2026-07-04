import { z } from "zod";

const ALLOWED_DIMENSIONS = [768, 896, 1024, 1152, 1344] as const;
const dimension = z.number().int().refine((n) => ALLOWED_DIMENSIONS.includes(n as never), {
  message: "Invalid dimension",
});

export const imageGenerateSchema = z.object({
  modelId: z.string().min(1),
  prompt: z.string().trim().min(1).max(2000),
  negativePrompt: z.string().trim().max(2000).optional(),
  width: dimension.optional(),
  height: dimension.optional(),
});

export const videoGenerateSchema = z.object({
  modelId: z.string().min(1),
  prompt: z.string().trim().min(1).max(2000),
  duration: z.number().int().min(1).max(20).optional(),
});

export const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro", "studio"]),
});
