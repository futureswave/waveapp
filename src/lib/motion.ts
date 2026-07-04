export interface MotionPreset {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export const MOTION_PRESETS: MotionPreset[] = [
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

export function getMotionPreset(id: string | null | undefined): MotionPreset | undefined {
  if (!id) return undefined;
  return MOTION_PRESETS.find((p) => p.id === id);
}

/** Prompt prefix injected when a camera preset is chosen. */
export function motionPromptPrefix(preset: MotionPreset): string {
  return `[Camera movement: ${preset.label} — ${preset.desc}] `;
}
