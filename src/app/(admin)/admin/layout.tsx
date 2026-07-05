import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserId } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminId = await getAdminUserId();
  if (!adminId) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link href="/admin" className="flex items-center gap-1.5 shrink-0">
            <span className="font-display text-xl leading-none" style={{ letterSpacing: "0.05em" }}>
              WAVE
            </span>
            <span
              className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Admin
            </span>
          </Link>
          <AdminNav />
          <Link href="/explore" className="ml-auto text-xs text-white/40 hover:text-white">
            ← App
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
