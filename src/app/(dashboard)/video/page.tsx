"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VIDEO_MODELS = [
  { id: "kling-2.1-5s", label: "Kling 2.1", badge: "Kuaishou", credits: 20 },
  { id: "veo-3.1-fast", label: "Veo 3.1 Fast", badge: "Google", credits: 25 },
  { id: "hailuo-02", label: "Hailuo 02", badge: "MiniMax", credits: 28 },
  { id: "sora-2", label: "Sora 2", badge: "OpenAI", credits: 40 },
  { id: "seedance-1-pro", label: "Seedance 1 Pro", badge: "ByteDance", credits: 60 },
];

type JobStatus = "idle" | "submitting" | "processing" | "done" | "failed";

export default function VideoPage() {
  const [model, setModel] = useState(VIDEO_MODELS[0].id);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<JobStatus>("idle");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function pollStatus(id: string) {
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/generate/status/${id}`);
      const data = await res.json();
      if (data.status === "DONE") {
        clearInterval(pollRef.current!);
        setVideoUrl(data.outputUrl);
        setStatus("done");
      } else if (data.status === "FAILED") {
        clearInterval(pollRef.current!);
        setError("Generation failed.");
        setStatus("failed");
      }
    }, 5000);
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setStatus("submitting");
    setError(null);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: model, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenerationId(data.generationId);
      setStatus("processing");
      pollStatus(data.generationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setStatus("failed");
    }
  }

  const selectedModel = VIDEO_MODELS.find((m) => m.id === model)!;
  const isLoading = status === "submitting" || status === "processing";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Video Generation</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Model selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Model</label>
            <div className="flex flex-col gap-2">
              {VIDEO_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
                    model === m.id
                      ? "border-white bg-white/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="text-xs text-white/40">{m.badge}</p>
                  </div>
                  <span className="text-sm text-white/40">{m.credits} cr</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Prompt</label>
            <textarea
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
          {status === "submitting" && (
            <p className="text-sm text-white/30">Submitting job...</p>
          )}
          {status === "done" && videoUrl && (
            <div className="w-full overflow-hidden rounded-xl">
              <video src={videoUrl} controls className="w-full" />
              <div className="p-3 text-right">
                <a href={videoUrl} download target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">Download</Button>
                </a>
              </div>
            </div>
          )}
          {status === "idle" && (
            <p className="text-sm text-white/20">Your video will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
