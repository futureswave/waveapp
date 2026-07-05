import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await prisma.adminActionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Audit Log</h1>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Admin</th>
              <th className="px-4 py-3 font-medium">Aksiyon</th>
              <th className="px-4 py-3 font-medium">Hedef</th>
              <th className="px-4 py-3 font-medium">Detay</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white/40">
                  {l.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/40">{l.adminId.slice(0, 12)}…</td>
                <td className="px-4 py-3 text-[var(--accent)]">{l.action}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${l.targetId}`} className="font-mono text-xs text-white/50 hover:text-white">
                    {l.targetId.slice(0, 12)}…
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/50">
                  {l.detail ? JSON.stringify(l.detail) : "—"}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/30">
                  Henüz kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
