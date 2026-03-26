import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const charactersTable = pgTable("characters", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull().default(""),
  pirateName: text("pirate_name").notNull().default(""),
  origin: text("origin").notNull().default(""),
  specialty: text("specialty").notNull().default(""),
  vigor: jsonb("vigor").notNull().default({ value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } }),
  agility: jsonb("agility").notNull().default({ value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } }),
  cunning: jsonb("cunning").notNull().default({ value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } }),
  charisma: jsonb("charisma").notNull().default({ value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } }),
  spirit: jsonb("spirit").notNull().default({ value: 0, dicePool: { d4: 0, d6: 0, d10: 0, d20: 0 } }),
  maxHp: integer("max_hp").notNull().default(10),
  currentHp: integer("current_hp").notNull().default(10),
  berries: integer("berries").notNull().default(0),
  xpTotal: integer("xp_total").notNull().default(0),
  logbook: text("logbook").notNull().default(""),
  xpLog: jsonb("xp_log").notNull().default([]),
  inventory: jsonb("inventory").notNull().default([]),
  photo: text("photo"),
  devilFruit: jsonb("devil_fruit"),
  haki: jsonb("haki"),
  currentStamina: integer("current_stamina").notNull().default(0),
  skills: jsonb("skills").notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const dicepoolSchema = z.object({
  d4: z.number().int().min(0),
  d6: z.number().int().min(0),
  d10: z.number().int().min(0),
  d20: z.number().int().min(0),
});

const attributeSchema = z.object({
  value: z.number().int(),
  dicePool: dicepoolSchema,
});

const xpLogEntrySchema = z.object({
  id: z.string(),
  attribute: z.string(),
  diceType: z.string(),
  cost: z.number().int(),
  timestamp: z.string(),
});

const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["weapon", "consumable", "tool"]),
  damage: z.string().optional(),
  attribute: z.string().optional(),
  effect: z.string().optional(),
  quantity: z.number().int().min(1),
  equipped: z.boolean(),
  rarity: z.enum(["comum", "raro", "epico", "lendario"]).optional(),
  masterGiven: z.boolean().optional(),
});

const devilFruitMoveSchema = z.object({
  name: z.string(),
  damage: z.string().optional(),
  description: z.string().optional(),
});

const devilFruitSchema = z.object({
  active: z.boolean(),
  fruitId: z.string().optional(),
  type: z.enum(["Paramecia", "Zoan", "Logia"]).optional(),
  name: z.string().optional(),
  mastery: z.number().int().min(0).max(100).optional(),
  moves: z.array(devilFruitMoveSchema).max(3).optional(),
});

const hakiDataSchema = z.object({
  armamentoUnlocked: z.boolean(),
  observacaoUnlocked: z.boolean(),
  haoshokuUnlocked: z.boolean(),
  armamentoActive: z.boolean(),
  observacaoActive: z.boolean(),
  haoshokuActive: z.boolean(),
});

export const insertCharacterSchema = createInsertSchema(charactersTable, {
  vigor: attributeSchema,
  agility: attributeSchema,
  cunning: attributeSchema,
  charisma: attributeSchema,
  spirit: attributeSchema,
  xpLog: z.array(xpLogEntrySchema),
  inventory: z.array(inventoryItemSchema),
  devilFruit: devilFruitSchema.optional().nullable(),
  haki: hakiDataSchema.optional().nullable(),
  skills: z.array(z.string()),
}).omit({ id: true, updatedAt: true });

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof charactersTable.$inferSelect;
