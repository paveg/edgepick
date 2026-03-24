/**
 * Validate seed data quality.
 *
 * Usage:
 *   pnpm --filter db validate              # validate all brands
 *   pnpm --filter db validate --brand gnu   # validate specific brand
 *
 * Checks:
 * - All required fields are present
 * - At least one size has weightG (representative weight)
 * - waistWidthMm is within sport-appropriate range
 * - displayOrder is sequential and matches lengthCm ascending
 * - categorySlug matches a defined category
 * - No duplicate model slugs within a brand
 * - IDs are valid ULIDs (26 chars alphanumeric)
 * - sizes array is non-empty
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { SeedBrand } from "./types.ts";

const dataDir = join(import.meta.dirname!, "data");
const args = process.argv.slice(2);
const brandIdx = args.indexOf("--brand");
const brandFilter = brandIdx !== -1 ? args[brandIdx + 1] : undefined;

type Issue = { severity: "error" | "warn"; brand: string; model?: string; message: string };
const issues: Issue[] = [];

const addError = (brand: string, model: string | undefined, message: string) =>
  issues.push({ severity: "error", brand, model, message });
const addWarn = (brand: string, model: string | undefined, message: string) =>
  issues.push({ severity: "warn", brand, model, message });

const ULID_RE = /^[0-9A-Z]{26}$/;
const isValidUlid = (id: string) => ULID_RE.test(id);

// Collect files
const files: string[] = [];
for (const entry of readdirSync(dataDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (brandFilter && entry.name !== brandFilter) continue;
  const brandDir = join(dataDir, entry.name);
  for (const f of readdirSync(brandDir)) {
    if (f.endsWith(".json")) files.push(join(entry.name, f));
  }
}

if (files.length === 0) {
  console.error(brandFilter ? `No data found for brand "${brandFilter}"` : "No data found");
  process.exit(1);
}

let totalModels = 0;
let totalSizes = 0;

for (const file of files) {
  const filePath = join(dataDir, file);
  let data: SeedBrand;
  try {
    data = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (e) {
    addError(file, undefined, `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    continue;
  }

  const brandName = data.brand.slug;

  // Brand validation
  if (!isValidUlid(data.brand.id))
    addError(brandName, undefined, `Invalid brand ID: ${data.brand.id}`);
  if (!data.brand.name) addError(brandName, undefined, "Missing brand name");
  if (!data.brand.slug) addError(brandName, undefined, "Missing brand slug");
  if (!data.brand.country) addWarn(brandName, undefined, "Missing brand country");
  if (!data.brand.websiteUrl) addWarn(brandName, undefined, "Missing brand websiteUrl");

  // Category validation
  const categorySlugs = new Set(data.categories.map((c) => c.slug));
  for (const cat of data.categories) {
    if (!isValidUlid(cat.id))
      addError(brandName, undefined, `Invalid category ID for ${cat.slug}: ${cat.id}`);
  }

  // Model validation
  const modelSlugs = new Set<string>();
  for (const model of data.models) {
    totalModels++;
    const modelLabel = model.name;

    // ID checks
    if (!isValidUlid(model.id)) addError(brandName, modelLabel, `Invalid model ID: ${model.id}`);
    if (!isValidUlid(model.specs.id))
      addError(brandName, modelLabel, `Invalid specs ID: ${model.specs.id}`);

    // Duplicate slug
    if (modelSlugs.has(model.slug))
      addError(brandName, modelLabel, `Duplicate model slug: ${model.slug}`);
    modelSlugs.add(model.slug);

    // Category reference
    if (!categorySlugs.has(model.categorySlug)) {
      addError(brandName, modelLabel, `Unknown categorySlug: ${model.categorySlug}`);
    }

    // Required fields
    if (!model.name) addError(brandName, modelLabel, "Missing model name");
    if (!model.slug) addError(brandName, modelLabel, "Missing model slug");
    if (!model.sport) addError(brandName, modelLabel, "Missing sport");
    if (!model.level) addError(brandName, modelLabel, "Missing level");
    if (!model.season) addError(brandName, modelLabel, "Missing season");

    // Sizes
    if (model.sizes.length === 0) {
      addError(brandName, modelLabel, "No sizes defined");
      continue;
    }

    totalSizes += model.sizes.length;

    // Weight check — at least one size should have weightG
    const hasWeight = model.sizes.some((s) => s.weightG != null);
    if (!hasWeight)
      addWarn(brandName, modelLabel, "No weightG in any size (representative weight missing)");

    // waistWidthMm check
    const hasWaist = model.sizes.some((s) => s.waistWidthMm != null);
    if (!hasWaist) addError(brandName, modelLabel, "No waistWidthMm in any size");

    for (const size of model.sizes) {
      if (!isValidUlid(size.id)) addError(brandName, modelLabel, `Invalid size ID: ${size.id}`);

      // Waist width range check
      if (size.waistWidthMm != null) {
        if (model.sport === "ski" && (size.waistWidthMm < 60 || size.waistWidthMm > 140)) {
          addWarn(
            brandName,
            modelLabel,
            `Unusual ski waist width: ${size.waistWidthMm}mm at ${size.lengthCm}cm`,
          );
        }
        if (model.sport === "snowboard" && (size.waistWidthMm < 230 || size.waistWidthMm > 290)) {
          addWarn(
            brandName,
            modelLabel,
            `Unusual snowboard waist width: ${size.waistWidthMm}mm at ${size.lengthCm}cm`,
          );
        }
      }
    }

    // displayOrder sequential + lengthCm ascending
    const lengths = model.sizes.map((s) => s.lengthCm);
    const orders = model.sizes.map((s) => s.displayOrder);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        addWarn(
          brandName,
          modelLabel,
          `displayOrder not sequential: expected ${i + 1}, got ${orders[i]} at ${lengths[i]}cm`,
        );
        break;
      }
    }
    for (let i = 1; i < lengths.length; i++) {
      if (lengths[i] <= lengths[i - 1]) {
        addWarn(
          brandName,
          modelLabel,
          `lengthCm not ascending: ${lengths[i - 1]}cm >= ${lengths[i]}cm`,
        );
        break;
      }
    }

    // Specs completeness
    if (model.sport === "ski") {
      if (!model.specs.rockerType) addWarn(brandName, modelLabel, "Missing specs.rockerType");
      if (!model.specs.coreMaterial) addWarn(brandName, modelLabel, "Missing specs.coreMaterial");
      if (!model.specs.baseMaterial) addWarn(brandName, modelLabel, "Missing specs.baseMaterial");
    }
    if (model.sport === "snowboard") {
      if (!model.specs.shape) addWarn(brandName, modelLabel, "Missing specs.shape");
      if (!model.specs.bendProfile) addWarn(brandName, modelLabel, "Missing specs.bendProfile");
      if (model.specs.flexRating == null)
        addWarn(brandName, modelLabel, "Missing specs.flexRating");
      if (!model.specs.coreMaterial) addWarn(brandName, modelLabel, "Missing specs.coreMaterial");
      if (!model.specs.baseMaterial) addWarn(brandName, modelLabel, "Missing specs.baseMaterial");
    }
  }
}

// Report
console.log(`\nValidated ${files.length} files: ${totalModels} models, ${totalSizes} sizes\n`);

const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warn");

if (errors.length > 0) {
  console.log(`❌ ${errors.length} error(s):`);
  for (const e of errors) {
    console.log(`  [${e.brand}] ${e.model ? `${e.model}: ` : ""}${e.message}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) {
    console.log(`  [${w.brand}] ${w.model ? `${w.model}: ` : ""}${w.message}`);
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ All checks passed");
}

process.exit(errors.length > 0 ? 1 : 0);
