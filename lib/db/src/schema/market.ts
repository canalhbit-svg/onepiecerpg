import { pgTable, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customMarketItemsTable = pgTable("custom_market_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull().default("Raros"),
  type: text("type").notNull().default("weapon"),
  price: integer("price").notNull().default(0),
  damage: text("damage"),
  attribute: text("attribute"),
  effect: text("effect"),
  rarity: text("rarity").notNull().default("comum"),
  icon: text("icon").notNull().default("📦"),
  createdBy: varchar("created_by"),
  createdByName: text("created_by_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomMarketItemSchema = createInsertSchema(customMarketItemsTable, {
  name: z.string().min(1).max(80),
  category: z.enum(["Armas", "Vestuário", "Navegação", "Suprimentos", "Raros"]),
  type: z.enum(["weapon", "consumable", "tool"]),
  price: z.number().int().min(0).max(10_000_000),
  damage: z.string().max(40).optional().nullable(),
  attribute: z.string().max(20).optional().nullable(),
  effect: z.string().max(400).optional().nullable(),
  rarity: z.enum(["comum", "raro", "epico", "lendario"]),
  icon: z.string().max(8),
}).omit({ id: true, createdAt: true, createdBy: true, createdByName: true });

export type InsertCustomMarketItem = z.infer<typeof insertCustomMarketItemSchema>;
export type CustomMarketItem = typeof customMarketItemsTable.$inferSelect;
