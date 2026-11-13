import type { Exercise, LastLog, PatternKey } from "./types";

export function youtubeSearch(name: string): string {
  return (
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent("how to " + name + " proper form")
  );
}

// Returns an embeddable youtube.com/embed/<id> URL if the given URL is a recognizable
// YouTube link (watch/shorts/youtu.be/already-embed), otherwise null.
export function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatLast(last: LastLog | null | undefined): string {
  if (!last) return "First time — no record yet.";
  if (last.unit === "bw") return `${last.sets} × ${last.reps} reps (bodyweight)`;
  if (last.unit === "sec") return `${last.sets} × ${last.reps}s hold`;
  if (last.unit === "reps") return `${last.sets} × ${last.reps} reps`;
  return `${last.sets} × ${last.reps} @ ${last.weight} ${last.unit}`;
}

// Pick one random exercise for a pattern, respecting the bodyweight filter and
// avoiding excludeId when a larger pool exists. (Strength patterns only.)
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

// Same idea as pickExercise, but for checklist patterns (mobility/kneept) — no
// bodyweight filter, since that concept doesn't apply to those categories.
export function pickChecklistExercise(
  library: Exercise[],
  pattern: PatternKey,
  excludeId?: string
): Exercise | null {
  let pool = library.filter((e) => e.pattern === pattern);
  if (pool.length > 1 && excludeId) {
    const filtered = pool.filter((e) => e.id !== excludeId);
    if (filtered.length) pool = filtered;
  }
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Sorts by the Airtable "Order" field (nulls last), falling back to name so the
// order is still stable when Order is missing or tied.
function byOrder(a: Exercise, b: Exercise): number {
  if (a.order != null && b.order != null && a.order !== b.order) return a.order - b.order;
  if (a.order != null && b.order == null) return -1;
  if (a.order == null && b.order != null) return 1;
  return a.name.localeCompare(b.name);
}

// Builds the exercise set for a checklist category (mobility/kneept). Mobility is a
// fixed sequence — always the first `count` by the Order field, never random, so
// doing "5" always starts the same routine from the top. Knee PT stays randomized.
export function pickChecklistSet(library: Exercise[], pattern: PatternKey, count: number): Exercise[] {
  const pool = library.filter((e) => e.pattern === pattern);
  const n = Math.max(0, Math.min(count, pool.length));
  if (pattern === "mobility") {
    return [...pool].sort(byOrder).slice(0, n);
  }
  return shuffle(pool).slice(0, n);
}
