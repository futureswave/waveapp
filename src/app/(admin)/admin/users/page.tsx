import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const query = q?.trim();

  const where: Prisma.UserWhereInput = query
    ? { OR: [{ email: { contains: query, mode: "insensitive" } }, { id: { contains: query } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, email: true, credits: true, plan: true, role: true, createdAt: true },
    }),
    prisma.user.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Users</h1>
        <span className="text-sm text-white/40">{total} kayıt</span>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Email veya ID ara..."
          className="w-full max-w-sm rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
        />
        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
          Ara
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="text-white hover:text-[var(--accent)]">
                    {u.email || u.id}
                  </Link>
                </td>
                <td className="px-4 py-3 tabular-nums text-white/70">{u.credits}</td>
                <td className="px-4 py-3 text-white/70">{u.plan}</td>
                <td className="px-4 py-3">
                  <span className={u.role === "ADMIN" ? "text-[var(--accent)]" : "text-white/50"}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/40">{u.createdAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/30">
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <PageLink q={query} page={page - 1} disabled={page <= 1} label="← Önceki" />
          <span className="text-white/40">
            {page} / {totalPages}
          </span>
          <PageLink q={query} page={page + 1} disabled={page >= totalPages} label="Sonraki →" />
        </div>
      )}
    </div>
  );
}

function PageLink({
  q,
  page,
  disabled,
  label,
}: {
  q?: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) return <span className="text-white/20">{label}</span>;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page));
  return (
    <Link href={`/admin/users?${params.toString()}`} className="text-white/60 hover:text-white">
      {label}
    </Link>
  );
}
