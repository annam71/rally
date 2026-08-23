"use client";
import { useRef } from "react";
import { TopBar, Shell } from "../Shell";
import { PatternGlyph } from "../icons";
import { formatLast } from "@/lib/format";
import type { WorkoutItem } from "@/lib/types";

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 46 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 2.4 + Math.random() * 1.8,
      rot: Math.random() * 720 - 360 + "deg",
      size: 7 + Math.random() * 8,
      color: ["var(--accent)", "var(--good)", "oklch(0.8 0.12 80)", "var(--accent-ink)"][Math.floor(Math.random() * 4)],
      round: Math.random() > 0.5,
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 50 }}>
      {pieces.map((c, i) => (
        <div
          key={i}
          style={
            {
              position: "absolute",
              top: "-20px",
              left: c.left + "%",
              width: c.size,
              height: c.round ? c.size : c.size * 0.5,
              background: c.color,
              borderRadius: c.round ? "50%" : 2,
              "--r": c.rot,
              animation: `fall ${c.dur}s ${c.delay}s ease-in forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="card" style={{ padding: "18px 22px", minWidth: 96 }}>
      <div style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 700, color: "var(--accent-ink)" }}>{n}</div>
      <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

export default function Done({ user, workout, onHome }: { user: string; workout: WorkoutItem[]; onHome: () => void }) {
  const logged = workout.filter((w) => w.log && w.log.done);
  const totalSets = logged.reduce((s, w) => s + (Number(w.log!.sets) || 0), 0);
  const volume = logged.reduce((s, w) => {
    const weight = Number(w.log!.weight) || 0;
    return s + (weight ? weight * (Number(w.log!.sets) || 0) * (Number(w.log!.reps) || 0) : 0);
  }, 0);
  return (
    <div>
      <Confetti />
      <TopBar user={user} onHome={onHome} />
      <Shell>
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", paddingTop: 16 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "var(--accent-wash)",
              color: "var(--accent-ink)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 22px",
              animation: "pop .5s ease both",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 7.5vw, 46px)", marginBottom: 12 }}>Nice work, {user}!</h1>
          <p style={{ fontSize: 19, color: "var(--muted)", marginTop: 0, marginBottom: 30 }}>
            That&apos;s another one in the books. Saved to your library.
          </p>

          <div className="stat-row" style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
            <Stat n={logged.length} label="exercises" />
            <Stat n={totalSets} label="total sets" />
            {volume > 0 && <Stat n={volume.toLocaleString()} label="lb moved" />}
          </div>

          <div className="card" style={{ padding: "10px 8px", textAlign: "left" }}>
            {logged.map((w, i) => (
              <div
                key={w.pattern}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderBottom: i < logged.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ color: "var(--accent)" }}>
                  <PatternGlyph k={w.pattern} size={20} />
                </div>
                <div style={{ flex: 1, fontWeight: 600 }}>{w.exercise.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 15 }}>
                  {formatLast({
                    sets: Number(w.log!.sets) || 0,
                    reps: Number(w.log!.reps) || 0,
                    weight: Number(w.log!.weight) || 0,
                    unit: w.log!.unit,
                  })}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={onHome} style={{ marginTop: 30 }}>
            Back to start
          </button>
        </div>
      </Shell>
    </div>
  );
}
