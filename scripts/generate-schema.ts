import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { cvSchema } from "../src/types/cv.ts";

const jsonSchema = z.toJSONSchema(cvSchema);
const content = `${JSON.stringify(jsonSchema, null, 2)}\n`;

fs.writeFileSync(path.resolve("config/cv.schema.json"), content);
console.log("config/cv.schema.json generated successfully.");
