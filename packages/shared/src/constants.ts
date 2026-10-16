/** Kilometers of running that earn one cigarette of that day's budget. */
export const KM_PER_CIGARETTE = 1;

/** Kilometers of debt charged for each cigarette logged past the day's budget. */
export const OVERAGE_PENALTY_KM_PER_CIGARETTE = 1.5;

/** Carried debt never grows past this many kilometers. */
export const DEBT_CAP_KM = 10;

/** Budget is settled each day. A weekly horizon is intentionally not offered. */
export const DEFAULT_BUDGET_HORIZON = "daily" as const;

export type BudgetHorizon = typeof DEFAULT_BUDGET_HORIZON;

export const NAG_KINDS = ["midday_no_run", "budget_low", "night_debt"] as const;

export type NagKind = (typeof NAG_KINDS)[number];
