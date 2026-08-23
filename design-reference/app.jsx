// app.jsx — Rally: strength-training shuffle prototype
const { useState, useRef, useEffect } = React;

/* ---------------------------------------------------------------- THEME / TWEAKS */
const ACCENTS = [
  { main: "oklch(0.64 0.12 40)",  ink: "oklch(0.43 0.13 40)",  wash: "oklch(0.95 0.03 45)",  glow: "oklch(0.64 0.12 40 / 0.28)" },   // terracotta
  { main: "oklch(0.6 0.085 150)", ink: "oklch(0.4 0.09 150)",  wash: "oklch(0.95 0.028 150)", glow: "oklch(0.6 0.085 150 / 0.28)" },  // sage
  { main: "oklch(0.58 0.09 235)", ink: "oklch(0.4 0.09 235)",  wash: "oklch(0.95 0.028 235)", glow: "oklch(0.58 0.09 235 / 0.28)" },  // ocean
  { main: "oklch(0.56 0.12 18)",  ink: "oklch(0.4 0.12 18)",   wash: "oklch(0.95 0.03 22)",  glow: "oklch(0.56 0.12 18 / 0.28)" },    // berry
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "oklch(0.64 0.12 40)",
  "headingStyle": "serif",
  "textScale": 17
}/*EDITMODE-END*/;

function applyTheme(t) {
  const a = ACCENTS.find((x) => x.main === t.accent) || ACCENTS[0];
  const r = document.documentElement.style;
  r.setProperty("--accent", a.main);
  r.setProperty("--accent-ink", a.ink);
  r.setProperty("--accent-wash", a.wash);
  r.setProperty("--font-head", t.headingStyle === "serif"
    ? '"Source Serif 4", Georgia, serif'
    : '"Hanken Grotesk", system-ui, sans-serif');
  document.body.style.fontSize = t.textScale + "px";
  // refresh primary-button glow to match accent
  document.querySelectorAll(".btn-primary").forEach((b) => {
    b.style.boxShadow = "0 6px 16px " + a.glow;
  });
}

/* ---------------------------------------------------------------- SMALL PIECES */
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="2" y="9" width="4" height="8" rx="2" fill="var(--accent)" />
        <rect x="20" y="9" width="4" height="8" rx="2" fill="var(--accent)" />
        <rect x="6" y="11" width="14" height="4" rx="2" fill="var(--ink)" />
      </svg>
      <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em" }}>Rally</span>
    </div>
  );
}

function TopBar({ user, onHome, step }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 10, background: "oklch(0.985 0.008 78 / 0.85)",
      backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)",
    }}>
      <div className="topbar-inner" style={{ maxWidth: 760, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onHome} style={{ cursor: "pointer" }}><Logo /></div>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "var(--muted)" }}>
            {step}
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "var(--accent-wash)",
              color: "var(--accent-ink)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15,
            }}>{user[0].toUpperCase()}</div>
          </div>
        )}
      </div>
    </header>
  );
}

function Shell({ children }) {
  return <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 96px" }} className="screen-enter shell">{children}</div>;
}

const PATTERN_ICON = {
  squat: "M5 4v6M19 4v6M5 13v7M19 13v7M5 13h14",
  hinge: "M4 6h16M7 6c0 6-3 8-3 14M17 6c0 6 3 8 3 14",
  push: "M4 12h7M11 8v8M14 6v12M17 9v6M20 11v2",
  pull: "M20 12h-7M13 8v8M10 6v12M7 9v6M4 11v2",
  core: "M5 12a7 7 0 0114 0 7 7 0 01-14 0zM12 5v14",
};
function PatternGlyph({ k, size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATTERN_ICON[k]} />
    </svg>
  );
}

