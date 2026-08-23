import type { PatternKey } from "./types";

export const PATTERNS: { key: PatternKey; label: string; blurb: string }[] = [
  { key: "squat", label: "Squat", blurb: "Quads & glutes" },
  { key: "hinge", label: "Hinge", blurb: "Hamstrings & glutes" },
  { key: "push", label: "Push", blurb: "Chest & shoulders" },
  { key: "pull", label: "Pull", blurb: "Back & biceps" },
  { key: "core", label: "Core", blurb: "Abs & trunk" },
];

export const PATTERN_ICON: Record<PatternKey, string> = {
  squat: "M5 4v6M19 4v6M5 13v7M19 13v7M5 13h14",
  hinge: "M4 6h16M7 6c0 6-3 8-3 14M17 6c0 6 3 8 3 14",
  push: "M4 12h7M11 8v8M14 6v12M17 9v6M20 11v2",
  pull: "M20 12h-7M13 8v8M10 6v12M7 9v6M4 11v2",
  core: "M5 12a7 7 0 0114 0 7 7 0 01-14 0zM12 5v14",
};
