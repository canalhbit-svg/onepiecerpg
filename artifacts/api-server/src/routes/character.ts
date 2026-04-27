import { Router, type IRouter } from "express";
import { db, charactersTable, insertCharacterSchema } from "@workspace/db";
import { eq, isNull } from "drizzle-orm";

const router: IRouter = Router();

router.get("/character", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const userId = req.user.id;
    const rows = await db
      .select()
      .from(charactersTable)
      .where(eq(charactersTable.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      // Migration: claim the legacy single-character row (no userId) for the first user that connects.
      const orphan = await db
        .select()
        .from(charactersTable)
        .where(isNull(charactersTable.userId))
        .limit(1);
      if (orphan.length > 0) {
        const claimed = await db
          .update(charactersTable)
          .set({ userId, updatedAt: new Date() })
          .where(eq(charactersTable.id, orphan[0].id))
          .returning();
        res.json(claimed[0]);
        return;
      }
      res.status(404).json({ error: "No character found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get character");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/character", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const parsed = insertCharacterSchema.safeParse(req.body);
    if (!parsed.success) {
      req.log.warn({ issues: parsed.error.issues }, "Invalid character data");
      res.status(400).json({ error: "Invalid character data" });
      return;
    }

    const userId = req.user.id;
    const rows = await db
      .select({ id: charactersTable.id })
      .from(charactersTable)
      .where(eq(charactersTable.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      const inserted = await db
        .insert(charactersTable)
        .values({ ...parsed.data, userId, updatedAt: new Date() })
        .returning();
      res.json(inserted[0]);
    } else {
      const updated = await db
        .update(charactersTable)
        .set({ ...parsed.data, userId, updatedAt: new Date() })
        .where(eq(charactersTable.id, rows[0].id))
        .returning();
      res.json(updated[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to save character");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
