import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { adminPlanSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let adminId: string;
  try {
    adminId = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = adminPlanSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { userId, plan } = parsed.data;

  const updated = await prisma.user.updateMany({ where: { id: userId }, data: { plan } });
  if (updated.count === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await logAdminAction(adminId, "PLAN_CHANGE", userId, { plan });
  return NextResponse.json({ plan });
}
