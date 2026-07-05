import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { adminCreditsSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let adminId: string;
  try {
    adminId = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = adminCreditsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { userId, amount, reason } = parsed.data;

  // Atomic, and never let the balance go below zero on a revoke.
  const where =
    amount < 0
      ? { id: userId, credits: { gte: -amount } }
      : { id: userId };
  const updated = await prisma.user.updateMany({
    where,
    data: { credits: { increment: amount } },
  });
  if (updated.count === 0) {
    return NextResponse.json(
      { error: amount < 0 ? "Insufficient credits to revoke" : "User not found" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } });
  await logAdminAction(adminId, "CREDIT_ADJUST", userId, { amount, reason: reason ?? null, balance: user?.credits });

  return NextResponse.json({ credits: user?.credits });
}
