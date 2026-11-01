import rawCv from "../../config/cv.json";
import { parseCv } from "../lib/validate-cv.ts";
import type { CV } from "../types/cv.ts";

const { cv, warnings } = parseCv(rawCv);

for (const warning of warnings) {
  console.warn(`[cv] Warning: ${warning}`);
}

export const cvData: CV = cv;
