"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TalentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).slice(0, 8);
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Character Lock</h1>
        <p className="mt-2 text-white/40">
          Upload 2–8 reference photos to lock your character&apos;s identity across every generation.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Character name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/60">Character name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/60">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your character's style, personality, look..."
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/60">
            Reference photos <span className="text-white/30">(2–8 photos)</span>
          </label>
          <label
            htmlFor="photo-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center hover:border-white/40 transition-colors"
          >
            <span className="text-3xl mb-2">📁</span>
            <span className="text-sm text-white/50">
              Drop photos here or click to upload
            </span>
            <span className="mt-1 text-xs text-white/30">JPG, PNG — max 10MB each</span>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image src={url} alt={`ref ${i + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))}
              <p className="col-span-4 text-xs text-white/30">{files.length} photo(s) selected</p>
            </div>
          )}
        </div>

        <Button
          size="lg"
          disabled={files.length < 2 || !name.trim()}
          className="mt-2"
        >
          Create character
        </Button>

        {files.length > 0 && files.length < 2 && (
          <p className="text-xs text-amber-400/70">Upload at least 2 reference photos.</p>
        )}
      </div>
    </div>
  );
}
