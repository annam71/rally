"use client";
import { useState } from "react";
import { TopBar, Shell } from "../Shell";

export default function Home({
  people,
  onLogin,
  onAbout,
}: {
  people: string[];
  onLogin: (name: string) => void;
  onAbout: () => void;
}) {
  const [name, setName] = useState("");
  const go = () => {
    if (name.trim()) onLogin(name.trim());
  };
  return (
    <div>
      <TopBar />
      <Shell>
        <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto", paddingTop: 32 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Exercise, shuffled
          </span>
          <h1 style={{ fontSize: "clamp(34px, 8.5vw, 52px)", marginTop: 22, marginBottom: 16 }}>
            Same five exercises again? Let&apos;s not.
          </h1>
          <p style={{ fontSize: 19, color: "var(--muted)", margin: "0 auto 36px", maxWidth: 420 }}>
            Rally shuffles your library into a fresh mix every time, so it never feels like the same workout
            twice.
          </p>

          <div className="card" style={{ padding: 28, textAlign: "left", maxWidth: 420, margin: "0 auto" }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>
              Who&apos;s training?
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 17,
                borderRadius: 12,
                border: "1.5px solid var(--border-strong)",
                background: "var(--surface-2)",
                color: "var(--ink)",
                outline: "none",
              }}
            />
            {people.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {people.map((p) => (
                  <button
                    key={p}
                    onClick={() => setName(p)}
                    className="btn-ghost"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 15,
                      fontWeight: 500,
                      border: name === p ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      background: name === p ? "var(--accent-wash)" : "var(--surface)",
                      color: name === p ? "var(--accent-ink)" : "var(--muted)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={go}
              disabled={!name.trim()}
              style={{ width: "100%", marginTop: 20, opacity: name.trim() ? 1 : 0.45 }}
            >
              Let&apos;s go →
            </button>
          </div>
          <button
            onClick={onAbout}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              marginTop: 20,
              fontSize: 13.5,
              color: "var(--faint)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            About this app
          </button>
        </div>
      </Shell>
    </div>
  );
}
