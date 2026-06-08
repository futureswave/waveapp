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
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        credits < 20
          ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="text-[10px]">⚡</span>
      {credits} cr
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">Wave</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors",
                  item.soon
                    ? "cursor-default text-white/30"
                    : pathname === item.href
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                )}
                onClick={(e) => item.soon && e.preventDefault()}
              >
                {item.label}
                {item.soon && (
                  <Badge variant="soon" className="ml-1 text-[10px]">
                    Soon
                  </Badge>
                )}
              </Link>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <CreditBadge />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign up free</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
