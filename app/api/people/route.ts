import { NextResponse } from "next/server";
import { fetchPeople } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const people = await fetchPeople();
    return NextResponse.json({ people });
  } catch (err) {
    console.error("GET /api/people failed:", err);
    return NextResponse.json({ people: [] });
  }
}
