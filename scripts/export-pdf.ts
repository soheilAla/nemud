import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import {
  existsSync,
  mkdtempSync,
  readFile,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve, sep } from "node:path";

const cv = JSON.parse(readFileSync("config/cv.json", "utf-8"));
const name = cv.basics?.name?.trim() || "cv";
const filename = `${name.replace(/[\\/:*?"<>|]/g, "_")}.pdf`;
const outputPath = resolve(filename);

const dist = resolve("dist");
const host = "127.0.0.1";

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

execFileSync("pnpm", ["build"], { stdio: "inherit" });

const server = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405).end();
    return;
  }

  let pathname: string;

  try {
    pathname = decodeURIComponent(
      new URL(req.url ?? "/", "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400).end();
    return;
  }

  const filePath = resolve(dist, `.${pathname}`);

  if (filePath !== dist && !filePath.startsWith(`${dist}${sep}`)) {
    res.writeHead(403).end();
    return;
  }

  const target =
    existsSync(filePath) && statSync(filePath).isDirectory()
      ? join(filePath, "index.html")
      : filePath;

  readFile(target, (error, content) => {
    if (error) {
      res.writeHead(404).end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(target)] ?? "application/octet-stream",
    });

    res.end(req.method === "HEAD" ? undefined : content);
  });
});

const profile = mkdtempSync(join(tmpdir(), "nemud-chrome-"));

try {
  server.listen(0, host);
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not start the local server.");
  }

  const url = `http://${host}:${address.port}/`;
  console.log(`Exporting ${filename}...`);

  const chrome = spawn(
    process.env.CHROME_BIN || "google-chrome",
    [
      "--headless=new",
      "--disable-background-networking",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      "--no-pdf-header-footer",
      "--timeout=5000",
      `--print-to-pdf=${outputPath}`,
      url,
    ],
    { stdio: "inherit" },
  );

  const timeout = setTimeout(() => chrome.kill("SIGTERM"), 60_000);

  try {
    await new Promise<void>((resolve, reject) => {
      chrome.once("error", reject);
      chrome.once("close", (code, signal) => {
        if (code === 0) resolve();
        else
          reject(
            new Error(`Chrome exited with code ${code}, signal ${signal}`),
          );
      });
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!existsSync(outputPath) || statSync(outputPath).size === 0) {
    throw new Error("PDF was not created.");
  }

  console.log(`PDF exported successfully: ${filename}`);
} finally {
  if (server.listening) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  rmSync(profile, { recursive: true, force: true });
}
