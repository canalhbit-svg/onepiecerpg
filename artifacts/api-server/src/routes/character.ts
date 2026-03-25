import { Router, type IRouter } from "express";
import { db, charactersTable, insertCharacterSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/character", async (req, res) => {
  try {
    const rows = await db.select().from(charactersTable).limit(1);
    if (rows.length === 0) {
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
  try {
    const parsed = insertCharacterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid character data" });
      return;
    }

    const rows = await db.select({ id: charactersTable.id }).from(charactersTable).limit(1);

    if (rows.length === 0) {
      const inserted = await db
        .insert(charactersTable)
        .values({ ...parsed.data, updatedAt: new Date() })
        .returning();
      res.json(inserted[0]);
    } else {
      const updated = await db
        .update(charactersTable)
        .set({ ...parsed.data, updatedAt: new Date() })
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
