import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cv = JSON.parse(fs.readFileSync("config/cv.json", "utf-8"));
const rawName = cv.basics?.name?.trim() || "cv";
const safeName = rawName.replace(/[\\/:*?"<>|]/g, "_");
const outputFilename = `${safeName}.pdf`;
const outputPath = path.resolve(outputFilename);

execFileSync("pnpm", ["build"], { stdio: "inherit" });

const preview = spawn(
  "pnpm",
  ["preview", "--host", "127.0.0.1", "--port", "4321"],
  { stdio: "ignore" },
);

await new Promise((resolve) => setTimeout(resolve, 1000));

try {
  execFileSync(
    "google-chrome",
    [
      "--headless",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outputPath}`,
      "http://127.0.0.1:4321",
    ],
    { stdio: "inherit" },
  );
  console.log(`PDF exported to ${outputFilename}`);
} finally {
  preview.kill();
}
