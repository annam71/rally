# Handoff: Rally — Strength-Training Shuffle App

## Overview
Rally is a small web app for a private group (family + friends) that pulls strength
exercises from an **Airtable** library and shuffles a balanced session across five
movement patterns — **squat, hinge, push, pull, core**. For each session it suggests
one exercise per chosen pattern, offers a bodyweight-only mode (for the park/travel),
shows warm-ups + how-to notes + a demo-video link, surfaces what you did last time,
and records what you do today back to Airtable. It ends with a celebration summary.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** —
a working prototype showing the intended look, flow, and behavior. They are **not
production code to ship directly**. The prototype uses in-browser Babel, inline
styles, and a hard-coded mock dataset (`exercises.js`) standing in for Airtable.

Your task is to **recreate these designs in a real codebase** using its established
patterns. If no app exists yet, **Next.js (React) + TypeScript** is the recommended
choice: it handles the Airtable API calls server-side (keeping the API key secret),
which a pure client-side app cannot do safely.

## Fidelity
**High-fidelity.** Colors, typography, spacing, layout, and interactions are final.
Recreate the UI faithfully, then wire it to live Airtable data. Visual variants
(accent color, serif/sans headings, text size) are exposed as a "Tweaks" panel in the
prototype — these are **design exploration controls, not a product feature**. Pick the
defaults you like (terracotta accent, serif headings, 17px base) and drop the panel.

## Screens / Views
The app is a single-page flow with five states held in one `screen` variable:
`home → select → review → session → done`. Content column is **max-width 760px,
centered, 24px side padding**. Sticky translucent top bar (blurred, 1px bottom border).

### 1. Home / Login (`screen === "home"`)
- **Purpose:** Identify who's training (mock auth — replace with real auth/profiles).
- **Layout:** Centered, max-width 540px. Pill label ("Strength, shuffled") → 52px serif
  headline ("Show up. We'll pick the workout.") → 19px muted subtitle → a login card.
- **Login card:** white surface, 16px radius, 28px padding. Label "Who's training?",
  text input, a row of quick-pick name chips, and a full-width primary button "Let's go →"
  (disabled until a name is present). Footnote: "Synced with your shared library".
- **Real version:** replace name chips with the actual group's Airtable "People" records
  or a real login.

### 2. Select Patterns (`screen === "select"`)
- **Purpose:** Choose which movement patterns to train + bodyweight-only toggle.
- **Layout:** 38px serif headline "Hey {name}, what are we training?" → subtitle →
  bodyweight toggle card → responsive grid of 5 pattern cards
  (`grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))`, 14px gap) →
  primary button "Shuffle my workout →" + count.
- **Bodyweight toggle card:** full-width clickable card; iOS-style switch on the right;
  card border + background switch to accent when on. Copy: "Bodyweight only / At the park
  or traveling? Skip anything that needs a gym."
- **Pattern card:** 2px border (accent when selected), pattern glyph, label (serif 18px),
  blurb (e.g. "Quads & glutes"), and a checkbox circle top-right that fills with accent +
  white check when selected. All 5 default to selected.

### 3. Review / Shuffle (`screen === "review"`)
- **Purpose:** See the shuffled picks; swap individuals or reshuffle all before starting.
- **Layout:** 38px headline "Here's your shuffle" with a "Shuffle all" ghost button on the
  right. Subtitle notes bodyweight mode if active. Vertical list (14px gap) of result rows.
- **Result row (card):** accent-wash icon tile (46×46, 12px radius) + glyph, pattern label
  (uppercase 12.5px faint), exercise name (serif 20px), "Last time · {summary}" line, and a
  square shuffle button (42×42) on the right that re-rolls just that pattern.
- **Footer:** "← Back" ghost + "Start workout →" primary.

### 4. Session — all exercises on one screen (`screen === "session"`)
- **Purpose:** Log every exercise on a single scrollable page; the user bounces freely
  between them rather than a one-at-a-time stepper. **(This was an explicit design choice.)**
- **Layout:** 38px headline "Today's workout" → subtitle → thin progress bar (fills with
  count of exercises marked done) → vertical list (16px gap) of **exercise cards** →
  footer "← Back" ghost + "Finish workout 🎉" primary + "{n} still to mark" hint.
- **Exercise card:**
  - Header: 44×44 accent-wash icon tile + glyph; pattern label (uppercase) + exercise name
    (serif 22px); on the right a **"Mark done" toggle pill** (fills solid accent + "Done"
    when active; card border turns accent).
  - Meta row (indented 58px): **Watch demo** link (opens YouTube search in new tab),
    **Warm-up & how-to** disclosure toggle (chevron rotates), **Swap** (re-roll this one).
  - Collapsible section (when open): a dashed "Warm-up first" panel + a "How to do it"
    panel, both from the exercise record.
  - **Last time** line: clock icon + "Last time: {summary}".
  - **Inputs row:** Sets / Reps (or "Seconds" for timed holds) / Weight. Weight is hidden
    for bodyweight/timed/rep-only exercises. Values pre-fill from last-time data and edit
    live into the workout state.
- Bodyweight-only exercises show no weight field; timed exercises (plank, hollow hold) use
  a "Seconds" field; rep-only (dead bug, hanging leg raise) omit weight.

### 5. Done / Celebration (`screen === "done"`)
- **Purpose:** Confirm the session was saved; celebrate.
- **Layout:** CSS confetti (46 falling pieces). Accent-wash check badge (84×84, pop
  animation) → 46px headline "Nice work, {name}!" → subtitle "Saved to your library." →
  a row of **stat cards** (exercises, total sets, lb moved if any weight) → a summary list
  card (one row per exercise: glyph, name, logged summary) → "Back to start" primary.

