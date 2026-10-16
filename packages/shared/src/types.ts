/** Calendar date in the user's timezone, `YYYY-MM-DD`. */
export type LocalDate = string;

/** ISO-8601 timestamp. */
export type IsoTimestamp = string;

export type Run = {
  id: string;
  userId: string;
  stravaActivityId: number;
  distanceMeters: number;
  startedAt: IsoTimestamp;
};

export type CigaretteLog = {
  id: string;
  userId: string;
  loggedAt: IsoTimestamp;
  count: number;
};

export type DailyBudget = {
  userId: string;
  date: LocalDate;
  earnedKm: number;
  allowance: number;
  cigarettesUsed: number;
};

export type Debt = {
  userId: string;
  kmOwed: number;
  updatedAt: IsoTimestamp;
};
