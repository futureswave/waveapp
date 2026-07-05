import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getModel } from "@/lib/models";
import type { Prisma, Status } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 40;
const STATUSES: (Status | "ALL")[] = ["ALL", "PENDING", "PROCESSING", "DONE", "FAILED"];

export default async function AdminGenerationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const active = STATUSES.includes(status as Status) ? (status as Status) : "ALL";

  const where: Prisma.GenerationWhereInput = active === "ALL" ? {} : { status: active as Status };

  const [items, total] = await Promise.all([
    prisma.generation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, userId: true, modelId: true, prompt: true, status: true, credits: true, createdAt: true },
    }),
    prisma.generation.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Generations</h1>
        <span className="text-sm text-white/40">{total} kayıt</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/generations" : `/admin/generations?status=${s}`}
            className={`rounded-md border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors ${
              active === s
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Prompt</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Cr</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {items.map((g) => (
              <tr key={g.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white/70">{getModel(g.modelId)?.label ?? g.modelId}</td>
                <td className="max-w-xs truncate px-4 py-3 text-white/60">{g.prompt}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${g.userId}`} className="font-mono text-xs text-white/40 hover:text-[var(--accent)]">
                    {g.userId.slice(0, 12)}…
                  </Link>
                </td>
                <td className="px-4 py-3 tabular-nums text-white/50">{g.credits}</td>
                <td className="px-4 py-3">
                  <StatusTag status={g.status} />
                </td>
                <td className="px-4 py-3 text-white/40">{g.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-white/30">
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/generations?${active !== "ALL" ? `status=${active}&` : ""}page=${page - 1}`}
              className="text-white/60 hover:text-white"
            >
              ← Önceki
            </Link>
          ) : (
            <span className="text-white/20">← Önceki</span>
          )}
          <span className="text-white/40">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/generations?${active !== "ALL" ? `status=${active}&` : ""}page=${page + 1}`}
              className="text-white/60 hover:text-white"
            >
              Sonraki →
            </Link>
          ) : (
            <span className="text-white/20">Sonraki →</span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  const cls =
    status === "FAILED"
      ? "text-red-400"
      : status === "DONE"
      ? "text-white/50"
      : "text-[var(--accent)]";
  return <span className={`text-xs font-medium ${cls}`}>{status}</span>;
}
