import { env } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../index";

const migrate = async (db: D1Database) => {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS brands (id text PRIMARY KEY NOT NULL, name text NOT NULL, slug text NOT NULL, country text, logo_url text, website_url text, description text, created_at text NOT NULL, updated_at text NOT NULL)`,
    ),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_unique ON brands (slug)`),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS categories (id text PRIMARY KEY NOT NULL, sport text NOT NULL, name text NOT NULL, slug text NOT NULL, display_order integer DEFAULT 0 NOT NULL, created_at text NOT NULL)`,
    ),
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS categories_sport_slug_unique ON categories (sport, slug)`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS models (id text PRIMARY KEY NOT NULL, brand_id text NOT NULL, category_id text NOT NULL, name text NOT NULL, slug text NOT NULL, sport text NOT NULL, level text NOT NULL, season text NOT NULL, msrp_jpy integer, source_url text, description text, is_published integer DEFAULT 0 NOT NULL, created_at text NOT NULL, updated_at text NOT NULL, FOREIGN KEY (brand_id) REFERENCES brands(id), FOREIGN KEY (category_id) REFERENCES categories(id))`,
    ),
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS models_brand_id_slug_season_unique ON models (brand_id, slug, season)`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS model_sizes (id text PRIMARY KEY NOT NULL, model_id text NOT NULL, length_cm real NOT NULL, waist_width_mm real, nose_width_mm real, tail_width_mm real, sidecut_radius_m real, effective_edge_mm real, weight_g integer, rider_weight_min_kg integer, rider_weight_max_kg integer, display_order integer DEFAULT 0 NOT NULL, FOREIGN KEY (model_id) REFERENCES models(id))`,
    ),
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS model_sizes_model_id_length_cm_unique ON model_sizes (model_id, length_cm)`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS ski_specs (id text PRIMARY KEY NOT NULL, model_id text NOT NULL, rocker_type text, tail_type text, core_material text, base_material text, sidewall text, mount_point_cm real, FOREIGN KEY (model_id) REFERENCES models(id))`,
    ),
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS ski_specs_model_id_unique ON ski_specs (model_id)`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS snowboard_specs (id text PRIMARY KEY NOT NULL, model_id text NOT NULL, shape text, bend_profile text, flex_rating integer, base_material text, core_material text, mounting text, setback_mm real, FOREIGN KEY (model_id) REFERENCES models(id))`,
    ),
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS snowboard_specs_model_id_unique ON snowboard_specs (model_id)`,
    ),
  ]);
};

