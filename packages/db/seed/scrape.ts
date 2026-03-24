/**
 * Scrape product pages for a brand using firecrawl CLI.
 *
 * Usage:
 *   pnpm --filter db scrape --brand <slug>          # scrape preferred source
 *   pnpm --filter db scrape --brand <slug> --evo    # force evo.com fallback
 *   pnpm --filter db scrape --brand <slug> --all    # scrape both sources
 *   pnpm --filter db scrape --list                  # list all brands
 *
 * Output: .firecrawl/<slug>-<filename>.md files in project root
 *
 * After scraping, use `/seed-brand <BrandName>` in Claude Code to parse
 * the markdown files into seed JSON.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { brands } from "./sources/brands.ts";

const rootDir = resolve(import.meta.dirname!, "../../..");

// Parse CLI args
const args = process.argv.slice(2);
const brandSlug = (() => {
  const idx = args.indexOf("--brand");
  return idx !== -1 ? args[idx + 1] : undefined;
})();
const forceEvo = args.includes("--evo");
const scrapeAll = args.includes("--all");
const listMode = args.includes("--list");

if (listMode) {
  console.log("Available brands:\n");
  for (const [slug, config] of Object.entries(brands)) {
    const urlCount = config.productUrls.length + (config.evoUrls?.length ?? 0);
    console.log(
      `  ${slug.padEnd(12)} ${config.sport.padEnd(10)} ${config.prefer.padEnd(8)} ${urlCount} URLs`,
    );
  }
  process.exit(0);
}

if (!brandSlug) {
  console.error("Usage: pnpm --filter db scrape --brand <slug>");
  console.error("       pnpm --filter db scrape --list");
  process.exit(1);
}

const config = brands[brandSlug];
if (!config) {
  console.error(`Unknown brand: ${brandSlug}`);
  console.error(`Available: ${Object.keys(brands).join(", ")}`);
  process.exit(1);
}

// Determine which URLs to scrape
const urls: { source: string; url: string }[] = [];

if (scrapeAll) {
  for (const url of config.productUrls) {
    urls.push({ source: "official", url });
  }
  for (const url of config.evoUrls ?? []) {
    urls.push({ source: "evo", url });
  }
} else if (forceEvo) {
  for (const url of config.evoUrls ?? []) {
    urls.push({ source: "evo", url });
  }
} else if (config.prefer === "official" && config.productUrls.length > 0) {
  for (const url of config.productUrls) {
    urls.push({ source: "official", url });
  }
} else {
  for (const url of config.evoUrls ?? []) {
    urls.push({ source: "evo", url });
  }
}

if (urls.length === 0) {
  console.error(`No URLs configured for ${brandSlug}`);
  process.exit(1);
}

console.log(`\nScraping ${config.brand.name} (${config.sport})`);
console.log(`Season: ${config.season}`);
console.log(`URLs: ${urls.length}\n`);

let successCount = 0;
let failCount = 0;

for (const { source, url } of urls) {
  console.log(`[${source}] ${url}`);
  try {
    execFileSync("firecrawl", ["scrape", url, "--only-main-content"], {
      stdio: "inherit",
      cwd: rootDir,
      timeout: 30_000,
    });
    successCount++;
  } catch {
    console.error(`  ✗ Failed to scrape: ${url}`);
    failCount++;
  }
}

console.log(`\nDone: ${successCount} succeeded, ${failCount} failed`);
console.log(`Output: .firecrawl/ directory`);
console.log(`\nNext step: /seed-brand ${config.brand.name}`);
