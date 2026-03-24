import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import type { SeedBrand } from "./types.ts";
import { generateSql } from "./generate-sql.ts";

const dataDir = join(import.meta.dirname!, "data");
// wrangler d1 execute must run from apps/api/ where wrangler.jsonc lives
const apiDir = resolve(import.meta.dirname!, "../../..", "apps/api");

// Recursively find all JSON files under data/<brand>/<season>.json
const files: string[] = [];
for (const entry of readdirSync(dataDir, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const brandDir = join(dataDir, entry.name);
    for (const f of readdirSync(brandDir)) {
      if (f.endsWith(".json")) files.push(join(entry.name, f));
    }
  } else if (entry.name.endsWith(".json")) {
    // Also support flat files for backwards compatibility
    files.push(entry.name);
  }
}

if (files.length === 0) {
  console.error("No JSON files found in", dataDir);
  process.exit(1);
}

const isRemote = process.argv.includes("--remote");
const dbName = "edgepick-db";

for (const file of files) {
  const filePath = join(dataDir, file);
  console.log(`Processing ${file}...`);

  const data: SeedBrand = JSON.parse(readFileSync(filePath, "utf-8"));
  const sql = generateSql(data);

  const tmpFile = join(tmpdir(), `seed-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);

  const args = ["wrangler", "d1", "execute", dbName, "--file", tmpFile];
  if (!isRemote) args.push("--local");

  try {
    execFileSync("pnpm", args, { stdio: "inherit", cwd: apiDir });
    console.log(`✓ ${file} seeded successfully`);
  } catch {
    console.error(`✗ Failed to seed ${file}`);
    process.exit(1);
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      /* ignore cleanup errors */
    }
  }
}
