import "server-only";
import Airtable from "airtable";
import type { Exercise, FinishedLogEntry, LastLog, PatternKey, Unit } from "./types";

const PATTERN_KEYS: PatternKey[] = ["squat", "hinge", "push", "pull", "core"];
const UNIT_KEYS: Unit[] = ["lb", "kg", "bw", "sec", "reps"];

function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error(
      "Airtable is not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID (see .env.example)."
    );
  }
  return new Airtable({ apiKey }).base(baseId);
}

const exercisesTable = () => getBase()(process.env.AIRTABLE_EXERCISES_TABLE || "Exercises");
const logsTable = () => getBase()(process.env.AIRTABLE_LOGS_TABLE || "Logs");
const peopleTable = () => getBase()(process.env.AIRTABLE_PEOPLE_TABLE || "People");

function normalizePattern(raw: unknown): PatternKey | null {
  const v = String(raw ?? "").trim().toLowerCase();
  return (PATTERN_KEYS as string[]).includes(v) ? (v as PatternKey) : null;
}

function normalizeUnit(raw: unknown): Unit {
  const v = String(raw ?? "").trim().toLowerCase();
  return (UNIT_KEYS as string[]).includes(v) ? (v as Unit) : "lb";
}

export async function fetchExercises(): Promise<Exercise[]> {
  const records = await exercisesTable().select({}).all();
  const out: Exercise[] = [];
  for (const r of records) {
    const pattern = normalizePattern(r.get("Pattern"));
    if (!pattern) continue; // skip malformed rows rather than crash the whole app
    out.push({
      id: r.id,
      name: String(r.get("Name") ?? "Untitled exercise"),
      pattern,
      bodyweight: Boolean(r.get("Bodyweight")),
      warmup: String(r.get("Warmup") ?? ""),
      notes: String(r.get("Notes") ?? ""),
      videoUrl: (r.get("Video URL") as string | undefined) || undefined,
      last: null,
    });
  }
  return out;
}

// Most recent log per exercise for a given person, keyed by exercise record id.
export async function fetchLastLogsForPerson(person: string): Promise<Map<string, LastLog>> {
  const safePerson = person.replace(/"/g, '\\"');
  const records = await logsTable()
    .select({
      filterByFormula: `{Person} = "${safePerson}"`,
      sort: [{ field: "Date", direction: "desc" }],
    })
    .all();

  const last = new Map<string, LastLog>();
  for (const r of records) {
    const linked = r.get("Exercise") as string[] | undefined;
    const exerciseId = linked?.[0];
    if (!exerciseId || last.has(exerciseId)) continue; // already have a more recent one
    last.set(exerciseId, {
      sets: Number(r.get("Sets") ?? 0),
      reps: Number(r.get("Reps") ?? 0),
      weight: Number(r.get("Weight") ?? 0),
      unit: normalizeUnit(r.get("Unit")),
    });
  }
  return last;
}

export async function fetchPeople(): Promise<string[]> {
  try {
    const records = await peopleTable().select({}).all();
    return records
      .map((r) => String(r.get("Name") ?? "").trim())
      .filter(Boolean);
  } catch {
    // People table is optional — the login screen just falls back to free text.
    return [];
  }
}

export async function createLogs(
  person: string,
  date: string,
  entries: FinishedLogEntry[]
): Promise<void> {
  const table = logsTable();
  const rows = entries.map((e) => ({
    fields: {
      Person: person,
      Exercise: [e.exerciseId],
      Date: date,
      Sets: e.sets,
      Reps: e.reps,
      Weight: e.weight,
      Unit: e.unit,
    },
  }));

  // Airtable's create endpoint accepts at most 10 records per call.
  for (let i = 0; i < rows.length; i += 10) {
    await table.create(rows.slice(i, i + 10));
  }
}
