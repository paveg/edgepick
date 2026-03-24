import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { brands } from "./brands.ts";
import { categories } from "./categories.ts";

export const models = sqliteTable(
  "models",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sport: text("sport").notNull(),
    level: text("level").notNull(),
    season: text("season").notNull(),
    msrpJpy: integer("msrp_jpy"),
    description: text("description"),
    sourceUrl: text("source_url"),
    isPublished: integer("is_published").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [unique().on(table.brandId, table.slug, table.season)],
);
