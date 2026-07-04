"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOTION_PRESETS as DOP_PRESETS } from "@/lib/motion";

export default function MotionPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const preset = DOP_PRESETS.find((p) => p.id === selected);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">DoP Library</h1>
        <p className="mt-2 text-white/40">
          {DOP_PRESETS.length} cinematic camera presets. Select one, then generate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preset grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {DOP_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id === selected ? null : p.id)}
                className={cn(
                  "flex flex-col rounded-xl border p-3 text-left transition-all",
                  selected === p.id
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                )}
              >
                <span className="mb-2 text-2xl">{p.icon}</span>
                <p className="text-sm font-medium leading-tight">{p.label}</p>
                <p className="mt-1 text-xs text-white/30 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            {preset ? (
              <>
                <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Selected</p>
                <div className="mb-2 text-4xl">{preset.icon}</div>
                <h3 className="text-lg font-semibold">{preset.label}</h3>
                <p className="mt-1 text-sm text-white/40">{preset.desc}</p>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/video?motion=${preset.id}`}>Generate with this preset</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-white/30">Select a preset to continue</p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/40">
            <p className="font-medium text-white/60 mb-2">How it works</p>
            <p>
              Choose a camera movement preset, then describe your scene. The preset is
              injected into the video model&apos;s prompt automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
