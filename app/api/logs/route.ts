import { NextRequest, NextResponse } from "next/server";
import { createLogs } from "@/lib/airtable";
import type { FinishedLogEntry, Unit } from "@/lib/types";

const UNITS: Unit[] = ["lb", "kg", "bw", "sec", "reps"];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { person, date, entries } = (body ?? {}) as {
    person?: unknown;
    date?: unknown;
    entries?: unknown;
  };

  if (typeof person !== "string" || !person.trim()) {
    return NextResponse.json({ error: "person is required" }, { status: 400 });
  }
  if (typeof date !== "string" || !date.trim()) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "entries must be a non-empty array" }, { status: 400 });
  }

  const clean: FinishedLogEntry[] = [];
  for (const e of entries) {
    if (
      !e ||
      typeof e.exerciseId !== "string" ||
      !e.exerciseId ||
      !UNITS.includes(e.unit)
    ) {
      return NextResponse.json({ error: "Malformed log entry" }, { status: 400 });
    }
    clean.push({
      exerciseId: e.exerciseId,
      sets: Number(e.sets) || 0,
      reps: Number(e.reps) || 0,
      weight: Number(e.weight) || 0,
      unit: e.unit,
    });
  }

  try {
    await createLogs(person.trim(), date, clean);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/logs failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save logs" },
      { status: 500 }
    );
  }
}
