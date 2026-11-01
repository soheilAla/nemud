import type { CV } from "../types/cv.ts";
import { cvSchema } from "../types/cv.ts";
import { parseCvDate } from "./dates.ts";

function formatPath(path: (string | number | symbol)[]): string {
  let result = "";
  for (let i = 0; i < path.length; i++) {
    const segment = path[i];
    if (typeof segment === "number") {
      result += `[${segment}]`;
    } else {
      const segStr = String(segment);
      if (result === "") {
        result = segStr;
      } else {
        result += `.${segStr}`;
      }
    }
  }
  return result;
}

interface ItemWithDates {
  startDate: string;
  endDate?: string;
}

interface ItemWithDate {
  date: string;
}

function checkDateOrder<T extends ItemWithDates>(
  items: T[] | undefined,
  sectionName: string,
  warnings: string[],
): void {
  if (!items || items.length < 2) return;

  for (let i = 0; i < items.length - 1; i++) {
    const current = items[i];
    const next = items[i + 1];
    if (!current || !next) continue;

    const endCurrent = current.endDate
      ? parseCvDate(current.endDate)
      : { min: Infinity, max: Infinity };
    const endNext = next.endDate
      ? parseCvDate(next.endDate)
      : { min: Infinity, max: Infinity };

    if (!endCurrent || !endNext) continue;

    if (endCurrent.max < endNext.min) {
      warnings.push(
        `${sectionName}[${i}] is older than ${sectionName}[${i + 1}]; list items most recent first`,
      );
      continue;
    }

    const bothPresent = endCurrent.min === Infinity && endNext.min === Infinity;
    const bothMonthPreciseEqual =
      endCurrent.min !== Infinity &&
      endCurrent.min === endCurrent.max &&
      endNext.min === endNext.max &&
      endCurrent.min === endNext.min;

    if (bothPresent || bothMonthPreciseEqual) {
      const startCurrent = parseCvDate(current.startDate);
      const startNext = parseCvDate(next.startDate);

      if (startCurrent && startNext && startCurrent.max < startNext.min) {
        warnings.push(
          `${sectionName}[${i}] is older than ${sectionName}[${i + 1}]; list items most recent first`,
        );
      }
    }
  }
}

function checkSingleDateOrder<T extends ItemWithDate>(
  items: T[] | undefined,
  sectionName: string,
  warnings: string[],
): void {
  if (!items || items.length < 2) return;

  for (let i = 0; i < items.length - 1; i++) {
    const current = items[i];
    const next = items[i + 1];
    if (!current || !next) continue;

    const dateCurrent = parseCvDate(current.date);
    const dateNext = parseCvDate(next.date);

    if (dateCurrent && dateNext && dateCurrent.max < dateNext.min) {
      warnings.push(
        `${sectionName}[${i}] is older than ${sectionName}[${i + 1}]; list items most recent first`,
      );
    }
  }
}

export function parseCv(raw: unknown): { cv: CV; warnings: string[] } {
  const parseResult = cvSchema.safeParse(raw);

  if (!parseResult.success) {
    const issues = parseResult.error.issues;
    const count = issues.length;
    const lines = issues.map((issue) => {
      const pathStr = formatPath(issue.path);
      return `${pathStr}: ${issue.message}`;
    });

    const errorCountStr = `${count} ${count === 1 ? "error" : "errors"}`;
    const message = `[cv] Invalid cv.json (${errorCountStr})\n${lines.join("\n")}`;
    throw new Error(message);
  }

  const cv = parseResult.data;
  const warnings: string[] = [];

  checkDateOrder(cv.experience, "experience", warnings);
  checkDateOrder(cv.education, "education", warnings);
  checkSingleDateOrder(cv.certifications, "certifications", warnings);
  checkSingleDateOrder(cv.publications, "publications", warnings);

  return { cv, warnings };
}
