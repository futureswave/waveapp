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

// ---- Admin ----
export const adminCreditsSchema = z.object({
  userId: z.string().min(1),
  // Positive to grant, negative to revoke. Bounded to avoid fat-finger mistakes.
  amount: z.number().int().refine((n) => n !== 0 && Math.abs(n) <= 1_000_000, {
    message: "Amount must be non-zero and within ±1,000,000",
  }),
  reason: z.string().trim().max(500).optional(),
});

export const adminPlanSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(["FREE", "STARTER", "PRO", "STUDIO"]),
});

export const adminRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]),
});
