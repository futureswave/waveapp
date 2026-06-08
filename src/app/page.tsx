import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";

const FEATURES = [
  {
    title: "DoP Library",
    desc: "28 cinematic camera presets",
    icon: "🎬",
    detail: "Pan, tilt, zoom, dolly, orbit — director-grade motion in one click.",
  },
  {
    title: "Character Lock",
    desc: "Identity-locked characters",
    icon: "🧬",
    detail: "Upload 2–8 reference photos. Your character stays consistent across every scene.",
  },
  {
    title: "32 Generators",
    desc: "Every AI application",
    icon: "⚡",
    detail: "Headshots, ads, avatars, UGC, TikTok, product shots and more.",
  },
  {
    title: "7 Video Models",
    desc: "Sora 2, Veo 3.1, Kling 2.1",
    icon: "🎥",
    detail: "Seedance 1 Pro, Hailuo 02 and more — all in one workspace.",
  },
  {
    title: "5 Image Models",
    desc: "FLUX, Imagen 4, Ideogram v3",
    icon: "🖼️",
    detail: "FLUX Kontext Max, Imagen 4 Fast, Ideogram v3 Turbo and more.",
  },
  {
    title: "Cinema Studio",
    desc: "End-to-end production pipeline",
    icon: "🏛️",
    detail: "Script → storyboard → shot list → generation → export.",
  },
];

const VIDEO_MODELS = [
  { name: "Sora 2", badge: "OpenAI", credits: 40 },
  { name: "Veo 3.1 Fast", badge: "Google", credits: 25 },
  { name: "Kling 2.1", badge: "Kuaishou", credits: 20 },
  { name: "Seedance 1 Pro", badge: "ByteDance", credits: 60 },
  { name: "Hailuo 02", badge: "MiniMax", credits: 28 },
];

const IMAGE_MODELS = [
  { name: "FLUX Kontext Max", badge: "Black Forest", credits: 5 },
  { name: "Imagen 4 Fast", badge: "Google", credits: 3 },
  { name: "Ideogram v3 Turbo", badge: "Ideogram", credits: 4 },
];

const USE_CASES = [
  "AI Influencer",
  "Ads & Campaigns",
  "Professional Headshots",
  "Avatars",
  "TikTok Content",
  "Instagram Reels",
  "YouTube Shorts",
  "Product Photography",
  "Brand Assets",
  "UGC Videos",
  "Storyboarding",
  "Concept Art",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-14 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
        <Badge variant="secondary" className="mb-6">
          The AI Generation Platform
        </Badge>
        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tighter md:text-7xl">
          Generate{" "}
          <span className="italic text-white/60">cinema</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/50">
          Every modern AI video and image model. Director-quality motion presets.
          Identity-locked characters. One credit balance, one workspace.
        </p>
        <div className="mt-10 flex gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Start generating</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/explore">Browse apps</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/8"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-white/50">{f.desc}</p>
              <p className="mt-3 text-sm text-white/40">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Models Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-10 text-3xl font-bold tracking-tight">Models</h2>

        <div className="mb-8">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            Video
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEO_MODELS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-white/40">{m.badge}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">{m.credits} cr</span>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/video">Try</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            Image
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGE_MODELS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-white/40">{m.badge}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">{m.credits} cr</span>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/image">Try</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Use cases</h2>
        <div className="flex flex-wrap gap-3">
          {USE_CASES.map((uc) => (
            <span
              key={uc}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
            >
              {uc}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight">Ready to generate?</h2>
        <p className="mt-4 text-white/50">Start with 100 free credits. No credit card required.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/sign-up">Sign up free</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <p className="text-lg font-bold">Wave</p>
              <p className="mt-1 text-sm text-white/40">The AI Generation Platform</p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-sm text-white/50">
              <div>
                <p className="mb-3 font-medium text-white">Generate</p>
                <div className="flex flex-col gap-2">
                  <Link href="/image" className="hover:text-white">Image</Link>
                  <Link href="/video" className="hover:text-white">Video</Link>
                  <Link href="/motion" className="hover:text-white">Motion</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 font-medium text-white">Models</p>
                <div className="flex flex-col gap-2">
                  <Link href="/explore" className="hover:text-white">All models</Link>
                  <Link href="/talent" className="hover:text-white">Characters</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 font-medium text-white">Account</p>
                <div className="flex flex-col gap-2">
                  <Link href="/pricing" className="hover:text-white">Pricing</Link>
                  <Link href="/library" className="hover:text-white">Library</Link>
                  <Link href="/sign-in" className="hover:text-white">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-white/20">© 2026 Wave App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
