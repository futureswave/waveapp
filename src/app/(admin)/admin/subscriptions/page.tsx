import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true } } },
  });
  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Subscriptions</h1>
        <span className="text-sm text-white/40">{subs.length} kayıt</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Dönem sonu</th>
              <th className="px-4 py-3 font-medium">Stripe sub</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => {
              const activeSub = s.currentPeriodEnd >= now;
              return (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${s.userId}`} className="text-white hover:text-[var(--accent)]">
                      {s.user.email || s.userId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/70">{s.plan}</td>
                  <td className="px-4 py-3">
                    <span className={activeSub ? "text-[var(--accent)]" : "text-white/40"}>
                      {activeSub ? "Aktif" : "Süresi dolmuş"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{s.currentPeriodEnd.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-white/40">{s.stripeSubId}</td>
                </tr>
              );
            })}
            {subs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/30">
                  Abonelik yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
