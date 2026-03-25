import { Router, type IRouter } from "express";
import { db, shipsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

async function getOrCreateShip(code: string) {
  const rows = await db.select().from(shipsTable).where(eq(shipsTable.code, code));
  if (rows.length > 0) return rows[0];

  const inserted = await db
    .insert(shipsTable)
    .values({
      code,
      name: "Meu Navio",
      maxHull: 100,
      currentHull: 100,
      treasury: 0,
      items: [],
      updatedAt: new Date(),
    })
    .returning();
  return inserted[0];
}

router.get("/ship/:code", async (req, res) => {
  try {
    const { code } = req.params;
    if (!code || code.length < 2) {
      res.status(400).json({ error: "Invalid ship code" });
      return;
    }
    const ship = await getOrCreateShip(code.toUpperCase());
    res.json(ship);
  } catch (err) {
    req.log.error({ err }, "Failed to get ship");
    res.status(500).json({ error: "Internal server error" });
  }
});

const shipUpdateSchema = z.object({
  name: z.string(),
  maxHull: z.number().int().min(1),
  currentHull: z.number().int().min(0),
  treasury: z.number().int().min(0),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
});

router.put("/ship/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const parsed = shipUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid ship data" });
      return;
    }

    const updated = await db
      .update(shipsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(shipsTable.code, code.toUpperCase()))
      .returning();

    if (updated.length === 0) {
      res.status(404).json({ error: "Ship not found" });
      return;
    }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update ship");
    res.status(500).json({ error: "Internal server error" });
  }
});

const addItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().min(1),
});

router.post("/ship/:code/items", async (req, res) => {
  try {
    const { code } = req.params;
    const parsed = addItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    const ship = await getOrCreateShip(code.toUpperCase());
    const currentItems = Array.isArray(ship.items) ? (ship.items as { id: string; name: string; quantity: number }[]) : [];
    const newItem = { id: randomUUID(), name: parsed.data.name, quantity: parsed.data.quantity };
    const updatedItems = [...currentItems, newItem];

    const updated = await db
      .update(shipsTable)
      .set({ items: updatedItems, updatedAt: new Date() })
      .where(eq(shipsTable.code, code.toUpperCase()))
      .returning();

    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to add ship item");
    res.status(500).json({ error: "Internal server error" });
  }
});

const buyForShipSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0),
});

router.post("/ship/:code/buy", async (req, res) => {
  try {
    const { code } = req.params;
    const parsed = buyForShipSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid buy data" });
      return;
    }

    const ship = await getOrCreateShip(code.toUpperCase());
    const totalCost = parsed.data.price * parsed.data.quantity;

    if (ship.treasury < totalCost) {
      res.status(400).json({ error: "Tesouro insuficiente" });
      return;
    }

    const currentItems = Array.isArray(ship.items) ? (ship.items as { id: string; name: string; quantity: number }[]) : [];
    const newItem = { id: randomUUID(), name: parsed.data.name, quantity: parsed.data.quantity };

    const updated = await db
      .update(shipsTable)
      .set({
        items: [...currentItems, newItem],
        treasury: ship.treasury - totalCost,
        updatedAt: new Date(),
      })
      .where(eq(shipsTable.code, code.toUpperCase()))
      .returning();

    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to buy for ship");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ship/:code/items/:itemId", async (req, res) => {
  try {
    const { code, itemId } = req.params;

    const ship = await getOrCreateShip(code.toUpperCase());
    const currentItems = Array.isArray(ship.items) ? (ship.items as { id: string; name: string; quantity: number }[]) : [];
    const updatedItems = currentItems.filter((item) => item.id !== itemId);

    const updated = await db
      .update(shipsTable)
      .set({ items: updatedItems, updatedAt: new Date() })
      .where(eq(shipsTable.code, code.toUpperCase()))
      .returning();

    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to remove ship item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