const seed = async (db: D1Database) => {
  await db.batch([
    db.prepare(
      `INSERT OR REPLACE INTO brands (id, name, slug, country, website_url, created_at, updated_at)
       VALUES ('brand-01', 'TestBrand', 'testbrand', 'JP', 'https://example.com', '2025-01-01', '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO categories (id, sport, name, slug, display_order, created_at)
       VALUES ('cat-01', 'ski', 'オールマウンテン', 'all-mountain', 1, '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO models (id, brand_id, category_id, name, slug, sport, level, season, description, is_published, created_at, updated_at)
       VALUES ('model-01', 'brand-01', 'cat-01', 'TestSki 100', 'testski-100', 'ski', 'advanced', '2025-2026', 'A great ski', 1, '2025-01-01', '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO ski_specs (id, model_id, rocker_type, tail_type, core_material, base_material, sidewall)
       VALUES ('spec-01', 'model-01', 'Rocker/Camber/Rocker', 'Partial Twin Tip', 'Woodcore', 'Sintered', 'Sandwich')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, nose_width_mm, tail_width_mm, sidecut_radius_m, weight_g, display_order)
       VALUES ('size-01', 'model-01', 172, 100, 132, 120, 17.5, 1900, 1)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, nose_width_mm, tail_width_mm, sidecut_radius_m, weight_g, display_order)
       VALUES ('size-02', 'model-01', 179, 100, 133, 121, 18, 2050, 2)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO categories (id, sport, name, slug, display_order, created_at)
       VALUES ('cat-02', 'snowboard', 'オールマウンテン', 'all-mountain', 1, '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO models (id, brand_id, category_id, name, slug, sport, level, season, description, is_published, created_at, updated_at)
       VALUES ('model-02', 'brand-01', 'cat-02', 'TestBoard 156', 'testboard-156', 'snowboard', 'intermediate', '2025-2026', 'A great board', 1, '2025-01-01', '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO snowboard_specs (id, model_id, shape, bend_profile, flex_rating, base_material, core_material, mounting)
       VALUES ('sbspec-01', 'model-02', 'Twin', 'Camber', 5, 'Sintered', 'Woodcore', 'Channel')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, display_order)
       VALUES ('size-03', 'model-02', 152, 250, 1)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, display_order)
       VALUES ('size-04', 'model-02', 156, 252, 2)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO models (id, brand_id, category_id, name, slug, sport, level, season, description, is_published, created_at, updated_at)
       VALUES ('model-03', 'brand-01', 'cat-01', 'TestSki 100', 'testski-100', 'ski', 'advanced', '2024-2025', 'Previous season', 1, '2024-01-01', '2024-01-01')`,
    ),
    // Second brand + category for filter tests
    db.prepare(
      `INSERT OR REPLACE INTO brands (id, name, slug, country, website_url, created_at, updated_at)
       VALUES ('brand-02', 'OtherBrand', 'otherbrand', 'US', 'https://other.com', '2025-01-01', '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO categories (id, sport, name, slug, display_order, created_at)
       VALUES ('cat-03', 'ski', 'パウダー', 'powder', 3, '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO models (id, brand_id, category_id, name, slug, sport, level, season, description, is_published, created_at, updated_at)
       VALUES ('model-04', 'brand-02', 'cat-03', 'PowderSki 110', 'powderski-110', 'ski', 'advanced', '2025-2026', 'A powder ski', 1, '2025-01-01', '2025-01-01')`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, display_order)
       VALUES ('size-07', 'model-04', 186, 110, 1)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, display_order)
       VALUES ('size-05', 'model-03', 170, 100, 1)`,
    ),
    db.prepare(
      `INSERT OR REPLACE INTO model_sizes (id, model_id, length_cm, waist_width_mm, display_order)
       VALUES ('size-06', 'model-03', 177, 100, 2)`,
    ),
  ]);
};

beforeAll(async () => {
  await migrate(env.DB);
  await seed(env.DB);
});

const request = (path: string) => app.request(path, {}, { DB: env.DB });

describe("GET /", () => {
  it("returns health check message", async () => {
    const res = await request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Edgepick API" });
  });
});

describe("GET /brands", () => {
  it("returns data wrapper with array", async () => {
    const res = await request("/brands");
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("includes brand fields", async () => {
    const json = await request("/brands").then((r) => r.json());
    const brand = json.data.find((b: { slug: string }) => b.slug === "testbrand");
    expect(brand).toMatchObject({
      id: "brand-01",
      name: "TestBrand",
      slug: "testbrand",
    });
  });

  it("filters by sport query param", async () => {
    const ski = await request("/brands?sport=ski").then((r) => r.json());
    expect(ski.data.length).toBeGreaterThanOrEqual(1);

    const snowboard = await request("/brands?sport=snowboard").then((r) => r.json());
    expect(snowboard.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /categories", () => {
  it("returns data wrapper with array", async () => {
    const res = await request("/categories");
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("filters by sport", async () => {
    const ski = await request("/categories?sport=ski").then((r) => r.json());
    expect(ski.data.length).toBeGreaterThanOrEqual(1);
    expect(ski.data[0]).toMatchObject({ sport: "ski", slug: "all-mountain" });

    const snowboard = await request("/categories?sport=snowboard").then((r) => r.json());
    expect(snowboard.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /models", () => {
  it("returns data wrapper with array", async () => {
    const res = await request("/models");
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("includes joined brand/category names and nested sizes", async () => {
    const json = await request("/models?sport=ski").then((r) => r.json());
    expect(json.data.length).toBeGreaterThanOrEqual(1);

    const model = json.data.find(
      (m: { slug: string; season: string }) => m.slug === "testski-100" && m.season === "2025-2026",
    );
    expect(model).toMatchObject({
      name: "TestSki 100",
      brandName: "TestBrand",
      categoryName: "オールマウンテン",
      level: "advanced",
    });
    expect(model.sizes).toHaveLength(2);
    expect(model.sizes[0]).toMatchObject({
      lengthCm: 172,
      waistWidthMm: 100,
    });
  });

  it("filters models by sport", async () => {
    const ski = await request("/models?sport=ski").then((r) => r.json());
    const snowboard = await request("/models?sport=snowboard").then((r) => r.json());
    expect(ski.data.every((m: { sport: string }) => m.sport === "ski")).toBe(true);
    expect(snowboard.data.every((m: { sport: string }) => m.sport === "snowboard")).toBe(true);
  });

  it("returns all models when no sport filter", async () => {
    const json = await request("/models").then((r) => r.json());
    expect(json.data.length).toBeGreaterThanOrEqual(1);
  });

  it("filters models by brand slug", async () => {
    const all = await request("/models?sport=ski").then((r) => r.json());
    const filtered = await request("/models?sport=ski&brand=testbrand").then((r) => r.json());
    expect(filtered.data.length).toBeLessThan(all.data.length);
    expect(filtered.data.every((m: { brandSlug: string }) => m.brandSlug === "testbrand")).toBe(
      true,
    );
  });

  it("filters models by category slug", async () => {
    const all = await request("/models?sport=ski").then((r) => r.json());
    const filtered = await request("/models?sport=ski&category=all-mountain").then((r) => r.json());
    expect(filtered.data.length).toBeLessThan(all.data.length);
    expect(
      filtered.data.every((m: { categorySlug: string }) => m.categorySlug === "all-mountain"),
    ).toBe(true);
  });

  it("filters models by both brand and category", async () => {
    const json = await request("/models?sport=ski&brand=testbrand&category=all-mountain").then(
      (r) => r.json(),
    );
    expect(json.data.length).toBeGreaterThanOrEqual(1);
    expect(
      json.data.every(
        (m: { brandSlug: string; categorySlug: string }) =>
          m.brandSlug === "testbrand" && m.categorySlug === "all-mountain",
      ),
    ).toBe(true);
  });

  it("returns empty array for non-existent brand filter", async () => {
    const json = await request("/models?brand=nonexistent").then((r) => r.json());
    expect(json.data).toEqual([]);
  });

  it("filters models by waist_min", async () => {
    // TestSki 100 has waist 100mm, PowderSki 110 has waist 110mm
    const json = await request("/models?sport=ski&waist_min=105").then((r) => r.json());
    expect(json.data.length).toBeGreaterThanOrEqual(1);
    expect(
      json.data.every((m: { sizes: { waistWidthMm: number }[] }) =>
        m.sizes.some((s) => s.waistWidthMm >= 105),
      ),
    ).toBe(true);
  });

  it("filters models by waist_max", async () => {
    const json = await request("/models?sport=ski&waist_max=105").then((r) => r.json());
    expect(json.data.length).toBeGreaterThanOrEqual(1);
    expect(
      json.data.every((m: { sizes: { waistWidthMm: number }[] }) =>
        m.sizes.some((s) => s.waistWidthMm <= 105),
      ),
    ).toBe(true);
  });

  it("filters models by waist_min and waist_max range", async () => {
    const json = await request("/models?sport=ski&waist_min=95&waist_max=105").then((r) =>
      r.json(),
    );
    expect(json.data.length).toBeGreaterThanOrEqual(1);
    // All returned models should have at least one size within range
    const slugs = json.data.map((m: { slug: string }) => m.slug);
    expect(slugs).toContain("testski-100");
    expect(slugs).not.toContain("powderski-110");
  });

  it("filters models by weight_max", async () => {
    // TestSki 100 has sizes with weightG=1900 and weightG=2050
    const json = await request("/models?sport=ski&weight_max=1950").then((r) => r.json());
    const slugs = json.data.map((m: { slug: string }) => m.slug);
    // TestSki 100 has a size at 1900g which is <= 1950, so it should be included
    expect(slugs).toContain("testski-100");
  });

  it("filters models by weight_min", async () => {
    const json = await request("/models?sport=ski&weight_min=3000").then((r) => r.json());
    // No model has weight >= 3000g
    expect(json.data.length).toBe(0);
  });

  it("filters models by weight_min and weight_max range", async () => {
    const json = await request("/models?sport=ski&weight_min=1800&weight_max=2000").then((r) =>
      r.json(),
    );
    const slugs = json.data.map((m: { slug: string }) => m.slug);
    expect(slugs).toContain("testski-100");
    // PowderSki 110 has no weight data, so it should not match
    expect(slugs).not.toContain("powderski-110");
  });
});

describe("GET /models/:brandSlug/:modelSlug/:season", () => {
  it("returns specific season when season is provided", async () => {
    const res = await request("/models/testbrand/testski-100/2025-2026");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      name: "TestSki 100",
      season: "2025-2026",
      description: "A great ski",
    });
    expect(json.sizes).toHaveLength(2);
    expect(json.sizes[0].lengthCm).toBe(172);
  });

  it("returns older season data", async () => {
    const res = await request("/models/testbrand/testski-100/2024-2025");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      season: "2024-2025",
      description: "Previous season",
    });
    expect(json.sizes).toHaveLength(2);
    expect(json.sizes[0].lengthCm).toBe(170);
  });

  it("returns latest season when season is omitted", async () => {
    const res = await request("/models/testbrand/testski-100");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.season).toBe("2025-2026");
  });

  it("returns availableSeasons listing all seasons for this model", async () => {
    const res = await request("/models/testbrand/testski-100/2025-2026");
    const json = await res.json();
    expect(json.availableSeasons).toEqual(["2025-2026", "2024-2025"]);
  });

  it("returns specs and sizes correctly", async () => {
    const json = await request("/models/testbrand/testski-100/2025-2026").then((r) => r.json());
    expect(json.specs).toMatchObject({
      rockerType: "Rocker/Camber/Rocker",
      coreMaterial: "Woodcore",
    });
    expect(json.sizes[0]).toMatchObject({
      lengthCm: 172,
      waistWidthMm: 100,
      noseWidthMm: 132,
      sidecutRadiusM: 17.5,
      weightG: 1900,
    });
  });

  it("returns 404 for non-existent season", async () => {
    const res = await request("/models/testbrand/testski-100/2020-2021");
    expect(res.status).toBe(404);
  });

  it("returns 404 for non-existent model", async () => {
    const res = await request("/models/testbrand/nonexistent/2025-2026");
    expect(res.status).toBe(404);
  });

  it("returns snowboard specs for snowboard model", async () => {
    const res = await request("/models/testbrand/testboard-156/2025-2026");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toMatchObject({
      name: "TestBoard 156",
      sport: "snowboard",
    });
    expect(json.specs).toMatchObject({
      shape: "Twin",
      bendProfile: "Camber",
      flexRating: 5,
    });
  });
});
