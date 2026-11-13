"use client";
import { TopBar, Shell } from "../Shell";
import { CATEGORIES, type Category } from "@/lib/patterns";

export default function CategoryScreen({
  user,
  onHome,
  onSelect,
}: {
  user: string;
  onHome: () => void;
  onSelect: (c: Category) => void;
}) {
  return (
    <div>
      <TopBar user={user} onHome={onHome} />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 10 }}>
          Hey {user}, what kind of exercise today?
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 28 }}>
          Pick where you want to start.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => onSelect(c.key)}
              className="card"
              style={{
                textAlign: "left",
                padding: "22px 24px",
                border: "2px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 20, fontFamily: "var(--font-head)" }}>{c.label}</div>
                <div style={{ fontSize: 14.5, color: "var(--muted)", marginTop: 2 }}>{c.blurb}</div>
              </div>
              <span style={{ color: "var(--faint)", fontSize: 22, flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </Shell>
    </div>
  );
}
