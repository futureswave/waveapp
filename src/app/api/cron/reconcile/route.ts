import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getConfiguredFal, extractOutputUrl } from "@/lib/fal";
import { getModel } from "@/lib/models";

// Safety net for jobs whose fal webhook never arrived: poll fal for any
// generation stuck in PROCESSING for a while and resolve or fail+refund it.
const STUCK_AFTER_MS = 10 * 60 * 1000; // 10 minutes
const MAX_BATCH = 25;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>".
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - STUCK_AFTER_MS);
  const stuck = await prisma.generation.findMany({
    where: { status: "PROCESSING", createdAt: { lt: cutoff }, providerRequestId: { not: null } },
    take: MAX_BATCH,
  });

  const fal = getConfiguredFal();
  let resolved = 0;
  let failed = 0;

  for (const gen of stuck) {
    const model = getModel(gen.modelId);
    if (!model || !gen.providerRequestId) continue;

    try {
      const status = await fal.queue.status(model.falId, {
        requestId: gen.providerRequestId,
      });

      if (status.status === "COMPLETED") {
        const result = await fal.queue.result(model.falId, {
          requestId: gen.providerRequestId,
        });
        const outputUrl = extractOutputUrl(result.data ?? result);
        const done = await prisma.generation.updateMany({
          where: { id: gen.id, status: "PROCESSING" },
          data: { status: "DONE", outputUrl },
        });
        if (done.count > 0) resolved++;
      }
      // IN_QUEUE / IN_PROGRESS → leave for a later run.
    } catch {
      // fal reports the request as errored/gone → fail and refund once.
      const marked = await prisma.generation.updateMany({
        where: { id: gen.id, status: "PROCESSING" },
        data: { status: "FAILED" },
      });
      if (marked.count > 0) {
        await prisma.user.update({
          where: { id: gen.userId },
          data: { credits: { increment: gen.credits } },
        });
        failed++;
      }
    }
  }

  return NextResponse.json({ checked: stuck.length, resolved, failed });
}
