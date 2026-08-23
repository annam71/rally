"use client";
import { useState } from "react";
import { TopBar, Shell } from "../Shell";
import { PatternGlyph } from "../icons";
import { PATTERNS } from "@/lib/patterns";
import type { PatternKey } from "@/lib/types";

export default function Select({
  user,
  onHome,
  onGenerate,
}: {
  user: string;
  onHome: () => void;
  onGenerate: (patterns: PatternKey[], bwOnly: boolean) => void;
}) {
  const [selected, setSelected] = useState<PatternKey[]>(() => PATTERNS.map((p) => p.key));
  const [bwOnly, setBwOnly] = useState(false);
  const toggle = (k: PatternKey) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <div>
      <TopBar user={user} onHome={onHome} step={<span>Step 1 of 3</span>} />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 10 }}>
          Hey {user}, what are we training?
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 28 }}>
          Pick the movements for today. We&apos;ll shuffle one exercise from each.
        </p>

        <div
          className="card"
          onClick={() => setBwOnly((v) => !v)}
          style={{
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            marginBottom: 24,
            borderColor: bwOnly ? "var(--accent)" : "var(--border)",
            background: bwOnly ? "var(--accent-wash)" : "var(--surface)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 17 }}>Bodyweight only</div>
            <div style={{ fontSize: 14.5, color: "var(--muted)" }}>
              At the park or traveling? Skip anything that needs a gym.
            </div>
          </div>
          <div
            style={{
              width: 52,
              height: 30,
              borderRadius: 999,
              background: bwOnly ? "var(--accent)" : "var(--border-strong)",
              position: "relative",
              transition: "background .2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: bwOnly ? 25 : 3,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "white",
                transition: "left .2s",
                boxShadow: "0 1px 3px rgba(0,0,0,.2)",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
          {PATTERNS.map((p) => {
            const on = selected.includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => toggle(p.key)}
                style={{
                  textAlign: "left",
                  padding: "20px 18px",
                  borderRadius: 16,
                  cursor: "pointer",
                  border: on ? "2px solid var(--accent)" : "2px solid var(--border)",
                  background: on ? "var(--surface)" : "var(--surface-2)",
                  boxShadow: on ? "var(--shadow)" : "none",
                  transition: "all .15s",
                  position: "relative",
                }}
              >
                <div style={{ color: on ? "var(--accent)" : "var(--faint)", marginBottom: 12 }}>
                  <PatternGlyph k={p.key} size={26} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 18, fontFamily: "var(--font-head)" }}>{p.label}</div>
                <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{p.blurb}</div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: on ? "none" : "2px solid var(--border-strong)",
                    background: on ? "var(--accent)" : "transparent",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {on && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
          <button
            className="btn btn-primary"
            disabled={!selected.length}
            onClick={() => onGenerate(selected, bwOnly)}
            style={{ opacity: selected.length ? 1 : 0.45 }}
          >
            Shuffle my workout →
          </button>
          <span style={{ color: "var(--muted)", fontSize: 15 }}>
            {selected.length} {selected.length === 1 ? "movement" : "movements"}
          </span>
        </div>
      </Shell>
    </div>
  );
}
