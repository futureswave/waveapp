"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PLANS = ["FREE", "STARTER", "PRO", "STUDIO"] as const;
const ROLES = ["USER", "ADMIN"] as const;

async function postJson(url: string, body: unknown): Promise<string | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.error ?? "İşlem başarısız";
}

export function UserActions({
  userId,
  plan,
  role,
}: {
  userId: string;
  plan: string;
  role: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  async function run(fn: () => Promise<string | null>) {
    setBusy(true);
    setMsg(null);
    const err = await fn();
    setBusy(false);
    if (err) setMsg({ ok: false, text: err });
    else {
      setMsg({ ok: true, text: "Güncellendi" });
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            msg.ok
              ? "border-[var(--accent)]/30 text-[var(--accent)]"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* Credits */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
          Kredi ayarla
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="±miktar"
            className="w-32 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-white/30 focus:outline-none"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sebep (opsiyonel)"
            className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-white/30 focus:outline-none"
          />
          <Button
            variant="accent"
            disabled={busy || !amount}
            onClick={() =>
              run(() =>
                postJson("/api/admin/credits", {
                  userId,
                  amount: parseInt(amount, 10),
                  reason: reason || undefined,
                })
              )
            }
          >
            Uygula
          </Button>
        </div>
        <p className="mt-2 text-xs text-white/30">Pozitif = ekle, negatif = düş.</p>
      </div>

      {/* Plan */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Plan</h3>
        <div className="flex flex-wrap gap-2">
          {PLANS.map((p) => (
            <button
              key={p}
              disabled={busy || p === plan}
              onClick={() => run(() => postJson("/api/admin/plan", { userId, plan: p }))}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                p === plan
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">Role</h3>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              disabled={busy || r === role}
              onClick={() => run(() => postJson("/api/admin/role", { userId, role: r }))}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                r === role
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
