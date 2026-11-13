"use client";
import { useState } from "react";
import { TopBar, Shell } from "../Shell";

const LABELS: Record<"mobility" | "kneept", string> = {
  mobility: "mobility exercises",
  kneept: "knee PT exercises",
};

export default function CountPicker({
  user,
  category,
  poolSize,
  onHome,
  onBack,
  onContinue,
}: {
  user: string;
  category: "mobility" | "kneept";
  poolSize: number;
  onHome: () => void;
  onBack: () => void;
  onContinue: (count: number) => void;
}) {
  const [count, setCount] = useState(() => Math.max(1, Math.min(5, poolSize)));
  const label = LABELS[category];

  return (
    <div>
      <TopBar user={user} onHome={onHome} />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 10 }}>
          Hey {user}, how many {label} do you want to do?
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 28 }}>
          {poolSize > 0
            ? `${poolSize} in your library right now.`
            : "No exercises found for this category yet — add some in Airtable first."}
        </p>

        {poolSize > 0 ? (
          <>
            <div className="card" style={{ padding: "20px 22px", maxWidth: 320 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>
                Number of exercises
              </div>
              <div className="stepper">
                <button type="button" className="stepper-btn" onClick={() => setCount((c) => Math.max(1, c - 1))}>
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(poolSize, Number(e.target.value) || 1)))}
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setCount((c) => Math.min(poolSize, c + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "nowrap", alignItems: "center" }}>
              <button className="btn btn-ghost" onClick={onBack}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={() => onContinue(count)}>
                Let&apos;s go →
              </button>
            </div>
          </>
        ) : (
          <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: 8 }}>
            ← Back
          </button>
        )}
      </Shell>
    </div>
  );
}
