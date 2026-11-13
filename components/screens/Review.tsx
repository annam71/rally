"use client";
import { TopBar, Shell } from "../Shell";
import { PatternGlyph } from "../icons";
import { PATTERN_META, isChecklistPattern } from "@/lib/patterns";
import { formatLast } from "@/lib/format";
import type { WorkoutItem } from "@/lib/types";

export default function Review({
  user,
  onHome,
  workout,
  bwOnly,
  onShuffle,
  onShuffleAll,
  onStart,
  onBack,
}: {
  user: string;
  onHome: () => void;
  workout: WorkoutItem[];
  bwOnly: boolean;
  onShuffle: (i: number) => void;
  onShuffleAll: () => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <TopBar user={user} onHome={onHome} step={<span>Step 2 of 3</span>} />
      <Shell>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 6 }}>Here&apos;s your shuffle</h1>
          <button
            onClick={onShuffleAll}
            className="btn-ghost"
            style={{ padding: "9px 18px", borderRadius: 999, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 7 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Shuffle all
          </button>
        </div>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 8 }}>
          Don&apos;t love one? Shuffle just that movement.{" "}
          {bwOnly && <strong style={{ color: "var(--accent-ink)" }}>Bodyweight only.</strong>}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
          {workout.map((item, i) => {
            const p = PATTERN_META[item.pattern];
            const checklist = isChecklistPattern(item.pattern);
            return (
              <div key={item.exercise.id} className="card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "var(--accent-wash)",
                    color: "var(--accent-ink)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <PatternGlyph k={item.pattern} size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--faint)" }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-head)" }}>{item.exercise.name}</div>
                  {!checklist && (
                    <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>
                      Last time · {formatLast(item.exercise.last)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onShuffle(i)}
                  title="Shuffle this one"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    border: "1.5px solid var(--border-strong)",
                    background: "var(--surface)",
                    color: "var(--muted)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={onStart}>
            Start workout →
          </button>
        </div>
      </Shell>
    </div>
  );
}
