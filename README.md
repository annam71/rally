# Rally — strength, shuffled

A small private web app that pulls your strength-exercise library from Airtable and shuffles a
balanced session across five movement patterns — squat, hinge, push, pull, core. Logs what you
do back to Airtable so "last time" is always up to date.

This is a real Next.js (App Router) + TypeScript app, wired to Airtable through server-side API
routes so your Airtable API key never reaches the browser. The original visual prototype (static
HTML/React-via-Babel, mock data) is kept for reference in [`design-reference/`](./design-reference).

## 1. Create your Airtable base

Create a new Airtable base with these tables (exact names — or set the `AIRTABLE_*_TABLE` env
vars below if you'd rather use your own names):

**Exercises**
| Field | Type |
|---|---|
| `Name` | Single line text |
| `Pattern` | Single select — options: `squat`, `hinge`, `push`, `pull`, `core` (lowercase) |
| `Bodyweight` | Checkbox |
| `Warmup` | Long text |
| `Notes` | Long text |
| `Video URL` | URL (optional — falls back to a YouTube search link if empty) |

**Logs**
| Field | Type |
|---|---|
| `Person` | Single line text |
| `Exercise` | Link to another record → *Exercises* |
| `Date` | Date |
| `Sets` | Number |
| `Reps` | Number |
| `Weight` | Number |
| `Unit` | Single select — options: `lb`, `kg`, `bw`, `sec`, `reps` |

**People** *(optional — only powers the quick-pick name chips on login)*
| Field | Type |
|---|---|
| `Name` | Single line text |

Seed the **Exercises** table with your library (the `design-reference/exercises.js` mock data is
a good starting list to copy in). Leave **Logs** empty — the app writes to it.

Then create a Personal Access Token at [airtable.com/create/tokens](https://airtable.com/create/tokens)
scoped to `data.records:read` and `data.records:write` for this base, and grab your **Base ID**
from the [Airtable API docs page](https://airtable.com/api) for the base (starts with `app...`).

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste in your AIRTABLE_API_KEY and AIRTABLE_BASE_ID
npm run dev
```

Open http://localhost:3000.

## 3. Put it on the internet (Vercel)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**, and
   import this repo. Vercel auto-detects Next.js — no build config needed.
3. Before the first deploy, add environment variables (Project Settings → Environment Variables,
   or the "Environment Variables" step during import): `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`
   (and any `AIRTABLE_*_TABLE` overrides you need). Add them for both **Production** and
   **Preview**.
4. Deploy. Vercel gives you a `https://your-project.vercel.app` URL immediately, and redeploys
   automatically on every push to this branch/PR.
5. Optional: attach a custom domain under Project Settings → Domains.

Vercel's free tier covers this comfortably for private/family use.

## Project structure

- `app/` — pages and API routes (`app/api/exercises`, `app/api/logs`, `app/api/people`)
- `components/` — the five screens (home → select → review → session → done) plus shared UI
- `lib/airtable.ts` — the only file that talks to Airtable; server-only
- `lib/types.ts`, `lib/patterns.ts`, `lib/format.ts` — shared types and small pure helpers
- `design-reference/` — the original design handoff prototype (not shipped; kept for reference)

## Notes / follow-ups

- Login is name-only (no password) — fine for a small private group, not real auth. If this ever
  needs to be more locked-down, swap `components/screens/Home.tsx` for real auth.
- "Last time" is computed per person from the most recent `Logs` row that links to each exercise.
