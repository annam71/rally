import { PATTERN_ICON } from "@/lib/patterns";
import type { PatternKey } from "@/lib/types";

export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="2" y="9" width="4" height="8" rx="2" fill="var(--accent)" />
        <rect x="20" y="9" width="4" height="8" rx="2" fill="var(--accent)" />
        <rect x="6" y="11" width="14" height="4" rx="2" fill="var(--ink)" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: "-0.02em",
        }}
      >
        Rally
      </span>
    </div>
  );
}

export function PatternGlyph({
  k,
  size = 22,
  color = "currentColor",
}: {
  k: PatternKey;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATTERN_ICON[k]} />
    </svg>
  );
}
