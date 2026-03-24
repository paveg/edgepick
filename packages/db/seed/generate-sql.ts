import type { SeedBrand } from "./types.ts";

const esc = (v: string): string => v.replaceAll("'", "''");

const sqlVal = (v: string | number | undefined | null): string => {
  if (v === undefined || v === null) return "NULL";
  if (typeof v === "number") return String(v);
  return `'${esc(String(v))}'`;
};

const now = () => new Date().toISOString();

export function generateSql(data: SeedBrand): string {
  const ts = now();
  const lines: string[] = [];

  // Resolve categorySlug → categoryId
  const categoryBySlug = new Map(data.categories.map((c) => [c.slug, c.id]));

  // brands
  lines.push(
    `INSERT OR REPLACE INTO brands (id, name, slug, country, logo_url, website_url, description, created_at, updated_at)`,
    `VALUES (${sqlVal(data.brand.id)}, ${sqlVal(data.brand.name)}, ${sqlVal(data.brand.slug)}, ${sqlVal(data.brand.country)}, NULL, ${sqlVal(data.brand.websiteUrl)}, ${sqlVal(data.brand.description)}, ${sqlVal(ts)}, ${sqlVal(ts)});`,
  );

  // categories
  for (const cat of data.categories) {
    lines.push(
      `INSERT OR REPLACE INTO categories (id, sport, name, slug, display_order, created_at)`,
      `VALUES (${sqlVal(cat.id)}, ${sqlVal(cat.sport)}, ${sqlVal(cat.name)}, ${sqlVal(cat.slug)}, ${cat.displayOrder}, ${sqlVal(ts)});`,
    );
  }

  // models, ski_specs, model_sizes
  for (const model of data.models) {
    const categoryId = categoryBySlug.get(model.categorySlug);
    if (!categoryId) {
      throw new Error(`Category slug "${model.categorySlug}" not found for model "${model.name}"`);
    }

    lines.push(
      `INSERT OR REPLACE INTO models (id, brand_id, category_id, name, slug, sport, level, season, msrp_jpy, source_url, description, is_published, created_at, updated_at)`,
      `VALUES (${sqlVal(model.id)}, ${sqlVal(data.brand.id)}, ${sqlVal(categoryId)}, ${sqlVal(model.name)}, ${sqlVal(model.slug)}, ${sqlVal(model.sport)}, ${sqlVal(model.level)}, ${sqlVal(model.season)}, ${sqlVal(model.msrpJpy)}, ${sqlVal(model.sourceUrl)}, ${sqlVal(model.description)}, 1, ${sqlVal(ts)}, ${sqlVal(ts)});`,
    );

    // specs
    const s = model.specs;
    if (model.sport === "ski") {
      lines.push(
        `INSERT OR REPLACE INTO ski_specs (id, model_id, rocker_type, tail_type, core_material, base_material, sidewall, mount_point_cm)`,
        `VALUES (${sqlVal(s.id)}, ${sqlVal(model.id)}, ${sqlVal(s.rockerType)}, ${sqlVal(s.tailType)}, ${sqlVal(s.coreMaterial)}, ${sqlVal(s.baseMaterial)}, ${sqlVal(s.sidewall)}, NULL);`,
      );
    } else if (model.sport === "snowboard") {
      lines.push(
        `INSERT OR REPLACE INTO snowboard_specs (id, model_id, shape, bend_profile, flex_rating, base_material, core_material, mounting, setback_mm)`,
        `VALUES (${sqlVal(s.id)}, ${sqlVal(model.id)}, ${sqlVal(s.shape)}, ${sqlVal(s.bendProfile)}, ${sqlVal(s.flexRating)}, ${sqlVal(s.baseMaterial)}, ${sqlVal(s.coreMaterial)}, ${sqlVal(s.mounting)}, ${sqlVal(s.setbackMm)});`,
      );
    }

    // model_sizes
    for (const size of model.sizes) {
      lines.push(
        `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, nose_width_mm, tail_width_mm, sidecut_radius_m, effective_edge_mm, weight_g, rider_weight_min_kg, rider_weight_max_kg, display_order)`,
        `VALUES (${sqlVal(size.id)}, ${sqlVal(model.id)}, ${size.lengthCm}, ${sqlVal(size.waistWidthMm)}, ${sqlVal(size.noseWidthMm)}, ${sqlVal(size.tailWidthMm)}, ${sqlVal(size.sidecutRadiusM)}, NULL, ${sqlVal(size.weightG)}, NULL, NULL, ${size.displayOrder});`,
      );
    }
  }

  return lines.join("\n");
}
