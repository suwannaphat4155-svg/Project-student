import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envFiles = [envLocalPath, envPath];

let resolvedDbUrl = process.env.DATABASE_URL;

for (const file of envFiles) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^(?:export\s+)?DATABASE_URL=(.+)$/m);
  if (match) {
    resolvedDbUrl = match[1].replace(/^['"]|['"]$/g, "");
    break;
  }
}

if (!resolvedDbUrl) {
  console.log("DATABASE_URL not set; skipping Prisma db push step for local build.");
  process.exit(0);
}

try {
  const { execSync } = await import("node:child_process");
  execSync("npx prisma generate", { stdio: "inherit" });
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
} catch (error) {
  console.warn("Prisma prepare step failed; continuing so local builds still work in non-DB environments.");
  console.warn(error instanceof Error ? error.message : String(error));
}
