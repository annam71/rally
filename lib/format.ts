import type { Exercise, LastLog, PatternKey } from "./types";

export function youtubeSearch(name: string): string {
  return (
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent("how to " + name + " proper form")
  );
}

export function formatLast(last: LastLog | null | undefined): string {
  if (!last) return "First time — no record yet.";
  if (last.unit === "bw") return `${last.sets} × ${last.reps} reps (bodyweight)`;
  if (last.unit === "sec") return `${last.sets} × ${last.reps}s hold`;
  if (last.unit === "reps") return `${last.sets} × ${last.reps} reps`;
  return `${last.sets} × ${last.reps} @ ${last.weight} ${last.unit}`;
}

// Pick one random exercise for a pattern, respecting the bodyweight filter and
// avoiding excludeId when a larger pool exists.
export function pickExercise(
  library: Exercise[],
  pattern: PatternKey,
  bwOnly: boolean,
  excludeId?: string
): Exercise | null {
  let pool = library.filter((e) => e.pattern === pattern && (!bwOnly || e.bodyweight));
  if (pool.length > 1 && excludeId) {
    const filtered = pool.filter((e) => e.id !== excludeId);
    if (filtered.length) pool = filtered;
  }
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
