"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const GENERATORS = [
  { id: "headshot", label: "Headshots", category: "Image", href: "/image", desc: "Professional AI headshots", gradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]" },
  { id: "portrait", label: "Portrait", category: "Image", href: "/image", desc: "Artistic portrait generation", gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]" },
  { id: "product", label: "Product Shots", category: "Image", href: "/image", desc: "Studio-quality product photos", gradient: "from-[#0d0d0d] via-[#1a1a1a] to-[#2d2d2d]" },
  { id: "logo", label: "Logo Creator", category: "Image", href: "/image", desc: "Brand logos & icons", gradient: "from-[#11001c] via-[#1a0033] to-[#2d0057]" },
  { id: "banner", label: "Ad Banners", category: "Image", href: "/image", desc: "Social media ad creatives", gradient: "from-[#0a0a0a] via-[#1a1a0a] to-[#2a2a0a]" },
  { id: "avatar", label: "Avatars", category: "Image", href: "/image", desc: "Profile pictures & avatars", gradient: "from-[#001a1a] via-[#002d2d] to-[#003d3d]" },
  { id: "concept", label: "Concept Art", category: "Image", href: "/image", desc: "Game & film concept art", gradient: "from-[#1a0a00] via-[#2d1500] to-[#3d2000]" },
  { id: "fashion", label: "Fashion", category: "Image", href: "/image", desc: "Fashion & apparel visuals", gradient: "from-[#1a001a] via-[#2d002d] to-[#1a0033]" },
  { id: "interior", label: "Interior Design", category: "Image", href: "/image", desc: "Room & space visualization", gradient: "from-[#0a0f1a] via-[#111827] to-[#1e2d3d]" },
  { id: "food", label: "Food Photography", category: "Image", href: "/image", desc: "Appetizing food shots", gradient: "from-[#1a0a00] via-[#2d1000] to-[#1a0500]" },
  { id: "thumbnail", label: "Thumbnails", category: "Image", href: "/image", desc: "Click-worthy thumbnails", gradient: "from-[#0d1a00] via-[#1a2d00] to-[#0d1500]" },
  { id: "pattern", label: "Patterns", category: "Image", href: "/image", desc: "Seamless pattern generation", gradient: "from-[#00001a] via-[#00002d] to-[#0a0a1a]" },
  { id: "illustration", label: "Illustrations", category: "Image", href: "/image", desc: "Vector-style illustrations", gradient: "from-[#1a1a00] via-[#2d2d00] to-[#1a1500]" },
  { id: "background", label: "Backgrounds", category: "Image", href: "/image", desc: "Scene backgrounds", gradient: "from-[#001a0d] via-[#002d1a] to-[#001a10]" },
  { id: "texture", label: "Textures", category: "Image", href: "/image", desc: "3D-ready textures", gradient: "from-[#1a1a1a] via-[#262626] to-[#1a1a1a]" },
  { id: "ugc", label: "UGC Videos", category: "Video", href: "/video", desc: "User-generated style content", gradient: "from-[#1a0000] via-[#2d0000] to-[#1a0505]" },
  { id: "tiktok", label: "TikTok Content", category: "Video", href: "/video", desc: "Short-form viral videos", gradient: "from-[#000d1a] via-[#00162d] to-[#001a20]" },
  { id: "reels", label: "Instagram Reels", category: "Video", href: "/video", desc: "Reel-format vertical videos", gradient: "from-[#1a001a] via-[#1a0033] to-[#0d001a]" },
  { id: "shorts", label: "YouTube Shorts", category: "Video", href: "/video", desc: "Short YouTube content", gradient: "from-[#1a0500] via-[#2d0a00] to-[#1a0800]" },
  { id: "ad-video", label: "Video Ads", category: "Video", href: "/video", desc: "Conversion-focused ad videos", gradient: "from-[#0a0a0a] via-[#1a1505] to-[#0f0f00]" },
  { id: "explainer", label: "Explainer Videos", category: "Video", href: "/video", desc: "Product explanation videos", gradient: "from-[#00101a] via-[#001a2d] to-[#001015]" },
  { id: "influencer", label: "AI Influencer", category: "Character", href: "/talent", desc: "Create your AI persona", gradient: "from-[#001a0a] via-[#002d15] to-[#001a0d]" },
  { id: "spokesperson", label: "Spokesperson", category: "Character", href: "/talent", desc: "Brand spokesperson character", gradient: "from-[#001510] via-[#00261a] to-[#001a12]" },
  { id: "character-story", label: "Story Characters", category: "Character", href: "/talent", desc: "Narrative character creation", gradient: "from-[#0a0015] via-[#150026] to-[#0a0010]" },
  { id: "cinematic", label: "Cinematic Motion", category: "Motion", href: "/motion", desc: "Film-quality camera moves", gradient: "from-[#000a1a] via-[#00152d] to-[#000a15]" },
  { id: "timelapse", label: "Time Lapse", category: "Motion", href: "/motion", desc: "Dynamic time-lapse effects", gradient: "from-[#0f0a00] via-[#1a1500] to-[#0f0c00]" },
  { id: "dolly", label: "Dolly Zoom", category: "Motion", href: "/motion", desc: "Iconic dolly zoom effect", gradient: "from-[#0a000f] via-[#150019] to-[#0a0010]" },
  { id: "orbit", label: "Orbit Shot", category: "Motion", href: "/motion", desc: "360° orbital camera", gradient: "from-[#00050f] via-[#000a1a] to-[#000510]" },
  { id: "pan", label: "Pan & Tilt", category: "Motion", href: "/motion", desc: "Classic pan and tilt moves", gradient: "from-[#0f0500] via-[#1a0a00] to-[#0f0800]" },
  { id: "storyboard", label: "Storyboard", category: "Studio", href: "#", desc: "Visual story planning", gradient: "from-[#0a0a0a] via-[#141414] to-[#0a0a0a]" },
  { id: "moodboard", label: "Mood Board", category: "Studio", href: "#", desc: "Creative direction boards", gradient: "from-[#0a0a0a] via-[#181818] to-[#0a0a0a]" },
  { id: "brand-kit", label: "Brand Kit", category: "Studio", href: "#", desc: "Cohesive brand visuals", gradient: "from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" },
];

