export type PatternKey = "squat" | "hinge" | "push" | "pull" | "core" | "mobility" | "kneept";

export type Unit = "lb" | "kg" | "bw" | "sec" | "reps";

export interface LastLog {
  sets: number;
  reps: number;
  weight: number;
  unit: Unit;
}

export interface Exercise {
  id: string;
  name: string;
  pattern: PatternKey;
  bodyweight: boolean;
  warmup: string;
  notes: string;
  videoUrl?: string;
  // From the "Reps or duration" field — which log unit to default to before any log exists.
  defaultUnit: "reps" | "sec";
  // From the "Order" field — drives mobility's fixed sequence (first N, not random).
  order: number | null;
  last: LastLog | null;
}

export interface LogEntry {
  sets: number | string;
  reps: number | string;
  weight: number | string;
  unit: Unit;
  done: boolean;
}

export interface WorkoutItem {
  pattern: PatternKey;
  exercise: Exercise;
  log: LogEntry | null;
}

export interface FinishedLogEntry {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  unit: Unit;
}