## Interactions & Behavior
- **Navigation:** linear `home → select → review → session → done`; top-bar logo and
  "Back to start" reset to home. "Back" buttons step backward one screen.
- **Shuffle logic:** for each selected pattern, pick a random exercise from that pattern,
  respecting the bodyweight filter, and avoid repeating the just-shown exercise when a
  larger pool exists. (See `pickExercise` in `exercises.js`.)
- **Live logging:** input changes write straight into `workout[i].log`; "Mark done" flips
  `log.done`, which drives the progress bar. Finishing does **not** require all done.
- **Animations:** screen-enter fade-up (0.4s); progress bar width transition (0.35s);
  disclosure chevron rotate (0.2s); confetti fall (2.4–4.2s); check badge pop (0.5s).
  All respect a calm, warm tone — no infinite loops.
- **Video link:** `youtubeSearch(name)` builds a YouTube search URL; replace with a real
  `Video URL` field from Airtable if you store curated links.
- **Responsive / mobile:** mobile-tuned. Headlines use `clamp()` to scale down on small
  screens. At ≤640px the session card body drops its 58px indent and the Sets/Reps/Weight
  fields stack vertically (full-width). Number fields use −/+ stepper buttons (46–50px touch
  targets; step 1 for sets/reps, 5 for weight/seconds) alongside a numeric-keypad input, so
  logging works one-handed on a phone. Content column is max-width 760px and fluid below that.

## State Management
Single component holds:
- `screen` — which view is shown
- `user` — current person's name (replace with auth/profile id)
- `bwOnly` — bodyweight-only flag
- `workout` — array of `{ pattern, exercise, log }`, where `log` = `{ sets, reps, weight,
  unit, done }`. `log` is pre-filled from the exercise's last-time data when the session starts.

Data flow for the real app:
1. On session start, **read** the exercise library + each exercise's most recent log from
   Airtable (filter by person + bodyweight flag).
2. **Shuffle** server-side or client-side from the fetched pool.
3. On "Finish", **write** one log record per exercise (person, exercise, date, sets, reps,
   weight, unit) back to Airtable.

## Design Tokens
Defined as CSS variables in `index.html` `:root`. Colors are **oklch**; hex approximations
given for convenience.

| Token | Value (oklch) | ≈ Hex | Use |
|---|---|---|---|
| `--bg` | `oklch(0.985 0.008 78)` | `#faf7f2` | page background (warm cream) |
| `--surface` | `oklch(1 0.004 85)` | `#fffefb` | cards |
| `--surface-2` | `oklch(0.975 0.01 78)` | `#f4f0e9` | insets/inputs |
| `--ink` | `oklch(0.28 0.015 60)` | `#2c2620` | primary text |
| `--muted` | `oklch(0.52 0.018 62)` | `#7a7066` | secondary text |
| `--faint` | `oklch(0.66 0.015 65)` | `#a59c90` | tertiary text |
| `--border` | `oklch(0.91 0.012 72)` | `#e8e2d8` | card borders |
| `--border-strong` | `oklch(0.85 0.015 70)` | `#d6cdbf` | input borders |
| `--accent` (terracotta) | `oklch(0.64 0.12 40)` | `#c2683f` | primary actions |
| `--accent-ink` | `oklch(0.43 0.13 40)` | `#8a4527` | accent text |
| `--accent-wash` | `oklch(0.95 0.03 45)` | `#f6e7df` | accent tint bg |
| `--good` | `oklch(0.62 0.11 150)` | `#3a9b6e` | confetti/success |

Alternate accents offered in the prototype (same L/C, varied hue): **sage**
`oklch(0.6 0.085 150)`, **ocean** `oklch(0.58 0.09 235)`, **berry** `oklch(0.56 0.12 18)`.

- **Type:** headings = **Source Serif 4** (weights 400–700); body = **Hanken Grotesk**
  (400–700). Base 17px, line-height 1.5. Headlines: 52 / 46 / 42 / 38px; card titles 20–22px.
- **Radius:** cards 16px; inner panels/inputs 12px; pills/buttons 999px.
- **Shadow:** `--shadow: 0 1px 2px oklch(0.4 0.02 60 / .04), 0 8px 24px oklch(0.4 0.02 60 / .06)`.
- **Spacing:** content max-width 760px; 24px gutters; card padding 20–22px; common gaps 12–16px.

## Assets
- **Fonts:** Google Fonts — Source Serif 4, Hanken Grotesk (swap for your app's font loader).
- **Icons:** all inline SVGs (pattern glyphs, play, shuffle, check, clock, chevron). No image
  files. Pattern glyphs are simple custom paths in `PATTERN_ICON` — fine to replace with your
  icon set.
- **No raster images.** Demo videos are external YouTube links.

## Airtable Schema (suggested)
Mirrors the mock in `exercises.js`:
- **Exercises** table: `Name`, `Pattern` (single-select: squat/hinge/push/pull/core),
  `Bodyweight` (checkbox), `Warmup` (long text), `Notes` (long text), `Video URL` (url).
- **Logs** table: `Person` (link), `Exercise` (link), `Date`, `Sets` (number), `Reps`
  (number), `Weight` (number), `Unit` (single-select: lb/kg/bw/sec/reps).
- "Last time" = most recent Logs row for that Person + Exercise.
> Keep the Airtable API key **server-side** (env var). Never ship it in client JS.

## Files
- `index.html` — page shell, fonts, all CSS variables + base styles, script loads.
- `app.jsx` — the full React app: theme, all five screens, state machine.
- `exercises.js` — mock Airtable dataset + helpers (`pickExercise`, `formatLast`,
  `youtubeSearch`, `PATTERNS`). **Replace this with real Airtable fetches.**
- `tweaks-panel.jsx` — design-exploration controls only; not part of the product.
