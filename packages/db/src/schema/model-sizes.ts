import { integer, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { models } from "./models.ts";

export const modelSizes = sqliteTable(
  "model_sizes",
  {
    id: text("id").primaryKey(),
    modelId: text("model_id")
      .notNull()
      .references(() => models.id),
    lengthCm: real("length_cm").notNull(),
    waistWidthMm: real("waist_width_mm"),
    noseWidthMm: real("nose_width_mm"),
    tailWidthMm: real("tail_width_mm"),
    sidecutRadiusM: real("sidecut_radius_m"),
    effectiveEdgeMm: real("effective_edge_mm"),
    weightG: integer("weight_g"),
    riderWeightMinKg: integer("rider_weight_min_kg"),
    riderWeightMaxKg: integer("rider_weight_max_kg"),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (table) => [unique().on(table.modelId, table.lengthCm)],
);
