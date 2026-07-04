import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getModel } from "@/lib/models";
import { LibraryAutoRefresh } from "@/components/library-auto-refresh";

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const generations = await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const hasProcessing = generations.some((g) => g.status === "PROCESSING" || g.status === "PENDING");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {hasProcessing && <LibraryAutoRefresh />}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Library</h1>
        <p className="mt-2 text-white/40">Your generation history</p>
      </div>

      {generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-24 text-center">
          <p className="text-white/30">No generations yet.</p>
          <p className="mt-1 text-sm text-white/20">
            Create your first image or video to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generations.map((g) => {
            const isVideo = getModel(g.modelId)?.kind === "video";
            return (
              <div key={g.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {g.outputUrl ? (
                  isVideo ? (
                    <video src={g.outputUrl} className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image src={g.outputUrl} alt={g.prompt} fill className="object-cover" unoptimized />
                    </div>
                  )
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-white/5">
                    <span className="text-sm text-white/20">
                      {g.status === "PROCESSING" || g.status === "PENDING" ? "Processing..." : g.status}
                    </span>
                  </div>
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{g.prompt}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-white/30">{g.modelId}</span>
                    <span className="text-xs text-white/30">{g.credits} cr</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
