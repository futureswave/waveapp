import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractOutputUrl } from "@/lib/fal";

// fal webhooks are authenticated with a shared secret we embed in the webhook
// URL when submitting the job (see the generate routes). This avoids depending
// on fal's JWKS signature flow while still rejecting forged requests.
function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.FAL_WEBHOOK_SECRET;
  if (!expected) return false; // fail closed: refuse if not configured
  const token = new URL(req.url).searchParams.get("token");
  return token === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { request_id, status, payload } = body as {
    request_id: string;
    status: "OK" | "ERROR";
    payload?: unknown;
  };

  if (!request_id) return NextResponse.json({ ok: true });

  const generation = await prisma.generation.findUnique({
    where: { providerRequestId: request_id },
  });
  if (!generation) return NextResponse.json({ ok: true });

  if (status === "OK") {
    const outputUrl = extractOutputUrl(payload);
    // Idempotent transition: only act while still PROCESSING.
    await prisma.generation.updateMany({
      where: { id: generation.id, status: "PROCESSING" },
      data: { status: "DONE", outputUrl },
    });
    return NextResponse.json({ ok: true });
  }

  // status === "ERROR": mark failed and refund exactly once.
  const failed = await prisma.generation.updateMany({
    where: { id: generation.id, status: "PROCESSING" },
    data: { status: "FAILED" },
  });
  if (failed.count > 0) {
    await prisma.user.update({
      where: { id: generation.userId },
      data: { credits: { increment: generation.credits } },
    });
  }

  return NextResponse.json({ ok: true });
}
