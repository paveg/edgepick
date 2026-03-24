import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { models } from "./models.ts";

export const modelImages = sqliteTable("model_images", {
  id: text("id").primaryKey(),
  modelId: text("model_id")
    .notNull()
    .references(() => models.id),
  url: text("url").notNull(),
  altText: text("alt_text"),
  imageType: text("image_type").notNull().default("product"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});
