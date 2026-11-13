import type { PatternKey } from "./types";

export type Category = "strength" | "mobility" | "kneept";

export const CATEGORIES: { key: Category; label: string; blurb: string }[] = [
  { key: "strength", label: "Strength training", blurb: "Squat, hinge, push, pull, core" },
  { key: "mobility", label: "Mobility exercises", blurb: "Stretch & move well" },
  { key: "kneept", label: "Knee physical therapy", blurb: "Rehab & stability work" },
];

// The 5 strength patterns — used for the strength "what are we training?" grid.
export const PATTERNS: { key: PatternKey; label: string; blurb: string }[] = [
  { key: "squat", label: "Squat", blurb: "Quads & glutes" },
  { key: "hinge", label: "Hinge", blurb: "Hamstrings & glutes" },
  { key: "push", label: "Push", blurb: "Chest & shoulders" },
  { key: "pull", label: "Pull", blurb: "Back & biceps" },
  { key: "core", label: "Core", blurb: "Abs & trunk" },
];

// Label lookup covering every pattern (including mobility/kneept), unlike PATTERNS above.
export const PATTERN_META: Record<PatternKey, { label: string; blurb: string }> = {
  squat: { label: "Squat", blurb: "Quads & glutes" },
  hinge: { label: "Hinge", blurb: "Hamstrings & glutes" },
  push: { label: "Push", blurb: "Chest & shoulders" },
  pull: { label: "Pull", blurb: "Back & biceps" },
  core: { label: "Core", blurb: "Abs & trunk" },
  mobility: { label: "Mobility", blurb: "Stretch & move well" },
  kneept: { label: "Knee PT", blurb: "Rehab & stability" },
};

export const PATTERN_ICON: Record<PatternKey, string> = {
  squat: "M5 4v6M19 4v6M5 13v7M19 13v7M5 13h14",
  hinge: "M4 6h16M7 6c0 6-3 8-3 14M17 6c0 6 3 8 3 14",
  push: "M4 12h7M11 8v8M14 6v12M17 9v6M20 11v2",
  pull: "M20 12h-7M13 8v8M10 6v12M7 9v6M4 11v2",
  core: "M5 12a7 7 0 0114 0 7 7 0 01-14 0zM12 5v14",
  mobility: "M21 12a9 9 0 11-3-6.7M21 3v5h-5",
  kneept: "M12 5v14M5 12h14",
};

// Mobility/Knee PT are simple "did you do it" checklists — no sets/reps/weight tracking.
export function isChecklistPattern(p: PatternKey): boolean {
  return p === "mobility" || p === "kneept";
}
