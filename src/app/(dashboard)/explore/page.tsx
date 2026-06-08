"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const GENERATORS = [
  { id: "headshot", label: "Headshots", category: "Image", href: "/image", desc: "Professional AI headshots" },
  { id: "portrait", label: "Portrait", category: "Image", href: "/image", desc: "Artistic portrait generation" },
  { id: "product", label: "Product Shots", category: "Image", href: "/image", desc: "Studio-quality product photos" },
  { id: "logo", label: "Logo Creator", category: "Image", href: "/image", desc: "Brand logos & icons" },
  { id: "banner", label: "Ad Banners", category: "Image", href: "/image", desc: "Social media ad creatives" },
  { id: "avatar", label: "Avatars", category: "Image", href: "/image", desc: "Profile pictures & avatars" },
  { id: "concept", label: "Concept Art", category: "Image", href: "/image", desc: "Game & film concept art" },
  { id: "fashion", label: "Fashion", category: "Image", href: "/image", desc: "Fashion & apparel visuals" },
  { id: "interior", label: "Interior Design", category: "Image", href: "/image", desc: "Room & space visualization" },
  { id: "food", label: "Food Photography", category: "Image", href: "/image", desc: "Appetizing food shots" },
  { id: "thumbnail", label: "Thumbnails", category: "Image", href: "/image", desc: "Click-worthy thumbnails" },
  { id: "pattern", label: "Patterns", category: "Image", href: "/image", desc: "Seamless pattern generation" },
  { id: "illustration", label: "Illustrations", category: "Image", href: "/image", desc: "Vector-style illustrations" },
  { id: "background", label: "Backgrounds", category: "Image", href: "/image", desc: "Scene backgrounds" },
  { id: "texture", label: "Textures", category: "Image", href: "/image", desc: "3D-ready textures" },
  { id: "ugc", label: "UGC Videos", category: "Video", href: "/video", desc: "User-generated style content" },
  { id: "tiktok", label: "TikTok Content", category: "Video", href: "/video", desc: "Short-form viral videos" },
  { id: "reels", label: "Instagram Reels", category: "Video", href: "/video", desc: "Reel-format vertical videos" },
  { id: "shorts", label: "YouTube Shorts", category: "Video", href: "/video", desc: "Short YouTube content" },
  { id: "ad-video", label: "Video Ads", category: "Video", href: "/video", desc: "Conversion-focused ad videos" },
  { id: "explainer", label: "Explainer Videos", category: "Video", href: "/video", desc: "Product explanation videos" },
  { id: "influencer", label: "AI Influencer", category: "Character", href: "/talent", desc: "Create your AI persona" },
  { id: "spokesperson", label: "Spokesperson", category: "Character", href: "/talent", desc: "Brand spokesperson character" },
  { id: "character-story", label: "Story Characters", category: "Character", href: "/talent", desc: "Narrative character creation" },
  { id: "cinematic", label: "Cinematic Motion", category: "Motion", href: "/motion", desc: "Film-quality camera moves" },
  { id: "timelapse", label: "Time Lapse", category: "Motion", href: "/motion", desc: "Dynamic time-lapse effects" },
  { id: "dolly", label: "Dolly Zoom", category: "Motion", href: "/motion", desc: "Iconic dolly zoom effect" },
  { id: "orbit", label: "Orbit Shot", category: "Motion", href: "/motion", desc: "360° orbital camera" },
  { id: "pan", label: "Pan & Tilt", category: "Motion", href: "/motion", desc: "Classic pan and tilt moves" },
  { id: "storyboard", label: "Storyboard", category: "Studio", href: "#", desc: "Visual story planning" },
  { id: "moodboard", label: "Mood Board", category: "Studio", href: "#", desc: "Creative direction boards" },
  { id: "brand-kit", label: "Brand Kit", category: "Studio", href: "#", desc: "Cohesive brand visuals" },
];

const CATEGORIES = ["All", "Image", "Video", "Character", "Motion", "Studio"];

const CATEGORY_COLORS: Record<string, string> = {
  Image: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Video: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Character: "bg-green-500/10 text-green-400 border-green-500/20",
  Motion: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Studio: "bg-pink-500/10 text-pink-400 border-pink-500/20",
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="mt-2 text-white/40">{GENERATORS.length} AI generators. One workspace.</p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search generators..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active === cat
                  ? "border-white bg-white text-black font-medium"
                  : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-white/30">No generators found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g) => (
            <Link
              key={g.id}
              href={g.href}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/[0.08]"
            >
              <div className="mb-3">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${CATEGORY_COLORS[g.category] ?? "border-white/10 text-white/40"}`}
                >
                  {g.category}
                </span>
              </div>
              <h3 className="font-semibold group-hover:text-white transition-colors">{g.label}</h3>
              <p className="mt-1 text-sm text-white/40">{g.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
