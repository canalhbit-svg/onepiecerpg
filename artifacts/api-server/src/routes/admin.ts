import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, charactersTable, usersTable, insertCharacterSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { isMaster, getRole } from "../lib/roles";

const router: IRouter = Router();

function requireMaster(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!isMaster(req.user.email)) {
    res.status(403).json({ error: "Forbidden — master only" });
    return;
  }
  next();
}

router.get("/admin/users", requireMaster, async (req, res) => {
  try {
    const users = await db.select().from(usersTable);
    const characters = await db.select().from(charactersTable);

    const charByUser = new Map<string, typeof characters[number]>();
    for (const c of characters) {
      if (c.userId) charByUser.set(c.userId, c);
    }

    const rows = users.map((u) => {
      const c = charByUser.get(u.id);
      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        profileImageUrl: u.profileImageUrl,
        role: getRole(u.email),
        pirateName: c?.pirateName ?? null,
        shipCode: null,
        xpTotal: c?.xpTotal ?? null,
        bounty: c?.bounty ?? null,
        hasCharacter: !!c,
      };
    });

    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/character/:userId", requireMaster, async (req, res) => {
  try {
    const userId = req.params.userId;
    const rows = await db
      .select()
      .from(charactersTable)
      .where(eq(charactersTable.userId, userId))
      .limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "No character for that user" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get user character");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/character/:userId", requireMaster, async (req, res) => {
  try {
    const userId = req.params.userId;
    const parsed = insertCharacterSchema.safeParse(req.body);
    if (!parsed.success) {
      req.log.warn({ issues: parsed.error.issues }, "Invalid character data");
      res.status(400).json({ error: "Invalid character data" });
      return;
    }

    const existing = await db
      .select({ id: charactersTable.id })
      .from(charactersTable)
      .where(eq(charactersTable.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      const inserted = await db
        .insert(charactersTable)
        .values({ ...parsed.data, userId, updatedAt: new Date() })
        .returning();
      res.json(inserted[0]);
    } else {
      const updated = await db
        .update(charactersTable)
        .set({ ...parsed.data, userId, updatedAt: new Date() })
        .where(eq(charactersTable.id, existing[0].id))
        .returning();
      res.json(updated[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to save user character");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
