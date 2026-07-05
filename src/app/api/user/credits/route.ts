import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true, role: true },
  });

  if (!user) return NextResponse.json({ credits: 0, plan: "FREE", role: "USER" });
  return NextResponse.json({ credits: user.credits, plan: user.plan, role: user.role });
}
