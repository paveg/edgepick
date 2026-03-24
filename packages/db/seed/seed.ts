import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import type { SeedBrand } from "./types.ts";
import { generateSql } from "./generate-sql.ts";

const dataDir = join(import.meta.dirname!, "data");
// wrangler d1 execute must run from apps/api/ where wrangler.jsonc lives
const apiDir = resolve(import.meta.dirname!, "../../..", "apps/api");

// Parse CLI flags
const isRemote = process.argv.includes("--remote");
const isDryRun = process.argv.includes("--dry-run");
const brandIdx = process.argv.indexOf("--brand");
const brandFilter = brandIdx !== -1 ? process.argv[brandIdx + 1] : undefined;
const dbName = "edgepick-db";

if (brandFilter) {
  console.log(`Filtering by brand: ${brandFilter}`);
}
if (isDryRun) {
  console.log("Dry run mode: SQL will be printed but not executed");
}

// Recursively find all JSON files under data/<brand>/<season>.json
const files: string[] = [];
for (const entry of readdirSync(dataDir, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    if (brandFilter && entry.name !== brandFilter) continue;
    const brandDir = join(dataDir, entry.name);
    for (const f of readdirSync(brandDir)) {
      if (f.endsWith(".json")) files.push(join(entry.name, f));
    }
  } else if (entry.name.endsWith(".json")) {
    files.push(entry.name);
  }
}

if (files.length === 0) {
  console.error(
    brandFilter
      ? `No JSON files found for brand "${brandFilter}" in ${dataDir}`
      : `No JSON files found in ${dataDir}`,
  );
  process.exit(1);
}

for (const file of files) {
  const filePath = join(dataDir, file);
  console.log(`Processing ${file}...`);

  const data: SeedBrand = JSON.parse(readFileSync(filePath, "utf-8"));
  const sql = generateSql(data);

  if (isDryRun) {
    console.log(sql);
    console.log(`✓ ${file} (dry run)`);
    continue;
  }

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
