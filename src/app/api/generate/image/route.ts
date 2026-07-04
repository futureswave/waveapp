import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/user";
import { checkRateLimit } from "@/lib/ratelimit";
import { imageGenerateSchema } from "@/lib/validation";
import { submitGeneration } from "@/lib/generate";
import { isModelKind } from "@/lib/models";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await checkRateLimit(`img:${userId}`))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = imageGenerateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { modelId, prompt, negativePrompt, width, height } = parsed.data;

  if (!isModelKind(modelId, "image")) {
    return NextResponse.json({ error: "Unknown image model" }, { status: 400 });
  }

  if (!(await ensureUser(userId))) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await submitGeneration(userId, modelId, prompt, { negativePrompt, width, height });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ generationId: result.generationId, requestId: result.requestId });
}
