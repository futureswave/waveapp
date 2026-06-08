import { prisma } from "./prisma";

export const MODEL_CREDITS: Record<string, number> = {
  "imagen-4-fast": 3,
  "ideogram-v3-turbo": 4,
  "flux-kontext-max": 5,
  "flux-dev": 6,
  "kling-2.1-5s": 20,
  "veo-3.1-fast": 25,
  "hailuo-02": 28,
  "sora-2": 40,
  "seedance-1-pro": 60,
};

export async function deductCredits(userId: string, modelId: string): Promise<void> {
  const cost = MODEL_CREDITS[modelId];
  if (!cost) throw new Error(`Unknown model: ${modelId}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (tx: any) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits < cost) throw new Error("Insufficient credits");
    await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: cost } },
    });
  });
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });
}
