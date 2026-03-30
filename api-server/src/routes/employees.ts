import { Router, type IRouter } from "express";
import { db, employeesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateEmployeeBody,
  UpdateEmployeeBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const employees = await db.select().from(employeesTable).orderBy(employeesTable.createdAt);
    res.json({ employees, total: employees.length });
  } catch (err) {
    req.log.error({ err }, "Failed to list employees");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateEmployeeBody.parse(req.body);
    const [employee] = await db.insert(employeesTable).values({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      role: body.role,
      isActive: true,
    }).returning();
    res.status(201).json({ employee });
  } catch (err: unknown) {
    req.log.error({ err }, "Failed to create employee");
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const employees = await db.select().from(employeesTable).where(eq(employeesTable.id, id)).limit(1);
    if (employees.length === 0) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json({ employee: employees[0] });
  } catch (err) {
    req.log.error({ err }, "Failed to get employee");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const body = UpdateEmployeeBody.parse(req.body);
    const updates: Partial<typeof employeesTable.$inferInsert> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone ?? null;
    if (body.role !== undefined) updates.role = body.role;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const [employee] = await db
      .update(employeesTable)
      .set(updates)
      .where(eq(employeesTable.id, id))
      .returning();

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json({ employee });
  } catch (err) {
    req.log.error({ err }, "Failed to update employee");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [deleted] = await db.delete(employeesTable).where(eq(employeesTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.json({ message: "Employee deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete employee");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
