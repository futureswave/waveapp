import { prisma } from "./prisma";
import { getModel } from "./models";

/** Credit cost for a model, or undefined if the model is unknown. */
export function modelCredits(modelId: string): number | undefined {
  return getModel(modelId)?.credits;
}

export async function deductCredits(userId: string, modelId: string): Promise<void> {
  const cost = modelCredits(modelId);
  if (!cost) throw new Error(`Unknown model: ${modelId}`);

  const updated = await prisma.user.updateMany({
    where: { id: userId, credits: { gte: cost } },
    data: { credits: { decrement: cost } },
  });
  if (updated.count === 0) throw new Error("Insufficient credits");
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });
}
