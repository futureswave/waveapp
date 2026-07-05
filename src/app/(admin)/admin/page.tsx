import { prisma } from "@/lib/prisma";
import { PLAN_MONTHLY_PRICE } from "@/lib/stripe";
import { StatCard, BarRow } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers24h,
    planGroups,
    activeSubs,
    subPlanGroups,
    totalGenerations,
    gens24h,
    statusGroups,
    creditsAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since24h } } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.subscription.count({ where: { currentPeriodEnd: { gte: new Date() } } }),
    prisma.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.generation.count(),
    prisma.generation.count({ where: { createdAt: { gte: since24h } } }),
    prisma.generation.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.generation.aggregate({ _sum: { credits: true }, where: { status: "DONE" } }),
  ]);

  // Estimated MRR from active subscriptions.
  const mrr = subPlanGroups.reduce(
    (sum, g) => sum + (PLAN_MONTHLY_PRICE[g.plan] ?? 0) * g._count._all,
    0
  );

  const planCounts = Object.fromEntries(planGroups.map((g) => [g.plan, g._count._all]));
  const maxPlan = Math.max(1, ...planGroups.map((g) => g._count._all));

  const statusCounts = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all]));
  const failed = statusCounts["FAILED"] ?? 0;
  const done = statusCounts["DONE"] ?? 0;
  const failRate = done + failed > 0 ? Math.round((failed / (done + failed)) * 100) : 0;

  const genLast7 = await prisma.generation.findMany({
    where: { createdAt: { gte: since7d } },
    select: { createdAt: true },
  });
  const perDay = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    perDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const g of genLast7) {
    const key = g.createdAt.toISOString().slice(0, 10);
    if (perDay.has(key)) perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const maxDay = Math.max(1, ...perDay.values());

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} sub={`+${newUsers24h} son 24s`} />
        <StatCard label="Active subs" value={activeSubs} />
        <StatCard label="Est. MRR" value={`$${mrr.toLocaleString()}`} sub="aktif aboneliklerden" />
        <StatCard label="Generations" value={totalGenerations} sub={`+${gens24h} son 24s`} />
        <StatCard label="Credits spent" value={(creditsAgg._sum.credits ?? 0).toLocaleString()} sub="tamamlanan işler" />
        <StatCard label="Failed" value={failed} sub={`%${failRate} hata oranı`} />
        <StatCard label="Processing" value={statusCounts["PROCESSING"] ?? 0} />
        <StatCard label="Done" value={done} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">Plan dağılımı</h2>
          <div className="space-y-2.5">
            {["FREE", "STARTER", "PRO", "STUDIO"].map((p) => (
              <BarRow key={p} label={p} value={planCounts[p] ?? 0} max={maxPlan} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Son 7 gün generation
          </h2>
          <div className="space-y-2.5">
            {[...perDay.entries()].map(([day, count]) => (
              <BarRow key={day} label={day.slice(5)} value={count} max={maxDay} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
