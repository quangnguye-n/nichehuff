import type { NagKind } from "@huff/shared";

export type ScheduledNag = {
  userId: string;
  kind: NagKind;
};

export type EvaluationResult = {
  evaluated: number;
  nags: ScheduledNag[];
};

/** Placeholder. The nag ladder lands in a later step. */
export function evaluateUsers(): EvaluationResult {
  return { evaluated: 0, nags: [] };
}
