import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { request_id, status, payload } = body as {
    request_id: string;
    status: "OK" | "ERROR";
    payload?: { video?: { url: string }; images?: Array<{ url: string }> };
  };

  if (!request_id) return NextResponse.json({ ok: true });

  const generation = await prisma.generation.findFirst({
    where: { metadata: { path: ["falRequestId"], equals: request_id } },
  });

  if (!generation) return NextResponse.json({ ok: true });

  if (status === "OK") {
    const outputUrl = payload?.video?.url ?? payload?.images?.[0]?.url ?? null;
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "DONE", outputUrl },
    });
  } else {
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "FAILED" },
    });
    // Refund credits
    await prisma.user.update({
      where: { id: generation.userId },
      data: { credits: { increment: generation.credits } },
    });
  }

  return NextResponse.json({ ok: true });
}
