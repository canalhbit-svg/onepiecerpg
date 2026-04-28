import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import {
  db,
  customMarketItemsTable,
  insertCustomMarketItemSchema,
} from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { isMaster } from "../lib/roles";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/market/custom-items", requireAuth, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(customMarketItemsTable)
      .orderBy(desc(customMarketItemsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list custom market items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/market/custom-items", requireAuth, async (req, res) => {
  try {
    const parsed = insertCustomMarketItemSchema.safeParse(req.body);
    if (!parsed.success) {
      req.log.warn({ issues: parsed.error.issues }, "Invalid custom market item");
      res.status(400).json({ error: "Invalid item data" });
      return;
    }

    const user = req.user;
    const createdByName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.email ||
      "Pirata";

    const [inserted] = await db
      .insert(customMarketItemsTable)
      .values({
        ...parsed.data,
        createdBy: user.id,
        createdByName,
      })
      .returning();
    res.json(inserted);
  } catch (err) {
    req.log.error({ err }, "Failed to create custom market item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/market/custom-items/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db
      .select()
      .from(customMarketItemsTable)
      .where(eq(customMarketItemsTable.id, id))
      .limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    const item = rows[0];
    const user = req.user;
    if (!isMaster(user.email) && item.createdBy !== user.id) {
      res.status(403).json({ error: "Only the creator or the master can delete this item" });
      return;
    }
    await db.delete(customMarketItemsTable).where(eq(customMarketItemsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete custom market item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
