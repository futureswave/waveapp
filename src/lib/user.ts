import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Ensure the authenticated Clerk user has a DB row, creating it lazily if the
 * Clerk webhook never fired. Returns the user's id, or null if unauthenticated.
 */
export async function ensureUser(userId: string): Promise<string | null> {
  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (existing) return existing.id;

  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== userId) return null;

  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "";

  const user = await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email },
    update: {},
    select: { id: true },
  });
  return user.id;
}
