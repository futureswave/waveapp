import { prisma } from "./prisma";
import { deductCredits } from "./credits";
import { getConfiguredFal, buildFalInput } from "./fal";
import { getModel, type ModelDef } from "./models";

export type SubmitResult =
  | { ok: true; generationId: string; requestId: string }
  | { ok: false; status: number; error: string };

/** The fal webhook URL with our shared-secret token appended. */
function falWebhookUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const token = process.env.FAL_WEBHOOK_SECRET ?? "";
  return `${base}/api/webhooks/fal?token=${encodeURIComponent(token)}`;
}

/**
 * Deduct credits, create a PROCESSING generation, and submit an async job to
 * fal's queue. On any failure the credits are refunded and the record failed.
 * Result is delivered later via the fal webhook.
 */
export async function submitGeneration(
  userId: string,
  modelId: string,
  prompt: string,
  opts: { width?: number; height?: number; negativePrompt?: string; duration?: number } = {}
): Promise<SubmitResult> {
  const model: ModelDef | undefined = getModel(modelId);
  if (!model) return { ok: false, status: 400, error: "Unknown model" };

  try {
    await deductCredits(userId, modelId);
  } catch (err) {
    return {
      ok: false,
      status: 402,
      error: err instanceof Error ? err.message : "Credit error",
    };
  }

  const generation = await prisma.generation.create({
    data: {
      userId,
      modelId,
      prompt,
      credits: model.credits,
      status: "PROCESSING",
      metadata: model.kind === "video" ? { duration: opts.duration ?? 5 } : undefined,
    },
  });

  try {
    const fal = getConfiguredFal();
    const { request_id } = await fal.queue.submit(model.falId, {
      input: buildFalInput(model.kind, prompt, opts),
      webhookUrl: falWebhookUrl(),
    });

    await prisma.generation.update({
      where: { id: generation.id },
      data: { providerRequestId: request_id },
    });

    return { ok: true, generationId: generation.id, requestId: request_id };
  } catch (err) {
    // Submission failed: fail the record and refund exactly once.
    const failed = await prisma.generation.updateMany({
      where: { id: generation.id, status: "PROCESSING" },
      data: { status: "FAILED" },
    });
    if (failed.count > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: model.credits } },
      });
    }
    return {
      ok: false,
      status: 500,
      error: err instanceof Error ? err.message : "Submission failed",
    };
  }
}
