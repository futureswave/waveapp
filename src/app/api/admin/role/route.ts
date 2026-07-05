import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { adminRoleSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let adminId: string;
  try {
    adminId = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = adminRoleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }
  const { userId, role } = parsed.data;

  // Guard: an admin cannot strip their own admin role (avoid lockout).
  if (userId === adminId && role !== "ADMIN") {
    return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
  }

  const updated = await prisma.user.updateMany({ where: { id: userId }, data: { role } });
  if (updated.count === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await logAdminAction(adminId, "ROLE_CHANGE", userId, { role });
  return NextResponse.json({ role });
}
