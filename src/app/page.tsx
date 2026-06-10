import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

const FEATURES = [
  {
    number: "01",
    title: "DoP Library",
    desc: "28 cinematic camera presets — pan, tilt, dolly, orbit.",
    category: "Motion",
  },
  {
    number: "02",
    title: "Character Lock",
    desc: "Identity-locked characters across every scene.",
    category: "AI",
  },
  {
    number: "03",
    title: "32 Generators",
    desc: "Headshots, ads, avatars, UGC, TikTok, product shots.",
    category: "Tools",
  },
  {
    number: "04",
    title: "7 Video Models",
    desc: "Sora 2, Veo 3.1, Kling 2.1, Seedance, Hailuo.",
    category: "Video",
  },
  {
    number: "05",
    title: "5 Image Models",
    desc: "FLUX, Imagen 4, Ideogram v3 — all in one workspace.",
    category: "Image",
  },
  {
    number: "06",
    title: "Cinema Studio",
    desc: "Script → storyboard → shot list → generation → export.",
    category: "Studio",
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
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-end px-4 pb-16 pt-24 md:pt-0 md:justify-center max-w-7xl mx-auto">
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 max-w-5xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              The AI Generation Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-[13vw] leading-[0.88] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw]"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            <span className="block text-white">ONE-CLICK</span>
            <span className="block" style={{ color: "var(--accent)" }}>
              AI CINEMA
            </span>
            <span className="block text-white">FOR EVERY BRIEF.</span>
          </h1>

          {/* Sub */}
          <p className="mt-8 max-w-xl text-base text-white/40 leading-relaxed">
            Every modern AI video and image model. Director-quality motion
            presets. Identity-locked characters. One credit balance, one
            workspace.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center px-7 text-sm font-semibold uppercase tracking-wider rounded-sm transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Start generating
            </Link>
            <Link
              href="/explore"
              className="inline-flex h-11 items-center px-7 text-sm font-medium text-white/60 uppercase tracking-wider border border-white/10 rounded-sm hover:border-white/30 hover:text-white transition-colors"
            >
              Browse apps
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-16 flex flex-wrap gap-8 border-t border-white/[0.06] pt-8">
          {[
            { n: "32", label: "AI Generators" },
            { n: "7", label: "Video Models" },
            { n: "5", label: "Image Models" },
            { n: "28", label: "Camera Presets" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="font-display text-3xl"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  color: "var(--accent)",
                }}
              >
                {s.n}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="font-display text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Platform
          </h2>
          <span className="text-xs text-white/20 uppercase tracking-widest">
            Everything you need
          </span>
        </div>

        <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative bg-[var(--background)] p-6 transition-colors hover:bg-[var(--surface)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="font-display text-4xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {f.number}
                </span>
                <span
                  className="rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: "rgba(229,245,0,0.1)",
                    color: "var(--accent)",
                  }}
                >
                  {f.category}
                </span>
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/40 leading-relaxed">{f.desc}</p>
              <span
                className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: "var(--accent)" }}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* Models */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="font-display text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Models
          </h2>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Video
            </span>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEO_MODELS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between border border-white/[0.06] bg-[var(--surface)] px-4 py-3 hover:border-white/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-white/30">{m.badge}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/20">{m.credits} cr</span>
                  <Link
                    href="/video"
                    className="rounded-sm border border-white/10 px-3 py-1 text-xs font-medium text-white/60 hover:border-white/30 hover:text-white transition-colors"
                  >
                    Try
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Image
            </span>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGE_MODELS.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between border border-white/[0.06] bg-[var(--surface)] px-4 py-3 hover:border-white/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-white/30">{m.badge}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/20">{m.credits} cr</span>
                  <Link
                    href="/image"
                    className="rounded-sm border border-white/10 px-3 py-1 text-xs font-medium text-white/60 hover:border-white/30 hover:text-white transition-colors"
                  >
                    Try
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* Use Cases */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="font-display text-5xl"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            Use Cases
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <span
              key={uc}
              className="border border-white/[0.08] px-4 py-2 text-sm text-white/50 rounded-sm hover:border-white/20 hover:text-white transition-colors cursor-default"
            >
              {uc}
            </span>
          ))}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9]"
              style={{ fontFamily: "var(--font-bebas), sans-serif" }}
            >
              <span className="block text-white">Ready to</span>
              <span className="block" style={{ color: "var(--accent)" }}>
                Generate?
              </span>
            </h2>
            <p className="mt-4 text-white/40 text-sm">
              Start with 100 free credits. No credit card required.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex h-12 shrink-0 items-center px-8 text-sm font-semibold uppercase tracking-wider rounded-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Sign up free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <p
                className="font-display text-2xl"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                <span className="text-white">W</span>
                <span style={{ color: "var(--accent)" }}>AVE</span>
              </p>
              <p className="mt-1 text-xs text-white/30 uppercase tracking-widest">
                The AI Generation Platform
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-sm text-white/40">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                  Generate
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/image" className="hover:text-white transition-colors">Image</Link>
                  <Link href="/video" className="hover:text-white transition-colors">Video</Link>
                  <Link href="/motion" className="hover:text-white transition-colors">Motion</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                  Models
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/explore" className="hover:text-white transition-colors">All models</Link>
                  <Link href="/talent" className="hover:text-white transition-colors">Characters</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                  Account
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                  <Link href="/library" className="hover:text-white transition-colors">Library</Link>
                  <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-white/15">© 2026 Wave App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
