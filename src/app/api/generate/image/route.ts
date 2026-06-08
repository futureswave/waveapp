import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredits, MODEL_CREDITS } from "@/lib/credits";
import { generateImage, IMAGE_MODELS, type ImageModelKey } from "@/lib/fal";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { modelId, prompt, width, height, negativePrompt } = body as {
    modelId: ImageModelKey;
    prompt: string;
    width?: number;
    height?: number;
    negativePrompt?: string;
  };

  if (!modelId || !prompt) {
    return NextResponse.json({ error: "modelId and prompt are required" }, { status: 400 });
  }

  if (!IMAGE_MODELS[modelId]) {
    return NextResponse.json({ error: "Unknown model" }, { status: 400 });
  }

  // Ensure user exists in DB
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email: "", credits: 100 },
    update: {},
  });

  // Deduct credits (throws if insufficient)
  try {
    await deductCredits(userId, modelId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Credit error" },
      { status: 402 }
    );
  }

  // Create pending generation record
  const generation = await prisma.generation.create({
    data: {
      userId,
      modelId,
      prompt,
      credits: MODEL_CREDITS[modelId],
      status: "PROCESSING",
    },
  });

  try {
    const imageUrl = await generateImage(modelId, prompt, { width, height, negativePrompt });

    await prisma.generation.update({
      where: { id: generation.id },
      data: { outputUrl: imageUrl, status: "DONE" },
    });

    return NextResponse.json({ url: imageUrl, generationId: generation.id });
  } catch (err) {
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "FAILED" },
    });
    // Refund credits on failure
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: MODEL_CREDITS[modelId] } },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
