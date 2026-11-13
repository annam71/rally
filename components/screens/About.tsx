"use client";
import { TopBar, Shell } from "../Shell";

export default function About({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <TopBar onHome={onBack} />
      <Shell>
        <button
          className="btn-ghost"
          onClick={onBack}
          style={{ padding: "9px 18px", borderRadius: 999, fontSize: 15, fontWeight: 600, marginBottom: 24 }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 24 }}>About Rally</h1>

        <div className="card" style={{ padding: "22px 24px", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontFamily: "var(--font-head)", fontWeight: 600, marginBottom: 8 }}>
            About the exercises
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            This library is put together by our family, not a certified trainer. Use your own judgment on
            form and weight, and treat the demo videos as general reference, not professional instruction.
          </p>
        </div>

        <div className="card" style={{ padding: "22px 24px", borderColor: "var(--accent)" }}>
          <h2
            style={{
              fontSize: 18,
              fontFamily: "var(--font-head)",
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--accent-ink)",
            }}
          >
            Talk to your doctor
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Check with a doctor before starting any new exercise routine, especially if you have a health
            condition, are pregnant, or are recovering from an injury. Rally isn&apos;t medical or fitness
            advice — it&apos;s just a way to keep things from getting stale.
          </p>
        </div>
      </Shell>
    </div>
  );
}
