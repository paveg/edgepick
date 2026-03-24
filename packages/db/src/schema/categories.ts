import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    sport: text("sport").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
  },
  (table) => [unique().on(table.sport, table.slug)],
);
