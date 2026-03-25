import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shipsTable = pgTable("ships", {
  code: text("code").primaryKey(),
  name: text("name").notNull().default(""),
  maxHull: integer("max_hull").notNull().default(100),
  currentHull: integer("current_hull").notNull().default(100),
  treasury: integer("treasury").notNull().default(0),
  items: jsonb("items").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const shipItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().min(1),
});

export const insertShipSchema = createInsertSchema(shipsTable, {
  items: z.array(shipItemSchema),
}).omit({ updatedAt: true });

export type InsertShip = z.infer<typeof insertShipSchema>;
export type Ship = typeof shipsTable.$inferSelect;
