// exercises.js — mock AirTable exercise library + helpers
// Movement patterns: squat, hinge, push, pull, core
// Each exercise: name, pattern, bw (bodyweight-friendly), warmup, notes, video (YouTube search), last (last session log)

const EXERCISE_DB = [
  // ---------- SQUAT ----------
  { name: "Goblet Squat", pattern: "squat", bw: false,
    warmup: "Bodyweight squats — 2 sets of 10, slow and controlled.",
    notes: "Hold a single dumbbell or kettlebell at chest height. Sit straight down between your hips, knees tracking over toes. Keep the chest tall.",
    last: { weight: 35, unit: "lb", sets: 3, reps: 10 } },
  { name: "Barbell Back Squat", pattern: "squat", bw: false,
    warmup: "Empty bar squats — 1 set of 8, then 50% working weight for 5.",
    notes: "Bar rests on the upper back, not the neck. Brace your core, break at the hips and knees together. Drive through mid-foot.",
    last: { weight: 135, unit: "lb", sets: 3, reps: 8 } },
  { name: "Bulgarian Split Squat", pattern: "squat", bw: false,
    warmup: "Walking lunges — 2 sets of 8 per leg.",
    notes: "Rear foot elevated on a bench. Keep most of the weight on the front leg. Drop straight down, torso slightly forward.",
    last: { weight: 25, unit: "lb", sets: 3, reps: 8 } },
  { name: "Bodyweight Squat", pattern: "squat", bw: true,
    warmup: "Leg swings and ankle circles — 30 seconds each side.",
    notes: "Feet shoulder-width. Sit back and down until thighs are parallel. Arms forward for balance. Add tempo (3 sec down) to make it harder.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 20 } },
  { name: "Reverse Lunge", pattern: "squat", bw: true,
    warmup: "Hip circles and 10 bodyweight squats.",
    notes: "Step back into a lunge, front knee over ankle. Push through the front heel to return. Easier on the knees than forward lunges.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 12 } },
  { name: "Step-Up", pattern: "squat", bw: true,
    warmup: "Marching in place — 30 seconds, then 8 air squats.",
    notes: "Use a sturdy bench or box. Drive through the top foot, don't push off the bottom one. Control the way down.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 12 } },

  // ---------- HINGE ----------
  { name: "Romanian Deadlift", pattern: "hinge", bw: false,
    warmup: "Bodyweight good mornings — 2 sets of 10.",
    notes: "Soft knees, push hips back, bar stays close to legs. Feel the stretch in the hamstrings, then drive hips forward. Flat back throughout.",
    last: { weight: 95, unit: "lb", sets: 3, reps: 10 } },
  { name: "Kettlebell Swing", pattern: "hinge", bw: false,
    warmup: "Hip hinges with no weight — 2 sets of 12.",
    notes: "It's a hinge, not a squat. Snap the hips forward to float the bell to chest height. Let it swing back between the legs.",
    last: { weight: 35, unit: "lb", sets: 4, reps: 15 } },
  { name: "Hip Thrust", pattern: "hinge", bw: false,
    warmup: "Bodyweight glute bridges — 2 sets of 15.",
    notes: "Upper back on a bench, bar across the hips (use a pad). Drive hips up until thighs are level, squeeze the glutes hard at the top.",
    last: { weight: 115, unit: "lb", sets: 3, reps: 12 } },
  { name: "Glute Bridge", pattern: "hinge", bw: true,
    warmup: "Cat-cow and 10 pelvic tilts.",
    notes: "Lie on your back, feet flat. Drive hips toward the ceiling, squeeze glutes. Pause 2 seconds at the top. Single-leg to progress.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 20 } },
  { name: "Single-Leg RDL", pattern: "hinge", bw: true,
    warmup: "Standing balance holds — 20 seconds per leg.",
    notes: "Stand on one leg, hinge forward letting the back leg extend behind you. Keep hips square. Move slowly — it's about balance and control.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 10 } },
  { name: "Bodyweight Good Morning", pattern: "hinge", bw: true,
    warmup: "Cat-cow — 30 seconds, then 10 standing hip hinges.",
    notes: "Hands behind head, soft knees. Hinge at the hips with a flat back until torso is near parallel, then stand tall.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 15 } },

  // ---------- PUSH ----------
  { name: "Dumbbell Bench Press", pattern: "push", bw: false,
    warmup: "Band pull-aparts — 2 sets of 15, then light press for 8.",
    notes: "Lower the dumbbells to chest level, elbows about 45° from the body. Press up and slightly together. Keep wrists stacked over elbows.",
    last: { weight: 40, unit: "lb", sets: 3, reps: 10 } },
  { name: "Overhead Press", pattern: "push", bw: false,
    warmup: "Arm circles and band dislocates — 1 minute.",
    notes: "Brace the core, press the weight straight overhead. Don't lean back — squeeze glutes to stay stable. Bar/dumbbells finish over the ears.",
    last: { weight: 65, unit: "lb", sets: 3, reps: 8 } },
  { name: "Incline Dumbbell Press", pattern: "push", bw: false,
    warmup: "Band pull-aparts — 2 sets of 15.",
    notes: "Bench at ~30°. Press up over the upper chest. A lower incline targets more chest, steeper hits more shoulder.",
    last: { weight: 35, unit: "lb", sets: 3, reps: 10 } },
  { name: "Push-Up", pattern: "push", bw: true,
    warmup: "Shoulder taps and 5 slow scapular push-ups.",
    notes: "Hands under shoulders, body in a straight line. Lower until chest nearly touches, elbows ~45°. Drop to knees to scale, elevate hands to make easier.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 15 } },
  { name: "Pike Push-Up", pattern: "push", bw: true,
    warmup: "Arm circles and 8 regular push-ups.",
    notes: "Start in a downward-dog shape. Bend elbows to lower the crown of your head toward the floor. Great shoulder builder without weights.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 10 } },
  { name: "Bench Dip", pattern: "push", bw: true,
    warmup: "Wrist circles and 10 push-ups.",
    notes: "Hands on a bench behind you, legs out front. Lower until elbows are ~90°, then press back up. Bend knees to make it easier.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 12 } },

  // ---------- PULL ----------
  { name: "One-Arm Dumbbell Row", pattern: "pull", bw: false,
    warmup: "Band pull-aparts — 2 sets of 15.",
    notes: "Knee and hand on a bench, flat back. Pull the dumbbell to the hip, leading with the elbow. Squeeze the shoulder blade, control the lower.",
    last: { weight: 45, unit: "lb", sets: 3, reps: 10 } },
  { name: "Lat Pulldown", pattern: "pull", bw: false,
    warmup: "Band lat activations — 2 sets of 12.",
    notes: "Slight lean back, pull the bar to the upper chest leading with the elbows. Think about driving elbows down, not pulling with the hands.",
    last: { weight: 90, unit: "lb", sets: 3, reps: 12 } },
  { name: "Barbell Row", pattern: "pull", bw: false,
    warmup: "Bodyweight hip hinges and band rows — 2 sets of 12.",
    notes: "Hinge to ~45°, flat back. Pull the bar to the lower ribs, squeeze the blades together, lower under control. Keep the core tight.",
    last: { weight: 95, unit: "lb", sets: 3, reps: 10 } },
  { name: "Inverted Row", pattern: "pull", bw: true,
    warmup: "Scapular pulls — 2 sets of 8.",
    notes: "Bar at hip height (or use a sturdy table). Body straight, pull chest to the bar, squeeze the blades. Walk feet forward to make it harder.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 12 } },
  { name: "Pull-Up", pattern: "pull", bw: true,
    warmup: "Dead hangs — 2 x 15 seconds, then band-assisted reps.",
    notes: "Full hang to start. Pull until the chin clears the bar, lead with the chest. Use a band or do negatives to build up.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 6 } },
  { name: "Doorway / Towel Row", pattern: "pull", bw: true,
    warmup: "Arm swings and 10 band pull-aparts.",
    notes: "Loop a towel around a sturdy post, lean back holding both ends. Pull yourself in, squeezing the back. Great when no bar is available.",
    last: { weight: 0, unit: "bw", sets: 3, reps: 15 } },

  // ---------- CORE ----------
  { name: "Cable / Band Crunch", pattern: "core", bw: false,
    warmup: "Dead bugs — 2 sets of 8 per side.",
    notes: "Kneel, hold the rope at the head. Crunch down by flexing the spine, not folding at the hips. Slow and controlled, exhale at the bottom.",
    last: { weight: 50, unit: "lb", sets: 3, reps: 15 } },
  { name: "Weighted Plank", pattern: "core", bw: false,
    warmup: "Bird dogs — 2 sets of 8 per side.",
    notes: "A plate on the upper back. Straight line head to heels, squeeze glutes and brace. Don't let the hips sag or pike.",
    last: { weight: 25, unit: "lb", sets: 3, reps: 45 } },
  { name: "Hanging Leg Raise", pattern: "core", bw: false,
    warmup: "Dead hangs and 2 sets of knee raises.",
    notes: "Hang from a bar. Raise straight legs to hip height (or knees to scale). Avoid swinging — control the movement up and down.",
    last: { weight: 0, unit: "reps", sets: 3, reps: 10 } },
  { name: "Plank", pattern: "core", bw: true,
    warmup: "Cat-cow and 5 bird dogs per side.",
    notes: "Forearms under shoulders, body in a straight line. Brace the abs and squeeze the glutes. Hold for time, breathing steadily.",
    last: { weight: 0, unit: "sec", sets: 3, reps: 40 } },
  { name: "Dead Bug", pattern: "core", bw: true,
    warmup: "Pelvic tilts — 10 reps.",
    notes: "On your back, arms up, knees over hips. Lower opposite arm and leg slowly while keeping the lower back flat on the floor.",
    last: { weight: 0, unit: "reps", sets: 3, reps: 12 } },
  { name: "Hollow Hold", pattern: "core", bw: true,
    warmup: "Dead bugs — 2 sets of 8.",
    notes: "Lie on your back, press the lower back into the floor, lift shoulders and legs into a shallow banana shape. Bend the knees to scale.",
    last: { weight: 0, unit: "sec", sets: 3, reps: 30 } },
];

const PATTERNS = [
  { key: "squat", label: "Squat", blurb: "Quads & glutes" },
  { key: "hinge", label: "Hinge", blurb: "Hamstrings & glutes" },
  { key: "push",  label: "Push",  blurb: "Chest & shoulders" },
  { key: "pull",  label: "Pull",  blurb: "Back & biceps" },
  { key: "core",  label: "Core",  blurb: "Abs & trunk" },
];

function youtubeSearch(name) {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent("how to " + name + " proper form");
}

// Pick one random exercise for a pattern, respecting BW filter and avoiding `excludeName`.
function pickExercise(pattern, bwOnly, excludeName) {
  let pool = EXERCISE_DB.filter(function (e) {
    return e.pattern === pattern && (!bwOnly || e.bw);
  });
  if (pool.length > 1 && excludeName) {
    const filtered = pool.filter(function (e) { return e.name !== excludeName; });
    if (filtered.length) pool = filtered;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatLast(last) {
  if (!last) return "First time — no record yet.";
  if (last.unit === "bw") return last.sets + " × " + last.reps + " reps (bodyweight)";
  if (last.unit === "sec") return last.sets + " × " + last.reps + "s hold";
  if (last.unit === "reps") return last.sets + " × " + last.reps + " reps";
  return last.sets + " × " + last.reps + " @ " + last.weight + " " + last.unit;
}

Object.assign(window, {
  EXERCISE_DB, PATTERNS, youtubeSearch, pickExercise, formatLast,
});
