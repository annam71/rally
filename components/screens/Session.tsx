"use client";
import { useState } from "react";
import { TopBar, Shell } from "../Shell";
import { PatternGlyph } from "../icons";
import VideoModal from "../VideoModal";
import { PATTERN_META, isChecklistPattern } from "@/lib/patterns";
import { formatLast, youtubeEmbedUrl } from "@/lib/format";
import type { LogEntry, WorkoutItem } from "@/lib/types";

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number | string;
  onChange: (v: number | string) => void;
  step?: number;
}) {
  const num = Number(value) || 0;
  return (
    <label style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div className="stepper">
        <button
          type="button"
          className="stepper-btn"
          aria-label={"decrease " + label}
          onClick={() => onChange(Math.max(0, num - step))}
        >
          −
        </button>
        <input type="number" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="stepper-btn" aria-label={"increase " + label} onClick={() => onChange(num + step)}>
          +
        </button>
      </div>
    </label>
  );
}

function ExerciseCard({
  item,
  i,
  onUpdate,
  onShuffle,
  onWatchDemo,
}: {
  item: WorkoutItem;
  i: number;
  onUpdate: (i: number, log: LogEntry) => void;
  onShuffle: (i: number) => void;
  onWatchDemo: (url: string) => void;
}) {
  const ex = item.exercise;
  const log = item.log!;
  const checklist = isChecklistPattern(item.pattern);
  const isBW = log.unit === "bw" || log.unit === "sec" || log.unit === "reps";
  const timed = log.unit === "sec";
  const p = PATTERN_META[item.pattern];
  const [open, setOpen] = useState(false);
  const set = (field: keyof LogEntry, val: LogEntry[keyof LogEntry]) => onUpdate(i, { ...log, [field]: val });

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: "hidden", borderColor: log.done ? "var(--accent)" : "var(--border)", transition: "border-color .2s" }}
    >
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          {!checklist && (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--accent-wash)",
                color: "var(--accent-ink)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <PatternGlyph k={item.pattern} size={23} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--faint)" }}>
              {p.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-head)", lineHeight: 1.1 }}>{ex.name}</div>
          </div>
        </div>

        <div className={checklist ? "" : "ex-indent"} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 18px", marginTop: 14 }}>
          {ex.videoUrl && (
            <button
              onClick={() => onWatchDemo(ex.videoUrl!)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontSize: 14.5, fontWeight: 600, color: "var(--accent-ink)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              Watch demo
            </button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontSize: 14.5, fontWeight: 600, color: "var(--muted)" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            Notes
          </button>
          <button
            onClick={() => onShuffle(i)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontSize: 14.5, fontWeight: 600, color: "var(--muted)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Swap
          </button>
        </div>

        {open && (
          <div className={checklist ? "" : "ex-indent"} style={{ marginTop: 14 }}>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 4 }}>
                Notes
              </div>
              <div style={{ fontSize: 15.5, lineHeight: 1.55 }}>{ex.notes}</div>
            </div>
          </div>
        )}

        {!checklist && (
          <div className="ex-indent" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "var(--muted)", fontSize: 14.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>
                Last time: <strong style={{ color: "var(--ink)" }}>{formatLast(ex.last)}</strong>
              </span>
            </div>
            <div className="input-row">
              <NumberField label="Sets" value={log.sets} onChange={(v) => set("sets", v)} step={1} />
              <NumberField label={timed ? "Seconds" : "Reps"} value={log.reps} onChange={(v) => set("reps", v)} step={timed ? 5 : 1} />
              {!isBW && (
                <NumberField label={"Weight (" + log.unit + ")"} value={log.weight} onChange={(v) => set("weight", v)} step={5} />
              )}
            </div>
          </div>
        )}

        <div
          className={checklist ? "" : "ex-indent"}
          style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}
        >
          <button
            onClick={() => set("done", !log.done)}
            title={log.done ? "Marked done" : "Mark done"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 14px 8px 11px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              border: log.done ? "1.5px solid var(--accent)" : "1.5px solid var(--border-strong)",
              background: log.done ? "var(--accent)" : "var(--surface)",
              color: log.done ? "white" : "var(--muted)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {log.done ? "Done" : "Mark done"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Session({
  user,
  onHome,
  workout,
  onUpdate,
  onShuffle,
  onFinish,
  onBack,
  finishing,
}: {
  user: string;
  onHome: () => void;
  workout: WorkoutItem[];
  onUpdate: (i: number, log: LogEntry) => void;
  onShuffle: (i: number) => void;
  onFinish: () => void;
  onBack: () => void;
  finishing: boolean;
}) {
  const [demo, setDemo] = useState<{ embedUrl: string; rawUrl: string } | null>(null);
  const openDemo = (url: string) => {
    const embedUrl = youtubeEmbedUrl(url);
    if (embedUrl) setDemo({ embedUrl, rawUrl: url });
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  const checklistWorkout = workout.length > 0 && isChecklistPattern(workout[0].pattern);
  const doneCount = workout.filter((w) => w.log && w.log.done).length;
  const total = workout.length;
  const pct = total ? (doneCount / total) * 100 : 0;
  return (
    <div>
      <TopBar
        user={user}
        onHome={onHome}
        step={
          <span>
            {doneCount} of {total} done
          </span>
        }
      />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 6 }}>
          {checklistWorkout ? "Today's checklist" : "Today's workout"}
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 18 }}>
          {checklistWorkout
            ? "Jump around however you like. Mark each one off as you go."
            : "Log each set as you go — jump around however you like. Mark them done to track progress."}
        </p>
        <div style={{ height: 6, background: "var(--border)", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: pct + "%", background: "var(--accent)", borderRadius: 999, transition: "width .35s ease" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {workout.map((item, i) => (
            <ExerciseCard key={item.exercise.id} item={item} i={i} onUpdate={onUpdate} onShuffle={onShuffle} onWatchDemo={openDemo} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={onFinish} disabled={finishing} style={{ opacity: finishing ? 0.6 : 1 }}>
            {finishing ? "Saving…" : "Finish workout 🎉"}
          </button>
          {doneCount < total && (
            <span style={{ color: "var(--faint)", fontSize: 14.5 }}>{total - doneCount} still to mark — finish anytime</span>
          )}
        </div>
      </Shell>

      {demo && <VideoModal embedUrl={demo.embedUrl} rawUrl={demo.rawUrl} onClose={() => setDemo(null)} />}
    </div>
  );
}
