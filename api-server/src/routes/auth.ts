import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import {
  LoginBody,
  SignupBody,
  ForgotPasswordBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(password + salt).digest("hex");
}

function generateToken(userId: number): string {
  return Buffer.from(`${userId}:${randomBytes(32).toString("hex")}`).toString("base64");
}

router.post("/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .limit(1);

    if (users.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const user = users[0];
    const [salt, storedHash] = user.passwordHash.split(":");
    const hash = hashPassword(body.password, salt);

    if (hash !== storedHash) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(400).json({ message: "Invalid request" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const body = SignupBody.parse(req.body);
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .limit(1);

    if (existing.length > 0) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${hashPassword(body.password, salt)}`;

    const [user] = await db
      .insert(usersTable)
      .values({ name: body.name, email: body.email, passwordHash })
      .returning();

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    req.log.error({ err }, "Signup failed");
    res.status(400).json({ message: "Invalid request" });
  }
});

router.post("/forgot-password", async (_req, res) => {
  try {
    ForgotPasswordBody.parse(_req.body);
    res.json({ message: "If an account exists, a reset link has been sent." });
  } catch {
    res.status(400).json({ message: "Invalid request" });
  }
});

export default router;
