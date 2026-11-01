import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

function nemudPortraitIntegration() {
  return {
    name: "nemud-portrait",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url?.split("?")[0];
          if (urlPath?.startsWith("/") && !urlPath.endsWith(".json")) {
            const fileName = path.basename(urlPath);
            const filePath = path.resolve("config", fileName);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mime =
                ext === ".webp"
                  ? "image/webp"
                  : ext === ".jpg" || ext === ".jpeg"
                    ? "image/jpeg"
                    : ext === ".png"
                      ? "image/png"
                      : ext === ".svg"
                        ? "image/svg+xml"
                        : "application/octet-stream";
              res.setHeader("Content-Type", mime);
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
      "astro:build:done": ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const configDir = path.resolve("config");
        if (fs.existsSync(configDir)) {
          for (const file of fs.readdirSync(configDir)) {
            if (/\.(webp|jpg|jpeg|png|svg)$/i.test(file)) {
              fs.copyFileSync(
                path.join(configDir, file),
                path.join(outDir, file),
              );
            }
          }
        }
      },
    },
  };
}

export default defineConfig({
  integrations: [nemudPortraitIntegration()],
});
