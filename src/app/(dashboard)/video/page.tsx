"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VIDEO_MODELS } from "@/lib/models";
import { useGenerationJob } from "@/hooks/useGenerationJob";
import { getMotionPreset, motionPromptPrefix } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function VideoPage() {
  return (
    <Suspense>
      <VideoPageInner />
    </Suspense>
  );
}

function VideoPageInner() {
  const searchParams = useSearchParams();
  const motionPreset = getMotionPreset(searchParams.get("motion"));
  const [model, setModel] = useState(VIDEO_MODELS[0].key);
  const [prompt, setPrompt] = useState(motionPreset ? motionPromptPrefix(motionPreset) : "");
  const { status, outputUrl, error, start } = useGenerationJob();

  const selectedModel = VIDEO_MODELS.find((m) => m.key === model)!;
  const isLoading = status === "submitting" || status === "processing";

  function handleGenerate() {
    if (!prompt.trim()) return;
    start("/api/generate/video", { modelId: model, prompt });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Video Generation</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Model selector */}
          <div>
            <span className="mb-2 block text-sm font-medium text-white/60">Model</span>
            <div className="flex flex-col gap-2">
              {VIDEO_MODELS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setModel(m.key)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
                    model === m.key
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="text-xs text-white/40">{m.provider}</p>
                  </div>
                  <span className="text-sm text-white/40">{m.credits} cr</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="video-prompt" className="mb-2 block text-sm font-medium text-white/60">
              Prompt
            </label>
            <textarea
              id="video-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} size="lg">
            {isLoading
              ? status === "submitting"
                ? "Submitting..."
                : "Processing..."
              : `Generate · ${selectedModel.credits} credits`}
          </Button>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 min-h-64">
          {status === "processing" && (
            <div className="text-center text-white/30">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm">Generating video...</p>
              <p className="mt-1 text-xs text-white/20">This may take a few minutes</p>
            </div>
          )}
          {status === "submitting" && <p className="text-sm text-white/30">Submitting job...</p>}
          {status === "done" && outputUrl && (
            <div className="w-full overflow-hidden rounded-xl">
              <video src={outputUrl} controls className="w-full" />
              <div className="p-3 text-right">
                <a href={`/api/download?url=${encodeURIComponent(outputUrl)}`}>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </a>
              </div>
            </div>
          )}
          {(status === "idle" || status === "failed") && !outputUrl && (
            <p className="text-sm text-white/20">Your video will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
