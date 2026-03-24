import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { models } from "./models.ts";

export const snowboardSpecs = sqliteTable("snowboard_specs", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .unique()
    .references(() => models.id),
  shape: text("shape"),
  bendProfile: text("bend_profile"),
  flexRating: integer("flex_rating"),
  baseMaterial: text("base_material"),
  coreMaterial: text("core_material"),
  mounting: text("mounting"),
  setbackMm: real("setback_mm"),
});