/* ---------------------------------------------------------------- HOME / LOGIN */
function Home({ onLogin }) {
  const [name, setName] = useState("");
  const profiles = ["Alex", "Mom", "Dad", "Sam", "Jordan"];
  const go = () => { if (name.trim()) onLogin(name.trim()); };
  return (
    <div>
      <TopBar />
      <Shell>
        <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto", paddingTop: 32 }}>
          <span className="pill">Strength, shuffled</span>
          <h1 style={{ fontSize: "clamp(34px, 8.5vw, 52px)", marginTop: 22, marginBottom: 16 }}>
            Show up. We'll pick the workout.
          </h1>
          <p style={{ fontSize: 19, color: "var(--muted)", margin: "0 auto 36px", maxWidth: 420 }}>
            Rally pulls from your exercise library and shuffles a balanced session — squat, hinge, push, pull, core.
          </p>

          <div className="card" style={{ padding: 28, textAlign: "left", maxWidth: 420, margin: "0 auto" }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>Who's training?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Your name"
              style={{
                width: "100%", padding: "14px 16px", fontSize: 17, borderRadius: 12,
                border: "1.5px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--ink)", outline: "none",
              }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {profiles.map((p) => (
                <button key={p} onClick={() => setName(p)} className="btn-ghost"
                  style={{ padding: "8px 16px", borderRadius: 999, fontSize: 15, fontWeight: 500,
                           border: name === p ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                           background: name === p ? "var(--accent-wash)" : "var(--surface)",
                           color: name === p ? "var(--accent-ink)" : "var(--muted)" }}>
                  {p}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={go} disabled={!name.trim()}
              style={{ width: "100%", marginTop: 20, opacity: name.trim() ? 1 : 0.45 }}>
              Let's go →
            </button>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--faint)", marginTop: 20 }}>
            Synced with your shared library · for family & friends
          </p>
        </div>
      </Shell>
    </div>
  );
}

/* ---------------------------------------------------------------- SELECT PATTERNS */
function Select({ user, onHome, onGenerate }) {
  const [selected, setSelected] = useState(() => PATTERNS.map((p) => p.key));
  const [bwOnly, setBwOnly] = useState(false);
  const toggle = (k) => setSelected((s) => s.includes(k) ? s.filter((x) => x !== k) : [...s, k]);
  return (
    <div>
      <TopBar user={user} onHome={onHome} step={<span>Step 1 of 3</span>} />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 10 }}>Hey {user}, what are we training?</h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 28 }}>
          Pick the movements for today. We'll shuffle one exercise from each.
        </p>

        {/* BW toggle */}
        <div className="card" onClick={() => setBwOnly((v) => !v)}
          style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 24,
                   borderColor: bwOnly ? "var(--accent)" : "var(--border)", background: bwOnly ? "var(--accent-wash)" : "var(--surface)" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 17 }}>Bodyweight only</div>
            <div style={{ fontSize: 14.5, color: "var(--muted)" }}>At the park or traveling? Skip anything that needs a gym.</div>
          </div>
          <div style={{ width: 52, height: 30, borderRadius: 999, background: bwOnly ? "var(--accent)" : "var(--border-strong)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: bwOnly ? 25 : 3, width: 24, height: 24, borderRadius: "50%", background: "white", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
          {PATTERNS.map((p) => {
            const on = selected.includes(p.key);
            return (
              <button key={p.key} onClick={() => toggle(p.key)}
                style={{ textAlign: "left", padding: "20px 18px", borderRadius: 16, cursor: "pointer",
                         border: on ? "2px solid var(--accent)" : "2px solid var(--border)",
                         background: on ? "var(--surface)" : "var(--surface-2)",
                         boxShadow: on ? "var(--shadow)" : "none", transition: "all .15s", position: "relative" }}>
                <div style={{ color: on ? "var(--accent)" : "var(--faint)", marginBottom: 12 }}><PatternGlyph k={p.key} size={26} /></div>
                <div style={{ fontWeight: 600, fontSize: 18, fontFamily: "var(--font-head)" }}>{p.label}</div>
                <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{p.blurb}</div>
                <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%",
                              border: on ? "none" : "2px solid var(--border-strong)", background: on ? "var(--accent)" : "transparent",
                              display: "grid", placeItems: "center" }}>
                  {on && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
          <button className="btn btn-primary" disabled={!selected.length} onClick={() => onGenerate(selected, bwOnly)} style={{ opacity: selected.length ? 1 : 0.45 }}>
            Shuffle my workout →
          </button>
          <span style={{ color: "var(--muted)", fontSize: 15 }}>{selected.length} {selected.length === 1 ? "movement" : "movements"}</span>
        </div>
      </Shell>
    </div>
  );
}

/* ---------------------------------------------------------------- REVIEW / REGENERATE */
function Review({ user, onHome, workout, bwOnly, onShuffle, onShuffleAll, onStart, onBack }) {
  return (
    <div>
      <TopBar user={user} onHome={onHome} step={<span>Step 2 of 3</span>} />
      <Shell>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 6 }}>Here's your shuffle</h1>
          <button onClick={onShuffleAll} className="btn-ghost" style={{ padding: "9px 18px", borderRadius: 999, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 7 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
            Shuffle all
          </button>
        </div>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 8 }}>
          Don't love one? Shuffle just that movement. {bwOnly && <strong style={{ color: "var(--accent-ink)" }}>Bodyweight only.</strong>}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
          {workout.map((item, i) => {
            const p = PATTERNS.find((x) => x.key === item.pattern);
            return (
              <div key={item.pattern} className="card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent-wash)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <PatternGlyph k={item.pattern} size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--faint)" }}>{p.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--font-head)" }}>{item.exercise.name}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>Last time · {formatLast(item.exercise.last)}</div>
                </div>
                <button onClick={() => onShuffle(i)} title="Shuffle this one"
                  style={{ width: 42, height: 42, borderRadius: 12, border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--muted)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-primary" onClick={onStart}>Start workout →</button>
        </div>
      </Shell>
    </div>
  );
}

/* ---------------------------------------------------------------- SESSION */
function NumberField({ label, value, onChange, step = 1 }) {
  const num = Number(value) || 0;
  return (
    <label style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div className="stepper">
        <button type="button" className="stepper-btn" aria-label={"decrease " + label} onClick={() => onChange(Math.max(0, num - step))}>−</button>
        <input type="number" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="stepper-btn" aria-label={"increase " + label} onClick={() => onChange(num + step)}>+</button>
      </div>
    </label>
  );
}

function ExerciseCard({ item, i, onUpdate, onShuffle }) {
  const ex = item.exercise;
  const isBW = ex.last && (ex.last.unit === "bw" || ex.last.unit === "sec" || ex.last.unit === "reps");
  const timed = ex.last && ex.last.unit === "sec";
  const p = PATTERNS.find((x) => x.key === item.pattern);
  const [open, setOpen] = useState(false);
  const log = item.log;
  const set = (field, val) => onUpdate(i, { ...log, [field]: val });

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", borderColor: log.done ? "var(--accent)" : "var(--border)", transition: "border-color .2s" }}>
      <div style={{ padding: "20px 22px" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-wash)", color: "var(--accent-ink)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <PatternGlyph k={item.pattern} size={23} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--faint)" }}>{p.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-head)", lineHeight: 1.1 }}>{ex.name}</div>
          </div>
          {/* done toggle */}
          <button onClick={() => set("done", !log.done)} title={log.done ? "Marked done" : "Mark done"}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px 8px 11px", borderRadius: 999, flexShrink: 0, fontWeight: 600, fontSize: 14,
                     border: log.done ? "1.5px solid var(--accent)" : "1.5px solid var(--border-strong)",
                     background: log.done ? "var(--accent)" : "var(--surface)", color: log.done ? "white" : "var(--muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            {log.done ? "Done" : "Mark done"}
          </button>
        </div>

        {/* meta row */}
        <div className="ex-indent" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 18px", marginTop: 14 }}>
          <a href={youtubeSearch(ex.name)} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z" /></svg>
            Watch demo
          </a>
          <button onClick={() => setOpen((o) => !o)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontSize: 14.5, fontWeight: 600, color: "var(--muted)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 9l6 6 6-6" /></svg>
            Warm-up & how-to
          </button>
          <button onClick={() => onShuffle(i)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, fontSize: 14.5, fontWeight: 600, color: "var(--muted)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
            Swap
          </button>
        </div>

        {/* collapsible warmup + notes */}
        {open && (
          <div className="ex-indent" style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--surface-2)", border: "1px dashed var(--border-strong)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent-ink)", marginBottom: 4 }}>Warm-up first</div>
              <div style={{ fontSize: 15.5 }}>{ex.warmup}</div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 4 }}>How to do it</div>
              <div style={{ fontSize: 15.5, lineHeight: 1.55 }}>{ex.notes}</div>
            </div>
          </div>
        )}

        {/* last time + inputs */}
        <div className="ex-indent" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "var(--muted)", fontSize: 14.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <span>Last time: <strong style={{ color: "var(--ink)" }}>{formatLast(ex.last)}</strong></span>
          </div>
          <div className="input-row">
            <NumberField label="Sets" value={log.sets} onChange={(v) => set("sets", v)} step={1} />
            <NumberField label={timed ? "Seconds" : "Reps"} value={log.reps} onChange={(v) => set("reps", v)} step={timed ? 5 : 1} />
            {!isBW && <NumberField label={"Weight (" + (ex.last ? ex.last.unit : "lb") + ")"} value={log.weight} onChange={(v) => set("weight", v)} step={5} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Session({ user, onHome, workout, onUpdate, onShuffle, onFinish, onBack }) {
  const doneCount = workout.filter((w) => w.log && w.log.done).length;
  const total = workout.length;
  const pct = (doneCount / total) * 100;
  return (
    <div>
      <TopBar user={user} onHome={onHome} step={<span>{doneCount} of {total} done</span>} />
      <Shell>
        <h1 style={{ fontSize: "clamp(27px, 6.5vw, 38px)", marginBottom: 6 }}>Today's workout</h1>
        <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 0, marginBottom: 18 }}>
          Log each set as you go — jump around however you like. Mark them done to track progress.
        </p>
        <div style={{ height: 6, background: "var(--border)", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: pct + "%", background: "var(--accent)", borderRadius: 999, transition: "width .35s ease" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {workout.map((item, i) => (
            <ExerciseCard key={item.pattern} item={item} i={i} onUpdate={onUpdate} onShuffle={onShuffle} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-primary" onClick={onFinish}>Finish workout 🎉</button>
          {doneCount < total && <span style={{ color: "var(--faint)", fontSize: 14.5 }}>{total - doneCount} still to mark — finish anytime</span>}
        </div>
      </Shell>
    </div>
  );
}

/* ---------------------------------------------------------------- DONE */
function Confetti() {
  const pieces = useRef(Array.from({ length: 46 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 2.4 + Math.random() * 1.8,
    rot: (Math.random() * 720 - 360) + "deg",
    size: 7 + Math.random() * 8,
    color: ["var(--accent)", "var(--good)", "oklch(0.8 0.12 80)", "var(--accent-ink)"][Math.floor(Math.random() * 4)],
    round: Math.random() > 0.5,
  }))).current;
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 50 }}>
      {pieces.map((c, i) => (
        <div key={i} style={{
          position: "absolute", top: "-20px", left: c.left + "%", width: c.size, height: c.round ? c.size : c.size * 0.5,
          background: c.color, borderRadius: c.round ? "50%" : 2, ["--r"]: c.rot,
          animation: `fall ${c.dur}s ${c.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

function Done({ user, workout, onHome }) {
  const logged = workout.filter((w) => w.log && w.log.done);
  const totalSets = logged.reduce((s, w) => s + (w.log.sets || 0), 0);
  const volume = logged.reduce((s, w) => s + (w.log.weight ? w.log.weight * w.log.sets * w.log.reps : 0), 0);
  return (
    <div>
      <Confetti />
      <TopBar user={user} onHome={onHome} />
      <Shell>
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", paddingTop: 16 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--accent-wash)", color: "var(--accent-ink)", display: "grid", placeItems: "center", margin: "0 auto 22px", animation: "pop .5s ease both" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 7.5vw, 46px)", marginBottom: 12 }}>Nice work, {user}!</h1>
          <p style={{ fontSize: 19, color: "var(--muted)", marginTop: 0, marginBottom: 30 }}>
            That's another one in the books. Saved to your library.
          </p>

          <div className="stat-row" style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
            <Stat n={logged.length} label="exercises" />
            <Stat n={totalSets} label="total sets" />
            {volume > 0 && <Stat n={volume.toLocaleString()} label="lb moved" />}
          </div>

          <div className="card" style={{ padding: "10px 8px", textAlign: "left" }}>
            {logged.map((w, i) => (
              <div key={w.pattern} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < logged.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ color: "var(--accent)" }}><PatternGlyph k={w.pattern} size={20} /></div>
                <div style={{ flex: 1, fontWeight: 600 }}>{w.exercise.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 15 }}>{formatLast({ ...w.log })}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={onHome} style={{ marginTop: 30 }}>Back to start</button>
        </div>
      </Shell>
    </div>
  );
}
function Stat({ n, label }) {
  return (
    <div className="card" style={{ padding: "18px 22px", minWidth: 96 }}>
      <div style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 700, color: "var(--accent-ink)" }}>{n}</div>
      <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- APP */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTheme(t); }, [t]);

  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState("");
  const [bwOnly, setBwOnly] = useState(false);
  const [workout, setWorkout] = useState([]);

  const reset = () => { setScreen("home"); setUser(""); setWorkout([]); };

  const defaultLog = (ex) => {
    const isBW = ex.last && (ex.last.unit === "bw" || ex.last.unit === "sec" || ex.last.unit === "reps");
    return {
      sets: ex.last ? ex.last.sets : 3,
      reps: ex.last ? ex.last.reps : 10,
      weight: ex.last && !isBW ? ex.last.weight : 0,
      unit: ex.last ? ex.last.unit : "lb",
      done: false,
    };
  };

  const generate = (patterns, bw) => {
    setBwOnly(bw);
    const ordered = PATTERNS.filter((p) => patterns.includes(p.key)).map((p) => p.key);
    setWorkout(ordered.map((k) => ({ pattern: k, exercise: pickExercise(k, bw), log: null })));
    setScreen("review");
  };
  const reshuffle = (it) => { const ex = pickExercise(it.pattern, bwOnly, it.exercise.name); return { ...it, exercise: ex, log: defaultLog(ex) }; };
  const shuffleOne = (i) => setWorkout((w) => w.map((it, j) => j === i ? reshuffle(it) : it));
  const shuffleAll = () => setWorkout((w) => w.map(reshuffle));
  const startSession = () => {
    setWorkout((w) => w.map((it) => ({ ...it, log: it.log || defaultLog(it.exercise) })));
    setScreen("session");
  };
  const updateLog = (i, log) => setWorkout((w) => w.map((it, j) => j === i ? { ...it, log } : it));

  let view;
  if (screen === "home") view = <Home onLogin={(n) => { setUser(n); setScreen("select"); }} />;
  else if (screen === "select") view = <Select user={user} onHome={reset} onGenerate={generate} />;
  else if (screen === "review") view = <Review user={user} onHome={reset} workout={workout} bwOnly={bwOnly} onShuffle={shuffleOne} onShuffleAll={shuffleAll} onStart={startSession} onBack={() => setScreen("select")} />;
  else if (screen === "session") view = <Session user={user} onHome={reset} workout={workout} onUpdate={updateLog} onShuffle={shuffleOne} onFinish={() => setScreen("done")} onBack={() => setScreen("review")} />;
  else if (screen === "done") view = <Done user={user} workout={workout} onHome={reset} />;

  return (
    <div>
      {view}
      <TweaksPanel>
        <TweakSection label="Look & feel" />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS.map((a) => a.main)} onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Headings" value={t.headingStyle} options={["serif", "sans"]} onChange={(v) => setTweak("headingStyle", v)} />
        <TweakSlider label="Text size" value={t.textScale} min={15} max={21} step={1} unit="px" onChange={(v) => setTweak("textScale", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