const CATEGORIES = ["All", "Image", "Video", "Character", "Motion", "Studio"];

const CATEGORY_ACCENT: Record<string, string> = {
  Image: "#6366f1",
  Video: "#ef4444",
  Character: "#22c55e",
  Motion: "#3b82f6",
  Studio: "#a855f7",
};

export default function ExplorePage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return GENERATORS.filter((g) => {
      const matchCat = active === "All" || g.category === active;
      const matchQuery =
        query === "" ||
        g.label.toLowerCase().includes(query.toLowerCase()) ||
        g.desc.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [active, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            {GENERATORS.length} AI Generators
          </span>
        </div>
        <h1
          className="font-display text-6xl leading-none"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          Explore
        </h1>
      </div>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search generators..."
          className="w-full rounded-sm border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none sm:max-w-64"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="rounded-sm border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all"
              style={
                active === cat
                  ? {
                      background: "var(--accent)",
                      borderColor: "var(--accent)",
                      color: "var(--accent-fg)",
                    }
                  : {
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.4)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-white/20 text-sm">No generators found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g) => (
            <Link
              key={g.id}
              href={g.href}
              className="group relative overflow-hidden rounded-sm"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${g.gradient} transition-transform duration-500 group-hover:scale-105`}
              />

              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px 128px",
                }}
              />

              {/* Category badge */}
              <div className="absolute left-3 top-3">
                <span
                  className="rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-fg)",
                  }}
                >
                  {g.category}
                </span>
              </div>

              {/* Bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
                <h3 className="text-sm font-semibold leading-tight text-white">
                  {g.label}
                </h3>
                <p className="mt-1 text-xs text-white/40 leading-tight">{g.desc}</p>
              </div>

              {/* Hover accent border */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ border: "1px solid var(--accent)", borderRadius: "2px" }}
              />

              {/* Arrow indicator */}
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-[10px] font-bold"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
