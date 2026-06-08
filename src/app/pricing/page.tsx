"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 100,
    creditNote: "One-time",
    features: [
      "100 starter credits",
      "All text-to-image models",
      "All image-to-video models",
      "Community support",
    ],
    cta: "Start for free",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Starter",
    monthlyPrice: 9,
    yearlyPrice: 7,
    credits: 150,
    creditNote: "per month",
    features: [
      "150 credits / month",
      "~50 images or ~3 short videos",
      "Standard render queue",
      "Email support",
    ],
    cta: "Get started",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 15,
    credits: 400,
    creditNote: "per month",
    features: [
      "400 credits / month",
      "~130 images or ~8 short videos",
      "Priority render queue",
      "Seedance 2.0 access",
      "Generation history",
    ],
    cta: "Go Pro",
    href: "/sign-up",
    popular: true,
  },
  {
    name: "Studio",
    monthlyPrice: 49,
    yearlyPrice: 39,
    credits: 1000,
    creditNote: "per month",
    features: [
      "1,000 credits / month",
      "~330 images or ~20 short videos",
      "Brand asset library",
      "Template storage",
      "Fast support",
    ],
    cta: "Go Studio",
    href: "/sign-up",
    popular: false,
  },
];

const CREDIT_TABLE = [
  { model: "Imagen 4 Fast", credits: 3, type: "Image" },
  { model: "FLUX Kontext Max", credits: 5, type: "Image" },
  { model: "Ideogram v3 Turbo", credits: 4, type: "Image" },
  { model: "Kling 2.1 (5s)", credits: 20, type: "Video" },
  { model: "Veo 3.1 Fast", credits: 25, type: "Video" },
  { model: "Hailuo 02", credits: 28, type: "Video" },
  { model: "Sora 2", credits: 40, type: "Video" },
  { model: "Seedance 1 Pro", credits: 60, type: "Video" },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Simple pricing</h1>
          <p className="mt-3 text-white/50">One credit balance. Every model. No surprises.</p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                !yearly ? "bg-white text-black font-medium" : "text-white/50 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors",
                yearly ? "bg-white text-black font-medium" : "text-white/50 hover:text-white"
              )}
            >
              Yearly
              <Badge variant="secondary" className="text-[10px] py-0">
                -20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-xl border p-6",
                  plan.popular
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-white/5"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most popular
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-white/40">
                        /{yearly ? "mo, billed yearly" : "mo"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {plan.credits.toLocaleString()} credits {plan.creditNote}
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-0.5 text-white/40">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Credit cost table */}
        <div className="mt-20">
          <h2 className="mb-6 text-2xl font-bold">Credit costs per model</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left font-medium text-white/60">Model</th>
                  <th className="px-4 py-3 text-left font-medium text-white/60">Type</th>
                  <th className="px-4 py-3 text-right font-medium text-white/60">Credits</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_TABLE.map((row, i) => (
                  <tr
                    key={row.model}
                    className={cn(
                      "border-b border-white/5",
                      i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{row.model}</td>
                    <td className="px-4 py-3 text-white/40">{row.type}</td>
                    <td className="px-4 py-3 text-right">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
