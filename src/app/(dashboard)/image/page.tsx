"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMAGE_MODELS, type ImageModelKey } from "@/lib/fal";
import { cn } from "@/lib/utils";

const ASPECT_RATIOS = [
  { label: "1:1", w: 1024, h: 1024 },
  { label: "16:9", w: 1344, h: 768 },
  { label: "9:16", w: 768, h: 1344 },
  { label: "4:3", w: 1152, h: 896 },
  { label: "3:4", w: 896, h: 1152 },
];

export default function ImagePage() {
  const [model, setModel] = useState<ImageModelKey>("flux-kontext-max");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: model,
          prompt,
          negativePrompt: negativePrompt || undefined,
          width: aspectRatio.w,
          height: aspectRatio.h,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Image Generation</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Model selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Model</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(IMAGE_MODELS) as [ImageModelKey, typeof IMAGE_MODELS[ImageModelKey]][]).map(
                ([key, m]) => (
                  <button
                    key={key}
                    onClick={() => setModel(key)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      model === key
                        ? "border-white bg-white/10 text-white"
                        : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                    )}
                  >
                    <p className="font-medium leading-tight">{m.label}</p>
                    <p className="text-xs text-white/40">{m.credits} cr</p>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Negative prompt */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Negative prompt{" "}
              <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid..."
              rows={2}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Aspect ratio</label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => setAspectRatio(ar)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors",
                    aspectRatio.label === ar.label
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            size="lg"
            className="mt-2"
          >
            {loading ? "Generating..." : `Generate · ${IMAGE_MODELS[model].credits} credits`}
          </Button>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 min-h-64">
          {loading ? (
            <div className="text-center text-white/30">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm">Generating image...</p>
            </div>
          ) : result ? (
            <div className="relative w-full overflow-hidden rounded-xl">
              <Image
                src={result}
                alt="Generated image"
                width={aspectRatio.w}
                height={aspectRatio.h}
                className="w-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-3 right-3">
                <a
                  href={result}
                  download="generation.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/20">Your image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
