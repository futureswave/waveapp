import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ credits: 0, plan: "FREE" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true },
  });

  if (!user) return NextResponse.json({ credits: 0, plan: "FREE" });
  return NextResponse.json({ credits: user.credits, plan: user.plan });
}
