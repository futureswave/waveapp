import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getModel } from "@/lib/models";
import { UserActions } from "@/components/admin/user-actions";

export const dynamic = "force-dynamic";

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      generations: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!user) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-xs text-white/40 hover:text-white">
          ← Users
        </Link>
        <h1 className="mt-2 font-display text-3xl">{user.email || user.id}</h1>
        <p className="mt-1 font-mono text-xs text-white/30">{user.id}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Info label="Credits" value={user.credits} />
        <Info label="Plan" value={user.plan} />
        <Info label="Role" value={user.role} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <UserActions userId={user.id} plan={user.plan} role={user.role} />

        <div className="space-y-6">
          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
              Abonelik
            </h3>
            {user.subscription ? (
              <dl className="space-y-1.5 text-sm">
                <Row k="Plan" v={user.subscription.plan} />
                <Row k="Stripe sub" v={user.subscription.stripeSubId} />
                <Row k="Customer" v={user.subscription.stripeCustomerId} />
                <Row k="Dönem sonu" v={user.subscription.currentPeriodEnd.toISOString().slice(0, 10)} />
              </dl>
            ) : (
              <p className="text-sm text-white/30">Abonelik yok.</p>
            )}
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
              Son generation'lar
            </h3>
            {user.generations.length === 0 ? (
              <p className="text-sm text-white/30">Kayıt yok.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {user.generations.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-white/70">
                      {getModel(g.modelId)?.label ?? g.modelId} · {g.prompt}
                    </span>
                    <span
                      className={
                        g.status === "FAILED"
                          ? "shrink-0 text-red-400"
                          : g.status === "DONE"
                          ? "shrink-0 text-white/40"
                          : "shrink-0 text-[var(--accent)]"
                      }
                    >
                      {g.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-white/40">{k}</dt>
      <dd className="truncate font-mono text-xs text-white/70">{v}</dd>
    </div>
  );
}
