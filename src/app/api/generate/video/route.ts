import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredits, MODEL_CREDITS } from "@/lib/credits";

const VIDEO_MODELS: Record<string, { falId: string; label: string; credits: number }> = {
  "kling-2.1-5s": { falId: "fal-ai/kling-video/v2.1/standard/text-to-video", label: "Kling 2.1", credits: 20 },
  "veo-3.1-fast": { falId: "fal-ai/veo3/fast", label: "Veo 3.1 Fast", credits: 25 },
  "hailuo-02": { falId: "fal-ai/minimax/video-01", label: "Hailuo 02", credits: 28 },
  "sora-2": { falId: "fal-ai/sora", label: "Sora 2", credits: 40 },
  "seedance-1-pro": { falId: "fal-ai/bytedance/seedance-1-pro", label: "Seedance 1 Pro", credits: 60 },
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { modelId, prompt, duration = 5 } = await req.json();

  if (!modelId || !prompt) {
    return NextResponse.json({ error: "modelId and prompt required" }, { status: 400 });
  }

  const model = VIDEO_MODELS[modelId];
  if (!model) return NextResponse.json({ error: "Unknown model" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    await deductCredits(userId, modelId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Credit error" },
      { status: 402 }
    );
  }

  const generation = await prisma.generation.create({
    data: {
      userId,
      modelId,
      prompt,
      credits: MODEL_CREDITS[modelId] ?? model.credits,
      status: "PENDING",
      metadata: { duration },
    },
  });

  // Submit async job to fal.ai queue
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY });

  try {
    const { request_id } = await fal.queue.submit(model.falId, {
      input: { prompt, duration },
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/fal`,
    });

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "PROCESSING", metadata: { duration, falRequestId: request_id } },
    });

    return NextResponse.json({ generationId: generation.id, requestId: request_id });
  } catch (err) {
    await prisma.generation.update({ where: { id: generation.id }, data: { status: "FAILED" } });
    await prisma.user.update({ where: { id: userId }, data: { credits: { increment: model.credits } } });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    );
  }
}
