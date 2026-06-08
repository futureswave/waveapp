"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOP_PRESETS = [
  { id: "dolly-in", label: "Dolly In", icon: "→", desc: "Camera moves toward subject" },
  { id: "dolly-out", label: "Dolly Out", icon: "←", desc: "Camera pulls away from subject" },
  { id: "pan-left", label: "Pan Left", icon: "⟵", desc: "Horizontal pan to the left" },
  { id: "pan-right", label: "Pan Right", icon: "⟶", desc: "Horizontal pan to the right" },
  { id: "tilt-up", label: "Tilt Up", icon: "↑", desc: "Camera tilts upward" },
  { id: "tilt-down", label: "Tilt Down", icon: "↓", desc: "Camera tilts downward" },
  { id: "orbit-cw", label: "Orbit CW", icon: "↻", desc: "Clockwise orbit around subject" },
  { id: "orbit-ccw", label: "Orbit CCW", icon: "↺", desc: "Counter-clockwise orbit" },
  { id: "zoom-in", label: "Zoom In", icon: "🔍+", desc: "Optical zoom in" },
  { id: "zoom-out", label: "Zoom Out", icon: "🔍−", desc: "Optical zoom out" },
  { id: "crane-up", label: "Crane Up", icon: "⬆", desc: "Camera cranes upward" },
  { id: "crane-down", label: "Crane Down", icon: "⬇", desc: "Camera cranes downward" },
  { id: "handheld", label: "Handheld", icon: "📷", desc: "Realistic handheld shake" },
  { id: "static", label: "Static", icon: "⬛", desc: "Locked-off camera, no movement" },
  { id: "dolly-zoom", label: "Dolly Zoom", icon: "🌀", desc: "Hitchcock zoom effect" },
  { id: "tracking", label: "Tracking Shot", icon: "🚂", desc: "Camera tracks alongside subject" },
  { id: "arc-left", label: "Arc Left", icon: "◁", desc: "Curved arc to the left" },
  { id: "arc-right", label: "Arc Right", icon: "▷", desc: "Curved arc to the right" },
  { id: "whip-pan", label: "Whip Pan", icon: "💨", desc: "Ultra-fast pan cut" },
  { id: "low-angle", label: "Low Angle", icon: "⤵", desc: "Dramatic low-angle push" },
  { id: "high-angle", label: "High Angle", icon: "⤴", desc: "God's eye view movement" },
  { id: "dutch-tilt", label: "Dutch Tilt", icon: "↗", desc: "Canted Dutch angle" },
  { id: "bird-eye", label: "Bird's Eye", icon: "🦅", desc: "Aerial top-down shot" },
  { id: "ground-level", label: "Ground Level", icon: "🐜", desc: "Extreme low ground shot" },
  { id: "slide-left", label: "Slide Left", icon: "◀", desc: "Lateral slide to the left" },
  { id: "slide-right", label: "Slide Right", icon: "▶", desc: "Lateral slide to the right" },
  { id: "push-in-slow", label: "Slow Push In", icon: "⇥", desc: "Slow, deliberate push in" },
  { id: "pull-out-slow", label: "Slow Pull Out", icon: "⇤", desc: "Slow pull reveal" },
];

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
