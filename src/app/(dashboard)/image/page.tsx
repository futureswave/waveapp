"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMAGE_MODELS } from "@/lib/models";
import { useGenerationJob } from "@/hooks/useGenerationJob";
import { cn } from "@/lib/utils";

const ASPECT_RATIOS = [
  { label: "1:1", w: 1024, h: 1024 },
  { label: "16:9", w: 1344, h: 768 },
  { label: "9:16", w: 768, h: 1344 },
  { label: "4:3", w: 1152, h: 896 },
  { label: "3:4", w: 896, h: 1152 },
];

export default function ImagePage() {
  const [model, setModel] = useState(IMAGE_MODELS[0].key);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const { status, outputUrl, error, start } = useGenerationJob();

  const selected = IMAGE_MODELS.find((m) => m.key === model)!;
  const isLoading = status === "submitting" || status === "processing";

  function handleGenerate() {
    if (!prompt.trim()) return;
    start("/api/generate/image", {
      modelId: model,
      prompt,
      negativePrompt: negativePrompt || undefined,
      width: aspectRatio.w,
      height: aspectRatio.h,
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Image Generation</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Model selector */}
          <div>
            <span className="mb-2 block text-sm font-medium text-white/60">Model</span>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_MODELS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setModel(m.key)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    model === m.key
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  <p className="font-medium leading-tight">{m.label}</p>
                  <p className="text-xs text-white/40">{m.credits} cr</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-white/60">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Negative prompt */}
          <div>
            <label htmlFor="negative-prompt" className="mb-2 block text-sm font-medium text-white/60">
              Negative prompt <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid..."
              rows={2}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Aspect ratio */}
          <div>
            <span className="mb-2 block text-sm font-medium text-white/60">Aspect ratio</span>
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

          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} size="lg" className="mt-2">
            {isLoading ? "Generating..." : `Generate · ${selected.credits} credits`}
          </Button>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 min-h-64">
          {isLoading ? (
            <div className="text-center text-white/30">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm">Generating image...</p>
            </div>
          ) : status === "done" && outputUrl ? (
            <div className="relative w-full overflow-hidden rounded-xl">
              <Image
                src={outputUrl}
                alt="Generated image"
                width={aspectRatio.w}
                height={aspectRatio.h}
                className="w-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-3 right-3">
                <a href={`/api/download?url=${encodeURIComponent(outputUrl)}`}>
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
