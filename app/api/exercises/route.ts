import { NextRequest, NextResponse } from "next/server";
import { fetchExercises, fetchLastLogsForPerson } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const person = req.nextUrl.searchParams.get("person")?.trim();

  try {
    const [exercises, lastLogs] = await Promise.all([
      fetchExercises(),
      person ? fetchLastLogsForPerson(person) : Promise.resolve(new Map()),
    ]);

    const withLast = exercises.map((ex) => ({
      ...ex,
      last: lastLogs.get(ex.id) ?? null,
    }));

    return NextResponse.json({ exercises: withLast });
  } catch (err) {
    console.error("GET /api/exercises failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load exercises" },
      { status: 500 }
    );
  }
}
