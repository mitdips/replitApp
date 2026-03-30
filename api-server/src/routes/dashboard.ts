import { Router, type IRouter } from "express";
import { db, employeesTable } from "@workspace/db";
import { eq, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  try {
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(employeesTable);

    const [{ active }] = await db
      .select({ active: sql<number>`count(*)::int` })
      .from(employeesTable)
      .where(eq(employeesTable.isActive, true));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const [{ recent }] = await db
      .select({ recent: sql<number>`count(*)::int` })
      .from(employeesTable)
      .where(gte(employeesTable.createdAt, sevenDaysAgo));

    res.json({
      totalEmployees: total,
      activeEmployees: active,
      recentlyAdded: recent,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
