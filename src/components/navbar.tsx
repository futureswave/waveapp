"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Explore", href: "/explore" },
  { label: "Image", href: "/image" },
  { label: "Video", href: "/video" },
  { label: "Talent", href: "/talent" },
  { label: "Motion", href: "/motion" },
  { label: "Library", href: "/library" },
  { label: "Pricing", href: "/pricing" },
  { label: "Cinema", href: "#", soon: true },
  { label: "Character", href: "#", soon: true },
];

function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/user/credits")
      .then((r) => r.json())
      .then((d) => setCredits(d.credits))
      .catch(() => {});
  }, [isSignedIn]);

  if (!isSignedIn || credits === null) return null;

  return (
    <Link
      href="/pricing"
      className={cn(
        "flex items-center gap-1 rounded-sm border px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors",
        credits < 20
          ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
          : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
      )}
    >
      <span style={{ color: credits < 20 ? undefined : "var(--accent)" }}>⚡</span>
      {credits}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-5 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span
            className="font-display text-xl leading-none text-white"
            style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.05em" }}
          >
            W
          </span>
          <span
            className="font-display text-xl leading-none"
            style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.05em", color: "var(--accent)" }}
          >
            AVE
          </span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "relative px-2.5 py-1 text-xs font-medium tracking-wide uppercase transition-colors",
                  item.soon
                    ? "cursor-default text-white/20"
                    : pathname === item.href
                    ? "text-[var(--accent)]"
                    : "text-white/50 hover:text-white"
                )}
                onClick={(e) => item.soon && e.preventDefault()}
              >
                {item.label}
                {item.soon && (
                  <Badge variant="soon" className="ml-1 text-[9px] px-1 py-0">
                    Soon
                  </Badge>
                )}
                {!item.soon && pathname === item.href && (
                  <span
                    className="absolute bottom-0 left-2.5 right-2.5 h-px"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <CreditBadge />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white h-8 px-3">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="h-8 px-4 text-xs font-semibold tracking-wide uppercase rounded-sm transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
