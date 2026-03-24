import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, brands, categories, models, modelSizes, skiSpecs, snowboardSpecs } from "db";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/", (c) => c.json({ message: "Edgepick API" }));

app.get("/brands", async (c) => {
  const db = createDb(c.env.DB);
  const sport = c.req.query("sport");

  if (sport) {
    const rows = await db
      .selectDistinct({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        country: brands.country,
        logoUrl: brands.logoUrl,
        websiteUrl: brands.websiteUrl,
      })
      .from(brands)
      .innerJoin(models, eq(models.brandId, brands.id))
      .where(eq(models.sport, sport))
      .orderBy(brands.name);
    return c.json({ data: rows });
  }

  const rows = await db.select().from(brands).orderBy(brands.name);
  return c.json({ data: rows });
});

app.get("/categories", async (c) => {
  const db = createDb(c.env.DB);
  const sport = c.req.query("sport");

  const rows = await db
    .select()
    .from(categories)
    .where(sport ? eq(categories.sport, sport) : undefined)
    .orderBy(categories.displayOrder);
  return c.json({ data: rows });
});

app.get("/models", async (c) => {
  const db = createDb(c.env.DB);
  const sport = c.req.query("sport");
  const brand = c.req.query("brand");
  const category = c.req.query("category");
  const waistMin = c.req.query("waist_min");
  const waistMax = c.req.query("waist_max");
  const weightMin = c.req.query("weight_min");
  const weightMax = c.req.query("weight_max");

  const conditions = [];
  if (sport) conditions.push(eq(models.sport, sport));
  if (brand) conditions.push(eq(brands.slug, brand));
  if (category) conditions.push(eq(categories.slug, category));

  // Size-based filters: only include models that have at least one size matching
  const sizeConditions = [];
  if (waistMin) sizeConditions.push(gte(modelSizes.waistWidthMm, Number(waistMin)));
  if (waistMax) sizeConditions.push(lte(modelSizes.waistWidthMm, Number(waistMax)));
  if (weightMin) sizeConditions.push(gte(modelSizes.weightG, Number(weightMin)));
  if (weightMax) sizeConditions.push(lte(modelSizes.weightG, Number(weightMax)));

  if (sizeConditions.length > 0) {
    const matchingModelIds = db
      .selectDistinct({ modelId: modelSizes.modelId })
      .from(modelSizes)
      .where(and(...sizeConditions));

    conditions.push(inArray(models.id, matchingModelIds));
  }

  const modelRows = await db
    .select({
      id: models.id,
      name: models.name,
      slug: models.slug,
      sport: models.sport,
      level: models.level,
      season: models.season,
      description: models.description,
      brandName: brands.name,
      brandSlug: brands.slug,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(models)
    .innerJoin(brands, eq(models.brandId, brands.id))
    .innerJoin(categories, eq(models.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(brands.name, models.name);

  if (modelRows.length === 0) return c.json({ data: [] });

  const modelIds = modelRows.map((m) => m.id);
  const sizeRows = await db
    .select()
    .from(modelSizes)
    .where(inArray(modelSizes.modelId, modelIds))
    .orderBy(modelSizes.displayOrder);

  const sizesByModel = new Map<string, (typeof sizeRows)[number][]>();
  for (const s of sizeRows) {
    const arr = sizesByModel.get(s.modelId);
    if (arr) arr.push(s);
    else sizesByModel.set(s.modelId, [s]);
  }

  const data = modelRows.map((m) => ({
    ...m,
    sizes: sizesByModel.get(m.id) ?? [],
  }));

  return c.json({ data });
});

const handleModelDetail = async (
  db: ReturnType<typeof createDb>,
  brandSlug: string,
  modelSlug: string,
  season?: string,
) => {
  const conditions = [eq(brands.slug, brandSlug), eq(models.slug, modelSlug)];
  if (season) conditions.push(eq(models.season, season));

  const row = await db
    .select({
      id: models.id,
      name: models.name,
      slug: models.slug,
      sport: models.sport,
      level: models.level,
      season: models.season,
      description: models.description,
      brandName: brands.name,
      brandSlug: brands.slug,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(models)
    .innerJoin(brands, eq(models.brandId, brands.id))
    .innerJoin(categories, eq(models.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(models.season))
    .get();

  if (!row) return null;

  const sizes = await db
    .select()
    .from(modelSizes)
    .where(eq(modelSizes.modelId, row.id))
    .orderBy(modelSizes.displayOrder);

  const specs =
    row.sport === "ski"
      ? await db.select().from(skiSpecs).where(eq(skiSpecs.modelId, row.id)).get()
      : await db.select().from(snowboardSpecs).where(eq(snowboardSpecs.modelId, row.id)).get();

  // All seasons for this brand+model combination
  const seasonRows = await db
    .select({ season: models.season })
    .from(models)
    .innerJoin(brands, eq(models.brandId, brands.id))
    .where(and(eq(brands.slug, brandSlug), eq(models.slug, modelSlug)))
    .orderBy(desc(models.season));

  const availableSeasons = seasonRows.map((r) => r.season);

  return { ...row, specs: specs ?? null, sizes, availableSeasons };
};

app.get("/models/:brandSlug/:modelSlug/:season", async (c) => {
  const db = createDb(c.env.DB);
  const { brandSlug, modelSlug, season } = c.req.param();

  const result = await handleModelDetail(db, brandSlug, modelSlug, season);
  if (!result) return c.json({ error: { message: "Model not found" } }, 404);
  return c.json(result);
});

app.get("/models/:brandSlug/:modelSlug", async (c) => {
  const db = createDb(c.env.DB);
  const { brandSlug, modelSlug } = c.req.param();

  const result = await handleModelDetail(db, brandSlug, modelSlug);
  if (!result) return c.json({ error: { message: "Model not found" } }, 404);
  return c.json(result);
});

export default app;
