"use client";
import { useEffect, useState } from "react";
import { TopBar, Shell } from "./Shell";
import Home from "./screens/Home";
import Select from "./screens/Select";
import Review from "./screens/Review";
import Session from "./screens/Session";
import Done from "./screens/Done";
import { PATTERNS } from "@/lib/patterns";
import { pickExercise } from "@/lib/format";
import type { Exercise, LogEntry, PatternKey, WorkoutItem } from "@/lib/types";

type Screen = "home" | "select" | "review" | "session" | "done";

function defaultLog(ex: Exercise): LogEntry {
  const isBW = ex.last && (ex.last.unit === "bw" || ex.last.unit === "sec" || ex.last.unit === "reps");
  return {
    sets: ex.last ? ex.last.sets : 3,
    reps: ex.last ? ex.last.reps : 10,
    weight: ex.last && !isBW ? ex.last.weight : 0,
    unit: ex.last ? ex.last.unit : "lb",
    done: false,
  };
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBar />
      <Shell>
        <div style={{ textAlign: "center", paddingTop: 80, color: "var(--muted)", fontSize: 17 }}>{children}</div>
      </Shell>
    </div>
  );
}

export default function RallyApp() {
  const [people, setPeople] = useState<string[]>([]);
  const [screen, setScreen] = useState<Screen>("home");
  const [user, setUser] = useState("");
  const [bwOnly, setBwOnly] = useState(false);
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [workout, setWorkout] = useState<WorkoutItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/people")
      .then((r) => r.json())
      .then((data) => setPeople(Array.isArray(data.people) ? data.people : []))
      .catch(() => setPeople([]));
  }, []);

  const reset = () => {
    setScreen("home");
    setUser("");
    setWorkout([]);
    setError(null);
  };

  const login = async (name: string) => {
    setUser(name);
    setLoadingLibrary(true);
    setError(null);
    try {
      const res = await fetch(`/api/exercises?person=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load your exercise library.");
      setLibrary(data.exercises as Exercise[]);
      setScreen("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong loading your library.");
    } finally {
      setLoadingLibrary(false);
    }
  };

  const generate = (patterns: PatternKey[], bw: boolean) => {
    setBwOnly(bw);
    const ordered = PATTERNS.filter((p) => patterns.includes(p.key)).map((p) => p.key);
    const items = ordered
      .map((k): WorkoutItem | null => {
        const ex = pickExercise(library, k, bw);
        return ex ? { pattern: k, exercise: ex, log: null } : null;
      })
      .filter((x): x is WorkoutItem => x !== null);
    setWorkout(items);
    setScreen("review");
  };

  const reshuffle = (it: WorkoutItem): WorkoutItem => {
    const ex = pickExercise(library, it.pattern, bwOnly, it.exercise.id) || it.exercise;
    return { ...it, exercise: ex, log: defaultLog(ex) };
  };
  const shuffleOne = (i: number) => setWorkout((w) => w.map((it, j) => (j === i ? reshuffle(it) : it)));
  const shuffleAll = () => setWorkout((w) => w.map(reshuffle));
  const startSession = () => {
    setWorkout((w) => w.map((it) => ({ ...it, log: it.log || defaultLog(it.exercise) })));
    setScreen("session");
  };
  const updateLog = (i: number, log: LogEntry) => setWorkout((w) => w.map((it, j) => (j === i ? { ...it, log } : it)));

  const finish = async () => {
    setFinishing(true);
    setError(null);
    const entries = workout
      .filter((w) => w.log)
      .map((w) => ({
        exerciseId: w.exercise.id,
        sets: Number(w.log!.sets) || 0,
        reps: Number(w.log!.reps) || 0,
        weight: Number(w.log!.weight) || 0,
        unit: w.log!.unit,
      }));
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person: user, date: new Date().toISOString().slice(0, 10), entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save your workout.");
      setScreen("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your workout.");
    } finally {
      setFinishing(false);
    }
  };

  if (screen === "home" && loadingLibrary) {
    return <CenteredMessage>Loading your library…</CenteredMessage>;
  }

  if (error && screen === "home") {
    return (
      <CenteredMessage>
        <p style={{ color: "var(--accent-ink)", fontWeight: 600, marginBottom: 12 }}>{error}</p>
        <button className="btn btn-ghost" onClick={() => setError(null)}>
          Try again
        </button>
      </CenteredMessage>
    );
  }

  if (screen === "home") return <Home people={people} onLogin={login} />;
  if (screen === "select") return <Select user={user} onHome={reset} onGenerate={generate} />;
  if (screen === "review")
    return (
      <Review
        user={user}
        onHome={reset}
        workout={workout}
        bwOnly={bwOnly}
        onShuffle={shuffleOne}
        onShuffleAll={shuffleAll}
        onStart={startSession}
        onBack={() => setScreen("select")}
      />
    );
  if (screen === "session")
    return (
      <div>
        {error && (
          <div style={{ background: "var(--accent-wash)", color: "var(--accent-ink)", textAlign: "center", padding: "10px 16px", fontSize: 14.5 }}>
            {error}
          </div>
        )}
        <Session
          user={user}
          onHome={reset}
          workout={workout}
          onUpdate={updateLog}
          onShuffle={shuffleOne}
          onFinish={finish}
          onBack={() => setScreen("review")}
          finishing={finishing}
        />
      </div>
    );
  if (screen === "done") return <Done user={user} workout={workout} onHome={reset} />;

  return null;
}
