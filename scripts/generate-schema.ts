import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { cvSchema } from "../src/types/cv.ts";
import { siteConfigSchema } from "../src/types/site.ts";

const cvJsonSchema = z.toJSONSchema(cvSchema);
fs.writeFileSync(
  path.resolve("config/cv.schema.json"),
  `${JSON.stringify(cvJsonSchema, null, 2)}\n`,
);
console.log("config/cv.schema.json generated successfully.");

const siteJsonSchema = z.toJSONSchema(siteConfigSchema);
fs.writeFileSync(
  path.resolve("config/site.schema.json"),
  `${JSON.stringify(siteJsonSchema, null, 2)}\n`,
);
console.log("config/site.schema.json generated successfully.");
