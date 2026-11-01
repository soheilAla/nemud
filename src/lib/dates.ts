export const MONTH_NAMES: readonly string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MON_YEAR_REGEX =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (19[5-9]\d|20\d\d|2100)$/;
const YEAR_REGEX = /^(19[5-9]\d|20\d\d|2100)$/;

export interface CvDateRange {
  min: number;
  max: number;
}

export function parseCvDate(value: string): CvDateRange | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const monMatch = value.match(MON_YEAR_REGEX);
  if (monMatch?.[1] && monMatch[2]) {
    const month = MONTH_NAMES.indexOf(monMatch[1]);
    const year = Number(monMatch[2]);
    const idx = year * 12 + month;
    return { min: idx, max: idx };
  }

  const yearMatch = value.match(YEAR_REGEX);
  if (yearMatch?.[1]) {
    const year = Number(yearMatch[1]);
    return { min: year * 12, max: year * 12 + 11 };
  }

  return undefined;
}

export function isCertainlyBefore(a: CvDateRange, b: CvDateRange): boolean {
  return a.max < b.min;
}
