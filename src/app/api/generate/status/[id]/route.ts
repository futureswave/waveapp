import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const generation = await prisma.generation.findFirst({
    where: { id, userId },
    select: { id: true, status: true, outputUrl: true, modelId: true, createdAt: true },
  });

  if (!generation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(generation);
}
