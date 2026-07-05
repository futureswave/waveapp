import { auth, currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { ensureUser } from "./user";

/** Emails granted ADMIN on first authenticated visit (comma-separated env). */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve the current user's admin status. If their email is in ADMIN_EMAILS
 * and their DB row is not yet ADMIN, promote it (self-heal on first visit).
 * Returns the admin's userId, or null if not authenticated / not an admin.
 */
export async function getAdminUserId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  await ensureUser(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  if (!user) return null;

  if (user.role === "ADMIN") return userId;

  // Promote allow-listed emails the first time they show up.
  if (user.email && adminEmails().includes(user.email.toLowerCase())) {
    await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
    return userId;
  }

  // Fall back to the live Clerk email in case the DB email is stale.
  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress;
  if (email && adminEmails().includes(email.toLowerCase())) {
    await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
    return userId;
  }

  return null;
}

/** Throws if the caller is not an admin; returns the admin's userId otherwise. */
export async function requireAdmin(): Promise<string> {
  const adminId = await getAdminUserId();
  if (!adminId) throw new Error("Forbidden");
  return adminId;
}

export type AdminAction = "CREDIT_ADJUST" | "PLAN_CHANGE" | "ROLE_CHANGE";

/** Append an entry to the admin audit trail. Best-effort; never throws. */
export async function logAdminAction(
  adminId: string,
  action: AdminAction,
  targetId: string,
  detail?: Prisma.InputJsonValue
): Promise<void> {
  try {
    await prisma.adminActionLog.create({
      data: { adminId, action, targetId, detail },
    });
  } catch (err) {
    console.error("Failed to write admin audit log", err);
  }
}
