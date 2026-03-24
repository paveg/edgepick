import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { models } from "./models.ts";

export const skiSpecs = sqliteTable("ski_specs", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .unique()
    .references(() => models.id),
  rockerType: text("rocker_type"),
  tailType: text("tail_type"),
  coreMaterial: text("core_material"),
  baseMaterial: text("base_material"),
  sidewall: text("sidewall"),
  mountPointCm: real("mount_point_cm"),
});
